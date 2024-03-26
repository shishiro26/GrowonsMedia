import { formatPrice } from "@/components/shared/formatPrice";
import React from "react";

interface Product {
  name: string;
  quantity: number;
  productPrice: number;
}

interface Order {
  id: string;
  orderId: string;
  userId: string;
  products: Product[];
  amount: number;
  reason: string | null;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
}

type ProductProps = {
  orders: Order[];
  productName: string;
};

const ProductSold = ({ orders, productName }: ProductProps) => {
  const quantitySold = orders.reduce((acc, order) => {
    const quantityProduct = order.products.find((product) => {
      return product.name === productName;
    });
    if (quantityProduct) {
      return acc + quantityProduct.productPrice * quantityProduct.quantity;
    }
    return acc;
  }, 0);
  return <span className="font-semibold">{formatPrice(quantitySold)}</span>;
};

export default ProductSold;
