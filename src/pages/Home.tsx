import { Link } from "react-router";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-5 pb-16 pt-14">
      {/* 题签 */}
      <div className="text-center">
        <div className="mb-3 text-xs tracking-[0.5em] text-[color:var(--graphite-faint)]">
          ATLAS OF HISTORY
        </div>
        <h1 className="font-serif-cjk text-5xl font-semibold tracking-[0.15em]">
          历史图集
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[color:var(--graphite-soft)]">
          把时间画成纸上的长卷：考古学分期、史学分期、朝代、遗址与大事，
          在五条泳道或五根地区列上彼此对齐——看清每一段历史在哪个坐标上。
        </p>
      </div>

      <hr className="pencil-rule mx-auto mt-10 w-56" />

      {/* 两卷 */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <a
          href="./china-timeline.html"
          target="_blank"
          rel="noreferrer"
          className="volume-card block p-6 no-underline"
        >
          <div className="text-xs tracking-widest text-[#b4574a]">卷一 · 横版五泳道</div>
          <div className="font-serif-cjk mt-2 text-3xl font-semibold text-[color:var(--graphite)]">
            中国卷
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">
            从泥河湾、元谋人到今天：考古学时代 / 史学划分 / 朝代更迭 / 遗址文化 / 大事记
            五条泳道并排，五种分期体系互相对照。可缩放、可跳转、可点开详情。
          </p>
          <div className="mt-4 text-xs text-[color:var(--graphite-faint)]">
            旧石器时代 — 今 · 160+ 条目 ↗
          </div>
        </a>

        <Link to="/world" className="volume-card block p-6 no-underline">
          <div className="text-xs tracking-widest text-[#4a6d9c]">卷二 · 竖版五地区</div>
          <div className="font-serif-cjk mt-2 text-3xl font-semibold text-[color:var(--graphite)]">
            世界卷
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">
            时间竖直流下，中国 / 两河·埃及 / 印度 / 欧洲 / 美洲·非洲 五列并排：
            二里头与汉谟拉比、秦统一与亚历山大、郑和与哥伦布，一眼对齐。
          </p>
          <div className="mt-4 text-xs text-[color:var(--graphite-faint)]">
            前 3500 — 今 · 80+ 节点 →
          </div>
        </Link>
      </div>

      {/* 分期说明 */}
      <div className="hatch-band-strong mt-14 rounded p-5">
        <div className="font-serif-cjk text-sm font-semibold tracking-widest text-[color:var(--graphite-soft)]">
          这套图集如何划分历史
        </div>
        <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">
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
