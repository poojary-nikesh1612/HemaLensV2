"use client";

import Footer from "@/components/Footer";
import HomeBody from "@/components/HomeBody";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black ">
      <Navbar />
      <HomeBody />
      <Footer />
    </div>
  );
}
