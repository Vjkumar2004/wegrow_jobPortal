"use client";

import React from "react";
import { FileText, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export const PricingConditionsSection: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-orange-50 text-[#FF6B00]">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#172554] tracking-tight">
            Pricing &amp; Engagement Terms
          </h3>
          <p className="text-xs text-slate-500">
            Transparent and straightforward contractual guidelines for all recruitment service tiers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
        {/* Conditions Card 1 */}
        <div className="bg-slate-50/70 rounded-xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#172554] uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Commercial &amp; Billing Terms</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" />
              <span>
                <strong className="text-slate-800">Taxes:</strong> Applicable GST extra on all package prices as per statutory guidelines.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" />
              <span>
                <strong className="text-slate-800">Standard &amp; Professional Packages:</strong> Advance payment or agreed milestone payment prior to profile dispatch.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" />
              <span>
                <strong className="text-slate-800">End-to-End Recruitment:</strong> Performance-linked billing based strictly on successful joining of the selected candidate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" />
              <span>
                <strong className="text-slate-800">Workforce Partner:</strong> Billed on a structured monthly or annual corporate agreement with custom SLA terms.
              </span>
            </li>
          </ul>
        </div>

        {/* Conditions Card 2 */}
        <div className="bg-slate-50/70 rounded-xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#172554] uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-[#FF6B00]" />
            <span>Service Agreement &amp; Guarantees</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" />
              <span>
                Candidate delivery count, recruitment timeline, and replacement policy will be clearly defined and signed in the formal service agreement.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" />
              <span>
                Candidate profiles submitted remain confidential and protected under mutual non-disclosure clauses.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" />
              <span>
                Custom bulk hiring SLAs and specialized technical assessments are available under the Workforce Partner engagement tier.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Confirmation disclaimer notice */}
      <div className="mt-5 p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
        <p className="text-xs text-amber-900 font-medium">
          <strong>Important Notice:</strong> Pricing and service terms are subject to final confirmation and mutual agreement with WeGrow Jobz upon review of your hiring requirements.
        </p>
      </div>
    </div>
  );
};

