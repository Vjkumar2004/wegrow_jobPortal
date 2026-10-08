"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap, Target, Users, Globe, Award, BookOpen,
  MapPin, Phone, Mail, Clock, ChevronDown, Star,
  Briefcase, TrendingUp, Shield, Code, BarChart3,
  Brain, Monitor, Calculator, Palette, Layers,
  Building2, Heart, Lightbulb, CheckCircle, ArrowRight,
  Play
} from "lucide-react";

/* ─── DATA ─── */
const STATS = [
  { value: "15+",  label: "Courses Offered",    sub: "Industry aligned programs",   icon: <BookOpen className="w-5 h-5" />, color: "#4285F4" },
  { value: "98%",  label: "Placement Rate",      sub: "Consistent year-on-year",     icon: <TrendingUp className="w-5 h-5" />, color: "#34A853" },
  { value: "150+", label: "Hiring Partners",     sub: "IT, MNCs & Startups",         icon: <Building2 className="w-5 h-5" />, color: "#FF6B00" },
  { value: "2",    label: "Global Partners",     sub: "UK & European companies",     icon: <Globe className="w-5 h-5" />, color: "#A100FF" },
];

const PILLARS = [
  { icon: <Target />,    title: "Career Guidance",      desc: "Strategic direction and personalized mentorship to navigate modern career pathways.", color: "#4285F4" },
  { icon: <Users />,     title: "1-on-1 Counselling",   desc: "Personalized attention to map your career goals and bridge your skill gaps.", color: "#FF6B00" },
  { icon: <Briefcase />, title: "Placement Support",    desc: "Direct connections with 150+ hiring partners across IT companies, MNCs, and remote roles.", color: "#34A853" },
  { icon: <Code />,      title: "Live Client Projects", desc: "Build real portfolio pieces working on actual web, app, and marketing projects.", color: "#A100FF" },
  { icon: <Globe />,     title: "Global Exposure",      desc: "International partnerships with UK and European companies for global career avenues.", color: "#00A4EF" },
  { icon: <Shield />,    title: "Industry-Focused",     desc: "100% industry-aligned curriculum — build, deploy, and optimize real products.", color: "#EA4335" },
];

const COURSES = [
  { icon: <Code />,       name: "AI Java Full Stack",      stack: "Java · Spring Boot · React",      salary: "₹4–7 LPA", color: "#4285F4" },
  { icon: <Code />,       name: "AI Python Full Stack",    stack: "Python · Django · REST · AI",     salary: "₹4–7 LPA", color: "#34A853" },
  { icon: <BarChart3 />,  name: "Data Analytics",          stack: "Excel · Python · SQL · Power BI",  salary: "₹3–5 LPA", color: "#FF9900" },
  { icon: <Brain />,      name: "Data Science & AI",       stack: "ML · Deep Learning · Gen AI",     salary: "₹5–8 LPA", color: "#A100FF" },
  { icon: <Brain />,      name: "AI & Machine Learning",   stack: "TensorFlow · PyTorch · Sklearn",  salary: "₹5–8 LPA", color: "#00A4EF" },
  { icon: <Shield />,     name: "Cyber Security",          stack: "Ethical Hacking · Network Sec",   salary: "₹3.5–6 LPA", color: "#EA4335" },
  { icon: <TrendingUp />, name: "Digital Marketing",       stack: "SEO · SEM · Social Media",        salary: "₹2.5–4.5 LPA", color: "#FF6B00" },
  { icon: <Monitor />,    name: "Office Automation",       stack: "MS Office Suite",                  salary: "₹1.8–3.2 LPA", color: "#737373" },
  { icon: <Calculator />, name: "Accounting Software",     stack: "Tally · QuickBooks",              salary: "₹1.8–3.5 LPA", color: "#014E9C" },
  { icon: <Palette />,    name: "UI & UX Design",          stack: "Figma · Design Thinking",         salary: "₹3–6 LPA", color: "#EA4335" },
  { icon: <Layers />,     name: "MEAN Stack Development",  stack: "MongoDB · Express · Angular · Node", salary: "₹3–6 LPA", color: "#78BE20" },
  { icon: <Layers />,     name: "MERN Stack Development",  stack: "MongoDB · Express · React · Node",   salary: "₹3–6 LPA", color: "#61DAFB" },
];

