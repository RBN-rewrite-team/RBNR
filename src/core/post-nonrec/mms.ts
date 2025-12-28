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
	string[],
	[() => PowiainaNum, (x: PowiainaNum) => string]?,
];

const RankTierNames = [
	['Rank', 'Tier', 'Tri', 'Tetr', 'Pent', 'Hex', 'Hept', 'Oct', 'Enne'],
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
			bestRank: new PowiainaNum(0),
			tier: new PowiainaNum(0),
			bestTier: new PowiainaNum(0),
			tri: new PowiainaNum(0),
			bestTri: new PowiainaNum(0),
			tetr: new PowiainaNum(0),
			bestTetr: new PowiainaNum(0),
			rankEnergy: new PowiainaNum(0),
			tierEnergy: new PowiainaNum(0),
			compressed: {
				rank: new PowiainaNum(0),
				bestRank: new PowiainaNum(0),
			},
			lastReset: 0,
		};
	},
	displayDeduceSpeed(): PowiainaNum {
		return MMS.deduceSpeed().div(
			player.hydra.mms.deduced
				.add(1)
				.root(this.staticExp())
				.sub(player.hydra.mms.deduced.root(this.staticExp()))
				.clampMin(1),
		);
	},
	deduceSpeed(): PowiainaNum {
		if (player.retribution < 2) return new PowiainaNum(0);
		let base = new PowiainaNum(0.025);
		if (player.hydra.mms.rank.gte(1)) base = base.mul(MMS.rank.rankMilestones[0][0][3][0]());
		if (player.hydra.mms.rank.gte(3)) base = base.mul(4);
		if (player.hydra.mms.rank.gte(4)) base = base.mul(MMS.rank.rankMilestones[0][3][3][0]());
		if (player.hydra.mms.tier.gte(3)) base = base.mul(4);
		if (player.hydra.mms.rank.gte(17)) base = base.mul(MMS.rank.rankMilestones[0][9][3][0]());
		if (player.hydra.mms.tri.gte(1)) base = base.mul(MMS.rank.rankMilestones[2][0][3][0]());
		if (player.hydra.mms.tri.gte(6)) base = base.mul(10);

		if (base.gte('1e250'))
			base = base.log10().div(250).pow(0.5).sub(1).mul(2).add(1).mul(250).pow10();
		return base;
	},
	resetGain(): PowiainaNum {
		if (player.retribution < 2) return new PowiainaNum(0);
		let base = player.hydra.mms.deduced;
		if (player.hydra.mms.rank.gte(2)) base = base.mul(2);
		if (player.hydra.mms.tier.gte(1)) base = base.mul(MMS.rank.rankMilestones[1][0][3][0]());
		if (player.hydra.mms.rank.gte(9)) base = base.mul(MMS.rank.rankMilestones[0][5][3][0]());
		if (MMS.rank.rankEnergies[0].unlocked()) base = base.mul(MMS.rank.rankEnergies[0].effect());
		if (player.hydra.mms.rank.gte(12)) base = base.mul(15);
		if (player.hydra.mms.rank.gte(14)) base = base.mul(MMS.rank.rankMilestones[0][8][3][0]());

		if (player.hydra.mms.tier.gte(7)) base = base.pow(1.25);
		if (MMS.rank.rankEnergies[1].unlocked()) base = base.pow(MMS.rank.rankEnergies[1].effect());

		if (base.gte('1e888'))
			base = base.log10().div(888).pow(0.5).sub(1).mul(2).add(1).mul(888).pow10();
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
			player.hydra.mms.progress = player.hydra.mms.progress.sub(
				int.root(this.staticExp()).sub(ori.root(this.staticExp())),
			);
			player.hydra.mms.deduced = int;
		}
		player.hydra.mms.rankEnergy = player.hydra.mms.rankEnergy.add(
			this.rank.rankEnergies[0].gain().mul(diff),
		);
		player.hydra.mms.tierEnergy = player.hydra.mms.tierEnergy.add(
			this.rank.rankEnergies[1].gain().mul(diff),
		);
		if (player.hydra.mms.rank.gte(25) || player.hydra.mms.tri.gte(3))
			this.addEnergy(MMS.resetGain().mul(diff));
		player.hydra.mms.bestTetr = player.hydra.mms.bestTetr.max(player.hydra.mms.tetr);
		if (player.hydra.mms.bestTetr.gte(1)) this.addEnergy(MMS.resetGain().mul(5 * diff));
		if (player.hydra.mms.tier.gte(10) || player.hydra.mms.tri.gte(3)) {
			player.hydra.mms.rank = player.hydra.mms.rank.max(
				this.rank.levelReqReverse(0, player.hydra.chargedEnergy),
			);
			player.hydra.mms.bestRank = player.hydra.mms.bestRank.max(player.hydra.mms.rank);
		}
	},
	staticExp(): PowiainaNum {
		let base = new PowiainaNum(0.5);
		if (player.hydra.mms.tri.gte(6)) base = base.pow(MMS.rank.rankMilestones[2][5][3][0]());
		return base;
	},
	rank: {
		scaling: {
			0: [
				[
					() => {
						let base = new PowiainaNum(10);
						if (player.hydra.mms.tier.gte(5))
							base = base.add(MMS.rank.rankMilestones[1][4][3][0]());
						if (player.hydra.mms.rank.gte(33))
							base = base.add(MMS.rank.rankMilestones[0][12][3][0]());
						if (player.hydra.mms.tier.gte(18)) {
							base = base.mul(2);
						}
						return base;
					},
					() => {
						let base = new PowiainaNum(0.75);
						if (player.hydra.mms.rank.gte(19)) base = base.pow(0.75);
						if (player.hydra.mms.tri.gte(4))
							base = base.pow(MMS.rank.rankMilestones[2][3][3][0]());
						return base;
					},
				],
				[() => new PowiainaNum(1e10), () => new PowiainaNum(0.25)],
			],
		},
		levelRequirement(q: PowiainaNum | number, layer: PowiainaNum | number = 0) {
			const x = new PowiainaNum(q),
				l = new PowiainaNum(layer);
			if (!x.isInt()) throw new Error('Input is not integer.');
			let res = PowiainaNum.POSITIVE_INFINITY.clone();

			if (l.eq(1)) {
				if (x.eq(0)) {
					let rank = player.hydra.mms.compressed.rank;
					let base = new PowiainaNum(1.2);
					res = base.pow(rank).mul(10000);
				}
				return res;
			}

			if (x.eq(0)) {
				let rank = player.hydra.mms.rank;
				//超级折算
				if (rank.gte(this.scaling[0][1][0]())) {
					rank = rank
						.div(this.scaling[0][1][0]())
						.root(this.scaling[0][1][1]())
						.mul(this.scaling[0][1][0]());
				}
				if (rank.gte(this.scaling[0][0][0]())) {
					rank = rank
						.div(this.scaling[0][0][0]())
						.root(this.scaling[0][0][1]())
						.mul(this.scaling[0][0][0]());
				}
				let base = new PowiainaNum(3);
				if (player.hydra.mms.rank.gte(514)) base = new PowiainaNum(2.85);
				res = base.pow(rank);
			}
			if (x.eq(1)) {
				let tier = player.hydra.mms.tier;
				if (tier.gte(50)) tier = tier.sub(50).pow_base(1.04).mul(50);
				res = tier.add(1).pow(2).add(5);
			}
			if (x.eq(2)) {
				let tri = player.hydra.mms.tri;
				res = tri.mul(4).add(4);
			}
			if (x.eq(3)) {
				let tetr = player.hydra.mms.tetr;
				res = tetr.pow(1.25).mul(4).add(10).ceil();
			}
			if (x.gte(4)) {
				return MMS.rank.getBeyondRankRequirement(new PowiainaNum(4));
			}
			return res;
		},
		levelReqReverse(q: PowiainaNum | number, res: PowiainaNum) {
			const x = new PowiainaNum(q);
			if (!x.isInt()) throw new Error('Input is not integer.');
			let res2 = PowiainaNum.ZERO.clone();

			if (x.eq(0)) {
				let base = new PowiainaNum(3);
				if (player.hydra.mms.rank.gte(514)) base = new PowiainaNum(2.85);
				res2 = res.log(base);
				//软上限
				if (res2.gte(this.scaling[0][0][0]())) {
					res2 = res2
						.div(this.scaling[0][0][0]())
						.pow(this.scaling[0][0][1]())
						.mul(this.scaling[0][0][0]());
				}
				if (res2.gte(this.scaling[0][1][0]())) {
					res2 = res2
						.div(this.scaling[0][1][0]())
						.pow(this.scaling[0][1][1]())
						.mul(this.scaling[0][1][0]());
				}
			}
			if (x.eq(1)) {
				res2 = res.sub(5).clampMin(0).root(2).sub(1);
				if (res2.gte(50)) res2 = res2.div(50).max(1).log(1.04).mul(50);
				// let tier = player.hydra.mms.tier;
				// res = tier.add(1).pow(2).mul(3).add(2);
			}
			if (x.eq(2)) {
				res2 = res.sub(4).clampMin(0).div(4);
			}
			if (x.eq(3)) {
				res2 = res.sub(10).clampMin(0).div(4).root(1.25);
			}
			return res2.ceil();
		},
		levelUp(q: PowiainaNum | number) {
			const x = new PowiainaNum(q);
			if (!x.isInt()) throw new Error('Input is not integer.');
			if (x.eq(0)) {
				if (MMS.rank.levelRequirement(x).lte(player.hydra.chargedEnergy)) {
					if (player.hydra.mms.bestTetr.lt(1)) {
						player.hydra.mms.deduced = new PowiainaNum(0);
						player.hydra.mms.progress = new PowiainaNum(0);
						player.hydra.chargedEnergy = new PowiainaNum(0);
					}

					player.hydra.mms.rank = player.hydra.mms.rank.add(1);
					player.hydra.mms.bestRank = player.hydra.mms.bestRank.max(
						player.hydra.mms.rank,
					);
				}
			}
			if (x.eq(1)) {
				if (MMS.rank.levelRequirement(x).lte(player.hydra.mms.rank)) {
					player.hydra.mms.deduced = new PowiainaNum(0);
					player.hydra.mms.progress = new PowiainaNum(0);
					player.hydra.chargedEnergy = new PowiainaNum(0);
					if (player.hydra.mms.bestTetr.lt(1)) {
						if (player.hydra.mms.bestTier.gte(20))
							player.hydra.mms.rank = player.hydra.mms.rank.div(100).ceil();
						else player.hydra.mms.rank = new PowiainaNum(0);
						player.hydra.mms.rankEnergy = new PowiainaNum(0);
					}

					player.hydra.mms.tier = player.hydra.mms.tier.add(1);
					player.hydra.mms.bestTier = player.hydra.mms.bestTier.max(
						player.hydra.mms.tier,
					);
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
					player.hydra.mms.tierEnergy = new PowiainaNum(0);

					player.hydra.mms.tri = player.hydra.mms.tri.add(1);
					player.hydra.mms.bestTri = player.hydra.mms.bestTri.max(player.hydra.mms.tri);
				}
			}
			if (x.eq(3)) {
				if (MMS.rank.levelRequirement(x).lte(player.hydra.mms.tri)) {
					player.hydra.mms.deduced = new PowiainaNum(0);
					player.hydra.mms.progress = new PowiainaNum(0);
					player.hydra.chargedEnergy = new PowiainaNum(0);
					player.hydra.mms.rank = new PowiainaNum(0);
					player.hydra.mms.rankEnergy = new PowiainaNum(0);
					player.hydra.mms.tier = new PowiainaNum(0);
					player.hydra.mms.tierEnergy = new PowiainaNum(0);
					player.hydra.mms.tri = new PowiainaNum(0);

					player.hydra.mms.tetr = player.hydra.mms.tetr.add(1);
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
					if (player.hydra.mms.tier.gte(4))
						base = base.mul(MMS.rank.rankMilestones[1][3][3][0]());
					if (player.hydra.mms.tri.gte(2))
						base = base.mul(MMS.rank.rankMilestones[2][1][3][0]());
					if (player.hydra.mms.tier.gte(17))
						base = base.mul(MMS.rank.rankMilestones[1][8][3][0]());
					if (player.hydra.mms.bestTetr.gte(1)) base = base.mul(10);

					if (base.gte('1e100'))
						base = base.log10().div(100).pow(0.5).sub(1).mul(2).add(1).mul(100).pow10();

					return base;
				},
				effect(): PowiainaNum {
					let base = player.hydra.mms.rankEnergy.add(1).root(5);
					if (base.gte(10)) base = base.add(base.pow(2).sub(90)).div(2); //its a soft bottom
					if (player.hydra.mms.rank.gte(80)) base = base.pow(1.1);
					if (player.hydra.mms.rank.gte(90)) base = base.pow(1.5);
					if (player.hydra.mms.tri.gte(3)) base = base.pow(1.5);
					return base;
				},
				effectDescription(): string {
					let e = this.effect();
					return `ChHE gain ×${format(e)}`;
				},
			},
			1: {
				unlocked(): boolean {
					return player.hydra.mms.tier.gte(10);
				},
				gain(): PowiainaNum {
					if (!this.unlocked()) return new PowiainaNum(0);
					let base = new PowiainaNum(10).pow(
						player.hydra.mms.tier.max(10).log10().pow(3),
					);
					if (player.hydra.mms.tri.gte(5))
						base = base.mul(MMS.rank.rankMilestones[2][4][3][0]());
					if (player.hydra.mms.bestTetr.gte(1)) base = base.mul(10);
					return base;
				},
				effect(): PowiainaNum {
					let base = player.hydra.mms.tierEnergy.add(1).log(2).pow(2).div(1000).add(1);
					return base;
				},
				effectDescription(): string {
					let e = this.effect();
					return `ChHE gain ^${format(e)}`;
				},
			},
		},
		rankMilTags: [
			{
				id: 'perm.',
				color: 'lightgreen',
			},
			{
				id: 'unlock',
				color: 'orange',
			},
			{
				id: 'deduce',
				color: 'blue',
			},
			{
				id: 'energy',
				color: 'cyan',
			},
			{
				id: 'tier',
				color: 'lightblue',
			},
			{
				id: 'qol',
				color: 'purple',
			},
			{
				id: 'softcap',
				color: 'red',
			},
		],
		rankMilestones: {
			0: [
				[
					new PowiainaNum(1),
					() => getMessage('mms.rank.mil.0.0'),
					['deduce'],
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
				[new PowiainaNum(2), () => getMessage('mms.rank.mil.0.1'), ['energy']] as const,
				[new PowiainaNum(3), () => getMessage('mms.rank.mil.0.2'), ['deduce']] as const,
				[
					new PowiainaNum(4),
					() => getMessage('mms.rank.mil.0.3'),
					['deduce'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.rank.root(1.5).add(1);

							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[new PowiainaNum(7), () => getMessage('mms.rank.mil.0.4'), ['deduce']] as const,
				[
					new PowiainaNum(9),
					() => getMessage('mms.rank.mil.0.5'),
					['energy'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.deduced
								.mul(5)
								.add(1)
								.root(6);
							if (player.hydra.mms.tier.gte(6)) effect = effect.pow(3);
							if (player.hydra.mms.rank.gte(128)) effect = effect.pow(3);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[
					new PowiainaNum(10),
					() => getMessage('mms.rank.mil.0.6'),
					['unlock', 'energy', 'tier'],
					[
						(): PowiainaNum => {
							return MMS.rank.rankEnergies[0].gain();
						},
						(x: PowiainaNum) => `+${format(x)}/s`,
					],
				] as const,
				[new PowiainaNum(12), () => getMessage('mms.rank.mil.0.7'), ['energy']] as const,
				[
					new PowiainaNum(14),
					() => getMessage('mms.rank.mil.0.8'),
					['energy'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier.add(2).pow(2).sub(3);
							if (player.hydra.mms.rank.gte(36)) effect = effect.pow(3);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[
					new PowiainaNum(17),
					() => getMessage('mms.rank.mil.0.9'),
					['deduce'],
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
				[
					new PowiainaNum(19),
					() => getMessage('mms.rank.mil.0.10'),
					['tier', 'softcap'],
				] as const,
				[
					new PowiainaNum(25),
					() => getMessage('mms.rank.mil.0.11'),
					['energy', 'qol'],
				] as const,
				[
					new PowiainaNum(33),
					() => getMessage('mms.rank.mil.0.12'),
					['tier', 'softcap'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tri.mul(10);
							return effect;
						},
						(x: PowiainaNum) => `+${format(x)}`,
					],
				] as const,
				[new PowiainaNum(36), () => getMessage('mms.rank.mil.0.13'), ['energy']] as const,
				[
					new PowiainaNum(50),
					() => getMessage('mms.rank.mil.0.14'),
					['energy', 'tier', 'softcap'],
				] as const,
				[
					new PowiainaNum(80),
					() => getMessage('mms.rank.mil.0.15'),
					['energy', 'tier'],
				] as const,
				[
					new PowiainaNum(90),
					() => getMessage('mms.rank.mil.0.16'),
					['energy', 'tier'],
				] as const,
				[new PowiainaNum(128), () => getMessage('mms.rank.mil.0.17'), ['energy']] as const,
				[new PowiainaNum(514), () => getMessage('mms.rank.mil.0.18'), ['softcap']] as const,
			],
			1: [
				[
					new PowiainaNum(1),
					() => getMessage('mms.rank.mil.1.0'),
					['energy'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier.add(1);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[new PowiainaNum(2), () => getMessage('mms.rank.mil.1.1'), ['deduce']] as const,
				[new PowiainaNum(3), () => getMessage('mms.rank.mil.1.2'), ['deduce']] as const,
				[
					new PowiainaNum(4),
					() => getMessage('mms.rank.mil.1.3'),
					['energy', 'tier'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier.add(1).pow(1.5);
							if (player.hydra.mms.rank.gte(50)) effect = effect.pow(2);
							if (player.hydra.mms.rank.gte(80)) effect = effect.pow(2);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[
					new PowiainaNum(5),
					() => getMessage('mms.rank.mil.1.4'),
					['tier', 'softcap'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tier.mul(2);
							if (player.hydra.mms.rank.gte(50)) effect = effect.mul(2);
							return effect;
						},
						(x: PowiainaNum) => `+${format(x)}`,
					],
				] as const,
				[new PowiainaNum(6), () => getMessage('mms.rank.mil.1.5'), ['energy']] as const,
				[new PowiainaNum(7), () => getMessage('mms.rank.mil.1.6'), ['energy']] as const,
				[
					new PowiainaNum(10),
					() => getMessage('mms.rank.mil.1.7'),
					['unlock', 'energy', 'tier', 'qol'],
					[
						(): PowiainaNum => {
							return MMS.rank.rankEnergies[1].gain();
						},
						(x: PowiainaNum) => `+${format(x)}/s`,
					],
				] as const,
				[
					new PowiainaNum(17),
					() => getMessage('mms.rank.mil.1.8'),
					['energy', 'tier'],
					[
						(): PowiainaNum => {
							return player.hydra.mms.tierEnergy.add(1).pow(1.1);
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[new PowiainaNum(18), () => getMessage('mms.rank.mil.1.9'), ['softcap']] as const,
				[
					new PowiainaNum(20),
					() => getMessage('mms.rank.mil.1.10'),
					['perm.', 'qol'],
				] as const,
			] as const,
			2: [
				[
					new PowiainaNum(1),
					() => getMessage('mms.rank.mil.2.0'),
					['deduce'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.rank.add(1).pow(2.5);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[
					new PowiainaNum(2),
					() => getMessage('mms.rank.mil.2.1'),
					['energy', 'tier'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.rank
								.add(1)
								.pow(player.hydra.mms.tri.add(0.75));
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[
					new PowiainaNum(3),
					() => getMessage('mms.rank.mil.2.2'),
					['energy', 'tier', 'qol'],
				] as const,
				[
					new PowiainaNum(4),
					() => getMessage('mms.rank.mil.2.3'),
					['energy', 'softcap', 'tier'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tierEnergy
								.clampMin(10)
								.log10()
								.div(5)
								.clampMin(1)
								.recip();
							return effect.clampMin(0.0000001);
						},
						(x: PowiainaNum) => `^${format(x)}`,
					],
				] as const,
				[
					new PowiainaNum(5),
					() => getMessage('mms.rank.mil.2.4'),
					['energy', 'tier'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tri.pow(1.5).max(1);
							return effect;
						},
						(x: PowiainaNum) => `×${format(x)}`,
					],
				] as const,
				[
					new PowiainaNum(6),
					() => getMessage('mms.rank.mil.2.5'),
					['deduce', 'energy', 'softcap'],
					[
						() => {
							let effect: PowiainaNum = player.hydra.mms.tierEnergy
								.max(1e6)
								.log(1e6)
								.recip();
							return effect;
						},
						(x: PowiainaNum) => `^${format(x)}`,
					],
				] as const,
			] as const,
			3: [
				[
					new PowiainaNum(1),
					() => getMessage('mms.rank.mil.3.0'),
					['qol', 'perm.'],
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

		// 普通超-阶层
		/**
		 * @param tetr2 当前的四重阶层数量
		 * @returns 目前最高的超阶层重数
		 */
		getCurrentTierFromTetr(tetr2?: PowiainaNum) {
			const tetr: PowiainaNum = tetr2 ?? player.hydra.mms.tetr;
			if (tetr.eq(0)) return new PowiainaNum(3);
			let x = tetr.log10().max(0).pow(0.8).add(1);
			if (x.gte(10)) x = x.div(10).root(1.6).mul(10);
			return x.add(2).floor();
		},
		/**
		 * @param tier2 超阶层重数
		 * @param tetr2 当前的四重阶层数量
		 * @returns 当前超阶层重的等级
		 */
		getRankFromTetr(tier2?: PowiainaNum, tetr2?: PowiainaNum) {
			const tier: PowiainaNum = tier2 ?? MMS.rank.getCurrentTierFromTetr();
			const tetr: PowiainaNum = tetr2 ?? player.hydra.mms.tetr;
			let x = tier.sub(2);
			if (x.gte(10)) x = x.mul(10).pow(1.6).div(10);
			let hp = new PowiainaNum(10).pow(x.sub(1).root(0.8)).ceil();
			return tetr.div(hp).floor();
		},
		/**
		 * @param tier2 超阶层重数
		 * @param current2 当前的四重阶层数量
		 * @param tierDifference2 1个十重阶层需要x个`tierDifference2-2`重阶层
		 * @returns 当前超阶层重的需求
		 */
		getBeyondRankRequirement(
			tier2?: PowiainaNum,
			current2?: PowiainaNum,
			tierDifference2?: number,
		) {
			const tier: PowiainaNum = tier2 ?? MMS.rank.getCurrentTierFromTetr();
			const current: PowiainaNum = current2 ?? MMS.rank.getRankFromTetr(tier);
			const tierDifference: number = tierDifference2 ?? 1;
			let x = tier.sub(2);
			let p = tier.sub(2 + tierDifference);
			if (x.gte(10)) x = x.add(1).mul(10).pow(1.6).div(10).sub(1);
			if (p.gte(10)) p = p.add(1).mul(10).pow(1.6).div(10).sub(1);
			return new PowiainaNum(10)
				.pow(x.root(0.8).sub(p.root(0.8)))
				.mul(current.add(1))
				.ceil();
		},
	} as const,
} as const;

window.MMS = MMS;
