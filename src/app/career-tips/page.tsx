import React from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Lightbulb, Compass, Award, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/common/Button";

export const metadata = {
  title: "Career Tips & Mentorship Guides | WeGrow Skill Campus",
  description: "Expert advice on resume tailoring, LinkedIn networking, salary negotiation, and acing campus placement drives.",
};

export default function CareerTipsPage() {
  const tips = [
    {
      title: "Mastering the STAR Technique in Tech Interviews",
      readTime: "4 min read",
      author: "Sneha Roy (Senior Tech Recruiter)",
      excerpt: "Learn how to structure your responses for Situation, Task, Action, and Result to leave a lasting impression during managerial rounds.",
      tag: "Interview Technique"
    },
    {
      title: "How to Build a High-Conversion GitHub Portfolio",
      readTime: "6 min read",
      author: "Aarav Gupta (Staff Software Architect)",
      excerpt: "Recruiters spend less than 30 seconds scanning your code. Here are 5 ways to make your pinned repositories instantly stand out.",
      tag: "Portfolio Building"
    },
    {
      title: "Salary Negotiation Tactics for Recent College Graduates",
      readTime: "5 min read",
      author: "Vikram Mehta (Talent Acquisition Lead)",
      excerpt: "Negotiating your first full-time offer or internship stipend doesn't have to be intimidating when you come prepared with verified market benchmarks.",
      tag: "Career Growth"
    },
    {
      title: "Transitioning from Non-CS Engineering to Software Roles",
      readTime: "7 min read",
      author: "Pooja Hegde (Engineering Manager)",
      excerpt: "A roadmap tailored for mechanical, electrical, and civil graduates aiming to break into modern cloud engineering and frontend development.",
      tag: "Career Switch"
    }
  ];

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0756A8] bg-blue-100 px-3 py-1 rounded-full">
            Mentorship & Insights
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Career Tips & Advice
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Actionable strategies and wisdom directly from hiring managers and industry experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tip, i) => (
            <article key={i} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-[#F79400]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-bold text-[#F79400] bg-amber-50 px-2.5 py-0.5 rounded-md">
                    {tip.tag}
                  </span>
                  <span>{tip.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {tip.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {tip.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">By {tip.author}</span>
                <span className="text-xs font-bold text-[#0756A8] flex items-center gap-1 cursor-pointer hover:underline">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
