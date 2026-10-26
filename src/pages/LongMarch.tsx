import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, ExternalLink, GitBranch, MapPin } from "lucide-react";
import { MARCH_EVENTS, MARCH_SOURCES, type MarchEvent } from "@/data/longMarch";
import { useTitle } from "@/lib/useTitle";
import { Seal } from "@/components/Seal";

const GRAPH = [
  { id: "fifth-encirclement", x: 8, y: 44 }, { id: "yudu", x: 23, y: 44 },
  { id: "xiangjiang", x: 38, y: 25 }, { id: "tongdao", x: 38, y: 63 },
  { id: "liping", x: 51, y: 63 }, { id: "zunyi", x: 51, y: 25 },
  { id: "chishui", x: 64, y: 25 }, { id: "jinsha", x: 64, y: 63 },
  { id: "luding", x: 72, y: 44 }, { id: "maogong", x: 79, y: 25 },
  { id: "grassland", x: 88, y: 44 }, { id: "wuqi", x: 77, y: 63 },
  { id: "sangzhi", x: 51, y: 88 }, { id: "ganzi", x: 77, y: 88 },
  { id: "huining", x: 92, y: 25 }, { id: "jiangtaipu", x: 92, y: 63 },
];
const EDGES = [[0,1],[1,2],[1,3],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[9,14],[10,14],[12,13],[13,15],[11,15],[14,15]];

function SourceMarks({ ids }: { ids: number[] }) {
  return <span className="source-marks">{ids.map((id) => <a key={id} href={MARCH_SOURCES.find((s) => s.id === id)?.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} aria-label={`查看来源 ${id}`}>[{id}]</a>)}</span>;
}

