/**
 * GET /api/admin/results?page=1&pageSize=25
 * Returns paginated quiz results for the admin table.
 * Protected — requires authenticated admin session.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllResults } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "25", 10);

  try {
    const { rows, total } = getAllResults(page, Math.min(pageSize, 100));
    return NextResponse.json({ rows, total });
  } catch (error) {
    console.error("[GET /api/admin/results]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
