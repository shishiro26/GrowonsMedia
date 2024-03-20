"use server";

import { db } from "@/lib/db";
import { RejectOrderSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { v2 as cloudinary } from "cloudinary";

export const rejectOrder = async (
  values: z.infer<typeof RejectOrderSchema>
) => {
  const validatedFields = RejectOrderSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!!" };
  }

  try {
    await db.order.update({
      where: { id: values.id },
      data: { status: "FAILED", reason: values.reason },
    });

    const user = await db.user.findUnique({
      where: { id: values.userId },
      select: {
        totalMoney: true,
      },
    });

    await db.user.update({
      where: { id: values.userId },
      data: {
        totalMoney: (user?.totalMoney ?? 0) + values.amount,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Error while rejecting the Invoice!" };
  }

  revalidatePath("/admin/orders");
  return { success: "Invoice rejected" };
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function convertFilesToBase64(formData: FormData) {
  const fileEntries = Array.from(formData.entries());
  const files = fileEntries.filter((entry): entry is [string, File] =>
    entry[0].includes("files")
  );

  const base64Promises = files.map(async (fileEntry) => {
    const [fieldName, file] = fileEntry;
    const fileContent = await file.arrayBuffer();
    const base64 = Buffer.from(fileContent).toString("base64");
    return base64;
  });

  return Promise.all(base64Promises);
}

async function uploadFilestoCloudinary(buffer: string[]) {
  const uploadPromises = buffer.map(async (base64) => {
    return cloudinary.uploader.upload(
      `data:application/octet-stream;base64,${base64}`,
      {
        folder: "GrowonsMedia",
        resource_type: "raw",
        type: "authenticated",
      },
      (err) => {
        return { error: err?.message };
      }
    );
  });

  return Promise.all(uploadPromises);
}

export const acceptOrder = async (formData: FormData) => {
  const filesBase64 = await convertFilesToBase64(formData);
  const files = await uploadFilestoCloudinary(filesBase64);
  try {
    await db.order.update({
      where: { id: formData.get("id")?.toString() },
      data: {
        status: "SUCCESS",
        files: files.map((file, index) => ({
          public_id: file.public_id,
          secure_url: file.secure_url,
          fileName: formData.get(`fileName[${index}][fileName]`)?.toString(),
          fileType: formData.get(`fileType[${index}][fileType]`)?.toString(),
        })),
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Error while accepting the order!" };
  }

  revalidatePath("/admin/orders");
  return { success: "Order accepted!" };
};
