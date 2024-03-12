import React from "react";
import { Button } from "@/components/ui/button";
import OrderForm from "../../_components/order-form";
import { db } from "@/lib/db";

export const generateMetadata = () => {
  return {
    title: "Orders | GrowonsMedia",
    description: "Orders page",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <section>
      <h1 className="text-3xl mt-4 ml-2">Add order</h1>
      <div className="m-3">
        <OrderForm id={params.id.toString()} products={products} />
      </div>
    </section>
  );
};

export default page;
