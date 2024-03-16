import React from "react";
import ProductForm from "../_components/product-form";
import { auth } from "@/auth";

const page = async () => {
  const session = await auth();
  return (
    <section>
      <h1 className="text-3xl mt-4 ml-2 text-center">Product overview</h1>
      <div className="m-1">
        <p className="mb-2">Add Product</p>
        <ProductForm userId={session?.user.id || ""} />
      </div>
    </section>
  );
};

export default page;
