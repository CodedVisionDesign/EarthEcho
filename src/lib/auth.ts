import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
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

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
    async signIn({ user, account, profile }) {
      // Refresh OAuth profile image on each sign-in
      if (account?.provider === "google" && user.id && profile?.picture) {
        await db.user.update({
          where: { id: user.id },
          data: { image: profile.picture as string },
        });
      }
      if (account?.provider === "facebook" && user.id) {
        const fbPicture =
          (profile as Record<string, unknown>)?.picture &&
          typeof (profile as Record<string, unknown>).picture === "object"
            ? ((profile as Record<string, unknown>).picture as { data?: { url?: string } })?.data?.url
            : undefined;
        if (fbPicture) {
          await db.user.update({
            where: { id: user.id },
            data: { image: fbPicture },
          });
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
      return session;
    },
    async jwt({ token }) {
      if (token.sub) {
        const dbUser = await db.user.findUnique({
          where: { id: token.sub },
          select: { customImage: true, image: true },
        });
        if (dbUser) {
          token.picture = dbUser.customImage || dbUser.image || token.picture;
        }
      }
      return token;
    },
  },
});
