import Decimal from 'break_eternity.js';
import { upgrades } from '@/core/mechanic.ts';
import { player } from '../save';
import { Analysis } from '@/core/pt/index.ts';
import { Oracle } from '@/core/pt/oracle/oracle.ts';
import { NON_REC_BMS } from '../nonrecu/nonrec-bms';
import { Garden } from '@/core/pt/garden.ts';
import { ltEffect } from '../ordinal/well_ordering';
import { DC } from '../constants';

export const Y_SEQ = {
	playerData() {
		return {
			dimensions: [
				[new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)] as [
					Decimal,
					Decimal,
					Decimal,
					Decimal,
				], // amount
				[new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)] as [
					Decimal,
					Decimal,
					Decimal,
					Decimal,
				], // bought
				[0, 0, 0, 0] as [number, number, number, number],
			] as const,
		} as const;
	},
	startPrice() {
		return [new Decimal(1), new Decimal(100), new Decimal(10000), new Decimal(1000000)];
	},
	priceRatio() {
		let priceRatio = [
			new Decimal(10 ** (1 / 3)),
			new Decimal(10 ** (1 / 2)),
			new Decimal(10),
			new Decimal(100),
		];
		if (player.upgrades[626]) {
			priceRatio = priceRatio.map((x) => x.pow(0.5));
		}
		return priceRatio;
	},
	dimensionsCost(id: 0 | 1 | 2 | 3) {
		if (id == 0 && player.postnonrec.yseq.dimensions[0][0].lt(1)) return new Decimal(0);
		let base = this.priceRatio()
			[id].pow(player.postnonrec.yseq.dimensions[0][id])
			.mul(this.startPrice()[id]);

		const excess = player.postnonrec.yseq.dimensions[0][id].sub(
			this.purchasesBeforeScaling(id),
		);
		if (excess.gt(0)) {
			base = base.mul(this.LogScalingRatio().mul(excess).mul(excess.add(1)).mul(0.5).pow10());
		}
		return base;
	},
	scalingStart() {
		return new Decimal(2 ** 384);
	},
	LogScalingRatio() {
		const base = new Decimal(1.15).log10();
		return base;
	},
	buyDimensions(id: 0 | 1 | 2 | 3): void {
		if (player.hydra.compressedPower.lt(this.dimensionsCost(id))) return;
		let boughtcount = player.hydra.compressedPower
			.max(1)
			.div(this.startPrice()[id])
			.log(this.priceRatio()[id])
			.add(1);
		if (id == 0 && player.postnonrec.yseq.dimensions[0][0].lt(1))
			boughtcount = boughtcount.max(1);

		const purchasesBeforeScaling = this.purchasesBeforeScaling(id);

		const logPriceRatio = this.priceRatio()[id].log10();
		const logStartPrice = this.startPrice()[id].log10();
		const logScalingRatio = this.LogScalingRatio();

		if (boughtcount.gte(purchasesBeforeScaling)) {
			const discrim = logPriceRatio
				.mul(2)
				.add(logScalingRatio)
				.pow(2)
				.sub(
					logScalingRatio
						.mul(purchasesBeforeScaling.mul(logPriceRatio).add(logStartPrice))
						.mul(8),
				)
				.add(player.hydra.compressedPower.log10().mul(logScalingRatio).mul(8));
			if (discrim.lt(0)) boughtcount = new Decimal(0);
			else
				boughtcount = purchasesBeforeScaling
					.add(0.5)
					.sub(logPriceRatio.div(logScalingRatio))
					.add(discrim.sqrt().div(logScalingRatio.mul(2)));
		}

		boughtcount = boughtcount.floor();

		if (boughtcount.lt(player.postnonrec.yseq.dimensions[0][id])) return;

		// let logPrice: Decimal;
		// if (boughtcount.lte(purchasesBeforeScaling.add(1)))
		// 	logPrice = boughtcount.sub(1).mul(logPriceRatio).add(logStartPrice);
		// else {
		// 	const pExcess = boughtcount.sub(purchasesBeforeScaling);
		// 	logPrice = boughtcount
		// 		.sub(1)
		// 		.mul(logPriceRatio)
		// 		.add(logStartPrice)
		// 		.add(logScalingRatio.mul(pExcess).mul(pExcess.sub(1)).mul(0.5));
		// }

		// player.hydra.compressedPower = player.hydra.compressedPower
		// 	.sub(logPrice.pow10())
		// 	.clampMin(0);

		player.postnonrec.yseq.dimensions[0][id] =
			player.postnonrec.yseq.dimensions[0][id].max(boughtcount);
	},
	purchasesBeforeScaling(id: 0 | 1 | 2 | 3) {
		return this.scalingStart()
			.max(1)
			.div(this.startPrice()[id])
			.log(this.priceRatio()[id])
			.floor()
			.add(1);
	},
	dimensionEffect(id: 0 | 1 | 2 | 3) {
		const boost = this.dimensionBoost(id);
		const res = player.postnonrec.yseq.dimensions[0][id]
			.add(player.postnonrec.yseq.dimensions[1][id].floor())
			.mul(boost);
		return res;
	},
	dimensionBoost(id: 0 | 1 | 2 | 3) {
		const mul = [0.05, 0.1, 0.2, 0.4];
		if (player.retribution >= 2) {
			mul[0] = 0.5;
			mul[1] = 1;
			mul[2] = 2;
			mul[3] = 3;
		}
		let boost = new Decimal(mul?.[id] ?? 0.05);
		let base = new Decimal(1);
		if (player.upgrades[622]) base = upgrades[622].effect();
		if (player.upgrades[6210]) base = base.mul(1 + id * 0.05);
		boost = boost.mul(player.postnonrec.yseq.dimensions[0][id].pow_base(base));
		if (player.upgrades[625]) {
			boost = boost.mul(3);
		}
		boost = boost.mul(Analysis.systemEffect[5].value(player.pt.analysis[5]));
		if (boost.gte(1)) boost = boost.pow(Analysis.systemEffect[6].value(player.pt.analysis[6]));
		return boost;
	},
	yseqDeduceSpeed() {
		const base = this.dimensionEffect(0);
		return base.clampMax(DC.D_F2P128);
	},
	resetGain() {
		let base = player.hydra.deduceOrdinal[1];
		if (player.upgrades[621]) base = base.mul(upgrades[621].effect());
		if (player.upgrades['621R']) base = base.mul(player.numbertheory.GM.x.clampMin(1));
		if (!player.nonrecu.studies_bought.includes(29)) base = base.clampMax('e1e10');
		base = base.slog(10).add(Oracle.getFateTotalEffect(1));
		if (Garden.boughtUpgrade(86))
			base = base.add(player.garden.totalInspiration.add(1).log10().root(2).div(2).min(10));
		if (player.upgrades[811]) base = base.add(upgrades[811].effect());
		if (base.gte(4.305916097091442) && player.pt.power.lt(1)) {
			base = base.sub(4.305916097091442).div(2).add(4.305916097091442);
		}

		if (base.gte(6)) {
			base = base.sub(6).div(4).add(6);
		}
		if (base.gte(15)) {
			let exp = player.pt.power.gte('e1.5e11') ? 0.375 : 0.25;
			base = base.sub(14).pow(exp).add(14);
		}
		let sc3start = 1000;
		if (player.milestones['sin_3']) {
			sc3start += player.pt.power.add(10).log10().log10().sub(11).max(0).mul(75).toNumber();
			if (player.pt.power.gte('e3e12'))
				sc3start += player.pt.power
					.add(10)
					.log10()
					.div(3)
					.log10()
					.sub(12)
					.max(0)
					.mul(100)
					.toNumber();
			if (player.pt.power.gte('ee13'))
				sc3start += player.pt.power
					.add(10)
					.log10()
					.log10()
					.sub(13)
					.max(0)
					.mul(50)
					.toNumber();
			if (player.pt.power.gte('e1.5e13'))
				sc3start += player.pt.power
					.add(10)
					.log10()
					.div(1.5)
					.log10()
					.sub(13)
					.max(0)
					.mul(75)
					.toNumber();
			if (player.pt.power.gte('e2e13'))
				sc3start += player.pt.power
					.add(10)
					.log10()
					.div(2)
					.log10()
					.sub(13)
					.max(0)
					.mul(125)
					.toNumber();
			if (player.pt.power.gte('e6.66e14'))
				sc3start += player.pt.power
					.add(10)
					.log10()
					.div(6.66)
					.log10()
					.sub(14)
					.max(0)
					.mul(300)
					.toNumber();
			if (player.pt.power.gte('e2.5e17'))
				sc3start += player.pt.power
					.add(10)
					.log10()
					.div(2.5)
					.log10()
					.sub(17)
					.max(0)
					.mul(1000)
					.toNumber();
		}
		if (base.gte(sc3start)) {
			base = base
				.div(sc3start / 10)
				.log10()
				.pow(0.25)
				.mul(sc3start);
		}
		if (player.pt.nonrecBMS.deduce.gte(1) && NON_REC_BMS.effects()[0].gt(0)) {
			base = base.add(NON_REC_BMS.effects()[0]);
		}
		if (player.milestones['sin_6'])
			base = base.add(
				player.oracle.originalsin.karma
					.div(100)
					.min(player.oracle.originalsin.karma.root(4).mul(100)),
			);
		if (player.milestones['sin_10']) {
			const g = ltEffect()[0];
			base = base.add(g.clampMin(0));
		}
		if (base.gte(1e15)) {
			let exp = 0.275;
			base = base.div(1e15).pow(exp).mul(1e15);
		}
		base = Decimal.tetrate(10, base.toNumber());
		return base.clampMax('f1.79e308');
	},
	reset() {
		if (this.resetGain().lt(1)) return;
		const gain = this.resetGain();
		player.hydra.compressedPower = player.hydra.compressedPower.add(gain);
		player.hydra.totalCompressedPower = player.hydra.totalCompressedPower.add(gain);
		player.hydra.deduceOrdinal[1] = new Decimal(0);
		player.hydra.deduceProgress[1] = new Decimal(0);
		for (let i = 0; i < 2; i++)
			for (let j = 0; j < 4; j++) player.postnonrec.yseq.dimensions[i][j] = new Decimal(0);
	},
	update(diff: number) {
		for (let i = 0; i < 3; i++) {
			player.postnonrec.yseq.dimensions[1][i] = player.postnonrec.yseq.dimensions[1][i].add(
				Y_SEQ.dimensionEffect((i + 1) as 0 | 1 | 2 | 3).mul(diff),
			);
		}
		if (player.upgrades['6215']) {
			Y_SEQ.buyDimensions(0);
			Y_SEQ.buyDimensions(1);
			Y_SEQ.buyDimensions(2);
			Y_SEQ.buyDimensions(3);
		}
		if (player.upgrades[624]) {
			player.postnonrec.yseq.dimensions[0][0] =
				player.postnonrec.yseq.dimensions[0][0].clampMin(1);
		}
		if (player.upgrades[627]) {
			player.postnonrec.yseq.dimensions[1][3] = player.postnonrec.yseq.dimensions[1][3].add(
				this.u627effect().mul(diff),
			);
		}
		if (player.upgrades[629]) {
			const gain = this.resetGain();
			player.hydra.compressedPower = player.hydra.compressedPower.add(gain.mul(diff));
			player.hydra.totalCompressedPower = player.hydra.totalCompressedPower.add(
				gain.mul(diff),
			);
		}
		if (player.upgrades['7c7q'] && player.hydra.deduceOrdinal[0].gte('eee9')) {
			player.challenges[1][6] = new Decimal(1);
		}
	},
	u627effect(): Decimal {
		let base = player.hydra.deduceOrdinal[1].clampMin(1).log10().div(2);
		if (player.upgrades[6211]) base = base.pow(3);
		return base;
	},
} as const;
