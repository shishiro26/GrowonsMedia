"use server";
import { db } from "@/lib/db";
import { ProductSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const addProduct = async (values: z.infer<typeof ProductSchema>) => {
  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { productName, price } = validatedFields.data;

  try {
    const product = await db.product.findUnique({
      where: { productName },
    });

    if (product) {
      return { error: "Product already exists!" };
    }

    await db.product.create({
      data: {
        productName,
        price,
        createdAt: new Date(),
      },
    });
    revalidatePath("/admin/products");
    return { success: "Product Added" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error adding product" };
  }
};

export const deleteProduct = async ({ id }: { id: string }) => {
  try {
    await db.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    return { success: "Product removed" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error deleting product" };
  }
};

export const getAllProducts = async () => {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (err) {
    return { error: "error while fetching products" };
  }
};
