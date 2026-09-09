"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types/pagination";

interface PaginationProps {
  pagination: PaginationMeta | null | undefined;
  itemCount?: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  className?: string;
  showPageSizeSelector?: boolean;
}

export default function Pagination({
  pagination,
  itemCount,
  onPageChange,
  onLimitChange,
  className = "",
  showPageSizeSelector = true,
}: PaginationProps) {
  // If no pagination, or 0 items in pagination, or 0 items currently displayed, don't show pagination summary
  if (!pagination || pagination.totalItems === 0 || itemCount === 0) {
    return null;
  }

  const { page, limit, totalItems, totalPages, hasNextPage, hasPreviousPage } =
    pagination;

  // Actual count of items on the current page
  const currentCount = itemCount !== undefined ? itemCount : Math.min(limit, totalItems);

  if (totalPages <= 1) {
    return (
      <div
        className={`flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white text-xs text-gray-500 font-medium ${className}`}
      >
        <span>
          Showing <span className="font-bold text-gray-800">1</span> to{" "}
          <span className="font-bold text-gray-800">{currentCount}</span> of{" "}
          <span className="font-bold text-gray-800">{totalItems}</span> results
        </span>
      </div>
    );
  }

  const startItem = Math.min((page - 1) * limit + 1, totalItems);
  const endItem = Math.min(startItem + currentCount - 1, totalItems);

  // Generate page numbers with smart ellipsis window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        start = 2;
        end = 4;
      } else if (page >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-3.5 border-t border-gray-100 bg-white text-xs ${className}`}
    >
      {/* Showing range details & optional page size */}
      <div className="flex items-center gap-3 text-gray-500 font-medium">
        <span>
          Showing <span className="font-bold text-gray-800">{startItem}</span> to{" "}
          <span className="font-bold text-gray-800">{endItem}</span> of{" "}
          <span className="font-bold text-gray-800">{totalItems}</span> results
        </span>

        {showPageSizeSelector && onLimitChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200">
            <span className="text-gray-400">Rows:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              aria-label="Select number of items per page"
              className="rounded-lg border border-gray-200 bg-gray-50/80 px-2 py-1 text-xs font-semibold text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 self-center sm:self-auto">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage}
          className="flex h-8 items-center gap-1 rounded-lg border border-gray-200 px-2.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-gray-400 font-bold"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === page;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="flex h-8 items-center gap-1 rounded-lg border border-gray-200 px-2.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
