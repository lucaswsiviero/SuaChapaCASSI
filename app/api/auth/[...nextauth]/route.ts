/**
 * NextAuth.js route handler.
 * Auth configuration lives in lib/auth.ts to avoid polluting module exports.
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
