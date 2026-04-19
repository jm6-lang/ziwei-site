/**
 * 紫微斗数排盘核心计算器
 * 实现生辰八字、十四主星、十二宫位、大限运程的完整算法
 */

// ========== 基础数据定义 ==========

export const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const palaceNames = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
  '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
];

export const majorStarNames = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞',
  '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'
];

// 五行局定义
export const fiveElementPhases = {
  2: '水二局',
  3: '木三局',
  4: '金四局',
  5: '土五局',
  6: '火六局'
} as const;

// ========== 类型定义 ==========

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
}

export interface Star {
  name: string;
  type: 'major' | 'minor' | 'evil' | 'auxiliary';
  brightness?: '庙' | '旺' | '利' | '陷';
  position: number; // 宫位索引 (0-11)
}

export interface Palace {
  index: number;
  name: string;
  earthlyBranch: string;
  heavenlyStem: string;
  stars: Star[];
}

export interface DaXianPeriod {
  startAge: number;
  endAge: number;
  palaceIndex: number;
  palaceName: string;
  decadeStart: number;
  decadeEnd: number;
  analysis: string;
}

export interface ZiWeiChart {
  birthInfo: BirthInfo;
  lifePalaceIndex: number;
  bodyPalaceIndex: number;
  fiveElementPhase: string;
  fiveElementPhaseNumber: number;
  palaces: Palace[];
  majorStars: Star[];
  daXian: DaXianPeriod[];
  currentAge: number;
  currentDaXian: DaXianPeriod | null;
}

// ========== 工具函数 ==========

/**
 * 计算天干
 */
function getHeavenlyStem(year: number): string {
  return heavenlyStems[(year - 4) % 10];
}

/**
 * 计算地支
 */
function getEarthlyBranch(year: number): string {
  return earthlyBranches[(year - 4) % 12];
}

/**
 * 获取时辰的地支（2 小时为一个时辰）
 */
function getHourBranch(hour: number): string {
  // 子时：23-1, 丑时：1-3, 寅时：3-5, ...
  const branchIndex = Math.floor((hour + 1) / 2) % 12;
  return earthlyBranches[branchIndex];
}

/**
 * 计算生辰八字（简化版）
 */
export function calculateEightCharacters(birth: BirthInfo): string {
  const yearStem = getHeavenlyStem(birth.year);
  const yearBranch = getEarthlyBranch(birth.year);
  const monthBranch = earthlyBranches[(birth.month - 1) % 12];
  const hourBranch = getHourBranch(birth.hour);
  
  return `${yearStem}${yearBranch}年 ${getMonthStem(birth.year, birth.month)}${monthBranch}月 ${getDayStemBranch(birth)}日 ${getHourStem(birth)}${hourBranch}时`;
}

