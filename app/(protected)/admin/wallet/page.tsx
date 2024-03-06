import { auth } from "@/auth";
import { formatPrice } from "@/components/shared/formatPrice";
import { Button } from "@/components/ui/button";
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
import Image from "next/image";
import FormInvoice from "../_components/form-invoice";
import { CopyIcon } from "@radix-ui/react-icons";
import ImageDialog from "@/components/shared/Image-dialog";

export const generateMetadata = () => {
  return {
    title: "Admin Wallet | GrowonsMedia",
    description: "Admin Wallet",
  };
};

const AdminWallet = async () => {
  const invoices = await db.money.findMany({
    where: { status: "PENDING" },
  });
  const session = await auth();
  return (
    <Table className="mt-2">
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
              <div>{invoice.transactionId}</div>
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
    </Table>
  );
};

export default AdminWallet;
