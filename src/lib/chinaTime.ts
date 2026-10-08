// 中国卷竖版时间轴：分段线性映射（负数为公元前），时间从上往下流
// 刻度与中国卷横版一致：远古 / 新石器 / 夏商周 / 帝制 / 近现代
interface Seg {
  from: number;
  to: number;
  px: number; // 该段总像素
  tick: number;
}

const SEGS: Seg[] = [
  { from: -2000000, to: -12000, px: 660, tick: 400000 },
  { from: -12000, to: -2070, px: 780, tick: 2000 },
  { from: -2070, to: -221, px: 900, tick: 500 },
  { from: -221, to: 1912, px: 2080, tick: 400 },
  { from: 1912, to: 2027, px: 720, tick: 20 },
];

interface Span {
  from: number;
  to: number;
  y0: number;
  scale: number;
}

let spans: Span[] | null = null;
let TOTAL = 0;

function build(): Span[] {
  if (spans) return spans;
  let acc = 0;
  spans = SEGS.map((s) => {
    const scale = s.px / (s.to - s.from);
    const span = { from: s.from, to: s.to, y0: acc, scale };
    acc += s.px;
    return span;
  });
  TOTAL = acc;
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
  return TOTAL;
}

export function fmtYear(y: number): string {
  if (y <= -10000) {
    const v = -y / 10000;
    return `约${Math.round(v * 10) / 10}万年前`;
  }
  return y < 0 ? `前${-y}` : `${y}`;
}

export function fmtShort(y: number): string {
  if (y <= -10000) {
    const v = -y / 10000;
    return `${Math.round(v * 10) / 10}万年前`;
  }
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

export const CHINA_BANDS = [
  { from: -2000000, to: -12000, name: "远古", sub: "旧石器时代" },
  { from: -12000, to: -2070, name: "新石器", sub: "农业 · 村落 · 文明起源" },
  { from: -2070, to: -221, name: "夏商周", sub: "青铜与王朝" },
  { from: -221, to: 1912, name: "帝制时代", sub: "大一统与治乱循环" },
  { from: 1912, to: 2027, name: "近现代", sub: "共和 · 复兴" },
];
