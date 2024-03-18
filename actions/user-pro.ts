"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { ProUserSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";
export const addProUser = async (values: z.infer<typeof ProUserSchema>) => {
  const validatedFields = ProUserSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { userId, amount, minProduct, maxProduct } = validatedFields.data;

  const user = await getUserById(userId);

  if (user?.role === "BLOCKED") {
    return { error: "User is blocked!" };
  }

  if (user?.role === "PRO") {
    return { error: "User is already a PRO!" };
  }

  if (minProduct > maxProduct) {
    return { error: "Min product should be less than max product" };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        role: "PRO",
      },
    });

    await db.proUser.create({
      data: {
        amount_limit: amount,
        minProduct: minProduct,
        maxProduct: maxProduct,
        userId: userId,
        amount: amount,
      },
    });
  } catch (err) {
    console.log(err);
    return { error: "Error while upgrading the user!" };
  }
  revalidatePath("/admin/user");
  return { success: "User upgraded to pro!" };
};

export const removeProUser = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    return { error: "User not found!" };
  }

  if (user.role !== "PRO") {
    return { error: "User is not a PRO!" };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        role: "USER",
      },
    });

    await db.proUser.delete({
      where: {
        userId: userId,
      },
    });
  } catch (err) {
    return { error: "Error while downgrading the user!" };
  }

  revalidatePath("/admin/user");
  return { success: "User downgraded to normal user!" };
};
