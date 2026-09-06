import { zoomInfo } from "@/lib/zoom";

export default function CallToAction() {
  return (
    <section className="border-t border-line px-6 py-20 text-center">
      <div className="mx-auto max-w-content">
        <a
          href={zoomInfo.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-mono text-sm uppercase tracking-widest text-surface transition-opacity hover:opacity-90"
        >
          Join this month's call
        </a>
        <p className="mt-4 font-mono text-xs text-muted">
          Full link, meeting ID, and passcode live on the Zoom Portal.
        </p>
      </div>
    </section>
  );
}
