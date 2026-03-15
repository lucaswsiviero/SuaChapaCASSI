"use client";

/**
 * QuizCard
 * Renders a single question with its answer options.
 * Supports both single-choice and multiple-choice questions.
 * Animates in/out on question change.
 */

import { Question } from "@/lib/questions";

type Props = {
  question: Question;
  selected: string[];
  onChange: (optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  isFirst: boolean;
  isLast: boolean;
  animationKey: number;
};

export default function QuizCard({
  question,
  selected,
  onChange,
  onNext,
  onBack,
  onSkip,
  isFirst,
  isLast,
  animationKey,
}: Props) {
  const isMultiple = question.type === "multiple";
  const canAdvance = selected.length > 0;

  return (
    <div
      key={animationKey}
      className="animate-fadeSlideIn w-full max-w-2xl mx-auto"
    >
      {/* Question text */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 leading-snug">
        {question.text}
      </h2>

      {isMultiple && (
        <p className="text-sm text-teal-600 dark:text-teal-400 mb-4 font-medium">
          Pode marcar mais de uma opção
        </p>
      )}

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-medium text-sm md:text-base
                ${
                  isSelected
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 shadow-sm"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-900/10"
                }
              `}
            >
              <span className="flex items-start gap-3">
                {/* Checkbox / radio visual */}
                <span
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-${isMultiple ? "md" : "full"} border-2 flex items-center justify-center transition-colors
                    ${isSelected ? "border-teal-500 bg-teal-500" : "border-gray-400 dark:border-gray-500"}`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          disabled={isFirst}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <div className="flex gap-2">
          {!question.required && onSkip && (
            <button
              onClick={onSkip}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Pular
            </button>
          )}

          <button
            onClick={onNext}
            disabled={!canAdvance}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${
                canAdvance
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {isLast ? "Ver resultado" : "Próxima"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
