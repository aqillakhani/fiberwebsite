import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { cleanStreet, geocodeAddress } from "./geocode";

const OHIO_LEAD = { street: "4603 Refugee Road", city: "Reynoldsburg", state: "OH", zip: "43232" };
const POINT = { lat: "39.9548", lon: "-82.8121", address: { postcode: "43232" } };

function mockNominatim(...responses: unknown[][]): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(responses.shift() ?? []), { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const urlOf = (mock: ReturnType<typeof vi.fn>, call: number): URL => new URL(String(mock.mock.calls[call]?.[0]));

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("cleanStreet", () => {
  test.each([
    ["150 Autumn Ln Apt 7-D", "150 Autumn Ln"],
    ["337 Foster St Fl 2", "337 Foster St"],
    ["8811 PARK ST SPC 127", "8811 PARK ST"],
    ["3611 University Drive Apt 22-E", "3611 University Drive"],
    ["4346 Hornyak Drive, Monroe, NC, USA", "4346 Hornyak Drive"],
    ["4603 Refugee Road Apt 1B Columbus Ohio 43232", "4603 Refugee Road"],
    ["501 Vista Oaks Drive Fairmont WV 26554", "501 Vista Oaks Drive"],
    ["546 10th St", "546 10th St"],
  ])("reduces %j to %j", (raw, expected) => {
    expect(cleanStreet(raw)).toBe(expected);
  });

  test("leaves a street that is already clean untouched", () => {
    expect(cleanStreet("1485 Burnham lane")).toBe("1485 Burnham lane");
  });
});

describe("geocodeAddress", () => {
  test("returns coordinates from a structured match", async () => {
    mockNominatim([POINT]);

    await expect(geocodeAddress(OHIO_LEAD)).resolves.toEqual({ lat: 39.9548, lon: -82.8121 });
  });

  test("sends street, city, state and zip as structured fields first", async () => {
    const fetchMock = mockNominatim([POINT]);

    await geocodeAddress(OHIO_LEAD);

    const params = urlOf(fetchMock, 0).searchParams;
    expect(params.get("street")).toBe("4603 Refugee Road");
    expect(params.get("city")).toBe("Reynoldsburg");
    expect(params.get("state")).toBe("OH");
    expect(params.get("postalcode")).toBe("43232");
    expect(params.get("countrycodes")).toBe("us");
  });

  test("identifies itself, as Nominatim's usage policy requires", async () => {
    const fetchMock = mockNominatim([POINT]);

    await geocodeAddress(OHIO_LEAD);

    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Record<string, string>;
    expect(headers["User-Agent"]).toContain("FiberFastUSA");
  });

  test("retries on street plus ZIP, which beats the postal city Meta reports", async () => {
    const fetchMock = mockNominatim([], [POINT]);

    await expect(geocodeAddress(OHIO_LEAD)).resolves.toEqual({ lat: 39.9548, lon: -82.8121 });
    expect(urlOf(fetchMock, 1).searchParams.get("q")).toBe("4603 Refugee Road, 43232");
  });

  test("falls back to the full one-line address last", async () => {
    const fetchMock = mockNominatim([], [], [POINT]);

    await expect(geocodeAddress(OHIO_LEAD)).resolves.toEqual({ lat: 39.9548, lon: -82.8121 });
    expect(urlOf(fetchMock, 2).searchParams.get("q")).toBe("4603 Refugee Road, Reynoldsburg, OH 43232");
  });

  test("strips the unit before querying", async () => {
    const fetchMock = mockNominatim([POINT]);

    await geocodeAddress({ ...OHIO_LEAD, street: "4603 Refugee Road Apt 1B" });

    expect(urlOf(fetchMock, 0).searchParams.get("street")).toBe("4603 Refugee Road");
  });

  test("rejects a match in a different ZIP rather than mislocating the lead", async () => {
    mockNominatim([{ lat: "40.0", lon: "-83.0", address: { postcode: "43068" } }], [], []);

    await expect(geocodeAddress(OHIO_LEAD)).resolves.toBeNull();
  });

  test("accepts a match when Nominatim returns no postcode to compare", async () => {
    mockNominatim([{ lat: "39.9548", lon: "-82.8121", address: {} }]);

    await expect(geocodeAddress(OHIO_LEAD)).resolves.toEqual({ lat: 39.9548, lon: -82.8121 });
  });

  test("refuses a street with no house number, which would geocode to the town centroid", async () => {
    const fetchMock = mockNominatim([POINT]);

    await expect(geocodeAddress({ ...OHIO_LEAD, street: "(no street given — ask on the call)" })).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("returns null when Nominatim errors, so the lead is still saved", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 503 })));

    await expect(geocodeAddress(OHIO_LEAD)).resolves.toBeNull();
  });

  test("returns null when the network throws", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("ECONNRESET"); }));

    await expect(geocodeAddress(OHIO_LEAD)).resolves.toBeNull();
  });
});
