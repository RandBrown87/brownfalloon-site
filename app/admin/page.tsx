"use client";

import { useEffect, useMemo, useState } from "react";
import { useSiteData } from "@/hooks/use-site-data";
import { defaultSiteData, getShopByDate } from "@/lib/site-data";

const parseNumberInput = (value: string, fallback: number) => {
  if (value === "") return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const selectInputValue = (
  event: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>,
) => {
  event.currentTarget.select();
};

export default function AdminPage() {
  const { data, updateData, resetData } = useSiteData();
  const [draft, setDraft] = useState(data);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(data);
  }, [data]);

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedInput = password.trim().toLowerCase();
    const normalizedSaved = data.portalPasscode.toLowerCase();
    const devOverride = process.env.NEXT_PUBLIC_ADMIN_OVERRIDE;

    if (normalizedInput === normalizedSaved || normalizedInput === devOverride?.toLowerCase()) {
      setIsUnlocked(true);
      setError("");
      return;
    }

    setError("That passcode isn’t correct.");
  };

  const saveDisabled = useMemo(
    () => JSON.stringify(draft) === JSON.stringify(data),
    [draft, data],
  );

  const updateField = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateDrinkField = <K extends keyof typeof draft.currentDrink>(key: K, value: string | string[]) => {
    setDraft((prev) => ({
      ...prev,
      currentDrink: { ...prev.currentDrink, [key]: value },
    }));
  };

  const updateZoomField = <K extends keyof typeof draft.zoomInfo>(key: K, value: string) => {
    setDraft((prev) => ({
      ...prev,
      zoomInfo: { ...prev.zoomInfo, [key]: value },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      const normalizedDraft = {
        ...draft,
        currentDrink: {
          ...draft.currentDrink,
          ingredients: draft.currentDrink.ingredients.map((item) => item.trim()).filter(Boolean),
          steps: draft.currentDrink.steps.map((item) => item.trim()).filter(Boolean),
        },
      };
      setDraft(normalizedDraft);
      await updateData(normalizedDraft);
      setSaveMessage("Changes saved.");
    } catch (saveError) {
      setSaveMessage(saveError instanceof Error ? saveError.message : "Changes could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const reset = defaultSiteData;
    setDraft(reset);
    await resetData();
  };

  if (!isUnlocked) {
    return (
      <section className="mx-auto flex max-w-content justify-center px-6 pb-24 pt-40 lg:pt-48">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            admin access
          </p>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
            Family only.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Enter the family passcode to edit the site.
          </p>

          <form onSubmit={handleUnlock} className="mt-6">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Passcode"
              aria-label="Admin passcode"
              className="w-full rounded-lg border border-line bg-bg px-4 py-3 text-sm text-ink outline-none"
            />
            <p className="mt-2 min-h-[1.2em] text-sm text-accent">{error}</p>
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-surface transition-opacity hover:opacity-90"
            >
              Unlock admin
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24 pt-40 lg:pt-48">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        admin
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Edit the site content.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Update the shared calendar, recipe, archive, and Zoom details. Changes apply to everyone after you save.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saveDisabled || isSaving}
          className="rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
        <button
          onClick={handleReset}
          className="rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink"
        >
          Reset to defaults
        </button>
      </div>
      <p className="mt-3 min-h-[1.2em] text-sm text-accent">
        {saveMessage}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-line bg-surface p-6 lg:p-8">
          <h2 className="font-display text-2xl text-ink">Calendar</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Set the year, call time, and hosting rotation shown on the homepage and schedule.
          </p>
          <div className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-muted">
              Year
              <input
                type="text"
                inputMode="numeric"
                value={draft.year}
                onFocus={selectInputValue}
                onClick={selectInputValue}
                onChange={(event) => updateField("year", parseNumberInput(event.target.value, 2026))}
                className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
              />
              </label>
              <label className="block text-sm text-muted">
                Call time
                <input
                  type="time"
                  value={draft.callTime}
                  onChange={(event) => updateField("callTime", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
                />
                <span className="mt-1 block text-xs text-muted">Used by the countdown.</span>
              </label>
            </div>
            <label className="block text-sm text-muted">
              Current month index
              <input
                type="text"
                inputMode="numeric"
                value={draft.currentMonthIndex}
                onFocus={selectInputValue}
                onClick={selectInputValue}
                onChange={(event) => updateField("currentMonthIndex", parseNumberInput(event.target.value, 0))}
                className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
              />
              <span className="mt-1 block text-xs text-muted">January is 0, February is 1, and December is 11.</span>
            </label>
            <div className="max-h-[42rem] space-y-3 overflow-auto pr-1">
              {draft.roster.map((month, index) => (
                <div key={`${month.month}-${index}`} className="rounded-xl border border-line bg-bg p-3">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">Month {index + 1}</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      value={month.month}
                      onChange={(event) => {
                        const next = [...draft.roster];
                        next[index] = { ...next[index], month: event.target.value };
                        updateField("roster", next);
                      }}
                      className="rounded-lg border border-line bg-surface px-3 py-2 text-ink"
                    />
                    <input
                      value={month.host}
                      onChange={(event) => {
                        const next = [...draft.roster];
                        next[index] = { ...next[index], host: event.target.value };
                        updateField("roster", next);
                      }}
                      className="rounded-lg border border-line bg-surface px-3 py-2 text-ink"
                    />
                  </div>
                  <div className="mt-2 grid gap-2 md:grid-cols-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={month.monthIndex}
                      onFocus={selectInputValue}
                      onClick={selectInputValue}
                      onChange={(event) => {
                        const next = [...draft.roster];
                        next[index] = { ...next[index], monthIndex: parseNumberInput(event.target.value, 0) };
                        updateField("roster", next);
                      }}
                      className="rounded-lg border border-line bg-surface px-3 py-2 text-ink"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={month.day}
                      onFocus={selectInputValue}
                      onClick={selectInputValue}
                      onChange={(event) => {
                        const next = [...draft.roster];
                        next[index] = { ...next[index], day: parseNumberInput(event.target.value, 1) };
                        updateField("roster", next);
                      }}
                      className="rounded-lg border border-line bg-surface px-3 py-2 text-ink"
                    />
                    <input
                      value={month.note ?? ""}
                      onChange={(event) => {
                        const next = [...draft.roster];
                        next[index] = { ...next[index], note: event.target.value || undefined };
                        updateField("roster", next);
                      }}
                      className="rounded-lg border border-line bg-surface px-3 py-2 text-ink"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-2xl text-ink">Recipe</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm text-muted">
              Name
              <input
                value={draft.currentDrink.name}
                onChange={(event) => updateDrinkField("name", event.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
              />
            </label>
            <label className="block text-sm text-muted">
              Host
              <input
                value={draft.currentDrink.host}
                onChange={(event) => updateDrinkField("host", event.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
              />
            </label>
            <label className="block text-sm text-muted">
              Month
              <input
                value={draft.currentDrink.month}
                onChange={(event) => updateDrinkField("month", event.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
              />
            </label>
            <label className="block text-sm text-muted">
              Blurb
              <textarea
                value={draft.currentDrink.blurb}
                onChange={(event) => updateDrinkField("blurb", event.target.value)}
                className="mt-1 min-h-[110px] w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
              />
            </label>
            <label className="block text-sm text-muted">
              Ingredients (one per line)
              <textarea
                value={draft.currentDrink.ingredients.join("\n")}
                onChange={(event) => updateDrinkField("ingredients", event.target.value.split("\n"))}
                className="mt-1 min-h-[90px] w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
              />
            </label>
            <label className="block text-sm text-muted">
              Steps (one per line)
              <textarea
                value={draft.currentDrink.steps.join("\n")}
                onChange={(event) => updateDrinkField("steps", event.target.value.split("\n"))}
                className="mt-1 min-h-[90px] w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
              />
            </label>
            <label className="block text-sm text-muted">
              Shop by date
              <input
                value={getShopByDate(draft)}
                readOnly
                className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
              />
              <span className="mt-1 block text-xs text-muted">Automatically set to one week before the selected call date.</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-display text-2xl text-ink">Archive & Zoom</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block text-sm text-muted">
            Passcode
            <input
              value={draft.portalPasscode}
              onChange={(event) => updateField("portalPasscode", event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
            />
          </label>
          <label className="block text-sm text-muted">
            Zoom link
            <input
              value={draft.zoomInfo.link}
              onChange={(event) => updateZoomField("link", event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
            />
          </label>
          <label className="block text-sm text-muted">
            Meeting ID
            <input
              value={draft.zoomInfo.meetingId}
              onChange={(event) => updateZoomField("meetingId", event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
            />
          </label>
          <label className="block text-sm text-muted">
            Zoom passcode
            <input
              value={draft.zoomInfo.passcode}
              onChange={(event) => updateZoomField("passcode", event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink"
            />
          </label>
        </div>

        <div className="mt-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted">Archive entries</h3>
          <div className="mt-3 space-y-3">
            {draft.archive.map((entry, index) => (
              <div key={`${entry.month}-${entry.drink}-${index}`} className="rounded-xl border border-line bg-bg p-3">
                <div className="grid gap-2 md:grid-cols-3">
                  <input
                    value={entry.month}
                    onChange={(event) => {
                      const next = [...draft.archive];
                      next[index] = { ...next[index], month: event.target.value };
                      updateField("archive", next);
                    }}
                    className="rounded-lg border border-line bg-surface px-3 py-2 text-ink"
                  />
                  <input
                    value={entry.host}
                    onChange={(event) => {
                      const next = [...draft.archive];
                      next[index] = { ...next[index], host: event.target.value };
                      updateField("archive", next);
                    }}
                    className="rounded-lg border border-line bg-surface px-3 py-2 text-ink"
                  />
                  <input
                    value={entry.drink}
                    onChange={(event) => {
                      const next = [...draft.archive];
                      next[index] = { ...next[index], drink: event.target.value };
                      updateField("archive", next);
                    }}
                    className="rounded-lg border border-line bg-surface px-3 py-2 text-ink"
                  />
                </div>
                <textarea
                  value={entry.note ?? ""}
                  onChange={(event) => {
                    const next = [...draft.archive];
                    next[index] = { ...next[index], note: event.target.value || undefined };
                    updateField("archive", next);
                  }}
                  className="mt-2 min-h-[70px] w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
