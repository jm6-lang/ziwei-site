/**
 * 紫微斗数排盘核心计算器 v2.0
 * 完整实现：生辰八字、十四主星、十二宫位、大限运程、辅星系统、四化系统、流年分析
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

// 辅星定义（吉星）
export const minorStarNames = [
  '左辅', '右弼', '文昌', '文曲', '天魁', '天钺',
  '禄存', '天马', '擎羊', '陀罗', '火星', '铃星',
  '地空', '地劫', '天刑', '天姚', '红鸾', '天喜'
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
  position: number;
}

export interface SiHua {
  starName: string;
  huaType: '化禄' | '化权' | '化科' | '化忌';
  position: number;
  stem: string;
}

export interface Palace {
  index: number;
  name: string;
  earthlyBranch: string;
  heavenlyStem: string;
  stars: Star[];
  siHuaStars: SiHua[];
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

export interface LiuNianAnalysis {
  year: number;
  age: number;
  liuNianPalaceIndex: number;
  liuNianPalaceName: string;
  liuNianStars: Star[];
  siHuaInYear: SiHua[];
  fortune: string;
  career: string;
  wealth: string;
  love: string;
  health: string;
}

export interface ZiWeiChart {
  birthInfo: BirthInfo;
  lifePalaceIndex: number;
  bodyPalaceIndex: number;
  fiveElementPhase: string;
  fiveElementPhaseNumber: number;
  palaces: Palace[];
  majorStars: Star[];
  minorStars: Star[];
  siHuaStars: SiHua[];
  daXian: DaXianPeriod[];
  currentAge: number;
  currentDaXian: DaXianPeriod | null;
}

// ========== 工具函数 ==========

export function getHeavenlyStem(year: number): string {
  return heavenlyStems[(year - 4) % 10];
}

export function getEarthlyBranch(year: number): string {
  return earthlyBranches[(year - 4) % 12];
}

function getHourBranch(hour: number): string {
  const branchIndex = Math.floor((hour + 1) / 2) % 12;
  return earthlyBranches[branchIndex];
}

export function calculateEightCharacters(birth: BirthInfo): string {
  const yearStem = getHeavenlyStem(birth.year);
  const yearBranch = getEarthlyBranch(birth.year);
  const monthBranch = earthlyBranches[(birth.month - 1) % 12];
  const hourBranch = getHourBranch(birth.hour);
  
  return `${yearStem}${yearBranch}年 ${getMonthStem(birth.year, birth.month)}${monthBranch}月 ${getDayStemBranch(birth)}日 ${getHourStem(birth)}${hourBranch}时`;
}

function getMonthStem(year: number, month: number): string {
  const yearStemIndex = (year - 4) % 10;
  const monthStemMap: Record<number, number[]> = {
    0: [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
    1: [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
    2: [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
    3: [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
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
  const baseDate = new Date(1900, 0, 31);
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
  
  const hourStemMap: Record<number, number[]> = {
    0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
    1: [3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
    2: [5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
    3: [7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    4: [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
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
// ========== 核心排盘函数 ==========

export function determineFiveElementPhase(birth: BirthInfo, lifePalaceIndex: number): { phase: string; number: number } {
  const yearStem = getHeavenlyStem(birth.year);
  const yearBranch = getEarthlyBranch(birth.year);
  
  const naYinMap: Record<string, number> = {
    '甲子': 2, '乙丑': 2, '丙寅': 3, '丁卯': 3,
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

export function placeZiWeiStar(birthDay: number, fiveElementPhaseNumber: number): number {
  const correction = fiveElementPhaseNumber;
  const position = (birthDay + correction - 1) % 12;
  return position;
}

export function placeMajorStars(ziWeiPosition: number, birthDay: number, fiveElementPhaseNumber: number): Star[] {
  const stars: Star[] = [];
  
  stars.push({ name: '紫微', type: 'major', position: ziWeiPosition });
  stars.push({ name: '天机', type: 'major', position: (ziWeiPosition - 1 + 12) % 12 });
  
  const sunPosition = (ziWeiPosition + 2) % 12;
  stars.push({
    name: '太阳',
    type: 'major',
    brightness: birthDay <= 15 ? '庙' : '旺',
    position: sunPosition
  });
  
  stars.push({ name: '武曲', type: 'major', position: (ziWeiPosition + 3) % 12 });
  stars.push({ name: '天同', type: 'major', position: (ziWeiPosition + 4) % 12 });
  stars.push({ name: '廉贞', type: 'major', position: (ziWeiPosition + 5) % 12 });
  
  const tianFuPosition = (ziWeiPosition + 6) % 12;
  stars.push({ name: '天府', type: 'major', position: tianFuPosition });
  
  stars.push({
    name: '太阴',
    type: 'major',
    brightness: birthDay > 15 ? '庙' : '旺',
    position: (tianFuPosition + 1) % 12
  });
  
  stars.push({ name: '贪狼', type: 'major', position: (tianFuPosition + 2) % 12 });
  stars.push({ name: '巨门', type: 'major', position: (tianFuPosition + 3) % 12 });
  stars.push({ name: '天相', type: 'major', position: (tianFuPosition + 4) % 12 });
  stars.push({ name: '天梁', type: 'major', position: (tianFuPosition + 5) % 12 });
  stars.push({ name: '七杀', type: 'major', position: (tianFuPosition + 6) % 12 });
  stars.push({ name: '破军', type: 'major', position: (tianFuPosition + 7) % 12 });
  
  return stars;
}

export function determineLifePalace(birthMonth: number, birthHour: number): number {
  const monthOffset = (birthMonth - 1) % 12;
  const hourIndex = Math.floor((birthHour + 1) / 2) % 12;
  
  let position = (2 + monthOffset) % 12;
  position = (position - hourIndex + 12) % 12;
  
  return position;
}

export function determineBodyPalace(lifePalaceIndex: number): number {
  return (lifePalaceIndex + 6) % 12;
}

export function arrangePalaces(lifePalaceIndex: number, majorStars: Star[], minorStars: Star[], siHuaStars: SiHua[]): Palace[] {
  const palaces: Palace[] = [];
  
  for (let i = 0; i < 12; i++) {
    const palaceIndex = (lifePalaceIndex + i) % 12;
    
    palaces.push({
      index: i,
      name: palaceNames[i],
      earthlyBranch: earthlyBranches[palaceIndex],
      heavenlyStem: heavenlyStems[palaceIndex % 10],
      stars: [...majorStars, ...minorStars].filter(star => star.position === palaceIndex),
      siHuaStars: siHuaStars.filter(sihua => sihua.position === palaceIndex)
    });
  }
  
  return palaces;
}

// ========== 辅星系统 ==========

export function placeMinorStars(birthInfo: BirthInfo, lifePalaceIndex: number, majorStars: Star[]): Star[] {
  const stars: Star[] = [];
  const yearStem = getHeavenlyStem(birthInfo.year);
  const yearBranch = getEarthlyBranch(birthInfo.year);
  const stemIndex = heavenlyStems.indexOf(yearStem);
  
  // 禄存星
  const luCunPositions: Record<number, number> = { 0: 2, 1: 3, 2: 5, 3: 7, 4: 9, 5: 2, 6: 3, 7: 5, 8: 7, 9: 9 };
  const luCunPos = luCunPositions[stemIndex] || 2;
  stars.push({ name: '禄存', type: 'minor', position: luCunPos });
  
  // 擎羊星
  stars.push({ name: '擎羊', type: 'evil', position: (luCunPos - 1 + 12) % 12 });
  
  // 陀罗星
  stars.push({ name: '陀罗', type: 'evil', position: (luCunPos + 1) % 12 });
  
  // 左辅星
  const zuoFuPos = (birthInfo.month - 1 + 3) % 12;
  stars.push({ name: '左辅', type: 'minor', position: zuoFuPos });
  
  // 右弼星
  const youBiPos = (zuoFuPos + 6) % 12;
  stars.push({ name: '右弼', type: 'minor', position: youBiPos });
  
  // 文昌星
  const wenChangPos = (Math.floor((birthInfo.hour + 1) / 2) + 2) % 12;
  stars.push({ name: '文昌', type: 'minor', position: wenChangPos });
  
  // 文曲星
  const wenQuPos = (wenChangPos + 6) % 12;
  stars.push({ name: '文曲', type: 'minor', position: wenQuPos });
  
  // 天魁星
  const tianKuiPositions: Record<number, number> = { 0: 1, 1: 0, 2: 11, 3: 9, 4: 7, 5: 1, 6: 0, 7: 11, 8: 9, 9: 7 };
  stars.push({ name: '天魁', type: 'minor', position: tianKuiPositions[stemIndex] || 1 });
  
  // 天钺星
  const tianYuePos = (tianKuiPositions[stemIndex] + 6) % 12;
  stars.push({ name: '天钺', type: 'minor', position: tianYuePos });
  
  // 火星
  const huoXingPos = (lifePalaceIndex + 4) % 12;
  stars.push({ name: '火星', type: 'evil', position: huoXingPos });
  
  // 铃星
  const lingXingPos = (huoXingPos + 4) % 12;
  stars.push({ name: '铃星', type: 'evil', position: lingXingPos });
  
  // 地空
  const diKongPos = (Math.floor((birthInfo.hour + 1) / 2) + 5) % 12;
  stars.push({ name: '地空', type: 'evil', position: diKongPos });
  
  // 地劫
  const diJiePos = (diKongPos + 6) % 12;
  stars.push({ name: '地劫', type: 'evil', position: diJiePos });
  
  // 天马星
  const yearBranchIndex = earthlyBranches.indexOf(yearBranch);
  const tianMaPositions: Record<number, number> = { 2: 5, 3: 2, 5: 8, 6: 11, 8: 5, 9: 2, 11: 8, 0: 11 };
  stars.push({ name: '天马', type: 'minor', position: tianMaPositions[yearBranchIndex] || 5 });
  
  return stars;
}
// ========== 四化系统 ==========

export function placeSiHuaStars(birthInfo: BirthInfo, majorStars: Star[]): SiHua[] {
  const yearStem = getHeavenlyStem(birthInfo.year);
  const stemIndex = heavenlyStems.indexOf(yearStem);
  
  const siHuaMap: Record<number, { lu: string; quan: string; ke: string; ji: string }> = {
    0: { lu: '廉贞', quan: '破军', ke: '武曲', ji: '太阳' },
    1: { lu: '天机', quan: '天梁', ke: '紫微', ji: '太阴' },
    2: { lu: '天同', quan: '天机', ke: '文昌', ji: '廉贞' },
    3: { lu: '太阴', quan: '天同', ke: '天机', ji: '巨门' },
    4: { lu: '贪狼', quan: '太阴', ke: '右弼', ji: '天机' },
    5: { lu: '武曲', quan: '贪狼', ke: '天梁', ji: '文曲' },
    6: { lu: '太阳', quan: '武曲', ke: '天同', ji: '天机' },
    7: { lu: '巨门', quan: '太阳', ke: '文曲', ji: '文昌' },
    8: { lu: '天梁', quan: '紫微', ke: '左辅', ji: '武曲' },
    9: { lu: '破军', quan: '巨门', ke: '太阴', ji: '贪狼' }
  };
  
  const siHua = siHuaMap[stemIndex];
  const result: SiHua[] = [];
  
  if (siHua) {
    const findStarPosition = (starName: string): number => {
      const star = majorStars.find(s => s.name === starName);
      return star ? star.position : 0;
    };
    
    result.push({ starName: siHua.lu, huaType: '化禄', position: findStarPosition(siHua.lu), stem: yearStem });
    result.push({ starName: siHua.quan, huaType: '化权', position: findStarPosition(siHua.quan), stem: yearStem });
    result.push({ starName: siHua.ke, huaType: '化科', position: findStarPosition(siHua.ke), stem: yearStem });
    result.push({ starName: siHua.ji, huaType: '化忌', position: findStarPosition(siHua.ji), stem: yearStem });
  }
  
  return result;
}

// ========== 大限运程 ==========

export function calculateDaXian(
  lifePalaceIndex: number,
  fiveElementPhaseNumber: number,
  birthYear: number,
  gender: 'male' | 'female'
): DaXianPeriod[] {
  const daXian: DaXianPeriod[] = [];
  const startAge = fiveElementPhaseNumber;
  
  const yearStem = getHeavenlyStem(birthYear);
  const isYangMale = gender === 'male' && ['甲', '丙', '戊', '庚', '壬'].includes(yearStem);
  const isYinFemale = gender === 'female' && ['乙', '丁', '己', '辛', '癸'].includes(yearStem);
  const isForward = isYangMale || isYinFemale;
  
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

export function getCurrentDaXian(daXian: DaXianPeriod[], currentAge: number): DaXianPeriod | null {
  return daXian.find(dx => currentAge >= dx.startAge && currentAge <= dx.endAge) || null;
}
// ========== 流年分析 ==========

export function calculateLiuNian(chart: ZiWeiChart, year: number): LiuNianAnalysis {
  const currentAge = year - chart.birthInfo.year;
  const lifePalaceIndex = chart.lifePalaceIndex;
  
  const yearBranch = getEarthlyBranch(year);
  const yearBranchIndex = earthlyBranches.indexOf(yearBranch);
  const liuNianPalaceIndex = (2 + yearBranchIndex - lifePalaceIndex + 12) % 12;
  
  const yearStem = getHeavenlyStem(year);
  const stemIndex = heavenlyStems.indexOf(yearStem);
  
  const siHuaMap: Record<number, { lu: string; quan: string; ke: string; ji: string }> = {
    0: { lu: '廉贞', quan: '破军', ke: '武曲', ji: '太阳' },
    1: { lu: '天机', quan: '天梁', ke: '紫微', ji: '太阴' },
    2: { lu: '天同', quan: '天机', ke: '文昌', ji: '廉贞' },
    3: { lu: '太阴', quan: '天同', ke: '天机', ji: '巨门' },
    4: { lu: '贪狼', quan: '太阴', ke: '右弼', ji: '天机' },
    5: { lu: '武曲', quan: '贪狼', ke: '天梁', ji: '文曲' },
    6: { lu: '太阳', quan: '武曲', ke: '天同', ji: '天机' },
    7: { lu: '巨门', quan: '太阳', ke: '文曲', ji: '文昌' },
    8: { lu: '天梁', quan: '紫微', ke: '左辅', ji: '武曲' },
    9: { lu: '破军', quan: '巨门', ke: '太阴', ji: '贪狼' }
  };
  
  const siHua = siHuaMap[stemIndex];
  const siHuaInYear: SiHua[] = [];
  
  if (siHua) {
    const findStarPosition = (starName: string): number => {
      const star = chart.majorStars.find(s => s.name === starName);
      return star ? star.position : 0;
    };
    
    siHuaInYear.push({ starName: siHua.lu, huaType: '化禄', position: findStarPosition(siHua.lu), stem: yearStem });
    siHuaInYear.push({ starName: siHua.quan, huaType: '化权', position: findStarPosition(siHua.quan), stem: yearStem });
    siHuaInYear.push({ starName: siHua.ke, huaType: '化科', position: findStarPosition(siHua.ke), stem: yearStem });
    siHuaInYear.push({ starName: siHua.ji, huaType: '化忌', position: findStarPosition(siHua.ji), stem: yearStem });
  }
  
  const liuNianStars = chart.majorStars.filter(star => star.position === liuNianPalaceIndex);
  
  return {
    year,
    age: currentAge,
    liuNianPalaceIndex,
    liuNianPalaceName: palaceNames[liuNianPalaceIndex],
    liuNianStars,
    siHuaInYear,
    fortune: generateLiuNianFortune(chart, year, liuNianPalaceIndex),
    career: generateLiuNianCareer(chart, year, liuNianPalaceIndex),
    wealth: generateLiuNianWealth(chart, year, liuNianPalaceIndex),
    love: generateLiuNianLove(chart, year, liuNianPalaceIndex),
    health: generateLiuNianHealth(chart, year, liuNianPalaceIndex)
  };
}

function generateLiuNianFortune(chart: ZiWeiChart, year: number, palaceIndex: number): string {
  const hasZiWei = chart.majorStars.some(s => s.name === '紫微' && s.position === palaceIndex);
  const hasTianJi = chart.majorStars.some(s => s.name === '天机' && s.position === palaceIndex);
  
  if (hasZiWei) {
    return `${year}年有贵人相助，整体运势上扬，是关键的发展机遇期。`;
  }
  if (hasTianJi) {
    return `${year}年思维活跃，适合策划布局，但需防思虑过多。`;
  }
  return `${year}年运势平稳，按部就班即可有所收获。`;
}

function generateLiuNianCareer(chart: ZiWeiChart, year: number, palaceIndex: number): string {
  const palaceName = palaceNames[palaceIndex];
  if (palaceName === '官禄宫') {
    return `${year}年事业运势强劲，有升迁或跳槽良机，宜积极进取。`;
  }
  if (chart.majorStars.some(s => s.name === '太阳' && s.position === palaceIndex)) {
    return `${year}年工作表现突出，容易获得上司赏识和公众认可。`;
  }
  return `${year}年事业稳步发展，保持专业态度会有不错表现。`;
}

function generateLiuNianWealth(chart: ZiWeiChart, year: number, palaceIndex: number): string {
  const palaceName = palaceNames[palaceIndex];
  if (palaceName === '财帛宫') {
    return `${year}年财运亨通，正财偏财皆有收获，但需注意理性消费。`;
  }
  if (chart.majorStars.some(s => s.name === '武曲' && s.position === palaceIndex)) {
    return `${year}年通过实际行动和专业技能可获得财富增长。`;
  }
  return `${year}年财运平稳，做好理财规划可保收支平衡。`;
}

function generateLiuNianLove(chart: ZiWeiChart, year: number, palaceIndex: number): string {
  const palaceName = palaceNames[palaceIndex];
  if (palaceName === '夫妻宫') {
    return `${year}年感情运势活跃，单身者易遇良缘，已婚者需用心经营。`;
  }
  if (chart.majorStars.some(s => s.name === '廉贞' && s.position === palaceIndex)) {
    return `${year}年情感丰富，浪漫气息浓厚，但需防情绪波动。`;
  }
  return `${year}年感情生活平稳，多沟通理解可增进关系。`;
}

function generateLiuNianHealth(chart: ZiWeiChart, year: number, palaceIndex: number): string {
  const palaceName = palaceNames[palaceIndex];
  if (palaceName === '疾厄宫') {
    return `${year}年需特别关注健康，定期体检，避免过劳。`;
  }
  return `${year}年健康状况良好，保持规律作息和适度运动即可。`;
}

// ========== 主函数：完整排盘 ==========

export function calculateZiWeiChart(birthInfo: BirthInfo): ZiWeiChart {
  const lifePalaceIndex = determineLifePalace(birthInfo.month, birthInfo.hour);
  const bodyPalaceIndex = determineBodyPalace(lifePalaceIndex);
  const { phase: fiveElementPhase, number: fiveElementPhaseNumber } = 
    determineFiveElementPhase(birthInfo, lifePalaceIndex);
  
  const ziWeiPosition = placeZiWeiStar(birthInfo.day, fiveElementPhaseNumber);
  const majorStars = placeMajorStars(ziWeiPosition, birthInfo.day, fiveElementPhaseNumber);
  const minorStars = placeMinorStars(birthInfo, lifePalaceIndex, majorStars);
  const siHuaStars = placeSiHuaStars(birthInfo, majorStars);
  const palaces = arrangePalaces(lifePalaceIndex, majorStars, minorStars, siHuaStars);
  const daXian = calculateDaXian(lifePalaceIndex, fiveElementPhaseNumber, birthInfo.year, birthInfo.gender);
  
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
    minorStars,
    siHuaStars,
    daXian,
    currentAge,
    currentDaXian
  };
}

export function generateTenYearFortune(chart: ZiWeiChart): { past: string; future: string } {
  const currentAge = chart.currentAge;
  const currentDaXian = chart.currentDaXian;
  
  if (!currentDaXian) {
    return { past: '无法计算过往运势', future: '无法计算未来运势' };
  }
  
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
