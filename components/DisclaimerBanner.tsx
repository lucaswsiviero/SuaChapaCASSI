/**
 * DisclaimerBanner
 * Shown on all pages to make the tool's independence clear.
 */

export default function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`w-full border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-800 dark:text-amber-300 flex items-start gap-3 ${compact ? "px-4 py-3 text-xs" : "px-5 py-4 text-sm"}`}
    >
      <svg
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>
        <strong>Ferramenta independente.</strong> O SuaChapaCASSI não tem vínculo com nenhuma das chapas candidatas nem com o Banco do Brasil ou a CASSI. As recomendações são baseadas exclusivamente nas suas respostas.
      </p>
    </div>
  );
}
