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

const uploadPhotosToLocal = async (formData: any) => {
  const image = formData.get("file");
  return image
    .arrayBuffer()
    .then((data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
      const buffer = Buffer.from(data).toString("base64");
      return buffer;
    });
};

async function uploadPhotosToCloudinary(buffer: string) {
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
  const file = await uploadPhotosToLocal(formData);
  const photos = await uploadPhotosToCloudinary(file);

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
          public_id: photos.public_id,
          secure_url: photos.secure_url,
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
        public_id: photos.public_id,
        secure_url: photos.secure_url,
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

  const existingFeedback = await db.feedback.findUnique({
    where: {
      id: orderId,
    },
  });

  try {
    await db.feedback.update({
      where: {
        id: orderId,
      },
      data: {
        reply: reply,
        replyStatus: true,
      },
    });
  } catch (err) {
    return { error: "An error occurred!" };
  }

  revalidatePath("/admin/product/product-feedback");

  return { success: "Reply added!" };
};
