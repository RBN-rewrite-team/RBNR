import { BUYABLES, buyables, upgrades, UPGRADES } from '../mechanic';
import { player, feature } from '../global';
import { format, formatWhole } from '@/utils/format';
import { OrdinalUtils } from '@/utils/ordinal';
import { Ordinal } from '@/lib/ordinal/';
import Decimal from 'break_eternity.js';
import { Buyable } from '../buyable';
import { Currencies } from '../currencies';
import { Upgrade, UpgradeWithEffect } from '../upgrade';

export const OrdinalNT = {
	buyables: {
		'51R': new (class B51R extends Buyable<Decimal> {
			description = 'x<sub>3,1</sub>=x<sub>3,1</sub>+1';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^4')
					.toDecimal(feature.Ordinal.base().toNumber())
					.mul(x.pow_base(2));
			}
			ordinal = true;
			name = 'B4-R1-1';
			effect(x: Decimal): Decimal {
				return x;
			}
			effectDescription(x: Decimal) {
				return `x<sub>3,1</sub> = ` + this.effect(x);
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.max(1)
					.div(new Ordinal('w^4').toDecimal(feature.Ordinal.base().toNumber()))
					.max(1)
					.log(2)
					.add(1)
					.floor();
			}
		})(),
		'52R': new (class B52R extends Buyable<Decimal> {
			description = 'SGH底数+1';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^4')
					.toDecimal(feature.Ordinal.base().toNumber())
					.mul(x.pow_base(feature.Ordinal.base().toNumber()));
			}
			ordinal = true;
			name = 'B4-R1-2';
			effect(x: Decimal): Decimal {
				return x;
			}
			effectDescription(x: Decimal) {
				return '+' + this.effect(x);
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.max(1)
					.div(new Ordinal('w^4').toDecimal(feature.Ordinal.base().toNumber()))
					.max(1)
					.log(feature.Ordinal.base().toNumber())
					.add(1)
					.floor();
			}
		})(),
		'53R': new (class B53R extends Buyable<Decimal> {
			description = 'HH底数-1';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^w')
					.toDecimal(feature.Ordinal.base().toNumber())
					.pow(x.pow_base(2));
			}
			ordinal = true;
			name = 'B4-R1-3';
			effect(x: Decimal): Decimal {
				return x;
			}
			effectDescription(x: Decimal) {
				return '-' + this.effect(x);
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.max(1)
					.log(new Ordinal('w^w').toDecimal(feature.Ordinal.base().toNumber()))
					.max(1)
					.log2()
					.floor()
			}
		})(),
		'54R': new (class B54R extends Buyable<Decimal> {
			description = '将x_3每秒增长倍率+0.05';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^w')
					.toDecimal(feature.Ordinal.base().toNumber())
					.pow(x.pow_base(2));
			}
			ordinal = true;
			name = 'B4-R1-4';
			effect(x: Decimal): Decimal {
				return x.mul(0.05);
			}
			effectDescription(x: Decimal) {
				return '+' + format(this.effect(x));
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.max(1)
					.log(new Ordinal('w^w').toDecimal(feature.Ordinal.base().toNumber()))
					.max(1)
					.log2()
					.floor()
			}
		})(),
		'55R': new (class B54R extends Buyable<Decimal> {
			description = '将x_3每秒增长指数+0.05';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^(w*2)')
					.toDecimal(feature.Ordinal.base().toNumber())
					.pow(x.pow_base(feature.Ordinal.base().toNumber()));
			}
			ordinal = true;
			name = 'B4-R1-5';
			effect(x: Decimal): Decimal {
				return x.mul(0.05);
			}
			effectDescription(x: Decimal) {
				return '+' + this.effect(x);
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.max(1)
					.log(new Ordinal('w^w').toDecimal(feature.Ordinal.base().toNumber()))
					.max(1)
					.log(feature.Ordinal.base().toNumber())
					.floor()
			}
		})(),
	} as const,
	upgrades: {
		'51R': new (class U51 extends Upgrade {
			description = '将底数降低1';
			cost = ():Decimal=>new Ordinal("w^(w*2)").toDecimal(feature.Ordinal.base().toNumber());
			ordinal = true;
			name = 'U4-R1-1';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'52R': new (class U52 extends Upgrade {
			description = '序数增长速度被乘以奇点能量';
			cost = ():Decimal=>new Ordinal("w^(w*2+1)").toDecimal(feature.Ordinal.base().toNumber());
			ordinal = true;
			name = 'U4-R1-2';
			currency: Currencies = Currencies.ORDINAL;
		})(),
	} as const,
	initMechanics() {},
	varExp(id = 'x', layer = 3): Decimal {
		let base = new Decimal(1);
		base = base.add(buyables['55R'].effect(player.buyables['55R']))
		return base;
	},
	varMul(id = 'x', layer = 3): Decimal {
		let base = new Decimal(1);
		base = base.mul(buyables['54R'].effect(player.buyables['54R']).add(1).pow(player.numbertheory.GH.t31))
		return base;
	},
	varMulBase(id = 'x', layer = 3): Decimal {
		let base = new Decimal(1);
		base = base.add(buyables['54R'].effect(player.buyables['54R']))
		return base;
	},
	varParam(id = 'x', layer = 3): string {
		if (layer == 3) {
			if (id == 'x')
				return (
					`x_{3,1}` +
					(this.varMul(id, layer).gt(1)
						? `\\times{` + format(this.varMulBase(id, layer)) + `^{t_{3, 1}}}`
						: ``)
				);
		}
		return ``;
	},
	varGain(id = 'x', layer = 3): Decimal {
		if (layer == 3) {
			if (id == 'x') {
				let base = buyables['51R'].effect(player.buyables['51R']);
				base = base.mul(this.varMul(id, layer))
				base = base.pow(this.varExp(id, layer))
				return base;
			}
		}
		return new Decimal(0);
	},
	varGainLoop(diff = 1): void {
		player.numbertheory.GH.x = player.numbertheory.GH.x.add(this.varGain('x', 3).mul(diff));
	},
	varComputed(id = 'tau', layer = 3): Decimal {
		if (layer == 3) {
			if (id == 'tau') {
				let base = OrdinalUtils.ordinalChangeBase(
					this.varComputed('a', 3),
					this.varComputed('hhBase', 3),
					this.varComputed('sghBase', 3),
				);
				return base;
			} else if (id == 'a') {
				let base = OrdinalUtils.numberLogHH(
					player.numbertheory.GH.x,
					this.varComputed('hhBase', 3),
				);
				return base;
			} else if (id == 'hhBase') {
				let base = new Decimal(10);
				base = base.sub(buyables['53R'].effect(player.buyables['53R']));
				
				return base;
			} else if (id == 'sghBase') {
				let base = new Decimal(10);
				base = base.add(buyables['52R'].effect(player.buyables['52R']));
				return base;
			}
		}
		return new Decimal(0);
	},
};
