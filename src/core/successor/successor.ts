import { player } from '../save';
import { UPGRADES, BUYABLES, SOFTCAPS, upgrades, buyables, softcaps, type singleReq } from '../mechanic.ts';
import Decimal from 'break_eternity.js';
import { format, formatWhole } from '@/utils/format';
import { feature } from '../global.ts';
import { NUMTHEORY } from '../multiplication/numbertheory.ts';
import {CHALLENGE} from '../challenge.ts';
import {MULTI_CHALS} from '../multiplication/challenges.ts';

export const Successor = {
	initMechanics() {
		UPGRADES.create('11', {
			description: '解锁B0-1',
			currency: '数值',
			cost: new Decimal(10),
			displayName: 'U0-1',
			canAfford() {
				return player.number.gte(this.cost);
			},
			buy() {
				player.number = player.number.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'达到10累计数值',
						function () {
							return player.totalNumber.gte(upgrades['11'].cost);
						},
						[formatWhole(player.totalNumber), formatWhole(upgrades['11'].cost)],
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
			keep() {
				return player.upgrades['31'];
			},
		});
		UPGRADES.create('12', {
			description: '每次购买U0系列升级都使后继按钮批量+1',
			effect() {
				let base = new Decimal(0);
				if (player.upgrades['11']) base = base.add(1);
				if (player.upgrades['12']) base = base.add(1);
				if (player.upgrades['13']) base = base.add(1);
				return base;
			},
			effD() {
				return '+' + formatWhole(this.effect?.());
			},
			cost: new Decimal(100),
			displayName: 'U0-2',
			canAfford() {
				return player.number.gte(this.cost);
			},
			buy() {
				player.number = player.number.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'达到100累计数值',
						function () {
							return player.totalNumber.gte(upgrades['12'].cost);
						},
						[formatWhole(player.totalNumber), formatWhole(upgrades['12'].cost)],
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
			currency: '数值',
			keep() {
				return player.upgrades['31'];
			},
		});
		UPGRADES.create('13', {
			description: '解锁加法层',
			cost: new Decimal(1000),
			displayName: 'U0-3',
			canAfford() {
				return player.number.gte(this.cost);
			},
			buy() {
				player.number = player.number.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'达到1000累计数值',
						function () {
							return player.totalNumber.gte(upgrades['13'].cost);
						},
						[formatWhole(player.totalNumber), formatWhole(upgrades['13'].cost)],
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
			currency: '数值',
			keep() {
				return player.upgrades['31'];
			},
		});
		BUYABLES.create('11', {
			description: '每秒进行一次后继运算',
			displayName: 'B0-1',
			effect(x) {
				return x.add(this.more?.() ?? 0);
			},
			effD(x) {
				return formatWhole(this.effect(x)) + '/s';
			},
			cost(x) {
				let a = x.mul(10).add(10);
				if (player.upgrades[23]) a = a.sub(10);
				return a;
			},
			canAfford(x) {
				return player.number.gte(this.cost(x));
			},
			buy(x) {
				player.number = player.number.sub(this.cost(x));
			},
			capped() {
				let capc = 50;
				if (player.upgrades[23]) capc += 50;
				return player.buyables['11'].add(this.more?.() ?? 0).gte(capc);
			},
			get requirement() {
				return [
					[
						'购买U11',
						function () {
							return player.upgrades['11'];
						},
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
			more() {
				let a = new Decimal(0);
				a = a.add(player.buyable11More);
				return a;
			},
			currency: '数值',
		});
		SOFTCAPS.create('number^1', {
			name: 'number^1',
			fluid: true,
			start: new Decimal(2).pow(256),
			exponent: new Decimal(0.75),
		});
		SOFTCAPS.create('number^2', {
			name: 'number^2',
			fluid: true,
			start: new Decimal(2).pow(1024),
			exponent: new Decimal(0.75),
		});
	},

	success(bulk = 1) {
		let adding = this.successorBulk().mul(bulk);
		adding = SOFTCAPS.fluidComputed('number^1', adding, player.number);
		adding = SOFTCAPS.fluidComputed('number^2', adding, player.number);
		player.number = player.number.add(adding);
		player.totalNumber = player.totalNumber.add(adding);
		player.stat.totalNumber = player.stat.totalNumber.add(adding);
	},
	autoSuccessPerSecond() {
		let base = new Decimal(0);
		base = base.add(buyables['11'].effect(player.buyables['11']));
		return base;
	},
	successorBulk() {
		let base = new Decimal(1);
		if (player.upgrades['12']) base = base.add(upgrades['12'].effect?.() ?? 0);
		if (player.upgrades[21]) {
			let count = 0;
			for (const i of [21, 22, 23, 24, 25, 26]) {
				if (player.upgrades[i.toString() as '21' | '22' | '23' | '24' | '25' | '26'])
					count++;
			}
			base = base.add(count);
		}
		if (player.upgrades[32]) {
			let count = 0;
			for (const i of [31, 32, 33, 34, 35]) {
				if (player.upgrades[i.toString() as '31' | '32' | '33' | '34' | '35']) count++;
			}
			base = base.add(count ** 2);
		}
		if (player.upgrades[22]) base = base.mul(4);
		if (player.upgrades[25]) base = base.mul(feature.ADDITION.U25effect());
		if (player.firstResetBit & 0b10) base = base.mul(feature.MULTIPLICATION.powerEff());
		if (player.firstResetBit & 0b10) base = base.mul(feature.PrimeFactor.powerEff());
		if (player.firstResetBit & 0b10) base = base.mul(NUMTHEORY.funcS().max(1));

    if (CHALLENGE.inChallenge(0, 2)) {
      base = base.div(player.number.max(1))
    }
    if (CHALLENGE.amountChallenge(0, 1).gt(0)) {
      base = base.mul(MULTI_CHALS[1].effect?.(player.challenges[0][1]) ?? 1)
    }
		return base;
	},
};
