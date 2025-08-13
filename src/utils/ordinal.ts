import Decimal from 'break_eternity.js';
import { Ordinal } from '@/lib/ordinal/';
import { formatWhole } from './format';

function bracket(a = 0, b = 0, c = 0): string {
	if(c == 0 && b == 0) return '(' + a + ')';
	if(c == 0) return '(' + a + ',' + b + ')';
	return '(' + a + ',' + b + ',' + c + ')';
}

export const OrdinalUtils = {
	numberToOrdinal(x: Decimal, base: Decimal, maxLength = 7, displayMode = true): string {
		if (!Decimal.isFinite(x)) {
			return "Ω"
		}
		//数值转序数
		const tetration = base.tetrate(base.toNumber())
		if (x.gte(tetration)) {
			let prefix = displayMode ? "ε<sub>0</sub>" : "e0"
			let power = x.log(tetration); 
			let powerdisplay = this.numberToOrdinal(power, base, maxLength-1, displayMode);
			return prefix + (displayMode?"<sup>":"^(") + powerdisplay + (displayMode?"</sup>":")");
		};
		if (x.lt(base)) return formatWhole(x);
		if (maxLength <= 0) return '...';
		let exp = x.log(base).add(1e-9).floor();
		let mult = x.div(exp.pow_base(base)).add(1e-9).floor();
		let add = x.sub(exp.pow_base(base).mul(mult)).add(1e-9).floor();
		if (x.gte(base.iteratedexp(2, new Decimal(3)))) add = new Decimal(0)
		if (displayMode)
			return (
				'ω' +
				(exp.gt(1)
					? '<sup>' + this.numberToOrdinal(exp, base, maxLength, true) + '</sup>'
					: '') +
				(mult.gt(1) ? formatWhole(mult) : '') +
				(add.gt(0) ? '+' + this.numberToOrdinal(add, base, --maxLength, true) : '')
			);
		else
			return (
				'w' +
				(exp.gt(1)
					? '^(' + this.numberToOrdinal(exp, base, --maxLength, false) + ')'
					: '') +
				(mult.gt(1) ? '*(' + formatWhole(mult) + ')' : '') +
				(add.gt(0) ? '+' + this.numberToOrdinal(add, base, --maxLength, false) : '')
			);
	},
	numberToLaTeXOrdinal(x: Decimal, base: Decimal, maxLength = 7): string {
		//数值转Latex表达法序数
		if (x.gte(base.tetrate(base.toNumber()))) return '\\varepsilon_0';
		if (x.lt(base)) return formatWhole(x);
		if (maxLength <= 0) return '...';
		let exp = x.log(base).add(1e-9).floor();
		let mult = x.div(exp.pow_base(base)).add(1e-9).floor();
		let add = x.sub(exp.pow_base(base).mul(mult)).add(1e-9).floor();
		if (x.gte(base.iteratedexp(2, new Decimal(3)))) add = new Decimal(0)
		return (
			'\\omega' +
			(exp.gt(1) ? '^{' + this.numberToLaTeXOrdinal(exp, base, --maxLength) + '}' : '') +
			(mult.gt(1) ? '\\cdot' + formatWhole(mult) : '') +
			(add.gt(0) ? '+' + this.numberToLaTeXOrdinal(add, base, --maxLength) : '')
		);
	},
	ordinalChangeBase(x: Decimal, base: Decimal, nBase: Decimal): Decimal {
		//序数换底
		return new Ordinal(this.numberToOrdinal(x, base, 7, false)).toDecimal(nBase);
	},
	numberLogHH(x: Decimal, base: Decimal): Decimal {
		//数值被HH Log
		let lbb = base.log(2);
		if (x.lt(base.pow_base(2).mul(base))) {
			let k = new Decimal(0),
				n = new Decimal(0);
			while (
				base
					.mul(k.add(1).pow_base(2))
					.add(n.mul(k.add(1).pow_base(2)))
					.lte(x.add(1e-9))
			)
				k = k.add(1);
			while (
				base
					.mul(k.pow_base(2))
					.add(n.add(1).mul(k.pow_base(2)))
					.lte(x.add(1e-9))
			)
				n = n.add(1);
			return base.mul(k).add(n);
		} else if (x.slog(2).lt(8)) {
			return base.pow(2).add(this.numberLogHH(x.div(base).log(2), base));
		} else if (x.slog(2).gte(8)) {
			let s = x.slog(2).floor().sub(2);
			let lx = x.iteratedlog(2, s.toNumber());
			return this.numberLogHH(lx, base).add(base.pow(2).mul(s));
		} else {
			let an = new Decimal(1),
				lx = x,
				wp2 = 0;
			while (an.pow_base(2).mul(base).lte(x.add(1e-9))) {
				an = an.pow_base(2).mul(base);
				lx = lx.div(base).log(2);
				wp2++;
			}
			return this.numberLogHH(lx, base).add(base.pow(2).mul(wp2));
		}
	},
	numberToBMS(x: Decimal, base: Decimal, maxLength = 15, basic = [0, 0, 0]): string { //数值转BMS（最多三行）
		if(x.lt(1)) return '';
		else if(x.lt(base)) return bracket(basic[0], basic[1], basic[2]) + this.numberToBMS(x.sub(1), base, maxLength--, basic);
		else if(x.lt(base.pow(2))) return bracket(basic[0], basic[1], basic[2]) + this.numberToBMS(x.sub(base).add(1), base, maxLength--, [basic[0] + 1, 0, 0]);
		else if(x.lt(base.pow(base)))
		{
			let log = x.log(base).floor().toNumber(), s = bracket(basic[0]++, basic[1]++, basic[2]);
			s += bracket(basic[0], basic[1], basic[2]);
			while(--log >= 2) s += bracket(++basic[0], basic[1], basic[2]);
			
			let k = x.log(base).floor().pow_base(base);
			let residue = x.sub(k);
			
			if(residue.gte(base.sub(1))) return s + this.numberToBMS(residue.sub(base).add(2), base, maxLength--, [basic[0] + 1, 0, 0]);
			else return s + this.numberToBMS(residue, base, maxLength--, basic);
		}
		else return '>(0,0,0)(1,1,0)(2,2,0)';
	}
	/*
	1: 0
	2: 0 0
	b: 0 1
	b+1: 0 1 1
	b2: 0 1 2
	b3: 0 1 2 3
	b^2: 00 11
	b^2+1: 00 11 11
	b^2+b: 00 11 20
	b^2+b2: 00 11 20 30
	b^2*2: 00 11 20 31
	b^2*3: 00 11 20 31 40 51
	b^3: 00 11 21
	b^3*2: 00 11 21 30 41 51
	b^b: 00 11 22
	*/
};

for(let i = 257;i <= 256;i++) console.log(i + ' ' + OrdinalUtils.numberToBMS(new Decimal(i), new Decimal(4)));