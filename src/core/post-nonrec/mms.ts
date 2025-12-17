/**
 * player data put at hydra inner
 */

import PowiainaNum, { type PowiainaNumSource } from 'powiaina_num.js';
import { player } from '../global';
import { format } from '@/utils/format';
export type RankMilestone = [
	PowiainaNum,
	() => string,
	[() => PowiainaNum, (x: PowiainaNum) => string]?,
];
export const MMS = {
	playerData() {
		return {
			deduced: new PowiainaNum(0),
			progress: new PowiainaNum(0),
			rank: new PowiainaNum(0),
			tier: new PowiainaNum(0),
		};
	},
	deduceSpeed() {
		if (player.retribution < 2) return new PowiainaNum(0);
		let base = new PowiainaNum(0.025);
		if (player.hydra.mms.rank.gte(1)) base = base.mul(MMS.rank.rankMilestones[0][0][2][0]());

		return base;
	},
	resetGain() {
		if (player.retribution < 2) return new PowiainaNum(0);
		let base = player.hydra.mms.deduced.add(player.hydra.mms.progress);
		if (player.hydra.mms.rank.gte(2)) base = base.mul(2);
		return base;
	},
	reset() {
		if (player.hydra.mms.deduced.lt(1)) return;
		let gain = MMS.resetGain();
		MMS.addEnergy(gain);
		player.hydra.mms.deduced = new PowiainaNum(0);
		player.hydra.mms.progress = new PowiainaNum(0);
	},
	addEnergy(x: PowiainaNumSource) {
		player.hydra.chargedEnergy = player.hydra.chargedEnergy.add(x);
		player.hydra.totalChargedEnergy = player.hydra.totalChargedEnergy.add(x);
	},
	loop(diff: number) {
		player.hydra.mms.progress = player.hydra.mms.progress.add(this.deduceSpeed().mul(diff));
		if (player.hydra.mms.progress.gte(1)) {
			const int = player.hydra.mms.progress.floor();
			player.hydra.mms.progress = player.hydra.mms.progress.sub(int);
			player.hydra.mms.deduced = player.hydra.mms.deduced.add(int);
		}
	},
	rank: {
		levelRequirement(q: PowiainaNum | number) {
			const x = new PowiainaNum(q);
			if (!x.isInt()) throw new Error('Input is not integer.');
			let res = PowiainaNum.POSITIVE_INFINITY.clone();

			if (x.eq(0)) {
				res = player.hydra.mms.rank.add(1).pow(2).mul(5);
			}
			return res;
		},
		levelUp(q: PowiainaNum | number) {
			const x = new PowiainaNum(q);
			if (!x.isInt()) throw new Error('Input is not integer.');
			if (x.eq(0)) {
				if (MMS.rank.levelRequirement(x).lte(player.hydra.chargedEnergy)) {
					player.hydra.mms.deduced = new PowiainaNum(0);
					player.hydra.mms.progress = new PowiainaNum(0);
					player.hydra.chargedEnergy = new PowiainaNum(0);
					player.hydra.mms.rank = player.hydra.mms.rank.add(1);
				}
			}
		},
		rankMilestones: {
			0: [
				[
					new PowiainaNum(1),
					() => 'Multiply MMS progression speed, based on Charged Hydra Energy' as const,
					[
						() => {
							let effect: PowiainaNum = player.hydra.chargedEnergy.add(1).pow(0.5);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[new PowiainaNum(2), () => 'Charged Hydra Energy gain ×2' as const] as const,
			],
		} as const satisfies { [key: number]: RankMilestone[] },
		getRankMilestones(q: number, rank: PowiainaNum) {
			if (!(q in MMS.rank.rankMilestones)) return null;
			let b = q as keyof typeof MMS.rank.rankMilestones;
			let mils = MMS.rank.rankMilestones[b];
			for (let i = 0; i < mils.length; i++) {
				if (mils[i][0].gt(rank)) {
					return mils[i];
				}
			}
			return null;
		},
	} as const,
} as const;
