import { displayOrd } from '@/lib/ordinal';
import type Decimal from 'break_eternity.js';

export function ordinalToPrSS(ord: Decimal, base: Decimal, ascend = 0, depth = 0): string {
	if (ord.isNan()) return '(?)';
	if (depth > 50) return '...';
	if (ord.eq(0)) return '';
	if (ord.gte(base.tetrate(base.toNumber()))) return displayOrd(ord, base, 0, 0, 0, 0, 1);
	const exponent = ord.log(base).floor();
	const mul = ord.div(base.pow(exponent)).floor();

	const rest = ord.sub(mul.mul(base.pow(exponent))).floor();
	if (exponent.lt(1)) {
		return `(${ascend})`.repeat(mul.clampMax(50).toNumber());
	} else {
		return `${`(${ascend})${ordinalToPrSS(exponent, base, ascend + 1, depth + 1)}`.repeat(mul.clampMax(50).toNumber())}${ordinalToPrSS(rest, base, ascend, depth + 1)}`;
	}
}
