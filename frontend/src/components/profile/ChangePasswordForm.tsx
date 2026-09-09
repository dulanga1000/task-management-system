"use client";

import React, { useState } from "react";
import { changeMyPassword } from "@/services/user.service";

export const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage("Current password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setErrorMessage("New password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setErrorMessage("New password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setErrorMessage("New password must contain at least one number.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setErrorMessage("New password must contain at least one special character.");
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage("New password cannot be the same as your current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await changeMyPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setSuccessMessage("Password changed successfully.");
      // Clear password fields immediately
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to change password.");
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-lg font-bold text-gray-900">Security & Password</h2>
        <p className="mt-1 text-xs text-gray-500">
          Ensure your account stays protected by using a robust, unique password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Current Password */}
        <div>
          <label
            htmlFor="currentPassword"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-700"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              required
              disabled={loading}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-14 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800"
            >
              {showCurrent ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-700"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNew ? "text" : "password"}
              required
              disabled={loading}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-14 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              placeholder="Enter at least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800"
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-gray-400">
            Must contain at least 8 characters with uppercase, lowercase, number, and special character.
          </p>
        </div>

        {/* Confirm New Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-700"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-14 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Changing password...</span>
              </>
            ) : (
              <span>Change Password</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
