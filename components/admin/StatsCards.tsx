"use client";

/**
 * StatsCards — 4 KPI cards for the admin dashboard.
 */

type Props = {
  total: number;
  today: number;
  topDiretoria: string;
  topFiscal: string;
};

export default function StatsCards({ total, today, topDiretoria, topFiscal }: Props) {
  const cards = [
    {
      label: "Total de respostas",
      value: total.toLocaleString("pt-BR"),
      icon: "📊",
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "Respostas hoje",
      value: today.toLocaleString("pt-BR"),
      icon: "📅",
      color: "from-teal-500 to-teal-700",
    },
    {
      label: "Mais votada — Diretoria",
      value: topDiretoria,
      icon: "🏆",
      color: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Mais votada — Fiscal",
      value: topFiscal,
      icon: "🔍",
      color: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-2xl p-5 bg-gradient-to-br ${c.color} text-white shadow-lg`}
        >
          <div className="text-2xl mb-2">{c.icon}</div>
          <div className="text-3xl font-bold mb-1">{c.value}</div>
          <div className="text-xs opacity-80 font-medium">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
