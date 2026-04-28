import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NominatimAddress = {
  house_number?: string;
  road?: string;
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  suburb?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country_code?: string;
};

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
};

export type AddressSuggestion = {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: string;
  lon: string;
};

const STATE_ABBR: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA",
  kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS",
  missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
  "north carolina": "NC", "north dakota": "ND", ohio: "OH", oklahoma: "OK",
  oregon: "OR", pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT",
  virginia: "VA", washington: "WA", "west virginia": "WV", wisconsin: "WI",
  wyoming: "WY", "district of columbia": "DC",
};

function toStateAbbr(state: string | undefined): string {
  if (!state) return "";
  const lower = state.trim().toLowerCase();
  return STATE_ABBR[lower] ?? state;
}

function buildSuggestion(result: NominatimResult): AddressSuggestion | null {
  const a = result.address;
  if (!a) return null;
  if (a.country_code && a.country_code.toLowerCase() !== "us") return null;

  const street = [a.house_number, a.road].filter(Boolean).join(" ").trim();
  const city = a.city ?? a.town ?? a.village ?? a.hamlet ?? a.suburb ?? a.county ?? "";
  const state = toStateAbbr(a.state);
  const zip = a.postcode ?? "";

  if (!street || !city || !state) return null;

  const label = `${street}, ${city}, ${state}${zip ? ` ${zip}` : ""}`;

  return {
    id: String(result.place_id),
    label,
    street,
    city,
    state,
    zip,
    lat: result.lat,
    lon: result.lon,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 3) {
    return NextResponse.json<{ suggestions: AddressSuggestion[] }>({ suggestions: [] });
  }

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    countrycodes: "us",
    limit: "6",
  });

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        "User-Agent": "FiberFastUSA/1.0 (https://fiberfastusa.com)",
        "Accept-Language": "en-US,en",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json({ suggestions: [], error: "Lookup unavailable" }, { status: 200 });
    }

    const raw = (await response.json()) as NominatimResult[];
    const suggestions = raw
      .map(buildSuggestion)
      .filter((s): s is AddressSuggestion => s !== null);

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [], error: "Lookup unavailable" }, { status: 200 });
  }
}
