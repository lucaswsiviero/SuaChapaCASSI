"use client";

/**
 * SessionProvider — wraps the app with NextAuth session context.
 * Must be a client component since it uses React context.
 */

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
