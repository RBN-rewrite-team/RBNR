import Decimal from 'break_eternity.js';

/**
 * Generate random X from a number
 * @param x
 *
 * @returns
 */
export function predictableRandom(x: number) {
	let start = Math.pow(x % 97, 4.3) * 232344573;
	const a = 15485863;
	const b = 521791;
	start = (start * a) % b;
	for (let i = 0; i < ((x * x) % 90) + 90; i++) {
		start = (start * a) % b;
	}
	return start / b;
}

export function DecimalsMin(...args: Decimal[]) {
	if (args.length == 0) {
		return Decimal.dInf;
	} else if (args.length == 1) {
		return args[0];
	} else if (args.length == 2) {
		return Decimal.min(args[0], args[1]);
	} else {
		return DecimalsMin(Decimal.min(args[0], args[1]), ...args.slice(2));
	}
}

export function range(a: bigint, b: bigint) {
	return new Array(Number(b - a)).fill(0).map((v, i) => BigInt(i) + a);
}
