import { player } from '../save';
import {
	UPGRADES,
	BUYABLES,
	SOFTCAPS,
	upgrades,
	buyables,
	softcaps,
	type singleReq,
} from '../mechanic.ts';
import Decimal from 'break_eternity.js';
import { format, formatWhole } from '@/utils/format';
import { feature } from '../global.ts';
import { NUMTHEORY } from '../multiplication/numbertheory.ts';
import { CHALLENGE } from '../challenge.ts';
import { MULTI_CHALS } from '../multiplication/challenges.ts';
import { predictableRandom } from '@/utils/algorithm.ts';
import { Upgrade, UpgradeWithEffect } from '../upgrade.ts';
import { Currencies } from '../currencies.ts';
import { CurrencyRequirement, Requirement, UpgradeRequirement } from '../requirements.ts';
import { Buyable } from '../buyable.ts';

export const Successor = {
	upgrades: {
		'11': new class U01 extends Upgrade {
			currency = Currencies.NUMBER;
			name = "U0-1";
			cost = new Decimal(10);
			description = "解锁B0-1";
			requirements(): Requirement[] {
				return [
					new CurrencyRequirement(Currencies.NUMBER, new Decimal(10))
				]
			}
			keep() {
				return player.upgrades['32']
			}
		},
		'12': new class U02 extends UpgradeWithEffect<Decimal> {
			currency = Currencies.NUMBER;
			name = "U0-2";
			cost = new Decimal(100);
			description = "每次购买U0系列升级都使后继按钮批量+1";
			requirements(): Requirement[] {
				return [
					new CurrencyRequirement(Currencies.NUMBER, new Decimal(100))
				]
			}
			effect(): Decimal {
				let base = new Decimal(0);
				if (player.upgrades['11']) base = base.add(1);
				if (player.upgrades['12']) base = base.add(1);
				if (player.upgrades['13']) base = base.add(1);
				return base;
			}
			effectDescription(values: Decimal): string {
				return `+${formatWhole(values)}`
			}
			keep() {
				return player.upgrades['32']
			}
		},
		'13': new class U03 extends Upgrade {
			currency = Currencies.NUMBER;
			name = "U0-3";
			cost = new Decimal(1000);
			description = "解锁加法层";
			requirements(): Requirement[] {
				return [
					new CurrencyRequirement(Currencies.NUMBER, new Decimal(1000))
				]
			}
			keep() {
				return player.upgrades['32']
			}
		},
	} as const,
	buyables: {
		'11': new class B01 extends Buyable<Decimal> {
			currency: Currencies = Currencies.NUMBER;

			description: string = "每秒进行一次后继运算";
			name: string = "B0-1";
			cost(x: Decimal) {
				let a = x.mul(10).add(10);
				if (player.upgrades[23]) a = a.sub(10);
				return a;
			};
			costInverse(x: Decimal) {
				let a = x;
				if (player.upgrades[23]) a = a.add(10);
				a = a.sub(10).div(10);
				return a.min(100);
			};
			requirements(): Requirement[] {
				return [
					new UpgradeRequirement('11')
				];
			};
			effect(x: Decimal): Decimal {
				return x.add(this.more());
			}
			effectDescription(values: Decimal): string {
				return `${formatWhole(values)}/s`;
			}
			more() {
				let a = new Decimal(0);
				a = a.add(player.buyable11More);
				return a;
			}
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean{
				return player.upgrades[39];
			}
			capped(x: Decimal) {
				let capc = 50;
				if (player.upgrades[23]) capc += 50;
				return x.add(this.more()).gte(capc);
			}
		}
	} as const,
	initMechanics() {
		SOFTCAPS.create('number^1', {
			name: 'number^1',
			fluid: true,
			start: new Decimal(2).pow(256),
			exponent: new Decimal(0.75),
		});
		SOFTCAPS.create('number^2', {
			name: 'number^2',
			fluid: true,
			get start() {
				let base = new Decimal(2).pow(1024);

				if (player.upgrades[43]) base = base.pow(2);
				return base;
			},
			exponent: new Decimal(0.75),
		});
		SOFTCAPS.create('number_C1', {
			name: 'number_C1',
			fluid: true,
			start: new Decimal(1),
			exponent: new Decimal(0.5),
		});
		SOFTCAPS.create('number^3', {
			name: 'number^3',
			fluid: true,
			start: new Decimal('e20000'),
			exponent: new Decimal(0.5),
		});
		SOFTCAPS.create('number^4', {
			name: 'number^4',
			fluid: true,
			start: new Decimal('ee5'),
			exponent: new Decimal(0.5),
			meta: 1
		});
		SOFTCAPS.create('number^5', {
			name: 'number^5',
			fluid: true,
			start: new Decimal('ee20'),
			exponent: new Decimal(0.5),
			meta: 1
		});
		SOFTCAPS.create('number^6', {
			name: 'number^6',
			fluid: true,
			start: new Decimal('ee100'),
			exponent: new Decimal(0.75),
			meta: 2
		});
		SOFTCAPS.create('number^7', {
			name: 'number^7',
			fluid: true,
			start: new Decimal('eee5'),
			exponent: new Decimal(0.25),
			meta: 2
		});
		SOFTCAPS.create('number^8', {
			name: 'number^8',
			fluid: true,
			start: new Decimal('eee15'),
			exponent: new Decimal(0.75),
			meta: 3
		});
	},
	/**
	 * @param bulk 点击多少次后继按钮，默认为1就是用户手动点击
	 */
	success(bulk = 1) {
		let adding = this.successorBulk().pow(this.successorPow()).mul(bulk);
		if (player.exponention.logarithm.in_dilate) {
			adding = adding.add(10).ln().ln().div(10)
		}
		for(let i = 1; i <= 8; i++)
		    adding = SOFTCAPS.fluidComputed('number^' + i, adding, player.number);
		if (CHALLENGE.inChallenge(0, 2))
			adding = SOFTCAPS.fluidComputed('number_C1', adding, player.number);
		if (CHALLENGE.inChallenge(0, 3)) {
			adding = adding.mul(predictableRandom(Math.floor(Date.now() / 40)) > 0.5 ? -1 : 1);
		}
		player.number = player.number.add(adding).max(0);
		player.totalNumber = player.totalNumber.add(adding.max(0));
		player.stat.totalNumber = player.stat.totalNumber.add(adding.max(0));
	},
	/**
	 * @returns 每秒点击多少次后继按钮
	 */
	autoSuccessPerSecond() {
		let base = new Decimal(0);
		base = base.add(buyables['11'].effect(player.buyables['11']));
		return base;
	},
	/**
	 * successorBulk函数，
	 * 获取每点击一次获得多少
	 */
	successorBulk() {
		let base = new Decimal(1);
		if (player.upgrades['12']) base = base.add(upgrades['12'].effect());
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
			for (const i of [31, 32, 33, 34, 35] as const) {
				if (player.upgrades[i.toString() as '31' | '32' | '33' | '34' | '35']) count++;
			}
			base = base.add(count ** 2);
		}
		if (player.upgrades[22]) base = base.mul(4);
		if (player.upgrades[25]) base = base.mul(feature.ADDITION.U25effect());
		if (player.firstResetBit & 0b10) base = base.mul(feature.MULTIPLICATION.powerEff());
		if (player.firstResetBit & 0b10) base = base.mul(feature.PrimeFactor.powerEff());
		if (player.firstResetBit & 0b10) base = base.mul(NUMTHEORY.funcS().max(1));

		if (CHALLENGE.amountChallenge(0, 1).gt(0)) {
			base = base.mul(MULTI_CHALS[1].effect?.(player.challenges[0][1]) ?? 1);
		}

		if (CHALLENGE.amountChallenge(0, 2).gt(0) && !CHALLENGE.inChallenge(0, 3)) {
			base = base.mul(MULTI_CHALS[2].effect?.(player.challenges[0][2]) ?? 1);
		}

		if (player.firstResetBit & 0b100) base = base.pow(feature.EXPONENTION.powerEff());
		if (player.firstResetBit & 0b100) base = base.pow(1.03);
		if (player.firstResetBit & 0b100) base = base.pow(buyables[42].effect(player.buyables[42]));
		if (player.upgrades[47]) base = base.pow(feature.ChessBoard.wgEffect()[0]);
		return base;
	},
	/**
	 * 
	 * @returns 对数值获取取多少次方
	 */
	successorPow() {
		let base = new Decimal(1);
		if (player.upgrades[42]) base = base.add(0.1);
		return base;
	},
};
