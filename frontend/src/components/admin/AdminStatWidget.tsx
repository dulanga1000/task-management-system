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
  success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  warning: "bg-amber-50 text-amber-700 border-amber-200/60",
  info: "bg-blue-50 text-blue-700 border-blue-200/60",
  default: "bg-gray-100 text-gray-700 border-gray-200/60",
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
      className={`group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-gray-950">
              {value}
            </span>
            {badge && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${
                  badgeStyles[badge.variant || "default"]
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1.5 text-xs text-gray-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${iconBg} ${iconColor} shadow-xs`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
