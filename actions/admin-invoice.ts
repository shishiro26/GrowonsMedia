"use server";

import { db } from "@/lib/db";
import { RejectInvoiceSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const acceptInvoice = async (invoiceId: string) => {
  try {
    await db.money.update({
      where: { id: invoiceId },
      data: { status: "SUCCESS" },
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
