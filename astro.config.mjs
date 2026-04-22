// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://ziwei.skillxm.cn',
	integrations: [
		sitemap(),
		starlight({
			title: '紫微斗数 · Zi Wei Dou Shu',
			components: {
				Logo: './src/components/SiteLogo.astro',
				Footer: './src/components/SiteFooter.astro',
			},
			description: 'The complete guide to Chinese destiny astrology — Zi Wei Dou Shu',
			favicon: '/favicon.svg',
			head: [
				{
					tag: 'meta',
					attrs: {
						name: 'baidu-site-verification',
						content: 'codeva-1AHL9OeBu1',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: 'anonymous',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700&family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&display=swap',
					},
				},
			],
			customCss: ['./src/styles/custom.css'],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/jm6-lang/ziwei-site' },
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'What is Zi Wei Dou Shu?', slug: 'guides/what-is-zi-wei' },
						{ label: 'History & Origins', slug: 'guides/history' },
						{ label: 'How to Read a Chart', slug: 'guides/how-to-read-chart' },
					],
				},
				{
					label: 'The 14 Main Stars (十四主星)',
					collapsed: false,
					items: [
						{ label: 'Overview', slug: 'stars/overview' },
						{ label: 'Zi Wei 紫微 (Emperor)', slug: 'stars/zi-wei' },
						{ label: 'Tian Ji 天机 (Strategy)', slug: 'stars/tian-ji' },
						{ label: 'Tai Yang 太阳 (Sun)', slug: 'stars/tai-yang' },
						{ label: 'Wu Qu 武曲 (Military)', slug: 'stars/wu-qu' },
						{ label: 'Tian Tong 天同 (Harmony)', slug: 'stars/tian-tong' },
						{ label: 'Lian Zhen 廉贞 (Integrity)', slug: 'stars/lian-zhen' },
						{ label: 'Tian Fu 天府 (Treasury)', slug: 'stars/tian-fu' },
						{ label: 'Tai Yin 太阴 (Moon)', slug: 'stars/tai-yin' },
						{ label: 'Tan Lang 贪狼 (Greedy Wolf)', slug: 'stars/tan-lang' },
						{ label: 'Tian Xiang 天相 (Minister)', slug: 'stars/tian-xiang' },
						{ label: 'Tian Liang 天梁 (Supervisor)', slug: 'stars/tian-yong' },
						{ label: 'Qi Sha 七杀 (Seven Kills)', slug: 'stars/qi-sha' },
						{ label: 'Po Jun 破军 (Destroyer)', slug: 'stars/po-jun' },
						{ label: 'Ji Men 巨门 (Hidden Gate)', slug: 'stars/ji-men' },
					],
				},
				{
					label: 'Auxiliary Stars (辅星)',
					collapsed: true,
					items: [
						{ label: 'Lu Cun 禄存 (Fortune)', slug: 'stars/lu-cun' },
						{ label: 'Tian Kong 天空 (Void)', slug: 'stars/tian-kong' },
						{ label: 'Tao Hua 桃花 (Romance)', slug: 'stars/tao-hua' },
						{ label: 'Zuo Fu & You Bi 左辅右弼', slug: 'stars/zuo-fu-you-bi' },
						{ label: 'Qing Yang & Bo Xu 青羊博士', slug: 'stars/qing-yang' },
					],
				},
				{
					label: 'The 12 Palaces (十二宫)',
					collapsed: false,
					items: [
						{ label: 'Overview', slug: 'palaces/overview' },
						{ label: 'Life Palace 命宫', slug: 'palaces/life-palace' },
						{ label: 'Siblings Palace 兄弟宫', slug: 'palaces/siblings-palace' },
						{ label: 'Spouse Palace 夫妻宫', slug: 'palaces/spouse-palace' },
						{ label: 'Children Palace 子息宫', slug: 'palaces/children-palace' },
						{ label: 'Wealth Palace 财帛宫', slug: 'palaces/wealth-palace' },
						{ label: 'Health Palace 疾厄宫', slug: 'palaces/health-palace' },
						{ label: 'Migration Palace 迁移宫', slug: 'palaces/migration-palace' },
						{ label: 'Servants Palace 仆役宫', slug: 'palaces/servants-palace' },
						{ label: 'Career Palace 官禄宫', slug: 'palaces/career-palace' },
						{ label: 'Property Palace 田宅宫', slug: 'palaces/property-palace' },
						{ label: 'Fortune Palace 福德宫', slug: 'palaces/fortune-palace' },
						{ label: 'Parents Palace 父母宫', slug: 'palaces/parents-palace' },
					],
				},
				{
					label: 'Chart Reading (排盘分析)',
					items: [
						{ label: 'Chart Calculator 排盘计算', slug: 'tools/chart-calculator' },
						{ label: 'Celebrity Charts', slug: 'cases/celebrity-charts' },
						{ label: '2026 Fortune Analysis', slug: 'cases/2026-fortune' },
					],
				},
				{
					label: '紫薇社区',
					collapsed: false,
					autogenerate: { directory: 'community' },
				},
			],
			expressiveCode: {
				themes: ['github-dark'],
			},
		}),
	],
});
