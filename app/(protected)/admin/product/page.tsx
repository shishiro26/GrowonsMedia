import React from "react";
import ProductForm from "../_components/product-form";
import { auth } from "@/auth";
import TopBar from "../../_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "Add Product | GrowonsMedia",
    description: "Add Product",
  };
};

const page = async () => {
  const session = await auth();
  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Add Product" />
      </nav>
      <section>
        <div className="m-1">
          <ProductForm userId={session?.user.id || ""} />
        </div>
      </section>
    </>
  );
};

export default page;
