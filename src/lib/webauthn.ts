"use client";

import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from "@simplewebauthn/browser";

export { browserSupportsWebAuthn };

export async function registerPasskey(deviceName?: string) {
  // 1. Get registration options from server
  const optionsRes = await fetch("/api/webauthn/register/options", {
    method: "POST",
  });

  if (!optionsRes.ok) {
    const data = await optionsRes.json();
    throw new Error(data.error || "Failed to get registration options");
  }

  const { options } = await optionsRes.json();

  // 2. Start registration ceremony (triggers biometric prompt)
  const credential = await startRegistration(options);

  // 3. Verify with server
  const verifyRes = await fetch("/api/webauthn/register/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, deviceName }),
  });

  if (!verifyRes.ok) {
    const data = await verifyRes.json();
    throw new Error(data.error || "Registration verification failed");
  }

  return verifyRes.json();
}

export async function authenticateWithPasskey(email?: string) {
  // 1. Get authentication options
  const optionsRes = await fetch("/api/webauthn/authenticate/options", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!optionsRes.ok) {
    const data = await optionsRes.json();
    throw new Error(data.error || "Failed to get authentication options");
  }

  const { options } = await optionsRes.json();

  // 2. Start authentication ceremony (triggers biometric prompt)
  const credential = await startAuthentication(options);

  // 3. Verify with server
  const verifyRes = await fetch("/api/webauthn/authenticate/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });

  if (!verifyRes.ok) {
    const data = await verifyRes.json();
    throw new Error(data.error || "Authentication failed");
  }

  // Returns { success, userId, token } for use with signIn("passkey", ...)
  return verifyRes.json();
}

export async function getPasskeys() {
  const res = await fetch("/api/webauthn/credentials");
  if (!res.ok) throw new Error("Failed to fetch passkeys");
  const data = await res.json();
  return data.credentials as Array<{
    id: string;
    credentialId: string;
    deviceName: string | null;
    backedUp: boolean;
    createdAt: string;
    lastUsedAt: string | null;
  }>;
}

export async function deletePasskey(credentialId: string) {
  const res = await fetch("/api/webauthn/credentials", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credentialId }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete passkey");
  }

  return res.json();
}
