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
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: `${basePath}/admin`,
    error: `${basePath}/admin`,
  },
};
