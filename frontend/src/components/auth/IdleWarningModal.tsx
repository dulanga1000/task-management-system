"use client";

import React, { useEffect } from "react";
import { Clock, ShieldAlert, LogOut } from "lucide-react";

interface IdleWarningModalProps {
  secondsRemaining: number;
  onStaySignedIn: () => void;
  onSignOut: () => void;
}

export function IdleWarningModal({
  secondsRemaining,
  onStaySignedIn,
  onSignOut,
}: IdleWarningModalProps) {
  // Format remaining seconds into mm:ss
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // Keyboard shortcut: Escape or Enter stays signed in
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        onStaySignedIn();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStaySignedIn]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="idle-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 transition-all">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-500/20">
            <ShieldAlert className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3
              id="idle-modal-title"
              className="text-lg font-bold text-gray-900 tracking-tight"
            >
              Session Expiring Soon
            </h3>
            <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
              You have been inactive for too long. You will be logged out soon.
            </p>

            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-amber-50/80 px-4 py-3 border border-amber-200/60">
              <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
              <span className="text-xl font-mono font-bold text-amber-900 tracking-wider">
                {formattedTime}
              </span>
              <span className="text-xs font-medium text-amber-700">remaining</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out Now</span>
          </button>

          <button
            type="button"
            autoFocus
            onClick={onStaySignedIn}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          >
            Stay Signed In
          </button>
        </div>
      </div>
    </div>
  );
}
