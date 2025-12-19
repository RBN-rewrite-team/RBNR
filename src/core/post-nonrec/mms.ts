/**
 * player data put at hydra inner
 */

import PowiainaNum, { type PowiainaNumSource } from 'powiaina_num.js';
import { player } from '../global';
import { format, formatWhole } from '@/utils/format';
import { numberToChinese } from '@/lib/funcs';
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
			rankEnergy: new PowiainaNum(0),
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
		if (player.hydra.mms.tier.gte(3)) base = base.mul(4);
		if (player.hydra.mms.rank.gte(17)) base = base.mul(MMS.rank.rankMilestones[0][9][2][0]());
		return base;
	},
	resetGain() {
		if (player.retribution < 2) return new PowiainaNum(0);
		let base = player.hydra.mms.deduced;
		if (player.hydra.mms.rank.gte(2)) base = base.mul(2);
		if (player.hydra.mms.tier.gte(1)) base = base.mul(MMS.rank.rankMilestones[1][0][2][0]());
		if (player.hydra.mms.rank.gte(9)) base = base.mul(MMS.rank.rankMilestones[0][5][2][0]());
		if (MMS.rank.rankEnergies[0].unlocked()) base = base.mul(MMS.rank.rankEnergies[0].effect());
		if (player.hydra.mms.rank.gte(12)) base = base.mul(15);
		if (player.hydra.mms.rank.gte(14)) base = base.mul(MMS.rank.rankMilestones[0][8][2][0]());
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
		player.hydra.mms.rankEnergy = player.hydra.mms.rankEnergy.add(this.rank.rankEnergies[0].gain().mul(diff));
	},
	rank: {
		scaling: {
			0: [[new PowiainaNum(10), () => {
				let base = new PowiainaNum(0.75);
				if(player.hydra.mms.rank.gte(19)) base = base.pow(0.75);
				return base;
			}], [new PowiainaNum(1e10), () => new PowiainaNum(0.25)]],
		},
		levelRequirement(q: PowiainaNum | number) {
			const x = new PowiainaNum(q);
			if (!x.isInt()) throw new Error('Input is not integer.');
			let res = PowiainaNum.POSITIVE_INFINITY.clone();

			if (x.eq(0)) {
				let rank = player.hydra.mms.rank;
				//超级折算
				if (rank.gte(this.scaling[0][1][0])) {
					rank = rank.div(this.scaling[0][1][0]).root(this.scaling[0][1][1]()).mul(this.scaling[0][1][0]);
				}
				if (rank.gte(this.scaling[0][0][0])) {
					rank = rank.div(this.scaling[0][0][0]).root(this.scaling[0][0][1]()).mul(this.scaling[0][0][0]);
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
				res2 = res.log(3);
				//软上限
				if (res2.gte(this.scaling[0][0][0])) {
					res2 = res2.div(this.scaling[0][0][0]).pow(this.scaling[0][0][1]()).mul(this.scaling[0][0][0]);
				}
				if (res2.gte(this.scaling[0][1][0])) {
					res2 = res2.div(this.scaling[0][1][0]).pow(this.scaling[0][1][1]()).mul(this.scaling[0][1][0]);
				}
			}
			if (x.eq(1)) {
				res2 = res.sub(5).clampMin(0).root(2).sub(1);
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
					player.hydra.mms.rankEnergy = new PowiainaNum(0);
					
					player.hydra.mms.tier = player.hydra.mms.tier.add(1);
				}
			}
		},
		rankEnergies: {
			0: {
				unlocked(): boolean {return player.hydra.mms.rank.gte(10);},
				gain(): PowiainaNum {
					if(!this.unlocked()) return new PowiainaNum(0);
					let base = new PowiainaNum(10).pow(player.hydra.mms.rank.max(10).log10().pow(3));
					return base;
				},
				effect(): PowiainaNum {
					let base = player.hydra.mms.rankEnergy.add(1).root(5);
					if(base.gte(10)) base = base.add(base.pow(2).sub(90)).div(2); //its a soft bottom
					return base;
				},
				effectDescription(): string {
					let e = this.effect();
					return `ChHE gain ×${format(e)}`;
				},
			},
		},
		rankMilestones: {
			0: [
				[
					new PowiainaNum(1),
					() => 'Multiply MMS deduce speed, based on Charged Hydra Energy' as const,
					[
						() => {
							let effect: PowiainaNum = player.hydra.chargedEnergy.add(1).pow(0.5);
							if (player.hydra.mms.tier.gte(2)) effect = effect.add(2);
							if (player.hydra.mms.rank.gte(7)) effect = effect.pow(1.5);
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
				[new PowiainaNum(7), () => 'Rank 1 Effect ^1.5' as const] as const,
				[
					new PowiainaNum(9),
					() => 'Multiply Charged Hydra Energy, based on MMS' as const,
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.deduced.mul(5).add(1).root(6);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[
					new PowiainaNum(10),
					() => 'Start producing Rank Energy, based on Rank' as const,
					[
						() => {
							return MMS.rank.rankEnergies[0].gain();
						},
						(x: PowiainaNum) => `+${format(x)}/s`,
					],
				] as const,
				[new PowiainaNum(12), () => 'Charged Hydra Energy gain x15' as const] as const,
				[
					new PowiainaNum(14),
					() => 'Multiply Charged Hydra Energy, based on Tier' as const,
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier.add(2).pow(2).sub(3);
							
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[
					new PowiainaNum(17),
					() => 'Multiply MMS deduce speed, based on Tier' as const,
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier.max(1).add(1).pow(3).sub(7);
							
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[new PowiainaNum(19), () => 'First Rank scaling is weakened to 75%' as const] as const,
			],
			1: [
				[
					new PowiainaNum(1),
					() => 'Multiply Charged Hydra Energy, based on Tier' as const,
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier.add(1);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[new PowiainaNum(2), () => 'Rank 1 Effect +2' as const] as const,
				[new PowiainaNum(3), () => 'MMS deduce speed x4' as const] as const,
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
