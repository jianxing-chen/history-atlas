export type MarchEvent = {
  id: string;
  date: string;
  sort: number;
  title: string;
  place: string;
  phase: "前夜" | "突围" | "转折" | "北上" | "会师" | "后续";
  kind: "背景" | "行军" | "战役" | "会议" | "会师";
  summary: string;
  detail: string;
  source: number[];
  major?: boolean;
};

export const MARCH_EVENTS: MarchEvent[] = [
  {
    id: "fifth-encirclement", date: "1933.09—1934.10", sort: 1933.7, title: "第五次反“围剿”失败", place: "中央苏区", phase: "前夜", kind: "背景", major: true,
    summary: "中央红军难以在原地扭转战局，战略转移成为被迫选择。",
    detail: "1933年下半年，国民党军队对中央苏区发动第五次“围剿”。受“左”倾教条主义错误影响，红军和中央苏区遭受重大损失。长征的直接军事背景由此形成。", source: [1, 4],
  },
  {
    id: "yudu", date: "1934.10.10 / 10.17", sort: 1934.78, title: "离开瑞金，渡过于都河", place: "江西瑞金 · 于都", phase: "突围", kind: "行军", major: true,
    summary: "10日发布行动命令，中央机关离瑞金；17日主力渡于都河。",
    detail: "10月10日晚，中共中央、中革军委率中央红军主力向于都集结；16日集结完毕，17日从多个渡口南渡于都河。两个日期对应不同环节，不宜混写为同一天。", source: [4, 5],
  },
  {
    id: "xiangjiang", date: "1934.11.27—12.01", sort: 1934.91, title: "湘江战役", place: "广西全州 · 兴安一带", phase: "突围", kind: "战役", major: true,
    summary: "突破第四道封锁线，中央红军由8.6万余人锐减至3万余人。",
    detail: "红军苦战五昼夜，至12月1日17时，中央机关和红军主力大部渡过湘江。此役粉碎围歼中央红军于湘江以东的企图，也付出极其惨重的代价。", source: [4, 6],
  },
  {
    id: "tongdao", date: "1934.12.12", sort: 1934.95, title: "通道会议", place: "湖南通道", phase: "转折", kind: "会议",
    summary: "在危急形势下讨论转兵贵州，改变原定北上湘西的方向。",
    detail: "中共中央负责人举行紧急会议，多数与会者赞成毛泽东提出的转向方针。随后黎平会议正式通过新的战略方针决定。", source: [4],
  },
  {
    id: "liping", date: "1934.12.18", sort: 1934.96, title: "黎平会议", place: "贵州黎平", phase: "转折", kind: "会议",
    summary: "放弃到湘西会合的原计划，决定向以遵义为中心的黔北地区挺进。",
    detail: "中央政治局通过《中央政治局关于战略方针之决定》。会后红军向黔北挺进，为遵义会议的召开创造了条件。", source: [4],
  },
  {
    id: "zunyi", date: "1935.01.15—17", sort: 1935.04, title: "遵义会议", place: "贵州遵义", phase: "转折", kind: "会议", major: true,
    summary: "集中解决当时具有决定意义的军事和组织问题。",
    detail: "会议总结第五次反“围剿”以来的经验教训，事实上确立了毛泽东同志在党中央和红军的领导地位，开启党独立自主解决中国革命实际问题的新阶段，是生死攸关的转折点。", source: [1],
  },
  {
    id: "chishui", date: "1935.01.19—03.22", sort: 1935.16, title: "四渡赤水", place: "川黔滇边境", phase: "转折", kind: "战役", major: true,
    summary: "在川黔滇边境迂回机动，打乱国民党军队的追剿部署。",
    detail: "中央红军四次渡过赤水河，在运动中调动对手、寻求战机。此处采用1月19日至3月22日的战役进程口径。", source: [1],
  },
  {
    id: "jiaLing", date: "1935.03.28—31", sort: 1935.24, title: "红四方面军强渡嘉陵江", place: "四川苍溪 · 阆中一带", phase: "北上", kind: "战役",
    summary: "红四方面军西渡嘉陵江，开始长征。",
    detail: "为向川甘边发展并配合中央红军作战，红四方面军发起嘉陵江战役。3月28日晚开始渡江，主力随后突破嘉陵江防线，踏上长征征程。", source: [11],
  },
  {
    id: "jinsha", date: "1935.05.03—09", sort: 1935.35, title: "巧渡金沙江", place: "云南皎平渡", phase: "北上", kind: "战役",
    summary: "中央红军渡过金沙江，跳出数十万敌军围追堵截的圈子。",
    detail: "红军以机动赢得渡江时间，自5月3日至9日全部渡过金沙江，取得战略转移中的决定性胜利之一。", source: [1],
  },
  {
    id: "luding", date: "1935.05.29", sort: 1935.41, title: "飞夺泸定桥", place: "四川泸定", phase: "北上", kind: "战役", major: true,
    summary: "沿大渡河北上夺桥，打开继续前进的通道。",
    detail: "在安顺场强渡大渡河后，红军主力沿大渡河两岸北上。5月29日，突击队员夺占泸定桥，后续部队由此通过。", source: [1],
  },
  {
    id: "maogong", date: "1935.06.12—18", sort: 1935.45, title: "懋功会师", place: "四川懋功（今小金）", phase: "北上", kind: "会师", major: true,
    summary: "中央红军与红四方面军会师，红军主力会合一处。",
    detail: "6月12日，中央红军先头部队翻越夹金山后，在达维与红四方面军先头部队会师；18日，中共中央、中革军委和中央红军主力到达懋功地区。", source: [3],
  },
  {
    id: "grassland", date: "1935.08 下旬", sort: 1935.62, title: "穿越松潘草地", place: "川西北松潘草地", phase: "北上", kind: "行军", major: true,
    summary: "红军左右路军穿越茫茫草地，分别抵达阿坝、巴西等地。",
    detail: "按照北上部署，左、右路军从卓克基、毛儿盖等地出发，跨越高寒湿地。粮食匮乏、气候多变与复杂地形使这段行军异常艰难。", source: [1, 11],
  },
  {
    id: "yongping", date: "1935.09.15—18", sort: 1935.7, title: "红二十五军到达陕北", place: "陕西延川永坪镇", phase: "北上", kind: "会师",
    summary: "红二十五军与西北红军会师，随后合编为红十五军团。",
    detail: "红二十五军于1934年11月16日从河南罗山何家冲出发，1935年9月15日到达永坪镇；16日举行会师，18日与红二十六、二十七军合编为红十五军团。", source: [3, 7],
  },
  {
    id: "wuqi", date: "1935.10.19", sort: 1935.8, title: "中央红军到达吴起镇", place: "陕西吴起", phase: "北上", kind: "行军", major: true,
    summary: "中央红军到达陕北，与红十五军团会合。",
    detail: "陕甘支队到达吴起镇，中央红军历时一年的长征结束。这里的“长征结束”特指中央红军；整个红军长征的结束节点在1936年10月。", source: [10],
  },
  {
    id: "sangzhi", date: "1935.11.19", sort: 1935.88, title: "红二、六军团战略转移", place: "湖南桑植刘家坪", phase: "北上", kind: "行军",
    summary: "红二、红六军团从湘鄂川黔根据地出发，开始战略转移。",
    detail: "面对新的军事形势，红二、六军团主力突围西进，后经贵州、云南北上，于1936年夏与红四方面军在甘孜会师。", source: [8],
  },
  {
    id: "ganzi", date: "1936.07.05", sort: 1936.51, title: "红二方面军组成", place: "四川甘孜", phase: "会师", kind: "会师",
    summary: "红二、六军团与红三十二军合编为红二方面军，随后共同北上。",
    detail: "红二、六军团同红四方面军会师后，根据中革军委命令合编为红二方面军。红二、四方面军决定共同北上，同中共中央和红一方面军会合。", source: [8],
  },
  {
    id: "huining", date: "1936.10.09", sort: 1936.77, title: "会宁会师", place: "甘肃会宁", phase: "会师", kind: "会师", major: true,
    summary: "红四方面军指挥部到达会宁，同红一方面军会合。",
    detail: "10月9日两军会师，10月10日黄昏举行庆祝会师联欢大会。此时红二方面军仍在北上途中，因此10月22日的将台堡会师是另一不可省略的收官节点。", source: [2, 9],
  },
  {
    id: "jiangtaipu", date: "1936.10.22", sort: 1936.81, title: "将台堡会师", place: "将台堡（今宁夏西吉）", phase: "会师", kind: "会师", major: true,
    summary: "红二方面军同红一方面军会师，三大主力胜利会师。",
    detail: "红二方面军总指挥部及红二军团到达将台堡，与红一方面军会师。至此，红军三大主力胜利会师，长征宣告结束。", source: [2, 9],
  },
  {
    id: "shanchengbao", date: "1936.11", sort: 1936.86, title: "山城堡战役", place: "甘肃环县山城堡", phase: "后续", kind: "战役",
    summary: "三大主力会师后密切协同，取得山城堡战役胜利。",
    detail: "此役是三大主力会师后的协同作战，对巩固陕甘革命根据地、推动停止内战和共同抗日产生重要影响。", source: [2],
  },
];

