"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Download,
  FileText,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  X,
  Share2,
  BookOpen,
  ArrowRight,
  Code2,
  Layers,
  Star,
  Eye,
  FileDown,
} from "lucide-react";

export interface ResourceItem {
  id: string;
  title: string;
  category: "Technical Prep" | "System Design" | "Resume Kit" | "HR Interview";
  description: string;
  badge: string;
  type: string;
  format: "PDF" | "DOCX" | "MD" | "CHEATSHEET";
  downloads: string;
  rating: number;
  size: string;
  topics: string[];
  previewContent: string;
  downloadContent: string;
}

const RESOURCES_DATA: ResourceItem[] = [
  {
    id: "dsa-handbook",
    title: "Data Structures & Algorithms Cheat Sheet & Top 120 Questions",
    category: "Technical Prep",
    description: "Curated 120-question sheet with optimal time/space complexity solutions in Java, Python, and C++ covering LeetCode Blind 75 and campus placement favorites.",
    badge: "Most Popular",
    type: "Comprehensive Guide",
    format: "PDF",
    downloads: "14,800+",
    rating: 4.9,
    size: "4.2 MB",
    topics: [
      "Two Pointers & Sliding Window Patterns",
      "Dynamic Programming: 1D & 2D Memoization",
      "Binary Trees, BST & Lowest Common Ancestor",
      "Graph Traversals (BFS, DFS, Dijkstra, Kahn's Algorithm)",
      "Bit Manipulation & Math Interview Tricks",
    ],
    previewContent: `// Sample Pattern: Sliding Window Maximum
// Time: O(N) using Monotonic Deque
function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  const deque: number[] = []; // stores indices

  for (let i = 0; i < nums.length; i++) {
    // 1. Remove elements outside the current window
    if (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }
    // 2. Remove smaller elements from back
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    deque.push(i);
    // 3. Add to result once window reaches size k
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}`,
    downloadContent: `# WeGrow Jobz — DSA Top 120 Interview Question Bank & Optimal Solutions

## 1. Core Problem Solving Patterns
- Two Pointers: Left & Right inwards, Fast & Slow cycle detection (Floyd's algorithm).
- Sliding Window: Fixed window (k-size maximum) & Dynamic window (longest substring without repeating characters).
- Binary Search on Answer space: Allocating minimum pages, Koko eating bananas.
- Tree Traversals: Level order with queue, Recursive preorder/inorder/postorder, Diameter of tree.
- Graph Cycles: Visited + In-stack arrays for Directed graphs; Union-Find for Undirected graphs.
- DP Top-Down vs Bottom-Up: 0/1 Knapsack, Coin Change, Longest Common Subsequence (LCS).

## 2. Complexity Benchmarks (Must Memorize)
- Array Sort: O(N log N)
- Binary Search: O(log N)
- Hash Map Lookup: O(1) average, O(N) worst case
- Tree Traversal: O(N) time, O(H) space
- Graph BFS/DFS: O(V + E) time, O(V) space

© WeGrow Skill Campus — Prepared for Campus Recruitment Drives`,
  },
  {
    id: "system-design",
    title: "System Design & Scalable Microservices Architecture Guide",
    category: "System Design",
    description: "Step-by-step engineering breakdown of designing high-throughput URL shorteners, distributed rate limiters, caching layers, and message brokers.",
    badge: "Advanced Tech",
    type: "Architecture Blueprint",
    format: "PDF",
    downloads: "9,400+",
    rating: 4.8,
    size: "6.1 MB",
    topics: [
      "CAP Theorem, PACELC & Consistency Models",
      "Distributed Caching (Redis Cache-Aside, Write-Through)",
      "Database Sharding, Replication & Read-Replicas",
      "Message Queues (Kafka, RabbitMQ) & Idempotency",
      "Designing a Scalable URL Shortener (TinyURL)",
    ],
    previewContent: `TinyURL High-Level Architecture:
[User Request]
       │
  (HTTPS GET /abc12)
       ▼
[Cloudflare CDN & Rate Limiter]
       │
       ▼
[API Gateway (Reverse Proxy / Nginx)]
       │
  ┌────┴───────────────────────────┐
  ▼                                ▼
[URL Read Service]          [URL Write Service]
  │                                │
  ▼                                ▼
[Redis Distributed Cache]   [Base62 Hash Token Generator]
  │ (Cache Miss)                   │
  └────────► [Distributed PostgreSQL Sharded DB]`,
    downloadContent: `# WeGrow Jobz — System Design Interview Architecture Blueprint

## 1. High-Level System Design Steps
1. Requirements Clarification: Functional (generate short URL, redirect) vs Non-Functional (99.99% availability, <10ms redirect latency).
2. Capacity Estimation: Read/Write ratio (e.g., 100:1 read heavy), QPS estimation, Storage requirements over 5 years.
3. API Schema Definition: POST /api/v1/urls (create), GET /{shortCode} (redirect 302 vs 301).
4. Data Modeling: SQL vs NoSQL. ShortCode (PK), OriginalURL, CreatedAt, UserID.
5. High Level Design: DNS -> Load Balancer -> Web Servers -> Cache Layer (Redis) -> Database.
6. Deep Dives: Base62 encoding vs Key Generation Service (KGS), Hash collision prevention, Cache invalidation.

## 2. Key Terminology
- Sharding: Horizontal database partitioning using Hash-based or Range-based keys.
- Rate Limiting: Token Bucket and Leaky Bucket algorithms to defend against DDoS.
- Idempotency: Ensuring retried network requests don't cause duplicate charges or entries.

© WeGrow Skill Campus — Enterprise Architecture Study Kit`,
  },
  {
    id: "ats-resume-kit",
    title: "ATS-Optimized Tech Resume Template & Keyword Optimization Kit",
    category: "Resume Kit",
    description: "Battle-tested against enterprise Applicant Tracking Systems (Workday, Taleo, Greenhouse) with a 94% parse pass rate across campus hiring drives.",
    badge: "Must Have",
    type: "DOCX & Markdown Template",
    format: "DOCX",
    downloads: "31,200+",
    rating: 5.0,
    size: "1.8 MB",
    topics: [
      "Clean Single-Column Layout readable by all ATS bots",
      "XYZ Resume Bullet Formula: Accomplished [X] measured by [Y] by doing [Z]",
      "High-Frequency Keywords for Frontend, Backend, Full Stack & AI roles",
      "Projects Showcase Structure with live deployment & GitHub links",
    ],
    previewContent: `[CANDIDATE FULL NAME]
Chennai, Tamil Nadu | +91 98765 43210 | candidate@example.com
LinkedIn: linkedin.com/in/profile | GitHub: github.com/profile | Portfolio: wegrowjobz.com

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, Java, SQL
- Frontend: React.js, Next.js, Tailwind CSS, Redux Toolkit
- Backend & Cloud: Node.js, Express, PostgreSQL, Prisma, AWS S3, Docker
- Developer Tools: Git, GitHub Actions, Postman, Jest

FEATURED PROJECTS
Campus Placement Portal (Full Stack) | React, Next.js, Node.js, PostgreSQL
- Built role-based portal for 15,000+ students and 200+ corporate recruiters.
- Implemented real-time status notifications and resume parsing, reducing hiring cycle by 35%.`,
    downloadContent: `# ATS-Optimized Technical Resume Template
Author: WeGrow Skill Campus

============================================================
[FIRST NAME] [LAST NAME]
[City, State, India] | [+91 XXXXXXXXXX] | [email@domain.com]
[LinkedIn Profile URL] | [GitHub URL] | [Portfolio Website URL]
============================================================

SUMMARY
Enthusiastic and results-driven Software Engineer with hands-on experience in full-stack web applications, RESTful APIs, and database modeling. Proven ability to architect clean, maintainable code and collaborate in Agile teams.

TECHNICAL SKILLS
- Programming Languages: TypeScript, JavaScript (ES6+), Python, Java, C++
- Frameworks & Libraries: React, Next.js, Node.js, Express.js, Tailwind CSS
- Databases: PostgreSQL, MongoDB, Redis, MySQL
- Cloud & DevOps: Docker, AWS (EC2, S3), Git, CI/CD GitHub Actions
- Core Competencies: Data Structures & Algorithms, System Design, REST APIs, Object-Oriented Design

EDUCATION
Bachelor of Technology / Engineering in Computer Science
[Your College / University Name], [City] | Graduating [Year]
CGPA / Percentage: [8.5 / 10.0]

WORK EXPERIENCE / INTERNSHIPS
Software Engineering Intern | [Company Name] | [Dates]
- Designed and delivered 4 responsive microservices using Node.js and TypeScript, handling 10,000+ daily requests.
- Optimized PostgreSQL queries with composite indexing, reducing average page load latency by 42%.
- Collaborated with senior engineers using Git feature branches, code reviews, and automated Jest tests.

KEY PROJECTS
1. Cloud Job Portal Platform (Next.js, Tailwind, PostgreSQL)
   - Architected candidate verification and real-time application tracking with zero-downtime deployment.
   - Live URL: [Link] | GitHub: [Link]

2. Distributed Task Scheduler (Node.js, Redis, BullMQ)
   - Built resilient job queue handling delayed tasks and email delivery with exponential backoff retries.
   - Live URL: [Link] | GitHub: [Link]

HONORS & CERTIFICATIONS
- LeetCode Rating 1750+ (Top 12% globally), 350+ Problems Solved
- Winner, Smart India Hackathon / Inter-College Coding Contest

© WeGrow Jobz — ATS Verified Layout`,
  },
  {
    id: "hr-behavioral",
    title: "Top 50 HR & Behavioral Interview Questions with STAR Answers",
    category: "HR Interview",
    description: "Structured STAR method (Situation, Task, Action, Result) answers for tricky behavioral, conflict resolution, and leadership questions.",
    badge: "High Impact",
    type: "Answer Handbook",
    format: "PDF",
    downloads: "12,600+",
    rating: 4.8,
    size: "3.5 MB",
    topics: [
      "Tell Me About Yourself (The 90-Second Formula)",
      "Describe a time you handled a tight project deadline",
      "How do you handle disagreement with a teammate or lead?",
      "Why should we hire you over other qualified candidates?",
      "Questions you MUST ask the interviewer at the end",
    ],
    previewContent: `Question: "Tell me about a time you made a mistake on a project."

STAR Framework Answer:
- Situation: During our final semester capstone project, I accidentally merged an unreviewed branch into main that broke the authentication API.
- Task: I needed to restore service immediately without losing my team's active contributions.
- Action: I communicated with the team on Slack, rolled back the commit using 'git revert', isolated the bug in a separate hotfix branch, and implemented branch protection rules requiring 2 pull request approvals.
- Result: Service was restored in 14 minutes, and our team never experienced an accidental overwrite again.`,
    downloadContent: `# WeGrow Jobz — Behavioral & HR Interview Question Bank (STAR Method)

## Formula:
- Situation: Set the context (Where, when, project scope).
- Task: Explain your specific responsibility or the challenge faced.
- Action: Describe the steps YOU personally took to solve it.
- Result: Conclude with measurable metrics or lessons learned.

## Top 5 Questions & Response Blueprints:

1. "Tell me about yourself."
   - Structure: Past (your background & passion for software) -> Present (what you're building & studying right now) -> Future (why this company matches your career ambition).

2. "What are your greatest strengths and weaknesses?"
   - Strength: Fast learner who dives into documentation and writes clean unit tests.
   - Weakness: Tendency to over-engineer solutions, which I now overcome by strictly prioritizing MVP requirements and timeboxing tasks.

3. "Why do you want to join our organization?"
   - Mention 2 specific products, tech stacks, or engineering culture initiatives the company is recognized for.

4. "How do you prioritize multiple deadlines?"
   - Eisenhower Matrix: Categorize tasks into Urgent vs Important, communicate transparently with stakeholders early.

© WeGrow Skill Campus — Career Development Desk`,
  },
  {
    id: "fullstack-cheat-sheet",
    title: "Modern Full Stack Web Developer Quick Reference & Cheat Sheet",
    category: "Technical Prep",
    description: "Rapid reference for React 19 hooks, Next.js Server Components, PostgreSQL queries, REST conventions, and Git workflows.",
    badge: "Quick Reference",
    type: "Interactive Notes",
    format: "CHEATSHEET",
    downloads: "16,100+",
    rating: 4.9,
    size: "2.4 MB",
    topics: [
      "React 19 Hooks: useActionState, useOptimistic, useTransition",
      "Next.js App Router: Server Components vs Client Components",
      "Essential SQL: Joins, Group By, Having, Window Functions",
      "Git Pro Tips: Interactive rebase, stash, cherry-pick",
    ],
    previewContent: `// React 19 useTransition for non-blocking search
const [isPending, startTransition] = useTransition();

const handleFilter = (query: string) => {
  // Urgent update (input stays fast)
  setInputVal(query);
  // Non-urgent update (filtered list updates smoothly)
  startTransition(() => {
    setFilter(query);
  });
};`,
    downloadContent: `# Modern Full Stack Web Developer Cheat Sheet
Compiled by WeGrow Jobz Mentors

## 1. Next.js App Router Best Practices
- Keep components as Server Components by default.
- Add 'use client' only when needing useState, useEffect, or event handlers (onClick, onChange).
- Use Server Actions for database mutations.

## 2. PostgreSQL Essential Queries
- INNER JOIN: Matches rows present in both tables.
- LEFT JOIN: All rows from left table, matched from right table.
- Indexing Rule: Index foreign keys and columns frequently used in WHERE, ORDER BY, and JOIN conditions.

## 3. HTTP Status Codes
- 200: OK | 201: Created | 204: No Content
- 400: Bad Request | 401: Unauthorized (no token) | 403: Forbidden (insufficient role)
- 404: Not Found | 409: Conflict | 500: Internal Server Error

© WeGrow Skill Campus`,
  },
  {
    id: "sql-aptitude-bank",
    title: "SQL & Technical Aptitude Campus Question Bank (300+ MCQs)",
    category: "Technical Prep",
    description: "Comprehensive question bank with explanations for college placement screening tests (TCS NQT, Infosys, Cognizant, Wipro, Zoho).",
    badge: "Campus Special",
    type: "Question Bank",
    format: "PDF",
    downloads: "19,500+",
    rating: 4.9,
    size: "5.0 MB",
    topics: [
      "SQL Query Writing & Subqueries",
      "Operating Systems: Threads, Deadlocks, Paging",
      "DBMS: Normalization (1NF, 2NF, 3NF, BCNF) & ACID Properties",
      "Computer Networks: OSI Model, TCP vs UDP, DNS Resolution",
    ],
    previewContent: `Q: Find the second highest salary from Employee table without LIMIT.

Answer:
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);

Or using DENSE_RANK():
WITH RankedSalaries AS (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk
  FROM Employee
)
SELECT salary FROM RankedSalaries WHERE rnk = 2;`,
    downloadContent: `# WeGrow Jobz — Campus Technical Aptitude Question Bank

## Core Computer Science Subjects for Campus Screening:

### 1. Database Management Systems (DBMS)
- ACID Properties:
  - Atomicity: All or nothing execution.
  - Consistency: Database moves from one valid state to another.
  - Isolation: Concurrent transactions do not interfere.
  - Durability: Committed data survives system crashes.
- Normalization:
  - 1NF: Atomic values, unique column names.
  - 2NF: 1NF + No partial dependency on composite key.
  - 3NF: 2NF + No transitive dependency.

### 2. Operating Systems (OS)
- Process vs Thread: Process has its own address space; threads share process memory.
- Deadlock 4 Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.

### 3. Computer Networks (CN)
- TCP: Connection-oriented, reliable 3-way handshake (SYN, SYN-ACK, ACK).
- UDP: Connectionless, low latency, ideal for video streaming and gaming.

© WeGrow Skill Campus — Placement Cell Companion`,
  },
];

