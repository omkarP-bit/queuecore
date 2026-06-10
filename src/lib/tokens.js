import { CompactSign, compactVerify } from "jose";

const secretString =
  process.env.NEXTAUTH_SECRET ||
  "fallback-secret-for-signing-tokens-that-is-at-least-32-chars";
const SECRET = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(secretString),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"]
);

export async function signTokenData(data) {
  const payload = new Uint8Array(Buffer.from(JSON.stringify(data), "utf8"));
  const jwt = await new CompactSign(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(SECRET);
  return jwt;
}

export async function verifyTokenData(token) {
  try {
    const { payload } = await compactVerify(token, SECRET);
    const decoded = JSON.parse(new TextDecoder().decode(payload));
    return decoded;
  } catch (e) {
    return null;
  }
}
