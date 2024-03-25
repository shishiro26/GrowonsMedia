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
import ImageDialog from "@/components/shared/Image-dialog";
import CopyButton from "@/components/shared/copy-button";
import TopBar from "@/app/(protected)/_components/Topbar";
import PaginationBar from "@/app/(protected)/money/_components/PaginationBar";
import ProFormInvoice from "../_components/pro-form-invoice";

export const generateMetadata = () => {
  return {
    title: "Pro Wallet | GrowonsMedia",
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
    await db.proMoney.findMany({
      where: { status: "PENDING" },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const invoices = await db.proMoney.findMany({
    where: { status: "PENDING" },
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  return (
    <section className="my-2">
      <nav className="hidden md:block">
        <TopBar title="Pro Wallet" />
      </nav>
      <section className="ml-2 mt-4 space-y-4 md:overflow-auto md:max-h-[85vh] w-full md:w-[100%] p-2">
        <Table>
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
                  <ProFormInvoice
                    id={invoice.id.toString()}
                    userId={invoice.userId}
                  />
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
      </section>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default AdminWallet;
