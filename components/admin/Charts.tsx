"use client";

/**
 * Charts — Recharts-based charts for the admin dashboard.
 * Includes: two pie charts, a bar chart, and a line chart.
 */

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

// ---------------------------------------------------------------------------
// Color palettes
// ---------------------------------------------------------------------------
const DIRETORIA_COLORS = ["#6366f1", "#0f9b78", "#f59e0b"];
const FISCAL_COLORS = ["#8b5cf6", "#14b8a6", "#f97316"];
const PERFIL_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ChapaStat = { chapa: number; count: number };
type PerfilStat = { perfil: string; count: number };
type DayStat = { date: string; count: number };

const PERFIL_LABELS: Record<string, string> = {
  pre2018: "Ativo pré-2018",
  pos2018: "Ativo pós-2018",
  aposentado: "Aposentado(a)",
  dependente: "Dependente",
};

// ---------------------------------------------------------------------------
// PieCard
// ---------------------------------------------------------------------------
function PieCard({
  title,
  data,
  colors,
  labelKey = "chapa",
  prefix = "Chapa ",
}: {
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
  labelKey?: string;
  prefix?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            label={false}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} resp.`, ""]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported chart components
// ---------------------------------------------------------------------------

export function DireitoriaChart({ data }: { data: ChapaStat[] }) {
  const chartData = data.map((d) => ({
    name: `Chapa ${d.chapa}`,
    value: d.count,
  }));
  return (
    <PieCard
      title="Distribuição por Chapa — Diretoria"
      data={chartData}
      colors={DIRETORIA_COLORS}
    />
  );
}

export function FiscalChart({ data }: { data: ChapaStat[] }) {
  const chartData = data.map((d) => ({
    name: `Chapa ${d.chapa}`,
    value: d.count,
  }));
  return (
    <PieCard
      title="Distribuição por Chapa — Fiscal"
      data={chartData}
      colors={FISCAL_COLORS}
    />
  );
}

export function PerfilChart({ data }: { data: PerfilStat[] }) {
  const chartData = data.map((d) => ({
    name: PERFIL_LABELS[d.perfil] ?? d.perfil,
    count: d.count,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
        Distribuição por Perfil
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="count" name="Respostas" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={PERFIL_COLORS[i % PERFIL_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyChart({ data }: { data: DayStat[] }) {
  const chartData = data.map((d) => ({
    date: d.date.slice(5), // show MM-DD
    count: d.count,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
        Respostas por Dia (últimos 30 dias)
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            name="Respostas"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: "#6366f1", r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
