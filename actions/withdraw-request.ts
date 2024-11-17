"use server";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { revalidatePath } from "next/cache";

export const RequestWithdrawal = async (formData: FormData) => {
  const userId = formData.get("userId")?.toString() ?? "";
  const user = await getUserById(userId);
  const username = user?.name;

  if (!user) {
    return { error: "User not found" };
  }

  try {
    if (user.role === "BLOCKED") {
      return {
        error:
          "You have been blocked by the admin. Contact admin for more details.",
      };
    }

    const withdrawAmount = formData.get("withdrawAmount")?.toString() ?? "0";
    if (user.totalMoney < parseInt(withdrawAmount, 10)) {
      return { error: "Insufficient funds for withdrawal" };
    }

    await db.withdrawalRequest.create({
      data: {
        accountNumber: formData.get("accountNumber")?.toString() ?? "",
        ifscCode: formData.get("ifscCode")?.toString() ?? "",
        beneficiaryName: formData.get("beneficiaryName")?.toString() ?? "",
        withdrawAmount: withdrawAmount,
        secure_url: "",
        public_id: "",
        transactionId: "",
        reason: formData.get("reason")?.toString() ?? "",
        userId: userId,
        name: username ?? "",
        status: "PENDING",
      },
    });
  } catch (err: any) {
    console.log(err);
    return { error: "An error occurred. Please try again later." };
  }

  revalidatePath("/withdrawals/record");

  return { success: "Withdrawal request submitted!" };
};
