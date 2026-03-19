import { db } from "./db";
import { createHmac, randomBytes } from "crypto";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";

// ==========================================
// Config
// ==========================================

export function getWebAuthnConfig() {
  return {
    rpName: process.env.WEBAUTHN_RP_NAME || "Earth Echo",
    rpID: process.env.WEBAUTHN_RP_ID!,
    origin: process.env.WEBAUTHN_ORIGIN!,
  };
}

// ==========================================
// Challenge helpers
// ==========================================

export async function storeChallenge(
  challenge: string,
  type: "registration" | "authentication",
  userId?: string
) {
  // Clean up expired challenges opportunistically
  await db.webAuthnChallenge.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  }).catch(() => {});

  return db.webAuthnChallenge.create({
    data: {
      challenge,
      type,
      userId: userId ?? null,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
  });
}

export async function consumeChallenge(
  challenge: string,
  type: "registration" | "authentication"
) {
  const record = await db.webAuthnChallenge.findFirst({
    where: {
      challenge,
      type,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) return null;

  // Delete it (one-time use)
  await db.webAuthnChallenge.delete({ where: { id: record.id } });
  return record;
}

// ==========================================
// Credential DB helpers
// ==========================================

export async function getUserCredentials(userId: string) {
  const credentials = await db.webAuthnCredential.findMany({
    where: { userId },
  });

  return credentials.map((cred) => ({
    id: cred.id,
    credentialId: cred.credentialId,
    publicKey: new Uint8Array(cred.publicKey),
    counter: Number(cred.counter),
    transports: cred.transports
      ? (cred.transports.split(",") as AuthenticatorTransportFuture[])
      : undefined,
    deviceName: cred.deviceName,
    backedUp: cred.backedUp,
    createdAt: cred.createdAt,
    lastUsedAt: cred.lastUsedAt,
  }));
}

export async function getCredentialByCredentialId(credentialId: string) {
  const cred = await db.webAuthnCredential.findUnique({
    where: { credentialId },
    include: { user: { select: { id: true, email: true, name: true, image: true, banned: true } } },
  });

  if (!cred) return null;

  return {
    ...cred,
    publicKey: new Uint8Array(cred.publicKey),
    counter: Number(cred.counter),
    transports: cred.transports
      ? (cred.transports.split(",") as AuthenticatorTransportFuture[])
      : undefined,
  };
}

export async function saveCredential(data: {
  userId: string;
  credentialId: string;
  publicKey: Uint8Array;
  counter: number;
  transports?: AuthenticatorTransportFuture[];
  backedUp: boolean;
  deviceName?: string;
}) {
  return db.webAuthnCredential.create({
    data: {
      userId: data.userId,
      credentialId: data.credentialId,
      publicKey: Buffer.from(data.publicKey),
      counter: BigInt(data.counter),
      transports: data.transports?.join(",") ?? null,
      backedUp: data.backedUp,
      deviceName: data.deviceName ?? null,
    },
  });
}

export async function updateCredentialCounter(
  credentialId: string,
  newCounter: number
) {
  return db.webAuthnCredential.update({
    where: { credentialId },
    data: {
      counter: BigInt(newCounter),
      lastUsedAt: new Date(),
    },
  });
}

// ==========================================
// One-time login token (bridges WebAuthn verify → next-auth signIn)
// ==========================================

const loginTokens = new Map<string, { userId: string; expiresAt: number }>();

export function generateLoginToken(userId: string): string {
  const secret = process.env.AUTH_SECRET!;
  const nonce = randomBytes(16).toString("hex");
  const timestamp = Date.now().toString();
  const token = createHmac("sha256", secret)
    .update(`${userId}:${nonce}:${timestamp}`)
    .digest("hex");

  const fullToken = `${token}:${nonce}:${timestamp}`;

  // Store with 30-second expiry
  loginTokens.set(fullToken, {
    userId,
    expiresAt: Date.now() + 30_000,
  });

  // Clean up old tokens
  for (const [key, val] of loginTokens) {
    if (val.expiresAt < Date.now()) loginTokens.delete(key);
  }

  return fullToken;
}

export function verifyLoginToken(
  userId: string,
  token: string
): boolean {
  const entry = loginTokens.get(token);
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) {
    loginTokens.delete(token);
    return false;
  }
  if (entry.userId !== userId) return false;

  // Single use
  loginTokens.delete(token);
  return true;
}
