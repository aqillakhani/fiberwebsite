import type { Metadata } from "next";

import { formatLeadNumber, type LeadRecord } from "@/lib/leads/lead-record";
import { listRecentLeads, LEADS_PAGE_SIZE } from "@/lib/leads/list-leads";
import { ISP_LABELS, SPEED_LABELS, type LeadIsp, type PreferredSpeed } from "@/lib/validations/lead-schema";

export const metadata: Metadata = { title: "Leads | FiberFastUSA admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const SUPABASE_TABLE_URL = "https://supabase.com/dashboard/project/ufpltthmbejponbuocek/editor";

/** Owner-only list of every inbound lead, newest first. Auth is enforced in middleware (HTTP Basic). */
export default async function AdminLeadsPage() {
  const leads = await listRecentLeads();
  return (
    <main className="bg-white min-h-screen text-gray-900">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Inbound leads</h1>
          <p className="text-sm text-gray-600">
            Newest first, last {LEADS_PAGE_SIZE}. Leads are never deleted; mark them closed in the CRM instead.
          </p>
        </div>
        <nav className="flex gap-3 text-sm font-semibold">
          <a href="/admin/leads.csv" className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50">
            Download CSV
          </a>
          <a href={SUPABASE_TABLE_URL} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50">
            Open in Supabase
          </a>
        </nav>
      </header>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              {["#", "Received", "Name", "Phone", "Email", "Address", "Wants", "Speed", "Map says", "Channel / rep", "Status", "Consent"].map((label) => (
                <th key={label} className="px-3 py-2 font-semibold">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={12} className="px-3 py-8 text-center text-gray-500">
                  No leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </main>
  );
}

function LeadRow({ lead }: { lead: LeadRecord }) {
  const name = lead.first_name ? `${lead.first_name} ${lead.last_name ?? ""}`.trim() : lead.full_name;
  const mapIsp = lead.serviceability?.isp ? ` — ${labelIsp(lead.serviceability.isp)}` : "";
  return (
    <tr className="align-top">
      <td className="px-3 py-2 font-mono font-semibold text-gray-900">{formatLeadNumber(lead.lead_number)}</td>
      <td className="px-3 py-2 whitespace-nowrap text-gray-700">{formatWhen(lead.created_at)}</td>
      <td className="px-3 py-2 font-semibold text-gray-900">
        {name}
        {lead.date_of_birth && <div className="text-xs font-normal text-gray-500">DOB {lead.date_of_birth}</div>}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <a href={`tel:+1${lead.phone}`} className="text-fiber-blue hover:underline">
          {formatPhone(lead.phone)}
        </a>
      </td>
      <td className="px-3 py-2 text-gray-700">{lead.email ?? "—"}</td>
      <td className="px-3 py-2 text-gray-700">
        {lead.service_address}
        <div className="text-xs text-gray-500">
          {lead.city}, {lead.state} {lead.zip}
        </div>
      </td>
      <td className="px-3 py-2 text-gray-900">{labelIsp(lead.isp_declared)}</td>
      <td className="px-3 py-2 text-gray-700">{labelSpeed(lead.preferred_speed)}</td>
      <td className="px-3 py-2 text-gray-700">
        {(lead.serviceability_status ?? "unknown").replace("_", " ")}
        {mapIsp}
      </td>
      <td className="px-3 py-2 text-gray-700">
        {lead.lead_channel}
        {lead.rep_slug && <div className="text-xs text-gray-500">{lead.rep_slug}</div>}
        {lead.utm_campaign && <div className="text-xs text-gray-500">{lead.utm_campaign}</div>}
      </td>
      <td className="px-3 py-2">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-800">{lead.status}</span>
        <div className="mt-1 text-xs text-gray-500">CRM {lead.crm_sync_status}</div>
      </td>
      <td className="px-3 py-2 text-xs text-gray-500">
        {lead.consent_contact ? `yes · ${lead.consent_text_version ?? ""}` : "no"}
      </td>
    </tr>
  );
}

function labelIsp(isp: string | null | undefined): string {
  if (!isp) return "—";
  return isp in ISP_LABELS ? ISP_LABELS[isp as LeadIsp] : isp;
}

function labelSpeed(speed: string | null | undefined): string {
  if (!speed) return "—";
  return speed in SPEED_LABELS ? SPEED_LABELS[speed as PreferredSpeed] : speed;
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { timeZone: "America/Chicago", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatPhone(digits: string): string {
  return digits.length === 10 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` : digits;
}
