"use client";

import Link from "next/link";
import Countdown from "@/components/Countdown";
import { useSiteData } from "@/hooks/use-site-data";
import { getNextCall } from "@/lib/site-data";

export default function Hero() {
  const { data } = useSiteData();
  const nextCall = getNextCall(data);
  const lastDrink = data.archive[0];
  const nextDateLabel = nextCall.date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });

  return (
    <section
      id="top"
      className="relative mx-auto max-w-content overflow-hidden px-6 pb-20 pt-40 text-center lg:pb-28 lg:pt-48"
    >
      <svg
        className="leaf-drift pointer-events-none absolute right-6 top-24 h-14 w-14 text-gold/40 lg:right-16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2C7 6 3 10 3 15a9 9 0 0 0 18 0c0-5-4-9-9-13Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M12 5v16" stroke="currentColor" strokeWidth="1.2" />
      </svg>

      <svg
        className="pour-glass pointer-events-none absolute left-5 top-28 h-20 w-16 text-gold/60 sm:left-12 lg:left-20"
        viewBox="0 0 64 88"
        fill="none"
        aria-hidden="true"
      >
        <path className="pour-stream" d="M23 2c2 12 2 18 2 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 28h40L45 54c-1 4-5 7-9 7s-8-3-9-7L12 28Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M32 61v17M22 80h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path className="glass-fill" d="M18 42h28l-2 11c-1 4-5 6-11 6s-10-2-11-6l-4-11Z" fill="currentColor" opacity=".3" />
      </svg>

      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        the front porch
      </p>
      <h1 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
        Welcome to The Brownfalloon
      </h1>
      <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted">
        One family, one Zoom link, one drink a month. Pour something, pull up
        a chair.
      </p>

      <div className="flex justify-center">
        <Countdown />
      </div>

      <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
        <div className="textured-panel rounded-xl border border-accent/50 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">next up</p>
          <p className="mt-2 font-display text-lg font-semibold text-ink">{nextCall.entry.host}</p>
          <p className="text-sm text-muted">{nextCall.entry.month} · {nextDateLabel}</p>
        </div>
        <Link href="/recipes#archive" className="textured-panel rounded-xl border border-line p-4 transition-colors hover:border-accent">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">last month</p>
          <p className="mt-2 font-display text-lg font-semibold text-ink">{lastDrink?.drink ?? "The first pour"}</p>
          <p className="text-sm text-muted">{lastDrink?.host ?? "Family recipe box"} · See the archive →</p>
        </Link>
      </div>
    </section>
  );
}
