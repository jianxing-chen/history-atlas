import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ty, totalHeight, fmtShort } from "@/lib/chinaTime";

interface Slice {
  n: string;
  s: number;
  e: number;
}
interface Method {
  id: string;
  name: string;
  essence: string; // 一句话本质
  pigment: string;
  slices: Slice[];
  basis: string; // 依据什么切
  goodFor: string; // 何时好用
  limits: string; // 边界与争议
}

const METHODS: Method[] = [
  {
    id: "archaeology",
    name: "考古学分期",
    essence: "以生产工具的材质为尺",
    pigment: "#4a6d9c",
    slices: [
      { n: "石器时代", s: -2000000, e: -1750 },
      { n: "青铜时代", s: -1750, e: -500 },
      { n: "铁器时代", s: -500, e: 2027 },
    ],
    basis:
      "1836年丹麦学者汤姆森据博物馆藏品提出石器—青铜—铁器三期说，后增补铜石并用期。切分的依据是制作工具的主导材料，而材料背后是生产力水平。",
    goodFor:
      "研究无文字记载的史前时代时，这是全球通用的第一把尺：不依赖任何文献，只看出土实物，结论可被重复检验。",
    limits:
      "各地进入各时代的早晚相差数千年（美洲大部直到欧洲人抵达仍是石器阶段），不能作世界统一标尺；且器物是渐变的，任何『时代边界』都是人为切点。",
  },
  {
    id: "textual",
    name: "文字·文献分期",
    essence: "以有没有可靠文字记载为尺",
    pigment: "#bd8b3a",
    slices: [
      { n: "口传与传说时代", s: -3000, e: -1300 },
      { n: "文字可证", s: -1300, e: -841 },
      { n: "确切纪年（信史）", s: -841, e: 2027 },
    ],
    basis:
      "按史料性质切：无文字的史前（prehistory）—文字稀少、文献与考古需互证的原史（protohistory）—有连续可靠记载的历史时代。中国以甲骨文（前1300前后）与共和元年（前841）为两级台阶。",
    goodFor:
      "判断一段历史能『说到多细』：传说时代只能讲轮廓与结构，信史时代才能讲年月与人物。也给史料批判提供入口。",
    limits:
      "有文字不等于记载可信——《史记》笔下的三皇五帝成文时距所述已两三千年；反过来，无文字不等于无历史，考古学正在不断把『史前』讲厚。",
  },
  {
    id: "dynasty",
    name: "王朝世系分期",
    essence: "以政权更迭为尺",
    pigment: "#b4574a",
    slices: [
      { n: "夏商周", s: -2070, e: -221 },
      { n: "秦汉", s: -221, e: 220 },
      { n: "魏晋南北朝", s: 220, e: 589 },
      { n: "隋唐五代", s: 581, e: 979 },
      { n: "辽宋夏金元", s: 916, e: 1368 },
      { n: "明清", s: 1368, e: 1912 },
      { n: "民国以来", s: 1912, e: 2027 },
    ],
    basis:
      "中国两千多年史学的主线：二十四史按王朝断代编纂，年号、帝王世系构成最细密的时间刻度。东亚各国史（日本、朝鲜、越南）也长期沿用此法。",
    goodFor:
      "政治史、制度史、人物史的天然骨架；记年精度最高，检索文献最方便——古籍的纪年几乎都挂在王朝世系上。",
    limits:
      "以帝王为中心，容易遮蔽经济与社会的连续性：改朝换代未必是历史的断裂（汉承秦制、清承明制），而王朝中期的巨变（如安史之乱）反而被朝名掩盖。",
  },
  {
    id: "social-formation",
    name: "社会形态分期",
    essence: "以生产方式与阶级关系为尺",
    pigment: "#7d6b8a",
    slices: [
      { n: "原始社会", s: -2000000, e: -2070 },
      { n: "奴隶社会", s: -2070, e: -476 },
      { n: "封建社会", s: -475, e: 1840 },
      { n: "半殖民地半封建", s: 1840, e: 1949 },
      { n: "社会主义社会", s: 1949, e: 2027 },
    ],
    basis:
      "源于马克思对社会经济形态的论述，经苏联教科书定型为『五种社会形态』序列，1950年代起成为中国大陆史学的官方框架。",
    goodFor:
      "做宏观结构比较时提供统一词汇：把不同时代的经济基础、阶级关系摆上台面，而不是只看宫廷与战争。",
    limits:
      "六把尺中争议最大的一把：中国有没有『奴隶社会』争论近百年；『封建』在中文本义（封邦建国）与西欧 feudalism 之间严重错位；五种形态是否普遍必然，学界多持保留。",
  },
  {
    id: "naito",
    name: "东洋史分期",
    essence: "以社会结构的长波变化为尺",
    pigment: "#3f7072",
    slices: [
      { n: "上古（至汉）", s: -2070, e: 220 },
      { n: "中世（六朝至唐）", s: 220, e: 960 },
      { n: "近世（宋至清）", s: 960, e: 1912 },
      { n: "现代", s: 1912, e: 2027 },
    ],
    basis:
      "日本京都学派内藤湖南提出：唐宋之际发生大变革——贵族政治让位于君主独裁，平民社会兴起，经济文化重心南移。史称『唐宋变革论』。",
    goodFor:
      "跳出王朝循环看长波：为什么宋以后的政治运作、社会流动与六朝隋唐如此不同，这把尺给出的解释至今最有影响力。",
    limits:
      "『上古—中世—近世』本是从欧洲史借来的框架，套用中国是否削足适履始终有争议；『近世』始于宋还是明清，学派之间至今没有定论。",
  },
  {
    id: "global",
    name: "全球史·长时段",
    essence: "以跨区域的结构与交流为尺",
    pigment: "#5f7f63",
    slices: [
      { n: "农业起源", s: -9000, e: -3500 },
      { n: "文明并起", s: -3500, e: -800 },
      { n: "轴心时代", s: -800, e: -200 },
      { n: "各文明分途", s: -200, e: 1500 },
      { n: "全球连成一体", s: 1500, e: 2027 },
    ],
    basis:
      "年鉴学派布罗代尔主张历史分三层：地理的长时段、社会经济的局势、事件的浪花；雅斯贝尔斯的『轴心时代』、彭慕兰的『大分流』则是跨区域比较的坐标。",
    goodFor:
      "回答王朝与国界装不下的问题：为什么几大文明几乎同时出现哲人突破？小麦、马匹、白银如何改变世界？本图集世界卷的横带即按此思路划分。",
    limits:
      "尺度一大就容易笼统，具体的人与事件被平均掉；且比较框架常不自觉带上欧洲中心论——用谁的现代性作标准，本身就要先打问号。",
  },
];

