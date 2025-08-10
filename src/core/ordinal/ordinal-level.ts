import { feature, player } from '../global.ts';
import { Ordinal } from '@/lib/ordinal/';

export const ordinalNormal = [
	'w',
	'w*2',
	'w*3',
	'w^2',
	'w^3',
	'w^4',
	'w^(w)',
	'w^(w+1)',
	'w^(w+2)',
	'w^(w+3)',
	'w^(w*2)',
	'w^(w*3)',
	'w^(w*4)',
	'w^(w^2)',
	'w^(w^2*2)',
	'w^(w^2*3)',
	'w^(w^3)',
	'w^(w^3*2)',
	'w^(w^4)',
	'w^(w^w)',
];

export function getOrdinalLevel(): number {
	let level = 0;
	for (let i in ordinalNormal) {
		if (
			new Ordinal(ordinalNormal[i])
				.toDecimal(feature.Ordinal.base().toNumber())
				.lte(player.ordinal.number)
		)
			level++;
	}
	return level;
}
