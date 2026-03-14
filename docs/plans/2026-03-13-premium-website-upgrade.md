# FiberFastUSA Premium Website Upgrade — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform fiberfastusa.com from a template site into a door-to-door sales conversion engine with Door Mode, persistent rep attribution, guided qualification flow, and premium visual upgrade.

**Architecture:** Next.js 15 App Router with React 19, Tailwind CSS, Supabase backend. New features are additive — new components + provider, existing server actions extended. Cookie-based attribution wraps the entire app via a client context provider in layout.tsx.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, react-hook-form + Zod, Supabase, lucide-react, next-themes

---

## Phase 1: Foundation (Attribution + Schema + Bug Fixes)

Everything else builds on this. Goal: attribution system, schema changes, bug fixes.

---

### Task 1: Add new fields to leadSchema

**Files:**
- Modify: `src/lib/validations/schemas.ts:1-34`

**Step 1: Add new optional fields to leadSchema**

Add `selectedPlan`, `preferredInstallDate`, `preferredInstallTime` to the existing schema:

```typescript
// In leadSchema, after the repId field (line 31), add:
  selectedPlan: z.string().optional(),
  preferredInstallDate: z.string().optional(),
  preferredInstallTime: z.enum(["morning", "afternoon", "no-preference"]).optional(),
```

**Step 2: Verify build**

Run: `cd /c/Users/claws/OneDrive/Desktop/fiberwebsite && npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/lib/validations/schemas.ts
git commit -m "feat: add selectedPlan, preferredInstallDate, preferredInstallTime to leadSchema"
```

---

### Task 2: Update submitLead to pass new fields to Supabase

**Files:**
- Modify: `src/actions/submit-lead.ts:24-39`

**Step 1: Add new columns to the insert call**

After `rep_id: parsed.data.repId,` (line 39), add:

```typescript
      selected_plan: parsed.data.selectedPlan,
      preferred_install_date: parsed.data.preferredInstallDate,
      preferred_install_time: parsed.data.preferredInstallTime,
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No type errors (Supabase client is untyped, so column names are not checked at compile time)

**Step 3: Commit**

```bash
git add src/actions/submit-lead.ts
git commit -m "feat: pass selectedPlan, preferredInstallDate, preferredInstallTime to Supabase"
```

> **NOTE:** The SQL migration (`ALTER TABLE public_leads ADD COLUMN ...`) must be run manually in Supabase SQL Editor before these fields will persist. The app won't break without it — Supabase silently ignores unknown columns.

---

### Task 3: Create attribution utilities

**Files:**
- Create: `src/lib/attribution.ts`

**Step 1: Write the attribution cookie utilities**

```typescript
"use client"

const REP_COOKIE_NAME = "ffusa_rep"
const REP_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export function getRepAttribution(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${REP_COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function setRepAttribution(repSlug: string): void {
  if (typeof document === "undefined") return
  document.cookie = `${REP_COOKIE_NAME}=${encodeURIComponent(repSlug)}; path=/; max-age=${REP_COOKIE_MAX_AGE}; SameSite=Lax`
}

export function clearRepAttribution(): void {
  if (typeof document === "undefined") return
  document.cookie = `${REP_COOKIE_NAME}=; path=/; max-age=0`
}

/**
 * Resolve rep_id from multiple sources. Priority:
 * 1. Explicit repId prop (e.g. on rep page form)
 * 2. URL ?rep= param
 * 3. Cookie ffusa_rep
 * 4. null (organic)
 */
export function resolveRepId(explicit?: string, urlParam?: string | null): string | null {
  if (explicit) return explicit
  if (urlParam) return urlParam
  return getRepAttribution()
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/attribution.ts
git commit -m "feat: add cookie-based rep attribution utilities"
```

---

### Task 4: Create address memory utilities

**Files:**
- Create: `src/lib/address-memory.ts`

**Step 1: Write localStorage utilities for returning users**

```typescript
"use client"

const STORAGE_PREFIX = "ffusa_"
const EXPIRY_DAYS = 90

type SavedUserData = {
  serviceAddress?: string
  city?: string
  state?: string
  zip?: string
  fullName?: string
  email?: string
  phone?: string
  savedAt: number
}

function isExpired(savedAt: number): boolean {
  const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000
  return Date.now() - savedAt > expiryMs
}

export function getSavedUserData(): SavedUserData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}user`)
    if (!raw) return null
    const data: SavedUserData = JSON.parse(raw)
    if (isExpired(data.savedAt)) {
      clearSavedUserData()
      return null
    }
    return data
  } catch {
    return null
  }
}

export function saveUserData(data: Omit<SavedUserData, "savedAt">): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}user`,
      JSON.stringify({ ...data, savedAt: Date.now() })
    )
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function clearSavedUserData(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}user`)
  } catch {
    // silently fail
  }
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/address-memory.ts
git commit -m "feat: add localStorage-based address memory for returning users"
```

---

### Task 5: Create Attribution Provider

**Files:**
- Create: `src/components/providers/attribution-provider.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Write the attribution context provider**

```typescript
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { getRepAttribution, setRepAttribution, resolveRepId } from "@/lib/attribution"

type AttributionContextValue = {
  repId: string | null
  repName: string | null
}

const AttributionContext = createContext<AttributionContextValue>({
  repId: null,
  repName: null,
})

export function useAttribution() {
  return useContext(AttributionContext)
}

export function AttributionProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const [repId, setRepId] = useState<string | null>(null)
  const [repName, setRepName] = useState<string | null>(null)

  useEffect(() => {
    const urlRep = searchParams.get("rep")
    const resolved = resolveRepId(undefined, urlRep)

    // If URL has rep param, persist it to cookie
    if (urlRep) {
      setRepAttribution(urlRep)
    }

    setRepId(resolved)
  }, [searchParams])

  useEffect(() => {
    // Read rep name from cookie storage if we have repId
    if (repId && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ffusa_rep_name")
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.slug === repId) {
            setRepName(parsed.name)
          }
        }
      } catch {
        // ignore
      }
    }
  }, [repId])

  return (
    <AttributionContext.Provider value={{ repId, repName }}>
      {children}
    </AttributionContext.Provider>
  )
}

