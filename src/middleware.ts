import { NextResponse, type NextRequest } from "next/server";

import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_SECONDS,
  FBC_COOKIE,
  REP_COOKIE,
  REP_MAX_AGE_SECONDS,
  REP_MODE_COOKIE,
  REP_MODE_MAX_AGE_SECONDS,
  TRACKED_QUERY_KEYS,
  type StoredAttribution,
} from "@/lib/attribution-cookies";

const REP_SHORT_LINK = /^\/r\/([a-z0-9-]+)\/?$/i;
const SLUG_PATTERN = /^[a-z0-9-]{1,64}$/i;

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp|txt|xml)$).*)"],
};

export function middleware(request: NextRequest): NextResponse {
  const shortLink = request.nextUrl.pathname.match(REP_SHORT_LINK);
  if (shortLink) return redirectShortLink(request, shortLink[1]);

  const response = NextResponse.next();
  applyRepCookie(request, response);
  applyAttributionCookie(request, response);
  return response;
}

/** /r/:slug is what the QR badge encodes: remember the rep, enter rep mode, land on /door/:slug. */
function redirectShortLink(request: NextRequest, slug: string): NextResponse {
  const target = request.nextUrl.clone();
  target.pathname = `/door/${slug.toLowerCase()}`;
  const response = NextResponse.redirect(target, 307);
  setRepCookies(response, slug.toLowerCase(), true);
  return response;
}

function applyRepCookie(request: NextRequest, response: NextResponse): void {
  const rep = request.nextUrl.searchParams.get("rep");
  if (rep && SLUG_PATTERN.test(rep)) setRepCookies(response, rep.toLowerCase(), false);
}

function setRepCookies(response: NextResponse, slug: string, repMode: boolean): void {
  // Readable by the client so RepBanner / header can show the rep name without a round trip.
  response.cookies.set(REP_COOKIE, slug, {
    path: "/",
    maxAge: REP_MAX_AGE_SECONDS,
    sameSite: "lax",
  });
  if (repMode) {
    response.cookies.set(REP_MODE_COOKIE, "1", { path: "/", maxAge: REP_MODE_MAX_AGE_SECONDS, sameSite: "lax" });
  }
}

function applyAttributionCookie(request: NextRequest, response: NextResponse): void {
  const params = request.nextUrl.searchParams;
  const incoming = Object.fromEntries(
    TRACKED_QUERY_KEYS.filter((key) => params.get(key)).map((key) => [key, params.get(key)!.slice(0, 200)])
  ) as Partial<StoredAttribution>;
  const existing = readExistingAttribution(request);
  const hasNewSignal = Object.keys(incoming).length > 0;
  if (existing && !hasNewSignal) return;

  const now = new Date().toISOString();
  const merged: StoredAttribution = {
    ...existing,
    ...incoming, // last-touch wins for utm/fbclid/gclid
    landing_path: existing?.landing_path ?? request.nextUrl.pathname,
    referrer: existing?.referrer ?? request.headers.get("referer")?.slice(0, 500) ?? "",
    first_seen: existing?.first_seen ?? now,
    last_seen: now,
  };
  response.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(merged), {
    path: "/",
    maxAge: ATTRIBUTION_MAX_AGE_SECONDS,
    sameSite: "lax",
    httpOnly: true,
  });
  if (incoming.fbclid && !request.cookies.get(FBC_COOKIE)) {
    // Meta Conversions API expects fbc in the form fb.1.<ms since epoch>.<fbclid>
    response.cookies.set(FBC_COOKIE, `fb.1.${Date.now()}.${incoming.fbclid}`, {
      path: "/",
      maxAge: ATTRIBUTION_MAX_AGE_SECONDS,
      sameSite: "lax",
    });
  }
}

function readExistingAttribution(request: NextRequest): StoredAttribution | null {
  const raw = request.cookies.get(ATTRIBUTION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAttribution;
  } catch {
    return null;
  }
}
