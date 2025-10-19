import type Decimal from 'break_eternity.js';

export function unwrapDecimalValue(x: Decimal | (() => Decimal)): Decimal {
	if (typeof x == 'function') {
		return x();
	}

	return x;
}
