"use client";

/**
 * Quiz page — /quiz
 * Manages quiz state (current question, answers, tags) using useReducer.
 * After the last question, POSTs results to /api/results and navigates to /resultado.
 */

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { questions, Question } from "@/lib/questions";
import ProgressBar from "@/components/quiz/ProgressBar";
import QuizCard from "@/components/quiz/QuizCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Footer from "@/components/Footer";
import { v4 as uuidv4 } from "uuid";

// ---------------------------------------------------------------------------
// State management
// ---------------------------------------------------------------------------

type QuizState = {
  currentIndex: number;
  // Maps question id → array of selected option ids
  answers: Record<number, string[]>;
  // Flat list of all collected tags
  tags: string[];
  sessionId: string;
};

type Action =
  | { type: "SELECT_OPTION"; questionId: number; optionId: string; multiple: boolean }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SKIP" };

function reducer(state: QuizState, action: Action): QuizState {
  const q = questions[state.currentIndex];

  switch (action.type) {
    case "SELECT_OPTION": {
      const prev = state.answers[action.questionId] ?? [];
      let next: string[];

      if (action.multiple) {
        // Toggle selection for multi-choice
        next = prev.includes(action.optionId)
          ? prev.filter((id) => id !== action.optionId)
          : [...prev, action.optionId];
      } else {
        // Replace for single-choice
        next = [action.optionId];
      }

      return { ...state, answers: { ...state.answers, [action.questionId]: next } };
    }

    case "NEXT": {
      const selected = state.answers[q.id] ?? [];
      // Collect tags from selected options
      const newTags = selected.flatMap(
        (optId) => q.options.find((o) => o.id === optId)?.tags ?? []
      );
      return {
        ...state,
        tags: [...state.tags, ...newTags],
        currentIndex: Math.min(state.currentIndex + 1, questions.length - 1),
      };
    }

    case "BACK":
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
      };

    case "SKIP":
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, questions.length - 1),
      };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function QuizPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const [state, dispatch] = useReducer(reducer, {
    currentIndex: 0,
    answers: {},
    tags: [],
    sessionId: uuidv4(),
  });

  const currentQuestion: Question = questions[state.currentIndex];
  const isFirst = state.currentIndex === 0;
  const isLast = state.currentIndex === questions.length - 1;
  const selected = state.answers[currentQuestion.id] ?? [];

  function handleChange(optionId: string) {
    dispatch({
      type: "SELECT_OPTION",
      questionId: currentQuestion.id,
      optionId,
      multiple: currentQuestion.type === "multiple",
    });
  }

  async function handleNext() {
    if (isLast) {
      await submitQuiz();
      return;
    }
    dispatch({ type: "NEXT" });
    setAnimKey((k) => k + 1);
  }

  function handleBack() {
    dispatch({ type: "BACK" });
    setAnimKey((k) => k + 1);
  }

  function handleSkip() {
    dispatch({ type: "SKIP" });
    setAnimKey((k) => k + 1);
  }

  async function submitQuiz() {
    setSubmitting(true);

    // Collect final tags including current question answers
    const finalAnswers = Object.entries(state.answers).flatMap(([, ids]) => ids);
    const lastSelected = selected;
    const lastTags = lastSelected.flatMap(
      (id) => currentQuestion.options.find((o) => o.id === id)?.tags ?? []
    );
    const allTags = [...state.tags, ...lastTags];
    const allAnswerIds = [...finalAnswers, ...lastSelected.filter((id) => !finalAnswers.includes(id))];

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: state.sessionId,
          answers: allAnswerIds,
          tags: allTags,
        }),
      });

      const data = await res.json();

      if (data.scores) {
        // Pass scores via sessionStorage to the result page
        sessionStorage.setItem("cassi_scores", JSON.stringify(data.scores));
      }
    } catch (err) {
      console.error("Failed to submit quiz results:", err);
    }

    router.push("/resultado");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Sua<span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">Chapa</span>CASSI
            </h1>
          </div>

          {/* Progress */}
          <ProgressBar current={state.currentIndex + 1} total={questions.length} />

          {/* Disclaimer compact */}
          <div className="mb-6">
            <DisclaimerBanner compact />
          </div>

          {/* Card */}
          {submitting ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Calculando resultado…</p>
            </div>
          ) : (
            <QuizCard
              question={currentQuestion}
              selected={selected}
              onChange={handleChange}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
              isFirst={isFirst}
              isLast={isLast}
              animationKey={animKey}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
