"use server";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { revalidatePath } from "next/cache";
import { ProUser } from "@prisma/client";
import { tree } from "next/dist/build/templates/app-page";

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
      return buffer;
    });
};

async function uploadPhotosToCloudinary(buffer: string) {
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

export const addProMoney = async (formData: FormData) => {
  const file = await uploadPhotosToLocal(formData);
  const photos = await uploadPhotosToCloudinary(file);

  const user = await getUserById(formData.get("userId")?.toString() ?? "");
  const proUser = await db.proUser.findUnique({
    where: {
      userId: user?.id,
    },
  });
  const username = user?.name;

  if (user?.role === "BLOCKED") {
    return {
      error: "You have been blocked by the admin. contact admin know more",
    };
  }

  const rechargeAmount = formData.get("amount")?.toString();

  if (proUser?.isRecharged === false) {
    if (Number(rechargeAmount) > proUser.amount) {
      return { error: "Amount is greater than the  available amount" };
    }
    if (Number(rechargeAmount) < proUser?.amount) {
      return { error: "Insufficient amount to recharge" };
    }

    await db.money.create({
      data: {
        amount: formData.get("amount")?.toString(),
        secure_url: photos.secure_url,
        public_id: photos.public_id,
        transactionId: formData.get("transactionId")?.toString() ?? "",
        upiid: formData.get("upiid")?.toString() ?? "",
        accountNumber: formData.get("accountNumber")?.toString(),
        userId: formData.get("userId")?.toString(),
        name: username ?? "",
        isProRecharge: true,
      },
    });

    await db.proUser.update({
      where: {
        userId: user?.id,
      },
      data: {
        isRecharged: true,
      },
    });
  } else {
    if (proUser.amount === proUser.amount_limit) {
      return { error: "Amount limit reached" };
    }
    if (proUser.amount - proUser.amount_limit < Number(rechargeAmount)) {
      return { error: "Amount is greater than the available amount" };
    }
    if (proUser.amount - proUser.amount_limit > Number(rechargeAmount)) {
      return { error: "Insufficient amount to recharge" };
    }

    if (proUser.amount_limit > proUser.amount) {
      return { error: "Amount limit is greater than the available amount" };
    }

    if (proUser.amount_limit + Number(rechargeAmount) > proUser.amount) {
      return { error: "Amount limit is greater than the available amount" };
    }

    await db.money.create({
      data: {
        amount: formData.get("amount")?.toString(),
        secure_url: photos.secure_url,
        public_id: photos.public_id,
        transactionId: formData.get("transactionId")?.toString() ?? "",
        upiid: formData.get("upiid")?.toString() ?? "",
        accountNumber: formData.get("accountNumber")?.toString(),
        userId: formData.get("userId")?.toString(),
        name: username ?? "",
        isProRecharge: true,
      },
    });

    await db.proUser.update({
      where: {
        userId: user?.id,
      },
      data: {
        amount: proUser.amount_limit + Number(rechargeAmount),
      },
    });
  }

  revalidatePath("/money/record");

  return { success: "Pro money recharge requested!" };
};
