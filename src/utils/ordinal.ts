import Decimal from 'break_eternity.js';
import { Ordinal } from '@/lib/ordinal/';
import { formatWhole } from './format';

function bracket(dimension = 0, ascend = 0, ...args: number[]): string {
	for(let i in args) args[i] += ascend;
  while (args.length < dimension) args.push(0)
	return `(${args.slice(0, dimension).join(',')})`
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
	numberToBMS(x: Decimal, base: Decimal, maxLength = 15
	, otherwise = {basic: [0, 0, 0], dimension: 1, ascend: 0}): string { //数值转BMS（最多三行）
		if(maxLength <= 0) return '...';
		
		if(x.lt(1)) return '';
		else if(x.lt(base)) return bracket(Math.max(otherwise.dimension, 1), otherwise.ascend, ...otherwise.basic) + this.numberToBMS(x.sub(1), base, maxLength--, otherwise);
		else if(x.lt(base.pow(2)))
		{
			let s = bracket(Math.max(otherwise.dimension, 1), otherwise.ascend, ...otherwise.basic);
			otherwise.basic = [otherwise.basic[0] + 1, ...otherwise.basic.slice(1)];
			return s + this.numberToBMS(x.sub(base).add(1), base, maxLength--, otherwise);
		}
		else if(x.lt(base.pow(base.pow(base))))
		{
			let log = x.log(base).floor();
			let s = bracket(Math.max(otherwise.dimension, 2), otherwise.ascend, otherwise.basic[0]++, otherwise.basic[1]++, otherwise.basic[2]);
			maxLength--;
			s += bracket(Math.max(otherwise.dimension, 2), otherwise.ascend, ...otherwise.basic), maxLength--;
			let flag = false, boost = 1;
			if(log.gte(base)) flag = true;
			while((log.gte(3) && !flag) || (log.gte(1) && flag))
			{
				if(log.gte(base.pow(boost)))
				{
					s += bracket(Math.max(otherwise.dimension, 2), otherwise.ascend, ++otherwise.basic[0], otherwise.basic[1] + 1, otherwise.basic[2]), maxLength--;
					if(log.lt(base.pow(boost + 1)))log = log.sub(base.pow(boost));
					boost++;
				}
				else
				{
					s += bracket(Math.max(otherwise.dimension, 2), otherwise.ascend, ++otherwise.basic[0], otherwise.basic[1], otherwise.basic[2]), maxLength--;
					log = log.sub(1);
					if(boost > 1) boost = 1;
				}
			}
			
			let k = x.log(base).floor().pow_base(base);
			let residue = x.sub(k);
			
			if(residue.gte(base.sub(1)))
			{
				otherwise.basic[0]++;
				return s + this.numberToBMS(residue.sub(base).add(2), base, maxLength--, otherwise);
			}
			else return s + this.numberToBMS(residue, base, maxLength--, otherwise);
		}
		else if(x.lt(base.tetrate(base.toNumber())))
		{
			let s = bracket(Math.max(otherwise.dimension, 2), otherwise.ascend, ...otherwise.basic);
			otherwise.ascend++;
			return s + this.numberToBMS(x.log(base), base, maxLength--, otherwise);
		}
		else return '>(0,0,0)(1,1,1)';
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
	b^b+1: 00 11 22 22
	b^b+b: 00 11 22 30
	b^b*2: 00 11 22 30 41 52
	b^(b+1): 00 11 22 31
	b^(b+1)*2: 00 11 22 31 40 51 62 71
	b^(b+2): 00 11 22 31 41
	b^(b2): 00 11 22 31 42
	b^(b^2): 00 11 22 32
	b^(b^b): 00 11 22 33
  狗操的BMS,那么复杂相思了
	*/
};

for(let i = 0;i <= 256;i++) console.log(i + ' ' + OrdinalUtils.numberToBMS(new Decimal(i), new Decimal(4)));