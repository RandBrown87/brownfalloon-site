import { currentDrink } from "@/lib/recipes";

export default function RecipeCard() {
  return (
    <section
      id="current"
      className="mx-auto max-w-content px-6 pb-20 pt-40 lg:pt-48"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        the bar cart
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        This month&apos;s pour.
      </h1>

      <div className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <span className="rounded-full bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-rust">
          hosted by {currentDrink.host}
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
          {currentDrink.name}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {currentDrink.blurb}
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_1.3fr]">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
              Ingredients
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {currentDrink.ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="flex gap-2 text-sm leading-relaxed text-ink"
                >
                  <span className="text-accent">&bull;</span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
              Method
            </h3>
            <ol className="mt-4 flex flex-col gap-3">
              {currentDrink.steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink">
                  <span className="font-display font-semibold text-gold">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <span className="mt-8 inline-block rounded-full bg-accent-soft px-4 py-2 font-mono text-xs text-rust">
          Shop by {currentDrink.shopBy}
        </span>
      </div>
    </section>
  );
}
