import { Link } from "react-router";
import { useTitle } from "@/lib/useTitle";
import { Seal } from "@/components/Seal";

const VOLUMES = [
  {
    no: "卷一",
    name: "中国卷",
    en: "CHINA",
    to: "/china",
    pigment: "#b4574a",
    desc: "从泥河湾、元谋人到今天：考古学时代 / 史学划分 / 朝代更迭 / 遗址文化 / 大事记，五种分期体系在五条泳道上互相对齐。",
    meta: "约 200 万年前 — 今 · 136 条目",
  },
  {
    no: "卷二",
    name: "世界卷",
    en: "WORLD",
    to: "/world",
    pigment: "#4a6d9c",
    desc: "中国 / 两河·埃及·中东 / 印度 / 欧洲 / 东亚·东南亚 / 美洲·非洲六列并排：二里头与汉谟拉比、秦统一与亚历山大、郑和与哥伦布，一眼对齐。",
    meta: "前 3500 — 今 · 160+ 节点 · 纲要/全部可切换",
  },
  {
    no: "卷三",
    name: "方法卷",
    en: "METHODS",
    to: "/methods",
    pigment: "#7d6b8a",
    desc: "同一条时间，六把尺：考古学 / 文献 / 王朝 / 社会形态 / 东洋史 / 全球史——六种分期方法各自的适用边界与争议。",
    meta: "方法论 · 6 把分期尺对照",
  },
];

export default function Home() {
  useTitle("历史图集 · 纸上长卷里的中国与世界");
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-5 pb-16">
      {/* ===== 扉页 ===== */}
      <section className="grid gap-10 pt-14 md:grid-cols-[auto_auto_1fr] md:gap-14">
        {/* 竖排题名 + 印章 */}
        <div className="flex items-start gap-5 md:gap-4">
          <h1
            className="font-serif-cjk text-6xl font-semibold leading-none tracking-[0.18em] text-[color:var(--graphite)] md:text-7xl"
            style={{ writingMode: "vertical-rl" }}
          >
            历史图集
          </h1>
          <div className="flex flex-col items-center gap-3 pt-1">
            <Seal size={30} />
            <span
              className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--graphite-faint)]"
              style={{ writingMode: "vertical-rl" }}
            >
              Atlas of History
            </span>
          </div>
        </div>

        {/* 时间脊线：一根竖线，三颗钉，钉即三卷 */}
        <div className="relative hidden h-[360px] w-44 md:block" aria-hidden={false}>
          <div className="absolute bottom-2 left-[13px] top-2 w-px bg-[color:var(--graphite)] opacity-70" />
          {VOLUMES.map((v, i) => (
            <Link
              key={v.to}
              to={v.to}
              className="group absolute left-0 flex items-center gap-3 no-underline"
              style={{ top: `${12 + i * 36}%` }}
              title={`进入${v.name}`}
            >
              <span
                className="inline-block h-3.5 w-3.5 rotate-45 rounded-[2px] border border-[color:var(--graphite)] transition-transform group-hover:scale-125"
                style={{ background: v.pigment }}
              />
              <span className="leading-tight">
                <span className="block text-[10px] tracking-[0.25em] text-[color:var(--graphite-faint)]">
                  {v.no}
                </span>
                <span className="font-serif-cjk block text-lg font-semibold text-[color:var(--graphite)] group-hover:underline group-hover:underline-offset-4">
                  {v.name}
                </span>
              </span>
            </Link>
          ))}
          <span className="absolute bottom-0 left-6 text-[10px] italic text-[color:var(--graphite-faint)]">
            时间向下流
          </span>
        </div>

        {/* 引言 */}
        <div className="max-w-xl self-center">
          <p className="text-[15px] leading-loose text-[color:var(--graphite-soft)]">
            这是一册画在纸上的时间：考古学分期、史学分期、朝代、遗址与大事，
            被放在同一根竖直的时间脊上彼此对齐——
            看清每一段历史站在哪个坐标，也看清不同的分期方法如何各说各话。
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[color:var(--graphite-faint)]">
            <span>三卷 · 300+ 条目</span>
            <span>点击条目看详细解说与今址</span>
            <span>争议与异说之处均有标注</span>
          </div>
        </div>
      </section>

      <hr className="pencil-rule mx-auto mt-12 w-full" />

      {/* ===== 三卷题签 ===== */}
      <section className="mt-10 space-y-5">
        {VOLUMES.map((v) => (
          <Link
            key={v.to}
            to={v.to}
            className="volume-card group flex overflow-hidden no-underline"
          >
            {/* 题签：线装书标签 */}
            <div
              className="flex w-14 shrink-0 flex-col items-center justify-between border-r border-[color:var(--graphite)] py-4"
              style={{ background: `color-mix(in srgb, ${v.pigment} 16%, var(--paper))` }}
            >
              <span
                className="font-serif-cjk text-lg font-semibold tracking-[0.3em]"
                style={{ writingMode: "vertical-rl", color: v.pigment }}
              >
                {v.name}
              </span>
              <span
                className="text-[9px] tracking-[0.2em] text-[color:var(--graphite-faint)]"
                style={{ writingMode: "vertical-rl" }}
              >
                {v.no}
              </span>
            </div>
            <div className="flex-1 p-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--graphite-faint)]">
                  {v.en}
                </span>
                <span className="text-xs text-[color:var(--graphite-faint)]">{v.meta}</span>
                <span className="ml-auto text-sm text-[color:var(--graphite-soft)] transition-transform group-hover:translate-x-1">
                  开卷 →
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">
                {v.desc}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* ===== 分期说明 ===== */}
      <div className="hatch-band-strong mt-14 rounded p-5">
        <div className="font-serif-cjk text-sm font-semibold tracking-widest text-[color:var(--graphite-soft)]">
          这套图集如何划分历史
        </div>
        <ul className="mt-3 grid gap-x-8 gap-y-2 text-[13px] leading-relaxed text-[color:var(--graphite-soft)] sm:grid-cols-2">
          <li>
            <b className="font-medium text-[color:var(--graphite)]">考古学分期</b>
            ：按生产工具——旧石器 → 新石器 → 铜石并用 → 青铜 → 铁器时代，适合史前。
          </li>
          <li>
            <b className="font-medium text-[color:var(--graphite)]">文献·史学分期</b>
            ：传说时代 / 信史时代、五种社会形态说、近代史 / 现代史等，各套说法并列对照。
          </li>
          <li>
            <b className="font-medium text-[color:var(--graphite)]">朝代与政权</b>
            ：有文字之后最细的刻度，并立政权（辽宋西夏金等）分行排列。
          </li>
          <li>
            <b className="font-medium text-[color:var(--graphite)]">地区对照</b>
            ：世界卷按文明区域分列，用同一根时间竖脊横向对齐。
          </li>
        </ul>
      </div>

      <footer className="mt-auto pt-14 text-center text-xs text-[color:var(--graphite-faint)]">
        年代依据夏商周断代工程、中华文明探源工程及通行世界史年表 · 争议处已标注
      </footer>
    </div>
  );
}
