"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { Plus, LogOut, ChevronDown, User as UserIcon, ArrowLeft, Menu, X, Shield } from "lucide-react";

interface DashboardHeaderProps {
  onCreateTask: () => void;
}

export default function DashboardHeader({
  onCreateTask,
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const firstName = user?.firstName || "there";

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Left side: Brand Logo + Greeting */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
            aria-label="TaskFlow Dashboard"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
              <Image
                src="/logo.png"
                alt="TaskFlow Logo"
                width={28}
                height={28}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900">
                TaskFlow
              </span>
              <span className="text-[11px] font-medium text-slate-400 leading-none">
                Kanban Workspace
              </span>
            </div>
          </Link>

          <div className="hidden lg:block h-5 w-px bg-slate-200 mx-1" />

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
            <span>Welcome back,</span>
            <span className="font-semibold text-slate-900">{firstName}</span>
          </div>
        </div>

        {/* Right side: Actions & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Back to Admin Dashboard with Arrow Icon */}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
              <span>Back to Admin Dashboard</span>
            </Link>
          )}

          {/* Prominently visible My Profile Link */}
          <Link
            href="/profile"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <UserIcon className="h-3.5 w-3.5 text-slate-500" />
            <span>My Profile</span>
          </Link>

          {/* Create Task Button */}
          <button
            type="button"
            onClick={onCreateTask}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Task</span>
          </button>

          {/* User Profile Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 pr-2.5 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
              aria-label="Open account menu"
            >
              {user?.profilePicture?.url ? (
                <img
                  src={user.profilePicture.url}
                  alt={user.firstName}
                  className="h-7 w-7 rounded-lg object-cover border border-slate-200"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700 border border-blue-100">
                  {user?.firstName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Account dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 top-11 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-slate-900/5 transition-all z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5">
                  {user?.profilePicture?.url ? (
                    <img
                      src={user.profilePicture.url}
                      alt={user.firstName}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700 border border-blue-100">
                      {user?.firstName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="truncate text-[11px] text-slate-500 mt-0.5">
                      {user?.email}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200/60">
                      <Shield className="h-3 w-3 text-slate-500" />
                      {user?.role} Account
                    </span>
                  </div>
                </div>

                <div className="mt-1.5 space-y-0.5">
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setShowMenu(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
                      <span>Back to Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    onClick={() => setShowMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                    <span>My Profile & Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-md flex flex-col gap-2 shadow-inner">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 px-1">
            {user?.profilePicture?.url ? (
              <img
                src={user.profilePicture.url}
                alt={user.firstName}
                className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 border border-blue-100">
                {user?.firstName?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-700"
            >
              <ArrowLeft className="h-4 w-4 text-slate-500" />
              <span>Back to Admin Dashboard</span>
            </Link>
          )}

          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-700"
          >
            <UserIcon className="h-4 w-4 text-slate-500" />
            <span>My Profile & Settings</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onCreateTask();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Task</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
}