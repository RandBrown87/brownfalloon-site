const rules = [
  "The host picks the drink — anything goes, from a family classic to something brand new.",
  "One week out, the host sends the ingredient list so everyone can shop ahead.",
  "First fifteen minutes are catch-up. Then the host walks everyone through the pour.",
  "The host leads a toast before the first sip. Yes, even over Zoom.",
  "Can't host your month? Trade with someone and update the calendar.",
];

export default function Rules() {
  return (
    <section id="rules" className="border-t border-line px-6 py-24">
      <div className="mx-auto max-w-content">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          how it works
        </p>
        <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Rules of the game.
        </h2>

        <div className="mt-10 flex flex-col">
          {rules.map((rule, index) => (
            <div
              key={rule}
              className={`grid gap-2 py-5 sm:grid-cols-[60px_1fr] sm:gap-6 ${
                index !== rules.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <span className="font-display text-lg font-semibold text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-muted">{rule}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
