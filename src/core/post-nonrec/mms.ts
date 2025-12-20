/**
 * player data put at hydra inner
 */

import PowiainaNum, { type PowiainaNumSource } from 'powiaina_num.js';
import { player } from '../global';
import { format, formatWhole } from '@/utils/format';
import { numberToChinese } from '@/lib/funcs';
import { getMessage, i18n } from '@/utils/i18n';
export type RankMilestone = [
	PowiainaNum,
	() => string,
	[() => PowiainaNum, (x: PowiainaNum) => string]?,
];

const RankTierNames = [
	['Rank', 'Tier', "Tri", 'Tetr', 'Pent', 'Hex', 'Hept', 'Oct', 'Enne'],
	['', 'dec', 'icos'],
	['', 'hect'],
];

const RankTierNames2 = [
	['', 'un', 'do', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona'],
	['', 'un', 'du', 'tria', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona'],
	['', 'un', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona'],
];

export const MMS = {
	playerData() {
		return {
			deduced: new PowiainaNum(0),
			progress: new PowiainaNum(0),
			rank: new PowiainaNum(0),
			tier: new PowiainaNum(0),
			tri: new PowiainaNum(0),
			rankEnergy: new PowiainaNum(0),
			lastReset: 0,
		};
	},
	displayDeduceSpeed(): PowiainaNum {
		return MMS.deduceSpeed().div(player.hydra.mms.deduced.add(1).root(this.staticExp()).sub(player.hydra.mms.deduced.root(this.staticExp())));
	},
	deduceSpeed(): PowiainaNum {
		if (player.retribution < 2) return new PowiainaNum(0);
		let base = new PowiainaNum(0.025);
		if (player.hydra.mms.rank.gte(1)) base = base.mul(MMS.rank.rankMilestones[0][0][2][0]());
		if (player.hydra.mms.rank.gte(3)) base = base.mul(4);
		if (player.hydra.mms.rank.gte(4)) base = base.mul(MMS.rank.rankMilestones[0][3][2][0]());
		if (player.hydra.mms.tier.gte(3)) base = base.mul(4);
		if (player.hydra.mms.rank.gte(17)) base = base.mul(MMS.rank.rankMilestones[0][9][2][0]());
		if (player.hydra.mms.tri.gte(1)) base = base.mul(MMS.rank.rankMilestones[2][0][2][0]());
		return base;
	},
	resetGain(): PowiainaNum {
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
				.add(player.hydra.mms.deduced.root(this.staticExp()))
				.pow(this.staticExp())
				.floor();
			player.hydra.mms.progress = player.hydra.mms.progress.sub(int.root(this.staticExp()).sub(ori.root(this.staticExp())));
			player.hydra.mms.deduced = int;
		}
		player.hydra.mms.rankEnergy = player.hydra.mms.rankEnergy.add(
			this.rank.rankEnergies[0].gain().mul(diff),
		);
		if (player.hydra.mms.rank.gte(25)) this.addEnergy(MMS.resetGain().mul(diff))
	},
	staticExp(): PowiainaNum {
		let base = new PowiainaNum(0.5);
		return base;
	},
	rank: {
		scaling: {
			0: [
				[
					new PowiainaNum(10),
					() => {
						let base = new PowiainaNum(0.75);
						if (player.hydra.mms.rank.gte(19)) base = base.pow(0.75);
						return base;
					},
				],
				[new PowiainaNum(1e10), () => new PowiainaNum(0.25)],
			],
		},
		levelRequirement(q: PowiainaNum | number) {
			const x = new PowiainaNum(q);
			if (!x.isInt()) throw new Error('Input is not integer.');
			let res = PowiainaNum.POSITIVE_INFINITY.clone();

			if (x.eq(0)) {
				let rank = player.hydra.mms.rank;
				//超级折算
				if (rank.gte(this.scaling[0][1][0])) {
					rank = rank
						.div(this.scaling[0][1][0])
						.root(this.scaling[0][1][1]())
						.mul(this.scaling[0][1][0]);
				}
				if (rank.gte(this.scaling[0][0][0])) {
					rank = rank
						.div(this.scaling[0][0][0])
						.root(this.scaling[0][0][1]())
						.mul(this.scaling[0][0][0]);
				}
				res = new PowiainaNum(3).pow(rank);
			}
			if (x.eq(1)) {
				let tier = player.hydra.mms.tier;
				res = tier.add(1).pow(2).add(5);
			}
			if (x.eq(2)) {
				let tri = player.hydra.mms.tri;
				res = tri.mul(4).add(4);
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
					res2 = res2
						.div(this.scaling[0][0][0])
						.pow(this.scaling[0][0][1]())
						.mul(this.scaling[0][0][0]);
				}
				if (res2.gte(this.scaling[0][1][0])) {
					res2 = res2
						.div(this.scaling[0][1][0])
						.pow(this.scaling[0][1][1]())
						.mul(this.scaling[0][1][0]);
				}
			}
			if (x.eq(1)) {
				res2 = res.sub(5).clampMin(0).root(2).sub(1);
				// let tier = player.hydra.mms.tier;
				// res = tier.add(1).pow(2).mul(3).add(2);
			}
			if (x.eq(2)) {
				res2 = res.sub(4).clampMin(0).div(4);
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
			if (x.eq(2)) {
				if (MMS.rank.levelRequirement(x).lte(player.hydra.mms.tier)) {
					player.hydra.mms.deduced = new PowiainaNum(0);
					player.hydra.mms.progress = new PowiainaNum(0);
					player.hydra.chargedEnergy = new PowiainaNum(0);
					player.hydra.mms.rank = new PowiainaNum(0);
					player.hydra.mms.rankEnergy = new PowiainaNum(0);
					player.hydra.mms.tier = new PowiainaNum(0);
					
					player.hydra.mms.tri = player.hydra.mms.tri.add(1);
				}
			}
		},
		rankEnergies: {
			0: {
				unlocked(): boolean {
					return player.hydra.mms.rank.gte(10);
				},
				gain(): PowiainaNum {
					if (!this.unlocked()) return new PowiainaNum(0);
					let base = new PowiainaNum(10).pow(
						player.hydra.mms.rank.max(10).log10().pow(3),
					);
					if(player.hydra.mms.tier.gte(4)) base = base.mul(MMS.rank.rankMilestones[1][3][2][0]());
					return base;
				},
				effect(): PowiainaNum {
					let base = player.hydra.mms.rankEnergy.add(1).root(5);
					if (base.gte(10)) base = base.add(base.pow(2).sub(90)).div(2); //its a soft bottom
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
					() => getMessage('mms.rank.mil.0.0'),
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
				[new PowiainaNum(2), () => getMessage('mms.rank.mil.0.1')] as const,
				[new PowiainaNum(3), () => getMessage('mms.rank.mil.0.2')] as const,
				[
					new PowiainaNum(4),
					() => getMessage('mms.rank.mil.0.3'),
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.rank.root(1.5).add(1);

							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[new PowiainaNum(7), () => getMessage('mms.rank.mil.0.4')] as const,
				[
					new PowiainaNum(9),
					() => getMessage('mms.rank.mil.0.5'),
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.deduced
								.mul(5)
								.add(1)
								.root(6);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[
					new PowiainaNum(10),
					() => getMessage('mms.rank.mil.0.6'),
					[
						(): PowiainaNum => {
							return MMS.rank.rankEnergies[0].gain();
						},
						(x: PowiainaNum) => `+${format(x)}/s`,
					],
				] as const,
				[new PowiainaNum(12), () => getMessage('mms.rank.mil.0.7')] as const,
				[
					new PowiainaNum(14),
					() => getMessage('mms.rank.mil.0.8'),
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
					() => getMessage('mms.rank.mil.0.9'),
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier
								.max(1)
								.add(1)
								.pow(3)
								.sub(7);

							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[new PowiainaNum(19), () => getMessage('mms.rank.mil.0.10')] as const,
				[new PowiainaNum(25), () => getMessage('mms.rank.mil.0.11')] as const,
			],
			1: [
				[
					new PowiainaNum(1),
					() => getMessage('mms.rank.mil.1.0'),
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier.add(1);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[new PowiainaNum(2), () => getMessage('mms.rank.mil.1.1')] as const,
				[new PowiainaNum(3), () => getMessage('mms.rank.mil.1.2')] as const,
				[
					new PowiainaNum(4),
					() => getMessage('mms.rank.mil.1.3'),
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier.add(1).pow(1.5);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
			] as const,
			2: [
				[
					new PowiainaNum(1),
					() => getMessage('mms.rank.mil.2.0'),
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.rank.add(1).pow(2.5);
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
		getRankTierName(tier: PowiainaNumSource) {
			// @ts-expect-error
			let locale: string = i18n.global.locale.value;
			if (locale == 'zh-CN') return MMS.rank.getRankTierNameCN(tier);
			return MMS.rank.getRankTierNameEN(tier);
		},
		getRankTierNameEN(tier: PowiainaNumSource) {
			let newTier = new PowiainaNum(tier);
			if (newTier.gte(999)) return `[${formatWhole(newTier.add(1))}]`;
			let i = newTier.toNumber();
			if (i < 9) return RankTierNames[0][i];
			i += 1;
			let m = '';
			let h = Math.floor(i / 100),
				d = Math.floor(i / 10) % 10,
				o = i % 10;

			if (d > 1 && o == 1) m += 'hen';
			else if (d == 2 && o == 3) m += 'tr';
			else m += RankTierNames2[0][o];
			if (d > 2) m += RankTierNames2[1][d] + 'cont';
			else m += RankTierNames[1][d];
			if (h > 0 && d > 0) m += 'a';
			if (h > 0) m += h > 1 ? RankTierNames2[2][h] + 'ct' : 'hect';

			return m[0].toUpperCase() + m.slice(1);
		},
		getRankTierNameCN(tier: PowiainaNumSource) {
			let newTier = new PowiainaNum(tier);
			if (newTier.gte(9999)) return `${formatWhole(newTier.add(1))}重阶层`;
			let i = newTier.toNumber();
			if (i === 0) return '级别';
			if (i === 1) return '阶层';
			return `${numberToChinese(i + 1)}重阶层`;
		},
	} as const,
} as const;

// window.MMS = MMS;
