"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { ProUserSchema, editProUserSchema } from "@/schemas";
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

export const editProUser = async (
  values: z.infer<typeof editProUserSchema>
) => {
  const validatedFields = editProUserSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { userId, amount, products } = validatedFields.data;
  const user = await db.proUser.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return { error: "User is not a PRO!" };
  }

  const error: string[] = [];
  const uniqueProducts = products?.reduce((acc: any[], product: any) => {
    if (product.minProduct > product.maxProduct) {
      error.push(
        `Min product cannot be greater than max product for ${product.name}`
      );
      return acc;
    }

    const existingProduct = acc.find((p) => p.name === product.name);
    if (!existingProduct) {
      acc.push({
        name: product.name.toLowerCase(),
        minProduct: product.minProduct,
        maxProduct: product.maxProduct,
        price: product.price,
      });
    }
    return acc;
  }, []);

  const existingProduct = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const productNames = existingProduct.map((product) => product.productName);

  for (const prod of uniqueProducts ?? []) {
    if (!productNames.includes(prod.name)) {
      console.log(productNames);
      error.push(prod.name);
    }
  }

  if (error.length > 0) {
    return { error: `Product ${error.join(", ")} not found!` };
  }

  try {
    await db.proUser.update({
      where: { id: userId },
      data: {
        amount_limit: amount,
        products: uniqueProducts,
      },
    });
  } catch (err) {
    return { error: "Error while updating the user!" };
  }
  revalidatePath("/admin/user");
  return { success: "Pro user updated!" };
};
