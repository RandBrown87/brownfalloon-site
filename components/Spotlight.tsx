import Link from "next/link";
import { currentHost } from "@/lib/roster";
import { currentDrink } from "@/lib/recipes";

export default function Spotlight() {
  return (
    <section id="spotlight" className="border-t border-line px-6 py-24">
      <div className="mx-auto max-w-content">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          this month's spotlight
        </p>
        <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {currentHost.host} is pouring this month.
        </h2>

        <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-xl font-semibold text-rust">
            {currentHost.host.charAt(0)}
          </div>
          <div>
            <span className="rounded-full bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-rust">
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
