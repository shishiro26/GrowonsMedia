"use server";
import { db } from "@/lib/db";
import { FeedbackSchema } from "@/schemas";
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
      },
    });
    return { success: "Feedback added " };
  } catch (error) {
    return { error: "An error occurred!" };
  }
};
