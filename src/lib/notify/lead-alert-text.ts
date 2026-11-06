import { formatLeadNumber, type LeadRecord } from "@/lib/leads/lead-record";
import { SPEED_LABELS, type PreferredSpeed } from "@/lib/validations/lead-schema";

const NOT_PROVIDED = "Not provided";

/** The alert body closers receive: one labeled line per field, so a blank answer is visible rather than missing. */
export function buildAlertText(lead: LeadRecord): string {
  const status = lead.serviceability?.status ?? "unknown";
  const isp = lead.serviceability?.isp ?? lead.isp_declared ?? "unknown ISP";
  const channel = lead.lead_channel === "rep" ? `canvasser ${lead.rep_slug ?? "?"}` : lead.lead_channel;
  return [
    `New lead ${formatLeadNumber(lead.lead_number)} (${channel})`,
    `Name: ${lead.full_name}`,
    `Phone: ${formatPhone(lead.phone)}`,
    `Email: ${lead.email ?? NOT_PROVIDED}`,
    `Address: ${lead.service_address}, ${lead.city ?? ""} ${lead.state ?? ""} ${lead.zip ?? ""}`,
    `Speed: ${formatSpeed(lead.preferred_speed)}`,
    `Wants: ${lead.isp_declared ?? "best option"}${lead.current_provider ? ` · currently on ${lead.current_provider}` : ""}`,
    `Map says: ${status.toUpperCase()} — ${isp}`,
    `Call within the SLA; consent ${lead.consent_text_version ?? "n/a"} captured ${lead.consent_at ?? ""}`,
  ].join("\n");
}

function formatSpeed(speed: string | null): string {
  if (!speed) return NOT_PROVIDED;
  return speed in SPEED_LABELS ? SPEED_LABELS[speed as PreferredSpeed] : speed;
}

function formatPhone(digits: string): string {
  return digits.length === 10 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` : digits;
}
