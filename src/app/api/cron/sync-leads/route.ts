import { timingSafeEqual } from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";

import { deliverToCrm } from "@/lib/leads/deliver-lead";
import { listUnsyncedLeads } from "@/lib/leads/persist-lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BATCH_SIZE = 50;
const HEALTH_TIMEOUT_MS = 5000;

/**
 * GET /api/cron/sync-leads — drains leads whose CRM delivery is still pending/failed and pings the CRM
 * health endpoint so its free-tier database never idles into a pause. Protected by `CRON_SECRET`
 * (Vercel sends it as `Authorization: Bearer`; GitHub Actions can send the same header).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const leads = await listUnsyncedLeads(BATCH_SIZE);
  const outcomes = await Promise.all(leads.map((lead) => deliverToCrm(lead)));
  const crmAwake = await pingCrmHealth();

  return NextResponse.json({
    scanned: leads.length,
    synced: outcomes.filter(Boolean).length,
    crm_health: crmAwake,
    ran_at: new Date().toISOString(),
  });
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret || provided.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(secret));
}

async function pingCrmHealth(): Promise<"ok" | "down" | "unconfigured"> {
  const intakeUrl = process.env.FFDEALFLOW_INBOUND_URL;
  if (!intakeUrl) return "unconfigured";
  try {
    const healthUrl = new URL("/api/inbound/health", intakeUrl);
    const response = await fetch(healthUrl, { signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS) });
    return response.ok ? "ok" : "down";
  } catch {
    return "down";
  }
}
