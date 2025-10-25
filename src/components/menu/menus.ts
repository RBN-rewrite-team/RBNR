import { RETRIBUTION } from '@/core/post-nonrec/retribution';
import { player } from '@/core/save';

export type SubTabBase = {
	text: string;
	id: number;
	show?(): any;
};

export type TabBase = {
	contents: SubTabBase[];
	show?(): any;
};
export type NoTitleTab = TabBase & {};
export type TitleTab = TabBase & {
	title: string;
};
export const menus = [
	{
		contents: [
			{
				text: '地下城',
				id: 1225,
			},
			{
				text: '自动机',
				id: 167,
				show() {
					return player.timeshard.unlAuto && (player.firstResetBit & 0b10000) == 0b10000;
				},
			},
		],
	},
	{
		title: '后继',
		contents: [
			{
				text: '后继',
				id: 0,
			},
		],
		show() {
			return player.singularity.stage < 11;
		},
	},
	{
		title: '加法',
		contents: [
			{
				text: '加法',
				id: 2,
			},
		],
		show() {
			return player.upgrades[13] && player.singularity.stage < 10;
		},
	},
	{
		title: '乘法',
		contents: [
			{ id: 4, text: '乘法' },
			{
				id: 5,
				text: '质因数',
				show() {
					return player.firstResetBit & 0b10 && player.singularity.stage < 7;
				},
			},
			{
				id: 6,
				text: '数论研究',
				show() {
					return player.upgrades[35] && player.singularity.stage < 8;
				},
			},
			{
				id: 8,
				text: '乘法挑战',
				show() {
					return player.upgrades[39] && player.singularity.stage < 6;
				},
			},
		],
		show() {
			return player.upgrades[26] && player.singularity.stage < 9;
		},
	},
	{
		title: '指数',
		show() {
			return player.firstResetBit & 0b100 && player.singularity.stage < 9;
		},
		contents: [
			{ id: 9, text: '指数升级' },
			{
				id: 10,
				text: '棋盘',
				show() {
					return player.upgrades[47];
				},
			},
			{
				id: 12,
				text: '对数运算',
				show() {
					return player.milestones.cb5;
				},
			},
			{
				id: 13,
				text: '对数膨胀',
				show() {
					return player.singularity.stage < 1 && player.milestones.log_G;
				},
			},
			{
				id: 14,
				text: '奇点生成器',
				show() {
					return player.singularity.enabled || player.milestones.dil_7;
				},
			},
		],
	},
	{
		get title() {
			if (player.singularity.stage == 4) return '???';
			if (player.singularity.stage <= 9) return '奇点';
			return '序数';
		},
		contents: [
			{
				id: 14,
				text: '奇点生成器',
			},
			{
				id: 15,
				text: '序数',
				show() {
					return player.firstResetBit & 0b1000 && player.retribution == 0;
				},
			},
			{
				id: 6,
				text: '数论研究',
				show() {
					return player.upgrades[58];
				},
			},
			{
				id: 17,
				text: '加速器',
				show() {
					return player.upgrades[59] && player.retribution == 0;
				},
			},
		],
		show() {
			return player.singularity.stage >= 4;
		},
	},
	{
		title: '九头蛇',
		contents: [
			{
				id: 19,
				text: '九头蛇引擎',
			},
			{
				id: 27,
				text: 'Y序列',
				show() {
					return player.retribution >= 1;
				},
			},
			{
				id: 20,
				text: '稀释',
				show() {
					return player.upgrades['69R'];
				},
			},
			{
				id: 28,
				get text() {
					return RETRIBUTION.name();
				},
				show() {
					return player.upgrades['U6R18'];
				},
			},
		],
		show() {
			return player.upgrades[517];
		},
	},
	{
		title: '非递归',
		show() {
			return (player.firstResetBit & 0b10000) == 0b10000;
		},
		contents: [
			{ id: 21, text: '非递归里程碑' },
			{ id: 23, text: '能量因素' },
			{ id: 24, text: '非递归研究树' },
			{ id: 22, text: '非递归挑战' },
			{
				id: 25,
				text: '非递归升级',
				show() {
					return player.milestones.nonrec_18;
				},
			},
			{
				id: 26,
				text: 'UNOCF',
				show() {
					return (
						(player.firstResetBit & 0b10000) == 0b10000 && player.milestones.nonrec_19
					);
				},
			},
		],
	},
	{
		title: '证明论',
		contents: [
			{ id: 29, text: '解析' },
			{ id: 30, text: '解析里程碑' },
		],

		show() {
			return player.retribution >= 1 && player.nonrecu.studies_bought.includes(30);
		},
	},
	{
		title: '杂项',
		contents: [
			{ id: 1, text: '设置' },
			{ id: 3, text: '关于游戏' },
			{ id: 200, text: '剧情' },
			{ id: 7, text: '统计' },
			{ id: 11, text: '成就' },
			{
				id: 16,
				text: '帮助',
				show() {
					return player.firstResetBit & 0b1000;
				},
			},
			{ id: 18, text: '时间碎片' },
		],
	},
] as const satisfies (NoTitleTab | TitleTab)[];
