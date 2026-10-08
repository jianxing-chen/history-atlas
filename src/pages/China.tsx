import { useMemo, useState } from "react";
import { Link } from "react-router";
import { CHINA_LANES, type CItem } from "@/data/china";
import { ty, totalHeight, ticks, fmtYear, fmtShort, CHINA_BANDS } from "@/lib/chinaTime";

const MIN_H = 30; // 区间条最小高度
const GAP = 5; // 同轨纵向最小间距
const POINT_GAP = 52; // 大事记卡片最小间距

interface PlacedSpan {
  it: CItem;
  top: number;
  height: number;
  leftPct: number;
  widthPct: number;
}
interface PlacedPoint {
  it: CItem;
  top: number;
}

/* 区间图着色：重叠的条目分到不同子轨，同一"重叠簇"内等宽 */
function packSpans(items: CItem[]): PlacedSpan[] {
  const sorted = [...items].sort((a, b) => a.s - b.s || a.e - b.e);
  interface P {
    it: CItem;
    track: number;
  }
  const clusters: { items: P[] }[] = [];
  let cur: { items: P[] } | null = null;
  let curEnd = -Infinity;
  let ends: number[] = [];
  for (const it of sorted) {
    if (!cur || it.s >= curEnd) {
      cur = { items: [] };
      clusters.push(cur);
      curEnd = it.e;
      ends = [];
    } else {
      curEnd = Math.max(curEnd, it.e);
    }
    let t = ends.findIndex((e) => it.s >= e);
    if (t < 0) {
      ends.push(it.e);
      t = ends.length - 1;
    } else {
      ends[t] = it.e;
    }
    cur.items.push({ it, track: t });
  }
  const out: PlacedSpan[] = [];
  for (const c of clusters) {
    const k = Math.max(...c.items.map((x) => x.track)) + 1;
    // 每个子轨独立做纵向防碰撞下推
    const byTrack = new Map<number, number>(); // track -> 当前已占到的底部
    for (const { it, track } of c.items
      .slice()
      .sort((a, b) => a.it.s - b.it.s)) {
      const want = ty(it.s);
      const h = Math.max(ty(it.e) - want, MIN_H);
      const prevBottom = byTrack.get(track) ?? -Infinity;
      const top = Math.max(want, prevBottom + GAP);
      byTrack.set(track, top + h);
      out.push({
        it,
        top,
        height: h,
        leftPct: (track / k) * 100,
        widthPct: 100 / k,
      });
    }
  }
  return out;
}

function packPoints(items: CItem[]): PlacedPoint[] {
  const sorted = [...items].sort((a, b) => a.s - b.s);
  let cursor = -Infinity;
  return sorted.map((it) => {
    const top = Math.max(ty(it.s), cursor + POINT_GAP);
    cursor = top;
    return { it, top };
  });
}

