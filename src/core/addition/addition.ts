import Decimal from 'break_eternity.js';
import { buyables, upgrades, SOFTCAPS } from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { formatWhole } from '@/utils/format';
import { feature } from '../global.ts';
import { CHALLENGE } from '../challenge.ts';
import { MULTI_CHALS } from '../multiplication/challenges.ts';
import { predictableRandom } from '@/utils/algorithm.ts';
import { Upgrade, UpgradeWithEffect } from '../upgrade.ts';
import { Currencies } from '../currencies.ts';
import { Requirement, UpgradeRequirement } from '../requirements.ts';
import { Buyable } from '../buyable.ts';
import { Logarithm } from '../exponention/logarithm.ts';
import { DC } from '@/core/constants';
import { updateResetStatData } from '../stats.ts';

export class AdditionUpgrade extends Upgrade {
	currency = Currencies.ADDITION_POWER;
}
export class AdditionUpgradeWithEffect extends UpgradeWithEffect {
	currency = Currencies.ADDITION_POWER;
}

export const Addition = {
	upgrades: {
		'21': new (class U11 extends AdditionUpgrade {
			cost = DC.D_1;
			name = 'U1-1';
			currency = Currencies.ADDITION_POWER;
			keep(): boolean {
				return player.upgrades['421q'] && !player.exponention.logarithm.in_dilate;
			}
		})(),
		'22': new (class U12 extends AdditionUpgrade {
			cost: Decimal | (() => Decimal) = function () {
				if (
					player.multiplication.B1seriesC1 == 2 ||
					player.multiplication.B1seriesC1400q == 2
				)
					return DC.D_1;
				return new Decimal(5);
			};
			name = 'U1-2';
			keep(): boolean {
				return player.upgrades['421q'] && !player.exponention.logarithm.in_dilate;
			}
		})(),
		'23': new (class U13 extends AdditionUpgrade {
			cost: Decimal | (() => Decimal) = function () {
				if (
					player.multiplication.B1seriesC1 == 3 ||
					player.multiplication.B1seriesC1400q == 3
				)
					return DC.D_1;
				return new Decimal(25);
			};
			name = 'U1-3';
			keep(): boolean {
				return player.upgrades['421q'] && !player.exponention.logarithm.in_dilate;
			}
		})(),
		'24': new (class U14 extends AdditionUpgrade {
			cost: Decimal | (() => Decimal) = function () {
				return player.multiplication.B1seriesC1 == 4 ||
					player.multiplication.B1seriesC1400q == 4
					? DC.D_1
					: new Decimal(125);
			};
			name = 'U1-4';
			keep(): boolean {
				return player.upgrades['421q'] && !player.exponention.logarithm.in_dilate;
			}
		})(),
		'25': new (class U15 extends AdditionUpgradeWithEffect {
			cost: Decimal | (() => Decimal) = function () {
				return player.multiplication.B1seriesC1 == 5 ||
					player.multiplication.B1seriesC1400q == 5
					? DC.D_1
					: new Decimal(625);
			};
			name = 'U1-5';
			keep(): boolean {
				return player.upgrades['421q'] && !player.exponention.logarithm.in_dilate;
			}
			effect() {
				let exp = new Decimal(0.25);
				let a;
				if (((a = MULTI_CHALS[0].effect?.(player.challenges[0][0]) ?? DC.D_0), a.gt(0)))
					exp = exp.add(a);

				return player.totalAddpower.pow(exp).add(1).floor();
			}
			effectDescription() {
				return '+' + formatWhole(this?.effect?.() ?? 0) + '/c';
			}
		})(),
		'26': new (class U16 extends AdditionUpgrade {
			cost: Decimal | (() => Decimal) = function () {
				return new Decimal(3125);
			};
			name = 'U1-6';
			keep(): boolean {
				return player.upgrades['421q'] && !player.exponention.logarithm.in_dilate;
			}
			show() {
				return player.singularity.stage < 9;
			}
		})(),
	} as const,
	buyables: {
		'21': new (class B11 extends Buyable<Decimal> {
			name: string = 'B1-1';
			currency: Currencies = Currencies.NUMBER;
			cost(x: Decimal) {
				const a = x.mul(1000);
				return a;
			}
			capped(): boolean {
				const capc = 100;
				return player.buyables['21'].gte(capc);
			}
			requirements(): Requirement[] {
				return [new UpgradeRequirement('24')];
			}
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades[39];
			}
			costInverse(x: Decimal): Decimal {
				return x.div(1000).floor().min(100);
			}
			effect(x: Decimal): Decimal {
				return x;
			}
			effectDescription(values: Decimal): string {
				return `+${formatWhole(values)}`;
			}
		})(),
	} as const,
	initMechanics() {},
	addpower_gain(bulk = DC.D_1, recordtoreset = false) {
		let adding = this.gain().mul(bulk);
		if (player.exponention.logarithm.in_dilate) {
			adding = adding.add(Math.E).ln().ln().mul(10);
		}
		if (player.singularity.enabled || player.milestones.dil_7)
			adding = adding.add(1).pow(feature.SingularityGenerator.getSingularityEffect()).sub(1);
		if (player.buyables[31].gt(0) && Logarithm.logarithm.upgrades_in_dilated.includes('31'))
			adding = adding.mul(buyables[31].effect(player.buyables[31]));
		const scList = ['addpower^1', 'addpower^2', 'addpower^3', 'addpower^4', 'addpower^5'];
		if (player.singularity.stage < 2)
			for (let i = 0; i < scList.length; i++) {
				if (SOFTCAPS.reach(scList[i], adding)) {
					adding = SOFTCAPS.staticComputed(scList[i], adding);
				}
			}
		if (CHALLENGE.inChallenge(0, 3)) {
			adding = adding.mul(predictableRandom(Math.floor(Date.now() / 40)) > 0.5 ? -1 : 1);
		}
		if (recordtoreset) {
			updateResetStatData('recent10AddReset', adding);
		}
		player.addpower = player.addpower.add(adding).max(0);
		player.totalAddpower = player.totalAddpower.add(adding.max(0));
		player.stat.totalAddpower = player.stat.totalAddpower.add(adding.max(0));
	},
	reset() {
		if (this.gain().gt(0)) {
			this.addpower_gain(DC.D_1, true);
			if (!player.upgrades[25]) {
				player.upgrades[11] = false;
				player.upgrades[12] = false;
			}
			player.buyables[11] = DC.D_0;
			player.totalNumber = DC.D_0;
			player.number = DC.D_0;

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

		if (player.upgrades.ts11 && player.stat.chapter == 1) base = base.mul(1.5);
		if (player.upgrades.ts12) base = base.mul(1.5);
		if (player.upgrades.ts13 && player.stat.chapter == 1) base = base.mul(2);

		if (player.firstResetBit & 0b100) base = base.pow(buyables[43].effect(player.buyables[43]));
		if (player.upgrades[47]) base = base.pow(feature.ChessBoard.wgEffect()[1]);
		if (player.upgrades[410]) base = base.pow(upgrades[410].effect());
		base = base.pow(Addition.gainExponent());
		return base.floor();
	},
	gainExponent(): Decimal {
		let base = DC.D_1;
		if (player.exponention.logarithm.upgrades_in_dilated.includes('13')) {
			base = base.add(0.1);
		}
		return base;
	},
	U25effect() {
		if (!player.upgrades[25]) return DC.D_0;
		return upgrades[25]?.effect?.() ?? DC.D_0;
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
