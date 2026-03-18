import { NextRequest, NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { db } from "@/lib/db";
import { getWebAuthnConfig, storeChallenge } from "@/lib/webauthn-server";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`webauthn-auth-opts:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const email = body.email as string | undefined;

  let allowCredentials: { id: Uint8Array; type: "public-key"; transports?: AuthenticatorTransport[] }[] | undefined;
  let userId: string | undefined;

  if (email) {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (user) {
      userId = user.id;
      const creds = await db.webAuthnCredential.findMany({
        where: { userId: user.id },
        select: { credentialId: true, transports: true },
      });
      allowCredentials = creds.map((c) => ({
        id: Buffer.from(c.credentialId, "base64url"),
        type: "public-key" as const,
        transports: c.transports
          ? (c.transports.split(",") as AuthenticatorTransport[])
          : undefined,
      }));
    }
  }

  const config = getWebAuthnConfig();

  const options = await generateAuthenticationOptions({
    rpID: config.rpID,
    userVerification: "preferred",
    allowCredentials,
    timeout: 60000,
  });

  await storeChallenge(options.challenge, "authentication", userId);

  return NextResponse.json({ options });
}
