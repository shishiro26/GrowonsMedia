import ViewProducts from "@/app/(protected)/_components/view-products";
import BadgeStatus from "@/app/(protected)/money/_components/BadgeStatus";
import PaginationBar from "@/app/(protected)/money/_components/PaginationBar";
import { formatPrice } from "@/components/shared/formatPrice";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";

const ClientRecords = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 8;

  const totalItemCount = (
    await db.order.findMany({
      where: { userId: params.id },
      orderBy: {
        createdAt: "desc",
      },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const Orders = await db.order.findMany({
    where: { userId: params.id },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <>
      <Table className="my-2">
        {totalItemCount === 0 && (
          <TableCaption>A list of your recent Orders.</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>OrderId</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Created on</TableHead>
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
          {Orders?.map((order, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>
                  <BadgeStatus status={order.status} />
                </TableCell>
                <TableCell>
                  <ViewProducts
                    products={JSON.parse(JSON.stringify(order.products))}
                  />
                </TableCell>
                <TableCell>{formatPrice(order.amount)}</TableCell>
                <TableCell className="flex flex-col">
                  <span>{order.createdAt.toLocaleTimeString()}</span>
                  <span>{order.createdAt.toDateString()}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {totalItemCount !== 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>
                {formatPrice(
                  Orders?.reduce((acc, order) => acc + order.amount, 0) ?? 0
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </>
  );
};

export default ClientRecords;
