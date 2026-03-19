import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard",
          "/track/",
          "/profile",
          "/badges",
          "/challenges",
          "/leaderboard",
          "/forum",
          "/banned",
          "/offline",
          "/reset-password",
          "/_next/",
        ],
      },
    ],
    sitemap: "https://earthecho.co.uk/sitemap.xml",
  };
}