export default function ResourcesClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalResource, setActiveModalResource] = useState<ResourceItem | null>(null);
  const [modalTab, setModalTab] = useState<"overview" | "preview">("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const categories = [
    "All",
    "Technical Prep",
    "System Design",
    "Resume Kit",
    "HR Interview",
  ];

  const filteredResources = useMemo(() => {
    return RESOURCES_DATA.filter((item) => {
      const matchCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.topics.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleDownload = (item: ResourceItem) => {
    setIsDownloading(true);
    showToast(`Preparing download for "${item.title}"...`);

    setTimeout(() => {
      // Trigger genuine client-side download of formatted content
      const element = document.createElement("a");
      const file = new Blob([item.downloadContent], { type: "text/markdown;charset=utf-8" });
      element.href = URL.createObjectURL(file);
      element.download = `${item.id}-wegrow-resource.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsDownloading(false);
      showToast(`✓ "${item.title}" downloaded successfully!`);
    }, 700);
  };

  const handleCopyContent = (item: ResourceItem) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(item.downloadContent);
      setCopiedId(item.id);
      showToast("✓ Full resource content copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2500);
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

      {/* Hero Banner */}
      <section className="bg-white border-b border-[#EEF1F7] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#EAF2FC] text-[#014E9C] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Learning Vault</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F4B] tracking-tight">
            Career &amp; Placement Resources
          </h1>
          <p className="text-sm sm:text-base text-[#6B7694] max-w-2xl mx-auto mt-3 leading-relaxed">
            Download verified technical cheat sheets, system design blueprints, ATS resume kits, and HR interview guides crafted by industry mentors.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto mt-8 relative">
            <Search className="w-5 h-5 text-[#6B7694] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic (e.g. DSA, System Design, ATS Resume, SQL, STAR)..."
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

          {/* Category Tabs */}
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

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-[#6B7694] font-medium">
            Showing <span className="font-bold text-[#0B1F4B]">{filteredResources.length}</span> verified resources
          </p>
          <span className="text-xs text-[#014E9C] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22B573]" /> Free Community Access
          </span>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-[#014E9C]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#014E9C] bg-blue-50 px-2.5 py-1 rounded-md">
                      {res.category}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                      {res.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0B1F4B] group-hover:text-[#014E9C] transition-colors line-clamp-2 mb-2 leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {res.description}
                  </p>

                  {/* Topic pills */}
                  <div className="space-y-1 mb-4">
                    {res.topics.slice(0, 3).map((t, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#6B7694]">
                        <Check className="w-3 h-3 text-[#22B573] shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                    {res.topics.length > 3 && (
                      <p className="text-[10px] text-slate-400 font-medium pl-4">
                        +{res.topics.length - 3} more modules included
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-600">{res.downloads}</span> downloads
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalResource(res);
                        setModalTab("overview");
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#014E9C] bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(res)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#014E9C] hover:bg-[#013C78] transition shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No matching resources found</h3>
            <p className="text-xs text-slate-500 mb-4">Try searching with another keyword or pick &quot;All&quot; categories.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#014E9C]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ================= RESOURCE MODAL ================= */}
      {activeModalResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 to-[#014E9C] text-white relative">
              <button
                type="button"
                onClick={() => setActiveModalResource(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-2 bg-white/15 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md mb-2">
                <span>{activeModalResource.category}</span>
                <span>•</span>
                <span>{activeModalResource.format} Guide</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold leading-snug pr-8">
                {activeModalResource.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-blue-100">
                <span>⭐ {activeModalResource.rating} / 5.0 Rating</span>
                <span>•</span>
                <span>📦 {activeModalResource.size} File Size</span>
                <span>•</span>
                <span>📥 {activeModalResource.downloads} Downloads</span>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6">
              <button
                type="button"
                onClick={() => setModalTab("overview")}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                  modalTab === "overview"
                    ? "border-[#014E9C] text-[#014E9C]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Overview &amp; Modules
              </button>
              <button
                type="button"
                onClick={() => setModalTab("preview")}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                  modalTab === "preview"
                    ? "border-[#014E9C] text-[#014E9C]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Interactive Content Preview
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {modalTab === "overview" ? (
                <>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Description
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {activeModalResource.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Key Topics Covered in this Kit
                    </h4>
                    <div className="space-y-2">
                      {activeModalResource.topics.map((top, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#22B573] shrink-0 mt-0.5" />
                          <span className="font-medium">{top}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Excerpt / Code Template
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyContent(activeModalResource)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#014E9C] hover:underline cursor-pointer"
                    >
                      {copiedId === activeModalResource.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#22B573]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Content</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                    {activeModalResource.previewContent}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleCopyContent(activeModalResource)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                {copiedId === activeModalResource.id ? <Check className="w-3.5 h-3.5 text-[#22B573]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === activeModalResource.id ? "Copied to Clipboard" : "Copy Document Text"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalResource(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={() => handleDownload(activeModalResource)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#014E9C] hover:bg-[#013C78] transition shadow-md shadow-blue-900/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? "Downloading..." : `Download ${activeModalResource.format}`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
