/**
 * player data put at hydra inner
 */

import PowiainaNum, { type PowiainaNumSource } from 'powiaina_num.js';
import { player } from '../global';
import { format, formatWhole } from '@/utils/format';
import { numberToChinese } from '@/libs/funcs';
export type RankMilestone = [
	PowiainaNum,
	() => string,
	[() => PowiainaNum, (x: PowiainaNum) => string]?,
];

const RankTierNames = [
  ["Rank", "Tier", "Tetr", "Pent", "Hex", "Hept", "Oct", "Enne"],
  ["", "dec", "icos"],
  ["", "hect"]
]

const RankTierNames2 = [
    ['','un','do','tri','tetra','penta','hexa','hepta','octa','nona'],
    ['','un','du','tria','tetra','penta','hexa','hepta','octa','nona'],
    ['','un','di','tri','tetra','penta','hexa','hepta','octa','nona'],
]

export const MMS = {
	playerData() {
		return {
			deduced: new PowiainaNum(0),
			progress: new PowiainaNum(0),
			rank: new PowiainaNum(0),
			tier: new PowiainaNum(0),
			lastReset: 0,
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
		if (player.hydra.mms.rank.gte(8)) base = base.mul(MMS.rank.rankMilestones[0][4][2][0]());

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
		player.hydra.mms.lastReset = Date.now();
	},
	resetGainPerMinute() {
		return this.resetGain()
			.div((Date.now() - player.hydra.mms.lastReset) / 1000)
			.mul(60);
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
				[
					new PowiainaNum(8),
					() => 'Multiply MMS deduce speed, based on time spent on reset' as const,
					[
						() => {
							let effect: PowiainaNum = new PowiainaNum(
								(Date.now() - player.hydra.mms.lastReset) / 1000,
							)
								.add(1)
								.pow(0.25);

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
		getRankTierNameEN(tier: PowiainaNumSource) {
		  let newTier = new PowiainaNum(tier)
		  if (newTier.gte(998)) return `[${formatWhole(newTier.add(2))}]`
		  let i = newTier.toNumber()
		  if (i < 8) return RankTierNames[0][i]
		  i += 2
		    let m = ''
        let h = Math.floor(i / 100), d = Math.floor(i / 10) % 10, o = i % 10

        if (d > 1 && o == 1) m += 'hen' 
        else if (d == 2 && o == 3) m += 'tr' 
        else m += RankTierNames2[0][o]
        if (d > 2) m += RankTierNames2[1][d] + 'cont'
        else m += RankTierNames[1][d]
        if (h > 0 && d > 0) m += 'a'
        if (h > 0) m += (h > 1 ? RankTierNames2[2][h] + 'ct' : 'hect')

        return m[0].toUpperCase() + m.slice(1)
		},
		getRankTierNameCN(tier: PowiainaNumSource) {
		  let newTier = new PowiainaNum(tier)
		  if (newTier.gte(9998)) return `${formatWhole(newTier.add(2))}重阶层`
		  let i = newTier.toNumber()
		  if (i === 0) return "级别"
		  if (i === 1) return "阶层"
		  return `${numberToChinese(i + 2)}重阶层`
		}
	} as const,
} as const;

// window.MMS = MMS;
