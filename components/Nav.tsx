"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "the patio" },
  { href: "/schedule", label: "calendar" },
  { href: "/recipes", label: "bar cart" },
  { href: "/zoom", label: "zoom portal" },
  { href: "/gallery", label: "gallery" },
  { href: "/admin", label: "admin" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-bg/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-ink hover:text-accent transition-colors"
        >
          ~/The Brownfalloon
        </Link>
        <ul className="flex flex-wrap items-center gap-5 sm:gap-6">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                    active ? "text-accent" : "text-muted hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
