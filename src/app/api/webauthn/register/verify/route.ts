import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { auth } from "@/lib/auth";
import {
  getWebAuthnConfig,
  consumeChallenge,
  saveCredential,
} from "@/lib/webauthn-server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { credential, deviceName } = body;

  if (!credential) {
    return NextResponse.json({ error: "Missing credential" }, { status: 400 });
  }

  const config = getWebAuthnConfig();

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: async (challenge: string) => {
        const record = await consumeChallenge(challenge, "registration");
        return !!record;
      },
      expectedOrigin: config.origin,
      expectedRPID: config.rpID,
    });
  } catch (error) {
    console.error("[WEBAUTHN] Registration verification failed:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 400 }
    );
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 400 }
    );
  }

  const { credentialPublicKey, credentialID, counter } =
    verification.registrationInfo;
  const credentialBackedUp = verification.registrationInfo.credentialBackedUp;

  // Store as base64url
  const credentialIdBase64 = Buffer.from(credentialID).toString("base64url");

  await saveCredential({
    userId: session.user.id,
    credentialId: credentialIdBase64,
    publicKey: credentialPublicKey,
    counter,
    transports: credential.response.transports,
    backedUp: credentialBackedUp,
    deviceName: deviceName || undefined,
  });

  return NextResponse.json({
    success: true,
    credentialId: credentialIdBase64,
  });
}
