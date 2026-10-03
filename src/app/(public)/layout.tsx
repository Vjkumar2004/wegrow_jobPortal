import React from "react";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { Footer } from "@/components/common/Footer";

export default function PublicGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
