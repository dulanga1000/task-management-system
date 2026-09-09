import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Get started with TaskFlow and organize your work in one place."
    >
      <RegisterForm />
    </AuthLayout>
  );
}