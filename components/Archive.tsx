import { archive } from "@/lib/recipes";

export default function Archive() {
  return (
    <section id="archive" className="border-t border-line px-6 py-24">
      <div className="mx-auto max-w-content">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          archive
        </p>
        <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Every drink so far.
        </h2>

        <div className="mt-10 flex flex-col gap-3">
          {archive.map((entry) => (
            <div
              key={`${entry.month}-${entry.drink}`}
              className="rounded-xl border border-line bg-surface px-5 py-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  {entry.month}
                </span>
                <span className="font-mono text-xs text-muted">{entry.host}</span>
              </div>
              <p className="mt-1 font-display text-base font-semibold text-ink">
                {entry.drink}
              </p>
              {entry.note && (
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {entry.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
