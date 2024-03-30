import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableCell,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import ViewProducts from "./_components/view-products";
import { revalidatePath } from "next/cache";
import PaginationBar from "@/app/(protected)/money/_components/PaginationBar";
import AddReplyPage from "./_components/add-reply-page";
import TopBar from "@/app/(protected)/_components/Topbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const generateMetadata = () => {
  return {
    title: "Feedbacks | Growonsmedia",
    description: "Feedbacks",
  };
};

const Feedbacks = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 7;

  const totalItemCount = (
    await db.feedback.findMany({
      where: {
        replyStatus: false,
      },
      select: {
        id: true,
      },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const feedbacks = await db.feedback.findMany({
    where: {
      replyStatus: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      User: true,
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath("/admin/product/product-feedback");

  return (
    <>
      <nav className="hidden md:block">
        <TopBar title="Feedbacks" />
      </nav>
      <Table>
        <TableCaption>List of your recent Feedbacks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>OrderId</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks?.map((feedback) => {
            return (
              <TableRow key={feedback.id}>
                <TableCell className=" capitalize">
                  {feedback.User?.name}
                </TableCell>
                <TableCell>{feedback.orderId}</TableCell>
                <TableCell>
                  <ViewProducts orderId={feedback.orderId} />
                </TableCell>
                <TableCell>
                  <Button variant={"link"} asChild>
                    <Link
                      href={`/admin/product/product-feedback/reply/${feedback.orderId}`}
                      target="_blank"
                    >
                      Add reply
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>{feedback.createdAt.toDateString()}</TableCell>
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

export default Feedbacks;
