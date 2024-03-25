"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { ProUserSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const addProUser = async (values: z.infer<typeof ProUserSchema>) => {
  const validatedFields = ProUserSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields!");
  }

  const { userId, amount, products } = validatedFields.data;

  const user = await getUserById(userId);

  if (!user || user.role === "BLOCKED") {
    return { error: "User has been blocked!" };
  }

  if (user.role === "PRO") {
    return { error: "User is already a PRO!" };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        role: "PRO",
      },
    });

    const uniqueProducts = products.reduce((acc: any[], product: any) => {
      const existingProduct = acc.find((p) => p.name === product.name);
      if (!existingProduct) {
        acc.push({
          name: product.name,
          minProduct: product.minProduct,
          maxProduct: product.maxProduct,
          price: product.price,
        });
      }
      return acc;
    }, []);

    await db.proUser.create({
      data: {
        amount: amount,
        amount_limit: amount,
        products: uniqueProducts,
        userId: userId,
      },
    });

    revalidatePath("/users/" + userId);

    return { success: "upgraded to pro user" };
  } catch (err) {
    console.log(err);
    return { error: "Error while upgrading the user!" };
  }
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
