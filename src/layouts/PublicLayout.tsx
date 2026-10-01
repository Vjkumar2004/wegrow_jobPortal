import React from "react";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { Footer } from "@/components/common/Footer";

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
