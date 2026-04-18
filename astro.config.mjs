// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Zi Wei Dou Shu Guide',
			description: 'The complete guide to Chinese astrology - Zi Wei Dou Shu (紫微斗数)',

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
					label: 'The 14 Main Stars',
					items: [
						{ label: 'Overview', slug: 'stars/overview' },
						{ label: 'Tian Ji (天机)', slug: 'stars/tian-ji' },
						{ label: 'Tai Yang (太阳)', slug: 'stars/tai-yang' },
						{ label: 'Wu Qu (武曲)', slug: 'stars/wu-qu' },
						{ label: 'Lian Zhen (廉贞)', slug: 'stars/lian-zhen' },
						{ label: 'Zi Wei (紫微)', slug: 'stars/zi-wei' },
						{ label: 'Tian Yong (天同)', slug: 'stars/tian-tong' },
					],
				},
				{
					label: 'The 12 Palaces',
					items: [
						{ label: 'Overview', slug: 'palaces/overview' },
						{ label: 'Life Palace (命宫)', slug: 'palaces/life-palace' },
						{ label: 'Wealth Palace (财帛宫)', slug: 'palaces/wealth-palace' },
						{ label: 'Career Palace (官禄宫)', slug: 'palaces/career-palace' },
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
		}),
	],
});
