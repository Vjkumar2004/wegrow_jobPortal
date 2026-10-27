"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Target,
  Users,
  Globe,
  Award,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Star,
  Briefcase,
  TrendingUp,
  Shield,
  Code,
  BarChart3,
  Brain,
  Monitor,
  Calculator,
  Palette,
  Layers,
  Building2,
  Heart,
  CheckCircle,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";

/* ─── DATA ─── */
const STATS = [
  {
    value: "15+",
    label: "Courses Offered",
    sub: "Industry-aligned programs",
    icon: <BookOpen className="w-5 h-5" />,
    color: "#014E9C",
    bg: "#EEF4FD",
  },
  {
    value: "98%",
    label: "Placement Rate",
    sub: "Consistent year-on-year",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "#22B573",
    bg: "#EDF9F1",
  },
  {
    value: "150+",
    label: "Hiring Partners",
    sub: "IT firms, MNCs & Startups",
    icon: <Building2 className="w-5 h-5" />,
    color: "#FF6B00",
    bg: "#FFF4EE",
  },
  {
    value: "2",
    label: "Global Partners",
    sub: "UK & European firms",
    icon: <Globe className="w-5 h-5" />,
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

const PILLARS = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Career Guidance",
    desc: "Strategic direction and personalized mentorship to navigate modern technology career pathways.",
    color: "#014E9C",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "1-on-1 Counselling",
    desc: "Personalized attention from experienced industry leads to map goals and close skill gaps.",
    color: "#FF6B00",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Placement Support",
    desc: "Direct access to 150+ hiring partners across IT services, product companies, and remote roles.",
    color: "#22B573",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Live Client Projects",
    desc: "Build real production-ready portfolio projects working on actual web, app, and AI products.",
    color: "#8B5CF6",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Exposure",
    desc: "International partnerships with UK and European companies for global career avenues.",
    color: "#0EA5E9",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Industry-Ready Tech",
    desc: "100% industry-aligned curriculum — learn modern stacks, code reviews, and cloud deployments.",
    color: "#EF4444",
  },
];

const COURSES = [
  { icon: <Code className="w-5 h-5" />, name: "AI Java Full Stack", stack: "Java · Spring Boot · React", salary: "₹4–7 LPA", color: "#014E9C" },
  { icon: <Code className="w-5 h-5" />, name: "AI Python Full Stack", stack: "Python · Django · REST · AI", salary: "₹4–7 LPA", color: "#22B573" },
  { icon: <BarChart3 className="w-5 h-5" />, name: "Data Analytics", stack: "Excel · Python · SQL · Power BI", salary: "₹3–5 LPA", color: "#FF9900" },
  { icon: <Brain className="w-5 h-5" />, name: "Data Science & AI", stack: "ML · Deep Learning · Gen AI", salary: "₹5–8 LPA", color: "#8B5CF6" },
  { icon: <Brain className="w-5 h-5" />, name: "AI & Machine Learning", stack: "TensorFlow · PyTorch · Scikit", salary: "₹5–8 LPA", color: "#0EA5E9" },
  { icon: <Shield className="w-5 h-5" />, name: "Cyber Security", stack: "Ethical Hacking · Network Sec", salary: "₹3.5–6 LPA", color: "#EF4444" },
  { icon: <TrendingUp className="w-5 h-5" />, name: "Digital Marketing", stack: "SEO · SEM · Social Media", salary: "₹2.5–4.5 LPA", color: "#FF6B00" },
  { icon: <Monitor className="w-5 h-5" />, name: "Office Automation", stack: "MS Office Suite · Workplace Tools", salary: "₹1.8–3.2 LPA", color: "#64748B" },
  { icon: <Calculator className="w-5 h-5" />, name: "Accounting Software", stack: "Tally Prime · QuickBooks", salary: "₹1.8–3.5 LPA", color: "#014E9C" },
  { icon: <Palette className="w-5 h-5" />, name: "UI & UX Design", stack: "Figma · Design Thinking", salary: "₹3–6 LPA", color: "#EC4899" },
  { icon: <Layers className="w-5 h-5" />, name: "MEAN Stack Development", stack: "MongoDB · Express · Angular · Node", salary: "₹3–6 LPA", color: "#10B981" },
  { icon: <Layers className="w-5 h-5" />, name: "MERN Stack Development", stack: "MongoDB · Express · React · Node", salary: "₹3–6 LPA", color: "#06B6D4" },
];

