"use server";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const getTotalMoney = async (userId: string) => {
  const invoices = await db.money.findMany({
    where: { status: "SUCCESS", userId: userId },
  });

  revalidateTag("/");

  return invoices.reduce(
    (acc, invoice) => acc + parseInt(invoice.amount ?? "0"),
    0
  );
};
