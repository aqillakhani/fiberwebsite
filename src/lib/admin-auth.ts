/**
 * HTTP Basic auth for the owner-only /admin pages. Credentials live in `ADMIN_BASIC_AUTH` ("user:password").
 * Edge-safe (no Node crypto): a constant-time compare on the decoded header keeps timing leaks out.
 */

export const ADMIN_PATH_PREFIX = "/admin";
const REALM = "FiberFast USA admin";

export function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_PATH_PREFIX || pathname.startsWith(`${ADMIN_PATH_PREFIX}/`);
}

export function isAuthorizedAdmin(authorizationHeader: string | null): boolean {
  const expected = process.env.ADMIN_BASIC_AUTH;
  if (!expected || !authorizationHeader?.startsWith("Basic ")) return false;
  const presented = decodeBase64(authorizationHeader.slice("Basic ".length));
  return presented !== null && constantTimeEqual(presented, expected);
}

export function unauthorizedResponse(): Response {
  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"` },
  });
}

function decodeBase64(value: string): string | null {
  try {
    return atob(value);
  } catch {
    return null;
  }
}

function constantTimeEqual(left: string, right: string): boolean {
  const width = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;
  for (let i = 0; i < width; i += 1) {
    mismatch |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}
