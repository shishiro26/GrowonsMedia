import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import PaginationBar from "../../_components/PaginationBar";
import { toast } from "sonner";
import { formatPrice } from "@/components/shared/formatPrice";

const WalletFlow = async ({
  searchParams,
  params,
}: {
  searchParams: { page: string; id: string };
  params: { id: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 5;
  const totalItemCount = await db.walletFlow.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const walletFlow = await db.walletFlow.findMany({
    where: { userId: params.id },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { createdAt: "desc" },
  });

  if (totalItemCount === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Transaction/Order-ID</TableHead>
            <TableHead>Money</TableHead>
            <TableHead>Date created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No records found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Transaction/Order-id</TableHead>
            <TableHead>Money</TableHead>
            <TableHead>Date created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {walletFlow.map((flow) => {
            return (
              <TableRow key={flow.id}>
                <TableCell>{flow.purpose}</TableCell>
                <TableCell>
                  {flow.purpose === "ADMIN" ? <>-</> : flow.moneyId}
                </TableCell>
                <TableCell>
                  {
                    <>
                      {flow.purpose === "ADMIN" ? (
                        <span>{formatPrice(flow.amount)}</span>
                      ) : (
                        <span>
                          {flow.purpose?.toLowerCase() === "wallet recharge"
                            ? `+${formatPrice(Math.abs(flow.amount))}`
                            : `-${formatPrice(Math.abs(flow.amount))}`}
                        </span>
                      )}
                    </>
                  }
                </TableCell>
                <TableCell>{flow.createdAt.toDateString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </>
  );
};

export default WalletFlow;
