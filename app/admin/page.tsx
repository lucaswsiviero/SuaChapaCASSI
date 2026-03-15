"use client";

/**
 * Admin dashboard — /admin
 * Login simples por senha (ADMIN_PASSWORD no .env.local).
 * Sessão mantida via localStorage.
 */

import { useEffect, useState } from "react";
import StatsCards from "@/components/admin/StatsCards";
import {
  DireitoriaChart,
  FiscalChart,
  PerfilChart,
  DailyChart,
} from "@/components/admin/Charts";

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
  recommended_diretoria: number;
  recommended_fiscal: number;
  score_chapa2: number | null;
  score_chapa4: number | null;
  score_chapa6: number | null;
  perfil_situacao: string | null;
  created_at: string;
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setAuthed(localStorage.getItem("cassi_admin") === "1");
    setChecking(false);
  }, []);

  if (checking) return <LoadingScreen />;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { localStorage.removeItem("cassi_admin"); setAuthed(false); }} />;
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${basePath}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        localStorage.setItem("cassi_admin", "1");
        onLogin();
      } else {
        setError("Senha incorreta.");
      }
    } catch {
      setError("Erro ao conectar.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">SuaChapaCASSI</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha de acesso"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            autoFocus
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold disabled:opacity-50 hover:scale-[1.02] transition-transform"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const PAGE_SIZE = 25;

  useEffect(() => {
    fetch(`${basePath}/api/admin/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`${basePath}/api/admin/results?page=${page}&pageSize=${PAGE_SIZE}`)
      .then(r => r.json())
      .then(d => { setRows(d.rows ?? []); setTotalRows(d.total ?? 0); })
      .catch(console.error);
  }, [page]);

  function getTopChapa(data: { chapa: number; count: number }[]) {
    if (!data?.length) return "—";
    return `Chapa ${[...data].sort((a, b) => b.count - a.count)[0].chapa}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">SuaChapaCASSI — Admin</h1>
        <div className="flex gap-2">
          <a href={`${basePath}/api/admin/export`} className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors">
            Exportar CSV
          </a>
          <button onClick={onLogout} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {stats && (
          <StatsCards
            total={stats.total}
            today={stats.today}
            topDiretoria={getTopChapa(stats.byDiretoria)}
            topFiscal={getTopChapa(stats.byFiscal)}
          />
        )}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DireitoriaChart data={stats.byDiretoria} />
            <FiscalChart data={stats.byFiscal} />
          </div>
        )}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerfilChart data={stats.byPerfil} />
            <DailyChart data={stats.byDay} />
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Respostas ({totalRows.toLocaleString("pt-BR")})</h2>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">← Anterior</button>
              <span className="px-3 py-1.5 text-sm text-gray-500">Pág. {page} / {Math.ceil(totalRows / PAGE_SIZE) || 1}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page * PAGE_SIZE >= totalRows} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">Próxima →</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {["#", "Data/Hora", "Diretoria", "Fiscal", "C2%", "C4%", "C6%", "Perfil"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-gray-400">{r.id}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{new Date(r.created_at).toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{r.recommended_diretoria}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{r.recommended_fiscal}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.score_chapa2 ?? "—"}%</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.score_chapa4 ?? "—"}%</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.score_chapa6 ?? "—"}%</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.perfil_situacao ?? "—"}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Nenhuma resposta ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-8 h-8 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
    </div>
  );
}
