"use client";

/**
 * ProgressBar
 * Shows current question number and a visual progress bar.
 */

type Props = {
  current: number; // 1-based
  total: number;
};

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round(((current - 1) / total) * 100);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>Pergunta {current} de {total}</span>
        <span>{pct}% concluído</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
