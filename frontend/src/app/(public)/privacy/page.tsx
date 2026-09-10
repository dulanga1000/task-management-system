import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivacyPolicyContent from "@/components/legal/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | TaskFlow",
  description: "Learn how TaskFlow collects, uses, and safeguards your workspace data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        <PrivacyPolicyContent />
      </main>

      <Footer />
    </div>
  );
}
