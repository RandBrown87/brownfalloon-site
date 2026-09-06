"use client";

import { useState } from "react";

type Photo = {
  url: string;
  caption: string;
};

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const next = files.map((file) => ({
      url: URL.createObjectURL(file),
      caption: file.name.replace(/\.[^/.]+$/, ""),
    }));
    setPhotos((prev) => [...next, ...prev]);
    event.target.value = "";
  };

  return (
    <section className="mx-auto max-w-content px-6 pb-24 pt-40 lg:pt-48">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        family gallery
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Show us the damage.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        Screenshots from the call, drink attempts, glorious fails — drop them
        here.
      </p>

      <div className="mt-10 rounded-2xl border-2 border-dashed border-line bg-surface/60 p-10 text-center">
        <p className="text-sm text-muted">Add a photo from this month&apos;s call.</p>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-surface transition-opacity hover:opacity-90">
          Add photos
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </label>
      </div>

      {photos.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">
          Nothing here yet — be the first to post this month&apos;s screenshot.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-xl border border-line bg-surface"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 truncate bg-ink/70 px-2 py-1 font-mono text-[11px] text-surface">
                {photo.caption}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-center font-mono text-xs text-muted">
        Photos added here only stay on your own screen for this visit — no
        shared storage is wired up yet.
      </p>
    </section>
  );
}
