import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, ExternalLink, GitBranch, Layers3, MapPin } from "lucide-react";
import { MODERN_EVENTS, MODERN_SOURCES, POWER_SPANS, type ModernEvent, type ModernPhase, type PowerSpan } from "@/data/modernChina";
import { useTitle } from "@/lib/useTitle";
import { Seal } from "@/components/Seal";

const PHASES: ModernPhase[] = ["晚清危机", "共和与分裂", "国民革命", "对峙与侵略", "抗战与建国"];
const GRAPH_IDS = ["opium","taiping","xiang-army","new-army","wuchang","roc-1912","yuan-death","first-united-front","northern-expedition","split-1927","northeast-flag","central-plains","mukden","xian","second-united-front","victory-1945","civil-war","three-campaigns","prc"];
const GRAPH_EDGES = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[2,7],[6,7],[7,8],[8,9],[8,10],[9,11],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[10,13]];
const POWER_EVENT: Record<string,string> = { qing:"roc-1912", "taiping-power":"taiping", "beiyang-government":"northeast-flag", "nanjing-government":"nanjing-1949", "xiang-huai":"huai-army", "beiyang-armies":"warlord-split", "regional-armies":"central-plains", kmt:"first-united-front", ccp:"ccp-founded", "japan-war":"mukden" };

