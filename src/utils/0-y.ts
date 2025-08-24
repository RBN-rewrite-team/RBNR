import Decimal from 'break_eternity.js';

type ZeroYSeq = number[];

/**
 * 底数为4的0-Y
 */
export function numberTo0Y(
	x: Decimal,
	base = new Decimal(4),
	maxLength = 20,
	otherwise = {
		basic: 0,
	},
): ZeroYSeq {
	//数值转0-Y
	if (maxLength <= 0) return [];

	if (x.lt(1)) return [];
	else if (x.lt(base))
		return [otherwise.basic + 1].concat(numberTo0Y(x.sub(1), base, --maxLength, otherwise));
	else if (x.lt(base.pow(2))) {
		const s = [otherwise.basic + 1];
		--maxLength;
		otherwise.basic++;
		return s.concat(numberTo0Y(x.sub(base).add(1), base, --maxLength, otherwise));
	} else return [1, Infinity];
}

declare global {
	interface Window {
		numberTo0Y: typeof numberTo0Y;
	}
}
window.numberTo0Y = numberTo0Y;
