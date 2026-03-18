"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faPlus,
  faTrashCan,
  faShieldHalved,
  faCircleCheck,
  faSpinner,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  browserSupportsWebAuthn,
  registerPasskey,
  getPasskeys,
  deletePasskey,
} from "@/lib/webauthn";

interface Passkey {
  id: string;
  credentialId: string;
  deviceName: string | null;
  backedUp: boolean;
  createdAt: string;
  lastUsedAt: string | null;
}

export function PasskeyManager() {
  const [supported, setSupported] = useState(false);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPasskeys = useCallback(async () => {
    try {
      const data = await getPasskeys();
      setPasskeys(data);
    } catch {
      // Non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSupported(browserSupportsWebAuthn());
    fetchPasskeys();
  }, [fetchPasskeys]);

  async function handleRegister() {
    setError("");
    setSuccess("");
    setRegistering(true);

    try {
      // Detect device name from user agent
      const ua = navigator.userAgent;
      let deviceName = "Passkey";
      if (/iPhone|iPad/.test(ua)) deviceName = "iPhone / iPad";
      else if (/Android/.test(ua)) deviceName = "Android";
      else if (/Windows/.test(ua)) deviceName = "Windows";
      else if (/Mac/.test(ua)) deviceName = "Mac";

      await registerPasskey(deviceName);
      setSuccess("Passkey registered successfully!");
      await fetchPasskeys();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      // Don't show error if user cancelled
      if (!message.includes("cancelled") && !message.includes("canceled") && !message.includes("NotAllowedError")) {
        setError(message);
      }
    } finally {
      setRegistering(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this passkey? You won't be able to use it to sign in.")) return;

    setError("");
    setDeletingId(id);

    try {
      await deletePasskey(id);
      setPasskeys((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove passkey");
    } finally {
      setDeletingId(null);
    }
  }

  if (!supported) {
    return null; // Don't show if browser doesn't support WebAuthn
  }

  return (
    <Card variant="default" className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faShieldHalved}
            className="h-4 w-4 text-forest"
            aria-hidden
          />
          <h3 className="text-[15px] font-semibold text-charcoal">
            Passkeys
          </h3>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={faPlus}
          loading={registering}
          onClick={handleRegister}
        >
          Add Passkey
        </Button>
      </div>

      <p className="mb-4 text-xs text-slate">
        Sign in with Face ID, fingerprint, or Windows Hello instead of a
        password.
      </p>

      {error && (
        <div className="mb-3 rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3 rounded-lg bg-forest/10 px-3 py-2 text-sm text-forest">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <FontAwesomeIcon
            icon={faSpinner}
            className="h-5 w-5 animate-spin text-slate"
            aria-hidden
          />
        </div>
      ) : passkeys.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
          <FontAwesomeIcon
            icon={faKey}
            className="mb-2 h-6 w-6 text-slate/40"
            aria-hidden
          />
          <p className="text-sm text-slate">
            No passkeys registered yet. Add one to enable biometric sign-in.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {passkeys.map((passkey) => (
            <div
              key={passkey.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest/10">
                  <FontAwesomeIcon
                    icon={faKey}
                    className="h-3.5 w-3.5 text-forest"
                    aria-hidden
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-charcoal">
                      {passkey.deviceName || "Passkey"}
                    </span>
                    {passkey.backedUp && (
                      <Badge variant="success" size="sm">
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="h-2.5 w-2.5"
                          aria-hidden
                        />
                        Synced
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-slate">
                    Added{" "}
                    {new Date(passkey.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {passkey.lastUsedAt && (
                      <>
                        {" · "}Last used{" "}
                        {new Date(passkey.lastUsedAt).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short" }
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(passkey.id)}
                disabled={deletingId === passkey.id}
                className="rounded-lg p-2 text-slate/60 transition-colors hover:bg-coral/10 hover:text-coral disabled:opacity-50"
                title="Remove passkey"
              >
                {deletingId === passkey.id ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="h-3.5 w-3.5 animate-spin"
                    aria-hidden
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="h-3.5 w-3.5"
                    aria-hidden
                  />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
