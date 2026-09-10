import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}