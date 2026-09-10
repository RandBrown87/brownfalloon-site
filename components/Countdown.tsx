"use client";

import { useEffect, useMemo, useState } from "react";
import { useSiteData } from "@/hooks/use-site-data";
import { getNextCallDate } from "@/lib/site-data";

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
  const { data, isLoading } = useSiteData();
  const [isPouring, setIsPouring] = useState(false);
  const callDate = useMemo(() => getNextCallDate(data), [data]);
  const nextCallISO = callDate.toISOString();
  const { days, hours, minutes, seconds, isPast } = useCountdown(nextCallISO);
  const dateLabel = callDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeLabel = callDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsPouring(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (isLoading) {
    return <div className="mt-10 h-[106px] w-full max-w-[360px] animate-pulse rounded-2xl border border-line/80 bg-surface/40" aria-label="Loading countdown" />;
  }

  if (isPast) {
    return (
      <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-mono text-xs uppercase tracking-widest text-surface">
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
      <div className="textured-panel inline-flex gap-4 rounded-2xl border border-line/80 px-6 py-4 sm:gap-6">
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <span className="block font-display text-3xl font-semibold leading-none text-accent sm:text-5xl">
              <span
                className={`countdown-number ${isPouring ? "countdown-number--pouring" : ""}`}
                style={{ animationDelay: `${units.indexOf(unit) * 110}ms` }}
              >
                {String(unit.value).padStart(2, "0")}
              </span>
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
