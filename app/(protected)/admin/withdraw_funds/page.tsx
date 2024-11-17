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
import FormWithdrawal from "../_components/form-withdrawal"; // Component for Accept/Reject functionality
import PaginationBar from "../../money/_components/PaginationBar";
import CopyButton from "@/components/shared/copy-button";
import TopBar from "../../_components/Topbar";
import Search from "@/components/shared/search";

export const generateMetadata = () => {
  return {
    title: "Admin Withdrawal Requests | GrowonsMedia",
    description: "Admin view for withdrawal requests",
  };
};

type AdminWithdrawalParams = {
  searchParams: { page: string };
};

const AdminWithdrawal = async ({ searchParams }: AdminWithdrawalParams) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 7;
  const totalItemCount = (
    await db.withdrawalRequest.findMany({
      where: { status: "PENDING" },
    })
  ).length;
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const withdrawals = await db.withdrawalRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <section className="my-2">
      <nav className="hidden md:block">
        <TopBar title="Admin Withdrawal Requests" />
      </nav>
      <div className="ml-2 mt-4 space-y-4 md:overflow-auto md:max-h-[85vh] w-full md:w-[100%] p-2">
        <Table>
          <TableCaption>A list of pending withdrawal requests.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Account No</TableHead>
              <TableHead>IFSC Code</TableHead>
              <TableHead>Withdraw Amount</TableHead>
              <TableHead>Beneficiary Name</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>
                <Search fileName="withdraw-requests" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex gap-1 items-center">
                    {request.accountNumber}
                    <CopyButton text={request.accountNumber} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 items-center">
                    {request.ifscCode}
                    <CopyButton text={request.ifscCode} />
                  </div>
                </TableCell>
                <TableCell>
                  {formatPrice(Number(request.withdrawAmount))}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 items-center">
                    {request.beneficiaryName}
                    <CopyButton text={request.beneficiaryName} />
                  </div>
                </TableCell>
                <TableCell>{request.createdAt.toDateString()}</TableCell>
                <TableCell>{request.name || "N/A"}</TableCell>
                <TableCell>
                  <FormWithdrawal
                    requestId={request.id}
                    userId={request.userId}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {totalItemCount !== 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-left" colSpan={5}>
                  {formatPrice(
                    withdrawals.reduce(
                      (acc, cur) => acc + Number(cur.withdrawAmount || "0"),
                      0
                    )
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default AdminWithdrawal;
