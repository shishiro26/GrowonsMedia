"use server";
import { MoneySchema } from "@/schemas";
import * as z from "zod";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadPhotosToLocal = async (formData: any) => {
  const image = formData.get("image");
  return image
    .arrayBuffer()
    .then((data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
      const buffer = Buffer.from(data).toString("base64");
      // const name = uuidv4();
      // const ext = image.type.split("/")[1];

      // const tempDir = os.tmpdir();
      // const tempFilePath = path.join(tempDir, `${name}.${ext}`);

      // fs.writeFileSync(tempFilePath, buffer);
      // return { filePath: tempFilePath, fileName: `/${name}.${ext}` };
      return buffer;
    });
};

async function uploadPhotosToCloudinary(buffer: any) {
  return cloudinary.uploader.upload(
    `data:image/png;base64,${buffer}`,
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

export const AddMoney = async (formData: FormData) => {
  const file = await uploadPhotosToLocal(formData);
  const photos = await uploadPhotosToCloudinary(file);

  try {
    await db.money.create({
      data: {
        amount: formData.get("amount")?.toString(),
        secure_url: photos.secure_url,
        public_id: photos.public_id,
        transactionId: formData.get("transactionId")?.toString() ?? "",
        upiid: formData.get("upiid")?.toString() ?? "",
        bankDetails: formData.get("bankDetails")?.toString(),
        userId: formData.get("userId")?.toString(),
      },
    });
  } catch (err: any) {
    return { error: err.message };
  }

  revalidatePath("/money/record");

  return { success: "Money added!" };
};
