import { db } from "@/lib/db";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableCell,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import React from "react";

const ViewProducts = async ({ orderId }: { orderId: string }) => {
  const order = await db.order.findUnique({
    where: {
      orderId: orderId,
    },
    select: {
      products: true,
      updatedAt: true,
      status: true,
    },
  });

  const productsArray = JSON.parse(JSON.stringify(order?.products));

  return (
    <Dialog>
      <DialogTrigger>View Products</DialogTrigger>
      <DialogContent>
        <Table>
          <TableCaption>List of your recent Orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>OrderId</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>UpdatedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsArray.map((product: any, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell>{orderId}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{order?.status}</TableCell>
                  <TableCell>{order?.updatedAt.toDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProducts;
