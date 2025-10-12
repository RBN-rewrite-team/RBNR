import { displayOrd } from '@/lib/ordinal';
import type Decimal from 'break_eternity.js';

export function ordinalToLPrSS(ord: Decimal, base: Decimal, ascend = 0, depth = 0): string {
	if (ord.isNan()) return '(?)';
	if (depth > 50) return '...';
	if (ord.eq(0)) return '';
	if (!ord.isFinite()) return '(0)(ω)';
	const exponent = ord.log(base).floor();
	const mul = ord.div(base.pow(exponent)).floor();

	const rest = ord.sub(mul.mul(base.pow(exponent))).floor();
	if (exponent.lt(1)) {
		return `(${ascend})`.repeat(mul.clampMax(50).toNumber());
	} else if (ord.lt(base.tetrate(base.toNumber()))) {
		return `${`(${ascend})${ordinalToLPrSS(exponent, base, ascend + 1, depth + 1)}`.repeat(mul.clampMax(50).toNumber())}${ordinalToLPrSS(rest, base, ascend, depth + 1)}`;
	} else if (
		ord.lt(base.tetrate(base.toNumber() + (base.toNumber() - 1) * (base.toNumber() - 1)))
	) {
		const base13 = ord.slog(base);
		const q = base13.sub(base).div(base.sub(1)).floor();
		const t = base.tetrate(base.sub(1).mul(q).add(base).toNumber());
		const pseudoexp = ord.div(t).log(base).floor();
		return `(${ascend})${`(${ascend + 2})`.repeat(q.toNumber() + 1)}${ordinalToLPrSS(pseudoexp, base, ascend + 1, depth + 1)}`;
	} else {
		const q = ord.slog(base);
		return `(${ascend})${ordinalToLPrSS(q.sub(4).div(base.sub(1)).add(1), base, ascend + 2, depth + 1)}`;
	}
}
