import { NextResponse } from "next/server";

import { formatLeadNumber, type LeadRecord } from "@/lib/leads/lead-record";
import { listRecentLeads } from "@/lib/leads/list-leads";

export const dynamic = "force-dynamic";

const CSV_EXPORT_LIMIT = 5000;

const COLUMNS: ReadonlyArray<[string, (lead: LeadRecord) => string | number | boolean | null | undefined]> = [
  ["lead_number", (lead) => formatLeadNumber(lead.lead_number)],
  ["received_at", (lead) => lead.created_at],
  ["first_name", (lead) => lead.first_name ?? lead.full_name],
  ["last_name", (lead) => lead.last_name],
  ["phone", (lead) => lead.phone],
  ["email", (lead) => lead.email],
  ["date_of_birth", (lead) => lead.date_of_birth],
  ["address", (lead) => lead.service_address],
  ["city", (lead) => lead.city],
  ["state", (lead) => lead.state],
  ["zip", (lead) => lead.zip],
  ["provider_wanted", (lead) => lead.isp_declared],
  ["speed_wanted", (lead) => lead.preferred_speed],
  ["current_provider", (lead) => lead.current_provider],
  ["map_status", (lead) => lead.serviceability_status],
  ["map_isp", (lead) => lead.serviceability?.isp],
  ["channel", (lead) => lead.lead_channel],
  ["rep", (lead) => lead.rep_slug],
  ["source", (lead) => lead.source],
  ["utm_source", (lead) => lead.utm_source],
  ["utm_campaign", (lead) => lead.utm_campaign],
  ["status", (lead) => lead.status],
  ["crm_sync", (lead) => lead.crm_sync_status],
  ["consent", (lead) => lead.consent_contact],
  ["consent_version", (lead) => lead.consent_text_version],
  ["consent_at", (lead) => lead.consent_at],
];

/** CSV of recent leads for the owner (auth enforced in middleware). */
export async function GET(): Promise<NextResponse> {
  const leads = await listRecentLeads(CSV_EXPORT_LIMIT);
  const header = COLUMNS.map(([name]) => name).join(",");
  const rows = leads.map((lead) => COLUMNS.map(([, pick]) => csvCell(pick(lead))).join(","));
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse([header, ...rows].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="fiberfast-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

function csvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
