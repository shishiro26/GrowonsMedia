"use server";
import { auth } from "@/auth";
import { getTotalMoney } from "@/data/money";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { OrderSchema } from "@/schemas";
import * as z from "zod";

type ProductError = {
  error: string;
};

export const addOrder = async (values: z.infer<typeof OrderSchema>) => {
  const validatedFields = OrderSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { id, price, products } = validatedFields.data;
  try {
    const user = await getUserById(id);
    if (user?.id !== id) {
      return { error: "You are not authorized to perform this action" };
    }

    if (user.role === "BLOCKED") {
      return {
        error: "You have been blocked by the admin. contact admin know more",
      };
    }

    if (products.length === 0) {
      return { error: "No product added in the order" };
    }

    const existingProducts = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const errors: ProductError[] = [];

    products.forEach((product) => {
      const existingProduct = existingProducts.find(
        (p) => p.productName === product.name
      );
      if (!existingProduct) {
        errors.push({ error: `Product ${product.name} not found` });
      } else {
        if (existingProduct.minProduct > product.quantity) {
          errors.push({ error: `${product.name} Minimum quantity not met` });
        }

        if (existingProduct.maxProduct < product.quantity) {
          errors.push({ error: `${product.name} Maximum quantity exceeded` });
        }
      }
    });

    if (errors.length > 0) {
      const errorMessages = errors.map((err: any) => err.error).join(", ");
      return { error: errorMessages };
    }

    const userTotalMoney = await getTotalMoney(values.id);

    const orderId = Date.now() + Math.floor(Math.random() * 100000);

    if (userTotalMoney < price) {
      return { error: "Wallet money is insufficient" };
    }

    await db.order.create({
      data: {
        userId: id,
        orderId: orderId.toString().slice(-10),
        products: products.map((product) => ({
          name: product.name,
          quantity: product.quantity,
        })),
        amount: price,
      },
    });

    return { success: "Order added successfully!" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error adding order" };
  }
};
