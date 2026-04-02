"use client"

import { CheckCircle2, XCircle } from "lucide-react"

const COMPARISONS = [
  { metric: "Download Speed", fiber: "Up to 7 Gbps", cable: "Up to 700 Mbps" },
  { metric: "Upload Speed", fiber: "Symmetric — same as download", cable: "10–50 Mbps" },
  { metric: "Latency", fiber: "Under 5 ms", cable: "10–30 ms" },
  { metric: "Data Caps", fiber: "Unlimited — no throttling", cable: "Often 1–1.5 TB" },
  { metric: "Starting Price", fiber: "From $34.99/mo", cable: "From $49.99/mo" },
  { metric: "Contract", fiber: "None — cancel anytime", cable: "1–2 year commitment" },
]

export default function RepComparisonSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Why Switch to Fiber?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how fiber internet compares to traditional cable.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 gap-0 border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider" />
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider text-center">
              Fiber
            </div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
              Cable
            </div>
          </div>

          {/* Rows */}
          {COMPARISONS.map((row, i) => (
            <div
              key={row.metric}
              className={`grid grid-cols-3 gap-0 px-4 py-4 items-center ${
                i < COMPARISONS.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="text-sm font-semibold text-gray-900 pr-2">
                {row.metric}
              </div>
              <div className="flex items-start gap-1.5 justify-center text-center">
                <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-gray-900">{row.fiber}</span>
              </div>
              <div className="flex items-start gap-1.5 justify-center text-center">
                <XCircle className="size-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500">{row.cable}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Fiber delivers faster speeds, lower latency, and better value — with no contracts.
        </p>
      </div>
    </section>
  )
}
