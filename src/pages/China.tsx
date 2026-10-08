import { useMemo, useState } from "react";
import { Link } from "react-router";
import { CHINA_LANES, type CItem, type CLane } from "@/data/china";
import { ty, totalHeight, ticks, fmtYear, fmtShort, CHINA_BANDS } from "@/lib/chinaTime";

const GAP = 5;
const COL_W = 200;

/* 标题按可用宽度折行估算 */
function estLines(text: string, widthPx: number): number {
  const chars = Math.max(4, Math.floor((widthPx - 20) / 12.5));
  return Math.ceil(text.length / chars);
}

interface PlacedSpan {
  it: CItem;
  top: number;
  height: number;
  railTop: number; // 真实起点（不做防碰撞推移）
  railH: number; // 真实跨度
  leftPct: number;
  widthPct: number;
}
interface PlacedPoint {
  it: CItem;
  top: number;
  trueTop: number; // 真实年份位置
  h: number; // 估算高度
}

/* 区间条：重叠条目分到子轨；同簇等宽；全列统一纵向防碰撞 */
function packSpans(items: CItem[]): PlacedSpan[] {
  const sorted = [...items].sort((a, b) => a.s - b.s || a.e - b.e);
  interface P {
    it: CItem;
    track: number;
  }
  const clusters: P[][] = [];
  let cur: P[] = [];
  let curEnd = -Infinity;
  let ends: number[] = [];
  for (const it of sorted) {
    if (it.s >= curEnd && cur.length > 0) {
      clusters.push(cur);
      cur = [];
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
    cur.push({ it, track: t });
  }
  if (cur.length) clusters.push(cur);

  const out: PlacedSpan[] = [];
  /* 占用记录：按实际横向区间防碰撞（跨簇、不同分栏数都安全） */
  interface Occ {
    bottom: number;
    L: number;
    R: number;
  }
  const occ: Occ[] = [];
  for (const c of clusters) {
    const k = Math.max(...c.map((x) => x.track)) + 1;
    const wPx = (COL_W - 16) / k;
    for (const { it, track } of c) {
      const want = ty(it.s);
      const spanH = ty(it.e) - want;
      const showYear = spanH >= 56;
      const est = 10 + estLines(it.n, wPx) * 16 + (showYear ? 13 : 0) + 6;
      const h = Math.max(spanH, est);
      const L = track / k;
      const R = L + 1 / k;
      let prev = -Infinity;
      for (const o of occ) {
        if (o.L < R - 0.001 && L < o.R - 0.001 && o.bottom > prev) prev = o.bottom;
      }
      const top = Math.max(want, prev + GAP);
      occ.push({ bottom: top + h, L, R });
      out.push({
        it,
        top,
        height: h,
        railTop: want,
        railH: Math.max(spanH, 2),
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
    const trueTop = ty(it.s);
    const top = Math.max(trueTop, cursor + GAP);
    const h = 14 + 13 + estLines(it.n, COL_W - 16) * 16 + 6;
    cursor = top + h;
    return { it, top, trueTop, h };
  });
}

interface Sel {
  it: CItem;
  lane: CLane;
}

export default function China() {
  const H = totalHeight();
  const [sel, setSel] = useState<Sel | null>(null);
  const lanes = useMemo(
    () =>
      CHINA_LANES.map((lane) => ({
        lane,
        spans: lane.kind === "span" ? packSpans(lane.items) : null,
        points: lane.kind === "point" ? packPoints(lane.items) : null,
      })),
    []
  );
  /* 板体高度需容纳被下推的卡片（如近现代密集事件） */
  const boardH = useMemo(() => {
    let m = H + 40;
    for (const l of lanes) {
      for (const p of l.spans ?? []) m = Math.max(m, p.top + p.height + 30);
      for (const p of l.points ?? []) m = Math.max(m, p.top + p.h + 30);
    }
    return m;
  }, [lanes, H]);
  const allTicks = useMemo(() => ticks(), []);
  const GRID = `64px 28px repeat(${CHINA_LANES.length}, 1fr)`;

  const duration = (it: CItem) => {
    if (it.s === it.e) return null;
    const y = it.e - it.s;
    return y >= 10000 ? `约 ${Math.round(y / 1000) / 10} 万年` : `约 ${y} 年`;
  };

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
          <span className="font-medium underline decoration-2 underline-offset-4">
            中国卷
          </span>
          <Link
            to="/world"
            className="text-[color:var(--graphite-soft)] underline-offset-4 hover:underline"
          >
            世界卷
          </Link>
          <Link
            to="/methods"
            className="text-[color:var(--graphite-soft)] underline-offset-4 hover:underline"
          >
            方法卷
          </Link>
        </nav>
        <span className="ml-auto hidden text-xs text-[color:var(--graphite-faint)] sm:block">
          竖版 · 五种分期体系对照 · 点击条目看详细解说
        </span>
      </header>
      <hr className="pencil-rule mx-auto max-w-[1400px]" />

      <main className="mx-auto max-w-[1400px] overflow-x-auto px-3 pb-24 pt-4">
        <div style={{ minWidth: 92 + CHINA_LANES.length * COL_W + "px" }}>
          {/* 列头（吸顶） */}
          <div
            className="sticky top-0 z-30 grid border-b-2 border-[color:var(--graphite)]"
            style={{ gridTemplateColumns: GRID }}
          >
            <div className="bg-[color:var(--paper)]" />
            <div className="bg-[color:var(--paper)]" />
            {CHINA_LANES.map((l) => (
              <div key={l.id} className="bg-[color:var(--paper)] px-3 pb-2 pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-[3px] border border-[color:var(--graphite)]"
                    style={{ background: l.pigment }}
                  />
                  <span className="font-serif-cjk text-base font-semibold">
                    {l.name}
                  </span>
                </div>
                <div className="pl-5 text-[10px] text-[color:var(--graphite-faint)]">
                  {l.items.length} 条
                </div>
              </div>
            ))}
          </div>

          {/* 板体 */}
          <div className="relative grid" style={{ gridTemplateColumns: GRID, height: boardH }}>
            {/* 时代横带 */}
            <div className="pointer-events-none absolute inset-0 z-0">
              {CHINA_BANDS.map((b) => (
                <div
                  key={b.name}
                  className="hatch-band absolute left-0 right-0"
                  style={{ top: ty(b.from), height: ty(b.to) - ty(b.from) }}
                />
              ))}
            </div>

            {/* 时间竖脊 */}
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
                      {fmtShort(tk.y)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 时代竖轨 */}
            <div className="sticky z-20 bg-[color:var(--paper)]" style={{ left: 64 }}>
              <div className="relative h-full border-r border-dashed border-[color:var(--line)]">
                {CHINA_BANDS.map((b) => (
                  <div
                    key={b.name}
                    className="band-rail-text absolute left-0 right-0 flex items-center justify-center"
                    style={{ top: ty(b.from), height: ty(b.to) - ty(b.from) }}
                    title={`${b.name} · ${b.sub}`}
                  >
                    <span>{b.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 五列 */}
            {lanes.map(({ lane, spans, points }) => (
              <div key={lane.id} className="region-col relative z-10 px-2">
                {spans?.map((p) => {
                  const key = lane.id + ":" + p.it.n;
                  const active = sel?.it === p.it;
                  const tall = p.height >= 56;
                  return (
                    <div key={key}>
                      {/* 真实年代色条：钉在精确起讫点，不做推移 */}
                      <div
                        className="true-rail"
                        style={{
                          top: p.railTop,
                          height: p.railH,
                          left: `calc(${p.leftPct}% - 1px)`,
                          background: lane.pigment,
                        }}
                      />
                      <div
                        className={"pencil-card absolute overflow-hidden" + (active ? " is-active" : "")}
                        style={{
                          top: p.top,
                          height: p.height,
                          left: `calc(${p.leftPct}% + 5px)`,
                          width: `calc(${p.widthPct}% - 7px)`,
                          background: `color-mix(in srgb, ${lane.pigment} ${tall ? 7 : 13}%, rgba(255,255,255,0.55))`,
                        }}
                        onClick={() => setSel(active ? null : { it: p.it, lane })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setSel({ it: p.it, lane })}
                      >
                        <div className="text-[12px] font-medium leading-tight">
                          {p.it.n}
                        </div>
                        {tall && (
                          <div className="year-num text-[10px]" style={{ color: lane.pigment }}>
                            {fmtShort(p.it.s)} — {fmtShort(p.it.e)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {points?.map((p) => {
                  const key = lane.id + ":" + p.it.n;
                  const active = sel?.it === p.it;
                  const drift = p.top - p.trueTop;
                  return (
                    <div key={key}>
                      {/* 时间钉：标记真实年份位置 */}
                      <div
                        className="true-dot"
                        style={{ top: p.trueTop - 3, left: 0, background: lane.pigment }}
                      />
                      {drift > 5 && (
                        <div
                          className="true-link"
                          style={{ top: p.trueTop + 4, height: drift - 5 }}
                        />
                      )}
                      <div
                        className={"pencil-card absolute left-2 right-2" + (active ? " is-active" : "")}
                        style={{ top: p.top }}
                        onClick={() => setSel(active ? null : { it: p.it, lane })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setSel({ it: p.it, lane })}
                      >
                        <div className="year-num text-[11px] font-semibold" style={{ color: lane.pigment }}>
                          {fmtYear(p.it.s)} 年
                        </div>
                        <div className="text-[12px] font-medium leading-tight">
                          {p.it.n}
                        </div>
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
        年代依据夏商周断代工程（2000）、中华文明探源工程及公开碳十四测年数据；标「存争议」者学界尚无定论。
        并立的政权与体系（如东晋/十六国、辽/宋/西夏/金）在同一列内自动分栏。条目左侧的彩色细条钉在真实起讫年份上；
        标签框为避免文字重叠可能略向下偏移，偏移处以细线连回真实位置。
      </footer>

      {/* 悬浮详情框 */}
      {sel && (
        <aside className="detail-float" role="dialog" aria-label="条目详情">
          <button
            className="detail-close"
            aria-label="关闭"
            onClick={() => setSel(null)}
          >
            ×
          </button>
          <div className="flex items-center gap-2 text-[11px] tracking-widest" style={{ color: sel.lane.pigment }}>
            <span
              className="inline-block h-2.5 w-2.5 rounded-[2px] border border-[color:var(--graphite)]"
              style={{ background: sel.lane.pigment }}
            />
            {sel.lane.name}
            {duration(sel.it) && (
              <span className="text-[color:var(--graphite-faint)]">· {duration(sel.it)}</span>
            )}
          </div>
          <div className="font-serif-cjk mt-1.5 text-lg font-semibold leading-snug">
            {sel.it.n}
          </div>
          <div className="year-num mt-1 text-[12px]" style={{ color: sel.lane.pigment }}>
            {fmtYear(sel.it.s)}
            {sel.it.e !== sel.it.s && ` — ${fmtYear(sel.it.e)}`}
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">
            {sel.it.d}
          </p>
          {sel.it.note && (
            <div className="mt-2 inline-block rounded border border-[#b06a4f] px-1.5 py-0.5 text-[11px] text-[#b06a4f]">
              ⚠ {sel.it.note}
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
