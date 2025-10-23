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

export function dayOfWeek(): [number, string] {
	const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	let date = new Date();
	let dayOfWeek = date.getDay();
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
export function PTreset() {
	player.nonrecu = NON_RECURSIVE.playerData();
	player.hydra = Hydra.playerData();
	player.challenges[1] = [DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0];
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
						if (player.challenges[1][6].lt(1)) {
							ModalService.show({
								title: '重置不了',
								content: 'NRC7挑战次数至少大于1',
							});
						} else if (player.nonrecu.studies_bought.includes(30)) {
							PTreset();
							player.pt.resetTimes = player.pt.resetTimes.add(1);
							Analysis.singleAnalysis();
						}
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
	singleAnalysis() {
		for (let d = 0; d < 7; d++) {
			if (!Analysis.analysisUnlocked(d)) continue;
			if (player.pt.analysis[d] >= 11) continue;
			if (
				Math.random() <= 0.05 ||
				player.pt.analysis[d] == 0 ||
				player.pt.analysisFailed[d] >= 19
			) {
				player.pt.analysis[d]++;
				player.pt.analysisFailed[d] = 0;
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
		};
	},
} as const;
