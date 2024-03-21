import React from "react";
import OrderForm from "../../_components/order-form";
import { db } from "@/lib/db";
import TopBar from "../../_components/Topbar";
import ProductOrderTable from "../../_components/product-order-table";

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
    <>
      <div className="hidden md:block">
        <TopBar title="Add order" />
      </div>
      <section>
        <div className="m-3">
          <OrderForm
            id={params.id.toString()}
            products={products}
            role={user?.role}
            minProduct={prouser?.minProduct}
            maxProduct={prouser?.maxProduct}
          >
            <ProductOrderTable />
          </OrderForm>
        </div>
      </section>
    </>
  );
};

export default page;
