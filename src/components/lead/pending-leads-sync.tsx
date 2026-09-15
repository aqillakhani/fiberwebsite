"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloudOff, Loader2, CheckCircle2 } from "lucide-react";

import { submitLead } from "@/actions/submit-lead";
import { isNetworkFailure, markPendingLeadAttempt, PENDING_LEADS_EVENT, readPendingLeads, removePendingLead } from "@/lib/leads/offline-queue";
import { cn } from "@/lib/utils";

const RETRY_INTERVAL_MS = 30_000;
const FLASH_MS = 4_000;

/**
 * Drains leads that were saved on the phone while offline (see lib/leads/offline-queue.ts).
 * Retries when the browser comes back online, on an interval, and on mount. Shows the rep a small
 * status pill so nothing is silently lost.
 */
export function PendingLeadsSync() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const isDraining = useRef(false);

  const drain = useCallback(async () => {
    if (isDraining.current || (typeof navigator !== "undefined" && navigator.onLine === false)) return;
    const queue = readPendingLeads();
    if (queue.length === 0) return;
    isDraining.current = true;
    setIsSyncing(true);
    let sent = 0;
    for (const pending of queue) {
      try {
        const outcome = await submitLead(pending.input);
        if (outcome.success) {
          removePendingLead(pending.id);
          sent += 1;
        } else {
          // Server answered but refused (validation etc.): keep it, record why, a person decides.
          markPendingLeadAttempt(pending.id, outcome.error);
        }
      } catch (error) {
        markPendingLeadAttempt(pending.id, error instanceof Error ? error.message : String(error));
        if (isNetworkFailure(error)) break; // still offline; try again later
      }
    }
    isDraining.current = false;
    setIsSyncing(false);
    setPendingCount(readPendingLeads().length);
    if (sent > 0) {
      setSentCount(sent);
      window.setTimeout(() => setSentCount(0), FLASH_MS);
    }
  }, []);

  useEffect(() => {
    setPendingCount(readPendingLeads().length);
    void drain();
    const handleQueueChange = () => setPendingCount(readPendingLeads().length);
    const interval = window.setInterval(() => void drain(), RETRY_INTERVAL_MS);
    window.addEventListener("online", drain);
    window.addEventListener(PENDING_LEADS_EVENT, handleQueueChange);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("online", drain);
      window.removeEventListener(PENDING_LEADS_EVENT, handleQueueChange);
    };
  }, [drain]);

  if (pendingCount === 0 && sentCount === 0) return null;

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold",
        pendingCount > 0 ? "border-amber-300 bg-amber-50 text-amber-900" : "border-green-200 bg-green-50 text-fiber-success"
      )}
    >
      {isSyncing ? <Loader2 className="size-4 animate-spin" aria-hidden /> : pendingCount > 0 ? <CloudOff className="size-4" aria-hidden /> : <CheckCircle2 className="size-4" aria-hidden />}
      {isSyncing
        ? `Sending ${pendingCount} saved ${pendingCount === 1 ? "lead" : "leads"}…`
        : pendingCount > 0
          ? `${pendingCount} ${pendingCount === 1 ? "lead" : "leads"} saved on this phone — sends when signal returns`
          : `${sentCount} saved ${sentCount === 1 ? "lead" : "leads"} sent to the closing team`}
    </div>
  );
}
