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
import { getMessage, i18n } from '@/utils/i18n';
import type { $t } from '@/utils/types';
import { Oracle } from './oracle/oracle.ts';
import { Garden } from './garden.ts';
import { NON_REC_BMS } from '../nonrecu/nonrec-bms/index.ts';

export function dayOfWeek(): [number, string] {
	let weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	// @ts-expect-error
	if (i18n.global.locale.value == 'en-US') {
		weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	}
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
	const studiesbought = deepCopy(player.nonrecu.studies_bought);
	if (fromPT && Garden.level().gte(10) && player.hydra.deduceOrdinal[0].gte(DC.D_4T6)) {
		player.pt.power = player.pt.power.add(Analysis.ptPowerGain());
		player.pt.totalPower = player.pt.totalPower.add(Analysis.ptPowerGain());
	}
	if (player.pt.power.gte(1) && fromPT) {
		player.oracle.ptResetTimeProgress = player.oracle.ptResetTimeProgress + 0.001;
	}
	player.nonrecu = NON_RECURSIVE.playerData();
	if (player.upgrades['7t7q']) {
		player.nonrecu.theories = backup;
	}
	if (studiesbought.includes(31)) {
		player.nonrecu.studies_bought = studiesbought;
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
	if (player.pt.power.gte(1)) {
		player.upgrades['69R'] = true;
		player.upgrades['71UN'] = true;
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
				title: getMessage('pt.reset.title3'),
				content: getMessage('pt.reset.desc4'),
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
		title: getMessage('pt.reset.title'),
		content: getMessage('pt.reset.desc'),
		onConfirm() {
			PTresetCore(true);
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
			desc(x: DecimalSource, $t: $t): string {
				return $t('pt.analysisprogresseff.0') + '×' + format(this.value(x));
			},
		},
		1: {
			value(x: DecimalSource): Decimal {
				return new Decimal(1e8).pow(x);
			},
			desc(x: DecimalSource, $t: $t): string {
				return $t('pt.analysisprogresseff.1') + '×' + format(this.value(x));
			},
		},
		2: {
			value(x: DecimalSource): Decimal {
				return new Decimal(2).pow(x);
			},
			desc(x: DecimalSource, $t: $t): string {
				return $t('pt.analysisprogresseff.2') + '×' + format(this.value(x));
			},
		},
		3: {
			value(x: DecimalSource): Decimal {
				return new Decimal(1).add(x).root(3);
			},
			desc(x: DecimalSource, $t: $t): string {
				return $t('pt.analysisprogresseff.3') + '^' + format(this.value(x));
			},
		},
		4: {
			value(x: DecimalSource): Decimal {
				return new Decimal(1).add(x).root(5);
			},
			desc(x: DecimalSource, $t: $t): string {
				return $t('pt.analysisprogresseff.4') + '^' + format(this.value(x));
			},
		},
		5: {
			value(x: DecimalSource): Decimal {
				return new Decimal(10).pow(x);
			},
			desc(x: DecimalSource, $t: $t): string {
				return $t('pt.analysisprogresseff.5') + '×' + format(this.value(x));
			},
		},
		6: {
			value(x: DecimalSource): Decimal {
				return new Decimal(1).add(x).root(2.5);
			},
			desc(x: DecimalSource, $t: $t): string {
				return $t('pt.analysisprogresseff.5') + '^' + format(this.value(x));
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
			nonrecBMS: NON_REC_BMS.playerData(),
		};
	},
	ptPowerGain() {
		if (Garden.level().lt(10) || player.hydra.deduceOrdinal[0].lt(DC.D_4T6))
			return new Decimal(0);
		const CHE = player.hydra.compressedPower;
		let base = CHE.slog()
			.pow(CHE.slog().sub(3).max(1))
			.mul(Garden.level().div(10).tetrate(2))
			.clampMin(0);
		base = base.mul(Oracle.getFateTotalEffect(2));
		if(player.upgrades[810]) base = base.pow(CHE.slog().max(1).root(3));
		if(player.pt.power.gte('ee7')) base = base.log10().pow(1.1).pow10();
		if(player.milestones['sin_4'])
		{
			base = base.pow(CHE.slog().sub(1150).div(75).max(1));
			if(CHE.slog().gte(1280)) base = base.pow(CHE.slog().sub(1180).div(100).max(1));
			if(CHE.slog().gte(1600)) base = base.pow(CHE.slog().sub(600).div(1000).root(2).max(1));
		}
		return base;
	},
} as const;
