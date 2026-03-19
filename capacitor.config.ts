import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.earthecho.app",
  appName: "Earth Echo",
  webDir: "out",
  server: {
    // In development, point to the Next.js dev server
    ...(process.env.NODE_ENV === "development" && {
      url: "http://localhost:3002",
      cleartext: true,
    }),
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // We hide it manually after our animated splash
      backgroundColor: "#FFFFFF",
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
  },
  ios: {
    scheme: "EarthEcho",
    contentInset: "automatic",
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
};

export default config;
