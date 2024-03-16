import React from "react";
import ProductTable from "../../_components/product-table";

const ProductPage = ({ searchParams }: { searchParams: { page: string } }) => {
  return <ProductTable searchParams={searchParams} />;
};

export default ProductPage;
