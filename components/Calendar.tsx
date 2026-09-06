import { roster, currentMonthIndex, year } from "@/lib/roster";
import MonthCalendar from "@/components/MonthCalendar";

export default function Calendar() {
  return (
    <section
      id="lineup"
      className="mx-auto max-w-content px-6 pb-20 pt-40 lg:pt-48"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        the calendar
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        The lineup.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        Who&apos;s hosting, and when. Trade months with someone if you need
        to — just update this page.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roster.map((entry, index) => (
          <MonthCalendar
            key={entry.month}
            month={entry.month}
            monthIndex={entry.monthIndex}
            year={year}
            day={entry.day}
            host={entry.host}
            note={entry.note}
            isCurrent={index === currentMonthIndex}
          />
        ))}
      </div>
    </section>
  );
}
