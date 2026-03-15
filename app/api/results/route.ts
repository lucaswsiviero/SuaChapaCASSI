/**
 * POST /api/results
 * Receives quiz answers from the frontend, scores them, and persists the
 * anonymous result to SQLite. Returns the score breakdown.
 * No personal data is saved.
 */

import { NextRequest, NextResponse } from "next/server";
import { calculateScores } from "@/lib/scoring";
import { insertResult } from "@/lib/db";

type RequestBody = {
  sessionId: string;
  answers: string[];   // option IDs e.g. ["1b", "2a", "2c", ...]
  tags: string[];      // collected tags from all answers
};

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();

    if (!body.sessionId || !Array.isArray(body.answers) || !Array.isArray(body.tags)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const scores = calculateScores(body.tags);

    // Detect perfil_situacao from Q1 tags
    let perfilSituacao: string | null = null;
    if (body.tags.includes("pre2018")) perfilSituacao = "pre2018";
    else if (body.tags.includes("pos2018")) perfilSituacao = "pos2018";
    else if (body.tags.includes("aposentado")) perfilSituacao = "aposentado";
    else if (body.tags.includes("dependente")) perfilSituacao = "dependente";

    insertResult({
      session_id: body.sessionId,
      answers: body.answers,
      tags: body.tags,
      recommended_diretoria: scores.recommendedDiretoria,
      recommended_fiscal: scores.recommendedFiscal,
      score_chapa2: scores.chapa2,
      score_chapa4: scores.chapa4,
      score_chapa6: scores.chapa6,
      score_chapa33: scores.chapa33,
      score_chapa55: scores.chapa55,
      score_chapa77: scores.chapa77,
      perfil_situacao: perfilSituacao,
    });

    return NextResponse.json({ success: true, scores });
  } catch (error) {
    console.error("[POST /api/results]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
