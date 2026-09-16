/** Statuses the owner sets from /admin/leads (migration 00006). Order = how they appear in the dropdown. */
export const LEAD_STATUSES = ["new", "follow_up", "no_answer", "not_interested", "cancelled", "sold"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Older values still stored on some rows; shown but not offered in the dropdown. */
export const LEGACY_LEAD_STATUSES = ["contacted", "qualified", "converted", "closed"] as const;

export const LEAD_STATUS_LABELS: Record<LeadStatus | (typeof LEGACY_LEAD_STATUSES)[number], string> = {
  new: "New",
  follow_up: "Follow up",
  no_answer: "No answer",
  not_interested: "Not interested",
  cancelled: "Cancelled",
  sold: "Sold",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  closed: "Closed",
};

export const LEAD_STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  follow_up: "bg-amber-100 text-amber-800",
  no_answer: "bg-gray-100 text-gray-700",
  not_interested: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-800",
  sold: "bg-green-100 text-green-800",
};

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

export function leadStatusLabel(status: string | null | undefined): string {
  if (!status) return "—";
  return status in LEAD_STATUS_LABELS ? LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS] : status;
}
