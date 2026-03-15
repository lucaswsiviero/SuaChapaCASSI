"use client";

/**
 * Countdown
 * Animated countdown to the end of voting: 23/03/2026 18:00 (Brasília time)
 */

import { useEffect, useState } from "react";

const VOTING_END = new Date("2026-03-23T21:00:00.000Z"); // 18:00 BRT = 21:00 UTC

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
};

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = VOTING_END.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    ended: false,
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.ended) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
          A votação foi encerrada.
        </p>
      </div>
    );
  }

  const units = [
    { label: "dias", value: timeLeft.days },
    { label: "horas", value: timeLeft.hours },
    { label: "min", value: timeLeft.minutes },
    { label: "seg", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-4">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 dark:from-blue-700 dark:to-blue-900 shadow-lg flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1.5 uppercase tracking-wider">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
