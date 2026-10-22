"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Lightbulb,
  Compass,
  Award,
  CheckCircle,
  ArrowRight,
  Clock,
  User,
  Share2,
  Bookmark,
  ThumbsUp,
  X,
  Search,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";

export interface CareerTipItem {
  id: string;
  title: string;
  readTime: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  tag: string;
  category: "Interview Technique" | "Portfolio Building" | "Salary Negotiation" | "Career Switch" | "Networking";
  publishedDate: string;
  excerpt: string;
  keyTakeaways: string[];
  content: {
    sectionTitle: string;
    paragraphs: string[];
    bulletPoints?: string[];
    callout?: string;
  }[];
  helpfulInitialCount: number;
}

const CAREER_TIPS_DATA: CareerTipItem[] = [
  {
    id: "star-technique-tech-interviews",
    title: "Mastering the STAR Technique in Tech Interviews",
    readTime: "5 min read",
    author: "Sneha Roy",
    authorRole: "Senior Tech Recruiter, Ex-Amazon",
    authorAvatar: "SR",
    tag: "Interview Technique",
    category: "Interview Technique",
    publishedDate: "October 2026",
    excerpt: "Learn how to structure your responses for Situation, Task, Action, and Result to leave a lasting impression during managerial and HR rounds.",
    helpfulInitialCount: 342,
    keyTakeaways: [
      "Keep Situation & Task brief (30% of your time); spend 70% on your specific Actions and quantifiable Results.",
      "Always state 'I did X' instead of 'We did X' when discussing technical implementation.",
      "Quantify your results with latency, test coverage, user counts, or time saved.",
    ],
    content: [
      {
        sectionTitle: "Why Behavioral Questions Matter in Engineering",
        paragraphs: [
          "Many candidates believe coding rounds are 100% of technical hiring. However, in tier-1 product companies and high-growth startups, managerial and behavioral rounds have equal veto power. Interviewers look for emotional intelligence, resilience when things break in production, and ownership.",
        ],
        callout: "Recruiter Rule: A strong coder with poor collaboration skills is a net negative on an engineering team.",
      },
      {
        sectionTitle: "The STAR Framework Breakdown",
        paragraphs: [
          "The STAR method is an internationally recognized interviewing technique that prevents rambling and ensures your story hits every critical evaluation criteria.",
        ],
        bulletPoints: [
          "Situation: Set the stage in 2 sentences. What was the company, project, or hackathon scope?",
          "Task: What was the exact bottleneck or objective you had to solve under constraint?",
          "Action: What specific tools, algorithms, or architectural decisions did YOU implement? Walk through the debugging process.",
          "Result: Conclude with numbers. Did API latency drop by 40%? Did 1,200 users adopt the feature? What did you learn?",
        ],
      },
      {
        sectionTitle: "Real Interview Scenario: Overcoming a Project Failure",
        paragraphs: [
          "Question: 'Tell me about a time an unexpected bug occurred right before a demo or submission.'",
          "Weak Answer: 'We worked late and fixed the code and everyone was happy.'",
          "Winning STAR Answer: 'During our college capstone demo, a race condition in our PostgreSQL connection pool crashed the server during concurrent logins (Situation). As backend lead, I had 45 minutes to restore the service without corrupting student records (Task). I checked our server logs, identified that connection pooling was exhausted at 100 connections, and reconfigured Prisma with a PgBouncer connection pooler while enabling connection timeouts (Action). The platform handled 350 simultaneous evaluations with zero dropouts, earning our team first place (Result).'",
        ],
      },
    ],
  },
  {
    id: "high-conversion-github-portfolio",
    title: "How to Build a High-Conversion GitHub Portfolio",
    readTime: "6 min read",
    author: "Aarav Gupta",
    authorRole: "Staff Software Architect, FinTech",
    authorAvatar: "AG",
    tag: "Portfolio Building",
    category: "Portfolio Building",
    publishedDate: "October 2026",
    excerpt: "Recruiters and engineering leads spend less than 30 seconds scanning your code. Here are 5 ways to make your pinned repositories instantly stand out.",
    helpfulInitialCount: 518,
    keyTakeaways: [
      "Every pinned repo must have a live deployed URL and a 10-second GIF or video demo.",
      "Write a professional README with Architecture Diagram, Tech Stack, and Local Setup instructions.",
      "Clean Git commit history (avoid 'fix bug', 'update', 'done'). Use conventional commit messages.",
    ],
    content: [
      {
        sectionTitle: "The 30-Second Engineering Scan",
        paragraphs: [
          "When an engineering manager opens your GitHub from your resume, they do not read 2,000 lines of your code. They look for 3 things: Is there a live demo they can click immediately? Is the README structured like an open-source project? Are commit messages descriptive?",
        ],
        callout: "A single project with complete test coverage and live deployment beats 10 half-finished tutorial clones.",
      },
      {
        sectionTitle: "The Golden README Structure",
        paragraphs: [
          "Your project README should read like an enterprise software documentation:",
        ],
        bulletPoints: [
          "Banner & Live Demo Button: Link directly to Vercel, Render, or AWS deployment.",
          "Problem Statement: What real-world user or business problem does this repository solve?",
          "Architecture Diagram: A clean ASCII or Mermaid flow chart showing Frontend -> API Gateway -> Database -> Cache.",
          "Tech Stack Badges: React, Next.js, TypeScript, PostgreSQL, Tailwind, Jest.",
          "Setup in 3 Commands: git clone, npm install, npm run dev.",
        ],
      },
      {
        sectionTitle: "Repository Cleanliness Checklist",
        paragraphs: [
          "Never commit `.env` files with secret keys. Include a `.env.example` with mock keys. Add a valid `.gitignore` so `node_modules` and build directories are never pushed to GitHub.",
        ],
      },
    ],
  },
  {
    id: "salary-negotiation-freshers",
    title: "Salary Negotiation Tactics for Recent College Graduates",
    readTime: "5 min read",
    author: "Vikram Mehta",
    authorRole: "Head of Talent Acquisition",
    authorAvatar: "VM",
    tag: "Salary Negotiation",
    category: "Salary Negotiation",
    publishedDate: "October 2026",
    excerpt: "Negotiating your first full-time offer or internship stipend doesn't have to be intimidating when you come prepared with verified market benchmarks.",
    helpfulInitialCount: 429,
    keyTakeaways: [
      "Never negotiate verbally on the spot. Always request the offer letter in writing and ask for 48 hours to evaluate.",
      "Anchor to verified market salary benchmarks for your city and tech stack.",
      "If base salary is fixed for freshers, negotiate signing bonus, relocation support, or remote allowance.",
    ],
    content: [
      {
        sectionTitle: "Myth: 'Freshers Cannot Negotiate'",
        paragraphs: [
          "Many candidates fear that asking for a compensation review will cause the company to revoke their job offer. In professional recruiting, rescinding an offer for polite negotiation is virtually non-existent.",
          "Companies invest tens of thousands of rupees recruiting and screening candidates. Once you have an offer, you have the highest leverage.",
        ],
        callout: "Always express enthusiastic gratitude first before introducing compensation adjustments.",
      },
      {
        sectionTitle: "The 48-Hour Evaluation Rule",
        paragraphs: [
          "When an HR calls with an offer, your immediate response should be: 'Thank you so much! I am thrilled about this offer and the team's vision. Could you please send the written offer letter with full breakdown to my email? I will review the compensation details and get back to you within 48 hours.'",
        ],
      },
      {
        sectionTitle: "Copy-Paste Negotiation Email Script",
        paragraphs: [
          "Subject: Re: Software Engineer Offer — [Your Full Name]\n\nDear [HR Name],\n\nThank you so much for the offer to join [Company Name] as a Software Engineer. I am very excited about the projects we discussed, particularly [Project Name].\n\nBased on my specialized background in [e.g. Next.js & Distributed Systems] and market benchmarks for comparable Bangalore roles (₹8.5L - ₹10L LPA), I was hoping we could explore a base compensation of [Target Figure, e.g. ₹9.2L LPA]. If base salary bands are strictly fixed for campus batches, I would also welcome discussing a one-time joining bonus or relocation assistance.\n\nI am eager to make an immediate impact at [Company Name] and look forward to your thoughts.\n\nWarm regards,\n[Your Name]",
        ],
      },
    ],
  },
  {
    id: "non-cs-to-software-transition",
    title: "Transitioning from Non-CS Engineering to Software Roles",
    readTime: "7 min read",
    author: "Pooja Hegde",
    authorRole: "Engineering Manager, Cloud Platform",
    authorAvatar: "PH",
    tag: "Career Switch",
    category: "Career Switch",
    publishedDate: "October 2026",
    excerpt: "A realistic 6-month roadmap tailored for mechanical, electrical, and civil engineering graduates aiming to break into modern cloud and web engineering.",
    helpfulInitialCount: 680,
    keyTakeaways: [
      "Focus deeply on one modern language (TypeScript or Python) instead of jumping across 5 languages.",
      "Master the fundamental 50 LeetCode interview patterns — not 500 random problems.",
      "Build 2 full-stack, end-to-end applications solving authentic operational problems.",
    ],
    content: [
      {
        sectionTitle: "The Truth About the 'CS Degree' Requirement",
        paragraphs: [
          "Over 38% of professional software engineers in India graduated from Mechanical, Electrical, Civil, or Chemical streams. Technology companies care about execution, problem solving, and ability to read documentation over college department titles.",
        ],
        callout: "Your non-CS background gives you unique multidisciplinary problem-solving and domain logic skills.",
      },
      {
        sectionTitle: "Phase 1: Foundation (Months 1–2)",
        paragraphs: [
          "Pick ONE programming language. We strongly recommend TypeScript (covers both React frontend and Node.js backend) or Python.",
        ],
        bulletPoints: [
          "Understand memory, objects, asynchronous event loops (Promises, async/await).",
          "Learn Git and GitHub from day 1 — push code commits daily.",
          "Build 3 small CLI or utility tools without copying tutorials.",
        ],
      },
      {
        sectionTitle: "Phase 2: Data Structures & Web Architecture (Months 3–4)",
        paragraphs: [
          "Solve 2 DSA problems daily on LeetCode focusing on Arrays, Hash Maps, Two Pointers, and Binary Trees.",
          "Build a full-stack REST API with PostgreSQL database, JWT authentication, and pagination.",
        ],
      },
      {
        sectionTitle: "Phase 3: Production Polish & Portfolio (Months 5–6)",
        paragraphs: [
          "Deploy your project to a public URL (e.g. Vercel + Neon/Supabase DB). Write clean API documentation with Postman or Swagger.",
          "Network directly with startup founders and tech leads on LinkedIn and WeGrow Jobz.",
        ],
      },
    ],
  },
  {
    id: "linkedin-cold-outreach",
    title: "How to Cold Message Recruiters on LinkedIn & Get Replies",
    readTime: "4 min read",
    author: "Kavita Swaminathan",
    authorRole: "Founder & Career Coach",
    authorAvatar: "KS",
    tag: "Networking",
    category: "Networking",
    publishedDate: "October 2026",
    excerpt: "Generic 'Hi please review my resume' messages get ignored. Use this 3-sentence hook framework that yields 40%+ recruiter response rates.",
    helpfulInitialCount: 295,
    keyTakeaways: [
      "Keep outreach messages under 75 words — recruiters read on mobile screens between meetings.",
      "Reference a specific opening (Job ID) and highlight your top matching skill.",
      "End with a low-friction question, not an aggressive demand for a job.",
    ],
    content: [
      {
        sectionTitle: "Why 90% of LinkedIn Messages are Ignored",
        paragraphs: [
          "Recruiters receive 50+ DMs every day saying: 'Dear Sir, I am fresher looking for job, please consider my resume'. These messages require the recruiter to do research on what role you fit for. They simply archive them.",
        ],
        callout: "Make it effortless for the recruiter to say 'Send me your resume'.",
      },
      {
        sectionTitle: "The 3-Sentence High-Conversion Script",
        paragraphs: [
          "Template:\n'Hi [Name], I noticed [Company Name] is hiring a [Role Name, e.g. Frontend Engineer - Job #1042]. I recently built [Relevant Project, e.g. a campus portal with Next.js & TypeScript] that handles [Key Metric, e.g. 10k users], which matches your stack. Would you be open to me forwarding my 1-page ATS resume for consideration?'",
        ],
      },
    ],
  },
  {
    id: "campus-coding-round-speed",
    title: "Speed & Accuracy Secrets for Online Coding Screening Rounds",
    readTime: "5 min read",
    author: "Rohit Deshmukh",
    authorRole: "Competitive Programmer & Senior SDE",
    authorAvatar: "RD",
    tag: "Interview Technique",
    category: "Interview Technique",
    publishedDate: "October 2026",
    excerpt: "Campus tests on HackerEarth, HackerRank, and Mettl require speed and edge-case handling. Here's how to pass hidden test cases consistently.",
    helpfulInitialCount: 388,
    keyTakeaways: [
      "Always check input constraints: N <= 10^5 means an O(N^2) solution will Time Out (TLE).",
      "Watch for Integer Overflow in languages like Java/C++ (use 64-bit Long for cumulative sums).",
      "Test boundary edge cases before submitting: empty array, single element, negative values.",
    ],
    content: [
      {
        sectionTitle: "The Constraint Rule Table",
        paragraphs: [
          "Before writing a single line of code, look at the constraints:",
        ],
        bulletPoints: [
          "N <= 10–20: Backtracking, O(2^N) or O(N!) is acceptable.",
          "N <= 1,000: O(N^2) nested loops will pass within 1 second.",
          "N <= 100,000: O(N log N) or O(N) is strictly required.",
          "N >= 10^9: O(log N) or O(1) mathematical closed-form formula.",
        ],
      },
      {
        sectionTitle: "Passing Hidden Test Cases",
        paragraphs: [
          "When your solution passes 12/15 test cases, the 3 failing tests are almost always: 1) Negative numbers, 2) Integer overflow (> 2^31 - 1), or 3) Duplicate elements.",
        ],
      },
    ],
  },
];

