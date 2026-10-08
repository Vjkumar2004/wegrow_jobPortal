"use client";

import React from "react";
import Image from "next/image";

interface PageLoaderProps {
  label?: string;
  subLabel?: string;
  fullScreen?: boolean;
}

/**
 * Clean & minimal branded logo loading animation.
 * Features only the centered WeGrow logo surrounded by a smooth rotating gradient ring.
 * All text and extra badges have been removed as requested.
 */
export const PageLoader: React.FC<PageLoaderProps> = ({
  fullScreen = true,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${
        fullScreen
          ? "fixed inset-0 z-[9999] min-h-screen w-screen bg-[#F4F7FC]/90 backdrop-blur-sm"
          : "w-full py-12 px-4"
      }`}
    >
      {/* Background soft ambient glow */}
      <div className="absolute w-48 h-48 bg-[#014E9C]/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

      {/* Centered Logo with Surrounding Rotating Ring */}
      <div className="relative flex items-center justify-center w-28 h-28">
        {/* Outer glowing pulse */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#014E9C]/25 via-[#1E5BE0]/20 to-[#F79400]/25 animate-ping opacity-40" />

        {/* Outer Rotating Conic-Gradient Ring */}
        <div
          className="absolute inset-0 rounded-full animate-spin p-[3px]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, #014E9C 40%, #1E5BE0 70%, #F79400 95%, transparent 100%)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 2px))",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
            animationDuration: "1.2s",
          }}
        />

        {/* Inner Counter-Rotating Accent Ring */}
        <div
          className="absolute inset-2 rounded-full border-2 border-dashed border-[#F79400]/50 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "2.5s" }}
        />

        {/* Center Logo Capsule */}
        <div className="relative w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center p-2.5 border border-slate-100 overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/image.png"
              alt="WeGrow Skill Campus"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
