"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  X,
  Copy,
  Check,
  Send,
  Mail,
  Linkedin,
  Briefcase,
  Building2,
  MapPin,
  Smartphone,
  QrCode,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export interface ShareJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
  jobUrl?: string;
  location?: string;
  jobType?: string;
}

export const ShareJobModal: React.FC<ShareJobModalProps> = ({
  isOpen,
  onClose,
  jobTitle,
  companyName,
  jobUrl,
  location,
  jobType,
}) => {
  const [activeTab, setActiveTab] = useState<"social" | "qr">("social");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Compute final URL
  const effectiveUrl =
    jobUrl ||
    (typeof window !== "undefined"
      ? window.location.href
      : "https://wegrowcampus.in/jobs");

  const shareText = `Check out this opening for ${jobTitle} at ${companyName} on WeGrow Skill Campus!`;

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(effectiveUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${jobTitle} at ${companyName}`,
          text: shareText,
          url: effectiveUrl,
        });
      } catch (err) {
        // user cancelled or share failed silently
      }
    }
  };

  const socialChannels = [
    {
      name: "WhatsApp",
      subtitle: "Chat & Status",
      gradient: "from-[#25D366] to-[#128C7E]",
      iconBg: "bg-white/20",
      shadow: "shadow-[#25D366]/25",
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText}\n\n👉 Apply directly on WeGrow: ${effectiveUrl}`
      )}`,
    },
    {
      name: "LinkedIn",
      subtitle: "Post & Network",
      gradient: "from-[#0A66C2] to-[#004182]",
      iconBg: "bg-white/20",
      shadow: "shadow-[#0A66C2]/25",
      icon: <Linkedin className="w-5 h-5 text-white" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        effectiveUrl
      )}`,
    },
    {
      name: "Telegram",
      subtitle: "Direct Channel",
      gradient: "from-[#2AABEE] to-[#229ED9]",
      iconBg: "bg-white/20",
      shadow: "shadow-[#229ED9]/25",
      icon: <Send className="w-5 h-5 text-white" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(
        effectiveUrl
      )}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Twitter / X",
      subtitle: "Tweet Opportunity",
      gradient: "from-[#1E293B] to-[#0F172A]",
      iconBg: "bg-white/15",
      shadow: "shadow-slate-900/25",
      icon: (
        <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(effectiveUrl)}`,
    },
    {
      name: "Email",
      subtitle: "Send to Friend",
      gradient: "from-[#6366F1] to-[#4F46E5]",
      iconBg: "bg-white/20",
      shadow: "shadow-indigo-500/25",
      icon: <Mail className="w-5 h-5 text-white" />,
      url: `mailto:?subject=${encodeURIComponent(
        `Job Opening: ${jobTitle} at ${companyName}`
      )}&body=${encodeURIComponent(
        `${shareText}\n\nApply online on WeGrow Portal: ${effectiveUrl}`
      )}`,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 bg-[#030B18]/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Background ambient decorative glow */}
      <div className="absolute w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none -top-10 -right-10" />
      <div className="absolute w-80 h-80 rounded-full bg-orange-500/15 blur-3xl pointer-events-none -bottom-10 -left-10" />

      <div
        className="relative w-full max-w-lg bg-white text-slate-800 rounded-[28px] shadow-[0_24px_70px_rgba(1,78,156,0.22)] border border-blue-100/80 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===================== Sleek Header ===================== */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-[#0B1F4B] via-[#014E9C] to-[#0B1F4B] text-white">
          {/* Subtle lighting shine */}
          <div className="absolute top-0 right-1/4 w-36 h-36 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#F79400] border border-white/20 shadow-inner">
                <Share2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-blue-100 text-[10px] font-bold tracking-wider uppercase mb-1">
                  <Sparkles className="w-3 h-3 text-[#F79400]" />
                  Spread The Word
                </div>
                <h2
                  id="share-modal-title"
                  className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight"
                >
                  Share Job Opportunity
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              aria-label="Close share dialog"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Segmented Tab Switcher (Share vs QR Code) */}
          <div className="flex items-center gap-1 mt-4 p-1 rounded-xl bg-black/20 backdrop-blur-xs border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("social")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "social"
                  ? "bg-white text-[#0B1F4B] shadow-sm font-bold"
                  : "text-blue-100/80 hover:text-white"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Direct Share Channels</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("qr")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "qr"
                  ? "bg-white text-[#0B1F4B] shadow-sm font-bold"
                  : "text-blue-100/80 hover:text-white"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan Mobile QR</span>
            </button>
          </div>
        </div>

        {/* ===================== Modal Body ===================== */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Job Ticket Card */}
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#F6F9FF] to-[#EDF3FC] border border-blue-200/60 shadow-xs flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-center shrink-0 text-[#014E9C] font-black text-base">
              {companyName ? companyName.slice(0, 2).toUpperCase() : <Briefcase className="w-6 h-6" />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-[#014E9C] uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22B573]" />
                  Verified Opening
                </span>
                {jobType && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-700 border border-slate-200/60 shadow-2xs">
                    {jobType}
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[#0B1F4B] leading-snug mt-0.5 truncate">
                {jobTitle}
              </h3>

              <div className="flex items-center gap-2 text-xs text-[#6B7694] mt-1 flex-wrap">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {companyName}
                </span>
                {location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* TAB 1: SOCIAL SHARING */}
          {activeTab === "social" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Choose Social Channel
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {socialChannels.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:scale-95 flex items-center gap-3 cursor-pointer`}
                      title={`Share on ${item.name}`}
                    >
                      <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-white/80 leading-tight mt-0.5 truncate">
                          {item.subtitle}
                        </div>
                      </div>
                    </a>
                  ))}

                  {/* Device Native Share Button */}
                  {canNativeShare && (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="group p-3 rounded-2xl bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A] text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:scale-95 flex items-center gap-3 cursor-pointer text-left col-span-2 sm:col-span-1"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight truncate">
                          More Apps
                        </div>
                        <div className="text-[10px] text-white/80 leading-tight mt-0.5 truncate">
                          Phone Share Sheet
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Copy Link Container */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Direct URL Link</span>
                  {copied && (
                    <span className="text-[#22B573] flex items-center gap-1 normal-case font-bold">
                      <Check className="w-3.5 h-3.5" /> Copied to clipboard!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 bg-slate-50/80 focus-within:border-[#014E9C] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-2xs shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={effectiveUrl}
                    className="flex-1 bg-transparent text-xs text-slate-700 font-mono truncate focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95 ${
                      copied
                        ? "bg-[#22B573] text-white"
                        : "bg-[#014E9C] hover:bg-[#0B1F4B] text-white hover:shadow-md"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MOBILE QR SCAN */}
          {activeTab === "qr" && (
            <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
              <div className="inline-block p-4 rounded-3xl bg-white border-2 border-dashed border-blue-200 shadow-md">
                {/* QR Code image generated dynamically from Google Chart / QR Server API */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    effectiveUrl
                  )}`}
                  alt="Job QR Code"
                  width={180}
                  height={180}
                  className="rounded-xl mx-auto"
                />
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B1F4B]">Scan With Your Smartphone</h4>
                <p className="text-xs text-[#6B7694] max-w-xs mx-auto mt-1">
                  Point your phone camera to instantly open this job opening and share via mobile WhatsApp, Instagram or SMS.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-[#014E9C] hover:bg-blue-100 text-xs font-bold transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Link Copied!" : "Or Copy Web Link"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>WeGrow Skill Campus • Direct Placement Drive</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareJobModal;
