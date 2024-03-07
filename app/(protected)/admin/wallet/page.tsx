import { formatPrice } from "@/components/shared/formatPrice";
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
import FormInvoice from "../_components/form-invoice";
import ImageDialog from "@/components/shared/Image-dialog";
import PaginationBar from "../../money/_components/PaginationBar";
import CopyButton from "@/components/shared/copy-button";

export const generateMetadata = () => {
  return {
    title: "Admin Wallet | GrowonsMedia",
    description: "Admin Wallet",
  };
};

type AdminWalletParams = {
  searchParams: { page: string };
};

const AdminWallet = async ({ searchParams }: AdminWalletParams) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 7;
  const totalItemCount = (
    await db.money.findMany({
      where: { status: "PENDING" },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const invoices = await db.money.findMany({
    where: { status: "PENDING" },
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  return (
    <section className="my-2">
      <Table className="">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Transaction id</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Screenshot</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.userId}>
              <TableCell className="font-medium">{invoice.name}</TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  {invoice.transactionId}
                  <CopyButton text={invoice.transactionId} />
                </div>
              </TableCell>
              <TableCell>{formatPrice(Number(invoice.amount))}</TableCell>
              <TableCell>
                <ImageDialog imageLink={invoice.secure_url} />
              </TableCell>
              <TableCell>
                <FormInvoice id={invoice.id.toString()} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {totalItemCount !== 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-left" colSpan={4}>
                {formatPrice(
                  invoices.reduce((acc, cur) => acc + Number(cur.amount), 0)
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default AdminWallet;
