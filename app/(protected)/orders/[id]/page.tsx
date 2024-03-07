import React from "react";
import { Button } from "@/components/ui/button";
import OrderForm from "../../_components/order-form";

export const generateMetadata = () => {
  return {
    title: "Orders | GrowonsMedia",
    description: "Orders page",
  };
};

const page = () => {
  return (
    <section>
      <h1 className="text-3xl mt-4 ml-2">Add order</h1>
      <div className="m-3">
        <OrderForm />
        <div className="mt-4">
          <Button>Add Product</Button>
        </div>
      </div>
    </section>
  );
};

export default page;