export default function ModernChina() {
  useTitle("中国近现代史图谱 · 1840—1949 | 历史图集");
  const [view, setView] = useState<"timeline" | "powers" | "graph">("powers");
  const [phase, setPhase] = useState<"全部" | ModernPhase>("全部");
  const [selectedId, setSelectedId] = useState("northeast-flag");
  const [powerId, setPowerId] = useState("beiyang-armies");
  const selected = MODERN_EVENTS.find((event) => event.id === selectedId) ?? MODERN_EVENTS[0];
  const activePower = POWER_SPANS.find((power) => power.id === powerId) ?? POWER_SPANS[0];
  const events = useMemo(() => phase === "全部" ? MODERN_EVENTS : MODERN_EVENTS.filter((event) => event.phase === phase), [phase]);
  const selectPower = (power: PowerSpan) => { setPowerId(power.id); setSelectedId(POWER_EVENT[power.id]); };

  return <div className="modern-page">
    <header className="modern-nav"><Link to="/" className="march-brand"><Seal size={29} /><span>历史图集<small>ATLAS OF HISTORY</small></span></Link><div className="march-breadcrumb"><span>中国史</span><b>/</b><strong>近现代史图谱</strong></div><Link className="back-home" to="/"><ArrowLeft size={15} /> 返回图集</Link></header>
    <main>
      <section className="modern-hero">
        <div><div className="modern-eyebrow">MODERN CHINA · 1840—1949 <span>专题 002</span></div><h1>帝制崩解之后，<br /><em>谁来重建秩序？</em></h1><p>从晚清的内忧外患，到民国的共和试验；从军阀割据到党军体制，从两次国共合作到新中国成立。把109年放在同一张图上，看势力如何生长、交错与转化。</p></div>
        <div className="modern-thesis"><span>本图回答三个问题</span><ol><li><b>政权</b>为何更替？</li><li><b>军队</b>属于谁、听命于谁？</li><li><b>合作</b>何时形成，又为何改变？</li></ol><small>以政治军事史为主，不替代完整社会经济史</small></div>
      </section>

      <section className="modern-regimes" aria-label="主要政权时间范围"><div className="regime-line" />{[["晚清","1840—1912"],["南京临时政府","1912.01—04"],["北洋政府","1912—1928"],["南京国民政府","1927—1949"],["中华人民共和国","1949.10.01"]].map(([name,year],i) => <div className={`regime regime-${i}`} key={name}><i /><span>{year}</span><b>{name}</b></div>)}</section>
      <section className="modern-caveat"><span>先分清三个口径</span><div><b>1895 ≠ 1912</b><p>1895是北洋集团兴起的常用起点，1912是北洋统治时期的起点。</p></div><div><b>1928 = 形式统一</b><p>东北易帜结束北洋统治，但地方实力派与新军阀并未立即消失。</p></div><div><b>1931 / 1937</b><p>分别对应十四年抗战起点与全民族全面抗战开端。</p></div></section>

      <section className="modern-explorer">
        <div className="modern-toolbar"><div className="modern-view-switch"><button className={view === "powers" ? "active" : ""} onClick={() => setView("powers")}><Layers3 size={16} />势力兴衰</button><button className={view === "timeline" ? "active" : ""} onClick={() => setView("timeline")}><CalendarDays size={16} />历史时间线</button><button className={view === "graph" ? "active" : ""} onClick={() => setView("graph")}><GitBranch size={16} />因果关系</button></div><span>{view === "powers" ? "横轴为年份，色带长度表示本图覆盖期内的活动区间" : view === "timeline" ? `${events.length} 个节点 · 点击阅读详情` : "选择节点，查看它在结构中的位置"}</span></div>
        {view === "timeline" && <div className="modern-phase-filter">{(["全部",...PHASES] as const).map((item) => <button key={item} className={phase === item ? "active" : ""} onClick={() => setPhase(item)}>{item}</button>)}</div>}

        {view === "powers" && <div className="powers-layout"><div className="powers-chart"><div className="powers-years">{[1840,1860,1880,1900,1912,1928,1937,1945,1949].map((year) => <span key={year} style={{ left: `${(year-1840)/109*100}%` }}>{year}</span>)}</div><div className="powers-grid">{[1840,1860,1880,1900,1912,1928,1937,1945,1949].map((year) => <i key={year} style={{ left: `${(year-1840)/109*100}%` }} />)}</div>
          {(["政权","军政集团","政党与战争"] as const).map((group) => <div className="power-group" key={group}><div className="power-group-label">{group}<span>{POWER_SPANS.filter((p) => p.group === group).length} 条</span></div>{POWER_SPANS.filter((power) => power.group === group).map((power) => <button key={power.id} className={`power-row ${power.id === powerId ? "active" : ""}`} onClick={() => selectPower(power)}><span className="power-name">{power.name}</span><div className="power-track"><i className="power-bar" style={{ left:`${(power.start-1840)/109*100}%`,width:`${(power.end-power.start)/109*100}%`,background:power.color }}><b>{power.status}</b></i></div></button>)}</div>)}
          <div className="power-transition t1"><span>湘 → 淮 → 北洋</span></div><div className="power-transition t2"><span>旧军阀 → 新军阀</span></div>
        </div><PowerDetail power={activePower} event={selected} onEvent={() => setView("timeline")} /></div>}

        {view === "timeline" && <div className="modern-timeline-layout"><div className="modern-timeline">{events.map((event) => <article key={event.id} className={`modern-event ${selected.id === event.id ? "selected" : ""}`}><div className="modern-event-year">{event.date}<span>{event.phase}</span></div><i className="modern-event-dot" /><button onClick={() => setSelectedId(event.id)}><div><span>{event.kind}</span><span>{event.actors.slice(0,2).join(" · ")}</span></div><h2>{event.title}{event.major && <i>关键</i>}</h2><p>{event.summary}</p></button></article>)}</div><ModernDetail event={selected} /></div>}

        {view === "graph" && <div className="modern-graph-layout"><div className="modern-graph-scroll"><div className="modern-graph"><div className="graph-row-label r1">旧秩序危机</div><div className="graph-row-label r2">革命与分裂</div><div className="graph-row-label r3">抗战与新建</div><svg viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="modern-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" /></marker></defs>{GRAPH_EDGES.map(([a,b],i) => <line key={i} x1={graphPosition(a).x*10} y1={graphPosition(a).y*6} x2={graphPosition(b).x*10} y2={graphPosition(b).y*6} markerEnd="url(#modern-arrow)" />)}</svg>{GRAPH_IDS.map((id,i) => { const event = MODERN_EVENTS.find((item) => item.id === id)!; const pos = graphPosition(i); return <button key={id} className={`modern-graph-node ${selectedId === id ? "active" : ""}`} style={{left:`${pos.x}%`,top:`${pos.y}%`}} onClick={() => setSelectedId(id)}><small>{event.date}</small><b>{event.title}</b></button>; })}</div></div><ModernDetail event={selected} /></div>}
      </section>

      <section className="modern-reading"><div><span>THE WARLORD QUESTION</span><h2>军阀不是突然消失，<br />而是不断改变存在方式。</h2></div><div className="warlord-chain">{[["1854—1901","湘淮军政集团","地方勇营与督抚权力结合"],["1895—1916","北洋集团形成","新军私属性与中央军权结合"],["1916—1928","直皖奉分裂","争夺北京政府与地方地盘"],["1928—1949","地方实力派延续","归附、改编、联盟与战争并存"]].map(([year,title,text],i) => <div key={title}><span>0{i+1}</span><small>{year}</small><b>{title}</b><p>{text}</p></div>)}</div><p>“湘—淮—北洋”是理解组织渊源的一种分析框架，不意味着三者完全相同。1928年东北易帜是政治史分期节点，不是所有地方军队在同一时刻被中央收编。</p></section>

      <section className="modern-sources"><div className="sources-heading"><BookOpen size={20} /><div><h2>参考史料与叙事边界</h2><p>采用权威通史、党史文献与近代史研究资料；点击可访问原文。</p></div></div><ol>{MODERN_SOURCES.map((source) => <li key={source.id}><span>[{source.id}]</span><a href={source.url} target="_blank" rel="noreferrer"><b>{source.title}</b><small>{source.org}</small><ExternalLink size={13} /></a></li>)}</ol><div className="source-caveat">本图选择政治军事史主线，刻意呈现不同势力的并行与交错。事件之间的箭头表示重要的历史联系或条件关系，不表示单一、充分的因果关系；对“军阀消亡”“国家统一”“抗战起点”等概念保留分期口径说明。</div></section>
    </main>
    <footer className="march-footer modern-footer"><span>历史图集 · 中国近现代史</span><span>1840—1949 · 政权、军队与合作</span><Link to="/long-march">深入长征专题 <ArrowRight size={14} /></Link></footer>
  </div>;
}

