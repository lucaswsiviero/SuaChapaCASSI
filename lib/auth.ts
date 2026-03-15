/**
 * auth.ts
 * Shared NextAuth configuration — imported by both the route handler
 * and server-side getServerSession calls.
 */

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const authOptions: NextAuthOptions = {
  // Cookies com path "/" para funcionar corretamente com subpath no Nginx
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: { sameSite: "lax", path: "/", secure: true },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true },
    },
    state: {
      name: "next-auth.state",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true, maxAge: 900 },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      return allowedEmails.includes(user.email.toLowerCase());
    },
    async redirect() {
      // NEXTAUTH_URL já inclui o subpath: https://sivie.ro/suachapacassi
      const nextAuthUrl = process.env.NEXTAUTH_URL ?? "";
      return `${nextAuthUrl}/admin`;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: `${basePath}/admin`,
    error: `${basePath}/admin`,
  },
};
