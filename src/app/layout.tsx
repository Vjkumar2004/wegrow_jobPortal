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
  metadataBase: new URL("https://www.wegrowjobz.com"),
  title: "WeGrow Jobz | Find Jobs & Career Opportunities",
  description: "Find jobs, internships and career opportunities from trusted companies with WeGrow Jobz Career Portal.",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "WeGrow Jobz | Find Jobs & Career Opportunities",
    description: "Find jobs, internships and career opportunities from trusted companies with WeGrow Jobz Career Portal.",
    url: "https://www.wegrowjobz.com",
    siteName: "WeGrow Jobz",
    images: [
      {
        url: "/favicon/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "WeGrow Jobz Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeGrow Jobz | Find Jobs & Career Opportunities",
    description: "Find jobs, internships and career opportunities from trusted companies with WeGrow Jobz Career Portal.",
    images: ["/favicon/web-app-manifest-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WeGrow Jobz",
    url: "https://www.wegrowjobz.com",
    logo: "https://www.wegrowjobz.com/favicon/web-app-manifest-512x512.png",
    sameAs: [
      "https://www.wegrowjobz.com",
      "https://wegrowjobz.com"
    ],
  };

  return (
    <html lang="en" className={`${poppins.variable} ${caveat.variable}`}>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#0B1F4B" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${poppins.className} antialiased text-slate-900`} style={{ background: "#FFF6EE" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

