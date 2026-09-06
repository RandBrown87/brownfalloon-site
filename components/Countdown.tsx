"use client";

import { useEffect, useMemo, useState } from "react";

// Update this each month to the next call's date and time.
const NEXT_CALL_ISO = "2026-09-22T19:00:00";

function useCountdown(targetISO: string) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [remaining, setRemaining] = useState(() => Math.max(target - Date.now(), 0));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(target - Date.now(), 0));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return {
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remaining / (1000 * 60)) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
    isPast: remaining <= 0,
  };
}

export default function Countdown() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(NEXT_CALL_ISO);
  const callDate = new Date(NEXT_CALL_ISO);
  const dateLabel = callDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeLabel = callDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isPast) {
    return (
      <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-rust px-5 py-3 font-mono text-xs uppercase tracking-widest text-surface">
        Live now — join the call
      </div>
    );
  }

  const units = [
    { value: days, label: "days" },
    { value: hours, label: "hrs" },
    { value: minutes, label: "min" },
    { value: seconds, label: "sec" },
  ];

  return (
    <div className="mt-10">
      <div className="inline-flex gap-4 rounded-2xl border border-line bg-surface/80 px-6 py-4 sm:gap-6">
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <span className="block font-display text-2xl font-semibold text-ink sm:text-3xl">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-xs text-muted">
        Next call: {dateLabel} at {timeLabel}
      </p>
    </div>
  );
}
