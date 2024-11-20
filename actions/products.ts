"use server";
import { db } from "@/lib/db";
import { EditProductFormSchema, ProductSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const addProduct = async (values: z.infer<typeof ProductSchema>) => {
  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return { error: "Invalid fields!" };
  }
  const {
    userId,
    productName,
    price,
    minProduct,
    maxProduct,
    stock,
    sheetLink,
    sheetName,
    description,
  } = validatedFields.data;

  if (minProduct > maxProduct) {
    return { error: "Minimum quantity must be less than maximum quantity" };
  }

  try {
    const product = await db.product.findUnique({
      where: { productName },
    });

    if (product) {
      return { error: "Product already exists!" };
    }

    await db.product.create({
      data: {
        userId,
        productName,
        description,
        price,
        minProduct: minProduct,
        maxProduct: maxProduct,
        stock: stock,
        sheetLink:sheetLink,
        sheetName:sheetName,
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

export const editProduct = async (
  values: z.infer<typeof EditProductFormSchema>
) => {
  const validatedFields = EditProductFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { productName, price, minProduct, maxProduct, id, stock, description, sheetLink, sheetName } =
    validatedFields.data;

  try {
    if (minProduct !== undefined && minProduct > (maxProduct ?? 0)) {
      return { error: "Minimum quantity must be less than maximum quantity" };
    }

    await db.product.update({
      where: { id },
      data: {
        productName,
        description,
        price,
        stock,
        minProduct,
        maxProduct,
        sheetLink,
        sheetName
      },
    });

    return { success: "Product updated" };
  } catch (error) {
    return { error: "Error updating product" };
  }
};
