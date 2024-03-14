import React from "react";
import { db } from "@/lib/db";
import FeedbackForm from "../../_components/feedback-form";

export const generateMetadata = () => {
  return {
    title: "Feedback | GrowonsMedia",
    description: "Feedback in the grownonsMedia",
  };
};

const FeedbackPage = async ({ params }: { params: { id: string } }) => {
  const orders = await db.order.findMany({
    where: { userId: params.id },
    select: {
      orderId: true,
    },
  });

  return (
    <section>
      <h1 className="text-3xl mt-4 ml-2">Feedback</h1>
      <div className="m-3">
        <div className="mt-4">
          <FeedbackForm orders={orders} />
        </div>
      </div>
    </section>
  );
};

export default FeedbackPage;
