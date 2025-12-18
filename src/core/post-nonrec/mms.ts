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
	displayDeduceSpeed() {
		return MMS.deduceSpeed().div(player.hydra.mms.deduced.mul(2).add(1));
	},
	deduceSpeed() {
		if (player.retribution < 2) return new PowiainaNum(0);
		let base = new PowiainaNum(0.025);
		if (player.hydra.mms.rank.gte(1)) base = base.mul(MMS.rank.rankMilestones[0][0][2][0]());
		if (player.hydra.mms.rank.gte(3)) base = base.mul(4);
		if (player.hydra.mms.rank.gte(4)) base = base.mul(MMS.rank.rankMilestones[0][3][2][0]());
		return base;
	},
	resetGain() {
		if (player.retribution < 2) return new PowiainaNum(0);
		let base = player.hydra.mms.deduced;
		if (player.hydra.mms.rank.gte(2)) base = base.mul(2);

		if (player.hydra.mms.tier.gte(1)) base = base.mul(MMS.rank.rankMilestones[1][0][2][0]());
		return base.floor();
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
			let ori = player.hydra.mms.deduced;
			const int = player.hydra.mms.progress
				.add(player.hydra.mms.deduced.pow(2))
				.root(2)
				.floor();
			player.hydra.mms.progress = player.hydra.mms.progress.sub(int.pow(2).sub(ori.pow(2)));
			player.hydra.mms.deduced = int;
		}
	},
	rank: {
		levelRequirement(q: PowiainaNum | number) {
			const x = new PowiainaNum(q);
			if (!x.isInt()) throw new Error('Input is not integer.');
			let res = PowiainaNum.POSITIVE_INFINITY.clone();

			if (x.eq(0)) {
				let rank = player.hydra.mms.rank;
				//超级折算
				if (rank.gte(1e10)) {
					rank = rank.div(1e10).root(0.25).mul(1e10);
				}
				if (rank.gte(10)) {
					rank = rank.div(10).root(0.75).mul(10);
				}
				res = new PowiainaNum(3).pow(rank);
			}
			if (x.eq(1)) {
				let tier = player.hydra.mms.tier;
				res = tier.add(1).pow(2).add(5);
			}
			return res;
		},
		levelReqReverse(q: PowiainaNum | number, res: PowiainaNum) {
			const x = new PowiainaNum(q);
			if (!x.isInt()) throw new Error('Input is not integer.');
			let res2 = PowiainaNum.ZERO.clone();

			if (x.eq(0)) {
				res2 = res.div(5).root(2).sub(1);
				//软上限
				if (res2.gte(10)) {
					res2 = res2.div(10).pow(0.75).mul(10);
				}
				if (res2.gte(1e10)) {
					res2 = res2.div(1e10).pow(0.25).mul(1e10);
				}
			}
			if (x.eq(1)) {
				res2 = res.sub(2).div(3).clampMin(0).root(2).sub(1);
				// let tier = player.hydra.mms.tier;
				// res = tier.add(1).pow(2).mul(3).add(2);
			}
			return res2.ceil();
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
			if (x.eq(1)) {
				if (MMS.rank.levelRequirement(x).lte(player.hydra.mms.rank)) {
					player.hydra.mms.deduced = new PowiainaNum(0);
					player.hydra.mms.progress = new PowiainaNum(0);
					player.hydra.chargedEnergy = new PowiainaNum(0);
					player.hydra.mms.rank = new PowiainaNum(0);
					player.hydra.mms.tier = player.hydra.mms.tier.add(1);
				}
			}
		},
		rankMilestones: {
			0: [
				[
					new PowiainaNum(1),
					() => 'Multiply MMS deduce speed, based on Charged Hydra Energy' as const,
					[
						() => {
							let effect: PowiainaNum = player.hydra.chargedEnergy.add(1).pow(0.5);
							if (effect.gte(100)) effect = effect.div(100).pow(0.25).mul(100);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[new PowiainaNum(2), () => 'Charged Hydra Energy gain ×2' as const] as const,
				[new PowiainaNum(3), () => 'MMS deduce speed x4' as const] as const,
				[
					new PowiainaNum(4),
					() => 'Multiply MMS deduce speed, based on Rank' as const,
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.rank.root(1.5).add(1);

							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
			],
			1: [
				[
					new PowiainaNum(1),
					() => 'Multiply Charged Hydra Energy, based on Tier' as const,
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier.add(1).pow(0.5);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
			] as const,
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

// window.MMS = MMS;
