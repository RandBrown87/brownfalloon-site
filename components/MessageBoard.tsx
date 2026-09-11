"use client";

import { FormEvent, useEffect, useState } from "react";
import type { BoardMessage } from "@/app/api/messages/route";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

export default function MessageBoard() {
  const [messages, setMessages] = useState<BoardMessage[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [deletePasscode, setDeletePasscode] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/messages", { cache: "no-store" })
      .then((response) => response.json())
      .then(setMessages)
      .catch(() => setStatus("Messages could not be loaded."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);
    setStatus("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Your message could not be posted.");

      setMessages((current) => [result, ...current]);
      setName("");
      setMessage("");
      setStatus("Message posted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Your message could not be posted.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setStatus("");

    try {
      const response = await fetch("/api/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, passcode: deletePasscode }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "The message could not be deleted.");

      setMessages((current) => current.filter((item) => item.id !== id));
      setDeletePasscode("");
      setStatus("Message deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The message could not be deleted.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section id="message-board" className="border-t border-line px-6 py-24">
      <div className="mx-auto grid max-w-content gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">message board</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">
            Leave a note for the family.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Say hello, share a toast, or leave a thought for the next call. Anyone who can visit the site can post.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              required
              placeholder="Your name"
              aria-label="Your name"
              className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink outline-none placeholder:text-muted"
            />
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={500}
              required
              rows={4}
              placeholder="Write a message..."
              aria-label="Message"
              className="w-full resize-y rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink outline-none placeholder:text-muted"
            />
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isPosting}
                className="rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPosting ? "Posting..." : "Post message"}
              </button>
              <p aria-live="polite" className="text-sm text-accent">{status}</p>
            </div>
          </form>
        </div>

        <div className="space-y-3">
          {isLoading && <p className="text-sm text-muted">Loading messages...</p>}
          {!isLoading && messages.length === 0 && (
            <div className="rounded-xl border border-dashed border-line px-5 py-8 text-sm text-muted">
              Be the first to leave a note.
            </div>
          )}
          {messages.map((item) => (
            <article key={item.id} className="textured-panel rounded-xl border border-line px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-ink">{item.name}</h3>
                <div className="flex items-center gap-3">
                  <time dateTime={item.createdAt} className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    {formatDate(item.createdAt)}
                  </time>
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingId(item.id);
                      setDeletePasscode("");
                      setStatus("");
                    }}
                    disabled={deletingId === item.id}
                    className="font-mono text-[10px] uppercase tracking-widest text-muted underline underline-offset-2 hover:text-accent disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">{item.message}</p>
            </article>
          ))}
        </div>
      </div>
      {deletingId && (
        <div className="mx-auto mt-6 max-w-content rounded-xl border border-line bg-surface p-4">
          <label className="block text-sm text-muted">
            Admin passcode to delete this message
            <input
              type="password"
              value={deletePasscode}
              onChange={(event) => setDeletePasscode(event.target.value)}
              className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-sm text-ink outline-none sm:max-w-sm"
              autoFocus
            />
          </label>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={() => handleDelete(deletingId)}
              disabled={!deletePasscode}
              className="rounded-full bg-accent px-5 py-2 font-mono text-xs uppercase tracking-widest text-surface disabled:opacity-50"
            >
              Confirm delete
            </button>
            <button
              type="button"
              onClick={() => {
                setDeletingId("");
                setDeletePasscode("");
              }}
              className="rounded-full border border-line px-5 py-2 font-mono text-xs uppercase tracking-widest text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}