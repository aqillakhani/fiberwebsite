import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

import { repShortUrl } from "@/lib/rep-links";

const MIN_SIZE = 100;
const MAX_SIZE = 1000;
const DEFAULT_SIZE = 300;
const QR_COLORS = { dark: "#0F2A4A", light: "#FFFFFF" };
const CACHE_HEADER = "public, max-age=86400, s-maxage=86400";

/** PNG (default) or SVG QR code pointing at the rep's /r/<slug> link. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug.length < 2) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const requestedSize = parseInt(request.nextUrl.searchParams.get("size") ?? String(DEFAULT_SIZE), 10);
  const size = Math.min(Math.max(Number.isNaN(requestedSize) ? DEFAULT_SIZE : requestedSize, MIN_SIZE), MAX_SIZE);
  const wantsSvg = request.nextUrl.searchParams.get("format") === "svg";
  const url = repShortUrl(slug);

  try {
    if (wantsSvg) {
      const svg = await QRCode.toString(url, { type: "svg", width: size, margin: 2, color: QR_COLORS });
      return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": CACHE_HEADER } });
    }
    const png = await QRCode.toBuffer(url, { type: "png", width: size, margin: 2, color: QR_COLORS });
    return new NextResponse(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Cache-Control": CACHE_HEADER } });
  } catch (error) {
    console.error(`QR generation failed for rep "${slug}"`, error);
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
