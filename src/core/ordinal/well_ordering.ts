import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { Buyable } from '../buyable';
import { getCurrency, Currencies } from '../currencies';
import { format, formatWhole } from '@/utils/format';
import { upgrades, buyables } from '../mechanic';
import Decimal from 'break_eternity.js';
import { player } from '../save';
import type { FixedLengthArray } from 'type-fest';
import { DC } from '../constants';

export const WellOrderingBuyables = [] as const;
export const nt = {
	get p() {
		return player.numbertheory.well_ordering;
	},
};
export function wellOrderGainPerClick() {
	let a = new Decimal(1);

	return a;
}
export function clickWellOrder() {
	nt.p.energy = nt.p.energy.add(wellOrderGainPerClick());
}
export function stepProceed(x: number) {
	if (!nt.p.steps_proceeded.includes(x)) {
		if (x == 1 && nt.p.energy.gte(DC.D_10)) {
			nt.p.energy = nt.p.energy.sub(DC.D_10);
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
