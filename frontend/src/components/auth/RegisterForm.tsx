"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, AtSign, Check, Eye, EyeOff, Loader2, Lock, Mail, User, X } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function RegisterForm() {
  const router = useRouter();
  const { register, login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live password validation rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const allConditionsMet =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial;

  const hasConfirmTyped = confirmPassword.length > 0;
  const isMatching = hasConfirmTyped && password === confirmPassword;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!allConditionsMet) {
      setError("Please ensure your password meets all complexity requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
      });

      // Automatically log the user in upon successful registration
      try {
        const user = await login({
          email: email.trim().toLowerCase(),
          password,
        });

        if (user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } catch {
        // Fallback to login page if auto-login fails
        router.push("/login");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Unable to create account. Please check your information and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
      {/* Error alert */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700 shadow-2xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            First name
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Jane"
              required
              disabled={loading}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setError(null);
              }}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Last name
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
              required
              disabled={loading}
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setError(null);
              }}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Username
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <AtSign className="h-4 w-4" />
          </div>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="janedoe"
            required
            disabled={loading}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(null);
            }}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:opacity-60"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Email
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Mail className="h-4 w-4" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            disabled={loading}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:opacity-60"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Password
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Lock className="h-4 w-4" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a strong password"
            required
            disabled={loading}
            value={password}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Live Password Conditions Checklist */}
        {(isPasswordFocused || password.length > 0) && (
          <div className="mt-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5 text-xs animate-in fade-in duration-150">
            <p className="font-semibold text-slate-700 text-[11px] mb-1">
              Password requirements:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  hasMinLength ? "text-emerald-700 font-medium" : "text-slate-500"
                }`}
              >
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0" />
                )}
                <span>At least 8 characters</span>
              </div>

              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  hasUppercase ? "text-emerald-700 font-medium" : "text-slate-500"
                }`}
              >
                {hasUppercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0" />
                )}
                <span>One uppercase letter</span>
              </div>

              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  hasLowercase ? "text-emerald-700 font-medium" : "text-slate-500"
                }`}
              >
                {hasLowercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0" />
                )}
                <span>One lowercase letter</span>
              </div>

              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  hasNumber ? "text-emerald-700 font-medium" : "text-slate-500"
                }`}
              >
                {hasNumber ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0" />
                )}
                <span>At least one number</span>
              </div>

              <div
                className={`flex items-center gap-1.5 transition-colors ${
                  hasSpecial ? "text-emerald-700 font-medium" : "text-slate-500"
                }`}
              >
                {hasSpecial ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0" />
                )}
                <span>One special character</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-700"
          >
            Confirm password
          </label>

          {/* Live Match Indicator Badge */}
          {hasConfirmTyped && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
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
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Lock className="h-4 w-4" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your password"
            required
            disabled={loading}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError(null);
            }}
            className={`h-10 w-full rounded-lg border bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 disabled:opacity-60 ${
              hasConfirmTyped
                ? isMatching
                  ? "border-emerald-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  : "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            }`}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((previous) => !previous)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={
          loading ||
          !firstName.trim() ||
          !lastName.trim() ||
          !username.trim() ||
          !email.trim() ||
          !allConditionsMet ||
          !isMatching
        }
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold !text-white shadow-xs transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create account</span>
        )}
      </button>

      {/* Login */}
      <p className="text-center text-sm text-slate-500 pt-1">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}