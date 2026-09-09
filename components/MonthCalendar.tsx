const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type MonthCalendarProps = {
  month: string;
  monthIndex: number;
  year: number;
  day: number;
  host: string;
  note?: string;
  isCurrent?: boolean;
};

export default function MonthCalendar({
  month,
  monthIndex,
  year,
  day,
  host,
  note,
  isCurrent,
}: MonthCalendarProps) {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className={`textured-panel rounded-2xl border p-5 ${
        isCurrent ? "border-line ring-1 ring-line/60" : "border-line"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink">
          {month}
        </h3>
        {isCurrent && (
          <span className="rounded-full bg-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink">
            up now
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="font-mono text-[10px] uppercase tracking-wide text-muted"
          >
            {label}
          </span>
        ))}
        {cells.map((cellDay, index) =>
          cellDay === null ? (
            <span key={`blank-${index}`} />
          ) : (
            <span
              key={cellDay}
              className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                cellDay === day
                  ? "bg-gold font-semibold text-surface"
                  : "text-muted"
              }`}
            >
              {cellDay}
            </span>
          )
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        <span className="font-semibold text-ink">{host}</span>
        {note ? ` — ${note}` : ""}
      </p>
    </div>
  );
}
