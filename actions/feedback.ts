"use server";
import { db } from "@/lib/db";
import { FeedbackSchema, ReplySchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadFilesToLocal = async (formData: any) => {
  const image = formData.get("file");
  return image
    .arrayBuffer()
    .then((data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
      const buffer = Buffer.from(data).toString("base64");
      return buffer;
    });
};

async function uploadFilesToCloudinary(buffer: string) {
  return cloudinary.uploader.upload(
    `data:application/octet-stream;base64,${buffer}`,
    {
      folder: "GrowonsMedia",
      resource_type: "raw",
      type: "authenticated",
    },
    (err) => {
      return { error: err?.message };
    }
  );
}

export const addFeedbackFile = async (formData: FormData) => {
  const file = await uploadFilesToLocal(formData);
  const audio = await uploadFilesToCloudinary(file);

  const orderId = formData.get("orderId")?.toString();
  const userId = formData.get("userId")?.toString();
  const fileName = formData.get("fileName");

  const feedback = await db.feedback.findUnique({
    where: {
      orderId: orderId,
    },
  });

  if (!feedback) {
    try {
      await db.feedback.create({
        data: {
          orderId: orderId ?? "",
          userId: userId,
          public_id: audio.public_id,
          secure_url: audio.secure_url,
          feedback: "",
          fileName: fileName as string,
        },
      });
    } catch (error) {
      return { error: "An error occurred!" };
    }
    revalidatePath(`feedback/reply/${userId}`);
    return { success: "Feedback added!" };
  }

  try {
    await db.feedback.update({
      where: {
        orderId: orderId,
      },
      data: {
        public_id: audio.public_id,
        secure_url: audio.secure_url,
      },
    });
  } catch (err: any) {
    console.log(err);
    return { error: "an error occurred. please try again later" };
  }

  revalidatePath(`feedback/reply/${userId}`);

  return { success: "Feedback added!" };
};

export const addFeedback = async (values: z.infer<typeof FeedbackSchema>) => {
  const validatedFields = FeedbackSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { userId, orderId, feedback } = validatedFields.data;

  const existingFeedback = await db.feedback.findUnique({
    where: {
      orderId: orderId,
    },
  });

  if (existingFeedback) {
    try {
      await db.feedback.update({
        where: {
          orderId: orderId,
        },
        data: {
          feedback: feedback,
        },
      });
      revalidatePath(`feedback/reply/${userId}`);
      return { success: "Feedback added!" };
    } catch (error) {
      return { error: "An error occurred!" };
    }
  }

  try {
    await db.feedback.create({
      data: {
        orderId: orderId,
        feedback: feedback,
        userId: values.userId,
      },
    });
    revalidatePath(`feedback/reply/${userId}`);
    return { success: "Feedback added " };
  } catch (error) {
    console.log(error);
    return { error: "An error occurred!" };
  }
};

export const addReply = async (values: z.infer<typeof ReplySchema>) => {
  const validatedFields = ReplySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { orderId, reply } = validatedFields.data;

  try {
    await db.feedback.update({
      where: {
        orderId: orderId,
      },
      data: {
        reply: reply,
        replyStatus: true,
      },
    });
  } catch (err) {
    console.log(err);
    return { error: "An error occurred!" };
  }

  revalidatePath("/admin/product/product-feedback");

  return { success: "Reply added!" };
};

export const addReplyFile = async (formData: FormData) => {
  const file = await uploadFilesToLocal(formData);
  const audio = await uploadFilesToCloudinary(file);

  const orderId = formData.get("orderId")?.toString();

  try {
    await db.feedback.update({
      where: {
        orderId: orderId,
      },
      data: {
        reply_fileName: formData.get("fileName") as string,
        reply_public_id: audio.public_id,
        reply_secure_url: audio.secure_url,
      },
    });
  } catch (err) {
    console.log(err);
    return { error: "An error occurred!" };
  }
  revalidatePath("/admin/product/product-feedback");
  return { success: "Reply added!" };
};
