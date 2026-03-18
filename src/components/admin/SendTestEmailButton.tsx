"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@/lib/fontawesome";

export function SendTestEmailButton() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSend() {
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/admin/email-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
        setMessage(`Test email sent to ${data.sentTo}`);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to send test email");
      }
    } catch {
      setStatus("error");
      setMessage("Network error");
    }
  }

  return (
    <div className="flex items-center gap-3">
      {message && (
        <span className={`text-xs ${status === "error" ? "text-coral" : "text-forest"}`}>
          {message}
        </span>
      )}
      <button
        type="button"
        onClick={handleSend}
        disabled={status === "sending"}
        className="inline-flex items-center gap-1.5 rounded-lg bg-ocean/10 px-3 py-1.5 text-xs font-medium text-ocean transition-colors hover:bg-ocean/20 disabled:opacity-50"
      >
        {status === "sending" ? (
          <FontAwesomeIcon icon={faSpinner} className="h-3 w-3" spin />
        ) : null}
        {status === "sending" ? "Sending..." : "Send Test Email"}
      </button>
    </div>
  );
}
