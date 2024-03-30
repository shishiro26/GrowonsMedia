import { formatPrice } from "@/components/shared/formatPrice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const ProductOrderTable = async ({ products }: { products: any[] }) => {
  return (
    <>
      {products?.map((product, index) => {
        return (
          <div
            key={product.id}
            className="p-2 mt-4 border-2 border-gray-300 rounded-lg"
          >
            <div className="text-lg capitalize">{product.name}</div>
            <span className="text-xs capitalize text-gray-500">
              {product.description}
            </span>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock</TableHead>
                    <TableHead>Min</TableHead>
                    <TableHead>Max</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {product.stock === 0 ? (
                        <span className="font-semibold">Out of stock</span>
                      ) : (
                        <span className="font-semibold">available</span>
                      )}
                    </TableCell>
                    <TableCell>{product.minProduct}</TableCell>
                    <TableCell>{product.maxProduct}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProductOrderTable;
