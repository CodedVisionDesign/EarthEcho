import NextAuth from "next-auth";

/**
 * Lightweight edge-compatible auth config for middleware only.
 * Does NOT import Prisma, bcrypt, or any Node.js-only dependencies.
 * Only used for route protection via the `authorized` callback.
 */
export const { auth: middleware } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = [
        "/dashboard",
        "/track",
        "/challenges",
        "/leaderboard",
        "/badges",
        "/forum",
        "/resources",
        "/profile",
      ];
      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
});
