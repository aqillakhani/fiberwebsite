import "server-only";

import { syncLeadToCrm } from "@/lib/crm/sync-lead";
import { sendLeadEvent } from "@/lib/meta/capi";
import { notifyClosers } from "@/lib/notify/notify-closers";
import type { LeadRecord } from "./lead-record";
import { recordLeadEvents, updateLead, type LeadEventType } from "./persist-lead";

/**
 * Fan-out after the lead is safely stored: CRM, closer alert, Meta CAPI — in parallel, each failure
 * isolated and written back to the row so the cron can heal it and the audit trail shows what happened.
 */

export interface DeliveryContext {
  ip: string | null;
  userAgent: string | null;
  sourceUrl: string;
}

export async function deliverLead(lead: LeadRecord, context: DeliveryContext): Promise<void> {
  await Promise.allSettled([deliverToCrm(lead), deliverNotification(lead), deliverCapiEvent(lead, context)]);
}

export async function deliverToCrm(lead: LeadRecord): Promise<boolean> {
  const result = await syncLeadToCrm(lead);
  const attempts = lead.crm_sync_attempts + 1;
  if (result.ok) {
    await updateLead(lead.id, { crm_sync_status: "synced", crm_sync_attempts: attempts, crm_synced_at: new Date().toISOString(), crm_pin_id: result.pinId, crm_sync_error: null });
    await logEvent(lead.id, "crm_synced", { pin_id: result.pinId, created: result.created });
    return true;
  }
  await updateLead(lead.id, { crm_sync_status: result.retryable ? "pending" : "failed", crm_sync_attempts: attempts, crm_sync_error: result.error });
  await logEvent(lead.id, "crm_sync_failed", { error: result.error, retryable: result.retryable });
  return false;
}

async function deliverNotification(lead: LeadRecord): Promise<void> {
  const outcome = await notifyClosers(lead);
  if (outcome.attempted === 0) return;
  if (outcome.delivered > 0) {
    await updateLead(lead.id, { notified_at: new Date().toISOString() });
    await logEvent(lead.id, "notified", { delivered: outcome.delivered, attempted: outcome.attempted, errors: outcome.errors });
    return;
  }
  await logEvent(lead.id, "notify_failed", { errors: outcome.errors });
}

async function deliverCapiEvent(lead: LeadRecord, context: DeliveryContext): Promise<void> {
  const outcome = await sendLeadEvent(lead, context);
  if (outcome.sent) {
    await updateLead(lead.id, { capi_event_id: outcome.eventId });
    await logEvent(lead.id, "capi_sent", { event_id: outcome.eventId });
    return;
  }
  if (outcome.error !== "Meta CAPI not configured") await logEvent(lead.id, "capi_failed", { error: outcome.error });
}

async function logEvent(leadId: string, type: LeadEventType, payload: Record<string, unknown>): Promise<void> {
  await recordLeadEvents(leadId, [{ type, payload }]);
}
