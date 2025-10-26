import { player, feature } from '@/core/global';
import { format, formatWhole } from '@/utils/format';
import Decimal, { type DecimalSource } from 'break_eternity.js';
import { wellOrderPlayerData } from '../ordinal/well_ordering';
import { DC } from '../constants';
import { NON_RECURSIVE } from '../nonrecu';
import { Hydra } from '../hydra/hydra';
import { Y_SEQ } from '../post-nonrec/y-seq';
import ModalService from '@/utils/Modal';
import { isTester } from '../save/testing';
import { predictableRandom } from '@/utils/algorithm.ts';
import { deepCopy } from '../save';

export function dayOfWeek(): [number, string] {
	const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	let dayOfWeek = ((Math.floor((Date.now() - 1761408000000) / 86400000) % 7) + 7) % 7;
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
			let fakeRandom = predictableRandom(player.pt.seed[d] * player.pt.seedTimes[d]);
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

export type GardenGenerator = {
	key: number;
	pos: [number, number];
	cost: Decimal;
	idea: Decimal;
	entropy: Decimal;
	unlocked: boolean;
};

export type GardenUpgradeEffect = {
	key: number;
	mult: Decimal;
};

export type GardenUpgrade = {
	key: number;
	pos: [number, number];
	cost: Decimal;
	effect: GardenUpgradeEffect;
	unlocked: boolean;
};

export const Garden = {
	generators: {
		0: {
			key: 0,
			name: 'Bowstring',
			pos: [0, 0],
			cost: new Decimal(2e-6),
			idea: new Decimal(5e-8),
			entropy: new Decimal(1e-12),
			unlocked: () => true,
		},
	},
	upgrades: {
		0: {
			key: 0,
			name: 'Bowstring Vibrate',
			pos: [0, -200],
			cost: new Decimal(1e-6),
			effect: {
				key: 0,
				mult: new Decimal(2),
			},
			unlocked: () => Garden.boughtGeneratorReach(0, new Decimal(1)),
		},
	},
	boughtGenerator(key: number) {
		return player.garden.generators[key];
	},
	boughtGeneratorReach(key: number, least: Decimal) {
		return Garden.boughtGenerator(key).gte(least.sub(1e-9));
	},
	boughtUpgrade(key: number) {
		return player.garden.upgrades.includes({
			key: key,
		});
	},
	entropyEffect() {
		let base = player.garden.entropy.add(1).ln().add(1);
		return base;
	},
	generatorCost(key) {
		let base = Garden.generators[key].cost;
		let scale = new Decimal(1.1);
		let bought = Garden.boughtGenerator(key);
		return base.mul(scale.pow(bought));
	},
	generatorIdea(key) {
		let base = Garden.boughtGenerator(key).mul(Garden.generators[key].idea);
		for(let i in player.garden.upgrades)
		{
			let u = player.garden.upgrades[i].key;
			if(Garden.upgrades[u].effect.key == key) base = base.mul(Garden.upgrades[u].effect.mult);
		}
		return base;
	},
	generatorEntropy(key) {
		let base = Garden.boughtGenerator(key).mul(Garden.generators[key].entropy);
		return base;
	},
	ideaYield() {
		let base = new Decimal(0);
		for(let i in player.garden.generators)
		{
			base = base.add(Garden.generatorIdea(i));
		}
		return base;
	},
	entropyYield() {
		let base = new Decimal(0);
		for(let i in player.garden.generators)
		{
			base = base.add(Garden.generatorEntropy(i));
		}
		return base;
	},
	gardenLoop(diff) {
		if(player.garden.openSimulate)
		{
			let iY = Garden.ideaYield().mul(diff);
			let eY = Garden.entropyYield().mul(diff);
			player.garden.idea = player.garden.idea.add(iY);
			player.garden.entropy = player.garden.entropy.add(eY);
			player.garden.totalIdea = player.garden.totalIdea.add(iY);
			player.garden.totalEntropy = player.garden.totalEntropy.add(eY);
			player.garden.bestIdea = player.garden.bestIdea.max(player.garden.idea);
			player.garden.bestEntropy = player.garden.bestEntropy.max(player.garden.entropy);
		}
	},
	playerData() {
		let base = {
			idea: new Decimal(0),
			totalIdea: new Decimal(0),
			bestIdea: new Decimal(0),
			entropy: new Decimal(0),
			totalEntropy: new Decimal(0),
			bestEntropy: new Decimal(0),
			inspiration: new Decimal(0),
			totalInspiration: new Decimal(0),
			bestInspiration: new Decimal(0),
			generators: {},
			upgrades: [],
			openSimulate: false,
			lastIG: Date.now(),
		};
		for(let i in Garden.generators)
		{
			base.generators[i] = new Decimal(0);
		}
		return base;
	},
} as const;
