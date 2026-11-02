import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { TermsAcceptanceRecord } from "@/types/packages";
import { CURRENT_TERMS_VERSION } from "@/constants/recruitmentTerms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const TERMS_FILE = path.join(DATA_DIR, "terms_acceptances.json");

let inMemoryTerms: TermsAcceptanceRecord[] = [];

async function ensureDataFile(): Promise<TermsAcceptanceRecord[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const data = await fs.readFile(TERMS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        inMemoryTerms = parsed;
        return parsed;
      }
    } catch {
      await fs.writeFile(TERMS_FILE, JSON.stringify(inMemoryTerms, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Terms acceptances filesystem fallback:", err);
  }
  return inMemoryTerms;
}

async function saveTerms(items: TermsAcceptanceRecord[]) {
  inMemoryTerms = items;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(TERMS_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save terms acceptances:", err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const items = await ensureDataFile();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email")?.toLowerCase();
    const company = searchParams.get("companyName")?.toLowerCase();
    const version = searchParams.get("version") || CURRENT_TERMS_VERSION;

    // Check if user or company has accepted this exact version
    const existing = items.find((item) => {
      const versionMatch = item.termsVersion === version;
      if (!versionMatch) return false;

      if (userId && item.userId === userId) return true;
      if (email && item.userEmail?.toLowerCase() === email) return true;
      if (company && item.companyName?.toLowerCase() === company) return true;
      return false;
    });

    return NextResponse.json({
      success: true,
      currentVersion: CURRENT_TERMS_VERSION,
      accepted: Boolean(existing),
      record: existing || null,
      totalAcceptances: items.length,
    });
  } catch (error: any) {
    console.error("GET /api/recruitment-packages/terms error:", error);
    return NextResponse.json(
      {
        success: false,
        currentVersion: CURRENT_TERMS_VERSION,
        accepted: false,
        error: error?.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = await ensureDataFile();

    const termsVersion = body.termsVersion || CURRENT_TERMS_VERSION;
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const newRecord: TermsAcceptanceRecord = {
      id: `tc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: body.userId || "",
      userName: body.userName || "HR User",
      userEmail: body.userEmail || "",
      companyName: body.companyName || "Hiring Company",
      companyId: body.companyId || "",
      termsVersion,
      acceptedAt: new Date().toISOString(),
      ip,
      userAgent,
    };

    // Prepend to top, keep acceptance history
    const updated = [newRecord, ...items];
    await saveTerms(updated);

    return NextResponse.json({
      success: true,
      message: "Terms and conditions accepted successfully",
      record: newRecord,
      currentVersion: CURRENT_TERMS_VERSION,
    });
  } catch (error: any) {
    console.error("POST /api/recruitment-packages/terms error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to record terms acceptance" },
      { status: 500 }
    );
  }
}