export const MARCH_SOURCES = [
  { id: 1, title: "新时代 新长征——纪念中国工农红军长征胜利90周年", org: "中国网", url: "https://news.china.com.cn/2026-09/21/content_118706138.shtml" },
  { id: 2, title: "红军三大主力会师", org: "中国共产党新闻网", url: "https://cpc.people.com.cn/GB/33837/2534323.html" },
  { id: 3, title: "红军长征中的会师", org: "中华人民共和国国防部", url: "https://www.mod.gov.cn/gfbw/gfjy_index/16418522.html" },
  { id: 4, title: "中央红军被迫长征", org: "中央党史和文献研究院", url: "https://www.dswxyjy.org.cn/n/2013/1030/c244520-23368678.html" },
  { id: 5, title: "出发集结，踏上战略大转移的征途", org: "《光明日报》 / 中国西藏网转载", url: "https://www.tibet.cn/cn/Instant/municipal/202609/t20260907_8044239.html" },
  { id: 6, title: "血战湘江：红军长征中最惨烈之战", org: "新华社", url: "https://www.xinhuanet.com/politics/2018-12/20/c_1123881520.htm" },
  { id: 7, title: "揭秘：哪支红军队伍在长征中人数不减反增", org: "中央党史和文献研究院", url: "https://www.dswxyjy.org.cn/n1/2016/1012/c396983-28772382.html" },
  { id: 8, title: "甘孜会师，团结意义重大", org: "《光明日报》", url: "https://epaper.gmw.cn/gmrb/html/content/202610/20/content_27697.html" },
  { id: 9, title: "“我们胜利会师了！”", org: "中华人民共和国国防部", url: "https://www.mod.gov.cn/gfbw/gfjy_index/zyhd/4848435.html" },
  { id: 10, title: "红军陕甘支队始末", org: "中央党史和文献研究院", url: "https://www.dswxyjy.org.cn/n1/2026/0911/c244516-40797105.html" },
  { id: 11, title: "雪山草地铸丰碑 团结北上开新局——四川与红军长征", org: "中央党史和文献研究院", url: "https://www.dswxyjy.org.cn/n1/2026/0923/c244516-40804336.html" },
];
