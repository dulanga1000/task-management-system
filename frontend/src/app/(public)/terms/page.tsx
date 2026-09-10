import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TermsOfServiceContent from "@/components/legal/TermsOfServiceContent";

export const metadata: Metadata = {
  title: "Terms of Service | TaskFlow",
  description: "Review the terms and conditions governing the use of TaskFlow workspace.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        <TermsOfServiceContent />
      </main>

      <Footer />
    </div>
  );
}
