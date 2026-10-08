import { useMemo, useState } from "react";
import { Link } from "react-router";
import { REGIONS, BANDS, type WEvent } from "@/data/world";
import { ty, totalHeight, ticks, fmtYear } from "@/lib/time";

const MIN_GAP = 52; // 卡片最小纵向间距

interface Placed {
  ev: WEvent;
  top: number;
}

function layoutEvents(events: WEvent[]): Placed[] {
  const sorted = [...events].sort((a, b) => a.y - b.y);
  let cursor = -Infinity;
  return sorted.map((ev) => {
    const want = ty(ev.y);
    const top = Math.max(want, cursor + MIN_GAP);
    cursor = top;
    return { ev, top };
  });
}

export default function World() {
  const H = totalHeight();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const placedByRegion = useMemo(
    () => REGIONS.map((r) => ({ region: r, items: layoutEvents(r.events) })),
    []
  );
  const allTicks = useMemo(() => ticks(), []);

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="min-h-screen">
      {/* 站点导航 */}
      <header className="mx-auto flex max-w-6xl items-baseline gap-5 px-5 pb-3 pt-6">
        <span className="font-serif-cjk text-2xl font-semibold tracking-wide">
          历史图集
        </span>
        <nav className="flex items-baseline gap-4 text-sm">
          <Link
            to="/"
            className="text-[color:var(--graphite-soft)] underline-offset-4 hover:underline"
          >
            图集首页
          </Link>
          <span className="font-medium underline underline-offset-4 decoration-2">
            世界卷
          </span>
          <Link
            to="/china"
            className="text-[color:var(--graphite-soft)] underline-offset-4 hover:underline"
          >
            中国卷
          </Link>
        </nav>
        <span className="ml-auto hidden text-xs text-[color:var(--graphite-faint)] sm:block">
          竖版 · 五地区对照 · 点击卡片展开说明
        </span>
      </header>
      <hr className="pencil-rule mx-auto max-w-6xl" />

      {/* 时间轴板 */}
      <main className="mx-auto max-w-6xl overflow-x-auto px-3 pb-16 pt-4">
        <div style={{ minWidth: 76 + REGIONS.length * 200 + "px" }}>
          {/* 地区列头（吸顶） */}
          <div
            className="sticky top-0 z-20 grid border-b-2 border-[color:var(--graphite)] bg-[color:var(--paper)]"
            style={{ gridTemplateColumns: `76px repeat(${REGIONS.length}, 1fr)` }}
          >
            <div />
            {REGIONS.map((r) => (
              <div key={r.id} className="px-3 pb-2 pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-[3px] border border-[color:var(--graphite)]"
                    style={{ background: r.pigment }}
                  />
                  <span className="font-serif-cjk text-lg font-semibold">
                    {r.name}
                  </span>
                </div>
                <div className="pl-5 text-[11px] italic text-[color:var(--graphite-faint)]">
                  {r.en}
                </div>
              </div>
            ))}
          </div>

          {/* 板体 */}
          <div
            className="relative grid"
            style={{
              gridTemplateColumns: `76px repeat(${REGIONS.length}, 1fr)`,
              height: H + 40,
            }}
          >
            {/* 时代横带（贯穿所有列） */}
            <div className="pointer-events-none absolute inset-0">
              {BANDS.map((b) => {
                const top = ty(b.from);
                const bottom = ty(b.to);
                return (
                  <div
                    key={b.name}
                    className="hatch-band absolute left-0 right-0"
                    style={{ top, height: bottom - top }}
                  >
                    <div
                      className="pointer-events-auto sticky left-0 inline-block pl-2 pt-2"
                      style={{ marginLeft: 80 }}
                    >
                      <div className="font-serif-cjk text-[13px] font-semibold tracking-widest text-[color:var(--graphite-soft)]">
                        {b.name}
                      </div>
                      <div className="text-[10px] text-[color:var(--graphite-faint)]">
                        {b.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 时间竖脊 */}
            <div className="relative">
              <div className="spine-line" style={{ right: 18 }} />
              {allTicks.map((tk) => (
                <div key={tk.y}>
                  <div
                    className="spine-tick"
                    style={{ top: tk.top, right: 18, width: 8 }}
                  />
                  <span
                    className="spine-year absolute text-[11px]"
                    style={{ top: tk.top - 7, right: 32 }}
                  >
                    {fmtYear(tk.y)}
                  </span>
                </div>
              ))}
            </div>

            {/* 地区列 */}
            {placedByRegion.map(({ region, items }) => (
              <div key={region.id} className="region-col relative px-3">
                {items.map(({ ev, top }) => {
                  const key = region.id + ":" + ev.y + ev.t;
                  const open = expanded.has(key);
                  return (
                    <div
                      key={key}
                      className="pencil-card absolute left-3 right-3"
                      style={{ top }}
                      onClick={() => toggle(key)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && toggle(key)}
                    >
                      <div
                        className="year-num text-[11px] font-semibold"
                        style={{ color: region.pigment }}
                      >
                        {fmtYear(ev.y)} 年
                      </div>
                      <div
                        className={
                          ev.star
                            ? "font-serif-cjk text-[14px] font-semibold leading-snug"
                            : "text-[13px] font-medium leading-snug"
                        }
                      >
                        {ev.star && "★ "}
                        {ev.t}
                      </div>
                      {open && (
                        <div className="mt-1 border-t border-dashed border-[color:var(--line)] pt-1 text-[12px] leading-relaxed text-[color:var(--graphite-soft)]">
                          {ev.d}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-10 text-xs leading-relaxed text-[color:var(--graphite-faint)]">
        时间轴为分段比例（越靠近现代越舒展），各地区列横向可滚动。中国列仅列关键坐标，详细分期见「中国卷」。
      </footer>
    </div>
  );
}
