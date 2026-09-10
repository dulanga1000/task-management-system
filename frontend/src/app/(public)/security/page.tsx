import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SecurityContent from "@/components/legal/SecurityContent";

export const metadata: Metadata = {
  title: "Security Overview | TaskFlow",
  description: "Explore the defense-in-depth security architecture protecting your TaskFlow workspace.",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        <SecurityContent />
      </main>

      <Footer />
    </div>
  );
}
