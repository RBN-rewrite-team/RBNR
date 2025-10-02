import Decimal from 'break_eternity.js';
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
				],
				[new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)] as [
					Decimal,
					Decimal,
					Decimal,
					Decimal,
				],
				[0, 0, 0, 0] as [number, number, number, number],
			] as const,
		} as const;
	},
	startPrice() {
		return [new Decimal(10), new Decimal('1f400'), new Decimal('1f400'), new Decimal('1f400')];
	},
	priceRatio() {
		return [new Decimal(10), new Decimal('1f400'), new Decimal('1f400'), new Decimal('1f400')];
	},
	dimensionsCost(id: 0 | 1 | 2 | 3) {
		if (id == 0 && player.postnonrec.yseq.dimensions[0][0].lt(1)) return new Decimal(1);
		return this.priceRatio()
			[id].pow(player.postnonrec.yseq.dimensions[0][id])
			.mul(this.startPrice()[id]);
	},
	dimensionInterval(id: 0 | 1 | 2 | 3) {
		return new Decimal(1 / 0);
	},
	buyDimensions(id: 0 | 1 | 2 | 3) {
		let boughtcount = player.hydra.compressedPower
			.div(this.startPrice()[id])
			.log(this.priceRatio()[id])
			.floor();
		if (id == 0 && player.postnonrec.yseq.dimensions[0][0].lt(1)) boughtcount = new Decimal(1);

		player.postnonrec.yseq.dimensions[0][id] =
			player.postnonrec.yseq.dimensions[0][id].max(boughtcount);
	},
	dimensionEffect(id: 0 | 1 | 2 | 3) {
		if (id == 0) return player.postnonrec.yseq.dimensions[0][id].mul(0.05);
		return new Decimal(0);
	},
	yseqDeduceSpeed() {
		return this.dimensionEffect(0);
	},
} as const;
