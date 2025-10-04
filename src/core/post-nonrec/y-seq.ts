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
		return [
			new Decimal(10 ** (1 / 3)),
			new Decimal(10 ** (1 / 2)),
			new Decimal(10),
			new Decimal(100),
		];
	},
	dimensionsCost(id: 0 | 1 | 2 | 3) {
		if (id == 0 && player.postnonrec.yseq.dimensions[0][0].lt(1)) return new Decimal(0);
		return this.priceRatio()
			[id].pow(player.postnonrec.yseq.dimensions[0][id])
			.mul(this.startPrice()[id]);
	},
	buyDimensions(id: 0 | 1 | 2 | 3) {
		if (player.hydra.compressedPower.lt(this.dimensionsCost(id))) return;
		let boughtcount = player.hydra.compressedPower.max(1)
			.div(this.startPrice()[id])
			.log(this.priceRatio()[id])
			.floor()
			.add(1);
		if (id == 0 && player.postnonrec.yseq.dimensions[0][0].lt(1))
			boughtcount = boughtcount.max(1);
		console.log(boughtcount)

		player.postnonrec.yseq.dimensions[0][id] =
			player.postnonrec.yseq.dimensions[0][id].max(boughtcount);
	},
	dimensionEffect(id: 0 | 1 | 2 | 3) {
	  const mul = [0.05, 0.1, 0.2, 0.4]
	  let boost = new Decimal(1)
	  if (player.upgrades[622]) boost = boost.mul(player.postnonrec.yseq.dimensions[0][id].pow_base(upgrades[622].effect()))
		return player.postnonrec.yseq.dimensions[0][id]
				.add(player.postnonrec.yseq.dimensions[1][id].floor())
				.mul(mul?.[id]??0.05).mul(boost);
	},
	yseqDeduceSpeed() {
		return this.dimensionEffect(0);
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
} as const;
