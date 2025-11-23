import { getMessage } from '@/utils/i18n';
import Decimal from 'break_eternity.js';
import { format } from '@/utils/format';
import { player } from '../global';
import type { $t } from '@/utils/types';
import type { IntClosedRange } from 'type-fest';

export type GardenCurrency = {
	name: string;
	color: string;
	value(): Decimal;
	write(x: Decimal): Decimal;
	entropyEffective: boolean;
	elementColor: string;
};

export type GardenGenerator = {
	isG: boolean;
	key: number;
	pos: [number, number];
	name?: string;
	currency: GardenCurrency;
	cost: Decimal;
	idea: Decimal;
	entropy: Decimal;
	unlocked(): boolean;
	connect: [number[], number[]];
	show?(): boolean;
	effectDescription?(x: Decimal): string;
	igNR?(): boolean;
};

export type GardenUpgradeEffect = {
	key: number;
	mult: Decimal;
};

export type GardenUpgrade = {
	isG: boolean;
	key: number;
	name?: string;
	pos: [number, number];
	currency: GardenCurrency;
	cost: Decimal;
	effect: GardenUpgradeEffect;
	unlocked(): boolean;
	connect: [number[], number[]];
	show?(): boolean;
	igNR?(): boolean;
	effectDescription?(x: Decimal): string;
};

