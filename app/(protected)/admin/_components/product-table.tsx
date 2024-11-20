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
import { formatPrice } from "@/components/shared/formatPrice";
import { revalidatePath } from "next/cache";
import DescriptionDialog from "./description-dialog";

export const revalidate = 3600;

const ProductTable = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 7;

  const totalItemCount = await db.product.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      userId: false,
      id: true,
      productName: true,
      price: true,
      stock: true,
      minProduct: true,
      maxProduct: true,
      description: true,
      sheetLink: true,
      sheetName: true,
      createdAt: true,
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath("/admin/product");

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Minimum</TableHead>
            <TableHead>Maximum</TableHead>
            <TableHead>Sheet Name</TableHead>
            <TableHead>Google Sheet link</TableHead>
            <TableHead>Created_At</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No products found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="capitalize">
                {product.productName}
              </TableCell>
              <TableCell>
                <DescriptionDialog description={product.description} />
              </TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.minProduct}</TableCell>
              <TableCell>{product.maxProduct}</TableCell>
              <TableCell>{product.sheetName}</TableCell>
              <TableCell>
                <a
                  href={product.sheetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  View Sheet
                </a>
              </TableCell>
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
