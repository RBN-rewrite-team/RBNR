import { player } from '@/core/global';
import { format } from '@/utils/format';
import Decimal, { type DecimalSource } from 'break_eternity.js';
import { wellOrderPlayerData } from '../ordinal/well_ordering';
import { DC } from '../constants';
import { NON_RECURSIVE } from '../nonrecu';
import { Hydra } from '../hydra/hydra';
import { Y_SEQ } from '../post-nonrec/y-seq';
import ModalService from '@/utils/Modal';
import { predictableRandom } from '@/utils/algorithm.ts';
import { deepCopy } from '../save';
import { updateResetStatData } from '../stats';

export function dayOfWeek(): [number, string] {
	const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	const dayOfWeek = ((Math.floor((Date.now() - 1761408000000) / 86400000) % 7) + 7) % 7;
	return [dayOfWeek, weekdays[dayOfWeek]];
}
// prettier-ignore
const resetUpgrades = [
	/*'61',*/'610S','611','6110','6111','6112','6113','6114','611S','612','612S','613','613S','614','614S','615','615S','616S',
	'617','618','619','61R','61S','62','62R','62S','63','63R','63S','64','64R','64S','65','65R','65S','66','66R','66S','67R',
	'67S','68R','68S','69R','69S', '71','71UN','72','73','74','U6R11','U6R12','U6R13','U6R14','U6R15',
	'621','6210','6211','6212','621R','622','622R','623','624','625','626','627','628','629'
] as const satisfies (keyof typeof player.upgrades)[];

