import { player } from '@/core/global';
import Decimal from 'break_eternity.js';
import { Garden } from '../garden';
import { Oracle } from './oracle';
import { MILESTONES } from '@/core/mechanic';
export function initSINMiletones() {
	MILESTONES.create('sin_1', {
		requirement: new Decimal(1000),
		currency: 'karma',
		displayName: 'M-SIN-1',
		show: true,
		get canDone() {
			return player.oracle.originalsin.karma.gte(10000);
		},
	});
}
export const SIN = {
	playerData() {
		return {
			karma: new Decimal(0),
		};
	},
	getSinValue() {
		return player.oracle.totalBits
			.div(5)
			.sub(5)
			.clampMin(0)
			.pow(0.5)
			.mul(Garden.level().div(2).sub(7.5).clampMin(0).pow(3))
			.mul(player.pt.power.log10().pow(0.5).add(Math.E).ln());
	},
	isUnlocked() {
		return (
			Oracle.isUnlocked() &&
			(player.hydra.totalCompressedPower.gte('1f1022') ||
				player.oracle.originalsin.karma.gte(1))
		);
	},
	loop(diff: number) {
		player.oracle.originalsin.karma = player.oracle.originalsin.karma.add(
			this.getSinValue().mul(diff * 2),
		);
	},
} as const;
