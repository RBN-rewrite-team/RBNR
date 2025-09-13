import type Decimal from 'break_eternity.js';

export const I18NData = {
	'zh-CN': {
		roadofbignumberrewritten: '大数之路重制版',
		rbnr_title_size: '24px',

		dungeon_tab: '地下城',
		successor: '后继',

		unlock_b0_1: '解锁B0-1',
		number: '数值',
		add_power: '加法能量',
		mul_power: '乘法能量',
		exp_power: '指数能量',
		qol_point: '生活点数',
		ordinal: '序数',
		hydra_power: '九头蛇能量',
		x_4: 'x<sub>4</sub>',
		tau_4: 'τ<sub>4</sub>',
		hydra_solution: '九头蛇溶液',
		nonrec_power: '非递归能量',
		nonrec_theory: '非递归理论',
		cost_function: function (cost_d: string, currencyname: string) {
			return `价格: ${cost_d}${currencyname}`;
		},
		buymax_function: function (buy: string) {
			return `(买${buy}个)`;
		},
		successor_button(numbergain: string, automation: Decimal) {
			return `后继x${numbergain}${automation.gt(0) ? `(自动${automation}/s)` : ''}`;
		},
	},
	'en-US': {
		roadofbignumberrewritten: 'Road of Big number rewritten',
		rbnr_title_size: '18px',

		dungeon_tab: 'Dungeon',
		successor: 'Successor',
		unlock_b0_1: 'Unlock B0-1',
		number: 'Number',
		add_power: 'Add. Power',
		mul_power: 'Mul. Power',
		exp_power: 'Exp. Power',
		qol_point: 'QoL Point',
		ordinal: 'Ordinal',
		hydra_power: 'Hydra Power',
		x_4: 'x<sub>4</sub>',
		tau_4: 'τ<sub>4</sub>',
		hydra_solution: 'Solution',
		nonrec_power: 'Non Rec. Power',
		nonrec_theory: 'Non Rec. Theory',
		cost_function: function (cost_d: string, currencyname: string) {
			return `Cost: ${cost_d} ${currencyname}`;
		},
		buymax_function: function (buy: string) {
			return `(${buy} can buy)`;
		},
		successor_button(numbergain: string, automation: Decimal) {
			return `Do suc. x${numbergain} ${automation.gt(0) ? `(Auto ${automation}/s)` : ''}`;
		},
	},
} as const;

export const I18NFunction = {};
export type Avaliables = keyof (typeof I18NData)[keyof typeof I18NData];
export type AvaliableLangs = keyof typeof I18NData;
export function getI18NData<K extends Avaliables>(
	key: K,
	lang: string = curLang(),
): (typeof I18NData)[keyof typeof I18NData][K] {
	let lang2: AvaliableLangs = 'en-US';
	if (!Object.keys(I18NData).includes(lang)) lang2 = 'en-US';
	else lang2 = lang as AvaliableLangs;
	lang2 = lang2;
	return I18NData[lang2][key];
}
declare global {
	interface Window {
		a: string;
	}
}
window.a = '';
export function curLang() {
	return window.a || navigator.language;
}
