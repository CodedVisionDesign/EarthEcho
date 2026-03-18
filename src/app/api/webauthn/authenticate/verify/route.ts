import { NextRequest, NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import {
  getWebAuthnConfig,
  getCredentialByCredentialId,
  updateCredentialCounter,
  generateLoginToken,
  consumeChallenge,
} from "@/lib/webauthn-server";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`webauthn-auth-verify:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const { credential } = body;

  if (!credential) {
    return NextResponse.json({ error: "Missing credential" }, { status: 400 });
  }

  // Look up credential by ID
  const credentialIdBase64 = credential.id;
  const stored = await getCredentialByCredentialId(credentialIdBase64);

  if (!stored) {
    return NextResponse.json({ error: "Unknown credential" }, { status: 400 });
  }

  if (stored.user.banned) {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }

  const config = getWebAuthnConfig();

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: async (challenge: string) => {
        const record = await consumeChallenge(challenge, "authentication");
        return !!record;
      },
      expectedOrigin: config.origin,
      expectedRPID: config.rpID,
      authenticator: {
        credentialPublicKey: stored.publicKey,
        credentialID: Buffer.from(stored.credentialId, "base64url"),
        counter: stored.counter,
        transports: stored.transports,
      },
    });
  } catch (error) {
    console.error("[WEBAUTHN] Authentication verification failed:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 400 }
    );
  }

  if (!verification.verified) {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 400 }
    );
  }

  // Update counter
  await updateCredentialCounter(
    stored.credentialId,
    verification.authenticationInfo.newCounter
  );

  // Generate one-time login token for next-auth signIn
  const loginToken = generateLoginToken(stored.user.id);

  return NextResponse.json({
    success: true,
    userId: stored.user.id,
    token: loginToken,
  });
}
