import { useMemo, useState } from "react";
import { REGIONS, BANDS, GLOBAL_EVENTS, type WEvent, type Region } from "@/data/world";
import { ty, totalHeight, ticks, fmtYear } from "@/lib/time";
import { packPointsTracked } from "@/lib/pack";
import { pointTracksFor } from "@/lib/pack";
import { SiteNav } from "@/components/SiteNav";
import { useTitle } from "@/lib/useTitle";

const COL_W = 210;

/** 跨地区事件横贯线使用的虚拟"地区" */
const GLOBAL_META: Region = {
  id: "global",
  name: "跨地区 · 全球",
  en: "Global",
  pigment: "#8a5a48",
  events: [],
};

/* 世界事件按节点卡布局：时间钉在真实位置，标签卡双股道防碰撞下推 */
type EvItem = WEvent & { n: string; s: number; e: number };
function layoutEvents(events: WEvent[], colW: number) {
  const items: EvItem[] = events.map((ev) => ({ ...ev, n: ev.t, s: ev.y, e: ev.y }));
  return packPointsTracked(items, ty, colW, pointTracksFor(events.length)).map((p) => ({
    ev: p.it,
    top: p.top,
    h: p.h,
    trueTop: p.trueTop,
    track: p.track,
    trackCount: p.trackCount,
  }));
}

interface Sel {
  ev: WEvent;
  region: Region;
}

