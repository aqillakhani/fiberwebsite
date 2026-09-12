import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { checkServiceability } from "@/lib/serviceability/check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ADDRESS_LENGTH = 200;

const querySchema = z.object({
  address: z.string().trim().min(5).max(MAX_ADDRESS_LENGTH),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
});

/** GET /api/serviceability?address=...&lat=..&lon=.. — read-only lookup against map_pin. */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "address (5–200 chars) is required; lat/lon optional" }, { status: 400 });
  }
  try {
    const result = await checkServiceability(parsed.data);
    return NextResponse.json(result, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch (error) {
    console.error("[serviceability] lookup failed", { address: parsed.data.address, error });
    return NextResponse.json({ error: "Serviceability lookup is temporarily unavailable" }, { status: 503 });
  }
}
