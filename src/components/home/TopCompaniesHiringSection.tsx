"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface CompanyItem {
  id: string;
  name: string;
  file: string;
  bgColor: string; // subtle background tint
}

const ALL_COMPANIES: CompanyItem[] = [
  { id: "google",    name: "Google",    file: "/logos/google.svg",    bgColor: "#EBF3FF" },
  { id: "microsoft", name: "Microsoft", file: "/logos/microsoft.svg", bgColor: "#F3F3F3" },
  { id: "amazon",    name: "Amazon",    file: "/logos/amazon.svg",    bgColor: "#FFF8EE" },
  { id: "tcs",       name: "TCS",       file: "/logos/tcs.svg",       bgColor: "#EEF0FA" },
  { id: "zoho",      name: "Zoho",      file: "/logos/zoho.svg",      bgColor: "#FFF0F0" },
  { id: "deloitte",  name: "Deloitte",  file: "/logos/deloitte.svg",  bgColor: "#F4F9ED" },
  { id: "infosys",   name: "Infosys",   file: "/logos/infosys.svg",   bgColor: "#E8F4FC" },
  { id: "accenture", name: "Accenture", file: "/logos/accenture.svg", bgColor: "#F8F0FF" },
  { id: "ibm",       name: "IBM",       file: "/logos/ibm.svg",       bgColor: "#EBF0FF" },
  { id: "capgemini", name: "Capgemini", file: "/logos/capgemini.svg", bgColor: "#E8F3FB" },
  { id: "wipro",     name: "Wipro",     file: "/logos/wipro.svg",     bgColor: "#F0EAF6" },
  { id: "oracle",    name: "Oracle",    file: "/logos/oracle.svg",    bgColor: "#FFF0F0" },
  { id: "cognizant", name: "Cognizant", file: "/logos/cognizant.svg", bgColor: "#EDF2FA" },
  { id: "hcl",       name: "HCL",       file: "/logos/hcl.svg",       bgColor: "#E8F3FB" },
];

function LogoIcon({ file, name }: { file: string; name: string }) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    fetch(file)
      .then((r) => r.text())
      .then((text) => setSvgContent(text))
      .catch(() => setSvgContent(null));
  }, [file]);

  if (!svgContent) {
    // Initials fallback while loading
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:object-contain"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

const LogoCard = ({ comp, keyStr }: { comp: CompanyItem; keyStr: string }) => (
  <div key={keyStr} className="marquee-logo-item shrink-0">
    <Link
      href="/companies"
      title={comp.name}
      className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-white px-5 sm:px-6 py-4 border border-slate-200/80 shadow-[0_2px_12px_rgba(11,31,75,0.06)] hover:shadow-[0_8px_24px_rgba(255,107,0,0.15)] hover:border-[#FF6B00]/30 transition-all duration-300 cursor-pointer w-[120px] sm:w-[136px] h-[108px] sm:h-[120px]"
    >
      {/* Logo icon in tinted background circle */}
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 p-2"
        style={{ backgroundColor: comp.bgColor }}
      >
        <LogoIcon file={comp.file} name={comp.name} />
      </div>
      {/* Company name */}
      <span className="text-[11px] sm:text-[12px] font-semibold text-slate-500 tracking-wide text-center leading-tight truncate w-full text-center">
        {comp.name}
      </span>
    </Link>
  </div>
);

export default function TopCompaniesHiringSection() {
  return (
    <section
      id="top-companies"
      className="relative w-full py-8 sm:py-10 overflow-hidden bg-white select-none border-y border-slate-100"
    >
      {/* Label */}
      <p className="text-center text-[11px] font-semibold text-slate-400 tracking-[0.18em] uppercase mb-5 sm:mb-6">
        Trusted by top companies hiring on WeGrow
      </p>

      <div className="relative w-full overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-28 bg-gradient-to-r from-white to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-28 bg-gradient-to-l from-white to-transparent z-20" />

        <div className="single-marquee-row overflow-hidden w-full">
          <div className="single-marquee-track">
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {ALL_COMPANIES.map((c, i) => (
                <LogoCard key={`s1-${c.id}-${i}`} comp={c} keyStr={`s1-${c.id}-${i}`} />
              ))}
            </div>
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-3 sm:ml-4" aria-hidden="true">
              {ALL_COMPANIES.map((c, i) => (
                <LogoCard key={`s2-${c.id}-${i}`} comp={c} keyStr={`s2-${c.id}-${i}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes singleMarqueeLoop {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .single-marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          will-change: transform;
          animation: singleMarqueeLoop 38s linear infinite;
        }
        .single-marquee-row:hover .single-marquee-track {
          animation-play-state: paused;
        }
        .marquee-logo-item {
          transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .marquee-logo-item:hover {
          transform: translateY(-5px);
          z-index: 30;
        }
      `}</style>
    </section>
  );
}
