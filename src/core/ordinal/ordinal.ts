import Decimal from 'break_eternity.js';
import { buyables, BUYABLES, upgrades, UPGRADES, type singleReq } from '../mechanic';
import { feature, player } from '../global.ts';
import { OrdinalUtils } from '@/utils/ordinal';
import { Ordinal } from '@/lib/ordinal/';
import { Currencies } from '../currencies';
import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { CurrencyRequirement, type Requirement } from '../requirements';
import { Buyable } from '../buyable';
import { formatWhole } from '@/utils/format';
import { ORDINAL_BOOSTER } from './ordinal-booster.ts';
import { ordinalSpeedDerivative } from '../game-loop.ts';
import { wordShift } from '../word-shift.ts';

export const ORDINAL = {
	upgrades: {
		'51': new (class U51 extends UpgradeWithEffect<Decimal> {
			description = '每秒增加1序数';
			cost = new Decimal(0);
			ordinal = true;
			name = 'U4-1';
			effect(): Decimal {
				return new Decimal(1);
			}
			effectDescription(): string {
				return '+' + OrdinalUtils.numberToOrdinal(this.effect(), feature.Ordinal.base()) + '/s';
			}
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'52': new (class U52 extends Upgrade {
			description = '底数减少1';
			cost: () => Decimal = function () {
				return new Ordinal('w').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-2';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'53': new (class U53 extends Upgrade {
			description = '底数减少1';
			cost: () => Decimal = function () {
				return new Ordinal('w^2*7').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-3';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'54': new (class U54 extends Upgrade {
			description = '底数减少1';
			cost: () => Decimal = function () {
				return new Ordinal('w^7').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-4';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'55': new (class U55 extends UpgradeWithEffect<Decimal> {
			description = '序数指数倍增序数提升速度';
			cost: () => Decimal = function () {
				return new Ordinal('w^2').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-5';
			effect(): Decimal {
				return OrdinalUtils.ordinalChangeBase(
					player.ordinal.number.max(1).log(feature.Ordinal.base()).floor(),
					feature.Ordinal.base(),
					new Decimal(10),
				).add(1);
			}
			effectDescription(): string {
				return '×' + OrdinalUtils.numberToOrdinal(this.effect(), feature.Ordinal.base());
			}
			currency: Currencies = Currencies.ORDINAL;
			show(): boolean {
				return !player.upgrades[61];
			}
		})(),
		'56': new (class U56 extends UpgradeWithEffect<Decimal> {
			description = '序数指数以减弱的效果倍增序数提升速度';
			cost: () => Decimal = function () {
				return new Ordinal('w^2*4').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-6';
			effect(): Decimal {
				return OrdinalUtils.ordinalChangeBase(
					player.ordinal.number.max(1).log(feature.Ordinal.base().mul(2)).floor(),
					feature.Ordinal.base(),
					new Decimal(10),
				).add(1);
			}
			effectDescription(): string {
				return 'x' + formatWhole(this.effect());
			}
			currency: Currencies = Currencies.ORDINAL;
			show(): boolean {
				return !player.upgrades[61];
			}
		})(),
		'57': new (class U57 extends UpgradeWithEffect<Decimal> {
			description = '序数以减弱的效果倍增序数提升速度';
			cost: () => Decimal = function () {
				return new Ordinal('w^3+w^2*4').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-7';
			effect(): Decimal {
				return player.ordinal.number.max(1).root(10).floor();
			}
			effectDescription(): string {
				return 'x' + formatWhole(this.effect());
			}
			currency: Currencies = Currencies.ORDINAL;
			show(): boolean {
				return !player.upgrades[61];
			}
		})(),
		'58': new (class U58 extends Upgrade {
			description = '解锁数论研究3';
			cost: () => Decimal = function () {
				return new Ordinal('w^3*7').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-8';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'59': new (class U59 extends Upgrade {
			description = '解锁加速器';
			cost: () => Decimal = function () {
				return new Ordinal('w^w').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-9';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'510': new (class U510 extends UpgradeWithEffect<Decimal> {
			description = '序数指数加成序数提升速度';
			cost: () => Decimal = function () {
				return new Ordinal('w^(w+2)*5').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-10';
			effect(): Decimal {
				return player.ordinal.number
					.max(1)
					.log(feature.Ordinal.base())
					.div(feature.Ordinal.base())
					.floor()
					.pow_base(feature.Ordinal.base())
					.pow(player.upgrades['511'] ? 2 : 1);
			}
			effectDescription(): string {
				return 'x' + OrdinalUtils.numberToOrdinal(this.effect(), feature.Ordinal.base());
			}
			currency: Currencies = Currencies.ORDINAL;
			show(): boolean {
				return !player.upgrades[61];
			}
		})(),
		'511': new (class U511 extends Upgrade {
			description = 'U4-10效果平方';
			cost: () => Decimal = function () {
				return new Ordinal('w^(w*2+5)').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-11';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'512': new (class U512 extends Upgrade {
			description = '数论研究3sgh底数每秒+1';
			cost: () => Decimal = function () {
				return new Ordinal('w^(w*3+4)*2').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-12';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'513': new (class U513 extends Upgrade {
			description = '底数-1';
			cost: () => Decimal = function () {
				return new Ordinal('w^(w*5+2)').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-13';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'514': new (class U514 extends Upgrade {
			description = '序数增长^1.53';
			cost: () => Decimal = function () {
				return new Ordinal('w^(w^2+w*3+4)').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-14';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'515': new (class U515 extends Upgrade {
			description = '数论研究3公式改进';
			cost: () => Decimal = function () {
				return new Ordinal('w^(w^3*4)').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-15';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'516': new (class U516 extends Upgrade {
			description = '底数减1';
			cost: () => Decimal = function () {
				return new Ordinal('w^(w^(4)*4)').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-16';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'517': new (class U517 extends Upgrade {
			description: () => string = function () {
				return player.upgrades['516']
					? '访问九头蛇Hydra'
					: wordShift.randomCrossWords('A   s  9 h  d s   e H   a', 0.9, false);
			};
			cost: () => Decimal = function () {
				return new Ordinal('e0').toDecimal(feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U4-17';
			currency: Currencies = Currencies.ORDINAL;
		})(),
	} as const,
	ordinalPerSecond() {
		if (player.upgrades[61]) return new Decimal(0);
		let base = new Decimal(0);
		if (player.upgrades[51]) base = base.add(upgrades[51].effect());
		if (player.upgrades[55]) base = base.mul(upgrades[55].effect());
		if (player.upgrades[56]) base = base.mul(upgrades[56].effect());
		if (player.upgrades[57]) base = base.mul(upgrades[57].effect());
		if (player.upgrades[58]) base = base.mul(feature.OrdinalNT.varComputed('tau', 3));
		if (player.upgrades[510]) base = base.mul(upgrades[510].effect());
		if (player.upgrades['52R']) base = base.mul(feature.Ordinal.base());

		base = base.mul(ORDINAL_BOOSTER.boosterEffect().max(1));

		if (player.upgrades[514]) base = base.pow(1.53);
		return base;
	},
	speedDeri() {
		return ordinalSpeedDerivative;
	},
	base() {
		let base = new Decimal(10);
		if (player.upgrades[52]) base = base.sub(1);
		if (player.upgrades[53]) base = base.sub(1);
		if (player.upgrades[54]) base = base.sub(1);
		if (player.upgrades['51R']) base = base.sub(1);

		if (player.upgrades[513]) base = base.sub(1);
		if (player.upgrades[516]) base = base.sub(1);
		return base;
	},

	isConstantSpeed(): boolean {
		return !player.upgrades['510'];
	},
};
