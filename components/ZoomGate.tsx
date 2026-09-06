"use client";

import { useState } from "react";
import { zoomInfo, portalPasscode } from "@/lib/zoom";

export default function ZoomGate() {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState("");

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim().toLowerCase() === portalPasscode) {
      setUnlocked(true);
      setError("");
    } else {
      setError("That's not it — ask Mom for the passcode.");
    }
  };

  const copy = (text: string, key: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 1500);
  };

  if (!unlocked) {
    return (
      <section className="mx-auto flex max-w-content justify-center px-6 pb-24 pt-40 lg:pt-48">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            zoom portal
          </p>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
            Family only.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Enter the family passcode to see this month&apos;s link.
          </p>
          <form onSubmit={handleUnlock} className="mt-6">
            <input
              type="password"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Passcode"
              aria-label="Family passcode"
              className="w-full rounded-lg border border-line bg-bg px-4 py-3 text-sm text-ink outline-none"
            />
            <p className="mt-2 min-h-[1.2em] text-sm text-rust">{error}</p>
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-surface transition-opacity hover:opacity-90"
            >
              Unlock
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-content px-6 pb-24 pt-40 lg:pt-48">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        zoom portal
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        This month&apos;s call details.
      </h1>

      <div className="mt-10 flex flex-col gap-3">
        {[
          { key: "link", label: "Meeting link", value: zoomInfo.link },
          { key: "id", label: "Meeting ID", value: zoomInfo.meetingId },
          { key: "code", label: "Passcode", value: zoomInfo.passcode },
        ].map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4"
          >
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {row.label}
              </div>
              <div className="mt-1 font-display text-base font-semibold text-ink">
                {row.value}
              </div>
            </div>
            <button
              onClick={() => copy(row.value, row.key)}
              className="rounded-full border border-accent px-4 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent-soft"
            >
              {copiedKey === row.key ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <a
          href={zoomInfo.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-mono text-sm uppercase tracking-widest text-surface transition-opacity hover:opacity-90"
        >
          Open Zoom now
        </a>
      </div>

      <p className="mx-auto mt-8 max-w-md text-center text-xs leading-relaxed text-muted">
        This page isn&apos;t real security — it&apos;s just here so nobody has
        to dig through old texts. Same link every month unless the host says
        otherwise.
      </p>
    </section>
  );
}
