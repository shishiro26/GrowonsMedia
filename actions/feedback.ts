"use server";
import { db } from "@/lib/db";
import { FeedbackSchema, ReplySchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const addFeedback = async (values: z.infer<typeof FeedbackSchema>) => {
  const validatedFields = FeedbackSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { orderId, feedback } = validatedFields.data;

  try {
    await db.feedback.create({
      data: {
        orderId: orderId,
        feedback: feedback,
        userId: values.userId,
      },
    });
    return { success: "Feedback added " };
  } catch (error) {
    return { error: "An error occurred!" };
  }
};

export const addReply = async (values: z.infer<typeof ReplySchema>) => {
  const validatedFields = ReplySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { orderId, reply } = validatedFields.data;

  try {
    await db.feedback.update({
      where: {
        id: orderId,
      },
      data: {
        reply: reply,
        replyStatus: true,
      },
    });
  } catch (err) {
    return { error: "An error occurred!" };
  }

  revalidatePath("/admin/product/product-feedback");

  return { success: "Reply added!" };
};
