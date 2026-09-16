"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";

import { updateLeadStatus } from "@/actions/update-lead-status";
import { isLeadStatus, LEAD_STATUS_LABELS, LEAD_STATUS_STYLES, LEAD_STATUSES, leadStatusLabel, type LeadStatus } from "@/lib/leads/lead-status";
import { cn } from "@/lib/utils";

interface LeadStatusEditorProps {
  leadId: string;
  status: string;
  closerName: string | null;
  closerNote: string | null;
}

const SAVED_FLASH_MS = 2500;

/** Inline status dropdown + "closed by" + note for one lead row; saves on change / blur. */
export function LeadStatusEditor({ leadId, status: initialStatus, closerName: initialCloser, closerNote: initialNote }: LeadStatusEditorProps) {
  const [status, setStatus] = useState<LeadStatus>(isLeadStatus(initialStatus) ? initialStatus : "new");
  const [closerName, setCloserName] = useState(initialCloser ?? "");
  const [closerNote, setCloserNote] = useState(initialNote ?? "");
  const [savedAt, setSavedAt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const isLegacy = !isLeadStatus(initialStatus) && initialStatus !== status;

  const save = (next: { status?: LeadStatus; closerName?: string; closerNote?: string }) => {
    const payload = { leadId, status: next.status ?? status, closerName: next.closerName ?? closerName, closerNote: next.closerNote ?? closerNote };
    startSaving(async () => {
      setError(null);
      const outcome = await updateLeadStatus(payload);
      if (!outcome.success) {
        setError(outcome.error);
        return;
      }
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(0), SAVED_FLASH_MS);
    });
  };

  return (
    <div className="flex min-w-[220px] flex-col gap-1.5">
      <select
        value={status}
        onChange={(event) => {
          const next = event.target.value as LeadStatus;
          setStatus(next);
          save({ status: next });
        }}
        aria-label="Lead status"
        className={cn("h-8 rounded-md border border-gray-300 px-2 text-xs font-semibold", LEAD_STATUS_STYLES[status])}
      >
        {LEAD_STATUSES.map((value) => (
          <option key={value} value={value}>
            {LEAD_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      {isLegacy && <span className="text-[11px] text-gray-500">was: {leadStatusLabel(initialStatus)}</span>}
      <input
        value={closerName}
        onChange={(event) => setCloserName(event.target.value)}
        onBlur={() => closerName !== (initialCloser ?? "") && save({ closerName })}
        placeholder="Closed by (sales rep)"
        aria-label="Closed by"
        className="h-8 rounded-md border border-gray-300 px-2 text-xs"
      />
      <input
        value={closerNote}
        onChange={(event) => setCloserNote(event.target.value)}
        onBlur={() => closerNote !== (initialNote ?? "") && save({ closerNote })}
        placeholder="Note (optional)"
        aria-label="Note"
        className="h-8 rounded-md border border-gray-300 px-2 text-xs"
      />
      <span className="flex h-4 items-center gap-1 text-[11px] text-gray-500">
        {isSaving && <><Loader2 className="size-3 animate-spin" aria-hidden /> Saving…</>}
        {!isSaving && savedAt > 0 && <><Check className="size-3 text-fiber-success" aria-hidden /> Saved</>}
        {!isSaving && error && <span className="text-fiber-red">{error}</span>}
      </span>
    </div>
  );
}
