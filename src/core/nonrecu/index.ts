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
			currency: '',
			displayName: '1次非递归重置',
			description: `1.每次非递归重置使得九头蛇能量额外乘数×7.5、获取指数+0.01<br>2.转生/飞升/超越/轮回的自动化在解锁了相应重置就立刻解锁`,
			show: true,
			get canDone() {
				return player.nonrecu.resetTimes.gte(1);
			},
		});
	},
	reset() {
		if (!isTester()) {
			ModalService.show({
				title: 'WIP!',
				content: 'Work in progress!',
			});
			return;
		}
		if (!this.resetable()) return;
		player.firstResetBit |= 0b10000
		this.addPower(this.gain());
		player.nonrecu.resetTimes = player.nonrecu.resetTimes.add(1);
		Dilute.diluteReset();
		player.hydra.trueTotalPower = new Decimal(0);
		player.upgrades['61S'] = false;
		player.upgrades['62S'] = false;
		player.upgrades['63S'] = false;
		player.upgrades['64S'] = false;
		player.upgrades['65S'] = false;
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
		player.hydra.pAuto = [!1, !1, !1, !1];
		player.hydra.dilute.solvent = [0, 0, 0, 0, 0, 0, !1, !1, !1];
		player.hydra.dilute.lastSolvent = [0, 0, 0, 0, 0, 0, !1, !1, !1];
		player.hydra.dilute.lastDeduce = new Decimal(0);
		player.hydra.dilute.prions = new Decimal(0);
		player.hydra.dilute.inDilute = false;
		player.hydra.dilute.spentTime = 0;
		player.hydra.dilute.solutionCost = 0;
		player.hydra.dilute.solution = 0;
		player.hydra.dilute.highestApocalypse = new Decimal(0);
		if (player.nonrecu.studies_bought.includes(0)) {
			player.hydra.power = player.hydra.power.add(20);
			player.hydra.totalPower = player.hydra.totalPower.add(20);
			player.hydra.trueTotalPower = player.hydra.trueTotalPower.add(20);
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
