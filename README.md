# WeGrow Job Portal - Frontend Web Application

The modern, responsive frontend web application for **WeGrow Job Portal** (WeGrow Skill Campus).

---

## 🏛 Architecture Overview

- **Frontend Project Only**: This repository contains solely the client-side Next.js web application.
- **Backend Decoupling**: Communicates with the completely independent backend (`jobportal_backend`) exclusively over REST APIs via HTTP/HTTPS.
- **No Database / Server Logic**: Contains **no** Prisma, Express, PostgreSQL, or server-side DB logic.
- **REST Client Layer**: Axios client configured at [api.ts](file:///d:/wegrow_jobPortal/src/services/api.ts) consuming `NEXT_PUBLIC_API_BASE_URL`.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router with Server Components by default)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Design Tokens**: WeGrow Brand Palette (Primary Blue `#0756A8`, Accent Orange `#F79400`, Navy `#042D5A`, Warm Cream `#FAF8F5`)
- **Icons**: Lucide React
- **Data Fetching**: TanStack React Query + Axios
- **Form Management**: React Hook Form + Zod
- **Animations**: Framer Motion

---

## 👥 Role-Based Portals & Routes

### 🌐 Public Portal
- **Home**: [`/`](file:///d:/wegrow_jobPortal/src/app/page.tsx)
- **Jobs Directory**: [`/jobs`](file:///d:/wegrow_jobPortal/src/app/jobs/page.tsx)
- **Job Details**: [`/jobs/[jobId]`](file:///d:/wegrow_jobPortal/src/app/jobs/[jobId]/page.tsx)
- **Hiring Companies**: [`/companies`](file:///d:/wegrow_jobPortal/src/app/companies/page.tsx)
- **Placement Resources**: [`/resources`](file:///d:/wegrow_jobPortal/src/app/resources/page.tsx)
- **Career Tips**: [`/career-tips`](file:///d:/wegrow_jobPortal/src/app/career-tips/page.tsx)

> **Important**: The public navbar exclusively exposes **Student Login** and **HR Login**. Admin login is hidden from public navigation.

---

### 🎓 Student Portal
- **Student Login**: [`/student/login`](file:///d:/wegrow_jobPortal/src/app/student/login/page.tsx)
- **Student Register**: [`/student/register`](file:///d:/wegrow_jobPortal/src/app/student/register/page.tsx)
- **Dashboard**: [`/student/dashboard`](file:///d:/wegrow_jobPortal/src/app/student/dashboard/page.tsx)
- **Browse Jobs**: [`/student/jobs`](file:///d:/wegrow_jobPortal/src/app/student/jobs/page.tsx)
- **My Applications & Timeline**: [`/student/applications`](file:///d:/wegrow_jobPortal/src/app/student/applications/page.tsx)
- **Interview Calendar**: [`/student/interviews`](file:///d:/wegrow_jobPortal/src/app/student/interviews/page.tsx)
- **Saved Jobs**: [`/student/saved-jobs`](file:///d:/wegrow_jobPortal/src/app/student/saved-jobs/page.tsx)
- **Profile (Strength % & Skills)**: [`/student/profile`](file:///d:/wegrow_jobPortal/src/app/student/profile/page.tsx)
- **Resume Hub**: [`/student/resume`](file:///d:/wegrow_jobPortal/src/app/student/resume/page.tsx)
- **Application Reports**: [`/student/reports`](file:///d:/wegrow_jobPortal/src/app/student/reports/page.tsx)
- **Notifications**: [`/student/notifications`](file:///d:/wegrow_jobPortal/src/app/student/notifications/page.tsx)

---

### 💼 Employer / HR Portal
- **HR Login**: [`/hr/login`](file:///d:/wegrow_jobPortal/src/app/hr/login/page.tsx)
- **HR Register**: [`/hr/register`](file:///d:/wegrow_jobPortal/src/app/hr/register/page.tsx)
- **HR Dashboard**: [`/hr/dashboard`](file:///d:/wegrow_jobPortal/src/app/hr/dashboard/page.tsx)
- **Job Management**: [`/hr/jobs`](file:///d:/wegrow_jobPortal/src/app/hr/jobs/page.tsx)
- **Post Vacancy**: [`/hr/jobs/create`](file:///d:/wegrow_jobPortal/src/app/hr/jobs/create/page.tsx)
- **Applicant Evaluation & Shortlisting**: [`/hr/applicants`](file:///d:/wegrow_jobPortal/src/app/hr/applicants/page.tsx)
- **Interview Scheduling**: [`/hr/interviews`](file:///d:/wegrow_jobPortal/src/app/hr/interviews/page.tsx)
- **Company Profile**: [`/hr/company`](file:///d:/wegrow_jobPortal/src/app/hr/company/page.tsx)
- **Funnel & Reports**: [`/hr/reports`](file:///d:/wegrow_jobPortal/src/app/hr/reports/page.tsx)

---

### 🛡 Admin Control Center (Strictly Private)
- **Admin Login**: [`/admin/login`](file:///d:/wegrow_jobPortal/src/app/admin/login/page.tsx)
- **Admin Dashboard**: [`/admin/dashboard`](file:///d:/wegrow_jobPortal/src/app/admin/dashboard/page.tsx)
- **HR Moderation & Approvals**: [`/admin/hr-management`](file:///d:/wegrow_jobPortal/src/app/admin/hr-management/page.tsx)
- **Student Moderation**: [`/admin/students`](file:///d:/wegrow_jobPortal/src/app/admin/students/page.tsx)
- **Job Moderation**: [`/admin/jobs`](file:///d:/wegrow_jobPortal/src/app/admin/jobs/page.tsx)
- **Global Applications**: [`/admin/applications`](file:///d:/wegrow_jobPortal/src/app/admin/applications/page.tsx)
- **Email Dispatcher**: [`/admin/email`](file:///d:/wegrow_jobPortal/src/app/admin/email/page.tsx)
- **Placement & Growth Reports**: [`/admin/reports`](file:///d:/wegrow_jobPortal/src/app/admin/reports/page.tsx)
- **Audit Logs**: [`/admin/audit-logs`](file:///d:/wegrow_jobPortal/src/app/admin/audit-logs/page.tsx)

---

## 🛠 Running the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   In [`.env.local`](file:///d:/wegrow_jobPortal/.env.local):
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```