const TESTIMONIALS = [
  { name: "Deepak Kumar",    role: "Full Stack Developer", review: "Trainers explain concepts clearly and focus on practical coding and real projects. I improved in HTML, CSS, JavaScript, React, Node, and databases with hands-on practice. Resume and interview support is very helpful.", rating: 5 },
  { name: "Silambarasan G.", role: "Frontend Developer",   review: "I learn easily coding languages at WeGrow. They give daily tasks based on what we learn. Devi Priya Mam explains everything with real-time examples — absolutely the best training experience.", rating: 5 },
  { name: "Jeya Kumar S.",   role: "Digital Marketer",     review: "In digital marketing the teaching method is super. Easy to understand the topics. Valuable and worth every rupee spent.", rating: 5 },
  { name: "Rama Lakshmi",    role: "IT Professional",      review: "Well organised, highly trained trainers, wide range of courses. The placement support they provided helped me land my first job within weeks of completing the course.", rating: 5 },
];

const FAQS = [
  { q: "Who can join WeGrow courses?", a: "WeGrow welcomes freshers, graduates, working professionals, and anyone looking to upskill. We have flexible weekend and evening batches designed for working professionals." },
  { q: "Will I work on real projects?", a: "Yes. Students work on live client projects in web development, app development, and digital marketing — giving you a professional portfolio before you even graduate." },
  { q: "What placement support is provided?", a: "End-to-end support: resume preparation, mock interviews (technical + HR), direct referrals to 150+ hiring partners across IT firms, MNCs, startups, and remote opportunities." },
  { q: "What is the course duration?", a: "Courses range from 2 to 6 months depending on the program, structured to ensure complete skill mastery before entering the job market." },
];

const CAMPUSES = [
  {
    name: "Sivakasi Campus",
    tag: "Main Campus",
    tagColor: "#014E9C",
    tagBg: "#EEF4FD",
    address: "100A/5, 1st Floor, Thiruthangal Road, Opposite Bell Hotel, Sivakasi – 626123",
    phone: "+91 93443 37331",
    email: "enquiry@wegrowcampus.in",
    hours: "Mon – Sat: 9:00 AM – 7:00 PM",
    mapHref: "https://maps.google.com/?q=WeGrow+Skill+Campus+Sivakasi",
  },
  {
    name: "Srivilliputtur Campus",
    tag: "Branch Campus",
    tagColor: "#FF6B00",
    tagBg: "#FFF4EE",
    address: "129, North Car Street, Opposite Bombay Textiles, Upstairs Pathras Kids & Gift Shop, Srivilliputtur – 626125",
    phone: "+91 93633 37331",
    email: "enquiry@wegrowcampus.in",
    hours: "Mon – Sat: 9:00 AM – 7:00 PM",
    mapHref: "https://maps.google.com/?q=WeGrow+Skill+Campus+Srivilliputtur",
  },
];

