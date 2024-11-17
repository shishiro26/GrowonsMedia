import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TableCaption,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import { formatPrice } from "@/components/shared/formatPrice";
import CopyButton from "@/components/shared/copy-button";
import Search from "@/components/shared/search";
import SearchPaginationBar from "@/components/shared/search-paginationbar";
import FormWithdrawal from "../../admin/_components/form-withdrawal";

const SearchWithdrawRequests = async ({
  searchParams,
}: {
  searchParams: { query: string; page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 4;
  const query = searchParams.query || "";

  const withdrawals = await db.withdrawalRequest.findMany({
    where: {
      OR: [
        { transactionId: { contains: query, mode: "insensitive" } },
        { User: { name: { contains: query, mode: "insensitive" } } },
      ],
      status: "PENDING",
    },
    include: {
      User: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const totalItemCount = await db.withdrawalRequest.count({
    where: {
      OR: [
        { transactionId: { contains: query, mode: "insensitive" } },
        { User: { name: { contains: query, mode: "insensitive" } } },
      ],
      status: "PENDING",
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
            <TableHead>Withdraw Money</TableHead>
            <TableHead>Date of Request</TableHead>
            <TableHead>
              <Search fileName="withdraw-requests" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableFooter>
          <TableRow>
            <TableCell className="text-center" colSpan={9}>
              No withdrawal requests found
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  return (
    <>
      <Table>
        <TableCaption>A list of recent withdrawal requests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Account No</TableHead>
            <TableHead>IFSC Code</TableHead>
            <TableHead>Withdraw Money</TableHead>
            <TableHead>Date of Request</TableHead>
            <TableHead>
              <Search fileName="withdraw-requests" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((withdrawal) => (
            <TableRow key={withdrawal.id}>
              <TableCell className="font-medium">
                {withdrawal.User?.name || "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  {withdrawal.accountNumber}
                  <CopyButton text={withdrawal.accountNumber} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  {withdrawal.ifscCode}
                  <CopyButton text={withdrawal.ifscCode} />
                </div>
              </TableCell>
              <TableCell>
                {formatPrice(Number(withdrawal.withdrawAmount))}
              </TableCell>
              <TableCell>{withdrawal.createdAt.toDateString()}</TableCell>
              <TableCell>
                <FormWithdrawal
                  requestId={withdrawal.id.toString()}
                  userId={withdrawal.userId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {totalItemCount !== 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-left" colSpan={5}>
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
      {totalPages > 1 && (
        <SearchPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={query}
        />
      )}
    </>
  );
};

export default SearchWithdrawRequests;
