import { feature, player } from '../global.ts';
import { Ordinal } from '@/lib/ordinal/';

export const ordinalNormal = [
	['w', 0],
	['w+1', 1],
	['w+2', 2],
	['w+3', 3],
	['w*2', 2],
	['w*2+1', 2],
	['w*3', 3],
	['w*4', 4],
	['w^2', 2],
	['w^2+w', 2],
	['w^2+w*2', 2],
	['w^2*2', 2],
	['w^2*3', 3],
	['w^3', 3],
	['w^3*2', 3],
	['w^4', 4],
	['w^5', 5],
	['w^(w)', 2],
	['w^(w+1)', 2],
	['w^(w+2)', 2],
	['w^(w+3)', 3],
	['w^(w*2)', 2],
	['w^(w*2+1)', 2],
	['w^(w*2+2)', 2],
	['w^(w*3)', 3],
	['w^(w*3+1)', 3],
	['w^(w*4)', 4],
	['w^(w^2)', 2],
	['w^(w^2+w)', 2],
	['w^(w^2+w*2)', 2],
	['w^(w^2*2)', 2],
	['w^(w^2*3)', 3],
	['w^(w^3)', 3],
	['w^(w^3*2)', 3],
	['w^(w^3*3)', 3],
	['w^(w^w)', 3],
];

export function getOrdinalLevel(): number {
	let level = 0;
	let base = feature.Ordinal.base().toNumber();
	for (let i in ordinalNormal) {
		if (
			base > ordinalNormal[i][1] || new Ordinal(ordinalNormal[i][0])
				.toDecimal(base)
				.lte(player.ordinal.number)
		)
		level++
	}
	return level;
}
