import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

import { loadInterFonts } from "@/lib/og-fonts";
import { SITE_URL, repShortUrl } from "@/lib/rep-links";
import { getRepBySlug, type Rep } from "@/lib/reps";

export const runtime = "nodejs";

/** Screen version of the printed business card (same design as fiberfast-marketing/creative/business-cards). */
const CARD = { width: 600, height: 343 };
const COLORS = { blue: "#1F4E8C", red: "#D3252E", navy: "#0F2A4A", ink: "#1F2937", muted: "#5B6B7F" };
const CACHE_HEADER = "public, max-age=86400, s-maxage=86400";

const cardHost = SITE_URL.replace(/^https?:\/\//, "");

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug.length < 2) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  const rep = await getRepBySlug(slug);
  if (!rep) {
    return NextResponse.json({ error: "Rep not found" }, { status: 404 });
  }

  try {
    const qrDataUrl = await QRCode.toDataURL(repShortUrl(slug), {
      errorCorrectionLevel: "H",
      width: 320,
      margin: 1,
      color: { dark: COLORS.navy, light: "#FFFFFF" },
    });
    // Brand PNGs are fetched from this deployment so previews and production each serve their own copy.
    const assetOrigin = request.nextUrl.origin;
    const fonts = await loadInterFonts();
    return new ImageResponse(<BusinessCard rep={rep} qrDataUrl={qrDataUrl} assetOrigin={assetOrigin} />, {
      ...CARD,
      fonts,
      headers: { "Cache-Control": CACHE_HEADER },
    });
  } catch (error) {
    console.error(`Business card render failed for rep "${slug}"`, error);
    return NextResponse.json({ error: "Failed to generate business card" }, { status: 500 });
  }
}

function BusinessCard({ rep, qrDataUrl, assetOrigin }: { rep: Rep; qrDataUrl: string; assetOrigin: string }) {
  return (
    <div style={{ display: "flex", width: CARD.width, height: CARD.height, backgroundColor: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", width: 44, height: "100%", backgroundColor: COLORS.blue }} />
      <div style={{ display: "flex", width: 5, height: "100%", backgroundColor: COLORS.red }} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "30px 30px 28px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${assetOrigin}/brand/globe.png`} width={38} height={38} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${assetOrigin}/brand/wordmark.png`} width={116} height={25} alt="FiberFast USA" />
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 26 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.navy, lineHeight: 1.05 }}>{rep.name}</div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: COLORS.blue, marginTop: 8 }}>
              {rep.role.toUpperCase()}
            </div>
            <svg width="46" height="3" viewBox="0 0 46 3" style={{ marginTop: 14 }}><rect width="46" height="3" fill={COLORS.red} /></svg>
            <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.ink, marginTop: 22 }}>{rep.phone}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.ink, marginTop: 6 }}>{`${cardHost}/r/${rep.slug}`}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} width={160} height={160} alt="QR code" style={{ borderRadius: 10, border: `1px solid #D7DFEA` }} />
            <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.muted, letterSpacing: 1 }}>SCAN · CHECK YOUR ADDRESS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
