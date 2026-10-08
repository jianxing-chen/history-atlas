// 时间轴布局核心：页面与 scripts/check-layout.ts 共用同一份实现
// 任何修改都会同时影响渲染与校验，防止两套逻辑漂移

export interface SpanItem {
  n: string;
  s: number;
  e: number;
}

export interface PlacedSpan<T extends SpanItem = SpanItem> {
  it: T;
  top: number;
  height: number;
  railTop: number; // 真实起点（不做防碰撞推移）
  railH: number; // 真实跨度
  leftPct: number;
  widthPct: number;
}

export interface PlacedPoint<T extends SpanItem = SpanItem> {
  it: T;
  top: number;
  trueTop: number;
  h: number;
}

export const GAP = 5;

/* 标题按可用宽度折行估算（CJK 按 12.5px/字） */
export function estLines(text: string, widthPx: number): number {
  const chars = Math.max(4, Math.floor((widthPx - 20) / 12.5));
  return Math.ceil(text.length / chars);
}

/* 区间条：重叠条目分入子轨；占用记录按实际横向区间防碰撞（跨簇安全） */
export function packSpans<T extends SpanItem>(
  items: T[],
  ty: (year: number) => number,
  colW: number
): PlacedSpan<T>[] {
  const sorted = [...items].sort((a, b) => a.s - b.s || a.e - b.e);
  interface P {
    it: T;
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

  const out: PlacedSpan<T>[] = [];
  interface Occ {
    bottom: number;
    L: number;
    R: number;
  }
  const occ: Occ[] = [];
  for (const c of clusters) {
    const k = Math.max(...c.map((x) => x.track)) + 1;
    const wPx = (colW - 16) / k;
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

/* 节点卡：时间钉在真实位置，标签卡只做纵向防碰撞下推 */
export function packPoints<T extends SpanItem>(
  items: T[],
  ty: (year: number) => number,
  colW: number
): PlacedPoint<T>[] {
  const sorted = [...items].sort((a, b) => a.s - b.s);
  let cursor = -Infinity;
  return sorted.map((it) => {
    const trueTop = ty(it.s);
    const top = Math.max(trueTop, cursor + GAP);
    const h = 14 + 13 + estLines(it.n, colW - 16) * 16 + 6;
    cursor = top + h;
    return { it, top, trueTop, h };
  });
}

/* 校验辅助：二维重叠对数（供页面与脚本共用） */
export function countOverlaps(
  rects: { x: number; y: number; w: number; h: number }[]
): number {
  let n = 0;
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i];
      const b = rects[j];
      if (a.x < b.x + b.w - 2 && b.x < a.x + a.w - 2 && a.y < b.y + b.h - 2 && b.y < a.y + a.h - 2) n++;
    }
  }
  return n;
}