export default function World() {
  useTitle("世界卷 · 历史图集");
  const H = totalHeight();
  const [sel, setSel] = useState<Sel | null>(null);
  // 每列折叠状态：默认纲要（major/star），可逐列展开全部
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const allOpen = REGIONS.every((r) => open[r.id]);
  // 展开的列在网格中占 1.45fr；按最小容器宽 1352 估算每列实际像素宽（保守，宁可高估卡高）
  const OPEN_RATIO = 1.45;
  const weights = REGIONS.map((r) => (open[r.id] ? OPEN_RATIO : 1));
  const totalW = weights.reduce((a, b) => a + b, 0);
  const placedByRegion = useMemo(
    () =>
      REGIONS.map((r, i) => {
        const visible = open[r.id]
          ? r.events
          : r.events.filter((ev) => ev.major || ev.star);
        const estW = Math.round(((92 + REGIONS.length * COL_W - 92) * weights[i]) / totalW);
        return {
          region: r,
          items: layoutEvents(visible, estW),
          total: r.events.length,
        };
      }),
    [open, weights, totalW]
  );
  const allTicks = useMemo(() => ticks(), []);
  // 跨地区横贯线标签：真实年份位置 + 最小间距下推
  const globalChips = useMemo(() => {
    let last = -Infinity;
    return [...GLOBAL_EVENTS]
      .sort((a, b) => a.y - b.y)
      .map((g) => {
        const top = Math.max(ty(g.y) - 9, last + 22);
        last = top;
        return { g, top, trueTop: ty(g.y) };
      });
  }, []);
  const boardH = useMemo(() => {
    let m = H + 40;
    for (const { items } of placedByRegion) {
      for (const p of items) m = Math.max(m, p.top + p.h + 30);
    }
    return m;
  }, [placedByRegion, H]);
  const GRID = `64px 28px ${weights.map((w) => (w > 1 ? `${OPEN_RATIO}fr` : "1fr")).join(" ")}`;

  return (
    <div className="min-h-screen">
      <SiteNav active="world" note="竖版 · 六地区对照 · 默认纲要视图，列头可展开全部" />
      <hr className="pencil-rule mx-auto max-w-[1400px]" />

      <main className="mx-auto max-w-[1400px] overflow-x-auto px-3 pb-24 pt-4">
        <div style={{ minWidth: 92 + REGIONS.length * COL_W + "px" }}>
          {/* 列头（吸顶） */}
          <div
            className="sticky top-0 z-30 grid border-b-2 border-[color:var(--graphite)]"
            style={{ gridTemplateColumns: GRID }}
          >
            <div className="bg-[color:var(--paper)]" />
            <div className="flex items-end justify-center bg-[color:var(--paper)] pb-1.5">
              <button
                className="rounded border border-[color:var(--line)] px-1.5 py-0.5 text-[10px] text-[color:var(--graphite-soft)] hover:border-[color:var(--graphite-soft)]"
                onClick={() =>
                  setOpen(allOpen ? {} : Object.fromEntries(REGIONS.map((r) => [r.id, true])))
                }
                title={allOpen ? "全部收起为纲要" : "展开所有地区列"}
              >
                {allOpen ? "全收" : "全展"}
              </button>
            </div>
            {placedByRegion.map(({ region: r, items, total }) => {
              const isOpen = !!open[r.id];
              return (
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
                  <div className="flex items-center justify-between pl-5">
                    <span className="text-[10px] italic text-[color:var(--graphite-faint)]">
                      {r.en}
                    </span>
                    <button
                      className="rounded border border-[color:var(--line)] px-1.5 py-0.5 text-[10px] not-italic text-[color:var(--graphite-soft)] hover:border-[color:var(--graphite-soft)]"
                      onClick={() => setOpen((o) => ({ ...o, [r.id]: !o[r.id] }))}
                      title={isOpen ? "收起为纲要视图" : `展开全部 ${total} 条`}
                    >
                      {isOpen ? `收起 ▾` : `${items.length}/${total} ▸`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 板体 */}
          <div className="relative grid" style={{ gridTemplateColumns: GRID, height: boardH }}>
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

            {/* 跨地区·全球性事件：横贯虚线 + 标签 */}
            <div
              className="pointer-events-none absolute z-[15]"
              style={{ left: 92, right: 0, top: 0, bottom: 0 }}
            >
              {globalChips.map(({ g, top, trueTop }) => (
                <div key={g.y + g.t}>
                  <div
                    className="absolute left-0 right-0 border-t border-dashed"
                    style={{ top: trueTop, borderColor: "rgba(138, 90, 72, 0.55)" }}
                  />
                  <button
                    className="pointer-events-auto absolute left-1 flex max-w-[46%] items-center gap-1.5 rounded-[3px] border bg-[color:var(--paper)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--graphite-soft)] shadow-sm hover:text-[color:var(--graphite)]"
                    style={{ top, borderColor: "rgba(138, 90, 72, 0.55)" }}
                    onClick={() => setSel({ ev: g, region: GLOBAL_META })}
                    title={`${g.t} · ${fmtYear(g.y)} 年`}
                  >
                    <span
                      className="inline-block h-2 w-2 shrink-0 rotate-45 border"
                      style={{ background: "#8a5a48", borderColor: "var(--graphite)" }}
                    />
                    <span className="year-num shrink-0">{fmtYear(g.y)}</span>
                    <span className="truncate">{g.t}</span>
                  </button>
                </div>
              ))}
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
                {items.map(({ ev, top, trueTop, track, trackCount }) => {
                  const key = region.id + ":" + ev.y + ev.t;
                  const active = sel?.ev === ev;
                  const drift = top - trueTop;
                  const lanePct = 100 / trackCount;
                  const trackLeft = `calc(${track * lanePct}% + ${track === 0 ? 0 : 3}px)`;
                  return (
                    <div key={key}>
                      {/* 时间钉：标记真实年份位置（随股道横移） */}
                      <div
                        className="true-dot"
                        style={{
                          top: trueTop - 3,
                          left: `calc(${track * lanePct}% - 2px)`,
                          background: region.pigment,
                        }}
                      />
                      {drift > 5 && (
                        <div
                          className="true-link"
                          style={{
                            top: trueTop + 4,
                            height: drift - 5,
                            left: `calc(${track * lanePct}% + 1px)`,
                          }}
                        />
                      )}
                      <div
                        className={"pencil-card absolute" + (active ? " is-active" : "")}
                        style={{ top, left: trackLeft, width: `calc(${lanePct}% - 6px)` }}
                        onClick={() => setSel(active ? null : { ev, region })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setSel({ ev, region })}
                        title={ev.t}
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
                            ? "font-serif-cjk text-[13px] font-semibold leading-snug"
                            : "text-[12px] font-medium leading-snug"
                        }
                      >
                        {ev.star && "★ "}
                        {ev.t}
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
        横带采用世界通史分期（上古 → 古典/轴心时代 → 中古 → 近代早期 → 近代 → 现当代），而非考古学分期——石
        器/青铜/铁器时代在全球不同步，不宜作统一标尺；该框架源于欧洲史学传统，用于其他地区学界亦有讨论，
        故横带采用主题式命名。时间轴为分段比例（越靠近现代越舒展）；年代以通行世界史年表为准，个别上古纪年各
        学说略有出入。默认为纲要视图（每列仅显示主线事件），点列头按钮可展开全部；棕色横贯虚线为跨地区/全球
        性事件。事件标题过长时省略显示，悬停可见全称，点击看详细解说与今址；左侧菱形钉标记真实年份位置，
        标签框为避免重叠可能略向下偏移，偏移处以细线连回真实位置。中国列仅列关键坐标，详见「中国卷」。
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
          {sel.ev.loc && (
            <div className="mt-1.5 flex items-baseline gap-1.5 text-[12px] text-[color:var(--graphite-faint)]">
              <span className="shrink-0 rounded-[3px] border border-[color:var(--line)] px-1 py-px text-[10px]">
                今址
              </span>
              {sel.ev.loc}
            </div>
          )}
          <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">
            {sel.ev.d}
          </p>
        </aside>
      )}
    </div>
  );
}
