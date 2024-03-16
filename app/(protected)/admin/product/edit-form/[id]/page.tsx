import React from "react";
import ProductEditForm from "../../../_components/product-edit-form";
import { db } from "@/lib/db";

const page = async ({ params }: { params: { id: string } }) => {
  const product = await db.product.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      productName: true,
      price: true,
      minProduct: true,
      maxProduct: true,
    },
  });

  return (
    <section>
      <h1 className="text-3xl mt-4 ml-2 text-center">Edit Product</h1>
      <div className="m-1">
        <ProductEditForm product={product} />
      </div>
    </section>
  );
};

export default page;
