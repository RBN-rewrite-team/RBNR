import { player, feature } from './global.ts';
import { nextTick } from 'vue';
import { UPGRADES, BUYABLES, upgrades, buyables } from './mechanic.ts';
import Decimal from 'break_eternity.js';
import { NUMTHEORY } from './multiplication/numbertheory.ts';

import { updateTheme } from '@/utils/themes';
import { CHALLENGE } from './challenge.ts';

export let diff = 0;

export function updateHighestStat() {
	player.stat.highestNumber = player.stat.highestNumber.max(player.number);
	player.stat.highestMulpower = player.stat.highestMulpower.max(player.multiplication.mulpower);
	player.stat.hightestAddpower = player.stat.hightestAddpower.max(player.addpower);
}
export function gameLoop() {
	diff = Date.now() - player.lastUpdated;

	player.lastUpdated = Date.now();

	updateTheme();
	CHALLENGE.challengeLoop();
	if (feature.SUCCESSOR.autoSuccessPerSecond().gte(0.001)) {
		player.automationCD.successor += diff;
		let cd = new Decimal(1000).div(feature.SUCCESSOR.autoSuccessPerSecond());
		if (cd.lt(player.automationCD.successor)) {
			let bulk = Math.floor(player.automationCD.successor / Number(cd));
			player.automationCD.successor %= Number(cd);
			feature.SUCCESSOR.success(bulk);
		}
	}

	if (player.upgrades[38]) {
		let bulk = new Decimal(diff / 1000).mul(feature.resourceGain.addpower().passive);
		feature.ADDITION.addpower_gain(bulk);
	}

	for (let i in upgrades) {
		if (upgrades[i].keep != null && upgrades[i].keep()) {
			player.upgrades[i as keyof typeof player.upgrades] = true;
		}
	}
	if (player.firstResetBit & 0b10) {
		player.multiplication.pfTime = player.multiplication.pfTime.add(diff);
		player.numbertheory.euler.x = player.numbertheory.euler.x.add(
			NUMTHEORY.varXgain().mul(diff).mul(1e-3),
		);
		player.numbertheory.euler.y = player.numbertheory.euler.y.add(
			NUMTHEORY.varYgain().mul(diff).mul(1e-3),
		);
		player.numbertheory.euler.z = player.numbertheory.euler.z.add(
			NUMTHEORY.varZgain().mul(diff).mul(1e-3),
		);
		player.numbertheory.euler.s = player.numbertheory.euler.s.add(
			NUMTHEORY.tickspeedGain().mul(diff).mul(1e-3),
		);
	}

	updateHighestStat();
}
