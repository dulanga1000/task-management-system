"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Kanban,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function AdminNavigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Tasks Management",
      href: "/admin/tasks",
      icon: CheckSquare,
      active: pathname === "/admin/tasks",
    },
    {
      label: "User Directory",
      href: "/admin/users",
      icon: Users,
      active: pathname === "/admin/users",
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">
        {/* Brand & Console Title */}
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-gray-900 tracking-tight">
                  Admin Console
                </span>
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 ring-1 ring-inset ring-purple-600/20">
                  SYSTEM ADMIN
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-400">
                Workspace Governance & Task Allocation
              </p>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-gray-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    item.active
                      ? "bg-primary/10 text-primary shadow-xs"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls & User Pill */}
        <div className="flex items-center gap-3">
          {/* Switch to Task Board View */}
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Kanban className="h-3.5 w-3.5 text-primary" />
            <span>Task Board View</span>
          </Link>

          {/* User Profile Link */}
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-gray-50/80 py-1 pl-1.5 pr-3 hover:bg-gray-100 transition-colors"
            title="Manage your profile and password"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-white">
              {user?.firstName?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="text-xs font-medium text-gray-700">
              {user?.firstName} {user?.lastName}
            </span>
          </Link>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200/80 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
            title="Sign out of console"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="flex md:hidden border-t border-gray-100 px-4 py-2 gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
