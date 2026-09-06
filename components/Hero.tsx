import Countdown from "@/components/Countdown";

export default function Hero() {
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
    </section>
  );
}
