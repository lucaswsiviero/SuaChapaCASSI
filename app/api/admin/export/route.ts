/**
 * GET /api/admin/export
 * Streams a CSV file with all anonymous quiz results.
 * Protected — requires authenticated admin session.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllResultsForExport } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = getAllResultsForExport();

    const header = [
      "id",
      "session_id",
      "recommended_diretoria",
      "recommended_fiscal",
      "score_chapa2",
      "score_chapa4",
      "score_chapa6",
      "score_chapa33",
      "score_chapa55",
      "score_chapa77",
      "perfil_situacao",
      "tags",
      "created_at",
    ].join(",");

    const csvRows = rows.map((r) =>
      [
        r.id,
        r.session_id,
        r.recommended_diretoria,
        r.recommended_fiscal,
        r.score_chapa2 ?? "",
        r.score_chapa4 ?? "",
        r.score_chapa6 ?? "",
        r.score_chapa33 ?? "",
        r.score_chapa55 ?? "",
        r.score_chapa77 ?? "",
        r.perfil_situacao ?? "",
        `"${r.tags.replace(/"/g, '""')}"`,
        r.created_at,
      ].join(",")
    );

    const csv = [header, ...csvRows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="suachapacassi_export_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/export]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
