import React from "react";
import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductRemove from "./product-remove";
import PaginationBar from "../../money/_components/PaginationBar";

const ProductTable = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 3;

  const totalItemCount = await db.product.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Created_At</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No invoices found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.createdAt.toDateString()}</TableCell>
              <TableCell>
                <ProductRemove id={product.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </>
  );
};

export default ProductTable;