/** Call this from rep pages to store the rep name for header badge display */
export function storeRepName(slug: string, name: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("ffusa_rep_name", JSON.stringify({ slug, name }))
  } catch {
    // ignore
  }
}
```

**Step 2: Wire into layout.tsx**

In `src/app/layout.tsx`, add the import and wrap children with the provider. The provider uses `useSearchParams` which requires Suspense:

```typescript
// Add import at top:
import { Suspense } from "react"
import { AttributionProvider } from "@/components/providers/attribution-provider"

// In the body, wrap {children} with:
<Suspense fallback={null}>
  <AttributionProvider>
    <Header />
    {children}
    <Footer />
    <MobileStickyCtA />
  </AttributionProvider>
</Suspense>
```

Remove the existing `<Header />`, `{children}`, `<Footer />`, `<MobileStickyCtA />` that are outside the provider.

**Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/providers/attribution-provider.tsx src/app/layout.tsx
git commit -m "feat: add AttributionProvider with cookie + URL param tracking"
```

---

### Task 6: Fix CompactLeadForm empty city/state bug

**Files:**
- Modify: `src/components/forms/compact-lead-form.tsx:12-21,44-58`

**Step 1: Add city and state fields to the schema and form**

Update the `compactLeadSchema` to include city and state:

```typescript
const compactLeadSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .regex(/^[\d\s\-()+ ]+$/, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  serviceAddress: z.string().min(5, "Street address required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code required").max(10),
})
```

Update `onSubmit` to pass real city/state:

```typescript
  async function onSubmit(data: CompactLeadValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await submitLead({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      serviceAddress: data.serviceAddress,
      city: data.city,
      state: data.state,
      zip: data.zip,
      source,
      repId: repId,
    })
```

Add city and state input fields to the form — insert them in the address grid area, changing from 3-column to proper layout:

Replace the address grid (lines 128-153) with:

```tsx
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <input
            {...register("serviceAddress")}
            type="text"
            placeholder="Street Address"
            autoComplete="street-address"
            className={inputClasses}
          />
          {errors.serviceAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.serviceAddress.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("city")}
            type="text"
            placeholder="City"
            autoComplete="address-level2"
            className={inputClasses}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              {...register("state")}
              type="text"
              placeholder="State"
              autoComplete="address-level1"
              className={inputClasses}
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("zip")}
              type="text"
              placeholder="ZIP"
              autoComplete="postal-code"
              className={inputClasses}
            />
            {errors.zip && (
              <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>
            )}
          </div>
        </div>
      </div>
```

**Step 2: Add attribution hook usage**

Import and use attribution:

```typescript
import { useAttribution } from "@/components/providers/attribution-provider"

// Inside the component, before useForm:
  const { repId: attributionRepId } = useAttribution()

// In onSubmit, resolve repId:
  repId: repId ?? attributionRepId ?? undefined,
```

**Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/forms/compact-lead-form.tsx
git commit -m "fix: add city/state fields to CompactLeadForm, use attribution for rep_id"
```

---

### Task 7: Fix "Fastest in Colorado" bug in check-availability

**Files:**
- Modify: `src/app/check-availability/page.tsx:14`

**Step 1: Replace trust signal**

Change line 14 from:
```typescript
    { icon: Zap, label: "Fastest in Colorado" },
```
to:
```typescript
    { icon: Zap, label: "Nationwide Fiber Coverage" },
```

**Step 2: Commit**

```bash
git add src/app/check-availability/page.tsx
git commit -m "fix: replace 'Fastest in Colorado' with 'Nationwide Fiber Coverage'"
```

---

### Task 8: Update QR code URL to include ?door=1

**Files:**
- Modify: `src/app/api/qr/[slug]/route.ts:19`
- Modify: `src/app/api/qr/[slug]/card/route.tsx:25`

**Step 1: Update QR route**

In `route.ts`, change line 19 from:
```typescript
  const repUrl = `${baseUrl}/rep/${encodeURIComponent(slug)}`
```
to:
```typescript
  const repUrl = `${baseUrl}/rep/${encodeURIComponent(slug)}?door=1`
```

**Step 2: Update card route**

In `card/route.tsx`, change line 25 from:
```typescript
  const repUrl = `${baseUrl}/rep/${encodeURIComponent(slug)}`
```
to:
```typescript
  const repUrl = `${baseUrl}/rep/${encodeURIComponent(slug)}?door=1`
```

Also add territory to the card. After the email display (line 105), add:

```tsx
              {rep.territory && (
                <div style={{ fontSize: "13px", color: "#CBD5E1" }}>
                  {rep.territory}
                </div>
              )}
```

**Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/app/api/qr/[slug]/route.ts src/app/api/qr/[slug]/card/route.tsx
git commit -m "feat: QR codes now link to Door Mode (?door=1), add territory to business card"
```

---

### Task 9: Add analytics events for Door Mode

**Files:**
- Modify: `src/lib/analytics.ts`

**Step 1: Add Door Mode tracking functions**

Add after the existing functions:

```typescript
export function trackDoorModeView(repId: string) {
  trackEvent("door_mode_view", { rep_id: repId })
}

export function trackDoorModeSubmit(repId: string, plan: string) {
  trackEvent("door_mode_submit", { rep_id: repId, plan })
}
```

