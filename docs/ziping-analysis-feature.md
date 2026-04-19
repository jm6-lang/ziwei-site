# 紫微斗数排盘分析功能技术方案

## 功能概述

在主页添加紫微斗数排盘分析窗口，用户输入出生信息后，系统自动排出命盘并分析：
- **前十年大事回顾**（10 年前至今）
- **未来十年运势预测**（今后 10 年）

## 技术架构

### 1. 核心模块

#### 1.1 排盘引擎 (`src/lib/ziping-calculator.ts`)
- 生辰八字计算（年月日时四柱）
- 定五行局
- 安紫微星（根据生日和时辰）
- 安十四主星
- 安辅星、煞星
- 排十二宫位
- 起大限（十年大运）

#### 1.2 运势分析引擎 (`src/lib/fortune-analyzer.ts`)
- 大限流年起法
- 宫位转换规则
- 星曜组合解读
- 十年运势生成算法

#### 1.3 UI 组件 (`src/components/ZipingChart.astro`)
- 出生信息输入表单
- 命盘展示（十二宫位图）
- 十年运势时间轴
- 详细分析报告

### 2. 数据结构

```typescript
interface BirthInfo {
  year: number;      // 出生年份（公历）
  month: number;     // 出生月份
  day: number;       // 出生日期
  hour: number;      // 出生时辰（0-23）
  gender: 'male' | 'female';  // 性别
}

interface ZiWeiChart {
  lifePalace: Palace;    // 命宫
  bodyPalace: Palace;    // 身宫
  palaces: Palace[];     // 十二宫位
  majorStars: Star[];    // 十四主星
  minorStars: Star[];    // 辅星煞星
  fiveElementPhase: string; // 五行局
  daXian: DaXianPeriod[];   // 大限运程
}

interface Palace {
  name: string;        // 宫位名称
  position: number;    // 宫位位置（0-11）
  earthlyBranch: string; // 地支
  heavenlyStem: string;  // 天干
  stars: Star[];       // 宫内星曜
}

interface Star {
  name: string;        // 星曜名称
  type: 'major' | 'minor' | 'evil'; // 星曜类型
  brightness: string;  // 亮度（庙旺利陷）
}

interface DaXianPeriod {
  startAge: number;    // 起始年龄
  endAge: number;      // 结束年龄
  palaceIndex: number; // 对应宫位
  decade: string;      // 对应年代
  analysis: string;    // 运势分析
}
```

### 3. 实现步骤

#### Phase 1: 核心算法（优先级最高）
1. 实现天干地支转换
2. 实现生辰八字计算
3. 实现紫微星定位算法
4. 实现十四主星排列
5. 实现十二宫位排布
6. 实现大限起法

#### Phase 2: 运势分析
1. 实现大限与流年对应
2. 实现宫位转换（本命→大限→流年）
3. 编写星曜组合解读规则库
4. 生成十年运势文本

#### Phase 3: UI 集成
1. 创建排盘输入表单组件
2. 创建命盘可视化组件
3. 创建十年运势展示组件
4. 优化主页布局，嵌入排盘窗口

### 4. 紫薇斗数排盘核心算法参考

#### 4.1 定五行局
根据生年天干和命宫地支确定：
- 甲己子午九，乙庚丑未八
- 丙辛寅申七，丁壬卯酉六
- 戊癸辰戌五，巳亥单四数

#### 4.2 安紫微星
公式：`紫微星位置 = (生日 + 修正值) % 12`
修正值根据五行局确定：
- 水二局：+2
- 木三局：+3
- 金四局：+4
- 土五局：+5
- 火六局：+6

#### 4.3 起大限
- 阳男阴女：顺行（从命宫开始顺时针）
- 阴男阳女：逆行（从命宫开始逆时针）
- 起限年龄：根据五行局确定（水 2 岁、木 3 岁、金 4 岁、土 5 岁、火 6 岁）

## 文件结构

```
src/
├── components/
│   ├── ZipingChart.astro         # 排盘主组件
│   ├── BirthInputForm.astro      # 出生信息输入表单
│   ├── PalaceGrid.astro          # 十二宫位网格展示
│   ├── FortuneTimeline.astro     # 十年运势时间轴
│   └── AnalysisReport.astro      # 详细分析报告
├── lib/
│   ├── ziping-calculator.ts      # 排盘核心算法
│   ├── fortune-analyzer.ts       # 运势分析引擎
│   ├── star-meanings.ts          # 星曜含义数据库
│   └── palace-interpreter.ts     # 宫位解读规则
├── styles/
│   └── ziping-chart.css          # 排盘组件样式
└── content/
    └── docs/
        └── analysis/
            ├── how-to-use-chart.md  # 使用指南
            └── ten-year-fortune.md  # 十年运势说明
```

## 主页集成方案

在现有 `index.mdx` 中添加：

```mdx
<div class="ziping-chart-section">
  <h2>在线排盘 · 十年运势分析</h2>
  <p>输入您的出生信息，获取专属命盘与前十年回顾、未来十年预测</p>
  
  <!-- 排盘组件将在这里渲染 -->
  <client:load>
    <ZipingChart />
  </client:load>
</div>
```

## 下一步行动

1. ✅ 创建排盘算法核心库
2. ⏳ 实现运势分析引擎
3. ⏳ 开发 UI 组件
4. ⏳ 集成到主页
5. ⏳ 测试与优化
