import { NextResponse } from "next/server";
import { getAllResultsForExport } from "@/lib/db";

export async function GET() {
  try {
    const rows = getAllResultsForExport();
    const header = ["id","session_id","recommended_diretoria","recommended_fiscal","score_chapa2","score_chapa4","score_chapa6","score_chapa33","score_chapa55","score_chapa77","perfil_situacao","tags","created_at"].join(",");
    const csvRows = rows.map(r =>
      [r.id, r.session_id, r.recommended_diretoria, r.recommended_fiscal,
       r.score_chapa2 ?? "", r.score_chapa4 ?? "", r.score_chapa6 ?? "",
       r.score_chapa33 ?? "", r.score_chapa55 ?? "", r.score_chapa77 ?? "",
       r.perfil_situacao ?? "", `"${r.tags.replace(/"/g, '""')}"`, r.created_at].join(",")
    );
    return new NextResponse([header, ...csvRows].join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="cassi_export_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/export]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
