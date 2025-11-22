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
				text: 'tab.automator',
				id: 167,
				show() {
					return player.timeshard.unlAuto && (player.firstResetBit & 0b10000) == 0b10000;
				},
			},
		],
	},
	{
		title: 'tab.dungeon',
		contents: [
			{
				text: 'tab.dungeon',
				id: 1226,
			},
			{
				text: 'studies.dung.title',
				id: 1227,
			},
			{
				text: 'dung.core',
				id: 1228,
			},
		],
	},
	{
		title: 'tab.successor',
		contents: [
			{
				text: 'tab.successor',
				id: 0,
			},
		],
		show() {
			return player.singularity.stage < 11;
		},
	},
	{
		title: 'tab.addition',
		contents: [
			{
				text: 'tab.addition',
				id: 2,
			},
		],
		show() {
			return player.upgrades[13] && player.singularity.stage < 10;
		},
	},
	{
		title: 'tab.multipl',
		contents: [
			{ id: 4, text: 'tab.multipl' },
			{
				id: 5,
				text: 'tab.primefactor',
				show() {
					return player.stat.totalMulpower.gte(1) && player.singularity.stage < 7;
				},
			},
			{
				id: 6,
				text: 'tab.numbertheory',
				show() {
					return player.upgrades[35] && player.singularity.stage < 8;
				},
			},
			{
				id: 8,
				text: 'tab.multipchal',
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
		title: 'tab.exponentation',
		show() {
			return player.stat.highestExppower.gte(1) && player.singularity.stage < 4;
		},
		contents: [
			{ id: 9, text: 'tab.expupg' },
			{
				id: 10,
				text: 'tab.cb',
				show() {
					return player.upgrades[47];
				},
			},
			{
				id: 12,
				text: 'tab.log_c',
				show() {
					return player.milestones.cb5;
				},
			},
			{
				id: 13,
				text: 'tab.log_d',
				show() {
					return player.singularity.stage < 1 && player.milestones.log_G;
				},
			},
			{
				id: 14,
				text: 'tab.singularity',
				show() {
					return player.singularity.enabled || player.milestones.dil_7;
				},
			},
		],
	},
	{
		get title() {
			if (player.singularity.stage == 4) return '???';
			if (player.singularity.stage <= 9) return 'tab.singularitytab';
			return 'tab.ordinal';
		},
		contents: [
			{
				id: 14,
				text: 'tab.singularity',
			},
			{
				id: 15,
				text: 'tab.ordinal',
				show() {
					return player.firstResetBit & 0b1000 && player.retribution == 0;
				},
			},
			{
				id: 6,
				text: 'tab.numbertheory',
				show() {
					return player.upgrades[58];
				},
			},
			{
				id: 17,
				text: 'tab.booster',
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
		title: 'tab.hydra',
		contents: [
			{
				id: 19,
				text: 'tab.hydra_engine',
			},
			{
				id: 27,
				text: 'tab.y',
				show() {
					return player.retribution >= 1;
				},
			},
			{
				id: 20,
				text: 'tab.dilute',
				show() {
					return player.upgrades['69R'];
				},
			},
			{
				id: 28,
				text: 'tab.retribution',
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
		title: 'tab.nonrec',
		show() {
			return (player.firstResetBit & 0b10000) == 0b10000 && player.stat.chapter >= 6;
		},
		contents: [
			{ id: 21, text: 'tab.nonrecmils' },
			// { id: 23, text: 'tab.energyfactor' },
			{ id: 24, text: 'tab.nrs' },
			{ id: 22, text: 'tab.nrc' },
			{
				id: 25,
				text: 'tab.nrupg',
				show() {
					return player.milestones.nonrec_18;
				},
			},
			{
				id: 26,
				text: 'tab.unocf',
				show() {
					return player.stat.chapter >= 6 && player.milestones.nonrec_19;
				},
			},
		],
	},
	{
		title: 'tab.prooftheory',
		contents: [
			{ id: 29, text: 'tab.analyze' },
			{ id: 30, text: 'tab.analyzemilestone' },
			{
				id: 31,
				text: 'tab.garden',
				show() {
					return player.milestones.pt_6;
				},
			},
		],

		show() {
			return player.retribution >= 1 && player.nonrecu.studies_bought.includes(30);
		},
	},
	{
		title: 'tab.options',
		contents: [
			{ id: 1, text: 'tab.settings' },
			{ id: 3, text: 'tab.aboutgame' },
			{ id: 200, text: 'tab.plot' },
			{ id: 7, text: 'tab.stat' },
			{ id: 11, text: 'tab.achievements' },
			{
				id: 16,
				text: 'tab.help',
				// show() {
				// 	return player.firstResetBit & 0b1000;
				// },
			},
			{ id: 18, text: 'tab.timeshard' },
		],
	},
] as const satisfies (NoTitleTab | TitleTab)[];
