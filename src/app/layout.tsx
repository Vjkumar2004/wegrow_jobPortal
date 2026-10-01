import type { Metadata } from "next";
import { Poppins, Caveat } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "WeGrow Skill Campus | Find Jobs & Career Opportunities",
  description: "Find jobs, internships and career opportunities from trusted companies with WeGrow Skill Campus Job Portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${caveat.variable}`}>
      <body className={`${poppins.className} antialiased text-slate-900`} style={{ background: "#FFF6EE" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

