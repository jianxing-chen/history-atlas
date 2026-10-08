import { useMemo, useState } from "react";
import { Link } from "react-router";
import { REGIONS, BANDS, type WEvent, type Region } from "@/data/world";
import { ty, totalHeight, ticks, fmtYear } from "@/lib/time";

/* 按估算高度做纵向防碰撞（标题按列宽折行估算） */
function estHeight(ev: WEvent, colW: number): number {
  const chars = Math.max(6, Math.floor((colW - 26) / 13));
  const lines = Math.ceil(ev.t.length / chars);
  return 16 + 14 + lines * 17 + 6;
}
const COL_W = 210;

interface Placed {
  ev: WEvent;
  top: number;
  h: number;
}

function layoutEvents(events: WEvent[]): Placed[] {
  const sorted = [...events].sort((a, b) => a.y - b.y);
  let cursor = -Infinity;
  return sorted.map((ev) => {
    const want = ty(ev.y);
    const top = Math.max(want, cursor + 6);
    const h = estHeight(ev, COL_W);
    cursor = top + h;
    return { ev, top, h };
  });
}

interface Sel {
  ev: WEvent;
  region: Region;
}

export default function World() {
  const H = totalHeight();
  const [sel, setSel] = useState<Sel | null>(null);
  const placedByRegion = useMemo(
    () => REGIONS.map((r) => ({ region: r, items: layoutEvents(r.events) })),
    []
  );
  const allTicks = useMemo(() => ticks(), []);
  const GRID = `64px 28px repeat(${REGIONS.length}, 1fr)`;

  return (
    <div className="min-h-screen">
      {/* 站点导航 */}
      <header className="mx-auto flex max-w-[1400px] items-baseline gap-5 px-5 pb-3 pt-6">
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
          <Link
            to="/china"
            className="text-[color:var(--graphite-soft)] underline-offset-4 hover:underline"
          >
            中国卷
          </Link>
          <span className="font-medium underline decoration-2 underline-offset-4">
            世界卷
          </span>
          <Link
            to="/methods"
            className="text-[color:var(--graphite-soft)] underline-offset-4 hover:underline"
          >
            方法卷
          </Link>
        </nav>
        <span className="ml-auto hidden text-xs text-[color:var(--graphite-faint)] sm:block">
          竖版 · 六地区对照 · 点击事件看详细解说
        </span>
      </header>
      <hr className="pencil-rule mx-auto max-w-[1400px]" />

      <main className="mx-auto max-w-[1400px] overflow-x-auto px-3 pb-24 pt-4">
        <div style={{ minWidth: 92 + REGIONS.length * COL_W + "px" }}>
          {/* 列头（吸顶） */}
          <div
            className="sticky top-0 z-30 grid border-b-2 border-[color:var(--graphite)]"
            style={{ gridTemplateColumns: GRID }}
          >
            <div className="bg-[color:var(--paper)]" />
            <div className="bg-[color:var(--paper)]" />
            {REGIONS.map((r) => (
              <div key={r.id} className="bg-[color:var(--paper)] px-3 pb-2 pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-[3px] border border-[color:var(--graphite)]"
                    style={{ background: r.pigment }}
                  />
                  <span className="font-serif-cjk text-base font-semibold">
                    {r.name}
                  </span>
                </div>
                <div className="pl-5 text-[10px] italic text-[color:var(--graphite-faint)]">
                  {r.en}
                </div>
              </div>
            ))}
          </div>

          {/* 板体 */}
          <div className="relative grid" style={{ gridTemplateColumns: GRID, height: H + 40 }}>
            {/* 时代横带（贯穿全宽） */}
            <div className="pointer-events-none absolute inset-0 z-0">
              {BANDS.map((b) => {
                const top = ty(b.from);
                const bottom = ty(b.to);
                return (
                  <div
                    key={b.name}
                    className="hatch-band absolute left-0 right-0"
                    style={{ top, height: bottom - top }}
                  />
                );
              })}
            </div>

            {/* 时间竖脊（横向滚动时吸附） */}
            <div className="sticky left-0 z-20 bg-[color:var(--paper)]">
              <div className="relative h-full">
                <div className="spine-line" style={{ right: 14 }} />
                {allTicks.map((tk) => (
                  <div key={tk.y}>
                    <div className="spine-tick" style={{ top: tk.top, right: 14, width: 7 }} />
                    <span
                      className="spine-year absolute whitespace-nowrap text-[10px]"
                      style={{ top: Math.max(tk.top - 6, 3), right: 26 }}
                    >
                      {fmtYear(tk.y)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 时代竖轨：竖排时代名 */}
            <div className="sticky z-20 bg-[color:var(--paper)]" style={{ left: 64 }}>
              <div className="relative h-full border-r border-dashed border-[color:var(--line)]">
                {BANDS.map((b) => {
                  const top = ty(b.from);
                  const bottom = ty(b.to);
                  return (
                    <div
                      key={b.name}
                      className="band-rail-text absolute left-0 right-0 flex items-center justify-center"
                      style={{ top, height: bottom - top }}
                      title={`${b.name} · ${b.sub}`}
                    >
                      <span>{b.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 地区列 */}
            {placedByRegion.map(({ region, items }) => (
              <div key={region.id} className="region-col relative z-10 px-2">
                {items.map(({ ev, top }) => {
                  const key = region.id + ":" + ev.y + ev.t;
                  const active = sel?.ev === ev;
                  return (
                    <div
                      key={key}
                      className={"pencil-card absolute left-2 right-2" + (active ? " is-active" : "")}
                      style={{ top }}
                      onClick={() => setSel(active ? null : { ev, region })}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSel({ ev, region })}
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
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-[1400px] px-5 pb-10 text-xs leading-relaxed text-[color:var(--graphite-faint)]">
        横带采用世界通史分期（上古 → 古典/轴心时代 → 中古 → 近代早期 → 近代 → 现当代），而非考古学分期——石
        器/青铜/铁器时代在全球不同步，不宜作统一标尺；该框架源于欧洲史学传统，用于其他地区学界亦有讨论，
        故横带采用主题式命名。时间轴为分段比例（越靠近现代越舒展）；年代以通行世界史年表为准，个别上古纪年各
        学说略有出入。中国列仅列关键坐标，详见「中国卷」。
      </footer>

      {/* 悬浮详情框 */}
      {sel && (
        <aside className="detail-float" role="dialog" aria-label="事件详情">
          <button
            className="detail-close"
            aria-label="关闭"
            onClick={() => setSel(null)}
          >
            ×
          </button>
          <div className="flex items-center gap-2 text-[11px] tracking-widest" style={{ color: sel.region.pigment }}>
            <span
              className="inline-block h-2.5 w-2.5 rounded-[2px] border border-[color:var(--graphite)]"
              style={{ background: sel.region.pigment }}
            />
            {sel.region.name} · {fmtYear(sel.ev.y)} 年
          </div>
          <div className="font-serif-cjk mt-1.5 text-lg font-semibold leading-snug">
            {sel.ev.star && "★ "}
            {sel.ev.t}
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">
            {sel.ev.d}
          </p>
        </aside>
      )}
    </div>
  );
}
