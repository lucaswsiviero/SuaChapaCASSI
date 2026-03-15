/**
 * Landing page — /
 * Shows the app title, countdown, brief explanation, and a CTA button.
 */

import Link from "next/link";
import Countdown from "@/components/Countdown";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SuaChapaCASSI — Eleições CASSI 2026",
  description:
    "Descubra qual chapa das Eleições CASSI 2026 está mais alinhada com o seu perfil. Ferramenta independente de auxílio à decisão.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-sm font-medium border border-teal-200 dark:border-teal-800">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Eleições CASSI 2026
          </span>

          {/* Title */}
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Sua{" "}
              <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                Chapa
              </span>{" "}
              CASSI
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 font-medium">
              Responda 20 perguntas e descubra qual chapa candidata está mais alinhada com o seu perfil.
            </p>
          </div>

          {/* Countdown */}
          <div className="py-6 px-6 md:px-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Votação encerra em
            </p>
            <Countdown />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              23 de março de 2026, às 18h (horário de Brasília)
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 text-white text-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            Fazer o teste agora
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          {/* Disclaimer */}
          <DisclaimerBanner />

          {/* Chapas info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <ElectionCard
              title="Diretoria + Conselho Deliberativo"
              chapas={[
                { num: 2, name: "CASSI Para os Associados", candidate: "Luciana Bagno" },
                { num: 4, name: "CASSI Solidária", candidate: "Fernando Amaral (atual)" },
                { num: 6, name: "CASSI É Vida", candidate: "Antonio Furquim" },
              ]}
            />
            <ElectionCard
              title="Conselho Fiscal"
              chapas={[
                { num: 33, name: "CASSI Solidária", candidate: "Róger Medeiros" },
                { num: 55, name: "CASSI Para os Associados", candidate: "Diego Carvalho" },
                { num: 77, name: "CASSI É Vida", candidate: "Edson Xavier" },
              ]}
            />
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { step: "1", title: "Responda", desc: "20 perguntas sobre seu perfil, prioridades e visão de gestão" },
              { step: "2", title: "Pontue", desc: "Algoritmo calcula o alinhamento com cada chapa" },
              { step: "3", title: "Descubra", desc: "Veja o resultado para as duas eleições simultâneas" },
            ].map((s) => (
              <div key={s.step} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ElectionCard({
  title,
  chapas,
}: {
  title: string;
  chapas: { num: number; name: string; candidate: string }[];
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <ul className="space-y-2">
        {chapas.map((c) => (
          <li key={c.num} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs font-bold flex items-center justify-center">
              {c.num}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                {c.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{c.candidate}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
