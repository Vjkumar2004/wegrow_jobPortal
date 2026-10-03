"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Student Course & Certification");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-3">
          <MessageSquare className="w-3.5 h-3.5" /> Direct Campus Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          We&apos;re Here to Help Your Career Grow
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto">
          Have queries about campus placement drives, courses, or recruiter partnerships? Connect with our dedicated career counselors.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-[#014E9C] text-white rounded-3xl p-7 sm:p-8 shadow-xl shadow-blue-900/10 space-y-7 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h2 className="text-xl font-bold tracking-tight">Sivakasi Headquarters</h2>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              Drop by for in-person technical lab tours, one-on-one career counseling, and campus drive walk-ins.
            </p>
          </div>

          <div className="space-y-5 text-xs text-blue-100 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#F79400]">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="leading-snug">
                <div className="font-bold text-white text-sm">WeGrow Skill Campus</div>
                <p className="mt-0.5">100A/5, 1st Floor, Thiruthangal Road,</p>
                <p>Opposite Bell Hotel, Sivakasi – 626123,</p>
                <p className="text-[#F79400] font-semibold mt-0.5">Tamil Nadu, India</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#F79400]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-blue-200">Call Desk</div>
                <a href="tel:+919344337331" className="font-bold text-white text-sm hover:underline">
                  +91 93443 37331
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#F79400]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-blue-200">Official Email</div>
                <a href="mailto:enquiry@wegrowcampus.in" className="font-bold text-white text-sm hover:underline">
                  enquiry@wegrowcampus.in
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#F79400]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-blue-200">Working Hours</div>
                <div className="font-bold text-white">Mon – Sat: 9:00 AM – 6:30 PM</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/15 relative z-10 flex items-center gap-2 text-xs text-blue-100">
            <ShieldCheck className="w-4 h-4 text-[#F79400]" />
            <span>ISO 9001:2015 Accredited IT Training Campus</span>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-xl shadow-slate-200/40">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
            Send Us an Instant Message
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Fill out the form below and our placement advisors will call or email back within 4 hours.
          </p>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Inquiry Received!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you, <span className="font-semibold text-slate-900">{name}</span>. Our student counselors have received your message and will contact you via {phone || email}.
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setMessage(""); }}
                className="text-xs font-bold text-[#0756A8] hover:underline pt-2 block mx-auto"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="anand@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Inquiry Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8] cursor-pointer"
                  >
                    <option>Student Course & Certification</option>
                    <option>Job & Internship Placement</option>
                    <option>Corporate Hiring & Recruiter Partnership</option>
                    <option>College MOU & Campus Drive</option>
                    <option>General Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Message / Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you with your career or recruitment goals?..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs p-3.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8] resize-none leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold bg-[#0756A8] hover:bg-[#06478a] shadow-md shadow-[#0756A8]/20 py-3"
              >
                <Send className="w-4 h-4 mr-2" />
                <span>Send Inquiry Message</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
