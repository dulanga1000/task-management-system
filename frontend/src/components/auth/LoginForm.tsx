"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Info } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login({
        email,
        password,
      });

      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Unable to sign in. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Session/Logout Notice */}
      {reason === "idle" && (
        <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-xs text-amber-800">
          <Clock className="h-4 w-4 shrink-0 text-amber-600" />
          <span>You have been signed out due to inactivity. Please sign in again.</span>
        </div>
      )}

      {reason === "password_changed" && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Password changed successfully. Please sign in with your new password.</span>
        </div>
      )}

      {reason === "sync" && (
        <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50/90 px-4 py-3 text-xs text-blue-800">
          <Info className="h-4 w-4 shrink-0 text-blue-600" />
          <span>You were signed out from another browser tab. Please sign in to continue.</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Password */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900"
          >
            Password
          </label>
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium !text-gray-500 transition-colors hover:!text-gray-900 cursor-pointer"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {/* Register */}
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold !text-blue-600 transition-colors hover:!text-blue-700"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}