export default function China() {
  const H = totalHeight();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const lanes = useMemo(
    () =>
      CHINA_LANES.map((lane) => ({
        lane,
        spans: lane.kind === "span" ? packSpans(lane.items) : null,
        points: lane.kind === "point" ? packPoints(lane.items) : null,
      })),
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

  const descOf = (it: CItem, pigment: string, key: string) => {
    const open = expanded.has(key);
    return (
      <>
        {open && (
          <div className="mt-1 border-t border-dashed border-[color:var(--line)] pt-1 text-[12px] leading-relaxed text-[color:var(--graphite-soft)]">
            <span className="year-num" style={{ color: pigment }}>
              {fmtYear(it.s)}
              {it.e !== it.s && ` — ${fmtYear(it.e)}`}
            </span>
            <br />
            {it.d}
            {it.note && (
              <span className="mt-1 inline-block rounded border border-[#b06a4f] px-1 text-[11px] text-[#b06a4f]">
                ⚠ {it.note}
              </span>
            )}
          </div>
        )}
      </>
    );
  };

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
          <span className="font-medium underline decoration-2 underline-offset-4">
            中国卷
          </span>
          <Link
            to="/world"
            className="text-[color:var(--graphite-soft)] underline-offset-4 hover:underline"
          >
            世界卷
          </Link>
        </nav>
        <span className="ml-auto hidden text-xs text-[color:var(--graphite-faint)] sm:block">
          竖版 · 五种分期体系对照 · 点击条目展开说明
        </span>
      </header>
      <hr className="pencil-rule mx-auto max-w-6xl" />

      <main className="mx-auto max-w-6xl overflow-x-auto px-3 pb-16 pt-4">
        <div style={{ minWidth: 76 + CHINA_LANES.length * 200 + "px" }}>
          {/* 列头（吸顶） */}
          <div
            className="sticky top-0 z-20 grid border-b-2 border-[color:var(--graphite)] bg-[color:var(--paper)]"
            style={{ gridTemplateColumns: `76px repeat(${CHINA_LANES.length}, 1fr)` }}
          >
            <div />
            {CHINA_LANES.map((l) => (
              <div key={l.id} className="px-3 pb-2 pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-[3px] border border-[color:var(--graphite)]"
                    style={{ background: l.pigment }}
                  />
                  <span className="font-serif-cjk text-base font-semibold">
                    {l.name}
                  </span>
                </div>
                <div className="pl-5 text-[11px] text-[color:var(--graphite-faint)]">
                  {l.items.length} 条
                </div>
              </div>
            ))}
          </div>

          {/* 板体 */}
          <div
            className="relative grid"
            style={{
              gridTemplateColumns: `76px repeat(${CHINA_LANES.length}, 1fr)`,
              height: H + 40,
            }}
          >
            {/* 时代横带 */}
            <div className="pointer-events-none absolute inset-0">
              {CHINA_BANDS.map((b) => {
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
                    {fmtShort(tk.y)}
                  </span>
                </div>
              ))}
            </div>

            {/* 五列 */}
            {lanes.map(({ lane, spans, points }) => (
              <div key={lane.id} className="region-col relative px-2">
                {spans?.map((p) => {
                  const key = lane.id + ":" + p.it.n;
                  const tall = p.height >= 54;
                  return (
                    <div
                      key={key}
                      className="pencil-card absolute overflow-hidden"
                      style={{
                        top: p.top,
                        height: p.height,
                        left: `calc(${p.leftPct}% + 2px)`,
                        width: `calc(${p.widthPct}% - 4px)`,
                        background: `color-mix(in srgb, ${lane.pigment} ${tall ? 7 : 13}%, rgba(255,255,255,0.55))`,
                      }}
                      onClick={() => toggle(key)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && toggle(key)}
                    >
                      <div className="text-[12px] font-medium leading-tight">
                        {p.it.n}
                      </div>
                      {tall && (
                        <div className="year-num text-[10px]" style={{ color: lane.pigment }}>
                          {fmtShort(p.it.s)} — {fmtShort(p.it.e)}
                        </div>
                      )}
                      {descOf(p.it, lane.pigment, key)}
                    </div>
                  );
                })}
                {points?.map((p) => {
                  const key = lane.id + ":" + p.it.n;
                  return (
                    <div
                      key={key}
                      className="pencil-card absolute left-2 right-2"
                      style={{ top: p.top }}
                      onClick={() => toggle(key)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && toggle(key)}
                    >
                      <div className="year-num text-[11px] font-semibold" style={{ color: lane.pigment }}>
                        {fmtYear(p.it.s)} 年
                      </div>
                      <div className="text-[12px] font-medium leading-tight">
                        {p.it.n}
                      </div>
                      {descOf(p.it, lane.pigment, key)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-10 text-xs leading-relaxed text-[color:var(--graphite-faint)]">
        年代依据夏商周断代工程（2000）、中华文明探源工程及公开碳十四测年数据；标「存争议」者学界尚无定论。
        并立的政权与体系（如东晋/十六国、辽/宋/西夏/金）在同一列内自动分栏。
      </footer>
    </div>
  );
}
