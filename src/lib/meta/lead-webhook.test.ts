import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

import { extractLeadgenChanges, mapMetaLead, normalizePhone, verifyMetaSignature } from "./lead-webhook";

const SECRET = "test-app-secret";
const sign = (body: string) => `sha256=${createHmac("sha256", SECRET).update(body).digest("hex")}`;

describe("verifyMetaSignature", () => {
  it("accepts a body signed with the app secret", () => {
    const body = JSON.stringify({ object: "page", entry: [] });
    expect(verifyMetaSignature(body, sign(body), SECRET)).toBe(true);
  });

  it("rejects a tampered body, a missing header, and a missing secret", () => {
    const body = JSON.stringify({ object: "page", entry: [] });
    expect(verifyMetaSignature(body + " ", sign(body), SECRET)).toBe(false);
    expect(verifyMetaSignature(body, null, SECRET)).toBe(false);
    expect(verifyMetaSignature(body, sign(body), undefined)).toBe(false);
  });
});

describe("extractLeadgenChanges", () => {
  it("returns every leadgen change and ignores other fields", () => {
    const payload = {
      object: "page",
      entry: [
        { id: "641043375758868", time: 1, changes: [
          { field: "leadgen", value: { leadgen_id: "111", page_id: "641043375758868", form_id: "22", ad_id: "33", created_time: 1700000000 } },
          { field: "feed", value: {} },
        ] },
        { id: "641043375758868", time: 2, changes: [{ field: "leadgen", value: { leadgen_id: 222 } }] },
      ],
    };
    expect(extractLeadgenChanges(payload)).toEqual([
      { leadgenId: "111", pageId: "641043375758868", formId: "22", adId: "33", createdTime: 1700000000 },
      { leadgenId: "222", pageId: null, formId: null, adId: null, createdTime: null },
    ]);
  });

  it("returns nothing for non-page objects or malformed bodies", () => {
    expect(extractLeadgenChanges({ object: "user", entry: [] })).toEqual([]);
    expect(extractLeadgenChanges(null)).toEqual([]);
    expect(extractLeadgenChanges("nope")).toEqual([]);
  });
});

describe("mapMetaLead", () => {
  it("maps Meta standard fields plus custom questions onto the lead shape", () => {
    const mapped = mapMetaLead({
      id: "111",
      form_id: "22",
      ad_id: "33", ad_name: "curiosity-static",
      adset_id: "44", adset_name: "live-fiber-zips",
      campaign_id: "55", campaign_name: "FF | Leads | Fiber-v1 | form",
      field_data: [
        { name: "full_name", values: ["Maria De La Cruz"] },
        { name: "phone_number", values: ["+14695551234"] },
        { name: "email", values: ["maria@example.com"] },
        { name: "street_address", values: ["503 Navajo Ave"] },
        { name: "city", values: ["Hiawatha"] },
        { name: "state", values: ["Kansas"] },
        { name: "zip_code", values: ["66434-1234"] },
        { name: "current_provider", values: ["Spectrum"] },
        { name: "do_you_pay_the_internet_bill_at_this_address?", values: ["Yes"] },
      ],
    });
    expect(mapped).toMatchObject({
      metaLeadId: "111",
      firstName: "Maria", lastName: "De La Cruz", fullName: "Maria De La Cruz",
      phone: "4695551234", email: "maria@example.com",
      serviceAddress: "503 Navajo Ave", city: "Hiawatha", state: "KS", zip: "66434",
      currentProvider: "Spectrum",
      formAnswers: { "do_you_pay_the_internet_bill_at_this_address?": "Yes", current_provider: "Spectrum" },
      source: "meta-form:22",
      utm: { campaign: "FF | Leads | Fiber-v1 | form", content: "curiosity-static", term: "live-fiber-zips" },
      ids: { form: "22", ad: "33", adset: "44", campaign: "55" },
    });
  });

  it("survives a lead with almost nothing filled in", () => {
    const mapped = mapMetaLead({ id: "999", field_data: [{ name: "phone_number", values: ["(469) 555-0100"] }] });
    expect(mapped.fullName).toBe("Facebook Lead");
    expect(mapped.phone).toBe("4695550100");
    expect(mapped.serviceAddress).toContain("no street given");
    expect(mapped.state).toBeNull();
    expect(mapped.source).toBe("meta-form:unknown");
  });
});

describe("normalizePhone", () => {
  it("strips a leading country code and formatting", () => {
    expect(normalizePhone("+1 (469) 555-0100")).toBe("4695550100");
    expect(normalizePhone("469.555.0100")).toBe("4695550100");
  });
});
