import Decimal from 'break_eternity.js';
import { buyables, BUYABLES, upgrades, UPGRADES, type singleReq } from '../mechanic';
import { feature, player } from '../global.ts';
import { OrdinalUtils } from '@/utils/ordinal';
import { Currencies } from '../currencies';
import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { CurrencyRequirement, type Requirement } from '../requirements';
import { Buyable } from '../buyable';
import { format } from '@/utils/format.ts';

export const Ordinal = {
	upgrades: {
		'51': new (class U51 extends UpgradeWithEffect<Decimal> {
			description = '每秒增加1序数';
			cost = new Decimal(0);
			ordinal = true;
			name = 'U5-1';
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
			cost:()=>Decimal = function(){ return OrdinalUtils.ordinalToNumber('w', feature.Ordinal.base()); };
			ordinal = true;
			name = 'U5-2';
			currency: Currencies = Currencies.ORDINAL;
		}),
		'53': new (class U53 extends Upgrade {
			description = '底数减少1';
			cost:()=>Decimal = function(){ return OrdinalUtils.ordinalToNumber('w^(3)', feature.Ordinal.base()); };
			ordinal = true;
			name = 'U5-3';
			currency: Currencies = Currencies.ORDINAL;
		}),
		'54': new (class U54 extends Upgrade {
			description = '底数减少1';
			cost:()=>Decimal = function(){
				return OrdinalUtils.ordinalToNumber('w^(6)', feature.Ordinal.base());
			};
			ordinal = true;
			name = 'U5-4';
			currency: Currencies = Currencies.ORDINAL;
		}),
		'55': new (class U55 extends UpgradeWithEffect<Decimal> {
			description = '基于序数的值加成序数每秒获取';
			cost:()=>Decimal = function(){ 
				return OrdinalUtils.ordinalToNumber('w^(2)*(2)', feature.Ordinal.base()); 
			};
			ordinal = true;
			name = 'U5-5';
			currency: Currencies = Currencies.ORDINAL;
			effect(): Decimal {
				return player.ordinal.number.log(feature.Ordinal.base()).pow(1.5).ceil();
			}
			effectDescription(values: Decimal): string {
				return `×${OrdinalUtils.numberToOrdinal(values, feature.Ordinal.base())}`
			}
		}),
	} as const,
	ordinalPerSecond() {
		let base = new Decimal(0);
		if(player.upgrades[51]) base = base.add(upgrades[51].effect());
		if (player.upgrades[55]) base = base.mul(Ordinal.upgrades[55].effect())
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