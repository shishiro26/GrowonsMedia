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
import { formatPrice } from "@/components/shared/formatPrice";
import { revalidatePath } from "next/cache";
import TopBar from "@/app/(protected)/_components/Topbar";
import AdminOrderForm from "../_components/admin-order-form";
import PaginationBar from "@/app/(protected)/money/_components/PaginationBar";
import BalanceCell from "../_components/Balance-cell";

export const generateMetadata = () => {
  return {
    title: "Admin Orders  | GrowonsMedia",
    description: "Admin Orders records",
  };
};

const AdminOrders = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 9;

  const totalItemCount = (
    await db.order.findMany({
      where: { status: "PENDING" },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const orders = await db.order.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
    skip: currentPage - 1,
    take: pageSize,
  });

  revalidatePath("/admin/orders");

  return (
    <>
      <nav className="hidden md:block">
        <TopBar title="Order records" />
      </nav>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && <TableCaption>No Orders found</TableCaption>}
        <TableBody>
          {orders.map((order) => {
            const products = order.products;
            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.user?.name}
                </TableCell>
                <TableCell>
                  {Array.isArray(products) &&
                    products.map((product: any, index: number) => (
                      <div key={index}>
                        <span>{product.name}</span>{" "}
                        <span> - Quantity: {product.quantity}</span>
                      </div>
                    ))}
                </TableCell>
                <TableCell>
                  <BalanceCell id={order.userId} />
                </TableCell>
                <TableCell>{formatPrice(order.amount)}</TableCell>
                <TableCell>
                  <AdminOrderForm
                    userId={order.userId}
                    id={order.id}
                    amount={order.amount}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>
              {formatPrice(
                orders?.reduce((acc, order) => acc + order.amount, 0) ?? 0
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </>
  );
};

export default AdminOrders;
