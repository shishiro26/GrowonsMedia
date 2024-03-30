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

  const proUser = await db.proUser.findUnique({
    where: {
      userId: params.id,
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

  const mergedProducts = products.map((product) => {
    //@ts-ignore
    const proUserProduct = proUser?.products?.find(
      (proUserProduct: any) => proUserProduct.name === product.productName
    );

    return {
      id: product.id,
      name: product.productName,
      stock: product.stock,
      minProduct: proUserProduct?.minProduct ?? product.minProduct,
      maxProduct: proUserProduct?.maxProduct ?? product.maxProduct,
      price: proUserProduct?.price ?? product.price,
      description: product.description,
    };
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
            products={mergedProducts}
            role={user?.role}
          >
            <ProductOrderTable products={mergedProducts} />
          </OrderForm>
        </div>
      </section>
    </>
  );
};

export default page;
