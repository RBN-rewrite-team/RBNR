import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { Buyable } from '../buyable';
import { getCurrency, Currencies } from '../currencies';
import { format, formatWhole } from '@/utils/format';
import { upgrades, buyables } from '../mechanic';
import Decimal from 'break_eternity.js';
import { player } from '../save';
import type { FixedLengthArray } from 'type-fest';
import { DC } from '../constants';

export const WellOrderingBuyables = {
  "B6R11": new (class extends Buyable<Decimal> {
    name = "B6-R-1-1"
    description = "点击获得推演能量按钮获取量+1"
    cost(x: Decimal): Decimal {
      return x.pow_base(1.3).mul(100)
    }
    effect(x: Decimal): Decimal {
      return x
    }
    effectDescription(x: Decimal) {
			return '+' + formatWhole(this.effect(x));
		}
		costInverse(x: Decimal): Decimal {
		  return x.div(100).log(1.3).add(1).floor()
		}
		canBuyMax(): boolean {
		  return false
		}
		autoBuyMax(): boolean {
		  return false
		}
		currency: Currencies = Currencies.DEDUCE_ENERGY;
  })(),
  "B6R12": new (class extends Buyable<Decimal> {
    name = "B6-R-1-2"
    description = "每秒点击(该购买项等级)<sup>2</sup>次推演能量按钮"
    cost(x: Decimal): Decimal {
      return x.pow_base(1.5).mul(500)
    }
    effect(x: Decimal): Decimal {
      return x.pow(2)
    }
    effectDescription(x: Decimal) {
			return formatWhole(this.effect(x)) + "/s";
		}
		costInverse(x: Decimal): Decimal {
		  return x.div(500).log(1.5).add(1).floor()
		}
		canBuyMax(): boolean {
		  return false
		}
		autoBuyMax(): boolean {
		  return false
		}
		currency: Currencies = Currencies.DEDUCE_ENERGY;
  })(),
} as const;
export const nt = {
	get p() {
		return player.numbertheory.well_ordering;
	},
};
export function wellOrderGainPerClick() {
	let a = new Decimal(1);
	
	a = a.add(buyables.B6R11.effect(player.buyables.B6R11))
	
	if (player.numbertheory.well_ordering.steps_proceeded.includes(2)) a = a.mul(10)

	return a;
}
export function clickWellOrder() {
	nt.p.energy = nt.p.energy.add(wellOrderGainPerClick());
}

const ProcceedingCost = [new Decimal(1/0),DC.D_10, new Decimal(1e5)]

export function stepProceed(x: number) {
	if (!nt.p.steps_proceeded.includes(x)) {
		if (nt.p.energy.gte(ProcceedingCost[x] ?? new Decimal(1/0))) {
			nt.p.energy = nt.p.energy.sub(ProcceedingCost[x]);
			nt.p.steps_proceeded.push(x);
		}
	}
}
export function wellOrderPlayerData() {
	return {
		selecting: 1,
		energy: DC.D_0,
		pages: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as FixedLengthArray<number, 10>,
		steps_proceeded: [] as number[],
	};
}

export function energyToUNOCFSpeed() {
	return player.numbertheory.well_ordering.energy.add(1).clampMin(1);
}

export function wellOrderingLoop(diff: number) {
  player.numbertheory.well_ordering.energy = player.numbertheory.well_ordering.energy.add(buyables.B6R11.effect(player.buyables.B6R11).mul(diff).mul(wellOrderGainPerClick()))
}