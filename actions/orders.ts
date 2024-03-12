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

    if (userTotalMoney < price) {
      return { error: "Wallet money is insufficient" };
    }

    await db.order.create({
      data: {
        products: {
          connect: products.map((id) => ({ id })),
        },
      },
    });

    console.log(values);
    return { success: "Order added successfully!" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error adding order" };
  }
};
