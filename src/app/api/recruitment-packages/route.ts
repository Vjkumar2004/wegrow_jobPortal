import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { PackageEnquirySubmission, TermsAcceptanceRecord } from "@/types/packages";
import { PACKAGES_DATA } from "@/constants/recruitmentPackages";
import { CURRENT_TERMS_VERSION } from "@/constants/recruitmentTerms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const ENQUIRIES_FILE = path.join(DATA_DIR, "recruitment_enquiries.json");
const TERMS_FILE = path.join(DATA_DIR, "terms_acceptances.json");

let inMemoryEnquiries: PackageEnquirySubmission[] = [];

async function ensureDataFile(): Promise<PackageEnquirySubmission[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const data = await fs.readFile(ENQUIRIES_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        inMemoryEnquiries = parsed;
        return parsed;
      }
    } catch {
      await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(inMemoryEnquiries, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Recruitment enquiries filesystem fallback:", err);
  }
  return inMemoryEnquiries;
}

async function saveEnquiries(items: PackageEnquirySubmission[]) {
  inMemoryEnquiries = items;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save recruitment enquiries:", err);
  }
}

async function checkTermsAccepted(email?: string, companyName?: string): Promise<boolean> {
  try {
    const data = await fs.readFile(TERMS_FILE, "utf-8");
    const terms: TermsAcceptanceRecord[] = JSON.parse(data);
    if (Array.isArray(terms)) {
      return terms.some(
        (t) =>
          t.termsVersion === CURRENT_TERMS_VERSION &&
          ((email && t.userEmail?.toLowerCase() === email.toLowerCase()) ||
            (companyName && t.companyName?.toLowerCase() === companyName.toLowerCase()))
      );
    }
  } catch {}
  return false;
}

export async function GET(req: NextRequest) {
  try {
    const items = await ensureDataFile();
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("companyName");
    const email = searchParams.get("email");

    let filtered = [...items];
    if (company && company !== "All") {
      filtered = filtered.filter(
        (i) => i.companyName.toLowerCase().includes(company.toLowerCase()) ||
               company.toLowerCase().includes(i.companyName.toLowerCase())
      );
    }
    if (email) {
      filtered = filtered.filter((i) => i.email.toLowerCase() === email.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      packages: PACKAGES_DATA,
      enquiries: filtered,
      count: filtered.length,
    });
  } catch (error: any) {
    console.error("GET /api/recruitment-packages error:", error);
    return NextResponse.json(
      { success: false, packages: PACKAGES_DATA, enquiries: inMemoryEnquiries, error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Required field validation
    if (!body.companyName?.trim()) {
      return NextResponse.json({ success: false, error: "Company name is required" }, { status: 400 });
    }
    if (!body.contactPerson?.trim()) {
      return NextResponse.json({ success: false, error: "Contact person is required" }, { status: 400 });
    }
    if (!body.jobRole?.trim()) {
      return NextResponse.json({ success: false, error: "Job role is required" }, { status: 400 });
    }

    // 2. Terms & Conditions acceptance validation
    const hasExplicitTermsToken = body.termsAcceptedVersion === CURRENT_TERMS_VERSION;
    const hasRecordInDatabase = await checkTermsAccepted(body.email, body.companyName);

    if (!hasExplicitTermsToken && !hasRecordInDatabase) {
      return NextResponse.json(
        {
          success: false,
          error: "You must review and accept WeGrow Jobz's latest Recruitment Consultancy Terms & Conditions before submitting hiring requirements.",
          requiresTermsAcceptance: true,
          currentVersion: CURRENT_TERMS_VERSION,
        },
        { status: 403 }
      );
    }

    const items = await ensureDataFile();

    const newEnquiry: PackageEnquirySubmission = {
      id: body.id || `rpkg-${Date.now()}`,
      packageId: body.packageId || "professional",
      packageName: body.packageName || "Professional Recruitment",
      packagePrice: body.packagePrice || "₹5,999",
      companyName: body.companyName.trim(),
      contactPerson: body.contactPerson.trim(),
      email: body.email?.trim() || "",
      phone: body.phone?.trim() || "",
      jobRole: body.jobRole.trim(),
      vacancies: Number(body.vacancies) || 1,
      jobLocation: body.jobLocation?.trim() || "Pan India",
      requiredSkills: body.requiredSkills?.trim() || "Not specified",
      salaryRange: body.salaryRange?.trim() || "Competitive / Market Standard",
      additionalRequirements: body.additionalRequirements?.trim() || "",
      enquiryType: body.enquiryType || (body.packageId === "workforce-partner" ? "sales_contact" : "package_selection"),
      status: "Submitted",
      createdAt: new Date().toISOString(),
      termsAcceptedVersion: CURRENT_TERMS_VERSION,
      termsAcceptedAt: body.termsAcceptedAt || new Date().toISOString(),
    };

    const updated = [newEnquiry, ...items.filter((i) => i.id !== newEnquiry.id)];
    await saveEnquiries(updated);

    return NextResponse.json({
      success: true,
      message: "Recruitment package enquiry submitted successfully",
      enquiry: newEnquiry,
      enquiries: updated,
    });
  } catch (error: any) {
    console.error("POST /api/recruitment-packages error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit recruitment enquiry" },
      { status: 500 }
    );
  }
}
