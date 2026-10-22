import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export interface ProfileViewItem {
  id: string;
  studentId?: string;
  studentEmail?: string;
  applicantName?: string;
  companyName: string;
  hrName?: string;
  hrId?: string;
  viewedAt: string;
  viewedAtText: string;
}

interface ProfileViewsStore {
  // Map of studentId or studentEmail to total count and history
  students: Record<string, { count: number; views: ProfileViewItem[] }>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const VIEWS_FILE = path.join(DATA_DIR, "profile_views.json");

let inMemoryStore: ProfileViewsStore = { students: {} };

async function ensureStore(): Promise<ProfileViewsStore> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const raw = await fs.readFile(VIEWS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.students === "object") {
        inMemoryStore = parsed;
        return parsed;
      }
    } catch {
      await fs.writeFile(VIEWS_FILE, JSON.stringify(inMemoryStore, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Could not read profile_views file, falling back to memory:", err);
  }
  return inMemoryStore;
}

async function saveStore(store: ProfileViewsStore) {
  inMemoryStore = store;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(VIEWS_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write profile_views to file:", err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const store = await ensureStore();
    const { searchParams } = new URL(req.url);
    const rawStudentId = searchParams.get("studentId");
    const rawStudentEmail = searchParams.get("studentEmail") || searchParams.get("email");

    const studentId = rawStudentId ? rawStudentId.trim().toLowerCase() : "";
    const studentEmail = rawStudentEmail ? rawStudentEmail.trim().toLowerCase() : "";

    // If neither studentId nor studentEmail is provided, return total count across all
    if (!studentId && !studentEmail) {
      let totalAll = 0;
      Object.values(store.students).forEach((s) => {
        totalAll += s.count || 0;
      });
      return NextResponse.json({ success: true, count: totalAll, totalViews: totalAll, store: store.students });
    }

    const matchedViewsMap = new Map<string, ProfileViewItem>();
    let keyCount = 0;

    // 1. Direct key lookups
    if (studentId && store.students[studentId]) {
      const rec = store.students[studentId];
      keyCount = Math.max(keyCount, rec.count || 0);
      if (Array.isArray(rec.views)) {
        rec.views.forEach((v) => matchedViewsMap.set(v.id, v));
      }
    }
    if (studentEmail && store.students[studentEmail]) {
      const rec = store.students[studentEmail];
      keyCount = Math.max(keyCount, rec.count || 0);
      if (Array.isArray(rec.views)) {
        rec.views.forEach((v) => matchedViewsMap.set(v.id, v));
      }
    }

    // 2. Global deep scan across all recorded views to ensure no views are missed
    Object.values(store.students).forEach((rec) => {
      if (Array.isArray(rec?.views)) {
        rec.views.forEach((v) => {
          const vStudentId = v.studentId ? String(v.studentId).trim().toLowerCase() : "";
          const vEmail = v.studentEmail ? String(v.studentEmail).trim().toLowerCase() : "";
          if (
            (studentId && vStudentId === studentId) ||
            (studentEmail && vEmail === studentEmail)
          ) {
            matchedViewsMap.set(v.id, v);
          }
        });
      }
    });

    const uniqueViews = Array.from(matchedViewsMap.values());
    uniqueViews.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());

    const finalCount = Math.max(uniqueViews.length, keyCount);

    return NextResponse.json({
      success: true,
      count: finalCount,
      views: uniqueViews,
    });
  } catch (error: any) {
    console.error("GET /api/profile-views error:", error);
    return NextResponse.json({ success: false, count: 0, views: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const store = await ensureStore();

    const rawStudentId = body.studentId;
    const rawStudentEmail = body.studentEmail;

    const studentId = rawStudentId ? String(rawStudentId).trim().toLowerCase() : "";
    const studentEmail = rawStudentEmail ? String(rawStudentEmail).trim().toLowerCase() : "";
    const applicantName = body.applicantName || "Candidate";
    const companyName = body.companyName || "Recruiter";
    const hrName = body.hrName || "Hiring Team";
    const hrId = body.hrId || "";

    if (!studentId && !studentEmail) {
      return NextResponse.json({ success: false, message: "Missing studentId or studentEmail" }, { status: 400 });
    }

    const now = new Date();
    const newView: ProfileViewItem = {
      id: `view-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      studentId: rawStudentId ? String(rawStudentId).trim() : undefined,
      studentEmail: rawStudentEmail ? String(rawStudentEmail).trim() : undefined,
      applicantName,
      companyName,
      hrName,
      hrId,
      viewedAt: now.toISOString(),
      viewedAtText: now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Update keys
    let updatedCount = 0;
    if (studentId) {
      if (!store.students[studentId]) {
        store.students[studentId] = { count: 0, views: [] };
      }
      store.students[studentId].count += 1;
      store.students[studentId].views.unshift(newView);
      updatedCount = Math.max(updatedCount, store.students[studentId].count);
    }

    if (studentEmail) {
      if (!store.students[studentEmail]) {
        store.students[studentEmail] = { count: 0, views: [] };
      }
      store.students[studentEmail].count += 1;
      store.students[studentEmail].views.unshift(newView);
      updatedCount = Math.max(updatedCount, store.students[studentEmail].count);
    }

    await saveStore(store);

    return NextResponse.json({
      success: true,
      count: updatedCount,
      view: newView,
    });
  } catch (error: any) {
    console.error("POST /api/profile-views error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to record profile view" }, { status: 500 });
  }
}

