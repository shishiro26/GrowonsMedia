import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getTotalMoney = async (userId: string) => {
  const invoices = await db.money.findMany({
    where: { status: "SUCCESS", userId: userId },
  });

  revalidatePath("/");

  return invoices.reduce(
    (acc, invoice) => acc + parseInt(invoice.amount ?? "0"),
    0
  );
};
