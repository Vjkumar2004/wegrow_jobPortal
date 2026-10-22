import type { Metadata } from "next";
import Script from "next/script";
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

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-JTXSVDC3Z4";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wegrowjobz.com"),
  title: {
    default: "WeGrow Jobz | Placement & Career Opportunities Portal",
    template: "%s | WeGrow Jobz",
  },
  description:
    "Explore verified jobs, fresher campus placements, corporate recruitment drives, and internships across leading companies in India with WeGrow Jobz.",
  applicationName: "WeGrow Jobz",
  keywords: [
    "WeGrow Jobz",
    "campus placement portal",
    "jobs in India",
    "fresher hiring",
    "IT jobs",
    "internships 2026",
    "software engineer vacancies",
    "campus recruitment",
    "recruitment platform",
    "jobs for freshers",
    "WeGrow Skill Campus",
  ],
  authors: [{ name: "WeGrow Jobz Team", url: "https://www.wegrowjobz.com" }],
  creator: "WeGrow Jobz",
  publisher: "WeGrow Skill Campus",
  alternates: {
    canonical: "https://www.wegrowjobz.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    type: "website",
    locale: "en_IN",
    url: "https://www.wegrowjobz.com",
    siteName: "WeGrow Jobz",
    title: "WeGrow Jobz | Placement & Career Opportunities Portal",
    description:
      "Explore verified jobs, fresher campus placements, corporate recruitment drives, and internships across leading companies in India with WeGrow Jobz.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WeGrow Jobz - Job & Placement Portal",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WeGrow Jobz | Placement & Career Opportunities Portal",
    description:
      "Explore verified jobs, fresher campus placements, corporate recruitment drives, and internships across leading companies in India with WeGrow Jobz.",
    images: ["/og-image.png"],
    creator: "@wegrowjobz",
  },
  category: "Job Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.wegrowjobz.com/#organization",
        name: "WeGrow Jobz",
        url: "https://www.wegrowjobz.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.wegrowjobz.com/favicon/web-app-manifest-512x512.png",
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://www.wegrowjobz.com",
          "https://wegrowjobz.com",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: "wegrowjobz@gmail.com",
          contactType: "Customer Support",
          areaServed: "IN",
          availableLanguage: ["English", "Tamil"],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://www.wegrowjobz.com/#website",
        url: "https://www.wegrowjobz.com",
        name: "WeGrow Jobz",
        description: "Placement and career opportunities portal for students, freshers, and corporate recruiters.",
        publisher: {
          "@id": "https://www.wegrowjobz.com/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://www.wegrowjobz.com/jobs?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
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
        <meta name="apple-mobile-web-app-title" content="WeGrow Jobz" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${poppins.className} antialiased text-slate-900`} style={{ background: "#FFF6EE" }}>
        {/* Google Analytics (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

