<div align="center">

# 历史图集

**Atlas of History**

把时间画成纸上的长卷。考古学分期、史学划分、朝代、遗址与大事，
被放在同一根竖直的时间脊上彼此对齐——看清每段历史站在哪个坐标，
也看清不同的分期方法如何各说各话。

**[在线开卷 →](https://jianxing-chen.github.io/history-atlas/)**

三卷 · 300 余条目 · 竖版 · 可点击展开

</div>

---

## 卷目

| | 卷 | 题记 | 开卷 |
| --- | --- | --- | --- |
| 卷一 | **中国卷** | 考古学时代 / 史学划分 / 朝代更迭 / 遗址·文化·古人类 / 大事记——五种分期体系在五条泳道上互相对齐。约 200 万年前至今，136 条。 | [在线开卷](https://jianxing-chen.github.io/history-atlas/china) |
| 卷二 | **世界卷** | 中国 / 两河·埃及·中东 / 印度 / 欧洲 / 东亚·东南亚 / 美洲·非洲六列并排：二里头与汉谟拉比、秦统一与亚历山大、郑和与哥伦布，一眼对齐。前 3500 年至今，161 节点。 | [在线开卷](https://jianxing-chen.github.io/history-atlas/world) |
| 卷三 | **方法卷** | 同一条时间，六把尺：考古学 / 文献 / 王朝 / 社会形态 / 年鉴学派 / 全球史——每把尺的依据、适用边界与争议。 | [在线开卷](https://jianxing-chen.github.io/history-atlas/methods) |

## 凡例

1. **时间向下流。** 长卷竖排，自上而下即自远古而至当代。
2. **同脊对照。** 中国卷五条泳道共用一根时间脊，同一横排即同一时期，可左右对读；世界卷六列同理。
3. **点击展开。** 任意条目点开即见详细解说与今址。世界卷默认纲要视图（只列 ★ 大事），点列头或「全展」可见全部条目。
4. **横贯线。** 世界卷中横贯六列的棕色虚线是跨地区·全球性事件——蒙古帝国、黑死病、新旧大陆相遇、两次世界大战，沿虚线横读，即同一时刻的世界。
5. **争议不抹平。** 凡有争议与异说之处均予标注，条目解说写明分歧所在。

## 设色

纸面取彩铅纸色，墨线取石墨色，标题用宋体、正文用黑体，卷首钤「史」字篆印。
五条泳道各占一色：

| 泳道 | 颜料 | 色值 |
| --- | --- | --- |
| 考古学时代 | 青蓝 | `#4a6d9c` |
| 史学划分 | 灰褐 | `#8a8578` |
| 朝代更迭 | 朱红 | `#b4574a` |
| 遗址·文化·古人类 | 苍绿 | `#5f7f63` |
| 大事记 | 紫 | `#7d6b8a` |

## 依据

年代主要依据夏商周断代工程、中华文明探源工程及通行世界史年表；
有争议的年代在条目解说中注明异说。全部内容为静态数据条目，
见 [`src/data/china.ts`](src/data/china.ts) 与 [`src/data/world.ts`](src/data/world.ts)，
欢迎订误与补充。

## 制图

React 19 · Vite · TypeScript · Tailwind CSS。
时间轴排布逻辑集中在 `src/lib/pack.ts`（区间道防碰撞分轨 + 时间点下推），
页面渲染与校验脚本共用同一份实现。

```bash
npm install
npm run dev          # 本地开发服务器
npm run build        # 生产构建（含 TypeScript 检查，postbuild 自动生成 404.html）
npm run check:layout # 布局对齐回归校验：12 组断言，钉位、零重叠、数据卫生
```

修改数据或布局后，请先跑 `check:layout` 再提交。

## 部署

推送到 `main` 即由 GitHub Actions 自动校验、构建并发布到 GitHub Pages
（见 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)）。
站点发布在 **https://jianxing-chen.github.io/history-atlas/**；
若仓库改名，请同步修改 `vite.config.ts` 的 `base` 与 `src/main.tsx` 的 `basename`。
