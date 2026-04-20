// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: '紫微斗数 · Zi Wei Dou Shu',
			description: 'The complete guide to Chinese destiny astrology — Zi Wei Dou Shu',
			logo: {
				src: './src/assets/logo.svg',
				href: '/',
			},
			favicon: '/favicon.svg',
			head: [
				// Google Fonts: Chinese serif + calligraphy
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
					label: 'Community 社区交流',
					collapsed: false,
					items: [
						{ label: '💬 社区首页', slug: 'community', link: '/community/' },
						{ label: 'GitHub Discussions', slug: 'github-discussions', link: 'https://github.com/jm6-lang/ziwei-site/discussions' },
					],
				},
				{
					label: 'The 14 Main Stars',
					collapsed: false,
					items: [
						{ label: 'Overview', slug: 'stars/overview' },
						{ label: 'Zi Wei 紫微 (Emperor)', slug: 'stars/zi-wei' },
						{ label: 'Tian Ji 天机 (Strategy)', slug: 'stars/tian-ji' },
						{ label: 'Tai Yang 太阳 (Sun)', slug: 'stars/tai-yang' },
						{ label: 'Wu Qu 武曲 (Military)', slug: 'stars/wu-qu' },
						{ label: 'Lian Zhen 廉贞 (Chastity)', slug: 'stars/lian-zhen' },
						{ label: 'Tian Tong 天同 (Harmony)', slug: 'stars/tian-tong' },
						{ label: 'Tian Yong 天梁 (Supervisor)', slug: 'stars/tian-yong' },
						{ label: 'Ji Men 巨门 (Hidden)', slug: 'stars/ji-men' },
						{ label: 'Lu Cun 禄存 (Fortune)', slug: 'stars/lu-cun' },
						{ label: 'Tian Kong 天空 (Void)', slug: 'stars/tian-kong' },
						{ label: 'Tao Hua 桃花 (Romance)', slug: 'stars/tao-hua' },
						{ label: 'Zuo Fu & You Bi 左辅右弼', slug: 'stars/zuo-fu-you-bi' },
						{ label: 'Qing Yang & Bo Xu 青羊博士', slug: 'stars/qing-yang' },
					],
				},
				{
					label: 'The 12 Palaces',
					collapsed: false,
					items: [
						{ label: 'Overview', slug: 'palaces/overview' },
						{ label: 'Life Palace 命宫', slug: 'palaces/life-palace' },
						{ label: 'Siblings Palace 兄弟宫', slug: 'palaces/siblings-palace' },
						{ label: 'Parents Palace 父母宫', slug: 'palaces/parents-palace' },
						{ label: 'Wealth Palace 财帛宫', slug: 'palaces/wealth-palace' },
						{ label: 'Career Palace 官禄宫', slug: 'palaces/career-palace' },
						{ label: 'Health Palace 疾厄宫', slug: 'palaces/health-palace' },
						{ label: 'Spouse Palace 夫妻宫', slug: 'palaces/spouse-palace' },
						{ label: 'Children Palace 子息宫', slug: 'palaces/children-palace' },
						{ label: 'Fortune Palace 福德宫', slug: 'palaces/fortune-palace' },
						{ label: 'Migration Palace 迁移宫', slug: 'palaces/migration-palace' },
						{ label: 'Servants Palace 仆役宫', slug: 'palaces/servants-palace' },
					],
				},
				{
					label: 'Case Studies',
					items: [
						{ label: 'Celebrity Charts', slug: 'cases/celebrity-charts' },
						{ label: '2026 Fortune Analysis', slug: 'cases/2026-fortune' },
					],
				},
			],
			expressiveCode: {
				themes: ['github-dark'],
			},
		}),
	],
});
