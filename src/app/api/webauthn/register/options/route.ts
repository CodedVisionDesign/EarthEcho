import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getWebAuthnConfig,
  getUserCredentials,
  storeChallenge,
} from "@/lib/webauthn-server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, displayName: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const config = getWebAuthnConfig();
  const existingCredentials = await getUserCredentials(user.id);

  const options = await generateRegistrationOptions({
    rpName: config.rpName,
    rpID: config.rpID,
    userID: user.id,
    userName: user.email ?? user.id,
    userDisplayName: user.displayName || user.name || user.email || "User",
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
    excludeCredentials: existingCredentials.map((cred) => ({
      id: Buffer.from(cred.credentialId, "base64url"),
      type: "public-key" as const,
      transports: cred.transports,
    })),
    timeout: 60000,
  });

  await storeChallenge(options.challenge, "registration", user.id);

  return NextResponse.json({ options });
}