const TESTIMONIALS = [
  {
    name: "Deepak Kumar",
    role: "Full Stack Developer",
    review: "Trainers explain concepts clearly and focus on practical coding and real projects. I improved in HTML, CSS, JavaScript, React, Node, and databases with hands-on practice. Resume and interview support is very helpful.",
    rating: 5,
  },
  {
    name: "Silambarasan G.",
    role: "Frontend Developer",
    review: "I learn coding languages easily at WeGrow. They give daily tasks based on what we learn. Devi Priya Mam explains everything with real-time examples — absolutely the best training experience.",
    rating: 5,
  },
  {
    name: "Jeya Kumar S.",
    role: "Digital Marketer",
    review: "In digital marketing the teaching method is super. Easy to understand the topics. Practical campaign projects made the learning experience valuable and worth every rupee spent.",
    rating: 5,
  },
  {
    name: "Rama Lakshmi",
    role: "IT Professional",
    review: "Well organised, highly trained trainers, and a wide range of courses. The placement support they provided helped me land my first job within weeks of completing the course.",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "Who can join WeGrow courses?",
    a: "WeGrow welcomes college freshers, degree holders, working professionals, and career switchers looking to build high-income tech skills. Flexible weekend and evening batches are available.",
  },
  {
    q: "Will I work on real projects?",
    a: "Yes. Students build and deploy live client projects in web development, mobile apps, and digital marketing — giving you an impressive portfolio before you start interviewing.",
  },
  {
    q: "What placement support is provided?",
    a: "End-to-end assistance: resume building, mock technical and HR interviews, aptitude prep, and direct interview scheduling with 150+ hiring partners across IT companies, MNCs, and startups.",
  },
  {
    q: "What is the typical course duration?",
    a: "Courses range from 2 to 6 months depending on the specific program, structured to ensure complete concept mastery and practical readiness before graduation.",
  },
];

