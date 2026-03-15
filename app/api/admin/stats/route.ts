/**
 * GET /api/admin/stats
 * Returns aggregated statistics for the admin dashboard.
 * Protected — requires authenticated admin session.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getStats } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
