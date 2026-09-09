"use client";

import Link from "next/link";
import { useSiteData } from "@/hooks/use-site-data";

export default function Spotlight() {
  const { data } = useSiteData();
  const { roster, currentMonthIndex, currentDrink } = data;
  const currentHost = roster[currentMonthIndex] ?? roster[0];

  return (
    <section id="spotlight" className="border-t border-line px-6 py-24">
      <div className="mx-auto max-w-content">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          this month's spotlight
        </p>
        <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {currentHost.host} is pouring this month.
        </h2>

        <div className="textured-panel relative mt-10 flex flex-col gap-6 rounded-2xl border border-line p-6 sm:flex-row sm:items-center">
          <svg className="absolute right-5 top-4 h-14 w-14 text-gold/50" viewBox="0 0 56 56" fill="none" aria-hidden="true">
            <path d="M8 8c12 3 25 2 40-3M8 14c12 3 25 2 40-3" stroke="currentColor" strokeWidth="1.2" />
            <path d="M43 8c-4 5-5 11-2 17" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-xl font-semibold text-bg">
            {currentHost.host.charAt(0)}
          </div>
          <div>
            <span className="rounded-full bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-bg">
              {currentHost.month} host
            </span>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {currentHost.host} is mixing up a{" "}
              <span className="font-semibold text-ink">{currentDrink.name}</span>
              {currentHost.note ? ` — ${currentHost.note}` : "."}
            </p>
            <Link
              href="/recipes"
              className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:text-accent"
            >
              Get the full recipe &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
