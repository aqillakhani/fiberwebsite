import { describe, expect, it } from "vitest";

import type { LeadRecord } from "@/lib/leads/lead-record";
import { buildAlertText } from "./lead-alert-text";

const WEB_LEAD = {
  lead_number: 1046,
  lead_channel: "web",
  rep_slug: null,
  full_name: "Test Homeowner",
  phone: "5551234567",
  email: "homeowner@example.com",
  preferred_speed: "1000",
  service_address: "100 Test St",
  city: "Testville",
  state: "TX",
  zip: "75001",
  isp_declared: "kinetic",
  current_provider: null,
  serviceability: null,
  consent_text_version: "v1",
  consent_at: "2026-11-06T00:00:00Z",
} as LeadRecord;

describe("buildAlertText", () => {
  it("shows name, phone, email, address and the readable speed on labeled lines", () => {
    const lines = buildAlertText(WEB_LEAD).split("\n");

    expect(lines).toContain("Name: Test Homeowner");
    expect(lines).toContain("Phone: (555) 123-4567");
    expect(lines).toContain("Email: homeowner@example.com");
    expect(lines).toContain("Address: 100 Test St, Testville TX 75001");
    expect(lines).toContain("Speed: 1 Gig");
  });

  it("says when a lead has no speed or email, as Facebook form leads have no speed question", () => {
    const lines = buildAlertText({ ...WEB_LEAD, lead_channel: "meta_form", preferred_speed: null, email: null }).split("\n");

    expect(lines).toContain("Speed: Not provided");
    expect(lines).toContain("Email: Not provided");
  });
});
