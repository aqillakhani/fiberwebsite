import type { LeadInput } from "@/lib/validations/lead-schema";

/**
 * Browser-side queue for leads captured while the canvasser's phone has no signal. The filled form is
 * kept in localStorage and re-submitted through the normal server action when the connection returns,
 * so attribution (rep cookie) and the audit trail work exactly as for a live submission.
 * localStorage can be unavailable (private mode) — every call is guarded and degrades to "not queued".
 */
export const PENDING_LEADS_KEY = "ffusa_pending_leads";
export const PENDING_LEADS_EVENT = "ffusa:pending-leads";
export const MAX_QUEUED_LEADS = 200;

export interface PendingLead {
  id: string;
  createdAt: string;
  attempts: number;
  lastError: string | null;
  input: LeadInput;
}

export function readPendingLeads(): PendingLead[] {
  try {
    const raw = window.localStorage.getItem(PENDING_LEADS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as PendingLead[]) : [];
  } catch {
    return [];
  }
}

export function enqueuePendingLead(input: LeadInput): PendingLead | null {
  const pending: PendingLead = { id: newId(), createdAt: new Date().toISOString(), attempts: 0, lastError: null, input };
  const queue = [...readPendingLeads(), pending].slice(-MAX_QUEUED_LEADS);
  return writePendingLeads(queue) ? pending : null;
}

export function removePendingLead(id: string): void {
  writePendingLeads(readPendingLeads().filter((lead) => lead.id !== id));
}

export function markPendingLeadAttempt(id: string, error: string | null): void {
  writePendingLeads(readPendingLeads().map((lead) => (lead.id === id ? { ...lead, attempts: lead.attempts + 1, lastError: error } : lead)));
}

/** True when the failure looks like "no network" rather than the server saying no. */
export function isNetworkFailure(error: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /fetch|network|Failed to fetch|Load failed|ERR_INTERNET|ERR_NETWORK|timeout/i.test(message);
}

function writePendingLeads(queue: PendingLead[]): boolean {
  try {
    window.localStorage.setItem(PENDING_LEADS_KEY, JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent(PENDING_LEADS_EVENT, { detail: queue.length }));
    return true;
  } catch {
    return false;
  }
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