export default function CareerTipsClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [activeTipModal, setActiveTipModal] = useState<CareerTipItem | null>(null);
  const [helpfulCounts, setHelpfulCounts] = useState<{ [id: string]: number }>({});
  const [hasVoted, setHasVoted] = useState<{ [id: string]: boolean }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Initialize search to empty
  React.useEffect(() => {
    setSearchQuery("");
  }, []);

  const categories = [
    "All",
    "Interview Technique",
    "Portfolio Building",
    "Salary Negotiation",
    "Career Switch",
    "Networking",
  ];

  const filteredTips = useMemo(() => {
    return CAREER_TIPS_DATA.filter((tip) => {
      const matchCat =
        selectedCategory === "All" || tip.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        tip.title.toLowerCase().includes(q) ||
        tip.excerpt.toLowerCase().includes(q) ||
        tip.author.toLowerCase().includes(q) ||
        tip.tag.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleHelpfulClick = (tipId: string, initialCount: number) => {
    if (hasVoted[tipId]) {
      showToast("You have already voted this guide as helpful!");
      return;
    }
    const current = helpfulCounts[tipId] ?? initialCount;
    setHelpfulCounts((prev) => ({ ...prev, [tipId]: current + 1 }));
    setHasVoted((prev) => ({ ...prev, [tipId]: true }));
    showToast("✓ Thank you! Marked as helpful.");
  };

  const handleCopyTakeaways = (tip: CareerTipItem) => {
    const text = `Key Takeaways for "${tip.title}":\n` + tip.keyTakeaways.map((t) => `• ${t}`).join("\n") + "\n\nSource: WeGrow Jobz Career Guides";
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(true);
      showToast("✓ Key takeaways copied to clipboard!");
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-['Poppins',sans-serif] text-[#0B1F4B]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F4B] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm animate-in slide-in-from-top-3 border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-[#22B573] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-white border-b border-[#EEF1F7] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FFF3E6] text-[#F79400] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Mentorship &amp; Industry Advice</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Career Tips &amp; Interview Guides
          </h1>
          <p className="text-sm sm:text-base text-[#6B7694] max-w-2xl mx-auto mt-3 leading-relaxed">
            Actionable strategies, proven email scripts, and insider wisdom from senior tech leads, engineering managers, and campus recruiters across India.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto mt-8 relative">
            <Search className="w-5 h-5 text-[#6B7694] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides (e.g. STAR, Salary, GitHub, Non-CS, LinkedIn)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F6FA] hover:bg-white focus:bg-white text-sm text-[#0B1F4B] pl-11 pr-10 py-3.5 rounded-2xl border border-[#E3E8F0] focus:border-[#014E9C] focus:ring-2 focus:ring-[#014E9C]/15 outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#014E9C] text-white shadow-sm shadow-[#014E9C]/30"
                      : "bg-white text-[#6B7694] border border-[#E3E8F0] hover:border-[#014E9C] hover:text-[#014E9C]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-[#6B7694] font-medium">
            Showing <span className="font-bold text-[#0B1F4B]">{filteredTips.length}</span> actionable guides
          </p>
          <span className="text-xs text-[#F79400] font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F79400]" /> Verified Recruiter Insights
          </span>
        </div>

        {filteredTips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTips.map((tip) => (
              <article
                key={tip.id}
                onClick={() => setActiveTipModal(tip)}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-[#014E9C]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-bold text-[#014E9C] bg-blue-50 px-2.5 py-0.5 rounded-md text-[11px]">
                      {tip.tag}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {tip.readTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0B1F4B] group-hover:text-[#014E9C] transition-colors mb-2 leading-snug">
                    {tip.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {tip.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#014E9C] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {tip.authorAvatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{tip.author}</p>
                      <p className="text-[10px] text-slate-400 truncate">{tip.authorRole}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#014E9C] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No matching articles found</h3>
            <p className="text-xs text-slate-500 mb-4">Try searching for keywords like STAR, Salary, GitHub, or Resume.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#014E9C]"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>

      {/* ================= READING MODAL ================= */}
      {activeTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 to-[#0B1F4B] text-white relative">
              <button
                type="button"
                onClick={() => setActiveTipModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-2 bg-[#F79400] text-slate-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md mb-2">
                <span>{activeTipModal.tag}</span>
                <span>•</span>
                <span>{activeTipModal.readTime}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold leading-snug pr-8">
                {activeTipModal.title}
              </h2>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-[#014E9C] text-white text-xs font-bold flex items-center justify-center shrink-0 border border-white/20">
                  {activeTipModal.authorAvatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{activeTipModal.author}</p>
                  <p className="text-[11px] text-slate-300">{activeTipModal.authorRole}</p>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-5 sm:p-6 max-h-[62vh] overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
              {/* Key Takeaways Box */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#014E9C] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Key Takeaways
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyTakeaways(activeTipModal)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#014E9C] hover:underline"
                  >
                    {copiedKey ? <Check className="w-3 h-3 text-[#22B573]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activeTipModal.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22B573] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sections */}
              {activeTipModal.content.map((sec, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-[#0B1F4B]">
                    {sec.sectionTitle}
                  </h3>

                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {p}
                    </p>
                  ))}

                  {sec.bulletPoints && (
                    <ul className="space-y-1.5 pl-2">
                      {sec.bulletPoints.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#014E9C] shrink-0 mt-2" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.callout && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border-l-4 border-[#F79400] text-xs font-medium text-amber-900 leading-relaxed">
                      💡 {sec.callout}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  handleHelpfulClick(
                    activeTipModal.id,
                    activeTipModal.helpfulInitialCount
                  )
                }
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  hasVoted[activeTipModal.id]
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted[activeTipModal.id] ? "fill-emerald-600" : ""}`} />
                <span>
                  Helpful ({helpfulCounts[activeTipModal.id] ?? activeTipModal.helpfulInitialCount})
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTipModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#014E9C] hover:bg-[#013C78] transition shadow-xs"
                >
                  <span>Apply with this Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
