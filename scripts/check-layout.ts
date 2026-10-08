// 布局回归校验：与页面共用 src/lib/pack.ts 的同一份布局实现
// 运行：npm run check:layout
import { CHINA_LANES } from "../src/data/china";
import { REGIONS } from "../src/data/world";
import { ty as chinaTy } from "../src/lib/chinaTime";
import { ty as worldTy } from "../src/lib/time";
import { packSpans, packPoints, countOverlaps } from "../src/lib/pack";

const CHINA_COL_W = 200;
const WORLD_COL_W = 210;

let failures = 0;
let checks = 0;

function fail(msg: string) {
  failures++;
  console.error("  ✗ " + msg);
}
function ok(msg: string) {
  console.log("  ✓ " + msg);
}

/* 中国卷：区间泳道 */
console.log("中国卷 · 区间泳道（考古/史学/朝代/遗址）");
for (const lane of CHINA_LANES.filter((l) => l.kind === "span")) {
  const placed = packSpans(lane.items, chinaTy, CHINA_COL_W);
  checks++;
  // 1. 色条钉在真实起点
  const badRail = placed.filter((p) => Math.abs(p.railTop - chinaTy(p.it.s)) > 0.01);
  if (badRail.length) fail(`${lane.name}: ${badRail.length} 个条目色条未对齐真实起点`);
  // 2. 卡片零重叠（把分栏百分比折算成像素做二维检测）
  const rects = placed.map((p) => ({
    x: (p.leftPct / 100) * CHINA_COL_W,
    y: p.top,
    w: (p.widthPct / 100) * CHINA_COL_W,
    h: p.height,
  }));
  const ov = countOverlaps(rects);
  if (ov) fail(`${lane.name}: 检测到 ${ov} 对卡片重叠`);
  if (!badRail.length && !ov) ok(`${lane.name}（${placed.length} 条）色条对齐、零重叠`);
}

/* 中国卷：大事记（节点） */
console.log("中国卷 · 大事记");
{
  const lane = CHINA_LANES.find((l) => l.kind === "point")!;
  const placed = packPoints(lane.items, chinaTy, CHINA_COL_W);
  checks++;
  const badDot = placed.filter((p) => Math.abs(p.trueTop - chinaTy(p.it.s)) > 0.01);
  if (badDot.length) fail(`大事记: ${badDot.length} 个时间钉未对齐真实年份`);
  const rects = placed.map((p) => ({ x: 0, y: p.top, w: CHINA_COL_W, h: p.h }));
  const ov = countOverlaps(rects);
  if (ov) fail(`大事记: 检测到 ${ov} 对标签重叠`);
  if (!badDot.length && !ov) ok(`大事记（${placed.length} 条）时间钉对齐、零重叠`);
}

/* 世界卷：六地区节点 */
console.log("世界卷 · 六地区");
for (const region of REGIONS) {
  const items = region.events.map((ev) => ({ ...ev, n: ev.t, s: ev.y, e: ev.y }));
  const placed = packPoints(items, worldTy, WORLD_COL_W);
  checks++;
  const badDot = placed.filter((p) => Math.abs(p.trueTop - worldTy(p.it.y)) > 0.01);
  if (badDot.length) fail(`${region.name}: ${badDot.length} 个时间钉未对齐真实年份`);
  const rects = placed.map((p) => ({ x: 0, y: p.top, w: WORLD_COL_W, h: p.h }));
  const ov = countOverlaps(rects);
  if (ov) fail(`${region.name}: 检测到 ${ov} 对卡片重叠`);
  if (!badDot.length && !ov) ok(`${region.name}（${placed.length} 条）时间钉对齐、零重叠`);
}

/* 数据卫生：年份合法、区间不倒置 */
console.log("数据卫生");
{
  let bad = 0;
  for (const lane of CHINA_LANES) {
    for (const it of lane.items) {
      if (it.e < it.s) {
        fail(`中国卷 ${lane.name}「${it.n}」结束年早于起始年`);
        bad++;
      }
      if (!it.d || it.d.length < 8) {
        fail(`中国卷 ${lane.name}「${it.n}」缺少解说`);
        bad++;
      }
    }
  }
  for (const r of REGIONS) {
    for (const ev of r.events) {
      if (!ev.d || ev.d.length < 8) {
        fail(`世界卷 ${r.name}「${ev.t}」缺少解说`);
        bad++;
      }
    }
  }
  checks++;
  if (!bad) ok("所有条目年份合法、解说齐全");
}

console.log(`\n共 ${checks} 组校验，${failures} 处失败`);
if (failures) process.exit(1);
console.log("布局校验全部通过 ✓");
