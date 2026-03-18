import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { verifyLoginToken } from "./webauthn-server";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, ...message) {
      console.error("[AUTH ERROR]", code, ...message);
    },
    warn(code, ...message) {
      console.warn("[AUTH WARN]", code, ...message);
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      id: "passkey",
      name: "Passkey",
      credentials: {
        userId: { type: "text" },
        token: { type: "text" },
      },
      async authorize(credentials) {
        const userId = credentials?.userId as string | undefined;
        const token = credentials?.token as string | undefined;
        if (!userId || !token) return null;

        const valid = verifyLoginToken(userId, token);
        if (!valid) return null;

        const user = await db.user.findUnique({
          where: { id: userId },
        });
        if (!user || user.banned) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    Credentials({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        // Block banned users from signing in
        if (user.banned) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ["/dashboard", "/track", "/challenges", "/leaderboard", "/badges", "/forum", "/resources", "/profile"];
      const isProtected = protectedPaths.some((path) => nextUrl.pathname.startsWith(path));
      const isAdminPath = nextUrl.pathname.startsWith("/admin");

      if ((isProtected || isAdminPath) && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, check if user already exists by email
      // (user.id may not correspond to a DB record for first-time OAuth sign-ins)
      if (account && account.provider !== "credentials" && user.email) {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
            select: { id: true, banned: true },
          });

          // Block banned users
          if (existingUser?.banned) return false;

          // Refresh profile image for existing users
          if (existingUser) {
            if (account.provider === "google" && profile?.picture) {
              await db.user.update({
                where: { id: existingUser.id },
                data: { image: profile.picture as string },
              });
            }
            if (account.provider === "facebook") {
              const fbPicture =
                (profile as Record<string, unknown>)?.picture &&
                typeof (profile as Record<string, unknown>).picture === "object"
                  ? ((profile as Record<string, unknown>).picture as { data?: { url?: string } })?.data?.url
                  : undefined;
              if (fbPicture) {
                await db.user.update({
                  where: { id: existingUser.id },
                  data: { image: fbPicture },
                });
              }
            }
          }
          // New user — adapter will create the record after signIn returns true
        } catch (error) {
          console.error("[AUTH] signIn callback error:", error);
          // Don't block sign-in if profile image update fails
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.picture) {
        session.user.image = token.picture as string;
      }
      if (token.role) {
        (session.user as unknown as Record<string, unknown>).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // On initial sign-in, user object is available — persist the id
      if (user) {
        token.sub = user.id;
      }
      if (token.sub) {
        const dbUser = await db.user.findUnique({
          where: { id: token.sub },
          select: { customImage: true, image: true, role: true, banned: true },
        });
        if (dbUser) {
          token.picture = dbUser.customImage || dbUser.image || token.picture;
          token.role = dbUser.role;
          // If user was banned after login, invalidate session
          if (dbUser.banned) {
            token.banned = true;
          }
        }
      }
      return token;
    },
  },
});
