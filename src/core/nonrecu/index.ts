import ModalService from '@/utils/Modal';
import { player } from '../save';
import { Dilute } from '../hydra/dilute';
import Decimal from 'break_eternity.js';
import { isTester } from '@/core/save/testing.ts';
import { MILESTONES } from '../mechanic';
import { Currencies } from '../currencies';
import { CHALLENGE } from '../challenge';
import { DC } from '@/core/constants';
import { Upgrade } from '../upgrade';
import { getTotalTheories } from './total-theories';
import { addTheories } from './studies.ts';
import { energyToUNOCFSpeed } from '../ordinal/well_ordering';
import type { FixedLengthArray } from 'type-fest';
import { updateResetStatData } from '../stats.ts';

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
	} as const,
	initMechanics() {
		MILESTONES.create('nonrec_1', {
			requirement: DC.D_1,
			currency: '非递归重置次数',
			displayName: 'M6-1',
			description: `1.每次非递归重置使得九头蛇能量额外乘数×7.5、获取指数+0.01<br>2.转生/飞升/超越/轮回的自动化在解锁了相应重置就立刻解锁<br>3. BMS推演速度×3`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(1);
			},
		});
		MILESTONES.create('nonrec_2', {
			requirement: new Decimal(2),
			currency: '非递归重置次数',
			displayName: 'M6-2',
			description: `转生/飞升/超越/轮回的重置阈值为+0、×1，且不重置任何东西，保持U5-2，U5-2的效果硬下限为100%`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(2);
			},
		});
		MILESTONES.create('nonrec_3', {
			requirement: new Decimal(3),
			currency: '非递归重置次数',
			displayName: 'M6-3',
			description: `1. 基于非递归重置次数加成转生基本效果和超越效果底数<br>2. 移除九头蛇能量的一重软上限，每次非递归重置使九头蛇能量的二重软上限效果÷+0.01<br>3.全局速度倍率对溶剂III的倒计时、购买U-S-9之前的朊病毒不生效，溶剂4仅禁用数论研究`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_4', {
			requirement: new Decimal(4),
			currency: '非递归重置次数',
			displayName: 'M6-4',
			description: `1.每次非递归重置让溶剂3的容许秒数额外+1<br>2. 溶剂总等级的削弱效果变得更弱<br>3. BMS基础推演速度为1/s<br>4. U5-2的效果硬下限为200%`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_5', {
			requirement: new Decimal(5),
			currency: '非递归重置次数',
			displayName: 'M6-5',
			description: `保持解锁U5-5, U5-1-5, U5-R1-5, U5-S-5`,
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
			requirement: new Decimal(6),
			currency: '非递归重置次数',
			displayName: 'M6-6',
			description: `提高U5-1-2(100%→1000%)，U5-1-5，U5-R1-2(^1.125→^1.25)，U5-2，U5-S-9(×2/s→×10/s)的效果`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_7', {
			requirement: new Decimal(7),
			currency: '非递归重置次数',
			displayName: 'M6-7',
			description: `你初始便免疫朊病毒，任何时候都可以增强M-Dilute-5的效果，且前5个稀释里程碑永久解锁`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_8', {
			requirement: new Decimal(8),
			currency: '非递归重置次数',
			displayName: 'M6-8',
			description: `一开始就保持U5-1-1~4，保持数论研究4的升级，自动化数论研究4的购买项`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_9', {
			requirement: new Decimal(9),
			currency: '非递归重置次数',
			displayName: 'M6-9',
			description: `一开始就解锁所有的九头蛇引擎升级、九头蛇引擎购买项和稀释升级，保持M-Dilute-15`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_10', {
			requirement: new Decimal(10),
			currency: '非递归重置次数',
			displayName: 'M6-10',
			description: `自动购买所有的九头蛇引擎升级、九头蛇引擎购买项，保持M-Dilute-10，自动购买所有的稀释升级`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_11', {
			requirement: new Decimal(15),
			currency: '非递归重置次数',
			displayName: 'M6-11',
			description: `添加朊病毒因素`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_12', {
			requirement: new Decimal(20),
			currency: '非递归重置次数',
			displayName: 'M6-12',
			description: `非递归重置后保留1%的溶液`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_13', {
			requirement: new Decimal(50),
			currency: '非递归重置次数',
			displayName: 'M6-13',
			description: `普通的非递归重置初始有1e150,000,000朊病毒`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_14', {
			requirement: new Decimal(100),
			currency: '非递归重置次数',
			displayName: 'M6-14',
			description: `非递归重置不再重置九头蛇溶液数量`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_15', {
			requirement: new Decimal(200),
			currency: '非递归重置次数',
			displayName: 'M6-15',
			description: `非递归重置不再重置U5-S-15效果`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_16', {
			requirement: new Decimal(1e50),
			currency: '非递归能量',
			displayName: 'M6-16',
			description: `移除B5-1-2的硬上限和飞升效果的三、四重软上限，飞升效果倍增朊病毒获取速度(在非递归挑战中无效)`,
			show: true,
			get canDone() {
				return player.nonrecu.power.gte(this.requirement);
			},
		});
		MILESTONES.create('nonrec_17', {
			requirement: new Decimal(29.2),
			currency: 'NRC5次数',
			displayName: 'M6-17',
			description: `每秒自动产生(NRC5次数)非递归次数`,
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
			description: `解锁非递归升级`,
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
			description: `解锁UNOCF`,
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
			description: `UNOCF推演速度*1,000`,
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.challenges[1][4].gte(70);
			},
		});
		MILESTONES.create('nonrec_21', {
			requirement: DC.D_2P24,
			currency: 'UNOCF推演次数',
			displayName: 'M6-21',
			description: `九头蛇能量双指数*1.2`,
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.nonrecu.unocf_j.gte(DC.D_2P24);
			},
		});
		MILESTONES.create('nonrec_22', {
			requirement: new Decimal(6e7),
			currency: 'UNOCF推演次数和2.25NRC6挑战次数',
			displayName: 'M6-22',
			description: `朊病毒增速双指数*1.3,只在NRC6和挑战外生效(后续的里程碑都需要2.25NRC6挑战次数)`,
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.nonrecu.unocf_j.gte(6e7) && player.challenges[1][5].gte(2.25);
			},
		});
		MILESTONES.create('nonrec_23', {
			requirement: new Decimal(7.5e7),
			currency: 'UNOCF推演次数',
			displayName: 'M6-23',
			description: `加强UNOCF第四效果，UNOCF推演速度^1.75`,
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.nonrecu.unocf_j.gte(7.5e7) && player.challenges[1][5].gte(2.25);
			},
		});
		MILESTONES.create('nonrec_24', {
			requirement: new Decimal(1e11),
			currency: 'UNOCF推演次数',
			displayName: 'M6-24',
			description: `推演速度双指数^2`,
			get show() {
				return player.challenges[1][4].gte(1);
			},
			get canDone() {
				return player.nonrecu.unocf_j.gte(1e11) && player.challenges[1][5].gte(2.25);
			},
		});
		MILESTONES.create('nonrec_25', {
			requirement: new Decimal(29),
			currency: 'NRC6挑战次数 & M6-24',
			displayName: 'M6-25',
			description: `九头蛇溶液获取^20`,
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
			description: `解锁<b>数论研究5 - 良序性</b>`,
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
		updateResetStatData('recent10NonRecReset', this.gain())
		if (!force) this.addPower(this.gain());
		if (!force) player.nonrecu.resetTimes = player.nonrecu.resetTimes.add(1);
		Dilute.diluteReset();
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
		if (!player.milestones.nonrec_2) player.hydra.pAuto = [!1, !1, !1, !1];
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
	},
	gainFactor(): [string, number, Decimal][] {
		const ADD_EFF = 0,
			MUL_EFF = 1,
			POW_EFF = 2,
			DIL_EFF = 3,
			EXP_EFF = 4;
		let factor: [string, number, Decimal][] = [];
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
		let nonrecbase = new Decimal(4);
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
		return factor;
	},
	gain(): Decimal {
		const ADD_EFF = 0,
			MUL_EFF = 1,
			POW_EFF = 2,
			DIL_EFF = 3,
			EXP_EFF = 4;
		let factor = this.gainFactor();
		let base = DC.D_0;
		for (let i in factor) {
			let f = factor[i];
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
		if (base.gte(1e500)) base = base.log10().div(500).pow(0.5).mul(500).pow(10);
		return base;
	},
	nonrecEffects(): [Decimal, Decimal] {
		/**
		 * 对hydpow的乘数加成
		 */
		let mult1 = player.nonrecu.resetTimes.pow_base(7.5);
		/**
		 * 对hydpow^(expo1)的加成
		 */
		let expo1 = player.nonrecu.resetTimes.mul(0.05).add(1);
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
			addTheories(0);
			addTheories(1);
			addTheories(2);
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
		if (player.nonrecu.unocf_j.lt(512)) b = new Decimal(1);
		if (player.nonrecu.unocf_j.lt(4096)) c = new Decimal(1);
		if (player.nonrecu.unocf_j.lt(16384)) d = new Decimal(1);

		if (player.milestones.nonrec_23) d = d.mul(1.3);

		if (CHALLENGE.inChallenge(1, 6)) {
			[a, b, c, d] = [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)];
		}
		return [a, b, c, d];
	},
	std112() {
		let a = getTotalTheories();

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
