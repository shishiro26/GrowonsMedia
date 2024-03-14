"use server";
import { getTotalMoney } from "@/data/money";
import { db } from "@/lib/db";
import { OrderSchema } from "@/schemas";
import * as z from "zod";

export const addOrder = async (values: z.infer<typeof OrderSchema>) => {
  const validatedFields = OrderSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { id, price, products } = validatedFields.data;
  try {
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
