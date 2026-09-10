"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface AdminStatWidgetProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  badge?: {
    text: string;
    variant?: "success" | "warning" | "info" | "default";
  };
  onClick?: () => void;
}

const badgeStyles = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  warning: "bg-amber-50 text-amber-700 border-amber-200/80",
  info: "bg-blue-50 text-blue-700 border-blue-200/80",
  default: "bg-slate-100 text-slate-700 border-slate-200/80",
};

export default function AdminStatWidget({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  badge,
  onClick,
}: AdminStatWidgetProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {value}
            </span>
            {badge && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                  badgeStyles[badge.variant || "default"]
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconBg} ${iconColor} shadow-2xs`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
