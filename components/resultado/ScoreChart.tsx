"use client";

/**
 * ScoreChart
 * Horizontal bar chart showing alignment % for each chapa.
 * Pure CSS — no external chart library required.
 */

type ChapaBars = {
  label: string;
  score: number;
  color: string;
  recommended: boolean;
};

type Props = {
  bars: ChapaBars[];
  title: string;
};

export default function ScoreChart({ bars, title }: Props) {
  const sorted = [...bars].sort((a, b) => b.score - a.score);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        {sorted.map((bar) => (
          <div key={bar.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {bar.label}
                {bar.recommended && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-medium">
                    Recomendada
                  </span>
                )}
              </span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {bar.score}%
              </span>
            </div>
            <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${bar.score}%`,
                  backgroundColor: bar.color,
                  opacity: bar.recommended ? 1 : 0.55,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
