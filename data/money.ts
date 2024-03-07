import { formatPrice } from "@/components/shared/formatPrice";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getTotalMoney = async (userId: string) => {
  const invoices = await db.money.findMany({
    where: { status: "SUCCESS", userId: userId },
  });

  revalidatePath("/");

  return formatPrice(
    invoices.reduce((acc, invoice) => acc + parseInt(invoice.amount ?? "0"), 0)
  );
};