const CRITERIA = [
  { t: "切在真实的断裂上", d: "好的分期点对应结构性的变化（制度、技术、社会），而不是为了方便记忆凑整。" },
  { t: "说清依据的是什么", d: "按工具、按文献、按政权还是按生产方式，依据不同，切法就不同；混用必然出矛盾。" },
  { t: "知道自己付出了什么代价", d: "每把尺都会照亮一些东西、遮住一些东西。用某把尺时，记得它遮住的部分。" },
];

export default function Methods() {
  const TOTAL = totalHeight();
  const [active, setActive] = useState<string | null>(null);

  const pct = (v: number) => (v / TOTAL) * 100;

  const strips = useMemo(
    () =>
      METHODS.map((m) => ({
        m,
        segs: m.slices.map((s) => ({
          ...s,
          left: pct(ty(s.s)),
          width: pct(ty(s.e) - ty(s.s)),
        })),
      })),
    [TOTAL]
  );

  const scrollTo = (id: string) => {
    document.getElementById("m-" + id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      {/* 站点导航 */}
      <header className="mx-auto flex max-w-[1400px] items-baseline gap-5 px-5 pb-3 pt-6">
        <span className="font-serif-cjk text-2xl font-semibold tracking-wide">
          历史图集
        </span>
        <nav className="flex items-baseline gap-4 text-sm">
          <Link to="/" className="text-[color:var(--graphite-soft)] underline-offset-4 hover:underline">
            图集首页
          </Link>
          <Link to="/china" className="text-[color:var(--graphite-soft)] underline-offset-4 hover:underline">
            中国卷
          </Link>
          <Link to="/world" className="text-[color:var(--graphite-soft)] underline-offset-4 hover:underline">
            世界卷
          </Link>
          <span className="font-medium underline decoration-2 underline-offset-4">方法卷</span>
        </nav>
      </header>
      <hr className="pencil-rule mx-auto max-w-[1400px]" />

      {/* 命题 */}
      <section className="mx-auto max-w-4xl px-5 pb-8 pt-10 text-center">
        <div className="text-xs tracking-[0.5em] text-[color:var(--graphite-faint)]">
          SIX WAYS TO SLICE TIME
        </div>
        <h1 className="font-serif-cjk mt-2 text-4xl font-semibold tracking-wider">
          同一条时间，六把尺
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--graphite-soft)]">
          历史本身不分段——所有的分期都是后人手里的工具。下面六条切片尺，用六种方法切同一段中国史，
          切口的落点各不相同。悬停看每把尺的切法，点按读它的适用边界与争议。
        </p>
      </section>

      {/* 签名装置：六条切片尺 */}
      <section className="hatch-band-strong mx-auto max-w-5xl rounded px-5 py-6">
        <div className="space-y-2.5">
          {strips.map(({ m, segs }) => {
            const dim = active !== null && active !== m.id;
            return (
              <div
                key={m.id}
                className="slice-row flex items-center gap-3"
                style={{ opacity: dim ? 0.28 : 1 }}
                onMouseEnter={() => setActive(m.id)}
                onMouseLeave={() => setActive(null)}
                onClick={() => scrollTo(m.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && scrollTo(m.id)}
              >
                <div className="w-24 shrink-0 text-right">
                  <div className="text-[12px] font-medium leading-tight">{m.name}</div>
                </div>
                <div className="relative h-7 flex-1">
                  {segs.map((g) => (
                    <div
                      key={g.n}
                      className="slice-seg"
                      style={{
                        left: g.left + "%",
                        width: g.width + "%",
                        background: `color-mix(in srgb, ${m.pigment} 16%, rgba(255,255,255,0.4))`,
                      }}
                      title={`${g.n} · ${fmtShort(g.s)} — ${fmtShort(g.e)}`}
                    >
                      {g.width > 7 && <span>{g.n}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-xs text-[color:var(--graphite-faint)]">
          {active
            ? METHODS.find((m) => m.id === active)?.essence
            : "横轴比例与中国卷一致：左端约 200 万年前，右端为今天"}
        </div>
      </section>

      {/* 六张方法卡 */}
      <section className="mx-auto max-w-5xl space-y-6 px-5 pb-10 pt-10">
        {METHODS.map((m) => {
          const segs = strips.find((x) => x.m.id === m.id)!.segs;
          return (
            <article key={m.id} id={"m-" + m.id} className="volume-card scroll-mt-6 p-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <span
                  className="inline-block h-3 w-3 rounded-[3px] border border-[color:var(--graphite)]"
                  style={{ background: m.pigment }}
                />
                <h2 className="font-serif-cjk text-2xl font-semibold">{m.name}</h2>
                <span className="text-sm text-[color:var(--graphite-soft)]">{m.essence}</span>
              </div>

              {/* 迷你切片尺 */}
              <div className="relative mt-4 h-8">
                {segs.map((g) => (
                  <div
                    key={g.n}
                    className="slice-seg"
                    style={{
                      left: g.left + "%",
                      width: g.width + "%",
                      background: `color-mix(in srgb, ${m.pigment} 16%, rgba(255,255,255,0.4))`,
                    }}
                    title={`${g.n} · ${fmtShort(g.s)} — ${fmtShort(g.e)}`}
                  >
                    {g.width > 8 && <span>{g.n}</span>}
                    {g.width > 14 && (
                      <em>
                        {fmtShort(g.s)}
                      </em>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <div>
                  <div className="method-label" style={{ color: m.pigment }}>依据什么切</div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">{m.basis}</p>
                </div>
                <div>
                  <div className="method-label" style={{ color: m.pigment }}>何时好用</div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">{m.goodFor}</p>
                </div>
                <div>
                  <div className="method-label" style={{ color: m.pigment }}>边界与争议</div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">{m.limits}</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* 收尾：好分期的标准 */}
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="hatch-band-strong rounded p-6">
          <div className="font-serif-cjk text-sm font-semibold tracking-widest text-[color:var(--graphite-soft)]">
            那么，怎样算一把好尺？
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {CRITERIA.map((c, i) => (
              <div key={c.t}>
                <div className="font-serif-cjk text-base font-semibold">
                  {["其一", "其二", "其三"][i]} · {c.t}
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--graphite-soft)]">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-[color:var(--graphite-faint)]">
          中国卷用前五把尺并排对照，世界卷用第六把尺贯穿六区——两把长卷合起来，就是这页方法论的实践。
        </p>
      </section>
    </div>
  );
}