export function isGardenUpgrade(x: GardenUpgrade | GardenGenerator): x is GardenUpgrade {
	return !isGardenGenerator(x);
}
export function isGardenGenerator(x: GardenUpgrade | GardenGenerator): x is GardenGenerator {
	return x.isG;
}
export function igGNR(x: GardenGenerator) {
	return x.igNR?.() ?? false;
}
export function ignoreNR(x: GardenUpgrade) {
	return x.igNR?.() ?? false;
}
export function isShow(x: GardenUpgrade | GardenGenerator) {
	return x.show?.() ?? true;
}
export const GardenCurrencies = {
	idea: {
		name: '想法',
		color: 'yellow',
		elementColor: 'var(--color)',
		value: (): Decimal => player.garden.idea,
		write(x: Decimal): Decimal {
			player.garden.idea = x;
			return x;
		},
		entropyEffective: true,
	},
	inspiration: {
		name: '灵感',
		color: 'orange',
		elementColor: 'rgb(150, 75, 18)',
		value: (): Decimal => player.garden.inspiration,
		write(x: Decimal): Decimal {
			player.garden.inspiration = x;
			return x;
		},
		entropyEffective: false,
	},
	inspirationPower: {
		name: '灵感能量',
		color: 'rgb(127, 255, 2)',
		elementColor: 'rgb(75, 150, 18)',
		value: (): Decimal => player.garden.insPower,
		write(x: Decimal): Decimal {
			player.garden.insPower = x;
			return x;
		},
		entropyEffective: false,
	},
} as const;
export const GardenGenUpgs = {
	generators: {
		0: {
			isG: true,
			key: 0,
			name: '弦',
			pos: [0, 0],
			currency: GardenCurrencies.idea,
			cost: new Decimal(2e-6),
			idea: new Decimal(5e-8),
			entropy: new Decimal(1e-12),
			unlocked: () => true,
			connect: [[], []],
		},
		1: {
			isG: true,
			key: 1,
			name: '夸克',
			pos: [-50, -350],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1e-3),
			idea: new Decimal(6e-7),
			entropy: new Decimal(1e-10),
			unlocked: (): boolean => Garden.boughtUpgrade(0) && Garden.boughtUpgrade(1),
			connect: [[], [0, 1]],
		},
		2: {
			isG: true,
			key: 2,
			name: '核子',
			pos: [50, -750],
			currency: GardenCurrencies.idea,
			cost: new Decimal(0.04),
			idea: new Decimal(4e-4),
			entropy: new Decimal(3e-10),
			unlocked: (): boolean => Garden.boughtUpgrade(3),
			connect: [[], [3]],
		},
		3: {
			isG: true,
			key: 3,
			name: '原子',
			pos: [-200, -1050],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1),
			idea: new Decimal(0.025),
			entropy: new Decimal(2e-9),
			unlocked: (): boolean => Garden.boughtUpgrade(6) && Garden.boughtUpgrade(9),
			connect: [[], [6, 9]],
		},
		4: {
			isG: true,
			key: 4,
			name: '分子',
			pos: [25, -1250],
			currency: GardenCurrencies.idea,
			cost: new Decimal(500),
			idea: new Decimal(1),
			entropy: new Decimal(1e-7),
			unlocked: (): boolean =>
				Garden.boughtUpgrade(10) && Garden.boughtGeneratorReach(3, new Decimal(50)),
			connect: [[3], []],
		},
		5: {
			isG: true,
			key: 5,
			name: '氨基酸',
			pos: [0, -1750],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1e6),
			idea: new Decimal(25000),
			entropy: new Decimal(1e-4),
			unlocked: (): boolean => Garden.boughtUpgrade(14) && Garden.boughtUpgrade(24),
			connect: [[], [14]],
		},
		6: {
			isG: true,
			key: 6,
			name: '脱氧核糖核酸',
			pos: [50, -1925],
			currency: GardenCurrencies.idea,
			cost: new Decimal(5e8),
			idea: new Decimal(1.5e7),
			entropy: new Decimal(0.05),
			unlocked: (): boolean =>
				Garden.boughtUpgrade(27) && Garden.boughtGeneratorReach(5, new Decimal(50)),
			show: (): boolean => Garden.boughtUpgrade(24),
			connect: [[5], [27]],
		},
		7: {
			isG: true,
			key: 7,
			name: '想法倍增器',
			pos: [600, 100],
			currency: GardenCurrencies.inspirationPower,
			cost: new Decimal(10),
			idea: new Decimal(0),
			entropy: new Decimal(0),
			unlocked: (): boolean => Garden.boughtUpgrade(23),
			show: (): boolean => Garden.boughtUpgrade(23),
			connect: [[], []],
			effectDescription: (x: Decimal): string =>
				getMessage('garden.gen.7.effDesc', {
					effect: format(x.mul(0.01).add(1)),
				}),
			igNR: (): boolean => true,
		},
		8: {
			isG: true,
			key: 8,
			name: '想法倍增器 II',
			pos: [900, 100],
			currency: GardenCurrencies.inspirationPower,
			cost: new Decimal(100),
			idea: new Decimal(0),
			entropy: new Decimal(0),
			unlocked: (): boolean => Garden.boughtGeneratorReach(7, new Decimal(1)),
			show: (): boolean => Garden.boughtUpgrade(23),
			connect: [[7], []],
			effectDescription: (x: Decimal): string =>
				getMessage('garden.gen.7.effDesc', {
					effect: format(x.mul(0.02).add(1)),
				}),
			igNR: (): boolean => true,
		},

		9: {
			isG: true,
			key: 9,
			name: '想法倍增器 III',
			pos: [600, 300],
			currency: GardenCurrencies.inspirationPower,
			cost: new Decimal(10000),
			idea: new Decimal(0),
			entropy: new Decimal(0),
			unlocked: (): boolean => Garden.boughtGeneratorReach(8, new Decimal(1)),
			show: (): boolean => Garden.boughtUpgrade(23),
			connect: [[8], []],
			effectDescription: (x: Decimal): string =>
				getMessage('garden.gen.7.effDesc', {
					effect: format(x.mul(0.03).add(1)),
				}),
			igNR: (): boolean => true,
		},
		10: {
			isG: true,
			key: 10,
			name: '想法倍增器 IV',
			pos: [900, 300],
			currency: GardenCurrencies.inspirationPower,
			cost: new Decimal(1e8),
			idea: new Decimal(0),
			entropy: new Decimal(0),
			unlocked: (): boolean => Garden.boughtGeneratorReach(9, new Decimal(1)),
			show: (): boolean => Garden.boughtUpgrade(23),
			connect: [[9], []],
			effectDescription: (x: Decimal): string =>
				getMessage('garden.gen.7.effDesc', {
					effect: format(x.mul(0.04).add(1)),
				}),
			igNR: (): boolean => true,
		},
		11: {
			isG: true,
			key: 11,
			name: '原核生物',
			pos: [50, -2250],
			currency: GardenCurrencies.idea,
			cost: new Decimal(5e13),
			idea: new Decimal(9e9),
			entropy: new Decimal(25),
			unlocked: (): boolean => Garden.boughtUpgrade(31),
			show: (): boolean => Garden.boughtUpgrade(24),
			connect: [[], [31]],
		},
		12: {
			isG: true,
			key: 12,
			name: '真核生物',
			pos: [50, -2750],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1e19),
			idea: new Decimal(3e13),
			entropy: new Decimal(100000),
			unlocked: (): boolean => Garden.boughtUpgrade(55),
			show: (): boolean => Garden.boughtUpgrade(24),
			connect: [[], [55]],
		},
	} satisfies {
		[key in any]: GardenGenerator;
	},
	upgrades: {
		0: {
			isG: !true,
			key: 0,
			name: '弦振动',
			pos: [0, -200],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1e-6),

			effect: {
				key: 0,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(0, new Decimal(1));
			},
			connect: [[0], []],
		},
		1: {
			isG: !true,
			key: 1,
			name: 'D膜',
			pos: [200, -250],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1e-5),

			effect: {
				key: 0,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(0);
			},
			connect: [[], [0]],
		},
		2: {
			isG: !true,
			key: 2,
			name: 'M理论',
			pos: [300, -450],
			currency: GardenCurrencies.idea,
			cost: new Decimal(0.1),

			effect: {
				key: 0,
				mult: new Decimal(100),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(1) && Garden.boughtGeneratorReach(0, new Decimal(100));
			},
			connect: [[], [1]],
		},
		3: {
			isG: !true,
			key: 3,
			name: '胶子',
			pos: [100, -550],
			currency: GardenCurrencies.idea,
			cost: new Decimal(5e-4),

			effect: {
				key: 1,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(1, new Decimal(1));
			},
			connect: [[1], []],
		},
		4: {
			isG: !true,
			key: 4,
			name: '夸克禁闭',
			pos: [-150, -500],
			currency: GardenCurrencies.idea,
			cost: new Decimal(0.006),

			effect: {
				key: 1,
				mult: new Decimal(3),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(1, new Decimal(1));
			},
			connect: [[1], []],
		},
		5: {
			isG: !true,
			key: 5,
			name: '中微子',
			pos: [-75, -600],
			currency: GardenCurrencies.idea,
			cost: new Decimal(0.009),

			effect: {
				key: 1,
				mult: new Decimal(2.5),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(1, new Decimal(1)) && Garden.boughtUpgrade(4);
			},
			connect: [[1], [4]],
		},
		6: {
			isG: !true,
			key: 6,
			name: '希格斯波色子',
			pos: [-250, -700],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1),

			effect: {
				key: 1,
				mult: new Decimal(10),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(5) && Garden.boughtGeneratorReach(1, new Decimal(50));
			},
			connect: [[], [5]],
		},
		7: {
			isG: !true,
			key: 7,
			name: '电子',
			pos: [-100, -825],
			currency: GardenCurrencies.idea,
			cost: new Decimal(0.05),

			effect: {
				key: 2,
				mult: new Decimal(1.25),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(2, new Decimal(1));
			},
			connect: [[2], []],
		},
		8: {
			isG: !true,
			key: 8,
			name: '强相互作用力',
			pos: [75, -900],
			currency: GardenCurrencies.idea,
			cost: new Decimal(0.25),

			effect: {
				key: 2,
				mult: new Decimal(1.5),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(2, new Decimal(1));
			},
			connect: [[2], []],
		},
		9: {
			isG: !true,
			key: 9,
			name: '弱相互作用力',
			pos: [-25, -1000],
			currency: GardenCurrencies.idea,
			cost: new Decimal(0.75),

			effect: {
				key: 2,
				mult: new Decimal(1.25),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(7) && Garden.boughtUpgrade(8);
			},
			connect: [[], [7, 8]],
		},
		10: {
			isG: !true,
			key: 10,
			name: '原子能',
			pos: [0, -1100],
			currency: GardenCurrencies.idea,
			cost: new Decimal(5),

			effect: {
				key: 3,
				mult: new Decimal(1.5),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(3, new Decimal(1));
			},
			connect: [[3], []],
		},
		11: {
			isG: !true,
			key: 11,
			name: '量子纠缠',
			pos: [-300, -1200],
			currency: GardenCurrencies.idea,
			cost: new Decimal(100),

			effect: {
				key: 3,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(3, new Decimal(1));
			},
			connect: [[3], []],
		},
		12: {
			isG: !true,
			key: 12,
			name: '化学键',
			pos: [-125, -1300],
			currency: GardenCurrencies.idea,
			cost: new Decimal(750),

			effect: {
				key: 4,
				mult: new Decimal(1.5),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(4, new Decimal(1));
			},
			connect: [[4], []],
		},
		13: {
			isG: !true,
			key: 13,
			name: '量子隧穿',
			pos: [-350, -1350],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1500),

			effect: {
				key: 3,
				mult: new Decimal(15),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(11) && Garden.boughtGeneratorReach(3, new Decimal(50));
			},
			connect: [[], [11]],
		},
		14: {
			isG: !true,
			key: 14,
			name: '元素',
			pos: [-25, -1425],
			currency: GardenCurrencies.idea,
			cost: new Decimal(3000),

			effect: {
				key: 4,
				mult: new Decimal(3.75),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(4, new Decimal(1));
			},
			connect: [[4], []],
		},
		15: {
			isG: !true,
			key: 15,
			name: '元素周期表',
			pos: [125, -1400],
			currency: GardenCurrencies.idea,
			cost: new Decimal(4000),

			effect: {
				key: 4,
				mult: new Decimal(2.5),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(14);
			},
			connect: [[], [14]],
		},
		16: {
			isG: !true,
			key: 16,
			name: '离子',
			pos: [100, -1525],
			currency: GardenCurrencies.idea,
			cost: new Decimal(10500),

			effect: {
				key: 4,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(14);
			},
			connect: [[], [14]],
		},
		17: {
			isG: !true,
			key: 17,
			name: '电子轨道',
			pos: [-300, -925],
			currency: GardenCurrencies.idea,
			cost: new Decimal(100000),

			effect: {
				key: 3,
				mult: new Decimal(7.5),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(7) && Garden.boughtGeneratorReach(4, new Decimal(1));
			},
			connect: [[], [7]],
		},
		18: {
			isG: !true,
			key: 18,
			name: '原子衰变',
			pos: [-350, -1100],
			currency: GardenCurrencies.idea,
			cost: new Decimal(250000),

			effect: {
				key: 3,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(3, new Decimal(100));
			},
			connect: [[3], []],
		},
		19: {
			isG: !true,
			key: 19,
			name: '自由基原子',
			pos: [-150, -1500],
			currency: GardenCurrencies.idea,
			cost: new Decimal(450000),

			effect: {
				key: 4,
				mult: new Decimal(1.75),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(14) && Garden.boughtGeneratorReach(4, new Decimal(25));
			},
			connect: [[], [14]],
		},
		20: {
			isG: !true,
			key: 20,
			name: '共价键',
			pos: [-225, -1400],
			currency: GardenCurrencies.idea,
			cost: new Decimal(900000),

			effect: {
				key: 4,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(12) && Garden.boughtGeneratorReach(4, new Decimal(25));
			},
			connect: [[], [12]],
		},
		21: {
			isG: !true,
			key: 21,
			name: '自由电荷',
			pos: [225, -1600],
			currency: GardenCurrencies.idea,
			cost: new Decimal(2e6),

			effect: {
				key: 4,
				mult: new Decimal(4.5),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(16) && Garden.boughtGeneratorReach(4, new Decimal(50));
			},
			connect: [[], [16]],
		},
		22: {
			isG: !true,
			key: 22,
			name: '化学能',
			pos: [-100, -1625],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1e7),

			effect: {
				key: 4,
				mult: new Decimal(3),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(14) && Garden.boughtGeneratorReach(4, new Decimal(50));
			},
			connect: [[], [14]],
		},
		23: {
			isG: !true,
			key: 23,
			name: 'START',
			pos: [0, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(0),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return player.garden.igTimes.gt(0);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			connect: [[], []],
			igNR: () => true,
			effectDescription(): string {
				return getMessage('garden.upg.23.desc');
			},
		},
		24: {
			isG: !true,
			key: 24,
			name: 'ST1',
			pos: [0, 800],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(23);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			connect: [[], [23]],
			igNR: () => true,
			effectDescription(): string {
				return getMessage('garden.upg.24.desc');
			},
		},
		25: {
			isG: !true,
			key: 25,
			name: 'I1',
			pos: [-200, 800],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1),
			effect: {
				key: -1,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(23);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			igNR: () => true,
			connect: [[], [23]],
		},
		26: {
			isG: !true,
			key: 26,
			name: 'E1',
			pos: [200, 800],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(5),
			effect: {
				key: -2,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(23);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			igNR: () => true,
			connect: [[], [23]],
		},
		27: {
			isG: !true,
			key: 27,
			name: '蛋白质',
			pos: [-150, -1800],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1.5e7),
			effect: {
				key: 5,
				mult: new Decimal(1.75),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(5, new Decimal(1));
			},
			show(): boolean {
				return Garden.boughtUpgrade(24);
			},
			connect: [[5], []],
		},
		28: {
			isG: !true,
			key: 28,
			name: '编码蛋白质',
			pos: [-200, -1950],
			currency: GardenCurrencies.idea,
			cost: new Decimal(4e7),
			effect: {
				key: 5,
				mult: new Decimal(1.5),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(27);
			},
			show(): boolean {
				return Garden.boughtUpgrade(24);
			},
			connect: [[], [27]],
		},
		29: {
			isG: !true,
			key: 29,
			name: '核糖核酸',
			pos: [250, -2000],
			currency: GardenCurrencies.idea,
			cost: new Decimal(5e8),
			effect: {
				key: 6,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(6, new Decimal(1));
			},
			show(): boolean {
				return Garden.boughtUpgrade(24);
			},
			connect: [[6], []],
		},
		30: {
			isG: !true,
			key: 30,
			name: '病毒',
			pos: [300, -2150],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1.5e10),
			effect: {
				key: 6,
				mult: new Decimal(4),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(29);
			},
			show(): boolean {
				return Garden.boughtUpgrade(24);
			},
			connect: [[], [29]],
		},
		31: {
			isG: !true,
			key: 31,
			name: '遗传',
			pos: [50, -2100],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1e11),
			effect: {
				key: 6,
				mult: new Decimal(3),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(6, new Decimal(25));
			},
			show(): boolean {
				return Garden.boughtUpgrade(24);
			},
			connect: [[6], []],
		},
		32: {
			isG: !true,
			key: 32,
			name: 'I2',
			pos: [-400, 1000],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(50),
			effect: {
				key: -1,
				mult: new Decimal(3),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(25);
			},
			show(): boolean {
				return Garden.boughtUpgrade(25);
			},
			igNR: () => true,
			connect: [[], [25]],
		},
		33: {
			isG: !true,
			key: 33,
			name: 'E2',
			pos: [400, 1000],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(450),
			effect: {
				key: -2,
				mult: new Decimal(3),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(26);
			},
			show(): boolean {
				return Garden.boughtUpgrade(26);
			},
			igNR: () => true,
			connect: [[], [26]],
		},
		34: {
			isG: !true,
			key: 34,
			name: 'IGCD1',
			pos: [200, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(4),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(26);
			},
			show(): boolean {
				return Garden.boughtUpgrade(26);
			},
			igNR: () => true,
			connect: [[], [23]],
			effectDescription(): string {
				return getMessage('garden.upg.34.desc');
			},
		},
		35: {
			isG: !true,
			key: 35,
			name: 'IGCD2',
			pos: [400, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(16),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(34);
			},
			show(): boolean {
				return Garden.boughtUpgrade(34);
			},
			igNR: () => true,
			connect: [[], [34]],
			effectDescription(): string {
				return getMessage('garden.upg.35.desc');
			},
		},
		36: {
			isG: !true,
			key: 36,
			name: 'IGCD3',
			pos: [600, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(128),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(35);
			},
			show(): boolean {
				return Garden.boughtUpgrade(35);
			},
			igNR: () => true,
			connect: [[], [35]],
			effectDescription(): string {
				return getMessage('garden.upg.36.desc');
			},
		},
		37: {
			isG: !true,
			key: 37,
			name: 'LS1',
			pos: [-200, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(250),
			effect: {
				key: -3,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(25);
			},
			show(): boolean {
				return Garden.boughtUpgrade(25);
			},
			igNR: () => true,
			connect: [[], [23]],
		},
		38: {
			isG: !true,
			key: 38,
			name: 'LS2',
			pos: [-400, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(7500),
			effect: {
				key: -3,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(37);
			},
			show(): boolean {
				return Garden.boughtUpgrade(37);
			},
			igNR: () => true,
			connect: [[], [37]],
		},
		39: {
			isG: !true,
			key: 39,
			name: 'LS3',
			pos: [-600, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(6e5),
			effect: {
				key: -3,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(38);
			},
			show(): boolean {
				return Garden.boughtUpgrade(38);
			},
			igNR: () => true,
			connect: [[], [38]],
		},

		40: {
			isG: !true,
			key: 40,
			pos: [1400, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1e10),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(50);
			},
			show(): boolean {
				return Garden.boughtUpgrade(50);
			},
			igNR: () => true,
			connect: [[], [50]],
			effectDescription(): string {
				return getMessage('garden.upg.40.desc');
			},
		},
		41: {
			isG: !true,
			key: 41,
			pos: [1600, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(5e10),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(40);
			},
			show(): boolean {
				return Garden.boughtUpgrade(40);
			},
			igNR: () => true,
			connect: [[], [40]],
			effectDescription(): string {
				return getMessage('garden.upg.41.desc');
			},
		},
		42: {
			isG: !true,
			key: 42,
			pos: [1800, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(2e11),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(41);
			},
			show(): boolean {
				return Garden.boughtUpgrade(41);
			},
			igNR: () => true,
			connect: [[], [41]],
			effectDescription(): string {
				return getMessage('garden.upg.42.desc');
			},
		},
		43: {
			isG: !true,
			key: 43,
			pos: [2000, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1e12),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(42);
			},
			show(): boolean {
				return Garden.boughtUpgrade(42);
			},
			igNR: () => true,
			connect: [[], [42]],
			effectDescription(): string {
				return getMessage('garden.upg.43.desc');
			},
		},
		44: {
			isG: !true,
			key: 44,
			pos: [2200, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(5e12),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(43);
			},
			show(): boolean {
				return Garden.boughtUpgrade(43);
			},
			igNR: () => true,
			connect: [[], [43]],
			effectDescription(): string {
				return getMessage('garden.upg.44.desc');
			},
		},
		45: {
			isG: !true,
			key: 45,
			pos: [2200, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(5e13),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(44);
			},
			show(): boolean {
				return Garden.boughtUpgrade(44);
			},
			igNR: () => true,
			connect: [[], [44]],
			effectDescription(): string {
				return getMessage('garden.upg.45.desc');
			},
		},
		46: {
			isG: !true,
			key: 46,
			pos: [2400, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(3e14),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(45);
			},
			show(): boolean {
				return Garden.boughtUpgrade(45);
			},
			igNR: () => true,
			connect: [[], [45]],
			effectDescription(): string {
				return getMessage('garden.upg.46.desc');
			},
		},
		47: {
			isG: !true,
			key: 47,
			pos: [2400, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(5e15),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(46);
			},
			show(): boolean {
				return Garden.boughtUpgrade(46);
			},
			igNR: () => true,
			connect: [[], [46]],
			effectDescription(): string {
				return getMessage('garden.upg.47.desc');
			},
		},

		48: {
			isG: !true,
			key: 48,
			name: 'IGCD4',
			pos: [800, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(2048),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(36);
			},
			show(): boolean {
				return Garden.boughtUpgrade(36);
			},
			igNR: () => true,
			connect: [[], [36]],
			effectDescription(): string {
				return getMessage('garden.upg.48.desc');
			},
		},
		49: {
			isG: !true,
			key: 49,
			pos: [1000, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1e7),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(48);
			},
			show(): boolean {
				return Garden.boughtUpgrade(48);
			},
			igNR: () => true,
			connect: [[], [48]],
			effectDescription(): string {
				return getMessage('garden.upg.49.desc');
			},
		},
		50: {
			isG: !true,
			key: 50,
			pos: [1200, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1e9),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(49);
			},
			show(): boolean {
				return Garden.boughtUpgrade(49);
			},
			igNR: () => true,
			connect: [[], [49]],
			effectDescription(): string {
				return getMessage('garden.upg.50.desc');
			},
		},
		51: {
			isG: !true,
			key: 51,
			name: '细胞质',
			pos: [200, -2350],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1e13),
			effect: {
				key: 11,
				mult: new Decimal(3),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(11, new Decimal(1));
			},
			show: (): boolean => Garden.boughtUpgrade(24),
			connect: [[11], []],
		},

		52: {
			isG: !true,
			key: 52,
			name: '细胞膜',
			pos: [150, -2450],
			currency: GardenCurrencies.idea,
			cost: new Decimal(1.5e18),
			effect: {
				key: 11,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(11, new Decimal(30)) && Garden.boughtUpgrade(51);
			},
			show: (): boolean => Garden.boughtUpgrade(24),
			connect: [[], [51]],
		},

		53: {
			isG: !true,
			key: 53,
			pos: [50, -2550],
			currency: GardenCurrencies.idea,
			cost: new Decimal(2e18),
			effect: {
				key: 11,
				mult: new Decimal(4),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(11, new Decimal(60)) && Garden.boughtUpgrade(52);
			},
			show: (): boolean => Garden.boughtUpgrade(24),
			connect: [[], [52]],
		},

		54: {
			isG: !true,
			key: 54,
			pos: [250, -2550],
			currency: GardenCurrencies.idea,
			cost: new Decimal(5e18),
			effect: {
				key: 11,
				mult: new Decimal(4),
			},
			unlocked(): boolean {
				return Garden.boughtGeneratorReach(11, new Decimal(60)) && Garden.boughtUpgrade(52);
			},
			show: (): boolean => Garden.boughtUpgrade(24),
			connect: [[], [52]],
		},
		55: {
			isG: !true,
			key: 55,
			pos: [150, -2650],
			currency: GardenCurrencies.idea,
			cost: new Decimal(5e19),
			effect: {
				key: 11,
				mult: new Decimal(4.5),
			},
			unlocked(): boolean {
				return (
					Garden.boughtGeneratorReach(11, new Decimal(100)) &&
					Garden.boughtUpgrade(54) &&
					Garden.boughtUpgrade(53)
				);
			},
			show: (): boolean => Garden.boughtUpgrade(24),
			connect: [[], [52, 53, 54]],
		},
		56: {
			isG: !true,
			key: 56,
			name: 'LSER1',
			pos: [-300, 500],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(50000),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(37);
			},
			show(): boolean {
				return Garden.boughtUpgrade(37);
			},
			igNR: () => true,
			connect: [[], [37]],
			effectDescription(): string {
				return getMessage('garden.upg.56.desc');
			},
		},

		57: {
			isG: !true,
			key: 57,
			name: 'I3',
			pos: [-600, 1200],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(450),
			effect: {
				key: -1,
				mult: new Decimal(4),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(32);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			igNR: () => true,
			connect: [[], [32]],
		},
		58: {
			isG: !true,
			key: 58,
			name: 'I4',
			pos: [-800, 1400],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1350),
			effect: {
				key: -1,
				mult: new Decimal(5),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(57);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			igNR: () => true,
			connect: [[], [57]],
		},
		59: {
			isG: !true,
			key: 59,
			name: 'E3',
			pos: [600, 1200],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(3000),
			effect: {
				key: -2,
				mult: new Decimal(4),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(33);
			},
			show(): boolean {
				return Garden.boughtUpgrade(33);
			},
			igNR: () => true,
			connect: [[], [33]],
		},
		60: {
			isG: !true,
			key: 60,
			name: 'INS1',
			pos: [-800, 1200],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(250),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(57);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			igNR: () => true,
			connect: [[], [57]],
			effectDescription(): string {
				return getMessage('garden.upg.60.desc');
			},
		},
		61: {
			isG: !true,
			key: 61,
			name: 'LS4',
			pos: [-800, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(5e7),
			effect: {
				key: -3,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(39);
			},
			show(): boolean {
				return Garden.boughtUpgrade(39);
			},
			igNR: () => true,
			connect: [[], [39]],
		},
		62: {
			isG: !true,
			key: 62,
			name: 'LS5',
			pos: [-1000, 600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1e11),
			effect: {
				key: -3,
				mult: new Decimal(2),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(61);
			},
			show(): boolean {
				return Garden.boughtUpgrade(61);
			},
			igNR: () => true,
			connect: [[], [61]],
		},
		63: {
			isG: !true,
			key: 63,
			name: 'IP1',
			pos: [-600, 1000],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(10000),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(32);
			},
			show(): boolean {
				return Garden.boughtUpgrade(32);
			},
			igNR: () => true,
			connect: [[], [32]],
			effectDescription(): string {
				return getMessage('garden.upg.63.desc');
			},
		},
		64: {
			isG: !true,
			key: 64,
			name: 'I5',
			pos: [-1000, 1600],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(10000),
			effect: {
				key: -1,
				mult: new Decimal(6),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(58);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			igNR: () => true,
			connect: [[], [58]],
		},
		65: {
			isG: !true,
			key: 65,
			name: 'I6',
			pos: [-1200, 1800],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1e5),
			effect: {
				key: -1,
				mult: new Decimal(7),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(64);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			igNR: () => true,
			connect: [[], [64]],
		},
		66: {
			isG: !true,
			key: 66,
			name: 'E4',
			pos: [800, 1400],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1e5),
			effect: {
				key: -2,
				mult: new Decimal(5),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(59);
			},
			show(): boolean {
				return Garden.boughtUpgrade(59);
			},
			igNR: () => true,
			connect: [[], [59]],
		},
		67: {
			isG: !true,
			key: 67,
			name: 'ATU1',
			pos: [-100, 800],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(2000),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(23);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			connect: [[], [23]],
			igNR: () => true,
			effectDescription(): string {
				return getMessage('garden.upg.67.desc');
			},
		},
		68: {
			isG: !true,
			key: 68,
			name: 'ATB1',
			pos: [100, 800],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(4000),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(23);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			connect: [[], [23]],
			igNR: () => true,
			effectDescription(): string {
				return getMessage('garden.upg.68.desc');
			},
		},
		69: {
			isG: !true,
			key: 69,
			name: 'ATU2',
			pos: [-250, 1000],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1e7),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(67);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			connect: [[], [67]],
			igNR: () => true,
			effectDescription(): string {
				return getMessage('garden.upg.69.desc');
			},
		},
		70: {
			isG: !true,
			key: 70,
			name: 'ATB2',
			pos: [150, 1000],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(2e7),
			effect: {
				key: -999,
				mult: new Decimal(1),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(68);
			},
			show(): boolean {
				return player.garden.igTimes.gt(0);
			},
			connect: [[], [68]],
			igNR: () => true,
			effectDescription(): string {
				return getMessage('garden.upg.70.desc');
			},
		},
		71: {
			isG: !true,
			key: 71,
			name: 'EP1',
			pos: [600, 1000],
			currency: GardenCurrencies.inspiration,
			cost: new Decimal(1e9),
			effect: {
				key: -2,
				mult: new Decimal(3),
			},
			unlocked(): boolean {
				return Garden.boughtUpgrade(33);
			},
			show(): boolean {
				return Garden.boughtUpgrade(33);
			},
			igNR: () => true,
			connect: [[], [33]],
		},
	} satisfies {
		[key in any]: GardenUpgrade;
	},
} as const;
export const Garden = {
	boughtGenerator(key: keyof typeof GardenGenUpgs.generators) {
		return player.garden.generators[key] ?? new Decimal(0);
	},
	boughtGeneratorReach(key: keyof typeof GardenGenUpgs.generators, least: Decimal): boolean {
		return Garden.boughtGenerator(key).gte(least.sub(1e-9));
	},
	boughtUpgrade(key: keyof typeof GardenGenUpgs.upgrades) {
		return Boolean(player.garden.upgrades[key]) ?? false;
	},
	entropyEffect() {
		const base = player.garden.entropy.add(1).ln().add(1);
		return base;
	},
	generatorCost(key: keyof typeof GardenGenUpgs.generators) {
		let base = GardenGenUpgs.generators[key].cost;
		let scale = new Decimal(1.1);
		const bought = Garden.boughtGenerator(key);
		base = base.mul(scale.pow(bought));
		if (GardenGenUpgs.generators[key].currency.entropyEffective)
			base = base.mul(Garden.entropyEffect());
		return base;
	},
	upgradeCost(key: keyof typeof GardenGenUpgs.upgrades) {
		let base = GardenGenUpgs.upgrades[key].cost;
		if (GardenGenUpgs.upgrades[key].currency.entropyEffective)
			base = base.mul(Garden.entropyEffect());
		return base;
	},
	generatorEffectDescription(key: keyof typeof GardenGenUpgs.generators): string {
		if (!('effectDescription' in GardenGenUpgs.generators[key])) return '';
		if (!(typeof GardenGenUpgs.generators[key].effectDescription == 'function')) return '';
		return (
			GardenGenUpgs.generators[key].effectDescription?.(player.garden.generators[key]) ?? ''
		);
	},
	upgradeEffectDescription(key: keyof typeof GardenGenUpgs.upgrades): string {
		if (!('effectDescription' in GardenGenUpgs.upgrades[key])) return '';
		if (!(typeof GardenGenUpgs.upgrades[key].effectDescription == 'function')) return '';
		return GardenGenUpgs.upgrades[key].effectDescription?.() ?? '';
	},
	upgradeImproving(key: number, $t: $t): string {
		switch (key) {
			case -1:
				return $t('garden.improving.0');
			case -2:
				return $t('garden.improving.1');
			case -3:
				return $t('garden.improving.2');
			default:
				return '???';
		}
	},
	buyGenerator(key: keyof typeof GardenGenUpgs.generators) {
		if (
			GardenGenUpgs.generators[key].unlocked() &&
			GardenGenUpgs.generators[key].currency.value().gte(Garden.generatorCost(key))
		) {
			GardenGenUpgs.generators[key].currency.write(
				GardenGenUpgs.generators[key].currency.value().sub(Garden.generatorCost(key)),
			);
			player.garden.generators[key] = player.garden.generators[key].add(1);
		}
	},
	canBoughtUpgrade(key: keyof typeof GardenGenUpgs.upgrades): boolean {
		if (!GardenGenUpgs.upgrades[key].unlocked()) return false;
		return GardenGenUpgs.upgrades[key].currency.value().gte(Garden.upgradeCost(key));
	},
	buyUpgrade(key: keyof typeof GardenGenUpgs.upgrades) {
		if (Garden.canBoughtUpgrade(key) && !player.garden.upgrades[key]) {
			GardenGenUpgs.upgrades[key].currency.write(
				GardenGenUpgs.upgrades[key].currency.value().sub(Garden.upgradeCost(key)),
			);
			player.garden.upgrades[key] = true;
		}
	},
	generatorIdea(key: keyof typeof GardenGenUpgs.generators) {
		let base = Garden.boughtGenerator(key).mul(GardenGenUpgs.generators[key].idea);
		for (const i in player.garden.upgrades) {
			if (
				GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades].effect
					.key == key ||
				GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades].effect
					.key == -1
			)
				base = base.mul(
					GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades]
						.effect.mult,
				);
		}
		base = base.mul(player.garden.generators[7].mul(0.01).add(1));
		base = base.mul(player.garden.generators[8].mul(0.02).add(1));

		base = base.mul(player.garden.generators[9].mul(0.03).add(1));
		base = base.mul(player.garden.generators[10].mul(0.04).add(1));
		if (Garden.boughtUpgrade(63)) {
			base = base.mul(player.garden.totalIdea.add(1).clampMin(1).log10().add(1));
		}
		return base;
	},
	generatorEntropy(key: keyof typeof GardenGenUpgs.generators) {
		let base = Garden.boughtGenerator(key).mul(GardenGenUpgs.generators[key].entropy);
		for (const i in player.garden.upgrades) {
			if (
				GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades].effect
					.key == -2
			)
				base = base.div(
					GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades]
						.effect.mult,
				);
		}
		if (Garden.boughtUpgrade(71)) {
			base = base.div(player.garden.totalIdea.add(1).clampMin(1).log10().add(1));
		}
		return base;
	},
	localspeedYield() {
		let base = new Decimal(1);
		for (const i in player.garden.upgrades) {
			if (
				GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades].effect
					.key == -3
			)
				base = base.mul(
					GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades]
						.effect.mult,
				);
		}
		return base.pow(13);
	},
	ideaYield() {
		let base = new Decimal(0);
		for (const i in player.garden.generators) {
			base = base.add(
				Garden.generatorIdea(i as unknown as keyof typeof player.garden.generators),
			);
		}
		return base;
	},
	entropyYield() {
		let base = new Decimal(0);
		for (const i in player.garden.generators) {
			base = base.add(
				Garden.generatorEntropy(i as unknown as keyof typeof player.garden.generators),
			);
		}
		return base;
	},
	igCD() {
		if (Garden.boughtUpgrade(47)) return 0;
		if (Garden.boughtUpgrade(46)) return 1 * 1000;
		if (Garden.boughtUpgrade(45)) return 3 * 1000;
		if (Garden.boughtUpgrade(44)) return 10 * 1000;
		if (Garden.boughtUpgrade(43)) return 30 * 1000;
		if (Garden.boughtUpgrade(42)) return 1 * 60 * 1000;
		if (Garden.boughtUpgrade(41)) return 3 * 60 * 1000;
		if (Garden.boughtUpgrade(40)) return 10 * 60 * 1000;
		if (Garden.boughtUpgrade(50)) return 30 * 60 * 1000;
		if (Garden.boughtUpgrade(49)) return 1 * 3600 * 1000;
		if (Garden.boughtUpgrade(48)) return 2 * 3600 * 1000;
		if (Garden.boughtUpgrade(36)) return 4 * 3600 * 1000;
		if (Garden.boughtUpgrade(35)) return 8 * 3600 * 1000;
		if (Garden.boughtUpgrade(34)) return 16 * 3600 * 1000;
		return 24 * 3600 * 1000;
	},
	nextIgRemain() {
		return Math.max(Garden.igCD() + player.garden.lastIG - Date.now(), 0);
	},
	nextIg() {
		return Garden.igCD() + player.garden.lastIG;
	},
	igGain(): Decimal {
		if (player.garden.totalIdea.lt(1e6)) return new Decimal(0);
		let exp = new Decimal(0.25);
		if (Garden.boughtUpgrade(60)) {
			exp = new Decimal(0.275);
		}
		const base = player.garden.totalIdea.div(1e6).pow(exp);
		return base;
	},
	insPowerGain(): Decimal {
		let base = new Decimal(2).pow(Garden.level());
		if (!Garden.boughtUpgrade(23)) return new Decimal(0);
		return base;
	},
	insPowerEffect(): Decimal {
		let base = player.garden.insPower.add(1).ln().div(100).add(1);
		return base;
	},
	igReset() {
		if (Garden.igGain().lt(1)) return;
		if (Garden.nextIgRemain() > 0) return;
		const gain = Garden.igGain();
		player.garden.igTimes = player.garden.igTimes.add(1);
		player.garden.inspiration = player.garden.inspiration.add(gain);
		player.garden.totalInspiration = player.garden.totalInspiration.add(gain);
		player.garden.bestInspiration = player.garden.inspiration.max(
			player.garden.bestInspiration,
		);
		player.garden.lastIG = Date.now();
		player.garden.focusNode = GardenGenUpgs.generators[0];

		player.garden.idea = new Decimal(0);
		player.garden.totalIdea = new Decimal(0);
		player.garden.bestIdea = new Decimal(0);
		player.garden.entropy = new Decimal(0);
		player.garden.totalEntropy = new Decimal(0);
		player.garden.bestEntropy = new Decimal(0);
		for (const i in player.garden.generators) {
			if (
				!igGNR(GardenGenUpgs.generators[Number(i) as keyof typeof GardenGenUpgs.generators])
			)
				player.garden.generators[Number(i) as keyof typeof GardenGenUpgs.generators] =
					new Decimal(0);
		}
		for (const i in player.garden.upgrades) {
			if (!ignoreNR(GardenGenUpgs.upgrades[Number(i) as keyof typeof GardenGenUpgs.upgrades]))
				player.garden.upgrades[i] = false;
		}
	},
	exp(): Decimal {
		let base = player.garden.trueBestIdea
			.mul(player.garden.bestInspiration.pow(2))
			.mul(player.garden.trueBestEntropy.pow(2));
		let q = base.max(1).max(player.garden.bestExp);
		if (q.gte('1e81')) {
			q = q.div('1e81').pow(0.5).mul('1e81');
		}
		return q;
	},
	level(): Decimal {
		let base = Garden.exp().log10().root(2);

		return base.floor();
	},
	expPercent(): string {
		let nextLevelLog = Garden.level().add(1).pow(2);
		let thisLevelLog = Garden.level().pow(2);
		return (
			(
				Garden.exp()
					.log10()
					.sub(thisLevelLog)
					.div(nextLevelLog.sub(thisLevelLog))
					.toNumber() * 100
			).toFixed(5) + '%'
		);
	},
	localSpeed(): Decimal {
		let base = new Decimal(1);
		base = base.mul(Garden.insPowerEffect());
		base = base.mul(Garden.localspeedYield());
		if (base.gte(1e5)) {
			base = base.div(1e5).pow(0.25).mul(1e5);
		}
		return base;
	},
	entropyGainLDebuff(): Decimal {
		let base = new Decimal(1);
		if (Garden.boughtUpgrade(56)) base = base.mul(0.8);
		return base;
	},
	gardenLoop(diff: number) {
		if (player.garden.openSimulate) {
			let localDiff = Garden.localSpeed().mul(diff);
			if (player.garden.generators[0].lt(1)) player.garden.generators[0] = new Decimal(1);
			const iY = Garden.ideaYield().mul(localDiff);
			const eY = Garden.entropyYield().mul(localDiff.pow(this.entropyGainLDebuff()));
			player.garden.idea = player.garden.idea.add(iY);
			player.garden.entropy = player.garden.entropy.add(eY);
			player.garden.totalIdea = player.garden.totalIdea.add(iY);
			player.garden.totalEntropy = player.garden.totalEntropy.add(eY);
			player.garden.bestIdea = player.garden.bestIdea.max(player.garden.idea);
			player.garden.bestEntropy = player.garden.bestEntropy.max(player.garden.entropy);
			player.garden.bestExp = player.garden.bestExp.max(Garden.exp());
			player.garden.trueBestEntropy = player.garden.trueBestEntropy.max(
				player.garden.entropy,
			);
			player.garden.trueBestIdea = player.garden.trueBestIdea.max(player.garden.idea);
			player.garden.insPower = player.garden.insPower.add(
				Garden.insPowerGain().mul(localDiff),
			);

			if (Garden.boughtUpgrade(67) && Date.now() - player.garden.ATU1LastBought >= 30000) {
				for (let i = 0; i <= 22; i++) {
					if (Garden.canBoughtUpgrade(i as IntClosedRange<0, 22>)) {
						Garden.buyUpgrade(i as IntClosedRange<0, 22>);
					}
				}
				player.garden.ATU1LastBought = Date.now();
			}
			if (Garden.boughtUpgrade(68) && Date.now() - player.garden.ATB1LastBought >= 30000) {
				for (let i = 0; i <= 4; i++) {
					Garden.buyGenerator(i as IntClosedRange<0, 4>);
				}
				player.garden.ATB1LastBought = Date.now();
			}
			//27 28 29 30 31 51 52 53 54 55
			if (Garden.boughtUpgrade(69) && Date.now() - player.garden.ATU2LastBought >= 45000) {
				for (const i of [27, 28, 29, 30, 31, 51, 52, 53, 54, 55] as const) {
					if (Garden.canBoughtUpgrade(i)) {
						Garden.buyUpgrade(i);
					}
				}
				player.garden.ATU2LastBought = Date.now();
			}
			if (Garden.boughtUpgrade(70) && Date.now() - player.garden.ATU2LastBought >= 45000) {
				for (const i of [5, 6, 11, 12] as const) {
					Garden.buyGenerator(i);
				}
				player.garden.ATB2LastBought = Date.now();
			}
		}
	},
	playerData() {
		const base = {
			idea: new Decimal(0),
			totalIdea: new Decimal(0),
			bestIdea: new Decimal(0),
			entropy: new Decimal(0),
			totalEntropy: new Decimal(0),
			bestEntropy: new Decimal(0),
			inspiration: new Decimal(0),
			totalInspiration: new Decimal(0),
			bestInspiration: new Decimal(0),
			generators: {} as {
				[key in keyof typeof GardenGenUpgs.generators]: Decimal;
			},
			upgrades: [] as boolean[],
			openSimulate: false,
			lastIG: Date.now(),
			focusNode: GardenGenUpgs.generators[0] as GardenGenerator | GardenUpgrade,
			igTimes: new Decimal(0),
			insPower: new Decimal(0),
			bestExp: new Decimal(0),
			trueBestEntropy: new Decimal(0),
			trueBestIdea: new Decimal(0),
			ATU1LastBought: Date.now(),
			ATB1LastBought: Date.now(),
			ATU2LastBought: Date.now(),
			ATB2LastBought: Date.now(),
		};
		for (const i in GardenGenUpgs.generators) {
			base.generators[<keyof typeof GardenGenUpgs.generators>(<unknown>i)] = new Decimal(0);
		}
		return base;
	},
} as const;
