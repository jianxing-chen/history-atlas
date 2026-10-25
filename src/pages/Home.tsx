import { Link } from "react-router";
import { ArrowDown, ArrowRight, BookOpen, GitBranch, MoveRight, Search } from "lucide-react";
import { useTitle } from "@/lib/useTitle";
import { Seal } from "@/components/Seal";
import { MARCH_EVENTS, MARCH_SOURCES } from "@/data/longMarch";

const COLLECTIONS = [
  { to: "/china", index: "A—01", title: "中国通史长卷", type: "纵向时间轴", range: "约200万年前—今", desc: "把考古文化、朝代政权与大事记放在同一条时间脊上，让不同尺度彼此对齐。", color: "#9b4539", count: "136 条目" },
  { to: "/world", index: "A—02", title: "世界文明对照", type: "多地区泳道", range: "前3500—今", desc: "六个文明区域并排展开。不是六份孤立年表，而是一张可以横向阅读的世界。", color: "#3f6972", count: "160+ 节点" },
  { to: "/methods", index: "A—03", title: "历史的六把尺", type: "方法对照", range: "分期与尺度", desc: "同一段时间，用六种方法切开。看见分期的用途，也看见它各自的边界。", color: "#7d7250", count: "6 种方法" },
];

export default function Home() {
  useTitle("历史图集 · 在时间中理解历史");
  return (
    <div className="atlas-home">
      <header className="home-nav">
        <Link to="/" className="home-brand" aria-label="历史图集首页"><Seal size={31} /><span>历史图集<small>ATLAS OF HISTORY</small></span></Link>
        <nav aria-label="主导航"><a href="#collections">图集目录</a><a href="#reading">阅读方法</a><Link to="/methods">关于方法</Link></nav>
        <Link className="nav-search" to="/china" aria-label="进入中国通史长卷"><Search size={16} /><span>开始探索</span></Link>
      </header>

      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <div className="home-kicker"><span /> 一座可以走进去的历史坐标系</div>
            <h1>把历史，<br />放回<span>时间</span>里。</h1>
            <p>事件不是孤立的点。沿着时间向前，看它如何发生；沿着关系向外，看它与谁相连。</p>
            <div className="hero-actions"><Link className="primary-action" to="/long-march">进入本期专题 <ArrowRight size={17} /></Link><a className="text-action" href="#collections">浏览全部图集 <ArrowDown size={15} /></a></div>
          </div>
          <div className="hero-instrument" aria-label="三条历史时间线示意">
            <div className="instrument-top"><span>TIME / RELATION / CONTEXT</span><span>图版 001</span></div>
            <div className="instrument-title">同一时间，<br />不同地点。</div>
            <div className="mini-years"><span>前221</span><span>1644</span><span>1934</span><span>1936</span></div>
            <div className="mini-rail">
              <i className="mini-tick t1" /><i className="mini-tick t2" /><i className="mini-tick t3" /><i className="mini-tick t4" />
              <div className="mini-event e1"><b>秦统一</b><span>中国</span></div>
              <div className="mini-event e2"><b>明清易代</b><span>中国</span></div>
              <div className="mini-event e3"><b>长征开始</b><span>于都</span></div>
              <div className="mini-event e4"><b>三大主力会师</b><span>会宁 · 将台堡</span></div>
            </div>
            <div className="instrument-caption"><span>时间向下流动</span><span>点击事件，展开它的前后文</span></div>
          </div>
          <div className="hero-folio"> HISTORY, MAPPED.<br /><span>EST. 2026</span></div>
        </section>

        <section className="feature-story">
          <div className="feature-art" aria-hidden="true">
            <svg viewBox="0 0 640 330" role="img">
              <path className="contour" d="M-20 260 C100 170 160 320 285 200 S490 55 670 120" />
              <path className="contour faint" d="M-10 285 C120 195 175 340 305 220 S510 80 675 145" />
              <path className="march-route" d="M60 270 C100 240 94 185 160 200 S250 255 290 184 S325 85 398 132 S475 220 520 152 S550 83 590 58" />
              {[ [60,270], [160,200], [290,184], [398,132], [520,152], [590,58] ].map(([x,y], i) => <g key={i}><circle cx={x} cy={y} r="7" /><circle className="inner-dot" cx={x} cy={y} r="2" /></g>)}
            </svg>
            <span className="map-label l1">于都<small>1934.10</small></span><span className="map-label l2">遵义<small>1935.01</small></span><span className="map-label l3">会宁 / 将台堡<small>1936.10</small></span>
            <span className="map-coordinate">26°N — 36°N<br />LONG MARCH</span>
          </div>
          <div className="feature-copy">
            <div className="section-label">NEW DOSSIER <span>新专题</span></div>
            <h2>长征：一次战略转移的<br />前因、征途与会师</h2>
            <p>从第五次反“围剿”失败，到1936年三大主力会师。{MARCH_EVENTS.length}个史实节点，分开中央红军与各路红军的进程，也标出日期与里程的不同统计口径。</p>
            <div className="feature-facts"><span><b>1934—1936</b>时间跨度</span><span><b>{MARCH_EVENTS.length}</b>关键节点</span><span><b>{MARCH_SOURCES.length}</b>权威来源</span></div>
            <Link to="/long-march">展开长征图谱 <MoveRight size={19} /></Link>
          </div>
        </section>

        <section id="collections" className="collections-section">
          <div className="section-heading"><div><span className="section-label">THE COLLECTION</span><h2>从一条线，进入一段历史</h2></div><p>长卷负责整体，专题负责细节。<br />每一张图都可以独立阅读，也可以彼此参照。</p></div>
          <div className="collection-grid">{COLLECTIONS.map((item) => <Link to={item.to} className="collection-item" key={item.to} style={{ "--accent": item.color } as React.CSSProperties}>
            <div className="collection-meta"><span>{item.index}</span><span>{item.type}</span></div>
            <div className="collection-glyph" aria-hidden="true"><i /><i /><i /><b /></div>
            <h3>{item.title}</h3><p>{item.desc}</p>
            <div className="collection-bottom"><span>{item.range} · {item.count}</span><ArrowRight size={18} /></div>
          </Link>)}</div>
        </section>

        <section id="reading" className="reading-section">
          <div className="reading-intro"><span className="section-label">TWO WAYS OF SEEING</span><h2>不只记住先后，<br />也看懂彼此。</h2><p>同一套史实，可以用两种镜头观看。时间线回答“何时发生”，关系图追问“为何如此”。</p></div>
          <div className="reading-mode"><div className="mode-icon"><BookOpen size={22} /></div><span>01 / CHRONOLOGY</span><h3>时间线</h3><p>按日期展开事件，保留分期、地点和不同队伍的并行进程。</p><div className="mode-line"><i /><i /><i /><i /></div></div>
          <div className="reading-mode"><div className="mode-icon"><GitBranch size={22} /></div><span>02 / RELATIONSHIP</span><h3>关系图</h3><p>把背景、决策、战役与会师连成因果网络，看到历史不是一条直线。</p><div className="mode-network"><i /><i /><i /><i /><b /><b /></div></div>
        </section>
      </main>
      <footer className="home-footer"><div><Seal size={25} /><span>历史图集</span></div><p>以时间为经，以关系为纬。<br />史实有出处，异说有边界。</p><span>ATLAS OF HISTORY · 2026</span></footer>
    </div>
  );
}
