import React from "react";
import ProductEditForm from "../../../_components/product-edit-form";
import { db } from "@/lib/db";
import TopBar from "@/app/(protected)/_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "Edit Product | GrowonsMedia",
    description: "Edit Product",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  const product = await db.product.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      productName: true,
      description: true,
      price: true,
      minProduct: true,
      maxProduct: true,
      stock: true,
      sheetLink:true,
      sheetName:true,
    },
  });

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Product" />
      </nav>
      <section>
        <div className="m-1">
          <ProductEditForm product={product} />
        </div>
      </section>
    </>
  );
};

export default page;
