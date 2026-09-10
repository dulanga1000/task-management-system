"use client";

import React, { useState, useEffect } from "react";
import { User, UpdateUserData } from "@/types/user";
import { updateMyProfile } from "@/services/user.service";

interface ProfileInformationFormProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const ProfileInformationForm: React.FC<ProfileInformationFormProps> = ({
  user,
  onUpdateUser,
}) => {
  const [formData, setFormData] = useState<UpdateUserData>({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    email: user.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client validation
    if (!formData.firstName?.trim()) {
      setErrorMessage("First name is required.");
      return;
    }
    if (!formData.lastName?.trim()) {
      setErrorMessage("Last name is required.");
      return;
    }
    if (!formData.username?.trim()) {
      setErrorMessage("Username is required.");
      return;
    }
    if (!formData.email?.trim()) {
      setErrorMessage("Email address is required.");
      return;
    }

    try {
      setLoading(true);
      const result = await updateMyProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
      });

      onUpdateUser(result.data.user);
      setSuccessMessage("Profile updated successfully.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to update profile.");
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Personal Information</h2>
        <p className="mt-1 text-xs text-slate-500">
          Update your public profile details and communication email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Read-only Role Display */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Account Role
          </label>
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                user.role === "ADMIN"
                  ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                  : "bg-slate-100 text-slate-700 border border-slate-200/60"
              }`}
            >
              {user.role}
            </span>
            <span className="text-xs text-slate-400">
              Role permissions are managed by system administrators.
            </span>
          </div>
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              required
              disabled={loading}
              value={formData.firstName || ""}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              placeholder="First name"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              required
              disabled={loading}
              value={formData.lastName || ""}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            disabled={loading}
            value={formData.username || ""}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            placeholder="Username"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            disabled={loading}
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            placeholder="you@example.com"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
