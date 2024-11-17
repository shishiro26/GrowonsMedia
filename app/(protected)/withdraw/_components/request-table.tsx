import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import PaginationBar from "./PaginationBar";
import BadgeStatus from "./BadgeStatus";
import ImageDialog from "@/components/shared/Image-dialog";
import { revalidatePath } from "next/cache";
import ReasonDialog from "@/components/shared/ReasonDialog";

type TableProps = {
  searchParams: { page: string };
  userId: string;
};

export async function WithdrawalTable({ userId, searchParams }: TableProps) {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 12;
  const totalItemCount = (
    await db.withdrawalRequest.findMany({
      where: { userId: userId },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const withdrawals = await db.withdrawalRequest.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath(`/withdrawals/record/${userId}`);

  return (
    <section>
      <div className="ml-2 mt-4 space-y-4 md:overflow-auto md:max-h-[75vh] w-full md:w-[100%] p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account No</TableHead>
              <TableHead>IFSC Code</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Withdraw Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>Date Accepted</TableHead>
            </TableRow>
          </TableHeader>
          {totalItemCount === 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No withdrawal requests found
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
          <TableBody>
            {withdrawals.map((withdrawal) => (
              <TableRow key={withdrawal.transactionId}>
                <TableCell>{withdrawal.accountNumber}</TableCell>
                <TableCell>{withdrawal.ifscCode}</TableCell>
                <TableCell>
                  {String(withdrawal.status) === "SUCCESS"
                    ? withdrawal.transactionId
                    : "—"}
                </TableCell>
                <TableCell>{`₹${withdrawal.withdrawAmount}`}</TableCell>
                <TableCell className="cursor-pointer">
                  {String(withdrawal.status) === "FAILED" &&
                  withdrawal.reason ? (
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
                <TableCell>
                  {String(withdrawal.status) === "SUCCESS"
                    ? withdrawal.updatedAt.toDateString()
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {totalItemCount !== 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-left" colSpan={4}>
                  {`₹${withdrawals.reduce(
                    (acc, cur) => acc + parseFloat(cur.withdrawAmount || "0"),
                    0
                  )}`}
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
}
