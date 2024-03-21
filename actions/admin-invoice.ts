"use server";
import { db } from "@/lib/db";
import { RejectInvoiceSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

type ValuesProps = {
  userId: string;
  invoiceId: string;
};

export const acceptInvoice = async ({ userId, invoiceId }: ValuesProps) => {
  try {
    await db.money.update({
      where: { id: invoiceId },
      data: { status: "SUCCESS" },
    });

    const invoices = await db.money.findMany({
      where: { userId: userId, status: "SUCCESS" },
      select: {
        amount: true,
      },
    });

    const totalMoney = invoices.reduce((acc, curr) => {
      return acc + Number(curr.amount);
    }, 0);

    await db.user.update({
      where: { id: userId },
      data: {
        totalMoney: totalMoney,
      },
    });
  } catch (error) {
    return { error: "Error while updating the Invoice!" };
  }

  revalidatePath("/admin/wallet");
  return { success: "Invoice accepted" };
};

export const rejectInvoice = async (
  values: z.infer<typeof RejectInvoiceSchema>
) => {
  const validatedFields = RejectInvoiceSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!!" };
  }
  try {
    await db.money.update({
      where: { id: values.id },
      data: { status: "FAILED", reason: values.reason },
    });
  } catch (error) {
    return { error: "Error while rejecting the Invoice!" };
  }
  revalidatePath("/admin/wallet");
  return { success: "Invoice rejected" };
};
