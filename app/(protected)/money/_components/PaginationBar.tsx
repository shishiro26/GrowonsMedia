import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
};

const PaginationBar = ({ currentPage, totalPages }: PaginationBarProps) => {
  const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 10));
  const minPage = Math.max(1, Math.min(currentPage - 5, maxPage - 9));

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={"?page=" + (currentPage - 1)} />
          </PaginationItem>
        )}
        {Array.from({ length: maxPage - minPage + 1 }, (_, index) => {
          const page = minPage + index;
          return (
            <PaginationLink href={"?page=" + page} key={page}>
              {page}
            </PaginationLink>
          );
        })}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={"?page=" + (currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBar;
