"use client";

/**
 * Resultado page — /resultado
 * Reads scores from sessionStorage (set by /quiz after API call).
 * Displays results for both elections and share buttons.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import ScoreChart from "@/components/resultado/ScoreChart";
import ShareButtons from "@/components/resultado/ShareButtons";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Footer from "@/components/Footer";
import type { ScoreResult } from "@/lib/scoring";

const CHAPA_NAMES: Record<number, string> = {
  2: "Chapa 2 — CASSI Para os Associados",
  4: "Chapa 4 — CASSI Solidária",
  6: "Chapa 6 — CASSI É Vida",
  33: "Chapa 33 — CASSI Solidária",
  55: "Chapa 55 — CASSI Para os Associados",
  77: "Chapa 77 — CASSI É Vida",
};

const DIRETORIA_COLORS: Record<number, string> = {
  2: "#6366f1",
  4: "#0f9b78",
  6: "#f59e0b",
};

const FISCAL_COLORS: Record<number, string> = {
  33: "#0f9b78",
  55: "#6366f1",
  77: "#f59e0b",
};

export default function ResultadoPage() {
  const [scores, setScores] = useState<ScoreResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("cassi_scores");
    if (raw) {
      try {
        setScores(JSON.parse(raw));
      } catch {
        /* ignore parse errors */
      }
    }
  }, []);

  if (!scores) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Nenhum resultado encontrado.
        </p>
        <Link
          href="/quiz"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold hover:scale-[1.02] transition-transform"
        >
          Fazer o teste
        </Link>
      </div>
    );
  }

  const direBars = [
    { label: "Chapa 2", score: scores.chapa2, color: DIRETORIA_COLORS[2], recommended: scores.recommendedDiretoria === 2 },
    { label: "Chapa 4", score: scores.chapa4, color: DIRETORIA_COLORS[4], recommended: scores.recommendedDiretoria === 4 },
    { label: "Chapa 6", score: scores.chapa6, color: DIRETORIA_COLORS[6], recommended: scores.recommendedDiretoria === 6 },
  ];

  const fiscalBars = [
    { label: "Chapa 33", score: scores.chapa33, color: FISCAL_COLORS[33], recommended: scores.recommendedFiscal === 33 },
    { label: "Chapa 55", score: scores.chapa55, color: FISCAL_COLORS[55], recommended: scores.recommendedFiscal === 55 },
    { label: "Chapa 77", score: scores.chapa77, color: FISCAL_COLORS[77], recommended: scores.recommendedFiscal === 77 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Header */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-sm font-medium">
              🗳️ Resultado do teste
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Seu perfil é mais alinhado com a{" "}
              <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                Chapa {scores.recommendedDiretoria}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {CHAPA_NAMES[scores.recommendedDiretoria]}
            </p>
          </div>

          {/* Diretoria result card */}
          <ResultCard
            electionLabel="Diretoria de Risco + Conselho Deliberativo"
            recommended={scores.recommendedDiretoria}
            recommendedName={CHAPA_NAMES[scores.recommendedDiretoria]}
            reasons={scores.reasonsDiretoria}
            bars={direBars}
          />

          {/* Fiscal result card */}
          <ResultCard
            electionLabel="Conselho Fiscal"
            recommended={scores.recommendedFiscal}
            recommendedName={CHAPA_NAMES[scores.recommendedFiscal]}
            reasons={scores.reasonsFiscal}
            bars={fiscalBars}
          />

          {/* Share */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Compartilhe com amigos e colegas</h2>
            <ShareButtons
              recommendedDiretoria={scores.recommendedDiretoria}
              recommendedFiscal={scores.recommendedFiscal}
            />
          </div>

          {/* Disclaimer */}
          <DisclaimerBanner />

          {/* Redo */}
          <div className="text-center">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refazer o teste
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component
// ---------------------------------------------------------------------------

type Bar = { label: string; score: number; color: string; recommended: boolean };

function ResultCard({
  electionLabel,
  recommended,
  recommendedName,
  reasons,
  bars,
}: {
  electionLabel: string;
  recommended: number;
  recommendedName: string;
  reasons: string[];
  bars: Bar[];
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
          {electionLabel}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Chapa {recommended}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-semibold">
            Recomendada
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{recommendedName}</p>
      </div>

      {/* Score bars */}
      <ScoreChart bars={bars} title="Alinhamento por chapa" />

      {/* Reasons */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Por que esta chapa?
        </h3>
        <ul className="space-y-2">
          {reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
