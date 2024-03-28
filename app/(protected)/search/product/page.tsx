import { db } from "@/lib/db";
import { Metadata } from "next";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import Search from "@/components/shared/search";
import DateRangeFilter from "../../admin/analytics/_components/date-range-filter";
import { formatPrice } from "@/components/shared/formatPrice";
import SearchPaginationBar from "@/components/shared/search-paginationbar";
import ProductQuantity from "../../admin/analytics/_components/product-quantity";
import ProductSold from "../../admin/analytics/_components/product-sold";
import ProductToExcel from "../../admin/analytics/_components/product-to-excel";

interface SearchPageProps {
  searchParams: { query: string; page: string; startDate: Date; endDate: Date };
}

export function generateMetadata({
  searchParams: { query },
}: SearchPageProps): Metadata {
  return {
    title: `Search: ${query} - Growonsmedia`,
  };
}

export default async function SearchUserPage({
  searchParams: { query, page, startDate, endDate },
}: SearchPageProps) {
  const currentPage = parseInt(page) || 1;
  const pageSize = 9;
  const startedDate = startDate || new Date("1983-01-01");
  const endedDate = endDate || new Date();

  const totalItemCount = (
    await db.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { number: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { id: "desc" },
      include: {
        Order: {
          select: {
            amount: true,
          },
        },
        money: {
          select: {
            amount: true,
          },
        },
      },
    })
  ).length;
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const products = await db.product.findMany({
    where: {
      OR: [{ productName: { contains: query, mode: "insensitive" } }],
      createdAt: {
        lte: endedDate,
        gte: startedDate,
      },
    },
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const orders = await db.order.findMany({
    where: {
      status: "SUCCESS",
      createdAt: {
        lte: endDate,
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  if (products.length === 0) {
    return (
      <section className="m-2">
        <div className="flex item-center justify-between gap-x-2">
          <Search fileName="user" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product name</TableHead>
              <TableHead>Current price</TableHead>
              <TableHead>Total qty sold</TableHead>
              <TableHead>Total revenue collected</TableHead>
              <TableHead>Current inventory</TableHead>
            </TableRow>
          </TableHeader>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No products found
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    );
  }

  return (
    <section className="m-2">
      <div className="flex items-center justify-between gap-x-2 p-1 md:hidden">
        <ProductToExcel
          products={JSON.parse(JSON.stringify(products))}
          orders={JSON.parse(JSON.stringify(orders))}
          fileName={"Products"}
        />
        <Search fileName="product" />
      </div>
      <div className="md:flex md:items-center md:justify-between md:gap-x-2">
        <div className="hidden md:flex items-center justify-between  gap-x-3">
          <ProductToExcel
            products={JSON.parse(JSON.stringify(products))}
            orders={JSON.parse(JSON.stringify(orders))}
            fileName={"Products"}
          />
          <Search fileName="product" />
        </div>
        <div className="mt-1 flex items-center justify-around gap-x-2 w-fit">
          <DateRangeFilter />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product name</TableHead>
            <TableHead>Current price</TableHead>
            <TableHead>Total qty sold</TableHead>
            <TableHead>Total revenue collected</TableHead>
            <TableHead>Current inventory</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>
                {
                  <ProductQuantity
                    orders={JSON.parse(JSON.stringify(orders))}
                    productName={product.productName}
                  />
                }
              </TableCell>
              <TableCell>
                {
                  <ProductSold
                    productName={product.productName}
                    orders={JSON.parse(JSON.stringify(orders))}
                  />
                }
              </TableCell>
              <TableCell>{product.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <SearchPaginationBar
          totalPages={totalPages}
          currentPage={currentPage}
          searchQuery={query}
        />
      )}
    </section>
  );
}