const CAMPUSES = [
  {
    name: "Sivakasi Campus",
    tag: "Main Campus",
    tagColor: "#014E9C",
    tagBg: "#EEF4FD",
    address: "193, 1A, Ayyappan Kovil, Opposite Naturals Salon & Spa, Downstairs, Parasakthi Colony, Sivakasi – 626123",
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
      <Star
        key={i}
        className="w-4 h-4"
        fill={i < n ? "#FBBF24" : "none"}
        stroke={i < n ? "#FBBF24" : "#D1D5DB"}
      />
    ))}
  </div>
);

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        open ? "border-[#014E9C]/30 bg-blue-50/20 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 cursor-pointer"
      >
        <span className="font-semibold text-[15px] sm:text-base text-[#0B1F4B] leading-snug">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#014E9C] shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="px-6 pb-5 pt-1 text-sm sm:text-[15px] text-slate-600 leading-relaxed border-t border-slate-100">
          {a}
        </p>
      )}
    </div>
  );
};

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function AboutPageClient() {
  return (
    <main className="w-full bg-[#F8FAFC] font-['Poppins',sans-serif] text-[#0B1F4B]">

      {/* ══════════════════════════════════════
          1. HERO SECTION (Clean, Modern, No BG Image)
      ══════════════════════════════════════ */}
      <section className="relative w-full bg-gradient-to-b from-[#EEF4FD]/80 via-white to-[#F8FAFC] pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80 overflow-hidden">
        {/* Subtle decorative glow shapes */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 bg-[#EAF2FC] text-[#014E9C] border border-[#014E9C]/15 rounded-full px-4 py-1.5 mb-5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase">
                  Sivakasi &amp; Srivilliputtur&apos;s Premier IT Training Institute
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0B1F4B] leading-[1.15] tracking-tight mb-5">
                Empowering the Next <br />
                <span className="text-[#FF6B00]">Generation of IT Talent</span>
              </h1>

              {/* Description */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                WeGrow Skill Campus bridges the gap between academic education and industry competence.
                Through live client projects, 1-on-1 industry mentorship, and a 98% placement track record,
                we help students launch successful high-growth careers.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-8">
                <Link
                  href="/student/register"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold px-7 py-3.5 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-lg shadow-orange-600/20 hover:-translate-y-0.5 cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Enroll Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/919344337331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#0B1F4B] font-semibold px-6 py-3.5 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-xs hover:border-slate-300 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#22B573]" />
                  <span>Talk to an Advisor</span>
                </a>

                <a
                  href="#campuses"
                  className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#014E9C] hover:text-[#013C78] px-3 py-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Visit Campuses</span>
                </a>
              </div>

              {/* Trust Micro-Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 w-full">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                  <CheckCircle className="w-4 h-4 text-[#22B573] shrink-0" />
                  <span>100% Practical Labs</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                  <CheckCircle className="w-4 h-4 text-[#22B573] shrink-0" />
                  <span>150+ Hiring Partners</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                  <CheckCircle className="w-4 h-4 text-[#22B573] shrink-0" />
                  <span>1-on-1 Mentorship</span>
                </div>
              </div>
            </div>

            {/* Right Visual Showcase Card (Replacing background image) */}
            <div className="lg:col-span-5 w-full">
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 overflow-hidden">
                {/* Header ribbon */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#014E9C]/10 flex items-center justify-center text-[#014E9C] font-bold">
                      <Sparkles className="w-5 h-5 text-[#014E9C]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#0B1F4B]">WeGrow Excellence</h3>
                      <p className="text-xs text-slate-500">Placement &amp; Upskilling Hub</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EDF9F1] text-[#22B573]">
                    <span className="w-2 h-2 rounded-full bg-[#22B573] animate-pulse" />
                    Admissions Open
                  </span>
                </div>

                {/* 2x2 Core Metric Tiles */}
                <div className="grid grid-cols-2 gap-3.5 my-6">
                  <div className="p-4 rounded-2xl bg-[#EEF4FD] border border-[#014E9C]/10">
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#014E9C] leading-none mb-1">98%</p>
                    <p className="text-xs font-semibold text-slate-700">Placement Record</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Consistent YoY</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFF4EE] border border-[#FF6B00]/10">
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#FF6B00] leading-none mb-1">150+</p>
                    <p className="text-xs font-semibold text-slate-700">Hiring Partners</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">IT, MNCs &amp; Startups</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#22B573]/10">
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#22B573] leading-none mb-1">15+</p>
                    <p className="text-xs font-semibold text-slate-700">Tech Programs</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Full Stack &amp; AI</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#8B5CF6]/10">
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#8B5CF6] leading-none mb-1">2</p>
                    <p className="text-xs font-semibold text-slate-700">Global Partners</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">UK &amp; Europe</p>
                  </div>
                </div>

                {/* Bottom Highlight */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <StarRating n={5} />
                    <span className="text-xs font-bold text-slate-800">4.9 / 5.0</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">500+ Alumni Reviews</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. STATS STRIP (Properly Aligned)
      ══════════════════════════════════════ */}
      <section className="w-full py-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-5 flex flex-col items-center text-center gap-1 hover:shadow-md hover:border-slate-300 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-1"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="font-bold text-sm text-[#0B1F4B] mt-0.5">{s.label}</p>
                <p className="text-xs text-slate-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. OUR STORY & MISSION
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Image Side */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3]">
                <Image
                  src="/about/mentor-session.webp"
                  alt="WeGrow mentor giving personalized guidance"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-3 sm:right-6 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#22B573]/10 flex items-center justify-center text-[#22B573]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-[#22B573] leading-none">98%</p>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Placement Success</p>
                </div>
              </div>
            </div>

            {/* Right Text Side */}
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center gap-2 bg-[#FFF4EE] text-[#FF6B00] rounded-full px-3.5 py-1 text-xs font-bold tracking-wider uppercase mb-4">
                <Heart className="w-3.5 h-3.5" /> About WeGrow
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F4B] leading-tight mb-5">
                We Don&apos;t Just Train — <br />
                <span className="text-[#014E9C]">We Build Tech Careers</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                WeGrow Skill Campus was founded with a singular conviction: the greatest obstacle college students
                face is not lack of talent, but the gap between theoretical classroom degrees and practical,
                production-grade industry competence.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Our learners work directly on live client projects under the mentorship of senior software engineers.
                They build, analyze, optimize, and deploy software — graduating with verifiable github portfolios,
                interview preparedness, and job-ready confidence.
              </p>

              {/* Quote Block */}
              <div className="relative pl-5 py-2 mb-8 border-l-4 border-[#FF6B00] bg-orange-50/40 rounded-r-xl pr-4">
                <p className="text-sm italic text-slate-700 leading-relaxed">
                  &quot;The biggest problem students face today isn&apos;t talent. It&apos;s the gap between education and career.
                  That&apos;s exactly the bridge WeGrow was built to construct.&quot;
                </p>
                <p className="text-xs font-bold text-[#FF6B00] mt-2">— WeGrow Campus Founders</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/student/register"
                  className="inline-flex items-center gap-2 bg-[#014E9C] hover:bg-[#013C78] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-blue-900/10 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" /> View Courses
                </Link>
                <a
                  href="https://wa.me/919344337331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0B1F4B] font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer"
                >
                  Enquire via WhatsApp →
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. CORE PILLARS
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-[#EEF4FD] text-[#014E9C] rounded-full px-3.5 py-1 text-xs font-bold tracking-wider uppercase mb-3">
              <Award className="w-3.5 h-3.5" /> What Sets Us Apart
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F4B] mb-3">
              Our Core Pillars
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Everything we do is engineered to make you job-ready from your very first week.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="group p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${p.color}14`, color: p.color }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-lg text-[#0B1F4B] mb-2">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. PLACEMENT ECOSYSTEM
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Text / Milestones */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#EDF9F1] text-[#22B573] rounded-full px-3.5 py-1 text-xs font-bold tracking-wider uppercase mb-4">
                <Briefcase className="w-3.5 h-3.5" /> Placement Support
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F4B] leading-tight mb-4">
                Your Career Journey <br />
                <span className="text-[#22B573]">Starts Here</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                We don&apos;t just conclude when lessons finish. Our dedicated recruitment team accompanies
                you through mock drives, portfolio evaluations, and direct partner referrals.
              </p>

              <div className="space-y-3.5">
                {[
                  { icon: <BookOpen className="w-5 h-5" />, title: "ATS-Optimized Resume Prep", desc: "Crafting modern industry resumes that pass recruiter screening filters.", color: "#014E9C" },
                  { icon: <Users className="w-5 h-5" />, title: "Technical & HR Mock Interviews", desc: "Rigorous simulation rounds that boost confidence and reduce interview anxiety.", color: "#FF6B00" },
                  { icon: <Building2 className="w-5 h-5" />, title: "Direct Referral Pipeline", desc: "Direct connections with 150+ verified hiring partners across India.", color: "#22B573" },
                  { icon: <Target className="w-5 h-5" />, title: "1-on-1 Career Counselling", desc: "Targeted skill guidance tailored to your strengths, degree, and career interests.", color: "#8B5CF6" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 bg-[#F8FAFC] hover:bg-white hover:shadow-md hover:border-slate-300 transition-all duration-200"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}15`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0B1F4B]">{item.title}</p>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image / Showcase */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3]">
                <Image
                  src="/about/placement-success.webp"
                  alt="WeGrow student celebrating placement"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating partner badge */}
              <div className="absolute -bottom-5 -left-3 sm:left-6 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-[#FF6B00] leading-none">150+</p>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Hiring Partners</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. COURSES WE OFFER
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-[#EEF4FD] text-[#014E9C] rounded-full px-3.5 py-1 text-xs font-bold tracking-wider uppercase mb-3">
              <BookOpen className="w-3.5 h-3.5" /> Programs
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F4B] mb-3">
              Courses We Offer
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              15+ industry-aligned programs. Hands-on coding. Placement focused. 100% practical.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {COURSES.map((c) => (
              <div
                key={c.name}
                className="group flex gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${c.color}15`, color: c.color }}
                >
                  {c.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-[#0B1F4B] mb-0.5 leading-snug">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-2.5 truncate">{c.stack}</p>
                  <span
                    className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: `${c.color}15`, color: c.color }}
                  >
                    Avg: {c.salary}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/student/register"
              className="inline-flex items-center gap-2 bg-[#014E9C] hover:bg-[#013C78] text-white font-bold px-8 py-3.5 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-md shadow-blue-900/15 cursor-pointer"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Enroll in a Course</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          7. GLOBAL PARTNERSHIPS (Clean Modern Card, No Pattern BG)
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#001B69] via-[#014E9C] to-[#0B2545] rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase text-white/90 mb-3">
                <Globe className="w-3.5 h-3.5" /> Global Reach
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                International Partnerships
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Strategic overseas collaborations that offer students international industry benchmarks and cross-border opportunities.
              </p>
            </div>

            <div className="relative grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  flag: "🇬🇧",
                  country: "United Kingdom",
                  partner: "Moxe Internationals India Pvt. Ltd.",
                  desc: "A UK-based enterprise partnering with WeGrow to provide students with international perspectives, industry benchmarks, and global career pathways.",
                },
                {
                  flag: "🇪🇺",
                  country: "Europe",
                  partner: "FX Careers",
                  desc: "A European firm collaborating with WeGrow to offer cross-border professional opportunities, global tech standards, and career relevance.",
                },
              ].map((g) => (
                <div
                  key={g.country}
                  className="bg-white/10 border border-white/15 rounded-2xl p-6 sm:p-7 backdrop-blur-xs hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <span className="text-4xl">{g.flag}</span>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200">
                        {g.country} Partner
                      </span>
                      <h3 className="font-bold text-base text-white">{g.partner}</h3>
                    </div>
                  </div>
                  <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          8. STUDENT TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-[#FFFBEB] text-[#D97706] rounded-full px-3.5 py-1 text-xs font-bold tracking-wider uppercase mb-3">
              <Star className="w-3.5 h-3.5" /> Student Stories
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F4B] mb-3">
              What Our Alumni Say
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Real feedback from students who transformed their technical knowledge and careers at WeGrow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl leading-none text-[#014E9C]/15 font-serif mb-2 select-none">&ldquo;</div>
                <StarRating n={t.rating} />
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-3 mb-6 flex-1 italic">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#014E9C] to-[#FF6B00] flex items-center justify-center text-white font-extrabold text-xs">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-[#0B1F4B]">{t.name}</p>
                    <p className="text-[11px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          9. FREQUENTLY ASKED QUESTIONS
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#EEF4FD] text-[#014E9C] rounded-full px-3.5 py-1 text-xs font-bold tracking-wider uppercase mb-3">
              Frequently Asked
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F4B] mb-3">
              Have Questions? We Have Answers.
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Clear information about admission, projects, and placements.
            </p>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          10. OUR CAMPUSES & CONTACT
      ══════════════════════════════════════ */}
      <section id="campuses" className="w-full py-16 sm:py-24 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-[#EDF9F1] text-[#22B573] rounded-full px-3.5 py-1 text-xs font-bold tracking-wider uppercase mb-3">
              <MapPin className="w-3.5 h-3.5" /> Find Us
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F4B] mb-3">
              Our Campuses
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Visit us in person at Sivakasi or Srivilliputtur — our academic counselors are ready to help.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {CAMPUSES.map((c) => (
              <div
                key={c.name}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-7">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <span
                        className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                        style={{ background: c.tagBg, color: c.tagColor }}
                      >
                        {c.tag}
                      </span>
                      <h3 className="font-extrabold text-xl text-[#0B1F4B] mt-2">{c.name}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF4FD] flex items-center justify-center text-[#014E9C]">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {[
                      { icon: <MapPin className="w-4 h-4 text-[#014E9C]" />, text: c.address },
                      { icon: <Phone className="w-4 h-4 text-[#22B573]" />, text: c.phone, href: `tel:${c.phone}` },
                      { icon: <Mail className="w-4 h-4 text-[#FF6B00]" />, text: c.email, href: `mailto:${c.email}` },
                      { icon: <Clock className="w-4 h-4 text-[#8B5CF6]" />, text: c.hours },
                    ].map((row, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                        <div className="shrink-0 mt-0.5">{row.icon}</div>
                        {row.href ? (
                          <a href={row.href} className="hover:text-[#014E9C] transition-colors font-medium">
                            {row.text}
                          </a>
                        ) : (
                          <span>{row.text}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 px-7 py-4 bg-slate-50/70 flex items-center justify-between gap-3 text-xs font-bold">
                  <a
                    href={`https://wa.me/91${c.phone.replace(/\D/g, "").slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#22B573] hover:underline flex items-center gap-1"
                  >
                    WhatsApp <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-slate-300">|</span>
                  <a
                    href={c.mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#014E9C] hover:underline flex items-center gap-1"
                  >
                    Get Directions <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-slate-300">|</span>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-[#FF6B00] hover:underline flex items-center gap-1"
                  >
                    Email Us <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Social Channels */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              { name: "LinkedIn", href: "https://www.linkedin.com/company/wegrow-skill-campus/posts/", color: "#0077B5", bg: "#E8F4FF" },
              { name: "Instagram", href: "https://www.instagram.com/wegrowskillcampus/", color: "#E1306C", bg: "#FFF0F5" },
              { name: "YouTube", href: "https://www.youtube.com/@wegrowskillcampus", color: "#FF0000", bg: "#FFF0F0" },
              { name: "Facebook", href: "https://www.facebook.com/wegrowskillcampus", color: "#1877F2", bg: "#EBF3FF" },
              { name: "WhatsApp", href: "https://wa.me/919344337331", color: "#25D366", bg: "#EDFBF2" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 border"
                style={{ color: s.color, background: s.bg, borderColor: `${s.color}25` }}
              >
                <span>{s.name}</span>
                <span>↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          11. BOTTOM CTA (No BG Image, Pure Gradient)
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#001B69] via-[#014E9C] to-[#001B69] rounded-3xl px-6 py-14 sm:px-12 sm:py-20 text-center shadow-xl relative overflow-hidden">
            {/* Ambient decorative glow */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase text-white/90 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#FF9900] animate-pulse" />
                <span>Start Your Career Journey</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
                Ready to Launch <br />
                <span className="text-[#FF9900]">Your Tech Career?</span>
              </h2>

              <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-9 leading-relaxed">
                Join hundreds of students who transformed their futures with WeGrow Skill Campus.
                Industry-ready training, live real-world projects, and dedicated placement support.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/student/register"
                  className="inline-flex items-center gap-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold px-8 py-3.5 rounded-xl text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-orange-600/30 cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Enroll Now — Free Registration</span>
                </Link>

                <a
                  href="https://wa.me/919344337331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-xs text-white font-semibold px-7 py-3.5 rounded-xl text-sm sm:text-base transition-all duration-200 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#22B573]" />
                  <span>Talk to an Advisor</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
