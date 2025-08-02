import Decimal from 'break_eternity.js';
import {
	buyables,
	BUYABLES,
	upgrades,
	UPGRADES,
	softcaps,
	SOFTCAPS,
	type singleReq,
} from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { formatWhole } from '@/utils/format';
import { feature } from '../global.ts';
import { CHALLENGE } from '../challenge.ts';
import { C11cap, MULTI_CHALS } from '../multiplication/challenges.ts';
import { predictableRandom } from '@/utils/algorithm.ts';
import { Upgrade, UpgradeWithEffect } from '../upgrade.ts';
import { Currencies } from '../currencies.ts';
import { CurrencyRequirement, Requirement, UpgradeRequirement } from '../requirements.ts';
import { Buyable } from '../buyable.ts';
import { Logarithm } from '../exponention/logarithm.ts';

export class AdditionUpgrade extends Upgrade {
	currency = Currencies.ADDITION_POWER
}
export class AdditionUpgradeWithEffect extends UpgradeWithEffect {
	currency = Currencies.ADDITION_POWER
}

export const Addition = {
	upgrades: {
		'21': new class U11 extends AdditionUpgrade {
			description:()=>string= Logarithm.dilated('U1系列升级购买数量同样作用于U0-2的效果', "使U0-2效果^1.5", '21')
			cost= new Decimal(1)
			name= "U1-1"
			currency = Currencies.ADDITION_POWER
			keep(): boolean {
				return player.upgrades['421q']&&!player.exponention.logarithm.in_dilate;
			}
			requirements() {
				return [
					new CurrencyRequirement(Currencies.ADDITION_POWER, new Decimal(1))
				]
			}
		},
		'22': new class U12 extends AdditionUpgrade {
			description:()=>string= Logarithm.dilated('后继批量提高到4倍', "后继指数＋0.2", "22");
			
			cost: Decimal|(()=>Decimal) = function() {
				if (
					player.multiplication.B1seriesC1 == 2 ||
					player.multiplication.B1seriesC1400q == 2
				)
					return new Decimal(1);
				return new Decimal(5);
			}
			name= "U1-2"
			keep(): boolean {
				return player.upgrades['421q']&&!player.exponention.logarithm.in_dilate;
			}
			requirements() {
				return [
					new CurrencyRequirement(Currencies.ADDITION_POWER, new Decimal(5))
				]
			}
		},
		'23': new class U13 extends AdditionUpgrade {
			description= '移除B0-1价格的常数项，B0-1最多购买次数+50'
			
			cost: Decimal|(()=>Decimal) = function() {
				if (
					player.multiplication.B1seriesC1 == 3 ||
					player.multiplication.B1seriesC1400q == 3
				)
					return new Decimal(1);
				return new Decimal(25);
			}
			name= "U1-3"
			keep() :boolean {
				return player.upgrades['421q']&&!player.exponention.logarithm.in_dilate;
			}
			requirements() {
				return [
					new CurrencyRequirement(Currencies.ADDITION_POWER, new Decimal(25))
				]
			}
		},
		'24': new class U14 extends AdditionUpgrade {
			description:()=>string= Logarithm.dilated('解锁B1-1', "使B1-1加成b0-1  效果^(1+log（b1-1）/3）", '24')
			cost:Decimal|(()=>Decimal) = function() {
				if (
					player.multiplication.B1seriesC1 == 4 ||
					player.multiplication.B1seriesC1400q == 4
				)
					return new Decimal(1);
				return new Decimal(125);
			}
			name= "U1-4"
			keep(): boolean {
				return player.upgrades['421q']&&!player.exponention.logarithm.in_dilate;
			}
			requirements() {
				return [
					new CurrencyRequirement(Currencies.ADDITION_POWER, new Decimal(125))
				]
			}
		},
		'25': new class U15 extends AdditionUpgradeWithEffect {
			description:()=>string= Logarithm.dilated('后继运算升级为加法运算， 在每次加法重置后保留U0系列升级', "挑战1效果不再有上限，但在1以上有软上限", '25')
		
			cost: Decimal|(()=>Decimal) = function() {
				if (
					player.multiplication.B1seriesC1 == 5 ||
					player.multiplication.B1seriesC1400q == 5
				)
					return new Decimal(1);
				return new Decimal(625);
			}
			name= "U1-5"
			keep(): boolean {
				return player.upgrades['421q']&&!player.exponention.logarithm.in_dilate;
			}
			requirements() {
				return [
					new CurrencyRequirement(Currencies.ADDITION_POWER, new Decimal(625))
				]
			}
			effect() {
				let exp = new Decimal(0.25);
				let a;
				if (
					((a = MULTI_CHALS[0].effect?.(player.challenges[0][0]) ?? new Decimal(0)),
					a.gt(0))
				)
					exp = exp.add(a);

				return player.totalAddpower.pow(exp).add(1).floor();
			}
			effectDescription() {
				return '+' + formatWhole(this?.effect?.() ?? 0) + '/c';
			}
		},
		'26': new class U16 extends AdditionUpgrade {
			description= '解锁乘法层'
			cost: Decimal|(()=>Decimal) = function() {
				return new Decimal(3125);
			}
			name= "U1-6"
			keep():boolean {
				return player.upgrades['421q']&&!player.exponention.logarithm.in_dilate;
			}
			requirements() {
				return [
					new CurrencyRequirement(Currencies.ADDITION_POWER, new Decimal(625))
				]
			}
		},
	} as const ,
	buyables: {
		'21': new class B11 extends Buyable<Decimal> {
			description: string="每次加法重置后获得免费的购买项11（算在上限之内）";
			name: string="B1-1";
			currency: Currencies=Currencies.NUMBER;
			cost(x: Decimal) {
				let a = x.mul(1000);
				return a;
			}
			capped(): boolean {
				let capc = 100;
				return player.buyables['21'].gte(capc);
			}
			requirements(): Requirement[]{
				return [
					new UpgradeRequirement('24')
				]
			}
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades[39];
			}
			costInverse(x: Decimal): Decimal {
				return x
					.sub(10)
					.div(1000)
					.floor()
					.min(100)
					.sub(player.buyables[21])
					.max(0).min(100);
			}
			effect(x: Decimal): Decimal {
				return x
			}
			effectDescription(values: Decimal): string {
				return `+${formatWhole(values)}`
			}
		}
	} as const,
	initMechanics() {
		SOFTCAPS.create('addpower^1', {
			name: 'addpower^1',
			fluid: true,
			start: new Decimal(2).pow(384),
			exponent: new Decimal(0.75),
		});
		SOFTCAPS.create('addpower^2', {
			name: 'addpower^2',
			fluid: true,
			get start() {
				let base = new Decimal(2).pow(4096);

				if (player.upgrades[43]) base = base.pow(2);
				return base;
			},
			exponent: new Decimal(0.75),
		});
		SOFTCAPS.create('addpower^3', {
			name: 'addpower^3',
			fluid: true,
			start: new Decimal('e40000'),
			exponent: new Decimal(0.5),
		});
		SOFTCAPS.create('addpower^4', {
			name: 'addpower^4',
			fluid: true,
			start: new Decimal('ee5'),
			get exponent() {
			    let base = new Decimal(4);
			    if(player.milestones.cb6) base = base.pow(0.5);
			    return base.pow(-1);
			},
			meta: 1
		});
		SOFTCAPS.create('addpower^5', {
			name: 'addpower^5',
			fluid: true,
			start: new Decimal('ee14'),
			exponent: new Decimal(0.25),
			meta: 1
		});
	},
	addpower_gain(bulk = new Decimal(1)) {
		let adding = this.gain().mul(bulk);
		if (player.exponention.logarithm.in_dilate) {
			adding = adding.add(Math.E).ln().ln().mul(10)
		}
		if (player.buyables[31].gt(0) && Logarithm.logarithm.upgrades_in_dilated.includes("31")) adding = adding.mul(buyables[31].effect(player.buyables[31]));
		adding = SOFTCAPS.fluidComputed('addpower^1', adding, player.addpower);
		adding = SOFTCAPS.fluidComputed('addpower^2', adding, player.addpower);
		adding = SOFTCAPS.fluidComputed('addpower^3', adding, player.addpower);
		adding = SOFTCAPS.fluidComputed('addpower^4', adding, player.addpower);
		adding = SOFTCAPS.fluidComputed('addpower^5', adding, player.addpower);
		if (CHALLENGE.inChallenge(0, 3)) {
			adding = adding.mul(predictableRandom(Math.floor(Date.now() / 40)) > 0.5 ? -1 : 1);
		}
		player.addpower = player.addpower.add(adding).max(0);
		player.totalAddpower = player.totalAddpower.add(adding.max(0));
		player.stat.totalAddpower = player.stat.totalAddpower.add(adding.max(0));
	},
	reset() {
		if (this.gain().gt(0)) {
			this.addpower_gain();
			if (!player.upgrades[25]) {
				player.upgrades[11] = false;
				player.upgrades[12] = false;
			}
			player.buyables[11] = new Decimal(0);
			player.totalNumber = new Decimal(0);
			player.number = new Decimal(0);

			player.buyable11More = player.buyables[21];
		}
	},
	UIreset() {
		const gain = this.gain;
		if (player.firstResetBit & 0b1) return void Addition.reset();
		ModalService.show({
			title: '加法重置',
			content:
				'你真的要重置吗？这将重置你之前的数字、大部分升级和购买项。<br>你将获得 ' +
				formatWhole(gain()) +
				' 加法能量。',
			onConfirm() {
				Addition.reset();
				player.firstResetBit |= 0b1;
			},
		});
	},
	gain() {
		let base = player.totalNumber.div(1000).max(0);
		if (player.firstResetBit & 0b10) base = base.mul(feature.PrimeFactor.powerEff());
		if (player.buyables[31].gt(0)) base = base.mul(buyables[31].effect(player.buyables[31]));

		if (player.upgrades[41]) base = base.mul(10);
		if (player.upgrades[47]) base = base.mul(feature.ChessBoard.wgEffect()[3]);

		if (player.firstResetBit & 0b100) base = base.pow(buyables[43].effect(player.buyables[43]));
		if (player.upgrades[47]) base = base.pow(feature.ChessBoard.wgEffect()[1]);
		base = base.pow(Addition.gainExponent());
		return base.floor();
	},
	gainExponent(): Decimal {
		let base = new Decimal(1);
		if (player.exponention.logarithm.upgrades_in_dilated.includes("13")) {
			base = base.add(0.1);
		}
		return base
	},
	U25effect() {
		if (!player.upgrades[25]) return new Decimal(0);
		return upgrades[25]?.effect?.() ?? new Decimal(0);
	},
	setUPGc1(x: 2 | 3 | 4 | 5) {
		if (player.multiplication.B1seriesC1 !== x) {
			player.multiplication.B1seriesC1 = x;
			feature.MULTIPLICATION.reset();
		}
	},
	setUPGc2(x: 2 | 3 | 4 | 5) {
		if (player.multiplication.B1seriesC1400q !== x) {
			player.multiplication.B1seriesC1400q = x;
			feature.MULTIPLICATION.reset();
		}
	},
};
