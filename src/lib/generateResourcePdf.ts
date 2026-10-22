import { jsPDF } from "jspdf";

export interface PdfResourceData {
  id: string;
  title: string;
  category: string;
  description: string;
  badge?: string;
  type?: string;
  rating?: number;
  topics?: string[];
  downloadContent: string;
}

export async function generateResourcePdf(item: PdfResourceData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const drawHeaderDecoration = () => {
    // Top brand colored strip
    doc.setFillColor(1, 78, 156); // #014E9C
    doc.rect(0, 0, pageWidth, 4, "F");

    // Subtle header running text on pages > 1
    if (doc.internal.pages.length > 2) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text("WEGROW SKILL CAMPUS  •  CAREER RESOURCE VAULT", margin, 10);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 12, pageWidth - margin, 12);
    }
  };

  const ensureSpace = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - 22) {
      doc.addPage();
      y = 20;
      drawHeaderDecoration();
    }
  };

  // 1. Initial Page Top Accent
  drawHeaderDecoration();

  // 2. Organization Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(1, 78, 156);
  doc.text("WEGROW SKILL CAMPUS  •  OFFICIAL PLACEMENT & STUDY VAULT", margin, y + 2);
  y += 8;

  // 3. Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(11, 31, 75); // #0B1F4B
  const titleLines = doc.splitTextToSize(item.title, contentWidth);
  doc.text(titleLines, margin, y + 3);
  y += titleLines.length * 6.5 + 4;

  // 4. Metadata Pill / Box
  doc.setFillColor(243, 247, 253); // #F3F7FD
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
  doc.setDrawColor(218, 230, 247);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "D");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const metaBadge = item.badge ? `   |   Level: ${item.badge}` : "";
  const metaType = item.type ? `   |   Format: ${item.type}` : "";
  const metaRating = item.rating ? `   |   ★ ${item.rating}/5.0` : "";
  const metaText = `Category: ${item.category}${metaBadge}${metaType}${metaRating}`;
  doc.text(metaText, margin + 4, y + 9);
  y += 20;

  // 5. Brief Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const descLines = doc.splitTextToSize(item.description, contentWidth);
  doc.text(descLines, margin, y);
  y += descLines.length * 5 + 4;

  // 6. Key Topics (if present)
  if (item.topics && item.topics.length > 0) {
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(11, 31, 75);
    doc.text("Curriculum & Modules Included:", margin, y);
    y += 5.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    for (const topic of item.topics) {
      ensureSpace(6);
      doc.text(`•  ${topic}`, margin + 3, y);
      y += 5;
    }
    y += 4;
  }

  // Divider Line
  ensureSpace(8);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // 7. Parse and render downloadContent markdown
  const rawLines = item.downloadContent.split("\n");

  for (const rawLine of rawLines) {
    const line = rawLine.trim();

    if (!line) {
      y += 3.5;
      continue;
    }

    if (line.startsWith("# ")) {
      // Document H1 header
      const heading = line.replace(/^#\s*/, "");
      ensureSpace(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(1, 78, 156);
      const wrapped = doc.splitTextToSize(heading, contentWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5.5 + 3.5;
    } else if (line.startsWith("## ")) {
      // Section H2 header
      const heading = line.replace(/^##\s*/, "");
      ensureSpace(14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 31, 75);
      const wrapped = doc.splitTextToSize(heading, contentWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5 + 2.5;
    } else if (line.startsWith("### ")) {
      // Subsection H3 header
      const heading = line.replace(/^###\s*/, "");
      ensureSpace(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      const wrapped = doc.splitTextToSize(heading, contentWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 4.8 + 2;
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      // Bullet list
      const bulletText = line.replace(/^[-*]\s*/, "");
      ensureSpace(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const wrapped = doc.splitTextToSize(`•  ${bulletText}`, contentWidth - 4);
      doc.text(wrapped, margin + 2, y);
      y += wrapped.length * 4.6 + 1.2;
    } else if (/^\d+\.\s/.test(line)) {
      // Numbered list
      ensureSpace(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const wrapped = doc.splitTextToSize(line, contentWidth - 4);
      doc.text(wrapped, margin + 2, y);
      y += wrapped.length * 4.6 + 1.2;
    } else {
      // Regular paragraph or note
      ensureSpace(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const wrapped = doc.splitTextToSize(line, contentWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 4.6 + 1.5;
    }
  }

  // 8. Footer on each page with total page count
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      `© WeGrow Skill Campus  •  Confidential & Proprietary Learning Material  •  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  // 9. Save as .pdf
  const sanitizedTitle = (item.title || "resource")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const fileName = `${sanitizedTitle || item.id}.pdf`;
  doc.save(fileName);
}
