import { NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug || slug.length < 2) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
  }

  const searchParams = request.nextUrl.searchParams
  const size = Math.min(Math.max(parseInt(searchParams.get("size") ?? "300", 10), 100), 1000)
  const format = searchParams.get("format") ?? "png"

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fiberfastusa.com"
  const repUrl = `${baseUrl}/rep/${encodeURIComponent(slug)}?door=1`

  try {
    if (format === "svg") {
      const svg = await QRCode.toString(repUrl, {
        type: "svg",
        width: size,
        margin: 2,
        color: {
          dark: "#0A2540",
          light: "#FFFFFF",
        },
      })

      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      })
    }

    const buffer = await QRCode.toBuffer(repUrl, {
      type: "png",
      width: size,
      margin: 2,
      color: {
        dark: "#0A2540",
        light: "#FFFFFF",
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
