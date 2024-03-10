import React from "react";
import ProductForm from "../_components/product-form";
import { db } from "@/lib/db";
import BadgeStatus from "../../money/_components/BadgeStatus";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/components/shared/formatPrice";
import ProductTable from "../_components/product-table";

const page = async () => {
  return (
    <section>
      <h1 className="text-3xl mt-4 ml-2 text-center">Product overview</h1>
      <div className="m-1">
        <p className="mb-2">Add Product</p>
        <ProductForm />
      </div>
      <div className="m-1 mt-3">
        <p className="mb-2">Products</p>
        <ProductTable />
      </div>
    </section>
  );
};

export default page;
