"use client";

import React, { useState } from "react";
import { changeMyPassword } from "@/services/user.service";
import { Check, X, ShieldCheck } from "lucide-react";

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

  // Live password condition checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isDifferentFromCurrent =
    !currentPassword || !newPassword || newPassword !== currentPassword;

  const allConditionsMet =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial &&
    isDifferentFromCurrent;

  const hasConfirmTyped = confirmPassword.length > 0;
  const isMatching = hasConfirmTyped && newPassword === confirmPassword;
  const isMismatch = hasConfirmTyped && newPassword !== confirmPassword;

  // Strength score (0-5)
  const strengthScore = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return "";
    if (strengthScore <= 2) return "Weak";
    if (strengthScore <= 4) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (strengthScore <= 2) return "bg-red-500";
    if (strengthScore <= 4) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage("Current password is required.");
      return;
    }

    if (!allConditionsMet) {
      setErrorMessage("Please satisfy all password complexity requirements.");
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
      <div className="border-b border-gray-100 pb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Security & Password</h2>
          <p className="mt-1 text-xs text-gray-500">
            Ensure your account stays protected by using a robust, unique password.
          </p>
        </div>
        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <ShieldCheck className="w-5 h-5" />
        </div>
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
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setErrorMessage(null);
              }}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-14 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              {showCurrent ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="newPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
            >
              New Password
            </label>
            {newPassword.length > 0 && (
              <span className="text-xs font-semibold text-gray-500">
                Strength: <span className="font-bold">{getStrengthLabel()}</span>
              </span>
            )}
          </div>

          <div className="relative">
            <input
              id="newPassword"
              type={showNew ? "text" : "password"}
              required
              disabled={loading}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMessage(null);
              }}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-14 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              placeholder="Enter at least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>

          {/* Strength progress bar */}
          {newPassword.length > 0 && (
            <div className="mt-2 flex gap-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-full flex-1 rounded-full transition-all duration-300 ${
                    strengthScore >= level ? getStrengthColor() : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Live Password Conditions Checklist */}
          <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5 space-y-2 text-xs">
            <p className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider mb-2">
              Password Requirements
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  hasMinLength ? "text-emerald-700 font-semibold" : "text-gray-500"
                }`}
              >
                {hasMinLength ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-gray-300 inline-block shrink-0" />
                )}
                <span>At least 8 characters</span>
              </div>

              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  hasUppercase ? "text-emerald-700 font-semibold" : "text-gray-500"
                }`}
              >
                {hasUppercase ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-gray-300 inline-block shrink-0" />
                )}
                <span>One uppercase letter (A-Z)</span>
              </div>

              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  hasLowercase ? "text-emerald-700 font-semibold" : "text-gray-500"
                }`}
              >
                {hasLowercase ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-gray-300 inline-block shrink-0" />
                )}
                <span>One lowercase letter (a-z)</span>
              </div>

              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  hasNumber ? "text-emerald-700 font-semibold" : "text-gray-500"
                }`}
              >
                {hasNumber ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-gray-300 inline-block shrink-0" />
                )}
                <span>At least one number (0-9)</span>
              </div>

              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  hasSpecial ? "text-emerald-700 font-semibold" : "text-gray-500"
                }`}
              >
                {hasSpecial ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-gray-300 inline-block shrink-0" />
                )}
                <span>One special character (!@#$)</span>
              </div>

              {currentPassword && newPassword && (
                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    isDifferentFromCurrent ? "text-emerald-700 font-semibold" : "text-rose-600 font-semibold"
                  }`}
                >
                  {isDifferentFromCurrent ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 shrink-0 stroke-[2.5]" />
                  )}
                  <span>Different from current password</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
            >
              Confirm New Password
            </label>

            {/* Live Match Indicator Badge */}
            {hasConfirmTyped && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  isMatching
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                    : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                }`}
              >
                {isMatching ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className="w-3.5 h-3.5 text-red-600" />
                    <span>Passwords do not match</span>
                  </>
                )}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMessage(null);
              }}
              className={`h-11 w-full rounded-xl border bg-white px-3.5 pr-14 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 disabled:opacity-60 ${
                hasConfirmTyped
                  ? isMatching
                    ? "border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    : "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              }`}
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={loading || !currentPassword || !allConditionsMet || !isMatching}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
