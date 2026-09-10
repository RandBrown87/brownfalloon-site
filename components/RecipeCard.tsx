"use client";

import { useSiteData } from "@/hooks/use-site-data";
import { getShopByDate } from "@/lib/site-data";

export default function RecipeCard() {
  const { data } = useSiteData();
  const { currentDrink } = data;
  const shopByDate = getShopByDate(data);

  return (
    <section
      id="current"
      className="mx-auto max-w-content px-6 pb-20 pt-40 lg:pt-48"
    >
      <div className="flex items-center gap-3 text-accent">
        <svg className="h-10 w-10" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M9 8h22L22 20v9l-5 3v-12L9 8Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13 8h14M12 24h16" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <p className="font-mono text-xs uppercase tracking-widest">
        the bar cart
        </p>
      </div>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        This month&apos;s pour.
      </h1>

      <div className="textured-panel relative mt-10 -rotate-[0.35deg] rounded-2xl border border-accent/60 p-6 sm:p-8">
        <span className="rounded-full bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-bg">
          hosted by {currentDrink.host}
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
          {currentDrink.name}
        </h2>
        <p className="mt-3 max-w-xl font-display text-lg italic leading-relaxed text-accent-soft">
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
                  <span className="min-w-0 whitespace-pre-wrap break-words">{ingredient}</span>
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
                <li key={`${step}-${index}`} className="flex gap-3 text-sm leading-relaxed text-ink">
                  <span className="font-display font-semibold text-gold">
                    {index + 1}
                  </span>
                  <span className="min-w-0 whitespace-pre-wrap break-words">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <span className="mt-8 inline-block rounded-full bg-accent-soft px-4 py-2 font-mono text-xs text-bg">
          Shop by {shopByDate}
        </span>
      </div>
    </section>
  );
}