function getMonthStem(year: number, month: number): string {
  const yearStemIndex = (year - 4) % 10;
  // 根据年干起月干（五虎遁）
  const monthStemMap: Record<number, number[]> = {
    0: [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3], // 甲己之年丙作首
    1: [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5], // 乙庚之岁戊为头
    2: [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7], // 丙辛之岁寻庚上
    3: [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // 丁壬壬寅顺水流
    4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1], // 戊癸之年甲寅首
    5: [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
    6: [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
    7: [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
    8: [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    9: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]
  };
  const stemIndex = monthStemMap[yearStemIndex][month - 1];
  return heavenlyStems[stemIndex];
}

function getDayStemBranch(birth: BirthInfo): string {
  // 简化：使用公历日期推算（实际需要查表）
  // 这里用一个近似算法
  const baseDate = new Date(1900, 0, 31); // 1900 年 1 月 31 日是甲子日
  const targetDate = new Date(birth.year, birth.month - 1, birth.day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const stemIndex = (diffDays % 10 + 10) % 10;
  const branchIndex = (diffDays % 12 + 12) % 12;
  
  return heavenlyStems[stemIndex] + earthlyBranches[branchIndex];
}

function getHourStem(birth: BirthInfo): string {
  const dayStemBranch = getDayStemBranch(birth);
  const dayStem = dayStemBranch.charAt(0);
  const dayStemIndex = heavenlyStems.indexOf(dayStem);
  
  // 五鼠遁：根据日干起时干
  const hourStemMap: Record<number, number[]> = {
    0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2], // 甲己还加甲
    1: [3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4], // 乙庚丙作初
    2: [5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6], // 丙辛从戊起
    3: [7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8], // 丁壬庚子居
    4: [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0], // 戊癸何方发
    5: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
    6: [3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
    7: [5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
    8: [7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    9: [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  };
  
  const hourIndex = Math.floor((birth.hour + 1) / 2) % 12;
  const stemIndex = hourStemMap[dayStemIndex][hourIndex];
  return heavenlyStems[stemIndex];
}

/**
 * 确定五行局
 * 根据纳音五行和命宫地支确定
 */
export function determineFiveElementPhase(birth: BirthInfo, lifePalaceIndex: number): { phase: string; number: number } {
  const yearStem = getHeavenlyStem(birth.year);
  const yearBranch = getEarthlyBranch(birth.year);
  
  // 纳音五行计算（简化版）
  const stemIndex = heavenlyStems.indexOf(yearStem);
  const branchIndex = earthlyBranches.indexOf(yearBranch);
  
  // 根据六十甲子纳音
  const naYinMap: Record<string, number> = {
    '甲子': 2, '乙丑': 2, '丙寅': 3, '丁卯': 3, // 海中金、炉中火...
    '戊辰': 4, '己巳': 4, '庚午': 5, '辛未': 5,
    '壬申': 6, '癸酉': 6, '甲戌': 2, '乙亥': 2,
    '丙子': 3, '丁丑': 3, '戊寅': 4, '己卯': 4,
    '庚辰': 5, '辛巳': 5, '壬午': 6, '癸未': 6,
    '甲申': 2, '乙酉': 2, '丙戌': 3, '丁亥': 3,
    '戊子': 4, '己丑': 4, '庚寅': 5, '辛卯': 5,
    '壬辰': 6, '癸巳': 6, '甲午': 2, '乙未': 2,
    '丙申': 3, '丁酉': 3, '戊戌': 4, '己亥': 4,
    '庚子': 5, '辛丑': 5, '壬寅': 6, '癸卯': 6,
    '甲辰': 2, '乙巳': 2, '丙午': 3, '丁未': 3,
    '戊申': 4, '己酉': 4, '庚戌': 5, '辛亥': 5,
    '壬子': 6, '癸丑': 6, '甲寅': 2, '乙卯': 2,
    '丙辰': 3, '丁巳': 3, '戊午': 4, '己未': 4,
    '庚申': 5, '辛酉': 5, '壬戌': 6, '癸亥': 6
  };
  
  const key = yearStem + yearBranch;
  const phaseNumber = naYinMap[key] || 2;
  
  return {
    phase: fiveElementPhases[phaseNumber as keyof typeof fiveElementPhases],
    number: phaseNumber
  };
}

/**
 * 安紫微星
 * 根据生日和五行局确定紫微星位置
 */
export function placeZiWeiStar(birthDay: number, fiveElementPhaseNumber: number): number {
  // 紫微星口诀：「紫微逆行非等闲，生日加上修正数」
  // 修正值：水 2+2, 木 3+3, 金 4+4, 土 5+5, 火 6+6
  const correction = fiveElementPhaseNumber;
  const position = (birthDay + correction - 1) % 12;
  return position;
}

/**
 * 安十四主星
 * 紫微星定位后，其他星按固定顺序排列
 */
export function placeMajorStars(ziWeiPosition: number, birthDay: number, fiveElementPhaseNumber: number): Star[] {
  const stars: Star[] = [];
  
  // 紫微星
  stars.push({
    name: '紫微',
    type: 'major',
    position: ziWeiPosition
  });
  
  // 天机星：紫微逆时针一位
  stars.push({
    name: '天机',
    type: 'major',
    position: (ziWeiPosition - 1 + 12) % 12
  });
  
  // 太阳星：根据生日定亮度
  const sunPosition = (ziWeiPosition + 2) % 12;
  stars.push({
    name: '太阳',
    type: 'major',
    brightness: birthDay <= 15 ? '庙' : '旺',
    position: sunPosition
  });
  
  // 武曲星
  stars.push({
    name: '武曲',
    type: 'major',
    position: (ziWeiPosition + 3) % 12
  });
  
  // 天同星
  stars.push({
    name: '天同',
    type: 'major',
    position: (ziWeiPosition + 4) % 12
  });
  
  // 廉贞星
  stars.push({
    name: '廉贞',
    type: 'major',
    position: (ziWeiPosition + 5) % 12
  });
  
  // 天府星：与紫微相对
  const tianFuPosition = (ziWeiPosition + 6) % 12;
  stars.push({
    name: '天府',
    type: 'major',
    position: tianFuPosition
  });
  
  // 太阴星
  stars.push({
    name: '太阴',
    type: 'major',
    brightness: birthDay > 15 ? '庙' : '旺',
    position: (tianFuPosition + 1) % 12
  });
  
  // 贪狼星
  stars.push({
    name: '贪狼',
    type: 'major',
    position: (tianFuPosition + 2) % 12
  });
  
  // 巨门星
  stars.push({
    name: '巨门',
    type: 'major',
    position: (tianFuPosition + 3) % 12
  });
  
  // 天相星
  stars.push({
    name: '天相',
    type: 'major',
    position: (tianFuPosition + 4) % 12
  });
  
  // 天梁星
  stars.push({
    name: '天梁',
    type: 'major',
    position: (tianFuPosition + 5) % 12
  });
  
  // 七杀星
  stars.push({
    name: '七杀',
    type: 'major',
    position: (tianFuPosition + 6) % 12
  });
  
  // 破军星
  stars.push({
    name: '破军',
    type: 'major',
    position: (tianFuPosition + 7) % 12
  });
  
  return stars;
}

/**
 * 定命宫
 * 根据出生月份和时辰确定命宫位置
 */
export function determineLifePalace(birthMonth: number, birthHour: number): number {
  // 命宫口诀：「寅起正月顺数至生月，再从该位起子时逆数至生时」
  // 简化算法：正月在寅 (2)，顺数到生月，再逆数到生时
  
  const monthOffset = (birthMonth - 1) % 12;
  const hourIndex = Math.floor((birthHour + 1) / 2) % 12;
  
  // 从寅位 (索引 2) 开始
  let position = (2 + monthOffset) % 12;
  // 逆数到时支
  position = (position - hourIndex + 12) % 12;
  
  return position;
}

/**
 * 定身宫
 * 身宫永远在迁移宫（命宫对宫）
 */
export function determineBodyPalace(lifePalaceIndex: number): number {
  return (lifePalaceIndex + 6) % 12;
}

/**
 * 排十二宫位
 */
export function arrangePalaces(lifePalaceIndex: number, majorStars: Star[]): Palace[] {
  const palaces: Palace[] = [];
  
  for (let i = 0; i < 12; i++) {
    // 从命宫开始顺时针排列
    const palaceIndex = (lifePalaceIndex + i) % 12;
    
    palaces.push({
      index: i,
      name: palaceNames[i],
      earthlyBranch: earthlyBranches[palaceIndex],
      heavenlyStem: heavenlyStems[palaceIndex % 10],
      stars: majorStars.filter(star => star.position === palaceIndex)
    });
  }
  
  return palaces;
}

/**
 * 起大限（十年大运）
 */
export function calculateDaXian(
  lifePalaceIndex: number,
  fiveElementPhaseNumber: number,
  birthYear: number,
  gender: 'male' | 'female'
): DaXianPeriod[] {
  const daXian: DaXianPeriod[] = [];
  
  // 起限年龄
  const startAge = fiveElementPhaseNumber;
  
  // 阳男阴女顺行，阴男阳女逆行
  const yearStem = getHeavenlyStem(birthYear);
  const isYangMale = gender === 'male' && ['甲', '丙', '戊', '庚', '壬'].includes(yearStem);
  const isYinFemale = gender === 'female' && ['乙', '丁', '己', '辛', '癸'].includes(yearStem);
  const isForward = isYangMale || isYinFemale;
  
  // 计算每 10 年的大限
  for (let i = 0; i < 7; i++) {
    const palaceIndex = isForward 
      ? (lifePalaceIndex + i) % 12 
      : (lifePalaceIndex - i + 12) % 12;
    
    const decadeStart = birthYear + startAge + (i * 10);
    const decadeEnd = decadeStart + 9;
    
    daXian.push({
      startAge: startAge + (i * 10),
      endAge: startAge + (i * 10) + 9,
      palaceIndex: palaceIndex,
      palaceName: palaceNames[(lifePalaceIndex + i) % 12],
      decadeStart,
      decadeEnd,
      analysis: generateDaXianAnalysis(palaceNames[(lifePalaceIndex + i) % 12], i)
    });
  }
  
  return daXian;
}

/**
 * 生成大限运势分析
 */
function generateDaXianAnalysis(palaceName: string, periodIndex: number): string {
  const analyses: Record<string, string> = {
    '命宫': '此十年为本我发展期，个性特质得以展现，是人生方向确立的重要阶段。',
    '兄弟宫': '此十年手足情深，朋友助力明显，适合团队合作与人际拓展。',
    '夫妻宫': '此十年感情生活丰富，已婚者需用心经营，未婚者易遇良缘。',
    '子女宫': '此十年子女缘佳，或有创作、投资方面的收获。',
    '财帛宫': '此十年财运亨通，正偏财皆有，但需注意理财规划。',
    '疾厄宫': '此十年需关注健康，定期体检，避免过度劳累。',
    '迁移宫': '此十年宜外出发展，远行有利，可能搬迁或变换环境。',
    '交友宫': '此十年社交活跃，贵人相助，但需防小人。',
    '官禄宫': '此十年事业上升期，工作表现突出，有升迁机会。',
    '田宅宫': '此十年家运昌隆，适合购置房产，家庭和睦。',
    '福德宫': '此十年精神富足，兴趣爱好得到发展，晚年运佳。',
    '父母宫': '此十年长辈缘佳，得父母师长提携，学业有成。'
  };
  
  return analyses[palaceName] || '此十年运势平稳，顺其自然即可。';
}

/**
 * 计算当前年龄所在的大限
 */
export function getCurrentDaXian(daXian: DaXianPeriod[], currentAge: number): DaXianPeriod | null {
  return daXian.find(dx => currentAge >= dx.startAge && currentAge <= dx.endAge) || null;
}

// ========== 主函数：完整排盘 ==========

/**
 * 执行完整的紫微斗数排盘
 */
export function calculateZiWeiChart(birthInfo: BirthInfo): ZiWeiChart {
  // 1. 定命宫
  const lifePalaceIndex = determineLifePalace(birthInfo.month, birthInfo.hour);
  
  // 2. 定身宫
  const bodyPalaceIndex = determineBodyPalace(lifePalaceIndex);
  
  // 3. 定五行局
  const { phase: fiveElementPhase, number: fiveElementPhaseNumber } = 
    determineFiveElementPhase(birthInfo, lifePalaceIndex);
  
  // 4. 安紫微星
  const ziWeiPosition = placeZiWeiStar(birthInfo.day, fiveElementPhaseNumber);
  
  // 5. 安十四主星
  const majorStars = placeMajorStars(ziWeiPosition, birthInfo.day, fiveElementPhaseNumber);
  
  // 6. 排十二宫位
  const palaces = arrangePalaces(lifePalaceIndex, majorStars);
  
  // 7. 起大限
  const daXian = calculateDaXian(lifePalaceIndex, fiveElementPhaseNumber, birthInfo.year, birthInfo.gender);
  
  // 8. 计算当前年龄和当前大限
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthInfo.year;
  const currentDaXian = getCurrentDaXian(daXian, currentAge);
  
  return {
    birthInfo,
    lifePalaceIndex,
    bodyPalaceIndex,
    fiveElementPhase,
    fiveElementPhaseNumber,
    palaces,
    majorStars,
    daXian,
    currentAge,
    currentDaXian
  };
}

/**
 * 生成十年运势详细分析（过去 10 年和未来 10 年）
 */
export function generateTenYearFortune(chart: ZiWeiChart): { past: string; future: string } {
  const currentAge = chart.currentAge;
  const currentDaXian = chart.currentDaXian;
  
  if (!currentDaXian) {
    return { past: '无法计算过往运势', future: '无法计算未来运势' };
  }
  
  // 过去十年分析
  const pastAnalysis = `
## 前十年运势回顾 (${currentAge - 10}岁 - ${currentAge}岁)

### 所处大限：${currentDaXian.palaceName} (${currentDaXian.decadeStart - 10}-${currentDaXian.decadeEnd - 10})

这十年您处于${currentDaXian.palaceName}的大限影响下，${currentDaXian.analysis}

**主要特征：**
- 这是您人生的第${Math.floor(currentAge / 10)}个十年周期
- 大限宫位显示此阶段的${getPalaceFocus(currentDaXian.palaceName)}
- 命盘中的主星配置影响了您的${getStarInfluence(chart.majorStars)}

**可能发生的重要事件：**
${generatePastEvents(chart, currentDaXian)}
`.trim();
  
  // 未来十年分析
  const nextDaXianIndex = chart.daXian.indexOf(currentDaXian) + 1;
  const nextDaXian = chart.daXian[nextDaXianIndex];
  
  let futureAnalysis = `
## 未来十年运势预测 (${currentAge}岁 - ${currentAge + 10}岁)

### 当前大限：${currentDaXian.palaceName} (${currentDaXian.decadeStart}-${currentDaXian.decadeEnd})

${currentDaXian.analysis}

**运势重点：**
- **事业方面**：${getCareerPrediction(chart, currentDaXian)}
- **财富方面**：${getWealthPrediction(chart, currentDaXian)}
- **感情方面**：${getLovePrediction(chart, currentDaXian)}
- **健康方面**：${getHealthPrediction(chart, currentDaXian)}
`.trim();
  
  if (nextDaXian) {
    futureAnalysis += `

### 下一步大限：${nextDaXian.palaceName} (${nextDaXian.decadeStart}-${nextDaXian.decadeEnd})

${nextDaXian.analysis}

**提前准备：**
- 下一个大限将进入${nextDaXian.palaceName}，建议提前规划${getNextDaXianAdvice(nextDaXian.palaceName)}
`;
  }
  
  return {
    past: pastAnalysis,
    future: futureAnalysis
  };
}

// ========== 辅助分析函数 ==========

function getPalaceFocus(palaceName: string): string {
  const focus: Record<string, string> = {
    '命宫': '个人成长和自我实现',
    '兄弟宫': '人际关系和团队协作',
    '夫妻宫': '感情婚姻和家庭生活',
    '子女宫': '子女教育和创意表达',
    '财帛宫': '财富积累和理财规划',
    '疾厄宫': '健康管理和身心平衡',
    '迁移宫': '外出发展和环境变化',
    '交友宫': '社交网络和贵人助力',
    '官禄宫': '事业发展和职场成就',
    '田宅宫': '家庭建设和不动产',
    '福德宫': '精神追求和福气积累',
    '父母宫': '长辈关系和学业进修'
  };
  return focus[palaceName] || '各方面的发展';
}

function getStarInfluence(stars: Star[]): string {
  const majorStarNames = stars.filter(s => s.type === 'major').map(s => s.name);
  if (majorStarNames.length === 0) return '各方面运势';
  
  const starMeanings: Record<string, string> = {
    '紫微': '领导力和统御能力',
    '天机': '智慧和策划能力',
    '太阳': '名声和权力地位',
    '武曲': '执行力和财富创造',
    '天同': '福气和享乐生活',
    '廉贞': '情感和艺术天赋',
    '天府': '稳定和保守发展',
    '太阴': '内敛和细腻特质',
    '贪狼': '欲望和交际能力',
    '巨门': '口才和研究能力',
    '天相': '协调和辅助能力',
    '天梁': '保护和监督职责',
    '七杀': '突破和变革力量',
    '破军': '创新和破坏重建'
  };
  
  return majorStarNames.slice(0, 3).map(name => starMeanings[name]).join('、');
}

function generatePastEvents(chart: ZiWeiChart, daXian: DaXianPeriod): string {
  // 根据命盘生成可能的过往事件
  const events = [];
  
  if (chart.majorStars.some(s => s.name === '紫微')) {
    events.push('- 可能在事业或学业上取得重要成就或获得领导职位');
  }
  if (chart.majorStars.some(s => s.name === '太阳')) {
    events.push('- 可能有公开表现的机会，知名度提升');
  }
  if (daXian.palaceName === '夫妻宫') {
    events.push('- 感情生活可能有重大变化，如结婚、生子或分手');
  }
  if (daXian.palaceName === '财帛宫') {
    events.push('- 财务状况有明显波动，可能有意外之财或大额支出');
  }
  if (daXian.palaceName === '官禄宫') {
    events.push('- 事业发展关键期，可能有升职、跳槽或创业');
  }
  
  return events.join('\n') || '- 这是一个平稳发展的时期，各方面都有渐进式成长';
}

function getCareerPrediction(chart: ZiWeiChart, daXian: DaXianPeriod): string {
  if (daXian.palaceName === '官禄宫') {
    return '事业运势强劲，有升迁或创业良机，宜积极进取。';
  }
  if (chart.majorStars.some(s => s.name === '紫微' && s.position === daXian.palaceIndex)) {
    return '领导力得到发挥，有机会担任重要职务或负责重大项目。';
  }
  return '事业稳步发展，保持专业态度会有不错表现。';
}

function getWealthPrediction(chart: ZiWeiChart, daXian: DaXianPeriod): string {
  if (daXian.palaceName === '财帛宫') {
    return '财运亨通，正财偏财皆有收获，但需注意理性消费。';
  }
  if (chart.majorStars.some(s => s.name === '武曲' && s.position === daXian.palaceIndex)) {
    return '通过实际行动和专业技能可获得财富增长。';
  }
  return '财运平稳，做好理财规划可保收支平衡。';
}

function getLovePrediction(chart: ZiWeiChart, daXian: DaXianPeriod): string {
  if (daXian.palaceName === '夫妻宫') {
    return '感情运势活跃，单身者易遇良缘，已婚者需用心经营。';
  }
  if (chart.majorStars.some(s => s.name === '廉贞' && s.position === daXian.palaceIndex)) {
    return '情感丰富，浪漫气息浓厚，但需防情绪波动。';
  }
  return '感情生活平稳，多沟通理解可增进关系。';
}

function getHealthPrediction(chart: ZiWeiChart, daXian: DaXianPeriod): string {
  if (daXian.palaceName === '疾厄宫') {
    return '需特别关注健康，定期体检，避免过劳。';
  }
  return '健康状况良好，保持规律作息和适度运动即可。';
}

function getNextDaXianAdvice(palaceName: string): string {
  const advice: Record<string, string> = {
    '命宫': '自我提升和个人品牌建设',
    '夫妻宫': '感情沟通和家庭规划',
    '财帛宫': '理财知识学习和投资布局',
    '官禄宫': '职业技能精进和人脉拓展',
    '迁移宫': '外语学习和跨文化交流准备',
    '福德宫': '兴趣培养和心灵成长'
  };
  return advice[palaceName] || '相关领域的准备工作';
}
