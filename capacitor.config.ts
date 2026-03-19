import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration for EarthEcho.
 *
 * Because the app uses server actions, API routes, and next-auth (SSR),
 * we cannot use static export. Instead, the native shell loads the
 * hosted web app via `server.url`. Local assets in `webDir` are served
 * as a fallback while the connection is established.
 *
 * Environment-based URLs:
 *   - Development: http://10.0.2.2:3002 (Android emulator alias for host localhost)
 *   - Production:  https://earthecho.co.uk
 *
 * Note: Android emulator cannot reach "localhost" — use 10.0.2.2 instead.
 * For a physical device on the same WiFi, use your LAN IP (e.g., 192.168.x.x).
 */
const isDev = process.env.NODE_ENV === "development";

const config: CapacitorConfig = {
  appId: "com.earthecho.app",
  appName: "Earth Echo",
  webDir: "public",
  server: {
    url: isDev ? "http://10.0.2.2:3002" : "https://earthecho.co.uk",
    cleartext: isDev,
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#0a1a12",
      showSpinner: false,
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#2D6A4F",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  ios: {
    scheme: "EarthEcho",
    contentInset: "automatic",
    preferredContentMode: "mobile",
    allowsLinkPreview: false,
  },
  android: {
    allowMixedContent: false,
    // Orientation lock: set android:screenOrientation="portrait" in
    // android/app/src/main/AndroidManifest.xml after running `npx cap add android`
    buildOptions: {
      keystorePath: "earthecho-upload.keystore",
      keystoreAlias: "earthecho",
    },
  },
};

export default config;
