import React from "react";
import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationBar from "../../money/_components/PaginationBar";
import { revalidatePath } from "next/cache";
import BlockUser from "../_components/block-user";
import BalanceCell from "../_components/Balance-cell";
import ProUser from "../_components/upgrade-to-pro";
import TopBar from "../../_components/Topbar";

const UserTable = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 7;

  const totalItemCount = await db.user.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath("/admin/user");

  return (
    <>
      <nav className="hidden md:block">
        <TopBar title="User Management" />
      </nav>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UserName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Joined on</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No invoices found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className={user.role === "BLOCKED" ? "text-red-500" : ""}
            >
              <TableCell className="capitalize">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <BalanceCell id={user.id} />
              </TableCell>
              <TableCell>{user.createdAt.toDateString()}</TableCell>
              <TableCell>
                <BlockUser id={user.id} role={user.role} />
              </TableCell>
              {user.role !== "BLOCKED" && (
                <TableCell>
                  <ProUser userId={user.id} role={user.role} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </>
  );
};

export default UserTable;
