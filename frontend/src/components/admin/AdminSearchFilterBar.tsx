"use client";

import React from "react";
import { Search, X, Filter } from "lucide-react";
import type { TaskStatus } from "@/types/task";

interface AdminSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter?: string;
  onStatusChange?: (status: string) => void;
  assigneeFilter?: string;
  onAssigneeChange?: (assigneeId: string) => void;
  users?: { id: string; name: string }[];
  placeholder?: string;
  totalResults?: number;
}

const statusOptions: { label: string; value: string }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "DOING" },
  { label: "Done", value: "DONE" },
];

export default function AdminSearchFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  assigneeFilter,
  onAssigneeChange,
  users,
  placeholder = "Search tasks by title, description, or creator...",
  totalResults,
}: AdminSearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-xs">
      {/* Search Input Field */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-9 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Pill Filter */}
        {onStatusChange && statusFilter && (
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50/80 p-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onStatusChange(opt.value)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  statusFilter === opt.value
                    ? "bg-white text-gray-900 shadow-xs ring-1 ring-gray-200"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Assignee Filter Dropdown */}
        {onAssigneeChange && users && (
          <div className="relative">
            <select
              value={assigneeFilter || "ALL"}
              onChange={(e) => onAssigneeChange(e.target.value)}
              className="h-9 rounded-xl border border-gray-200 bg-gray-50/80 px-3 text-xs font-semibold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="ALL">All Assignees</option>
              <option value="UNASSIGNED">Unassigned Only</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Results Counter */}
        {typeof totalResults === "number" && (
          <span className="ml-1 text-xs font-medium text-gray-400">
            {totalResults} {totalResults === 1 ? "result" : "results"}
          </span>
        )}
      </div>
    </div>
  );
}