**Step 2: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat: add Door Mode analytics tracking events"
```

---

## Phase 2: Core Conversion Features (Door Mode + Qualification Flow + Confirmation)

---

### Task 10: Create date picker component

**Files:**
- Create: `src/components/ui/date-picker.tsx`

**Step 1: Build install date picker with 3-4 day minimum**

```typescript
"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type DatePickerProps = {
  value?: string // ISO date string YYYY-MM-DD
  onChange: (date: string) => void
  minDaysFromNow?: number
  className?: string
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0]
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function DatePicker({ value, onChange, minDaysFromNow = 4, className }: DatePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minDate = addDays(today, minDaysFromNow)

  const selectedDate = value ? new Date(value + "T00:00:00") : null
  const [viewMonth, setViewMonth] = useState(minDate.getMonth())
  const [viewYear, setViewYear] = useState(minDate.getFullYear())

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const startOffset = firstDay.getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    const days: Array<{ date: Date; inMonth: boolean; disabled: boolean }> = []

    // Previous month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth, -i)
      days.push({ date: d, inMonth: false, disabled: true })
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(viewYear, viewMonth, i)
      days.push({ date: d, inMonth: true, disabled: d < minDate })
    }

    // Next month padding
    const remaining = 7 - (days.length % 7)
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(viewYear, viewMonth + 1, i)
        days.push({ date: d, inMonth: false, disabled: true })
      }
    }

    return days
  }, [viewMonth, viewYear, minDate])

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const canGoPrev = new Date(viewYear, viewMonth, 1) > minDate

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted">
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(({ date, inMonth, disabled }, i) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate)
          const isToday = isSameDay(date, today)

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(formatDateISO(date))}
              className={cn(
                "h-9 rounded-lg text-sm transition-colors",
                !inMonth && "text-muted-foreground/30",
                inMonth && !disabled && "hover:bg-muted text-foreground",
                disabled && "text-muted-foreground/40 cursor-not-allowed",
                isSelected && "bg-fiber-orange text-white hover:bg-fiber-orange/90",
                isToday && !isSelected && "ring-1 ring-fiber-orange/40",
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground mt-3">
        Earliest available: {minDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
    </div>
  )
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/components/ui/date-picker.tsx
git commit -m "feat: add DatePicker component with min-days-from-now constraint"
```

---

### Task 11: Create plan selector component

**Files:**
- Create: `src/components/ui/plan-selector.tsx`

**Step 1: Build compact plan radio cards**

```typescript
"use client"

import { Check, Gift, Zap, Star } from "lucide-react"
import { PLANS, type PlanTier } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type PlanSelectorProps = {
  value?: string
  onChange: (planId: string) => void
  plans?: readonly PlanTier[]
  compact?: boolean
  className?: string
}

export function PlanSelector({
  value,
  onChange,
  plans = PLANS.slice(0, 4),
  compact = false,
  className,
}: PlanSelectorProps) {
  return (
    <div className={cn("grid gap-3", compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2", className)}>
      {plans.map((plan) => {
        const isSelected = value === plan.id
        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onChange(plan.id)}
            className={cn(
              "relative flex flex-col text-left rounded-xl border-2 p-4 transition-all",
              isSelected
                ? "border-fiber-orange bg-fiber-orange/5 shadow-md"
                : "border-border hover:border-fiber-orange/40 bg-card",
              plan.isFeatured && !isSelected && "border-fiber-blue/30",
            )}
          >
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 size-5 rounded-full bg-fiber-orange flex items-center justify-center">
                <Check className="size-3 text-white" />
              </div>
            )}

            {/* Featured badge */}
            {plan.isFeatured && (
              <Badge className="w-fit mb-2 bg-fiber-orange/10 text-fiber-orange border-fiber-orange/20 text-xs">
                <Star className="size-3 mr-1" />
                Most Popular
              </Badge>
            )}

            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="font-bold text-foreground">{plan.name}</span>
              <span className="text-lg font-bold text-foreground">
                ${plan.price}<span className="text-xs font-normal text-muted-foreground">/mo</span>
              </span>
            </div>

            <span className="text-sm text-fiber-blue font-semibold mb-1">{plan.speed}</span>
            <span className="text-xs text-muted-foreground mb-2">{plan.bestFor}</span>

            {!compact && (
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {plan.freeMonths !== null && (
                  <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                    <Zap className="size-2.5 mr-0.5" />
                    {plan.freeMonths}mo FREE
                  </Badge>
                )}
                {plan.giftCard > 0 && (
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-0">
                    <Gift className="size-2.5 mr-0.5" />
                    ${plan.giftCard} Card
                  </Badge>
                )}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/components/ui/plan-selector.tsx
git commit -m "feat: add PlanSelector radio card component"
```

---

### Task 12: Create confirmation screen component

**Files:**
- Create: `src/components/ui/confirmation-screen.tsx`

**Step 1: Build the reusable confirmation component**

```typescript
import { CheckCircle, Phone } from "lucide-react"
import { COMPANY, PLANS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type ConfirmationScreenProps = {
  firstName: string
  repName?: string | null
  selectedPlan?: string | null
  preferredDate?: string | null
  variant?: "default" | "door-mode" | "check-availability"
}

export function ConfirmationScreen({
  firstName,
  repName,
  selectedPlan,
  preferredDate,
  variant = "default",
}: ConfirmationScreenProps) {
  const plan = selectedPlan ? PLANS.find((p) => p.id === selectedPlan) : null

  const formattedDate = preferredDate
    ? new Date(preferredDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null

  const contactPerson = repName ?? "A FiberFastUSA representative"

  return (
    <div className="text-center py-8 px-4">
      <CheckCircle className="size-16 text-fiber-success mx-auto mb-6" />

      <h3 className="text-2xl font-bold text-foreground mb-2">
        You&apos;re all set, {firstName}!
      </h3>

      <div className="mt-8 max-w-md mx-auto text-left space-y-4">
        <h4 className="font-semibold text-foreground text-center mb-4">What happens next:</h4>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 size-6 rounded-full bg-fiber-orange text-white text-xs font-bold flex items-center justify-center">1</span>
            <span className="text-sm text-muted-foreground">
              {contactPerson} will call you within 24 hours
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 size-6 rounded-full bg-fiber-orange text-white text-xs font-bold flex items-center justify-center">2</span>
            <span className="text-sm text-muted-foreground">
              We&apos;ll confirm fiber availability at your address
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 size-6 rounded-full bg-fiber-orange text-white text-xs font-bold flex items-center justify-center">3</span>
            <span className="text-sm text-muted-foreground">
              We&apos;ll schedule your installation{formattedDate ? ` for ${formattedDate}` : " for a convenient time"}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 size-6 rounded-full bg-fiber-orange text-white text-xs font-bold flex items-center justify-center">4</span>
            <span className="text-sm text-muted-foreground">
              A technician will install your fiber connection (typically 2-4 hours)
            </span>
          </li>
        </ol>
      </div>

      {plan && (
        <div className="mt-6 mx-auto max-w-sm rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-semibold text-foreground">
            Your selected plan: {plan.name} — ${plan.price}/mo
          </p>
          {plan.giftCard > 0 && (
            <p className="text-sm text-fiber-orange font-medium mt-1">
              Plus a ${plan.giftCard} Visa Gift Card!
            </p>
          )}
        </div>
      )}

      <div className="mt-8 space-y-3">
        {variant === "door-mode" && (
          <p className="text-sm text-muted-foreground">
            You can close this page — {repName ?? "your rep"} has your info.
          </p>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Phone className="size-4" />
          <span>Questions? Call us at {COMPANY.phone}</span>
        </div>

        <Link href="/">
          <Button variant="outline" className="mt-2">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/components/ui/confirmation-screen.tsx
git commit -m "feat: add reusable ConfirmationScreen with 'What Happens Next' steps"
```

---

### Task 13: Create Door Mode form

**Files:**
- Create: `src/components/forms/door-mode-form.tsx`

**Step 1: Build the all-in-one Door Mode form**

```typescript
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PlanSelector } from "@/components/ui/plan-selector"
import { DatePicker } from "@/components/ui/date-picker"
import { ConfirmationScreen } from "@/components/ui/confirmation-screen"
import { submitLead } from "@/actions/submit-lead"
import { setRepAttribution, storeRepName } from "@/lib/attribution"
import { saveUserData, getSavedUserData } from "@/lib/address-memory"
import { trackDoorModeSubmit } from "@/lib/analytics"
import { PLANS } from "@/lib/constants"

// storeRepName is from attribution-provider.tsx, re-export for convenience
export { storeRepName } from "@/components/providers/attribution-provider"

const doorModeSchema = z.object({
  serviceAddress: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code required").max(10),
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number required").regex(/^[\d\s\-()+ ]+$/, "Valid phone required"),
  email: z.string().email("Valid email required"),
})

type DoorModeValues = z.infer<typeof doorModeSchema>

type DoorModeFormProps = {
  repSlug: string
  repName: string
  defaultAddress?: string
  defaultPlan?: string
}

export default function DoorModeForm({ repSlug, repName, defaultAddress, defaultPlan }: DoorModeFormProps) {
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan ?? "gig-1")
  const [installDate, setInstallDate] = useState("")
  const [installTime, setInstallTime] = useState<"morning" | "afternoon" | "no-preference">("no-preference")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedFirstName, setSubmittedFirstName] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DoorModeValues>({
    resolver: zodResolver(doorModeSchema),
    defaultValues: {
      serviceAddress: defaultAddress ?? "",
    },
  })

  // Set attribution cookie on mount
  useEffect(() => {
    setRepAttribution(repSlug)
  }, [repSlug])

  // Pre-fill from localStorage for returning users
  useEffect(() => {
    const saved = getSavedUserData()
    if (saved) {
      if (saved.serviceAddress && !defaultAddress) setValue("serviceAddress", saved.serviceAddress)
      if (saved.city) setValue("city", saved.city)
      if (saved.state) setValue("state", saved.state)
      if (saved.zip) setValue("zip", saved.zip)
      if (saved.fullName) setValue("fullName", saved.fullName)
      if (saved.email) setValue("email", saved.email)
      if (saved.phone) setValue("phone", saved.phone)
    }
  }, [setValue, defaultAddress])

  async function onSubmit(data: DoorModeValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await submitLead({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      serviceAddress: data.serviceAddress,
      city: data.city,
      state: data.state,
      zip: data.zip,
      source: "door-mode",
      repId: repSlug,
      selectedPlan,
      preferredInstallDate: installDate || undefined,
      preferredInstallTime: installTime,
    })

    setIsSubmitting(false)

    if (result.success) {
      saveUserData({
        serviceAddress: data.serviceAddress,
        city: data.city,
        state: data.state,
        zip: data.zip,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      })
      trackDoorModeSubmit(repSlug, selectedPlan)
      setSubmittedFirstName(data.fullName.split(" ")[0])
      setIsSubmitted(true)
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.")
    }
  }

  if (isSubmitted) {
    return (
      <ConfirmationScreen
        firstName={submittedFirstName}
        repName={repName}
        selectedPlan={selectedPlan}
        preferredDate={installDate || null}
        variant="door-mode"
      />
    )
  }

  const inputClasses = "w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-fiber-orange focus:border-transparent text-base"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Address Section */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Your Address</label>
        <input
          {...register("serviceAddress")}
          type="text"
          placeholder="Street Address"
          autoComplete="street-address"
          className={inputClasses}
        />
        {errors.serviceAddress && <p className="text-red-500 text-xs">{errors.serviceAddress.message}</p>}

        <div className="grid grid-cols-3 gap-3">
          <div>
            <input {...register("city")} type="text" placeholder="City" autoComplete="address-level2" className={inputClasses} />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <input {...register("state")} type="text" placeholder="State" autoComplete="address-level1" className={inputClasses} />
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
          </div>
          <div>
            <input {...register("zip")} type="text" placeholder="ZIP" autoComplete="postal-code" className={inputClasses} />
            {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>}
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Choose Your Plan</label>
        <PlanSelector value={selectedPlan} onChange={setSelectedPlan} compact />
        <p className="text-xs text-muted-foreground">Not sure? Our most popular plan is Gig 1.</p>
      </div>

      {/* Install Date */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Preferred Install Date</label>
        <DatePicker value={installDate} onChange={setInstallDate} minDaysFromNow={4} />
        <p className="text-xs text-muted-foreground">We&apos;ll confirm the exact date when we call you.</p>

        <div className="flex gap-2">
          {(["morning", "afternoon", "no-preference"] as const).map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setInstallTime(time)}
              className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                installTime === time
                  ? "border-fiber-orange bg-fiber-orange/10 text-fiber-orange"
                  : "border-border text-muted-foreground hover:border-fiber-orange/40"
              }`}
            >
              {time === "no-preference" ? "Any Time" : time.charAt(0).toUpperCase() + time.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Your Information</label>
        <input {...register("fullName")} type="text" placeholder="Full Name" autoComplete="name" className={inputClasses} />
        {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input {...register("phone")} type="tel" placeholder="Phone Number" autoComplete="tel" className={inputClasses} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <input {...register("email")} type="email" placeholder="Email Address" autoComplete="email" className={inputClasses} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Your info is only shared with your FiberFastUSA representative.
        </p>
      </div>

      {submitError && <p className="text-red-500 text-sm text-center">{submitError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full flex items-center justify-center gap-2 bg-fiber-orange hover:bg-fiber-orange/90 text-white min-h-[52px] text-base font-semibold glow-orange"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Get Connected"
        )}
      </Button>
    </form>
  )
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/components/forms/door-mode-form.tsx
git commit -m "feat: add DoorModeForm — all-in-one conversion form for doorstep QR scans"
```

---

### Task 14: Create Door Mode view layout

**Files:**
- Create: `src/components/rep/door-mode-view.tsx`

**Step 1: Build the streamlined Door Mode layout**

```typescript
"use client"

import { useEffect } from "react"
import { ShieldCheck, Check } from "lucide-react"

import DoorModeForm from "@/components/forms/door-mode-form"
import { setRepAttribution } from "@/lib/attribution"
import { storeRepName } from "@/components/providers/attribution-provider"
import { trackDoorModeView } from "@/lib/analytics"
import type { Rep } from "@/lib/reps"

type DoorModeViewProps = {
  rep: Rep
  defaultAddress?: string
  defaultPlan?: string
}

export default function DoorModeView({ rep, defaultAddress, defaultPlan }: DoorModeViewProps) {
  const firstName = rep.name.split(" ")[0]

  useEffect(() => {
    setRepAttribution(rep.slug)
    storeRepName(rep.slug, firstName)
    trackDoorModeView(rep.slug)
  }, [rep.slug, firstName])

  return (
    <main className="min-h-screen bg-background">
      {/* Minimal Header */}
      <div className="section-navy py-4">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex items-center gap-3">
            {/* Rep avatar */}
            {rep.photo_url ? (
              <img
                src={rep.photo_url}
                alt={rep.name}
                className="size-12 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="size-12 rounded-full bg-gradient-to-br from-fiber-blue/30 via-fiber-orange/20 to-fiber-blue/30 flex items-center justify-center border-2 border-white/20">
                <span className="text-lg font-bold text-white/60">{firstName[0]}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-bold text-lg truncate">{rep.name}</h1>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3 text-fiber-success flex-shrink-0" />
                <span className="text-xs text-fiber-success font-medium">Verified Representative</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-lg px-4 py-6">
        {/* Headline */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">
            Hi! I&apos;m {firstName}. Let&apos;s get you connected to fiber internet.
          </h2>
        </div>

        {/* The Form */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <DoorModeForm
            repSlug={rep.slug}
            repName={firstName}
            defaultAddress={defaultAddress}
            defaultPlan={defaultPlan}
          />
        </div>

        {/* Trust Badges */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {["No Contract", "Free Install", "No Data Caps", "Free Router"].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2"
            >
              <Check className="size-4 text-fiber-success flex-shrink-0" />
              <span className="text-xs font-medium text-foreground">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/components/rep/door-mode-view.tsx
git commit -m "feat: add DoorModeView — streamlined doorstep conversion layout"
```

---

### Task 15: Wire Door Mode into rep page

**Files:**
- Modify: `src/app/rep/[slug]/page.tsx`

**Step 1: Add Door Mode routing**

At the top of the file, add the import:

```typescript
import DoorModeView from "@/components/rep/door-mode-view"
```

Update the page component to check for `door` search param. Change the props interface:

```typescript
interface RepProfilePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ door?: string; plan?: string; address?: string }>
}
```

Add `searchParams` to `generateMetadata` and the page function signature. At the start of the page function body, add:

```typescript
  const { door, plan, address } = await searchParams

  if (door === "1") {
    return (
      <DoorModeView
        rep={rep}
        defaultAddress={address}
        defaultPlan={plan}
      />
    )
  }
```

This returns the Door Mode view instead of the standard rep page layout.

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/rep/[slug]/page.tsx
git commit -m "feat: route to Door Mode when ?door=1 on rep page"
```

---

### Task 16: Create qualification flow component

**Files:**
- Create: `src/components/forms/qualification-flow.tsx`

**Step 1: Build the multi-step qualification flow**

```typescript
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PlanSelector } from "@/components/ui/plan-selector"
import { DatePicker } from "@/components/ui/date-picker"
import { ConfirmationScreen } from "@/components/ui/confirmation-screen"
import { submitLead } from "@/actions/submit-lead"
import { useAttribution } from "@/components/providers/attribution-provider"
import { getSavedUserData, saveUserData } from "@/lib/address-memory"
import { trackLeadSubmitted } from "@/lib/analytics"
import { PLANS } from "@/lib/constants"

const addressSchema = z.object({
  serviceAddress: z.string().min(5, "Please enter your street address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code required").max(10),
})

const contactSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number required").regex(/^[\d\s\-()+ ]+$/, "Valid phone required"),
  email: z.string().email("Valid email required"),
})

type AddressValues = z.infer<typeof addressSchema>
type ContactValues = z.infer<typeof contactSchema>

type QualificationFlowProps = {
  defaultAddress?: string
  defaultPlan?: string
  repId?: string
}

type Step = 1 | 2 | 3 | 4

export default function QualificationFlow({ defaultAddress, defaultPlan, repId }: QualificationFlowProps) {
  const { repId: attributionRepId, repName } = useAttribution()
  const resolvedRepId = repId ?? attributionRepId

  const [step, setStep] = useState<Step>(1)
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan ?? "gig-1")
  const [installDate, setInstallDate] = useState("")
  const [installTime, setInstallTime] = useState<"morning" | "afternoon" | "no-preference">("no-preference")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [addressData, setAddressData] = useState<AddressValues | null>(null)
  const [submittedFirstName, setSubmittedFirstName] = useState("")

  const addressForm = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { serviceAddress: defaultAddress ?? "" },
  })

  const contactForm = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  })

  // Pre-fill from saved data
  useEffect(() => {
    const saved = getSavedUserData()
    if (saved) {
      if (saved.serviceAddress && !defaultAddress) addressForm.setValue("serviceAddress", saved.serviceAddress)
      if (saved.city) addressForm.setValue("city", saved.city)
      if (saved.state) addressForm.setValue("state", saved.state)
      if (saved.zip) addressForm.setValue("zip", saved.zip)
      if (saved.fullName) contactForm.setValue("fullName", saved.fullName)
      if (saved.email) contactForm.setValue("email", saved.email)
      if (saved.phone) contactForm.setValue("phone", saved.phone)
    }
  }, [addressForm, contactForm, defaultAddress])

  function onAddressSubmit(data: AddressValues) {
    setAddressData(data)
    setStep(2)
  }

  function onPlanNext() {
    setStep(3)
  }

  function onDateNext() {
    setStep(4)
  }

  async function onContactSubmit(data: ContactValues) {
    if (!addressData) return
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await submitLead({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      serviceAddress: addressData.serviceAddress,
      city: addressData.city,
      state: addressData.state,
      zip: addressData.zip,
      source: "check-availability",
      repId: resolvedRepId ?? undefined,
      selectedPlan,
      preferredInstallDate: installDate || undefined,
      preferredInstallTime: installTime,
    })

    setIsSubmitting(false)

    if (result.success) {
      saveUserData({
        serviceAddress: addressData.serviceAddress,
        city: addressData.city,
        state: addressData.state,
        zip: addressData.zip,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      })
      trackLeadSubmitted("check-availability", selectedPlan)
      setSubmittedFirstName(data.fullName.split(" ")[0])
      setIsComplete(true)
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.")
    }
  }

  if (isComplete) {
    return (
      <ConfirmationScreen
        firstName={submittedFirstName}
        repName={repName}
        selectedPlan={selectedPlan}
        preferredDate={installDate || null}
        variant="check-availability"
      />
    )
  }

  const inputClasses = "w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-fiber-orange focus:border-transparent text-base"

  // Progress indicator
  const steps = ["Address", "Plan", "Date", "Info"]

  return (
    <div>
      {/* Step Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i + 1 < step ? "bg-fiber-success text-white" :
              i + 1 === step ? "bg-fiber-orange text-white" :
              "bg-muted text-muted-foreground"
            }`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${
              i + 1 === step ? "text-foreground" : "text-muted-foreground"
            }`}>{label}</span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${i + 1 < step ? "bg-fiber-success" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
          <h3 className="text-lg font-bold text-foreground mb-2">Where do you need fiber?</h3>

          <input
            {...addressForm.register("serviceAddress")}
            type="text"
            placeholder="Street Address"
            autoComplete="street-address"
            className={inputClasses}
          />
          {addressForm.formState.errors.serviceAddress && (
            <p className="text-red-500 text-xs">{addressForm.formState.errors.serviceAddress.message}</p>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <input {...addressForm.register("city")} type="text" placeholder="City" autoComplete="address-level2" className={inputClasses} />
              {addressForm.formState.errors.city && <p className="text-red-500 text-xs mt-1">{addressForm.formState.errors.city.message}</p>}
            </div>
            <div>
              <input {...addressForm.register("state")} type="text" placeholder="State" autoComplete="address-level1" className={inputClasses} />
              {addressForm.formState.errors.state && <p className="text-red-500 text-xs mt-1">{addressForm.formState.errors.state.message}</p>}
            </div>
            <div>
              <input {...addressForm.register("zip")} type="text" placeholder="ZIP" autoComplete="postal-code" className={inputClasses} />
              {addressForm.formState.errors.zip && <p className="text-red-500 text-xs mt-1">{addressForm.formState.errors.zip.message}</p>}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full bg-fiber-orange hover:bg-fiber-orange/90 text-white min-h-[52px] font-semibold glow-orange">
            Continue <ArrowRight className="size-4 ml-2" />
          </Button>
        </form>
      )}

      {/* Step 2: Plan Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground mb-2">Choose your plan</h3>
          <PlanSelector value={selectedPlan} onChange={setSelectedPlan} plans={PLANS} />
          <p className="text-xs text-muted-foreground text-center">Not sure? Our most popular plan is Gig 1.</p>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 min-h-[48px]">
              <ArrowLeft className="size-4 mr-2" /> Back
            </Button>
            <Button type="button" onClick={onPlanNext} size="lg" className="flex-1 bg-fiber-orange hover:bg-fiber-orange/90 text-white min-h-[48px] font-semibold glow-orange">
              Continue <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Install Date */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground mb-2">When would you like installation?</h3>
          <DatePicker value={installDate} onChange={setInstallDate} minDaysFromNow={4} />
          <p className="text-xs text-muted-foreground">We&apos;ll confirm the exact date when we call you.</p>

          <div className="flex gap-2">
            {(["morning", "afternoon", "no-preference"] as const).map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setInstallTime(time)}
                className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  installTime === time
                    ? "border-fiber-orange bg-fiber-orange/10 text-fiber-orange"
                    : "border-border text-muted-foreground hover:border-fiber-orange/40"
                }`}
              >
                {time === "no-preference" ? "Any Time" : time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 min-h-[48px]">
              <ArrowLeft className="size-4 mr-2" /> Back
            </Button>
            <Button type="button" onClick={onDateNext} size="lg" className="flex-1 bg-fiber-orange hover:bg-fiber-orange/90 text-white min-h-[48px] font-semibold glow-orange">
              Continue <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Contact Info */}
      {step === 4 && (
        <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
          <h3 className="text-lg font-bold text-foreground mb-2">Your information</h3>

          <input {...contactForm.register("fullName")} type="text" placeholder="Full Name" autoComplete="name" className={inputClasses} />
          {contactForm.formState.errors.fullName && <p className="text-red-500 text-xs">{contactForm.formState.errors.fullName.message}</p>}

          <input {...contactForm.register("phone")} type="tel" placeholder="Phone Number" autoComplete="tel" className={inputClasses} />
          {contactForm.formState.errors.phone && <p className="text-red-500 text-xs">{contactForm.formState.errors.phone.message}</p>}

          <input {...contactForm.register("email")} type="email" placeholder="Email Address" autoComplete="email" className={inputClasses} />
          {contactForm.formState.errors.email && <p className="text-red-500 text-xs">{contactForm.formState.errors.email.message}</p>}

          <p className="text-xs text-muted-foreground text-center">
            Your info is only shared with your FiberFastUSA representative. We never sell your data.
          </p>

          {submitError && <p className="text-red-500 text-sm text-center">{submitError}</p>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 min-h-[48px]">
              <ArrowLeft className="size-4 mr-2" /> Back
            </Button>
            <Button type="submit" disabled={isSubmitting} size="lg" className="flex-1 bg-fiber-orange hover:bg-fiber-orange/90 text-white min-h-[48px] font-semibold glow-orange">
              {isSubmitting ? <><Loader2 className="size-5 animate-spin" /> Submitting...</> : "Get Connected"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/components/forms/qualification-flow.tsx
git commit -m "feat: add multi-step QualificationFlow (address > plan > date > contact > confirmation)"
```

---

### Task 17: Rewrite check-availability page with qualification flow

**Files:**
- Modify: `src/app/check-availability/page.tsx` (full rewrite)

**Step 1: Replace the page with the qualification flow**

```typescript
import type { Metadata } from "next"
import { Shield, Award, Wifi } from "lucide-react"
import QualificationFlow from "@/components/forms/qualification-flow"

export const metadata: Metadata = {
  title: "Check Availability | FiberFastUSA",
  description:
    "Check if FiberFastUSA fiber internet is available at your address. Enter your location and get started today.",
}

type CheckAvailabilityPageProps = {
  searchParams: Promise<{ address?: string; plan?: string; rep?: string }>
}

export default async function CheckAvailabilityPage({ searchParams }: CheckAvailabilityPageProps) {
  const { address, plan, rep } = await searchParams

  return (
    <main>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Get Started with Fiber Internet
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              Enter your address, choose a plan, and pick your install date. We&apos;ll take care of the rest.
            </p>
          </div>

          <div className="mx-auto max-w-2xl mb-12">
            <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
              <QualificationFlow
                defaultAddress={address}
                defaultPlan={plan}
                repId={rep}
              />
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mx-auto max-w-2xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { icon: Wifi, label: "Nationwide Fiber Coverage" },
                { icon: Shield, label: "No Contract Required" },
                { icon: Award, label: "Free Installation" },
              ].map((signal) => {
                const Icon = signal.icon
                return (
                  <div key={signal.label} className="flex flex-col items-center text-center">
                    <Icon className="size-8 text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">{signal.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/check-availability/page.tsx
git commit -m "feat: rewrite check-availability with multi-step QualificationFlow"
```

---

### Task 18: Update CompactLeadForm to show confirmation screen

**Files:**
- Modify: `src/components/forms/compact-lead-form.tsx`

**Step 1: Replace simple success state with ConfirmationScreen**

Import the confirmation component:
```typescript
import { ConfirmationScreen } from "@/components/ui/confirmation-screen"
```

Add state to track `submittedFirstName`. Replace the success return block (lines 69-82) with:

```tsx
  if (isSubmitted) {
    return (
      <ConfirmationScreen
        firstName={submittedFirstName}
        repName={repName}
        variant="default"
      />
    )
  }
```

Add `submittedFirstName` state and set it in `onSubmit` before `setIsSubmitted(true)`:
```typescript
const [submittedFirstName, setSubmittedFirstName] = useState("")

// In onSubmit, before setIsSubmitted(true):
setSubmittedFirstName(data.fullName.split(" ")[0])
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/components/forms/compact-lead-form.tsx
git commit -m "feat: CompactLeadForm now shows ConfirmationScreen with next steps"
```

---

### Task 19: Update hero section messaging and mobile speed viz

**Files:**
- Modify: `src/components/sections/hero.tsx`

**Step 1: Update headline and messaging**

Change the headline (line 17) from:
```tsx
              Blazing Fast{" "}
              <span className="text-gradient-blue">Fiber Internet</span> for Your Home
```
to:
```tsx
              Fiber Internet That{" "}
              <span className="text-gradient-blue">Actually Delivers</span>
```

Change the subtitle (lines 21-23) from:
```tsx
              Tired of slow, unreliable internet? Switch to fiber and experience speeds up to 7 Gbps with no data caps, no contracts, and no surprises.
```
to:
```tsx
              No contracts. No data caps. No hidden fees. Speeds up to 7 Gbps starting at $34.99/mo.
```

**Step 2: Show speed viz on mobile**

Change line 56 from:
```tsx
          <div className="hidden md:flex items-center justify-center">
```
to:
```tsx
          <div className="flex items-center justify-center mt-8 md:mt-0">
```

This makes the speed visualization visible on all screen sizes.

**Step 3: Verify build**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/components/sections/hero.tsx
git commit -m "feat: update hero messaging, show speed viz on mobile"
```

---

### Task 20: Update homepage metadata

**Files:**
- Modify: `src/app/page.tsx:12-21`

**Step 1: Update metadata to match new messaging**

```typescript
export const metadata: Metadata = {
  title: "FiberFastUSA | Fiber Internet That Actually Delivers",
  description:
    "No contracts. No data caps. No hidden fees. Fiber internet speeds up to 7 Gbps starting at $34.99/mo. Check availability at your address today.",
  openGraph: {
    title: "FiberFastUSA | Fiber Internet That Actually Delivers",
    description:
      "Gigabit fiber internet starting at $34.99/mo. No contracts, no data caps. Check availability now.",
  },
}
```

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update homepage metadata to match new messaging"
```

---

### Task 21: Add rep attribution badge to header

**Files:**
- Modify: `src/components/layout/header.tsx`

**Step 1: Add attribution badge**

Import attribution hook:
```typescript
import { useAttribution } from "@/components/providers/attribution-provider"
```

Inside the `Header` component, add:
```typescript
const { repId, repName } = useAttribution()
```

After the logo `<Link>` and before the desktop nav, add a conditional badge:

```tsx
            {/* Rep attribution badge */}
            {repId && repName && (
              <Link
                href={`/rep/${repId}`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fiber-orange/10 text-fiber-orange text-xs font-medium hover:bg-fiber-orange/20 transition-colors"
              >
                Working with {repName}
              </Link>
            )}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "feat: show 'Working with {RepName}' badge in header when attributed"
```

---

### Task 22: Full build verification

**Step 1: Run full build**

Run: `cd /c/Users/claws/OneDrive/Desktop/fiberwebsite && npm run build`

Expected: Build succeeds with no errors.

**Step 2: Fix any build errors**

If any errors, fix them and re-run build.

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors from Phase 1-2 implementation"
```

---

## Phase 3: Visual Upgrade + Content (Future)

Phase 3 is documented in the blueprint but deferred to a separate plan after Phase 1-2 are verified. Tasks include:

- Premium card designs on pricing page
- Enhanced why-fiber page (fiber vs cable/DSL, myths)
- Enhanced verify-rep page
- City landing pages (seed cities)
- Testimonial geographic diversity
- SEO meta audit
- Plan recommendation widget
- Lighthouse performance optimization

---

## SQL Migration (Run Manually in Supabase)

```sql
ALTER TABLE public_leads ADD COLUMN IF NOT EXISTS selected_plan TEXT;
ALTER TABLE public_leads ADD COLUMN IF NOT EXISTS preferred_install_date DATE;
ALTER TABLE public_leads ADD COLUMN IF NOT EXISTS preferred_install_time TEXT
  CHECK (preferred_install_time IN ('morning', 'afternoon', 'no-preference'));
```

---

## Verification Checklist

After completing all tasks:

- [ ] `npm run build` succeeds
- [ ] `/rep/sarah-johnson` renders standard rep page
- [ ] `/rep/sarah-johnson?door=1` renders Door Mode
- [ ] Door Mode form submits with plan + date + rep_id
- [ ] `/check-availability` shows 4-step qualification flow
- [ ] Qualification flow submits lead to Supabase
- [ ] Confirmation screen shows "What Happens Next" steps
- [ ] QR codes generate with `?door=1` in URL
- [ ] Attribution cookie persists across pages
- [ ] CompactLeadForm sends real city/state (not empty strings)
- [ ] No "Fastest in Colorado" text anywhere
- [ ] Hero speed viz visible on mobile
- [ ] Header shows "Working with {Rep}" badge when attributed
- [ ] All forms mobile-friendly at 375px viewport
