import PowiainaNum, { type PowiainaNumSource } from 'powiaina_num.js';
import { myPolarize } from './xey-array';
export interface FormatOptions {
	reciprocate_format: boolean;
	UCF: boolean;
	engineering: boolean;
}
const defaultXEYOptions = {
	reciprocate_format: false,
	UCF: false,
	engineering: false,
} as const;
function parseMEtoEnginnering(m: number, e: number) {
	if (e % 3 !== 0) {
		let rest = Math.floor(e % 3);
		let m2 = m * 10 ** rest;
		let e2 = e - rest;
		return [m2, e2];
	}
	return [m, e];
}
function parseMEtoEnginnering2(m: PowiainaNum, e: PowiainaNum) {
	if (e.mod(3).neq(0)) {
		let rest = e.mod(3).round().floor();
		let m2 = m.mul(rest.pow10());
		let e2 = e.sub(rest);
		return [m2, e2];
	}
	return [m, e];
}
const formatXEY = (
	value: PowiainaNum,
	precision: number = 4,
	options: FormatOptions = defaultXEYOptions,
): string => {
	if (value.isNaN()) return `NaN`;
	else if (value.eq(0)) return (0).toFixed(precision);
	else if (value.isneg()) return `-${formatXEY(value.neg(), precision, options)}`;
	else if (value.isInfi()) return `Infinity`;
	else if (value.lt(10 ** -precision)) {
		if (value.gt('/ee9')) {
			const exp = value.log10();
			const mant = value.div(exp.pow10());
			let exp2 = exp;
			let mant2 = mant;
			if (options.engineering) {
				[mant2, exp2] = parseMEtoEnginnering2(mant2, exp2);
			}
			const display = `${mant2.toNumber().toFixed(precision)}e${formatWholeXEY(exp2)}`;
			return display;
		} else if (value.gt('/eeee9')) {
			return formatXEY(value.rec(), precision, {
				reciprocate_format: true,
				UCF: options.UCF,
				engineering: options.engineering,
			});
		} else {
			return `1/${formatXEY(value.rec(), precision, {
				reciprocate_format: false,
				UCF: options.UCF,
				engineering: options.engineering,
			})}`;
		}
	} else if (value.lt(1000)) {
		return value.toNumber().toFixed(precision);
	} else if (value.lt('eeee9')) {
		const elayers = value
			.slog()
			.sub(1 + 1 / 1.0479516371446924)
			.floor()
			.max(0)
			.toNumber();
		const restval = value.iteratedlog(elayers);
		let append = '';
		if (restval.gte(1000)) {
			const exp = restval.log10().floor();
			const mant = restval.div(exp.pow10());
			let exp2 = exp;
			let mant2 = mant;
			if (options.engineering) {
				[mant2, exp2] = parseMEtoEnginnering2(mant2, exp2);
			}
			append = `${mant2.toNumber().toFixed(precision)}e${formatWholeXEY(exp2)}`;
		} else {
			append = restval.toNumber().toString();
		}
		// console.log(elayers)
		return (
			'e'.repeat(elayers) + (options.reciprocate_format && elayers >= 1 ? '-' : '') + append
		);
	} else if (value.lt('(10^)^999998 10000000000')) {
		const pol = myPolarize(value.arr01);
		return `${pol.bottom.toFixed(precision)}F${formatWholeXEY(pol.repeation)}`;
	} else if (value.lt('10^^10^^10^^10^^9')) {
		const repeat = value.getOperator(2);
		if (repeat > 0) {
			const num2 = value.clone();
			num2.setOperator(0, 2);
			num2.normalize();
			return `F`.repeat(repeat) + formatXEY(num2, precision, options);
		}
		return `F${formatWholeXEY(value.getOperator(1) + 2)}`;
	} else if (value.lt('(10^^)^999998 (10^)^8 10000000000')) {
		const pol = myPolarize(value.arr01);
		return `${pol.bottom.toFixed(precision)}G${formatWholeXEY(pol.repeation)}`;
	} else if (value.lt('10^^^10^^^10^^^10^^^9')) {
		const repeat = value.getOperator(3);
		if (repeat > 0) {
			const num2 = value.clone();
			num2.setOperator(0, 3);
			num2.normalize();
			return `G`.repeat(repeat) + formatXEY(num2, precision, options);
		}
		return `G${formatWholeXEY(value.getOperator(2) + 2)}`;
	} else if (value.lt('(10^^^)^999998 (10^^)^8 (10^)^8 10000000000')) {
		const pol = myPolarize(value.arr01);
		return `${pol.bottom.toFixed(precision)}H${formatWholeXEY(pol.repeation)}`;
	} else if (value.lt('10^^^^10^^^^10^^^^10^^^^10')) {
		const repeat = value.getOperator(4);
		if (repeat > 0) {
			const num2 = value.clone();
			num2.setOperator(0, 4);
			num2.normalize();
			return `H`.repeat(repeat) + formatXEY(num2, precision, options);
		}
		return `H${formatWholeXEY(value.getOperator(3) + 2)}`;
	} else {
		return value.toString();
	}
};

export default formatXEY;

export const formatWholeXEY = (num2: PowiainaNumSource): string => {
	const num = new PowiainaNum(num2).floor();
	if (num.gte(1e3)) return formatXEY(num, 4);
	return formatXEY(num, 0);
};
