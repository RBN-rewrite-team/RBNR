import ModalService from '@/utils/Modal';
import { player } from '../save';
import { Dilute } from '../hydra/dilute';
import Decimal from 'break_eternity.js';
import { isTester } from '@/core/save/testing.ts';
import { MILESTONES } from '../mechanic';
import { Currencies } from '../currencies';

export const NON_RECURSIVE = {
	initMechanics() {
		MILESTONES.create('nonrec_1', {
			requirement: new Decimal(1),
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
			  player.upgrades["65"] = true
			  player.upgrades["615"] = true
			  player.upgrades["65R"] = true
			  player.upgrades["65S"] = true
			}
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
	},
	reset(force = false) {
		if (!isTester()) {
			ModalService.show({
				title: 'WIP!',
				content: 'Work in progress!',
			});
			return;
		}
		if (!this.resetable() && !force) return;
		player.firstResetBit |= 0b10000;
		if (!force) this.addPower(this.gain());
		if (!force) player.nonrecu.resetTimes = player.nonrecu.resetTimes.add(1);
		Dilute.diluteReset();
		player.hydra.trueTotalPower = new Decimal(0);
		player.upgrades['61S'] = false;
		player.upgrades['62S'] = false;
		player.upgrades['63S'] = false;
		player.upgrades['64S'] = false;
		if (!player.milestones.nonrec_5)player.upgrades['65S'] = false;
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
		player.hydra.milestoneDut5Eff = new Decimal(1);
		if(!player.milestones.nonrec_2) player.hydra.pAuto = [!1, !1, !1, !1];
		player.hydra.dilute.solvent = [0, 0, 0, 0, 0, 0, !1, !1, !1];
		player.hydra.dilute.lastSolvent = [0, 0, 0, 0, 0, 0, !1, !1, !1];
		player.hydra.dilute.lastDeduce = new Decimal(0);
		player.hydra.dilute.prions = new Decimal(1);
		player.hydra.dilute.inDilute = false;
		player.hydra.dilute.spentTime = 0;
		player.hydra.dilute.solutionCost = 0;
		player.hydra.dilute.solution = 0;
		player.hydra.dilute.highestApocalypse = new Decimal(0);
		if (player.nonrecu.studies_bought.includes(0)) {
			player.hydra.power = player.hydra.power.add(20);
			player.hydra.totalPower = player.hydra.totalPower.add(20);
			player.hydra.trueTotalPower = player.hydra.trueTotalPower.add(20);
			player.hydra.dilute.solution = player.hydra.dilute.solution + 20;
		}
	},
	resetable() {
		return (
			player.hydra.deduceOrdinal[0].gte('ee153.90699754796802') &&
			player.hydra.totalPower.gte('e326649') &&
			player.hydra.dilute.solution >= 2.55e8
		);
	},
	addResetGain() {},
	addPower(x: Decimal) {
		player.nonrecu.power = player.nonrecu.power.add(x);
		player.nonrecu.totalPower = player.nonrecu.totalPower.add(x);
	},
	gain(): Decimal {
		let base = new Decimal(player.hydra.dilute.solution / 2.55e8);
		// 4^((HS/2.55e8)(B_tmp)-1)

		let B_tmp = player.hydra.deduceOrdinal[0].max(1).log(4).max(1).log(4).div(256);

		base = base.mul(B_tmp).sub(1).pow_base(4);
		if(player.nonrecu.studies_bought.includes(6)) base = base.mul(10);
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
};
