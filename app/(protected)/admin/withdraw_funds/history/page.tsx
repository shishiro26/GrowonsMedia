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
import PaginationBar from "../../../money/_components/PaginationBar";
import TopBar from "../../../_components/Topbar";
import ReasonDialog from "@/components/shared/ReasonDialog";
import BadgeStatus from "@/app/(protected)/money/_components/BadgeStatus";
import Search from "@/components/shared/search";

export const generateMetadata = () => {
  return {
    title: "Admin Withdraw Requests | GrowonsMedia",
    description: "Admin Withdraw Requests",
  };
};

type WithdrawRequestsParams = {
  searchParams: { page: string };
};

const WithdrawRequests = async ({ searchParams }: WithdrawRequestsParams) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 10;
  const totalItemCount = await db.withdrawalRequest.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const withdrawals = await db.withdrawalRequest.findMany({
    orderBy: { updatedAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <section className="my-2">
      <nav className="hidden md:block">
        <TopBar title="Admin Withdraw Requests" />
      </nav>
      <div className="p-1 m-1 w-[50%]">
        <Search fileName="withdraw-history" />
      </div>
      <section className="space-y-4 md:overflow-auto md:max-h-[75vh] w-full md:w-[100%] p-2">
        <Table>
          <TableCaption>A list of recent withdraw requests.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Account No</TableHead>
              <TableHead>IFSC Code</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Withdraw Money</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>Date of Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.map((withdrawal) => (
              <TableRow key={withdrawal.id}>
                <TableCell>{withdrawal.name || "N/A"}</TableCell>
                <TableCell>{withdrawal.accountNumber}</TableCell>
                <TableCell>{withdrawal.ifscCode}</TableCell>
                <TableCell>{withdrawal.transactionId || "N/A"}</TableCell>
                <TableCell>
                  {formatPrice(Number(withdrawal.withdrawAmount))}
                </TableCell>
                <TableCell className="cursor-pointer">
                  {withdrawal.status === "FAILED" && withdrawal.reason ? (
                    <ReasonDialog
                      status={withdrawal.status}
                      reason={withdrawal.reason}
                    />
                  ) : (
                    <BadgeStatus status={withdrawal.status} />
                  )}
                </TableCell>
                <TableCell>
                  {String(withdrawal.status) === "SUCCESS" ? (
                    <ImageDialog imageLink={withdrawal.secure_url || ""} />
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{withdrawal.updatedAt.toDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {totalItemCount !== 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell className="text-left" colSpan={4}>
                  {formatPrice(
                    withdrawals.reduce(
                      (acc, cur) => acc + Number(cur.withdrawAmount),
                      0
                    )
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

export default WithdrawRequests;
