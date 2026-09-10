"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, X, AlertCircle } from "lucide-react";
import type { User, UpdateUserData } from "@/types/user";

interface EditUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userId: string, data: UpdateUserData) => Promise<void>;
}

export default function EditUserModal({
  open,
  user,
  onClose,
  onSave,
}: EditUserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setUsername(user.username);
      setEmail(user.email);
    } else {
      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
    }
    setError("");
  }, [user, open]);

  if (!open || !user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave(user.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
      });

      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update user. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Edit User Account
              </h2>
              <p className="text-xs text-slate-500">
                Update account profile and identity information for standard team members.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="user-firstname"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                First Name
              </label>
              <input
                id="user-firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="user-lastname"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Last Name
              </label>
              <input
                id="user-lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="user-username"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Username
            </label>
            <input
              id="user-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="user-email"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Email Address
            </label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-9 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex h-9 items-center justify-center rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