/* ─── SUB COMPONENTS ─── */
const StarRating = ({ n }: { n: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="w-3.5 h-3.5" fill={i < n ? "#FBBF24" : "none"} stroke={i < n ? "#FBBF24" : "#D1D5DB"} />
    ))}
  </div>
);

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${open ? "border-[#014E9C]/30 bg-[#FAFBFF]" : "border-slate-200 bg-white"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
        <span className="font-semibold text-[15px] text-[#0B1F4B] leading-snug">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#014E9C] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="px-6 pb-5 pt-2 text-[14px] text-slate-600 leading-relaxed border-t border-slate-100">{a}</p>
      )}
    </div>
  );
};

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function AboutPageClient() {
  return (
    <main className="w-full bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ══════════════════════════════════════
          1. HERO — full-bleed image overlay
      ══════════════════════════════════════ */}
      <section className="relative w-full h-[92vh] min-h-[560px] max-h-[820px] overflow-hidden flex items-center">
        {/* Background image */}
        <Image
          src="/about/campus-hero.webp"
          alt="WeGrow Skill Campus — IT Training Lab"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001B69]/92 via-[#001B69]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001B69]/60 via-transparent to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10 lg:px-16 w-full">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/25 backdrop-blur-sm rounded-full px-4 py-2 mb-7">
              <span className="w-2 h-2 rounded-full bg-[#FF9900] animate-pulse" />
              <span className="text-white/90 text-[12px] font-bold tracking-widest uppercase">
                Sivakasi &amp; Srivilliputtur&apos;s Premier IT Training Institute
              </span>
            </div>

            <h1 className="text-[42px] sm:text-[54px] lg:text-[62px] font-extrabold text-white leading-[1.1] mb-5">
              Empowering the Next<br />
              <span className="text-[#FF9900]">Generation of IT Talent</span>
            </h1>
            <p className="text-white/70 text-[16px] sm:text-[18px] leading-relaxed mb-9 max-w-xl">
              WeGrow Skill Campus bridges the gap between education and industry — through real
              projects, expert mentors, and a 98% placement record.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/student/register"
                className="inline-flex items-center gap-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold px-7 py-4 rounded-xl text-[14px] transition-all duration-200 hover:-translate-y-0.5 shadow-xl shadow-orange-600/30"
              >
                <GraduationCap className="w-4 h-4" /> Enroll Today
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919344337331"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm text-white font-semibold px-7 py-4 rounded-xl text-[14px] transition-all duration-200"
              >
                Talk to an Advisor
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade into white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
      </section>


      {/* ══════════════════════════════════════
          2. STATS STRIP
      ══════════════════════════════════════ */}
      <section className="relative z-20 -mt-8 w-full px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/60 p-5 flex flex-col items-center text-center gap-1 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: `${s.color}15`, color: s.color }}>
                  {s.icon}
                </div>
                <p className="text-[32px] sm:text-[38px] font-extrabold leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="font-bold text-[13px] text-[#0B1F4B] mt-1">{s.label}</p>
                <p className="text-[11px] text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          3. OUR STORY — image + text split
      ══════════════════════════════════════ */}
      <section className="w-full py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image side */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50 aspect-[4/3]">
                <Image
                  src="/about/mentor-session.webp"
                  alt="WeGrow mentor giving personalized guidance"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#34A853]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#34A853]" />
                </div>
                <div>
                  <p className="text-[22px] font-extrabold text-[#34A853] leading-none">98%</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Placement Rate</p>
                </div>
              </div>
              {/* Accent dot decoration */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl bg-[#FF6B00]/8 border border-[#FF6B00]/15" />
              <div className="absolute top-6 left-6 w-8 h-8 rounded-full bg-[#FF6B00]/20" />
            </div>

            {/* Text side */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFF4EE] text-[#FF6B00] rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-5">
                <Heart className="w-3.5 h-3.5" /> About WeGrow
              </div>
              <h2 className="text-[32px] sm:text-[40px] font-extrabold text-[#0B1F4B] leading-tight mb-5">
                We Don&apos;t Just Train —<br />
                <span className="text-[#014E9C]">We Build Careers</span>
              </h2>
              <p className="text-slate-600 text-[15px] leading-[1.85] mb-5">
                WeGrow Skill Campus was built on one conviction: the biggest challenge students
                face isn&apos;t a lack of talent — it&apos;s the gap between academic degrees and
                industry-ready competence.
              </p>
              <p className="text-slate-600 text-[15px] leading-[1.85] mb-7">
                Our students don&apos;t just memorize concepts. They{" "}
                <strong className="text-[#014E9C]">build, analyze, optimize, and deploy</strong>{" "}
                under professional guidance — graduating with a real portfolio, industry connections,
                and a job-ready mindset.
              </p>

              {/* Quote */}
              <div className="relative pl-5 py-1">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF6B00] to-[#FF9900] rounded-full" />
                <p className="text-[14px] italic text-slate-600 leading-relaxed">
                  &quot;The biggest problem students face today isn&apos;t a lack of talent. It&apos;s the gap
                  between education and career. That&apos;s exactly the gap WeGrow was built to close.&quot;
                </p>
                <p className="text-[12px] font-bold text-[#FF6B00] mt-2">— WeGrow Founders</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/student/register" className="inline-flex items-center gap-2 bg-[#014E9C] hover:bg-[#013a75] text-white font-bold px-6 py-3 rounded-xl text-[13px] transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-blue-900/20">
                  <GraduationCap className="w-4 h-4" /> View Courses
                </Link>
                <a href="https://wa.me/919344337331" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0B1F4B] font-semibold px-6 py-3 rounded-xl text-[13px] transition-all duration-200">
                  Enquire Now →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          4. CORE PILLARS
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-slate-50/80 to-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#EEF4FD] text-[#014E9C] rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-4">
              <Award className="w-3.5 h-3.5" /> What Sets Us Apart
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-[#0B1F4B] mb-3">Our Core Pillars</h2>
            <p className="text-slate-500 text-[15px] max-w-lg mx-auto">Everything we do is designed to make you career-ready from day one.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((p) => (
              <div key={p.title} className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-default">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: `${p.color}12`, color: p.color }}>
                  {React.cloneElement(p.icon, { className: "w-6 h-6" })}
                </div>
                <h3 className="font-bold text-[16px] text-[#0B1F4B] mb-2">{p.title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          5. PLACEMENT — image + checklist
      ══════════════════════════════════════ */}
      <section className="w-full py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text side — first on mobile */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-[#EDF9F1] text-[#34A853] rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-5">
                <Briefcase className="w-3.5 h-3.5" /> Placement Support
              </div>
              <h2 className="text-[32px] sm:text-[40px] font-extrabold text-[#0B1F4B] leading-tight mb-5">
                Your Career Journey<br />
                <span className="text-[#34A853]">Starts Here</span>
              </h2>
              <p className="text-slate-600 text-[15px] leading-[1.85] mb-8">
                We don&apos;t stop at training. Our dedicated placement team walks with you from
                your first lesson to your first offer letter — and beyond.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <BookOpen className="w-5 h-5" />, title: "Resume Preparation", desc: "Professional resumes crafted to get shortlisted by top recruiters.", color: "#4285F4" },
                  { icon: <Users className="w-5 h-5" />,    title: "Mock Interviews",    desc: "Full technical + HR mock rounds to build confidence.", color: "#FF6B00" },
                  { icon: <Building2 className="w-5 h-5" />, title: "Job Referrals",     desc: "Direct access to 150+ companies — IT firms, MNCs, startups, remote.", color: "#34A853" },
                  { icon: <Target className="w-5 h-5" />,   title: "Career Counseling",  desc: "1-on-1 sessions to map goals, fix gaps, and chart your path.", color: "#A100FF" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}12`, color: item.color }}>{item.icon}</div>
                    <div>
                      <p className="font-bold text-[14px] text-[#0B1F4B]">{item.title}</p>
                      <p className="text-[13px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image side */}
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50 aspect-[4/3]">
                <Image
                  src="/about/placement-success.webp"
                  alt="WeGrow student celebrating job offer"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div>
                  <p className="text-[22px] font-extrabold text-[#FF6B00] leading-none">150+</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Hiring Partners</p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-[#34A853]/8 border border-[#34A853]/15" />
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          6. COURSES GRID
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-slate-50/80 to-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#EEF4FD] text-[#014E9C] rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Programs
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-[#0B1F4B] mb-3">Courses We Offer</h2>
            <p className="text-slate-500 text-[15px] max-w-lg mx-auto">15+ industry-aligned programs. Hands-on. Placement-focused. 100% practical.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COURSES.map((c) => (
              <div key={c.name} className="group flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" style={{ background: `${c.color}12`, color: c.color }}>
                  {React.cloneElement(c.icon, { className: "w-5 h-5" })}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-[14px] text-[#0B1F4B] mb-0.5 leading-snug">{c.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium mb-2 truncate">{c.stack}</p>
                  <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${c.color}12`, color: c.color }}>
                    {c.salary}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/student/register" className="inline-flex items-center gap-2 bg-[#014E9C] hover:bg-[#013a75] text-white font-bold px-8 py-4 rounded-xl text-[14px] transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-blue-900/20">
              <GraduationCap className="w-4 h-4" /> Enroll in a Course <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          7. GLOBAL PARTNERSHIPS
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-br from-[#001B69] to-[#014E9C] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase text-white/80 mb-4">
              <Globe className="w-3.5 h-3.5" /> Global Reach
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-white mb-3">International Partnerships</h2>
            <p className="text-white/60 text-[15px] max-w-lg mx-auto">Global collaborations that open international career doors for WeGrow students.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { flag: "🇬🇧", country: "United Kingdom", partner: "Moxe Internationals India Pvt. Ltd.", desc: "A UK-based company partnering with WeGrow to provide students with international perspectives, industry benchmarks, and global career pathways.", accent: "#CF101A" },
              { flag: "🇪🇺", country: "Europe",         partner: "FX Careers",                        desc: "A Europe-based firm collaborating with WeGrow to offer cross-border professional opportunities and international industry relevance.", accent: "#003399" },
            ].map((g) => (
              <div key={g.country} className="bg-white/8 border border-white/15 rounded-2xl p-7 backdrop-blur-sm hover:bg-white/12 transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-4xl">{g.flag}</span>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">{g.country} Partner</span>
                    <h3 className="font-bold text-[15px] text-white">{g.partner}</h3>
                  </div>
                </div>
                <p className="text-white/60 text-[13px] leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          8. TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#FFFBEB] text-[#D97706] rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-4">
              <Star className="w-3.5 h-3.5" /> Student Stories
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-[#0B1F4B] mb-3">What Our Students Say</h2>
            <p className="text-slate-500 text-[15px]">Real words from real people who changed their futures at WeGrow.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {/* Quote mark */}
                <div className="text-[48px] leading-none text-[#014E9C]/10 font-serif mb-2 select-none">&ldquo;</div>
                <StarRating n={t.rating} />
                <p className="text-slate-600 text-[13px] leading-relaxed mt-3 mb-5 flex-1 italic">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#014E9C] to-[#FF6B00] flex items-center justify-center text-white font-extrabold text-[13px]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-[13px] text-[#0B1F4B]">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          9. FAQs
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#EEF4FD] text-[#014E9C] rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-4">Frequently Asked</div>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-[#0B1F4B]">Have Questions?</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          10. LOCATIONS
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#EDF9F1] text-[#34A853] rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-4">
              <MapPin className="w-3.5 h-3.5" /> Find Us
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-[#0B1F4B] mb-3">Our Campuses</h2>
            <p className="text-slate-500 text-[15px]">Visit us at either campus — we&apos;d love to meet you in person.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {CAMPUSES.map((c) => (
              <div key={c.name} className="bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="p-7">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: c.tagBg, color: c.tagColor }}>{c.tag}</span>
                      <h3 className="font-extrabold text-[18px] text-[#0B1F4B] mt-2">{c.name}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#EEF4FD] flex items-center justify-center group-hover:bg-[#014E9C]/10 transition-colors duration-300">
                      <Building2 className="w-6 h-6 text-[#014E9C]" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: <MapPin className="w-4 h-4 text-[#014E9C]" />,    text: c.address },
                      { icon: <Phone className="w-4 h-4 text-[#34A853]" />,     text: c.phone,  href: `tel:${c.phone}` },
                      { icon: <Mail className="w-4 h-4 text-[#FF6B00]" />,      text: c.email,  href: `mailto:${c.email}` },
                      { icon: <Clock className="w-4 h-4 text-[#A100FF]" />,     text: c.hours },
                    ].map((row, i) => (
                      <div key={i} className="flex items-start gap-3 text-[13px] text-slate-600">
                        <div className="shrink-0 mt-0.5">{row.icon}</div>
                        {row.href
                          ? <a href={row.href} className="hover:text-[#014E9C] transition-colors font-medium">{row.text}</a>
                          : <span>{row.text}</span>
                        }
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-100 px-7 py-4 bg-slate-50/50 flex gap-4">
                  <a href={`https://wa.me/91${c.phone.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-[#34A853] hover:underline flex items-center gap-1">WhatsApp <ArrowRight className="w-3 h-3" /></a>
                  <span className="text-slate-300">|</span>
                  <a href={c.mapHref} target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold text-[#014E9C] hover:underline flex items-center gap-1">Get Directions <ArrowRight className="w-3 h-3" /></a>
                  <span className="text-slate-300">|</span>
                  <a href={`mailto:${c.email}`} className="text-[12px] font-bold text-[#FF6B00] hover:underline flex items-center gap-1">Email <ArrowRight className="w-3 h-3" /></a>
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              { name: "Instagram", href: "https://www.instagram.com/wegrowskillcampus/", color: "#E1306C", bg: "#FFF0F5" },
              { name: "Facebook",  href: "https://www.facebook.com/share/18xhrEHChh/",  color: "#1877F2", bg: "#EBF3FF" },
              { name: "LinkedIn",  href: "https://www.linkedin.com/company/wegrow-skill-campus/", color: "#0077B5", bg: "#E8F4FF" },
              { name: "WhatsApp",  href: "https://wa.me/919344337331",                  color: "#25D366", bg: "#EDFBF2" },
            ].map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 border"
                style={{ color: s.color, background: s.bg, borderColor: `${s.color}25` }}>
                {s.name} ↗
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          11. CTA BANNER
      ══════════════════════════════════════ */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/about/campus-hero.webp" alt="" fill className="object-cover object-top opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#001B69] via-[#014E9C]/95 to-[#0369C7]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-10 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase text-white/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF9900] animate-pulse" /> Start Your Journey
          </div>
          <h2 className="text-[36px] sm:text-[48px] font-extrabold text-white leading-tight mb-5">
            Ready to Launch<br />
            <span className="text-[#FF9900]">Your Tech Career?</span>
          </h2>
          <p className="text-white/70 text-[16px] max-w-2xl mx-auto mb-10 leading-relaxed">
            Join hundreds of students who transformed their futures with WeGrow Skill Campus.
            Industry-ready training. Real projects. Guaranteed placement support.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/student/register" className="inline-flex items-center gap-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold px-8 py-4 rounded-xl text-[15px] transition-all duration-200 hover:-translate-y-0.5 shadow-2xl shadow-orange-600/30">
              <GraduationCap className="w-5 h-5" /> Enroll Now — It&apos;s Free to Register
            </Link>
            <a href="https://wa.me/919344337331" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl text-[15px] transition-all duration-200">
              Talk to an Advisor →
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
