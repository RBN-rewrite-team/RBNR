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

export const ORDINAL = {
	upgrades: {
		'51': new (class U51 extends UpgradeWithEffect<Decimal> {
			description = '每秒增加1序数';
			cost = new Decimal(0);
			ordinal = true;
			name = 'U4-1';
			effect() {
			    return new Decimal(1);
			};
			effectDescription() {
			    return '+' + OrdinalUtils.numberToOrdinal(this.effect(), feature.Ordinal.base()) + '/s';
			};
			currency: Currencies = Currencies.ORDINAL;
		}),
		'52': new (class U52 extends Upgrade {
			description = '底数减少1';
			cost:()=>Decimal = function(){ return new Ordinal('w').toDecimal(feature.Ordinal.base().toNumber()); };
			ordinal = true;
			name = 'U4-2';
			currency: Currencies = Currencies.ORDINAL;
		}),
		'53': new (class U53 extends Upgrade {
			description = '底数减少1';
			cost:()=>Decimal = function(){ return new Ordinal('w^3').toDecimal(feature.Ordinal.base().toNumber()); };
			ordinal = true;
			name = 'U4-3';
			currency: Currencies = Currencies.ORDINAL;
		}),
		'54': new (class U54 extends Upgrade {
			description = '底数减少1';
			cost:()=>Decimal = function(){ return new Ordinal('w^w').toDecimal(feature.Ordinal.base().toNumber()) };
			ordinal = true;
			name = 'U4-4';
			currency: Currencies = Currencies.ORDINAL;
		}),
		'55': new (class U55 extends UpgradeWithEffect<Decimal> {
			description = '序数指数倍增序数提升速度';
			cost: () => Decimal = function(){ return new Ordinal('w^2').toDecimal(feature.Ordinal.base().toNumber()); };
			ordinal = true;
			name = 'U4-5';
			effect() {
				return player.ordinal.number.max(1).log(feature.Ordinal.base().toNumber()).floor();
			};
			effectDescription() {
				return 'x' + formatWhole(this.effect());
			};
			currency: Currencies = Currencies.ORDINAL;
		}),
		'56': new (class U56 extends UpgradeWithEffect<Decimal> {
			description = '序数指数以减弱的效果倍增序数提升速度';
			cost: () => Decimal = function(){ return new Ordinal('w^2*4').toDecimal(feature.Ordinal.base().toNumber()); };
			ordinal = true;
			name = 'U4-6';
			effect() {
				return player.ordinal.number.max(1).log(feature.Ordinal.base().mul(2).toNumber()).max(1).floor();
			};
			effectDescription() {
				return 'x' + formatWhole(this.effect());
			};
			currency: Currencies = Currencies.ORDINAL;
		}),
		'57': new (class U57 extends UpgradeWithEffect<Decimal> {
			description = '序数以减弱的效果倍增序数提升速度';
			cost: () => Decimal = function(){ return new Ordinal('w^3*3').toDecimal(feature.Ordinal.base().toNumber()); };
			ordinal = true;
			name = 'U4-7';
			effect() {
				return player.ordinal.number.max(1).root(10).floor();
			};
			effectDescription() {
				return 'x' + formatWhole(this.effect());
			};
			currency: Currencies = Currencies.ORDINAL;
		}),
		'58': new (class U58 extends Upgrade {
			description = '解锁数论研究3';
			cost: () => Decimal = function() { return new Ordinal('w^4').toDecimal(feature.Ordinal.base().toNumber()); };
			ordinal = true;
			name = 'U4-8';
			currency: Currencies = Currencies.ORDINAL;
		}),
	} as const,
	ordinalPerSecond() {
		let base = new Decimal(0);
		if(player.upgrades[51]) base = base.add(upgrades[51].effect());
		if(player.upgrades[55]) base = base.mul(upgrades[55].effect());
		if(player.upgrades[56]) base = base.mul(upgrades[56].effect());
		if(player.upgrades[57]) base = base.mul(upgrades[57].effect());
		return base;
	},
	base() {
		let base = new Decimal(10);
		if(player.upgrades[52]) base = base.sub(1);
		if(player.upgrades[53]) base = base.sub(1);
		if(player.upgrades[54]) base = base.sub(1);
		return base;
	},
};