/*
MIT License

Copyright (c) 2025 VeryrrDefine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/

import PowiainaNum from 'powiaina_num.js';
import Decimal from 'break_eternity.js';

const PN_F179E308 = new PowiainaNum({
	array: [
		{
			repeat: 308.25471555991675,
			arrow: 0,
			expans: 1,
			megota: 1,
		},
		{
			repeat: 1,
			arrow: 1,
			expans: 1,
			megota: 1,
		},
		{
			repeat: 1,
			arrow: 2,
			expans: 1,
			megota: 1,
		},
	],
	small: false,
	sign: 1,
	layer: 0,
});
function convertBEDecimalToPn(x: Decimal): PowiainaNum {
	if (x.lt(0)) return convertBEDecimalToPn(x.neg()).neg();
	else if (x.eq(Decimal.dZero)) return PowiainaNum.ZERO.clone();
	else if (Decimal.isNaN(x)) return PowiainaNum.NaN.clone();
	else if (x.gt(0) && x.lt(1)) {
		const a = x.recip();
		return convertBEDecimalToPn(a).rec();
	} else if (!x.isFinite()) return PowiainaNum.POSITIVE_INFINITY.clone();
	const y = x.mag;
	const z = x.layer;
	// (e)^z y
	// [y, [1, z, 1, 1]]
	// BE Decimal:
	const res = new PowiainaNum(1e16);
	res.array[1].repeat = z;
	res.array[0].repeat = y;
	if (res.array[1].repeat > Number.MAX_SAFE_INTEGER) {
		res.array[0].repeat = res.array[1].repeat;
		res.array[1].arrow = 2;
		res.array[1].repeat = 1;
	}
	res.normalize();
	return res;
}
function convertPNToBEDecimal(x: PowiainaNum): Decimal {
	if (x.lt(0)) return convertPNToBEDecimal(x.mul(-1)).neg();
	else if (x.eq(PowiainaNum.ZERO)) return Decimal.dZero;
	else if (x.isNaN()) return Decimal.dNaN;
	else if (!isFinite(x.getOperator(0, 1, 1))) return Decimal.dInf;
	else if (x.gt(PN_F179E308)) return Decimal.dInf;
	else if (x.gt(0) && x.lt(1)) {
		const a = x.rec();
		return convertPNToBEDecimal(a).recip();
	} else if (x.lt(Number.MAX_SAFE_INTEGER)) {
		return new Decimal(x.getOperator(0, 1, 1));
	} else if (x.getOperator(2, 1, 1) == 0) {
		// [y, [1, z, 1, 1]]
		const y = x.getOperator(0, 1, 1);
		const z = x.getOperator(1, 1, 1);
		// BE Decimal:
		// (e)^z y
		const result = new Decimal();
		result.sign = 1;
		result.layer = z;
		result.mag = y;
		result.normalize();
		return result;
	} else if (x.getOperator(2, 1, 1) == 1) {
		// [y, [1, 1, 1, 1], [2, 1, 1, 1]]
		return Decimal.tetrate(10, Math.pow(10, x.getOperator(0, 1, 1)));
	}
	return Decimal.dNaN;
}
const fromBE = convertBEDecimalToPn;
const fromPN = convertPNToBEDecimal;

export { convertBEDecimalToPn, convertPNToBEDecimal, fromBE, fromPN };
