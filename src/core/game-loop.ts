import { player, feature } from './global.ts';
import { nextTick } from 'vue';
import { simulateTime } from './offline';
import { UPGRADES, BUYABLES, upgrades, buyables, milestones } from './mechanic.ts';
import Decimal from 'break_eternity.js';
import { NUMTHEORY } from './multiplication/numbertheory.ts';
import { predictableRandom } from '@/utils/algorithm.ts';

import { CHALLENGE } from './challenge.ts';
import { Logarithm } from './exponention/logarithm.ts';

export let diff = 40;

export function updateHighestStat() {
	player.stat.highestNumber = player.stat.highestNumber.max(player.number);
	player.stat.highestMulpower = player.stat.highestMulpower.max(player.multiplication.mulpower);
	player.stat.hightestAddpower = player.stat.hightestAddpower.max(player.addpower);
	player.stat.highestExppower = player.stat.highestExppower.max(player.exponention.exppower);
}
export function qolLoop() {
	if (player.upgrades['412q']) {
		player.buyables[11] = player.buyables[11].max(1);
	}
	if (player.upgrades['422q']) {
		player.buyables[11] = player.buyables[11].max(10);
	}
	if (player.upgrades['432q']) {
		player.buyable11More = player.buyables[21];
	}
	if (player.upgrades['442q']) {
		player.buyables[11] = new Decimal(100);
	}
	if (player.upgrades['443q']) {
		player.challenges[0][3] = player.challenges[0][3].max(
			player.multiplication.totalMulpower.pow(0.001),
		);
	}
	if (player.upgrades['453q']) {
		for (let i = 0; i < 3; i++)
			player.challenges[0][i] = player.challenges[0][i].max(player.totalNumber);
	}
	if (player.upgrades['455q']) {
		player.buyables[33] = new Decimal(99);
	}
}
export function gameLoop() {
	diff = Date.now() - player.lastUpdated;
	if (diff < 0) return;
	player.lastUpdated = Date.now();
	
	try {
	  simulate(diff)
	} catch (e) {
	  throw e
	};
	if (diff > 60000) {
		simulateTime(diff);
		return;
	}
}
export function simulate(diff: number) {
    qolLoop();
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

	if (feature.resourceGain.addpower().passive.gt(0)) {
		let bulk = new Decimal(diff / 1000).mul(feature.resourceGain.addpower().passive);
		feature.ADDITION.addpower_gain(bulk);
	}
	
	if (feature.resourceGain.mulpower().passive.gt(0)) {
		let bulk = new Decimal(diff / 1000).mul(feature.resourceGain.mulpower().passive);
		feature.MULTIPLICATION.mulpower_gain(bulk)
	}

	for (let i in upgrades) {
		if (upgrades[i].keep != null && upgrades[i].keep()) {
			player.upgrades[i as keyof typeof player.upgrades] = true;
		}
	}

	for (let i in buyables) {
		if (buyables[i].canBuyMax != null && buyables[i].canBuyMax()) {
			if (buyables[i].autoBuyMax != null && buyables[i].autoBuyMax()) {
				if (buyables[i].buyMax != null) buyables[i].buyMax();
			}
		}
	}
	
	for (let i in milestones) {
		if (milestones[i].canDone) {
			player.milestones[i as keyof typeof player.milestones] = true
		}
	}

	if (player.firstResetBit & 0b10) {
		let dPfTime = diff;
		if (CHALLENGE.inChallenge(0, 3)) {
			dPfTime *= predictableRandom(Math.floor(Date.now() / 40)) > 0.5 ? -1 : 1;
		}
		let dPfTimeDecimal = new Decimal(dPfTime);
		if (player.upgrades[45]) dPfTimeDecimal = dPfTimeDecimal.mul(NUMTHEORY.tau2().pow(4));
		player.multiplication.pfTime = player.multiplication.pfTime.add(dPfTimeDecimal).max(0);
		player.numbertheory.euler.x = player.numbertheory.euler.x
			.add(NUMTHEORY.varXgain().mul(diff).mul(1e-3))
			.max(1);
		player.numbertheory.euler.y = player.numbertheory.euler.y
			.add(NUMTHEORY.varYgain().mul(diff).mul(1e-3))
			.max(1);
		player.numbertheory.euler.z = player.numbertheory.euler.z
			.add(NUMTHEORY.varZgain().mul(diff).mul(1e-3))
			.max(1);
		player.numbertheory.euler.s = player.numbertheory.euler.s
			.add(NUMTHEORY.tickspeedGain().mul(diff).mul(1e-3))
			.max(1);
	}
	if (player.upgrades[45]) {
	    let dPf2TimeDecimal = new Decimal(diff);
	    player.numbertheory.rational_approx.n = player.numbertheory.rational_approx.n.add(NUMTHEORY.varX2gain().mul(diff).mul(1e-3)).max(1);
	}
	Logarithm.astronomerUpdate();
	updateHighestStat();
}