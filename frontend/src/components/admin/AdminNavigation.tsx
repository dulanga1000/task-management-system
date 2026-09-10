"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Kanban,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Shield,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function AdminNavigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
      label: "Tasks",
      href: "/admin/tasks",
      icon: CheckSquare,
      active: pathname === "/admin/tasks",
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
      active: pathname === "/admin/users",
    },
    {
      label: "Kanban Board",
      href: "/dashboard",
      icon: Kanban,
      active: pathname === "/dashboard",
    },
    {
      label: "My Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="group flex items-center gap-2.5 transition-transform active:scale-95"
            aria-label="Admin Home"
          >
            <img
              src="/logo.png"
              alt="TaskFlow Logo"
              className="h-8 w-8 rounded-lg object-contain shadow-xs"
            />
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                TaskFlow
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                <Shield className="h-3 w-3" />
                Admin
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    item.active
                      ? "bg-blue-50 text-blue-700 shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Right Controls: Profile & Sign out */}
        <div className="hidden lg:flex items-center gap-3">
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50/80 py-1 pl-1.5 pr-3 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
              aria-expanded={userMenuOpen}
              aria-label="User menu"
            >
              {user?.profilePicture?.url ? (
                <img
                  src={user.profilePicture.url}
                  alt={user.firstName}
                  className="h-7 w-7 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs shrink-0">
                  {user?.firstName?.charAt(0).toUpperCase() || "A"}
                </div>
              )}
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold text-slate-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-slate-400">Admin</p>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in duration-100">
                <div className="flex items-center gap-2.5 border-b border-slate-100 px-3 py-2.5">
                  {user?.profilePicture?.url ? (
                    <img
                      src={user.profilePicture.url}
                      alt={user.firstName}
                      className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                      {user?.firstName?.charAt(0).toUpperCase() || "A"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="mt-1 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span>My Profile & Settings</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Kanban className="h-3.5 w-3.5 text-slate-500" />
                    <span>Switch to Kanban Board</span>
                  </Link>

                  <div className="border-t border-slate-100 my-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden"
            title="Profile"
          >
            {user?.profilePicture?.url ? (
              <img
                src={user.profilePicture.url}
                alt={user.firstName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {user?.firstName?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Panel */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 space-y-1 lg:hidden shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Mobile User Summary */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2 px-2">
            <div className="flex items-center gap-2.5">
              {user?.profilePicture?.url ? (
                <img
                  src={user.profilePicture.url}
                  alt={user.firstName}
                  className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                  {user?.firstName?.charAt(0).toUpperCase() || "A"}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate max-w-[180px]">{user?.email}</p>
              </div>
            </div>
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  item.active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="border-t border-slate-100 pt-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
