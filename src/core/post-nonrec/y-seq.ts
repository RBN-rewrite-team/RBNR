import Decimal from 'break_eternity.js';
import { upgrades } from '@/core/mechanic.ts';
import { player } from '../save';

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

		let excess = player.postnonrec.yseq.dimensions[0][id].sub(this.purchasesBeforeScaling(id));
		if (excess.gt(0)) {
			base = base.mul(this.LogScalingRatio().mul(excess).mul(excess.add(1)).mul(0.5).pow10());
		}
		return base;
	},
	scalingStart() {
		return new Decimal(2 ** 384);
	},
	LogScalingRatio() {
		let base = new Decimal(1.15).log10();
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

		let logPriceRatio = this.priceRatio()[id].log10();
		let logStartPrice = this.startPrice()[id].log10();
		let logScalingRatio = this.LogScalingRatio();

		if (boughtcount.gte(purchasesBeforeScaling)) {
			let discrim = logPriceRatio
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

		let logPrice: Decimal;
		if (boughtcount.lte(purchasesBeforeScaling.add(1)))
			logPrice = boughtcount.sub(1).mul(logPriceRatio).add(logStartPrice);
		else {
			const pExcess = boughtcount.sub(purchasesBeforeScaling);
			logPrice = boughtcount
				.sub(1)
				.mul(logPriceRatio)
				.add(logStartPrice)
				.add(logScalingRatio.mul(pExcess).mul(pExcess.sub(1)).mul(0.5));
		}

		player.hydra.compressedPower = player.hydra.compressedPower.sub(logPrice.pow10());

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
		const mul = [0.05, 0.1, 0.2, 0.4];
		let boost = new Decimal(1);
		let base = new Decimal(1);
		if (player.upgrades[622]) base = upgrades[622].effect();
		if (player.upgrades[6210]) base = base.mul(1 + id * 0.05);
		boost = boost.mul(player.postnonrec.yseq.dimensions[0][id].pow_base(base));
		let res = player.postnonrec.yseq.dimensions[0][id]
			.add(player.postnonrec.yseq.dimensions[1][id].floor())
			.mul(mul?.[id] ?? 0.05)
			.mul(boost);
		if (player.upgrades[625]) {
			res = res.mul(3);
		}
		return res;
	},
	yseqDeduceSpeed() {
		let base = this.dimensionEffect(0);
		return base;
	},
	resetGain() {
		let base = player.hydra.deduceOrdinal[1];
		if (player.upgrades[621]) base = base.mul(upgrades[621].effect());
		return base;
	},
	reset() {
		if (this.resetGain().lt(1)) return;
		let gain = this.resetGain();
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
			let gain = this.resetGain();
			player.hydra.compressedPower = player.hydra.compressedPower.add(gain.mul(diff));
			player.hydra.totalCompressedPower = player.hydra.totalCompressedPower.add(
				gain.mul(diff),
			);
		}
	},
	u627effect(): Decimal {
		return player.hydra.deduceOrdinal[1].clampMin(1).log10().div(2);
	},
} as const;
