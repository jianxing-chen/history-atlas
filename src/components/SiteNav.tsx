import { Link } from "react-router";
import { Seal } from "@/components/Seal";

export type Volume = "china" | "world" | "methods";

const ITEMS: { key: Volume; to: string; label: string }[] = [
  { key: "china", to: "/china", label: "中国卷" },
  { key: "world", to: "/world", label: "世界卷" },
  { key: "methods", to: "/methods", label: "方法卷" },
];

const LINK_CLS =
  "text-[color:var(--graphite-soft)] underline-offset-4 hover:underline";
const ACTIVE_CLS = "font-medium underline decoration-2 underline-offset-4";

export function SiteNav({ active, note }: { active: Volume; note?: string }) {
  return (
    <header className="mx-auto flex max-w-[1400px] items-baseline gap-5 px-5 pb-3 pt-6">
      <Link to="/" className="flex items-center gap-2.5">
        <Seal size={26} />
        <span className="leading-none">
          <span className="font-serif-cjk block text-xl font-semibold tracking-wide">
            历史图集
          </span>
          <span className="mt-1 block text-[9px] uppercase tracking-[0.3em] text-[color:var(--graphite-faint)]">
            Atlas of History
          </span>
        </span>
      </Link>
      <nav className="flex items-baseline gap-4 text-sm">
        {ITEMS.map((it) =>
          it.key === active ? (
            <span key={it.key} className={ACTIVE_CLS} aria-current="page">
              {it.label}
            </span>
          ) : (
            <Link key={it.key} to={it.to} className={LINK_CLS}>
              {it.label}
            </Link>
          ),
        )}
      </nav>
      {note && (
        <span className="ml-auto hidden text-xs text-[color:var(--graphite-faint)] sm:block">
          {note}
        </span>
      )}
    </header>
  );
}
