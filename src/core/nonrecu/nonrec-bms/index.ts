// Non Rec BMS is in PT player data

import { player } from '@/core/global';
import Decimal from 'break_eternity.js';

export const NON_REC_BMS = {
	playerData() {
		return {
			deduce: new Decimal(0),
		};
	},
	deduceSpeed() {
		let base = new Decimal(0.1);

		return base;
	},
	loop(diffSecond: number) {
		player.pt.nonrecBMS.deduce = player.pt.nonrecBMS.deduce.add(
			NON_REC_BMS.deduceSpeed().mul(diffSecond),
		);
	},
	effects() {
		let base: [Decimal] = [new Decimal(1)];
		base[0] = player.pt.nonrecBMS.deduce.pow_base(2);
		return base;
	},
};