export default function LongMarch() {
  useTitle("长征图谱 · 1934—1936 | 历史图集");
  const [view, setView] = useState<"timeline" | "graph">("timeline");
  const [filter, setFilter] = useState("全部");
  const [selectedId, setSelectedId] = useState("yudu");
  const selected = MARCH_EVENTS.find((event) => event.id === selectedId) ?? MARCH_EVENTS[1];
  const events = useMemo(() => filter === "全部" ? MARCH_EVENTS : MARCH_EVENTS.filter((event) => event.kind === filter), [filter]);
  const selectEvent = (event: MarchEvent) => setSelectedId(event.id);

  return <div className="march-page">
    <header className="march-nav">
      <Link to="/" className="march-brand"><Seal size={29} /><span>历史图集<small>ATLAS OF HISTORY</small></span></Link>
      <div className="march-breadcrumb"><span>中国近现代史</span><b>/</b><strong>长征图谱</strong></div>
      <Link className="back-home" to="/"><ArrowLeft size={15} /> 返回图集</Link>
    </header>

    <main>
      <section className="march-hero">
        <div className="march-heading"><div className="march-eyebrow">THE LONG MARCH · 1934—1936 <span>专题 001</span></div><h1>长征<span>一次战略转移的<br />前因、征途与会师</span></h1><p>从中央苏区到陕甘，从一条主线到“3+1”路红军。沿着史实节点，重建事件之间的方向与联系。</p></div>
        <div className="march-scope"><div><b>1934.10</b><span>中央红军开始长征</span></div><i /><div><b>1936.10</b><span>三大主力胜利会师</span></div><small>整体长征时间口径</small></div>
      </section>

      <section className="march-note"><span>读图说明</span><p><b>二万五千里</b>指中央红军行程；四路红军合计约六万五千里。日期精确到日，跨日事件保留起止；不同口径在节点内单独说明。</p><a href="#sources">查看全部来源 <ArrowRight size={14} /></a></section>

      <section className="march-explorer">
        <div className="explorer-toolbar">
          <div className="view-switch" aria-label="图谱视图"><button className={view === "timeline" ? "active" : ""} onClick={() => setView("timeline")}><CalendarDays size={16} /> 时间线</button><button className={view === "graph" ? "active" : ""} onClick={() => setView("graph")}><GitBranch size={16} /> 关系图</button></div>
          {view === "timeline" ? <div className="event-filters" aria-label="按事件类型筛选">{["全部","战役","会议","会师"].map((name) => <button key={name} className={filter === name ? "active" : ""} onClick={() => setFilter(name)}>{name}{name === "全部" && <sup>{MARCH_EVENTS.length}</sup>}</button>)}</div> : <span className="graph-hint">选择节点，阅读前后关系与出处</span>}
        </div>

        {view === "timeline" ? <div className="timeline-layout">
          <div className="march-timeline">
            <div className="timeline-axis" aria-hidden="true" />
            {events.map((event) => <article className={`timeline-event ${selected.id === event.id ? "selected" : ""}`} key={event.id}>
              <div className="event-date">{event.date}<span>{event.phase}</span></div>
              <button className={`event-node kind-${event.kind}`} onClick={() => selectEvent(event)} aria-label={`查看${event.title}`} aria-pressed={selected.id === event.id}><i /></button>
              <button className="event-card" onClick={() => selectEvent(event)}><div className="event-card-meta"><span>{event.kind}</span><span><MapPin size={12} />{event.place}</span></div><h2>{event.title}{event.major && <i>主线</i>}</h2><p>{event.summary}</p><span className="event-more">展开节点 <ArrowRight size={14} /></span></button>
            </article>)}
          </div>
          <EventDetail event={selected} />
        </div> : <div className="graph-layout">
          <div className="graph-scroll"><div className="march-graph">
            <svg viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>{EDGES.map(([a,b], i) => { const from = GRAPH[a], to = GRAPH[b]; return <line key={i} x1={from.x * 10} y1={from.y * 5.6} x2={to.x * 10} y2={to.y * 5.6} markerEnd="url(#arrow)" />; })}</svg>
            <div className="graph-lane lane-a">突围 · 转折 · 会师</div><div className="graph-lane lane-b">出征与北上</div><div className="graph-lane lane-c">红二、六军团支线</div>
            {GRAPH.map((node) => { const event = MARCH_EVENTS.find((item) => item.id === node.id)!; return <button key={node.id} className={`graph-node ${selected.id === node.id ? "active" : ""}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={() => selectEvent(event)}><small>{event.date}</small><b>{event.title}</b><span>{event.kind}</span></button>; })}
          </div></div><EventDetail event={selected} />
        </div>}
      </section>

      <section className="march-context"><div><span className="section-label">BEYOND A SINGLE LINE</span><h2>不是一支队伍的独白，<br />而是四条征程的会合。</h2></div><div className="route-ledger">{[["红一方面军（中央红军）","1934.10—1935.10","约二万五千里"],["红二方面军","1935.11—1936.10","约二万里"],["红四方面军","1935.03—1936.10","约一万里"],["红二十五军","1934.11—1935.09","近万里"]].map(([name,time,distance]) => <div key={name}><b>{name}</b><span>{time}</span><em>{distance}</em></div>)}</div><p>“3+1”是理解整体长征的常用框架。里程取约数，仅用于区分中央红军与各路红军的统计口径；红二方面军前身为红二、六军团。</p></section>

      <section id="sources" className="march-sources"><div className="sources-heading"><BookOpen size={20} /><div><h2>史料与口径</h2><p>优先采用党史研究机构、新华社、国防部及中央媒体资料。点击条目可访问原文。</p></div></div><ol>{MARCH_SOURCES.map((source) => <li key={source.id}><span>[{source.id}]</span><a href={source.url} target="_blank" rel="noreferrer"><b>{source.title}</b><small>{source.org}</small><ExternalLink size={13} /></a></li>)}</ol><div className="source-caveat">编辑说明：本页是历史进程的导览，不替代完整战史。事件意义采用所引权威资料的表述；对“会师次数”“出发日期”“总里程”等存在统计口径差异的问题，不作无说明的合并。</div></section>
    </main>
    <footer className="march-footer"><span>历史图集 · 长征专题</span><span>史实有出处，异说有边界。</span><Link to="/china">继续阅读中国通史 <ArrowRight size={14} /></Link></footer>
  </div>;
}

function EventDetail({ event }: { event: MarchEvent }) {
  return <aside className="march-detail" aria-live="polite"><div className="detail-top"><span>NODE / {event.phase}</span><span>点击左侧节点切换</span></div><div className="detail-kind">{event.kind}<SourceMarks ids={event.source} /></div><h2>{event.title}</h2><div className="detail-date"><CalendarDays size={14} />{event.date}</div><div className="detail-place"><MapPin size={14} />{event.place}</div><p>{event.detail}</p><div className="detail-source">本节点来源{event.source.map((id) => { const source = MARCH_SOURCES.find((item) => item.id === id)!; return <a key={id} href={source.url} target="_blank" rel="noreferrer"><span>[{id}] {source.org}</span><ExternalLink size={12} /></a>; })}</div></aside>;
}
