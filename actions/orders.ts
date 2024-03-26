"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { OrderSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

type ProductError = {
  error: string;
};

export const addOrder = async (values: z.infer<typeof OrderSchema>) => {
  const validatedFields = OrderSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { id, price, products } = validatedFields.data;

  const user = await getUserById(id);

  const subUser = await db.proUser.findUnique({
    where: {
      userId: id,
    },
  });

  const existingProducts = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const orderId = Date.now() + Math.floor(Math.random() * 100000);
  const money = user?.totalMoney;

  if (!user || user.role === "BLOCKED") {
    return { error: "You have been blocked contact admin to know more" };
  }

  const errors: ProductError[] = [];

  const allProducts = products.map((product) => {
    const existingProduct = existingProducts.find(
      (p) => p.productName === product.name
    );
    //@ts-ignore
    const proProduct = subUser?.products?.find(
      (pp: any) => pp.name === product.name
    );

    return {
      name: product.name,
      quantity: product.quantity,
      stock: existingProduct?.stock ?? 0,
      minProduct: proProduct?.minProduct ?? existingProduct?.minProduct ?? 1,
      maxProduct: proProduct?.maxProduct ?? existingProduct?.maxProduct,
      price: proProduct?.price ?? existingProduct?.price,
    };
  });

  allProducts.forEach((product) => {
    if (product.stock === 0) {
      errors.push({
        error: `${product.name} is out of stock`,
      });
      return;
    }

    if (product.quantity > product.stock) {
      errors.push({
        error: `${product.name} is stock not available`,
      });
      return;
    }

    if (user.role === "PRO") {
      if (product.quantity < 1) {
        errors.push({
          error: `${product.name} must be at least 1`,
        });
      }

      if (product.quantity < product.minProduct) {
        errors.push({
          error: `${product.name} must be at least ${product.minProduct} `,
        });
      }

      if (product.maxProduct && product.quantity > product.maxProduct) {
        errors.push({
          error: `${product.name} must be at most ${product.maxProduct}`,
        });
      }
    } else {
      if (product.quantity < 1) {
        errors.push({
          error: `${product.name} must be at least 1 `,
        });
      }

      if (product.quantity > product.stock) {
        errors.push({
          error: `${product.name} must be at most ${product.stock} `,
        });
      }

      if (product.quantity < product.minProduct) {
        errors.push({
          error: `${product.name} must be at least ${product.minProduct} `,
        });
      }

      if (product.maxProduct && product.quantity > product.maxProduct) {
        errors.push({
          error: `${product.name} must be at most ${product.maxProduct} `,
        });
      }
    }
  });

  if (errors.length > 0) {
    const errorMessages = errors.map((err) => err.error).join(", ");
    return { error: errorMessages };
  }

  try {
    await db.order.create({
      data: {
        userId: id,
        orderId: orderId.toString().slice(-10),
        products: allProducts.map((product) => ({
          name: product.name,
          quantity: product.quantity,
          productPrice: product.price,
        })),
        amount: price,
      },
    });

    allProducts.forEach(async (product) => {
      await db.product.update({
        where: { productName: product.name },
        data: { stock: product.stock - product.quantity },
      });
    });

    if (user.totalMoney === price || user.totalMoney > price) {
      await db.user.update({
        where: {
          id,
        },
        data: {
          totalMoney: user.totalMoney - price,
        },
      });
    }

    if (user.totalMoney < price && user.role === "USER") {
      return { error: "You don't have enough money!" };
    }

    if (user.totalMoney < price && user.role === "PRO") {
      if (
        user.totalMoney + (subUser?.amount_limit ?? 0) < price &&
        user.role === "PRO"
      ) {
        return { error: "You have exceeded your limit!" };
      }
    }

    if (user.totalMoney < price && user.role === "PRO") {
      if (
        user.totalMoney + (subUser?.amount_limit ?? 0) > price ||
        user.totalMoney + (subUser?.amount_limit ?? 0) === price
      ) {
        await db.user.update({
          where: {
            id: id,
          },
          data: {
            totalMoney: 0,
          },
        });

        const remainingPrice = price - user.totalMoney;

        await db.proUser.update({
          where: {
            userId: id,
          },
          data: {
            amount_limit: (subUser?.amount_limit ?? 0) - remainingPrice,
          },
        });
      }
    }
  } catch (error) {
    return { error: "Error while adding order!" };
  }

  revalidatePath(`/admin/orders`);
  return { success: "Order added successfully!" };
};
