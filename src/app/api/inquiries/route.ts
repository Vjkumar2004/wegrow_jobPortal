import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export interface CandidateInquiry {
  id: string;
  applicationId?: string;
  jobId?: string;
  companyName: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  topic: string;
  subject: string;
  message: string;
  sentAt: string;
  sentAtText: string;
  status: string;
  read?: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

// In-memory fallback in case of filesystem issues or during fast dev restarts
let inMemoryInquiries: CandidateInquiry[] = [];

async function ensureDataFile(): Promise<CandidateInquiry[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const data = await fs.readFile(INQUIRIES_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        inMemoryInquiries = parsed;
        return parsed;
      }
    } catch {
      // File doesn't exist yet, initialize it
      await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inMemoryInquiries, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Could not access filesystem for inquiries, falling back to memory:", err);
  }
  return inMemoryInquiries;
}

async function saveInquiries(items: CandidateInquiry[]) {
  inMemoryInquiries = items;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist inquiries to filesystem:", err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const items = await ensureDataFile();
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("companyName");
    const appId = searchParams.get("applicationId");
    const email = searchParams.get("applicantEmail");

    let filtered = [...items];
    if (company && company !== "All") {
      filtered = filtered.filter(
        (i) => i.companyName.toLowerCase().includes(company.toLowerCase()) ||
               company.toLowerCase().includes(i.companyName.toLowerCase())
      );
    }
    if (appId) {
      filtered = filtered.filter((i) => i.applicationId === appId);
    }
    if (email) {
      filtered = filtered.filter((i) => i.applicantEmail?.toLowerCase() === email.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      inquiries: filtered,
      count: filtered.length,
    });
  } catch (error: any) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch inquiries", inquiries: inMemoryInquiries },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = await ensureDataFile();

    const newInquiry: CandidateInquiry = {
      id: body.id || `inq-${Date.now()}`,
      applicationId: body.applicationId || "",
      jobId: body.jobId || "",
      companyName: body.companyName || "Recruiter",
      jobTitle: body.jobTitle || "Job Opening",
      applicantName: body.applicantName || "Student Candidate",
      applicantEmail: body.applicantEmail || "",
      applicantPhone: body.applicantPhone || "",
      topic: body.topic || "General Inquiry",
      subject: body.subject || "Candidate Inquiry",
      message: body.message || "",
      sentAt: body.sentAt || new Date().toISOString(),
      sentAtText:
        body.sentAtText ||
        new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      status: body.status || "Delivered to HR Desk",
      read: false,
    };

    // Prepend to top
    const updated = [newInquiry, ...items.filter((i) => i.id !== newInquiry.id)];
    await saveInquiries(updated);

    return NextResponse.json({
      success: true,
      inquiry: newInquiry,
      inquiries: updated,
    });
  } catch (error: any) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save inquiry" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, read, status } = body;
    const items = await ensureDataFile();

    const updated = items.map((i) => {
      if (i.id === id) {
        return {
          ...i,
          ...(read !== undefined ? { read } : {}),
          ...(status ? { status } : {}),
        };
      }
      return i;
    });

    await saveInquiries(updated);

    return NextResponse.json({
      success: true,
      inquiries: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update inquiry" },
      { status: 500 }
    );
  }
}
