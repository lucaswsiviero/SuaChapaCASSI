"use client";

/**
 * Admin dashboard — /admin
 * Protected by Google OAuth via NextAuth.js.
 * Shows KPIs, charts, paginated results table, and CSV export.
 */

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import StatsCards from "@/components/admin/StatsCards";
import {
  DireitoriaChart,
  FiscalChart,
  PerfilChart,
  DailyChart,
} from "@/components/admin/Charts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Stats = {
  total: number;
  today: number;
  byDiretoria: { chapa: number; count: number }[];
  byFiscal: { chapa: number; count: number }[];
  byPerfil: { perfil: string; count: number }[];
  byDay: { date: string; count: number }[];
};

type ResultRow = {
  id: number;
  session_id: string;
  recommended_diretoria: number;
  recommended_fiscal: number;
  score_chapa2: number | null;
  score_chapa4: number | null;
  score_chapa6: number | null;
  perfil_situacao: string | null;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (!session) {
    return <LoginScreen />;
  }

  return <Dashboard />;
}

// ---------------------------------------------------------------------------
// Login screen
// ---------------------------------------------------------------------------
function LoginScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center space-y-6 border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Admin — SuaChapaCASSI
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Acesso restrito a administradores autorizados.
        </p>
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
        >
          <GoogleIcon />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const PAGE_SIZE = 25;

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`/api/admin/results?page=${page}&pageSize=${PAGE_SIZE}`)
      .then((r) => r.json())
      .then((d) => {
        setRows(d.rows ?? []);
        setTotalRows(d.total ?? 0);
      })
      .catch(console.error);
  }, [page]);

  function getTopChapa(data: { chapa: number; count: number }[]) {
    if (!data?.length) return "—";
    const top = [...data].sort((a, b) => b.count - a.count)[0];
    return `Chapa ${top.chapa}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          SuaChapaCASSI — Painel Admin
        </h1>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export"
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
          >
            Exportar CSV
          </a>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* KPI cards */}
        {stats && (
          <StatsCards
            total={stats.total}
            today={stats.today}
            topDiretoria={getTopChapa(stats.byDiretoria)}
            topFiscal={getTopChapa(stats.byFiscal)}
          />
        )}

        {/* Charts row 1 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DireitoriaChart data={stats.byDiretoria} />
            <FiscalChart data={stats.byFiscal} />
          </div>
        )}

        {/* Charts row 2 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerfilChart data={stats.byPerfil} />
            <DailyChart data={stats.byDay} />
          </div>
        )}

        {/* Results table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">
              Respostas ({totalRows.toLocaleString("pt-BR")})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ← Anterior
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                Página {page} / {Math.ceil(totalRows / PAGE_SIZE) || 1}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * PAGE_SIZE >= totalRows}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Próxima →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {["#", "Data/Hora", "Diretoria", "Fiscal", "C2%", "C4%", "C6%", "Perfil"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-gray-400 dark:text-gray-500">{r.id}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">
                      {r.recommended_diretoria}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">
                      {r.recommended_fiscal}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {r.score_chapa2 ?? "—"}%
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {r.score_chapa4 ?? "—"}%
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {r.score_chapa6 ?? "—"}%
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {r.perfil_situacao ?? "—"}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                      Nenhuma resposta registrada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small components
// ---------------------------------------------------------------------------

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-8 h-8 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
