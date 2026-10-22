import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") || "Resume.pdf";

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const upstreamRes = await fetch(targetUrl);
    if (!upstreamRes.ok) {
      return new NextResponse(`Failed to fetch upstream file: ${upstreamRes.statusText}`, {
        status: upstreamRes.status,
      });
    }

    const contentType = upstreamRes.headers.get("content-type") || "application/pdf";
    const cleanFilename = filename.replace(/[^\w.-]/g, "_");

    return new NextResponse(upstreamRes.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${cleanFilename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Proxy download error:", error);
    return new NextResponse(error?.message || "Failed to download file", { status: 500 });
  }
}
