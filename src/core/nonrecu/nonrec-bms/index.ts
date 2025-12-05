// Non Rec BMS is in PT player data

import { player } from '@/core/global';
import { upgrades } from '@/core/mechanic';
import Decimal from 'break_eternity.js';

export const NON_REC_BMS = {
	playerData() {
		return {
			deduce: new Decimal(0),
		};
	},
	deduceSpeed() {
		let base = new Decimal(0.1);
		if (player.upgrades[82]) {
			base = base.mul(upgrades[82].effect());
		}
		if (player.upgrades[84]) {
			base = base.mul(upgrades[84].effect());
		}
		if (player.upgrades[87]) {
			base = base.mul(upgrades[87].effect());
		}
		return base;
	},
	loop(diffSecond: number) {
		if (player.pt.power.lt(1e70)) return;
		player.pt.nonrecBMS.deduce = player.pt.nonrecBMS.deduce.add(
			NON_REC_BMS.deduceSpeed().mul(diffSecond),
		);
	},
	effects() {
		let base: [Decimal] = [new Decimal(1)];
		base[0] = player.pt.nonrecBMS.deduce.clampMin(1).log10();
		if (base[0].gte(1.55) && !player.upgrades[88]) {
			base[0] = base[0].div(1.55).pow(0.3).mul(1.55);
		}
		return base;
	},
};
