import React from "react";
import { Button } from "@/components/ui/button";
import OrderForm from "../../_components/order-form";
import { db } from "@/lib/db";
import TopBar from "../../_components/Topbar";

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
  const prouser = await db.proUser.findUnique({
    where: {
      userId: params.id,
    },
    select: {
      minProduct: true,
      maxProduct: true,
    },
  });

  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      role: true,
    },
  });

  return (
    <section>
      <TopBar />
      <h1 className="text-3xl mt-4 ml-2">Add order</h1>
      <div className="m-3">
        <OrderForm
          id={params.id.toString()}
          products={products}
          role={user?.role}
          minProduct={prouser?.minProduct}
          maxProduct={prouser?.maxProduct}
        />
      </div>
    </section>
  );
};

export default page;
