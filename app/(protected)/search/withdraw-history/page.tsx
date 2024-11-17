import React from "react";
import { formatPrice } from "@/components/shared/formatPrice";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ImageDialog from "@/components/shared/Image-dialog";
import ReasonDialog from "@/components/shared/ReasonDialog";
import BadgeStatus from "@/app/(protected)/money/_components/BadgeStatus";
import Search from "@/components/shared/search";
import { db } from "@/lib/db";
import SearchPaginationBar from "@/components/shared/search-paginationbar";

const WithdrawHistory = async ({
  searchParams,
}: {
  searchParams: { query: string; page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 7;
  const query = searchParams.query || "";

  const withdrawals = await db.withdrawalRequest.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { transactionId: { contains: query, mode: "insensitive" } },
        { ifscCode: { contains: query, mode: "insensitive" } },
        { accountNumber: { contains: query, mode: "insensitive" } },
      ],
    },

    orderBy: { updatedAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const totalItemCount = await db.withdrawalRequest.count({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { transactionId: { contains: query, mode: "insensitive" } },
        { ifscCode: { contains: query, mode: "insensitive" } },
        { accountNumber: { contains: query, mode: "insensitive" } },
      ],
    },
  });
  const totalPages = Math.ceil(totalItemCount / pageSize);

  if (withdrawals.length === 0) {
    return (
      <Table>
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
        <TableFooter>
          <TableRow>
            <TableCell className="text-center" colSpan={8}>
              No withdrawal requests found
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={8}>
              <Search fileName="withdraw-history" />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  return (
    <section>
      <div className="m-1 p-1 w-[50%]">
        <Search fileName="withdraw-history" />
      </div>
      <div className="ml-2 mt-4 space-y-4 md:overflow-auto md:max-h-[80vh] w-full md:w-[100%] p-2">
        <Table>
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
                <TableCell>
                  {" "}
                  {String(withdrawal.status) === "SUCCESS"
                    ? withdrawal.transactionId
                    : "—"}
                </TableCell>
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
                <TableCell>
                  {String(withdrawal.status) === "SUCCESS"
                    ? withdrawal.updatedAt.toDateString()
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
        </Table>
      </div>
      {totalPages > 1 && (
        <SearchPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={query}
        />
      )}
    </section>
  );
};

export default WithdrawHistory;