// prettier-ignore
const resetBuyables = [
	'611','612','613','614','61R','62R',
	'B6R11','B6R12','B6R13','B6R14','B6R15',
] as const satisfies (keyof typeof player.buyables)[];
export function PTreset(fromPT = false) {
	const backup = deepCopy(player.nonrecu.theories);
	player.nonrecu = NON_RECURSIVE.playerData();
	if (player.upgrades['7t7q']) {
		player.nonrecu.theories = backup;
	}
	player.hydra = Hydra.playerData();
	if (!player.upgrades['7c1q']) player.challenges[1][0] = DC.D_0;
	if (!player.upgrades['7c2q']) player.challenges[1][1] = DC.D_0;
	if (!player.upgrades['7c3q']) player.challenges[1][2] = DC.D_0;
	if (!player.upgrades['7c4q']) player.challenges[1][3] = DC.D_0;
	if (!player.upgrades['7c5q']) player.challenges[1][4] = DC.D_0;
	if (!player.upgrades['7c6q']) player.challenges[1][5] = DC.D_0;
	player.challenges[1][6] = DC.D_0;
	player.challengein = [-1, -1];
	for (const key of resetUpgrades) {
		player.upgrades[key] = false;
	}
	for (const key of resetBuyables) {
		player.buyables[key] = DC.D_0;
	}
	for (const key of [
		'dut1',
		'dut2',
		'dut3',
		'dut4',
		'dut5',
		'dut6',
		'dut7',
		'dut8',
		'dut9',
		'dut10',
		'dut11',
		'dut12',
		'dut13',
		'dut14',
		'dut15',
		'dut16',
		'dut17',
		'dut18',

		'nonrec_1',
		'nonrec_2',
		'nonrec_3',
		'nonrec_4',
		'nonrec_5',
		'nonrec_6',
		'nonrec_7',
		'nonrec_8',
		'nonrec_9',
		'nonrec_10',
		'nonrec_11',
		'nonrec_12',
		'nonrec_13',
		'nonrec_14',
		'nonrec_15',
		'nonrec_16',
		'nonrec_17',
		'nonrec_18',
		'nonrec_19',
		'nonrec_20',
		'nonrec_21',
		'nonrec_22',
		'nonrec_23',
		'nonrec_24',
		'nonrec_25',
		'nonrec_26',
	]) {
		player.milestones[key] = false;
	}
	player.numbertheory.well_ordering = wellOrderPlayerData();
	player.numbertheory.GM.x = DC.D_0;
	player.postnonrec.yseq = Y_SEQ.playerData();
}
export function PTresetCore(notification = false) {
	if (player.challenges[1][6].lt(1)) {
		if (notification)
			ModalService.show({
				title: '重置不了',
				content: 'NRC7挑战次数至少大于1',
			});
	} else if (player.nonrecu.studies_bought.includes(30)) {
		PTreset(true);
		updateResetStatData('recent10PTOReset', new Decimal(0));
		player.pt.resetTimes = player.pt.resetTimes.add(1);
		if (player.milestones.pt_3) {
			player.pt.qolPointsCrystal = player.pt.qolPointsCrystal.add(1);
		}
		if (player.milestones.pt_4) {
			player.nonrecu.resetTimes = new Decimal(2);
		}
		if (player.milestones.pt_5) {
			player.nonrecu.resetTimes = new Decimal(4);
		}
		Analysis.singleAnalysis();
	}
}
export function realPTreset() {
	ModalService.show({
		title: '证明论重置',
		content: '确实要证明论重置?(需要进入Gamma测试)',
		onConfirm() {
			if (player.options.gammaTest) {
				ModalService.show({
					title: '再次确认证明论重置',
					content:
						'证明论重置还没做完，可能会导致：证明论效果失效，ω病毒，卡死病毒，你确实要重置?',
					onConfirm() {
						PTresetCore(true);
					},
				});
			} else {
				ModalService.show({
					title: '重置不了',
					content: '需要进入Gamma测试。<br>（当前证明论还不稳定，可能有bug）',
				});
			}
		},
	});
}
export const PTEffects = {
	effectToPreCardinal() {
		return player.pt.resetTimes.mul(0.1).add(1).clampMax(5);
	},
	effectToHydraEnergyLogSoftCap() {
		return player.pt.resetTimes.clampMax(50);
	},
	effectToSolutions() {
		return player.pt.resetTimes.mul(0.03).add(1).clampMax(4);
	},
	effectToNonrecResetTimes() {
		return player.pt.resetTimes.mul(0.06).add(1).clampMax(25);
	},
	effectToNonrecChallengeGoalLevel() {
		return player.pt.resetTimes.clampMax(50);
	},
} as const;
export const Analysis = {
	systems: [
		'PA',
		'KP',
		'Π<sub>1</sub>-CA<sub>0</sub>',
		'Π<sub>2</sub>-CA<sub>0</sub>',
		'Z<sub>2</sub>',
		'Z<sub>ω</sub>',
		'ZFC',
	],
	systemEffect: {
		0: {
			value(x: DecimalSource): Decimal {
				return new Decimal(1e10).pow(x);
			},
			desc(x: DecimalSource): string {
				return '九头蛇能量获取×' + format(this.value(x));
			},
		},
		1: {
			value(x: DecimalSource): Decimal {
				return new Decimal(1e8).pow(x);
			},
			desc(x: DecimalSource): string {
				return '非递归能量获取×' + format(this.value(x));
			},
		},
		2: {
			value(x: DecimalSource): Decimal {
				return new Decimal(2).pow(x);
			},
			desc(x: DecimalSource): string {
				return '非递归次数获取×' + format(this.value(x));
			},
		},
		3: {
			value(x: DecimalSource): Decimal {
				return new Decimal(1).add(x).root(3);
			},
			desc(x: DecimalSource): string {
				return '推演能量获取^' + format(this.value(x));
			},
		},
		4: {
			value(x: DecimalSource): Decimal {
				return new Decimal(1).add(x).root(5);
			},
			desc(x: DecimalSource): string {
				return '九头蛇溶液获取^' + format(this.value(x));
			},
		},
		5: {
			value(x: DecimalSource): Decimal {
				return new Decimal(10).pow(x);
			},
			desc(x: DecimalSource): string {
				return 'Y序列引擎效率×' + format(this.value(x));
			},
		},
		6: {
			value(x: DecimalSource): Decimal {
				return new Decimal(1).add(x).root(2.5);
			},
			desc(x: DecimalSource): string {
				return 'Y序列引擎效率^' + format(this.value(x));
			},
		},
	} as const,
	analysisUnlocked(id: number): boolean {
		if (dayOfWeek()[0] == id) return true;
		if (dayOfWeek()[0] == 0) return true;
		return false;
	},
	powerGain() {
		// if (player.hydra.compressedPower.gte("eee30")) return ne
		return new Decimal(0);
	},
	analysisRate() {
		if (dayOfWeek()[0] == 0) return 0.02;
		else return 0.1;
	},
	analysisCycle() {
		if (dayOfWeek()[0] == 0) return 50;
		else return 10;
	},
	singleAnalysis() {
		for (let d = 0; d < 7; d++) {
			if (!Analysis.analysisUnlocked(d)) continue;
			if (player.pt.analysis[d] >= 11) continue;
			player.pt.seedTimes[d]++;
			const fakeRandom = predictableRandom(player.pt.seed[d] * player.pt.seedTimes[d]);
			if (
				fakeRandom <= this.analysisRate() ||
				player.pt.analysis[d] == 0 ||
				player.pt.analysisFailed[d] >= this.analysisCycle() - 1
			) {
				player.pt.analysis[d]++;
				player.pt.analysisFailed[d] = 0;

				if (player.milestones.pt_2) {
					player.timeshard.value = player.timeshard.value.add(50);
				}
			} else {
				player.pt.analysisFailed[d]++;
			}
		}
	},

	playerData() {
		return {
			power: new Decimal(0),
			totalPower: new Decimal(0),
			resetTimes: new Decimal(0),
			analysis: [0, 0, 0, 0, 0, 0, 0],
			analysisFailed: [0, 0, 0, 0, 0, 0, 0],
			seed: [
				Math.random(),
				Math.random(),
				Math.random(),
				Math.random(),
				Math.random(),
				Math.random(),
				Math.random(),
			],
			seedTimes: [0, 0, 0, 0, 0, 0, 0],
			qolPointsCrystal: new Decimal(0),
		};
	},
} as const;

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
	name: string;
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
	name: string;
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
			effectDescription: (x: Decimal): string => '想法产量×' + format(x.mul(0.01).add(1)),
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
			effectDescription: (x: Decimal): string => '想法产量×' + format(x.mul(0.02).add(1)),
			igNR: (): boolean => true,
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
				return '解锁花园等级';
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
				return '解锁远古阶段';
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
			pos: [50, -2175],
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
				return '灵感迸发最短时间降低到16小时';
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
				return '灵感迸发最短时间降低到8小时';
			},
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
	upgradeImproving(key: number): string {
		switch (key) {
			case -1:
				return '生成器想法倍增';
			case -2:
				return '生成器熵倍减';
			default:
				return '???';
		}
	},
	buyGenerator(key: keyof typeof GardenGenUpgs.generators) {
		if (GardenGenUpgs.generators[key].currency.value().gte(Garden.generatorCost(key))) {
			GardenGenUpgs.generators[key].currency.write(
				GardenGenUpgs.generators[key].currency.value().sub(Garden.generatorCost(key)),
			);
			player.garden.generators[key] = player.garden.generators[key].add(1);
		}
	},
	canBoughtUpgrade(key: keyof typeof GardenGenUpgs.upgrades): boolean {
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
		return base;
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
		const base = player.garden.totalIdea.div(1e6).pow(0.25);
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
			if(!igGNR(GardenGenUpgs.generators[Number(i) as keyof typeof GardenGenUpgs.generators]))
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
		return base.max(1).max(player.garden.bestExp);
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
			).toFixed(4) + '%'
		);
	},
	localSpeed(): Decimal {
		let base = new Decimal(1);
		base = base.mul(Garden.insPowerEffect());
		return base;
	},
	gardenLoop(diff: number) {
		if (player.garden.openSimulate) {
			let localDiff = Garden.localSpeed().mul(diff);
			if (player.garden.generators[0].lt(1)) player.garden.generators[0] = new Decimal(1);
			const iY = Garden.ideaYield().mul(localDiff);
			const eY = Garden.entropyYield().mul(localDiff);
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
		};
		for (const i in GardenGenUpgs.generators) {
			base.generators[<keyof typeof GardenGenUpgs.generators>(<unknown>i)] = new Decimal(0);
		}
		return base;
	},
} as const;
