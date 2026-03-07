import Link from "next/link";

type SiteHeaderProps = {
  className?: string;
  compact?: boolean;
};

export function SiteHeader({
  className = "",
  compact = false,
}: SiteHeaderProps) {
  return (
    <header
      className={`relative z-20 flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/6 px-4 py-3 backdrop-blur-xl ${className}`}
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-lg text-emerald-200">
          ✦
        </div>
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/55">
            Living Flora Globe
          </p>
          <p className="font-display text-xl text-white">
            Wander the world through plants
          </p>
        </div>
      </Link>

      <nav className="hidden items-center gap-5 text-sm text-white/70 md:flex">
        <Link href="/" className="transition hover:text-white">
          Home
        </Link>
        <Link href="/flora" className="transition hover:text-white">
          Flora Index
        </Link>
      </nav>

      {!compact ? (
        <Link
          href="/flora"
          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/16"
        >
          Browse collection
        </Link>
      ) : null}
    </header>
  );
}
