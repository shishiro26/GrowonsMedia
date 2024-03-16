"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const blockUser = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (user.role === "ADMIN") {
      return { error: "Cannot block an admin." };
    }

    if (user.role === "BLOCKED") {
      return { error: "User is already blocked." };
    }

      await db.user.update({
        where: {
          id: id,
        },
        data: {
          role: "BLOCKED",
        },
      });

    revalidatePath("/admin/user");

    return { success: "User blocked successfully" };
  } catch (error) {
    return {
      error: "An error occurred. Please try again later.",
    };
  }
};

export const unblockUser = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (user.role !== "BLOCKED") {
      return { error: "User is not blocked. Cannot perform this action." };
    }

    await db.user.update({
      where: {
        id: id,
      },
      data: {
        role: "USER",
      },
    });

    revalidatePath("/admin/user");

    return { success: "User unblocked successfully" };
  } catch (error) {
    return {
      error: "An error occurred. Please try again later.",
    };
  }
};
