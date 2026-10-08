// 竖版时间轴：分段线性映射（负数为公元前），时间从上往下流
export interface Seg {
  from: number;
  to: number;
  pxPerYear: number;
  tick: number;
}

export const SEGS: Seg[] = [
  { from: -3500, to: -1500, pxPerYear: 0.1, tick: 500 },
  { from: -1500, to: -500, pxPerYear: 0.22, tick: 250 },
  { from: -500, to: 500, pxPerYear: 0.5, tick: 250 },
  { from: 500, to: 1500, pxPerYear: 0.45, tick: 250 },
  { from: 1500, to: 1800, pxPerYear: 0.8, tick: 100 },
  { from: 1800, to: 1945, pxPerYear: 1.8, tick: 50 },
  { from: 1945, to: 2027, pxPerYear: 3.2, tick: 20 },
];

interface Span {
  from: number;
  to: number;
  y0: number;
  scale: number;
}

let spans: Span[] | null = null;
export let TOTAL_H = 0;

function build(): Span[] {
  if (spans) return spans;
  let acc = 0;
  spans = SEGS.map((s) => {
    const h = (s.to - s.from) * s.pxPerYear;
    const span = { from: s.from, to: s.to, y0: acc, scale: s.pxPerYear };
    acc += h;
    return span;
  });
  TOTAL_H = acc;
  return spans;
}

export function ty(year: number): number {
  const ss = build();
  for (const m of ss) {
    if (year <= m.to) return m.y0 + (year - m.from) * m.scale;
  }
  const last = ss[ss.length - 1];
  return last.y0 + (year - last.from) * last.scale;
}

export function totalHeight(): number {
  build();
  return TOTAL_H;
}

export function fmtYear(y: number): string {
  return y < 0 ? `前${-y}` : `${y}`;
}

export interface Tick {
  y: number;
  top: number;
}

export function ticks(): Tick[] {
  const out: Tick[] = [];
  for (const s of SEGS) {
    const start = Math.ceil(s.from / s.tick) * s.tick;
    for (let y = start; y < s.to; y += s.tick) {
      out.push({ y, top: ty(y) });
    }
  }
  return out;
}
