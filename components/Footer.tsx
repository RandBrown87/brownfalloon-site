export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
        <p className="font-mono text-xs text-muted">
          &copy; {new Date().getFullYear()} The Brownfaloon.
        </p>
        <p className="font-mono text-xs text-muted">
          Same family, same drink hour, every month.
        </p>
      </div>
    </footer>
  );
}
