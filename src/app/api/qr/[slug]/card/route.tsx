import { ImageResponse } from "next/og"
import { NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"

import { getRepBySlug } from "@/lib/reps"

export const runtime = "nodejs"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug || slug.length < 2) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
  }

  const rep = await getRepBySlug(slug)
  if (!rep) {
    return NextResponse.json({ error: "Rep not found" }, { status: 404 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fiberfastusa.com"
  const repUrl = `${baseUrl}/rep/${encodeURIComponent(slug)}?door=1`

  try {
    const qrDataUrl = await QRCode.toDataURL(repUrl, {
      width: 200,
      margin: 1,
      color: { dark: "#0A2540", light: "#FFFFFF" },
    })

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "600px",
            height: "400px",
            backgroundColor: "#0A2540",
            fontFamily: "sans-serif",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#FF6B35",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase" as const,
                }}
              >
                FiberFastUSA
              </div>
              <div
                style={{
                  fontSize: "28px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {rep.name}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#94A3B8",
                  fontWeight: 500,
                }}
              >
                {rep.role}
              </div>
              {(rep.city || rep.territory) && (
                <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
                  {rep.city && rep.state ? `${rep.city}, ${rep.state}` : rep.territory || ""}
                </div>
              )}
              {rep.phone && (
                <div style={{ fontSize: "13px", color: "#CBD5E1", marginTop: "8px" }}>
                  {rep.phone}
                </div>
              )}
              {rep.email && (
                <div style={{ fontSize: "13px", color: "#CBD5E1" }}>
                  {rep.email}
                </div>
              )}
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748B",
                  marginTop: "12px",
                }}
              >
                Scan to get started
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              width={180}
              height={180}
              alt="QR Code"
              style={{ borderRadius: "12px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              marginTop: "24px",
              borderTop: "1px solid #1E3A5F",
              paddingTop: "16px",
              fontSize: "12px",
              color: "#64748B",
            }}
          >
            fiberfastusa.com/rep/{slug}
          </div>
        </div>
      ),
      {
        width: 600,
        height: 400,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      }
    )
  } catch {
    return NextResponse.json(
      { error: "Failed to generate business card" },
      { status: 500 }
    )
  }
}
