import ModalService from '@/utils/Modal';
import { player } from '../save';
import { Dilute } from '../hydra/dilute';
import Decimal from 'break_eternity.js';
import { MILESTONES } from '../mechanic';
import { Currencies } from '../currencies';
import { CHALLENGE } from '../challenge';
import { DC } from '@/core/constants';
import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { getTotalTheories } from './total-theories';
import { addTheories } from './studies.ts';
import { energyToUNOCFSpeed } from '../ordinal/well_ordering';
import type { FixedLengthArray } from 'type-fest';
import { updateResetStatData } from '../stats.ts';
import { format } from '../../utils/format.ts';
import { Analysis, PTEffects } from '../pt/index.ts';
import { NON_REC_BMS } from './nonrec-bms/index.ts';
type NonRecusionTreePreset = {
	name: string;
	preset: number[];
};

export const NON_RECURSIVE = {
	upgrades: {
		'71': new (class U71 extends Upgrade {
			description = 'NRC1挑战限制从0.4667+完成次数削弱到0.4667+完成次数*0.3';
			cost = Decimal.pow(2, 768);
			name = 'U6-1';
			currency: Currencies = Currencies.NONREC;
		})(),
		'72': new (class extends Upgrade {
			description =
				'不在非递归挑战中时，重置后保留获得过的最高九头蛇溶液数量。大幅削弱九头蛇能量的二重软上限。';
			cost = Decimal.pow(2, 896);
			name = 'U6-2';
			currency: Currencies = Currencies.NONREC;
		})(),
		'71UN': new (class extends Upgrade {
			description: string | (() => string) = '开启UNOCF推演, (+1/s)';
			cost = new Decimal(0);
			name = 'U6-UNOCF-1';
			currency: Currencies = Currencies.NONREC;
		})(),
		'73': new (class extends Upgrade {
			description: string | (() => string) = '相对于外界，研究52|71|72|73的时间流逝快1000倍';
			cost = new Decimal('1e750');
			name = 'U6-3';
			currency: Currencies = Currencies.NONREC;
		})(),
		'74': new (class extends Upgrade {
			description: string | (() => string) = '大幅度增加九头蛇溶液的效果';
			cost = new Decimal('e8.75e6');
			name = 'U6-4';
			currency: Currencies = Currencies.NONREC;
		})(),
		'75': new (class extends Upgrade {
			description: string | (() => string) = '推演能量获取速度^1.25';
			cost = new Decimal('e2.7e20');
			name = 'U6-5';
			currency: Currencies = Currencies.NONREC;
		})(),
		'76': new (class extends Upgrade {
			description: string | (() => string) = '解锁更多数论研究5升级';
			cost = new Decimal('e8e20');
			name = 'U6-6';
			currency: Currencies = Currencies.NONREC;
		})(),
		'77': new (class extends UpgradeWithEffect<Decimal> {
			description = '非递归能量加成当前非递归中的时间获取速度';
			cost = () => (player.retribution == 1 ? new Decimal('ee70') : new Decimal('e5e73'));
			name = 'U6-7';
			currency: Currencies = Currencies.NONREC;
			effect(): Decimal {
				return player.nonrecu.power
					.max(1e10)
					.log10()
					.log10()
					.pow(player.upgrades[78] ? 2 : 1);
			}
			effectDescription() {
				return 'x' + format(this.effect());
			}
		})(),
		'78': new (class extends Upgrade {
			description: string | (() => string) = 'U6-7效果变为其平方';
			cost = () => (player.retribution == 1 ? new Decimal('ee166') : new Decimal('e4e173'));
			name = 'U6-8';
			currency: Currencies = Currencies.NONREC;
		})(),
	} as const,
	initMechanics() {
		MILESTONES.create('nonrec_1', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 1 : 1);
			},
			currency: '非递归重置次数',
			displayName: 'M6-1',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(1);
			},
		});
		MILESTONES.create('nonrec_2', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 2 : 2);
			},
			currency: '非递归重置次数',
			displayName: 'M6-2',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(2);
			},
		});
		MILESTONES.create('nonrec_3', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 4 : 3);
			},
			currency: '非递归重置次数',
			displayName: 'M6-3',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_4', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 5 : 4);
			},
			currency: '非递归重置次数',
			displayName: 'M6-4',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_5', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 7 : 5);
			},
			currency: '非递归重置次数',
			displayName: 'M6-5',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
			onDone() {
				player.upgrades['65'] = true;
				player.upgrades['615'] = true;
				player.upgrades['65R'] = true;
				player.upgrades['65S'] = true;
			},
		});
		MILESTONES.create('nonrec_6', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 8 : 6);
			},
			currency: '非递归重置次数',
			displayName: 'M6-6',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_7', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 10 : 7);
			},
			currency: '非递归重置次数',
			displayName: 'M6-7',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_8', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 12 : 8);
			},
			currency: '非递归重置次数',
			displayName: 'M6-8',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_9', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 14 : 9);
			},
			currency: '非递归重置次数',
			displayName: 'M6-9',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_10', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 16 : 10);
			},
			currency: '非递归重置次数',
			displayName: 'M6-10',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_11', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 20 : 15);
			},
			currency: '非递归重置次数',
			displayName: 'M6-11',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_12', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 30 : 20);
			},
			currency: '非递归重置次数',
			displayName: 'M6-12',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_13', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 60 : 40);
			},
			currency: '非递归重置次数',
			displayName: 'M6-13',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_14', {
			get requirement() {
				return new Decimal(player.options.hardMode ? 150 : 60);
			},
			currency: '非递归重置次数',
			displayName: 'M6-14',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_15', {
			requirement: new Decimal(200),
			currency: '非递归重置次数',
			displayName: 'M6-15',
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_16', {
			requirement: new Decimal(1e50),
			currency: '非递归能量',
			displayName: 'M6-16',
			show: true,
			get canDone() {
				return player.nonrecu.power.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_17', {
			requirement: new Decimal(29.2),
			currency: 'NRC5次数',
			displayName: 'M6-17',
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.challenges[1][4].gte(29.2);
			},
		});
		MILESTONES.create('nonrec_18', {
			requirement: new Decimal(29.7),
			currency: 'NRC5次数',
			displayName: 'M6-18',
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.challenges[1][4].gte(29.7);
			},
		});
		MILESTONES.create('nonrec_19', {
			requirement: new Decimal(37),
			currency: 'NRC5次数',
			displayName: 'M6-19',
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.challenges[1][4].gte(37);
			},
		});
		MILESTONES.create('nonrec_20', {
			requirement: new Decimal(70),
			currency: 'NRC5次数',
			displayName: 'M6-20',
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.challenges[1][4].gte(70);
			},
		});
		MILESTONES.create('nonrec_21', {
			get requirement() {
				return player.retribution == 1 ? new Decimal(2 ** 22) : DC.D_2P24;
			},
			currency: 'UNOCF推演次数',
			displayName: 'M6-21',
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.nonrecu.unocf_j.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_22', {
			get requirement() {
				return player.retribution == 1 ? new Decimal(1e7) : new Decimal(6e7);
			},
			currency: 'UNOCF推演次数和2.25NRC6挑战次数',
			displayName: 'M6-22',
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return (
					player.nonrecu.unocf_j.gte(this.requirement) &&
					player.challenges[1][5].gte(2.25)
				);
			},
		});
		MILESTONES.create('nonrec_23', {
			get requirement() {
				return player.retribution == 1 ? new Decimal(1.5e7) : new Decimal(7.5e7);
			},
			currency: 'UNOCF推演次数',
			displayName: 'M6-23',
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return (
					player.nonrecu.unocf_j.gte(this.requirement) &&
					player.challenges[1][5].gte(2.25)
				);
			},
		});
		MILESTONES.create('nonrec_24', {
			get requirement() {
				return player.retribution == 1 ? new Decimal(1e9) : new Decimal(1e11);
			},
			currency: 'UNOCF推演次数',
			displayName: 'M6-24',
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return (
					player.nonrecu.unocf_j.gte(this.requirement) &&
					player.challenges[1][5].gte(2.25)
				);
			},
		});
		MILESTONES.create('nonrec_25', {
			requirement: new Decimal(29),
			currency: 'NRC6挑战次数 & M6-24',
			displayName: 'M6-25',
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.challenges[1][5].gte(29) && player.milestones.nonrec_24;
			},
		});
		MILESTONES.create('nonrec_26', {
			requirement: new Decimal(1),
			currency: 'NRC7挑战次数',
			displayName: 'M6-26',
			get show() {
				return player.milestones.nonrec_25;
			},
			get canDone() {
				return player.challenges[1][6].gte(1);
			},
		});
	},
	reset(force = false) {
		if (!this.resetable() && !force) {
			return ModalService.show({
				title: '重置不了',
				content: '重置需要 序数到达BO， 255,000,000溶液, 1e326649 九头蛇能量',
			});
		}
		player.firstResetBit |= 0b10000;
		updateResetStatData('recent10NonRecReset', this.gain());
		if (!force) this.addPower(this.gain());
		if (!force) {
			let timesGain = new Decimal(1);
			timesGain = timesGain.mul(Analysis.systemEffect[2].value(player.pt.analysis[2]));

			if (player.pt.resetTimes.gte(1)) {
				timesGain = timesGain.mul(PTEffects.effectToNonrecResetTimes());
			}
			player.nonrecu.resetTimes = player.nonrecu.resetTimes.add(timesGain);
		}
		Dilute.diluteReset(player.upgrades['6213'] ? true : false);
		player.hydra.trueTotalPower = DC.D_0;
		player.upgrades['61S'] = false;
		player.upgrades['62S'] = false;
		player.upgrades['63S'] = false;
		player.upgrades['64S'] = false;
		if (!player.milestones.nonrec_5) player.upgrades['65S'] = false;
		player.upgrades['66S'] = false;
		player.upgrades['67S'] = false;
		player.upgrades['68S'] = false;
		player.upgrades['69S'] = false;
		player.upgrades['610S'] = false;
		player.upgrades['611S'] = false;
		player.upgrades['612S'] = false;
		player.upgrades['613S'] = false;
		player.upgrades['614S'] = false;
		player.upgrades['615S'] = false;
		for (let i = 1; i <= 18; i++) {
			player.milestones[`dut${i}`] = false;
		}
		player.hydra.milestoneDut5Eff = DC.D_1;
		// if (!player.milestones.nonrec_2) player.hydra.pAuto = [!1, !1, !1, !1];
		//player.hydra.dilute.solvent = [0, 0, 0, 0, 0, 0, !1, !1, !1];
		player.hydra.dilute.lastSolvent = [0, 0, 0, 0, 0, 0, !1, !1, !1];
		player.hydra.dilute.lastDeduce = DC.D_0;
		player.hydra.dilute.prions = DC.D_1;
		if (player.milestones.nonrec_13 && !force)
			player.hydra.dilute.prions = new Decimal('1e150000000');
		player.hydra.dilute.inDilute = false;
		player.hydra.dilute.spentTime = 0;
		player.hydra.dilute.solutionCost = DC.D_0;
		if (!player.milestones.nonrec_12) player.hydra.dilute.solution = DC.D_0;
		else if (player.milestones.nonrec_14) {
		} else player.hydra.dilute.solution = player.hydra.dilute.solution.mul(0.01);
		if (player.upgrades[72]) player.hydra.dilute.solution = player.hydra.dilute.highestSolution;
		if (CHALLENGE.inChallenge(1, 1)) player.hydra.dilute.solution = DC.D_0;
		if (CHALLENGE.inChallenge(1, 2)) player.hydra.dilute.solution = DC.D_0;
		if (CHALLENGE.inChallenge(1, 4)) player.hydra.dilute.solution = DC.D_0;
		if (CHALLENGE.inChallenge(1, 5)) player.hydra.dilute.solution = DC.D_0;
		if (CHALLENGE.inChallenge(1, 6)) player.hydra.dilute.solution = DC.D_0;
		if (!player.milestones.nonrec_15) player.hydra.dilute.highestApocalypse = DC.D_0;
		if (player.nonrecu.studies_bought.includes(0) && !CHALLENGE.inChallenge(1, 3)) {
			player.hydra.power = player.hydra.power.add(20);
			player.hydra.totalPower = player.hydra.totalPower.add(20);
			player.hydra.trueTotalPower = player.hydra.trueTotalPower.add(20);
			player.hydra.dilute.solution = player.hydra.dilute.solution.add(20);
		}
		player.nonrecu.secInThisReset = DC.D_0;
	},
	resetable() {
		return (
			player.hydra.deduceOrdinal[0].gte('ee153.90699754796802') &&
			player.hydra.totalPower.gte('e326649') &&
			player.hydra.dilute.solution.gte(2.55e8)
		);
	},
	addResetGain() {},
	addPower(x: Decimal) {
		player.nonrecu.power = player.nonrecu.power.add(x);
		player.nonrecu.totalPower = player.nonrecu.totalPower.add(x);
		if (player.pt.power.lt(1)) {
			player.nonrecu.power = player.nonrecu.power.min('ee8.07230472602822538e153');
			player.nonrecu.totalPower = player.nonrecu.totalPower.min('ee8.07230472602822538e153');
		}
	},
	gainFactor(): [string, number, Decimal][] {
		const ADD_EFF = 0,
			MUL_EFF = 1,
			POW_EFF = 2,
			DIL_EFF = 3,
			EXP_EFF = 4;
		const factor: [string, number, Decimal][] = [];
		factor.push(['基础值', ADD_EFF, DC.D_1]);
		let solEff = player.hydra.dilute.solution.div(2.55e8);
		if (solEff.gte(3.5)) solEff = solEff.sub(2.5).log10().add(3.5);
		factor.push(['九头蛇溶液因子', MUL_EFF, solEff]);
		factor.push([
			'BMS推演进度因子',
			MUL_EFF,
			player.hydra.deduceOrdinal[0].max(1).log(4).max(1).log(4).div(256),
		]);
		factor.push(['基础值', ADD_EFF, new Decimal(-1)]);
		const nonrecbase = new Decimal(4);
		factor.push(['基础指数', EXP_EFF, nonrecbase]);
		if (player.nonrecu.studies_bought.includes(6))
			factor.push(['非递归研究41', MUL_EFF, new Decimal(10)]);
		if (player.milestones.nonrec_11)
			factor.push([
				'朊病毒(里程碑11)',
				MUL_EFF,
				player.hydra.dilute.prions.add(1).mul(1e10).log10().log10().root(4),
			]);
		if (player.nonrecu.studies_bought.includes(13))
			factor.push([
				'九头蛇能量',
				MUL_EFF,
				player.hydra.power.max('e326649').log10().div(326649),
			]);
		if (player.upgrades['6214'])
			factor.push([
				'压缩九头蛇能量',
				MUL_EFF,
				player.hydra.compressedPower.max('e326649').log10().div(326649),
			]);
		if (player.nonrecu.studies_bought.includes(16)) {
			factor.push([
				'非递归研究71',
				MUL_EFF,
				player.nonrecu.secInThisReset
					.add(1)
					.mul(10)
					.pow(2)
					.sub(99)
					.root(2)
					.pow(0.75)
					.div(2)
					.add(1),
			]);
		}
		if (player.pt.analysis[1] >= 1)
			factor.push([
				'解析系统',
				MUL_EFF,
				Analysis.systemEffect[1].value(player.pt.analysis[1]),
			]);

		return factor;
	},
	gain(): Decimal {
		const ADD_EFF = 0,
			MUL_EFF = 1,
			POW_EFF = 2,
			DIL_EFF = 3,
			EXP_EFF = 4;
		const factor = this.gainFactor();
		let base = DC.D_0;
		for (const i in factor) {
			const f = factor[i];
			if (f[1] == ADD_EFF) base = base.add(f[2]);
			else if (f[1] == MUL_EFF) base = base.mul(f[2]);
			else if (f[1] == POW_EFF) base = base.pow(f[2]);
			else if (f[1] == DIL_EFF) base = base.log10().pow(f[2]).pow10();
			else if (f[1] == EXP_EFF) base = base.pow_base(f[2]);
		}
		if (base.gte(1e7))
			base = base
				.div(1e7)
				.pow(1 / 3)
				.mul(1e7);
		base = base.pow(NON_RECURSIVE.UNOCFeff()[3]);
		if (!player.upgrades.U6R21 && base.gte(1e500))
			base = base.log10().div(500).pow(0.5).mul(500).pow(10);
		if (player.pt.power.lt(1)) return base.min('ee8.07230472602822538e153');

		return base;
	},
	nonrecEffects(): [Decimal, Decimal] {
		/**
		 * 对hydpow的乘数加成
		 */
		const mult1 = player.nonrecu.resetTimes.pow_base(7.5);
		/**
		 * 对hydpow^(expo1)的加成
		 */
		const expo1 = player.nonrecu.resetTimes.mul(0.05).add(1);
		return [mult1, expo1];
	},
	/**
	 * 注：每秒获取的非递归能量
	 */
	passiveGain() {
		let a = DC.D_0;

		if (player.nonrecu.studies_bought.includes(22)) {
			a = a.add(this.gain().mul(0.01));

			if (player.challenges[1][3].gte(1)) a = a.add(this.gain().mul(0.09));
		}

		return a;
	},
	loop(diff: number) {
		this.addPower(this.passiveGain().mul(diff));
		if (player.milestones.nonrec_17) {
			player.nonrecu.resetTimes = player.nonrecu.resetTimes.add(
				player.challenges[1][4].mul(diff),
			);
		}
		if (player.upgrades['71UN']) {
			player.nonrecu.unocf_j = player.nonrecu.unocf_j.add(this.UNOCFdeduceSpeed().mul(diff));
		}
		if (player.numbertheory.well_ordering.steps_proceeded.includes(3))
			player.challenges[1][4] = player.challenges[1][4].max(
				player.hydra.deduceOrdinal[0].max(10).log10().log10(),
			);
		if (player.numbertheory.well_ordering.steps_proceeded.includes(7)) {
			player.challenges[1][5] = player.challenges[1][5].max(
				player.hydra.dilute.prions.max(10).log10().log10(),
			);
		}
		if (player.numbertheory.well_ordering.steps_proceeded.includes(7)) {
			addTheories(0);
			addTheories(1);
			addTheories(2);
		}
		if (player.upgrades['7ta1q']) {
			addTheories(0);
		}
		if (player.upgrades['7ta2q']) {
			addTheories(1);
		}
		if (player.upgrades['7ta3q']) {
			addTheories(2);
		}
		if (player.pt.totalPower.gte(1e70)) {
			NON_REC_BMS.loop(diff);
		}
	},
	UNOCFdeduceSpeed() {
		let a = new Decimal(1);
		a = a.mul(this.UNOCFeff()[1]);
		if (player.milestones.nonrec_20) {
			a = a.mul(1000);
		}
		if (player.milestones.nonrec_23) {
			a = a.pow(1.75);
		}
		if (player.nonrecu.studies_bought.includes(26)) {
			a = a.mul(this.std112());
		}
		a = a.mul(energyToUNOCFSpeed());
		if (player.retribution >= 1) {
			a = a.mul(3);
		}
		return a;
	},
	UNOCFeff() {
		/**
		 * UNOCF to BMS deduce(^)
		 */
		let a = player.nonrecu.unocf_j.add(1).clampMin(1);
		/**
		 * UNOCF to UNOCF deduce(*)
		 */
		let b = player.nonrecu.unocf_j.div(51.2).log2();
		/**
		 * UNOCF to solution(*)
		 */
		let c = player.nonrecu.unocf_j.div(1024).sqrt();
		/**
		 * UNOCF to nonrec_power(^)
		 */
		let d = player.nonrecu.unocf_j.log2().log(2).log(2).sqrt();
		/**
		 * UNOCF to prion virus
		 */
		let e = player.nonrecu.unocf_j.clampMin(10).log10().div(20).clampMin(1);

		if (player.numbertheory.well_ordering.steps_proceeded.includes(16)) e = e.mul(30000);

		if (player.nonrecu.unocf_j.lt(512)) b = new Decimal(1);
		if (player.nonrecu.unocf_j.lt(4096)) c = new Decimal(1);
		if (player.nonrecu.unocf_j.lt(16384)) d = new Decimal(1);
		if (player.nonrecu.unocf_j.lt('1e1900')) e = new Decimal(1);

		if (player.milestones.nonrec_23) d = d.mul(1.3);
		if (CHALLENGE.inChallenge(1, 6)) {
			[a, b, c, d, e] = [
				new Decimal(1),
				new Decimal(1),
				new Decimal(1),
				new Decimal(1),
				new Decimal(1),
			];
		}
		return [a, b, c, d, e];
	},
	std112() {
		const a = getTotalTheories();

		return a.add(1);
	},
	playerData() {
		return {
			power: DC.D_0,
			totalPower: DC.D_0,
			resetTimes: DC.D_0,
			studies_bought: [] as number[],
			theories: [DC.D_0, DC.D_0, DC.D_0],
			spentTheories: DC.D_0,
			secInThisReset: DC.D_0,
			studies_preset: Array(6)
				.fill(null)
				.map(
					(x, id) =>
						({
							name: String(id + 1),
							preset: [],
						}) as NonRecusionTreePreset,
				) as unknown as FixedLengthArray<NonRecusionTreePreset, 6>,
			unocf_j: new Decimal(0),
		};
	},
};
