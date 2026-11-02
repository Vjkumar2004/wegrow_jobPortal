"use client";

import React from "react";
import { X, Headphones, Mail, Phone, Clock, MapPin, MessageSquare, ArrowRight } from "lucide-react";

interface SupportContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSales?: () => void;
}

export const SupportContactModal: React.FC<SupportContactModalProps> = ({
  isOpen,
  onClose,
  onSelectSales,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        <div className="bg-gradient-to-r from-[#172554] to-[#0E2963] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center mb-3 shadow-md">
            <Headphones className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            WeGrow Recruitment Support Desk
          </h3>
          <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
            Need guidance choosing a package or have customized hiring requirements? Connect with our dedicated hiring specialists.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="mailto:wegrowjobz@gmail.com?subject=Recruitment%20Consultancy%20Package%20Inquiry"
              className="p-4 rounded-xl border border-slate-200 hover:border-[#FF6B00] hover:bg-orange-50/40 transition group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#172554] mb-1">
                <div className="p-2 rounded-lg bg-orange-100 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition">
                  <Mail className="w-4 h-4" />
                </div>
                <span>Email Support</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                wegrowjobz@gmail.com
              </p>
              <span className="text-[10px] text-slate-400 mt-1">Average response &lt; 2 hrs</span>
            </a>

            <a
              href="tel:+919876543210"
              className="p-4 rounded-xl border border-slate-200 hover:border-[#FF6B00] hover:bg-orange-50/40 transition group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#172554] mb-1">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Phone className="w-4 h-4" />
                </div>
                <span>Corporate Helpline</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                +91 94892 01828
              </p>
              <span className="text-[10px] text-slate-400 mt-1">Mon-Sat, 9:00 AM - 7:00 PM</span>
            </a>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6B00] shrink-0" />
              <span>
                <strong>Consultancy Operating Hours:</strong> Monday – Saturday, 9:00 AM to 7:00 PM IST
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0" />
              <span>
                <strong>Corporate Office:</strong> WeGrow Skill Campus, Sivakasi, Tamil Nadu, India.
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            {onSelectSales && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectSales();
                }}
                className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Need Enterprise Retainer? Contact Sales</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

