import "server-only";

import { formatLeadNumber, type LeadRecord } from "@/lib/leads/lead-record";

/**
 * Site-side "a lead just landed" alert. The CRM does the rich notification (SMS to on-duty closers);
 * this is the independent fallback so a CRM outage never means a silent lead.
 * Channels: Slack-compatible webhooks (`LEAD_NOTIFY_WEBHOOK_URLS`, comma-separated) and email via Resend
 * (`RESEND_API_KEY` + `CLOSER_ALERT_EMAILS`). Unconfigured channels are skipped.
 */

const NOTIFY_TIMEOUT_MS = 5000;
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const ALERT_FROM = "FiberFast Leads <leads@fiberfastusa.com>";

export interface NotifyOutcome {
  delivered: number;
  attempted: number;
  errors: string[];
}

export async function notifyClosers(lead: LeadRecord): Promise<NotifyOutcome> {
  const text = buildAlertText(lead);
  const webhookUrls = splitList(process.env.LEAD_NOTIFY_WEBHOOK_URLS);
  const emails = splitList(process.env.CLOSER_ALERT_EMAILS);

  const jobs: Promise<void>[] = [
    ...webhookUrls.map((url) => postJson(url, { text })),
    ...(emails.length ? [sendEmail(emails, `New lead ${formatLeadNumber(lead.lead_number)} — ${lead.city ?? ""} ${lead.state ?? ""}`.trim(), text)] : []),
  ];
  const settled = await Promise.allSettled(jobs);
  return {
    attempted: settled.length,
    delivered: settled.filter((job) => job.status === "fulfilled").length,
    errors: settled.flatMap((job) => (job.status === "rejected" ? [String(job.reason)] : [])),
  };
}

function buildAlertText(lead: LeadRecord): string {
  const status = lead.serviceability?.status ?? "unknown";
  const isp = lead.serviceability?.isp ?? lead.isp_declared ?? "unknown ISP";
  const channel = lead.lead_channel === "rep" ? `canvasser ${lead.rep_slug ?? "?"}` : lead.lead_channel;
  return [
    `New lead ${formatLeadNumber(lead.lead_number)} (${channel})`,
    `${lead.full_name} · ${formatPhone(lead.phone)}`,
    `${lead.service_address}, ${lead.city ?? ""} ${lead.state ?? ""} ${lead.zip ?? ""}`,
    `Serviceability: ${status.toUpperCase()} — ${isp}${lead.current_provider ? ` · currently on ${lead.current_provider}` : ""}`,
    `Call within the SLA; consent ${lead.consent_text_version ?? "n/a"} captured ${lead.consent_at ?? ""}`,
  ].join("\n");
}

function formatPhone(digits: string): string {
  return digits.length === 10 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` : digits;
}

function splitList(raw: string | undefined): string[] {
  return (raw ?? "").split(",").map((part) => part.trim()).filter(Boolean);
}

async function postJson(url: string, body: unknown): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`webhook ${new URL(url).host} responded ${response.status}`);
}

async function sendEmail(to: string[], subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from: ALERT_FROM, to, subject, text }),
    signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Resend responded ${response.status}`);
}
