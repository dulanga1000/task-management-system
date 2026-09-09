import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account to continue managing your tasks."
    >
      <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-gray-100/60" />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}