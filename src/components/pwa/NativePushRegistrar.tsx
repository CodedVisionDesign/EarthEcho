"use client";

import { useEffect } from "react";
import { registerNativePush } from "@/lib/native-push";

/**
 * Registers native push notifications when running inside Capacitor.
 * Renders nothing — just a side-effect hook.
 */
export function NativePushRegistrar() {
  useEffect(() => {
    registerNativePush();
  }, []);

  return null;
}
