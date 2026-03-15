/**
 * Root layout — wraps all pages with NextAuth session provider,
 * global font, and metadata.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SuaChapaCASSI — Eleições CASSI 2026",
  description:
    "Descubra qual chapa das Eleições CASSI 2026 está mais alinhada com o seu perfil. Ferramenta independente de auxílio à decisão.",
  openGraph: {
    title: "SuaChapaCASSI — Eleições CASSI 2026",
    description: "Descubra qual chapa está mais alinhada com o seu perfil.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