function graphPosition(index: number) {
  const positions = [[7,20],[20,20],[33,20],[46,20],[59,20],[72,20],[86,20],[20,52],[33,52],[46,52],[59,52],[72,52],[7,84],[20,84],[33,84],[46,84],[59,84],[72,84],[86,84]];
  return { x: positions[index][0], y: positions[index][1] };
}

function ModernDetail({ event }: { event: ModernEvent }) {
  return <aside className="modern-detail" aria-live="polite"><div className="modern-detail-top"><span>{event.phase} / {event.kind}</span><span>{event.source.map((id) => `[${id}]`).join(" ")}</span></div><h2>{event.title}</h2><div className="modern-detail-date"><CalendarDays size={14} />{event.date}</div><div className="modern-actors"><MapPin size={14} />{event.actors.join(" · ")}</div><p>{event.detail}</p>{event.id === "long-march-context" && <Link className="modern-internal-link" to="/long-march">进入长征专题 <ArrowRight size={13} /></Link>}<div className="modern-detail-sources">{event.source.map((id) => { const source = MODERN_SOURCES.find((item) => item.id === id)!; return <a key={id} href={source.url} target="_blank" rel="noreferrer"><span>[{id}] {source.org}</span><ExternalLink size={12} /></a>; })}</div></aside>;
}

function PowerDetail({ power, event, onEvent }: { power: PowerSpan; event: ModernEvent; onEvent: () => void }) {
  return <aside className="power-detail"><span>POWER / {power.group}</span><i style={{background:power.color}} /><h2>{power.name}</h2><div>{Math.floor(power.start)}—{Math.ceil(power.end)}</div><b>{power.status}</b><p>{power.note}</p><button onClick={onEvent}>阅读关联节点：{event.title}<ArrowRight size={13} /></button></aside>;
}
