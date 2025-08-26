import Decimal from 'break_eternity.js';
import { Ordinal } from '@/lib/ordinal/';
import { formatWhole } from './format';

function bracket(dimension = 0, ascend = 0, ...args: number[]): string {
	for (const i in args) args[i] += ascend;
	while (args.length < dimension) args.push(0);
	return `(${args.slice(0, dimension).join(',')})`;
}

// 打个表
const PostBOOrdinalTable = [
  [
    "(0,0,0)(1,1,1)",
    "(0,0,0)(1,1,1)(1,1,0)",
    "(0,0,0)(1,1,1)(1,1,0)(2,2,1)",
    "(0,0,0)(1,1,1)(1,1,0)(2,2,1)(2,2,0)",
    "(0,0,0)(1,1,1)(1,1,0)(2,2,1)(2,2,0)(3,3,1)",
    "(0,0,0)(1,1,1)(1,1,1)",
    "(0,0,0)(1,1,1)(1,1,1)(1,1,1)",
    "(0,0,0)(1,1,1)(2,0,0)",
    "(0,0,0)(1,1,1)(2,0,0)(3,1,1)",
    "(0,0,0)(1,1,1)(2,1,0)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)(2,2,0)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)(2,2,1)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)(4,2,1)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,2,0)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,1)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,1)(1,1,0)(2,2,1)(3,1,0)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,1)(1,1,0)(2,2,1)(3,1,0)(2,2,1)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,1)(1,1,0)(2,2,1)(3,2,0)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,1)(1,1,0)(2,2,1)(3,2,0)(2,2,1)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,1)(1,1,1)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,1)(2,1,0)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,2,0)(2,2,1)(3,1,0)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,2,0)(2,2,1)(3,2,0)",
    "(0,0,0)(1,1,1)(2,1,0)(1,1,1)(2,1,0)(1,1,1)",
    "(0,0,0)(1,1,1)(2,1,0)(2,0,0)",
    "(0,0,0)(1,1,1)(2,1,0)(2,1,0)",
    "(0,0,0)(1,1,1)(2,1,0)(2,1,0)(1,1,1)",
    "(0,0,0)(1,1,1)(2,1,0)(3,0,0)",
    "(0,0,0)(1,1,1)(2,1,0)(3,1,0)",
    "(0,0,0)(1,1,1)(2,1,0)(3,1,0)(1,1,1)",
    "(0,0,0)(1,1,1)(2,1,0)(3,2,0)",
    "(0,0,0)(1,1,1)(2,1,0)(3,2,0)(3,2,0)",
    "(0,0,0)(1,1,1)(2,1,0)(3,2,0)(4,2,0)",
    "(0,0,0)(1,1,1)(2,1,0)(3,2,0)(4,3,0)",
    "(0,0,0)(1,1,1)(2,1,0)(3,2,1)",
    "(0,0,0)(1,1,1)(2,1,0)(3,2,1)(4,2,0)",
    "(0,0,0)(1,1,1)(2,1,0)(3,2,1)(4,2,0)(3,2,1)",
    "(0,0,0)(1,1,1)(2,1,0)(3,2,1)(4,2,0)(5,3,0)",
    "(0,0,0)(1,1,1)(2,1,0)(3,2,1)(4,2,0)(5,3,1)",
  ],
  [
    "(0,0,0)(1,1,1)(2,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(2,1,0)",
    "(0,0,0)(1,1,1)(2,1,1)(2,1,0)(1,1,1)(2,1,0)",
    "(0,0,0)(1,1,1)(2,1,1)(2,1,0)(1,1,1)(2,1,0)(3,2,1)(4,2,1)(4,1,0)",
    "(0,0,0)(1,1,1)(2,1,1)(2,1,0)(1,1,1)(2,1,0)(3,2,1)(4,2,1)(4,1,0)(4,2,1)",
    "(0,0,0)(1,1,1)(2,1,1)(2,1,0)(1,1,1)(2,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(2,1,0)(3,2,1)(4,2,1)",
    "(0,0,0)(1,1,1)(2,1,1)(2,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(1,1,1)(2,1,1)(3,1,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,0,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,0)(3,2,1)(4,2,1)(5,1,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,0)(3,2,1)(4,2,1)(5,1,0)(4,2,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,0)(3,2,1)(4,2,1)(5,2,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)(3,1,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)(3,1,0)(2,0,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(3,1,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(4,2,1)(5,2,1)(6,1,0)(5,0,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(4,2,1)(5,2,1)(6,2,0)",
  ],
  [
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(2,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(2,1,1)(3,1,0)(2,0,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(2,1,1)(3,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,0)(2,0,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,1)(2,1,1)(3,1,1)(3,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,0,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,0)(2,0,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,0)(3,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,0)(4,1,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,0)(5,2,0)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,0)(5,2,1)(6,2,1)(7,2,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,1)(4,1,1)",
    "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,1)(5,1,1)",
  ]
] as const

export const OrdinalUtils = {
	numberToOrdinal(x: Decimal, base: Decimal, maxLength = 7, displayMode = true): string {
		if (!Decimal.isFinite(x)) {
			return 'Ω';
		}
		//数值转序数
		const tetration = base.tetrate(base.toNumber());
		if (x.gte(tetration)) {
			const prefix = displayMode ? 'ε<sub>0</sub>' : 'e0';
			const power = x.log(tetration);
			const powerdisplay = this.numberToOrdinal(power, base, maxLength - 1, displayMode);
			return (
				prefix +
				(displayMode ? '<sup>' : '^(') +
				powerdisplay +
				(displayMode ? '</sup>' : ')')
			);
		}
		if (x.lt(base)) return formatWhole(x);
		if (maxLength <= 0) return '...';
		const exp = x.log(base).add(1e-9).floor();
		const mult = x.div(exp.pow_base(base)).add(1e-9).floor();
		let add = x.sub(exp.pow_base(base).mul(mult)).add(1e-9).floor();
		if (x.gte(base.iteratedexp(2, new Decimal(3)))) add = new Decimal(0);
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
		const exp = x.log(base).add(1e-9).floor();
		const mult = x.div(exp.pow_base(base)).add(1e-9).floor();
		let add = x.sub(exp.pow_base(base).mul(mult)).add(1e-9).floor();
		if (x.gte(base.iteratedexp(2, new Decimal(3)))) add = new Decimal(0);
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
		// const lbb = base.log(2);
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
			const s = x.slog(2).floor().sub(2);
			const lx = x.iteratedlog(2, s.toNumber());
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
	numberToBMS(
		x: Decimal,
		base: Decimal,
		maxLength = 20,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		otherwise: any = { basic: [0, 0], dimension: 1, ascend: 0, id: 0 },
	): string {
		//数值转BMS（最多ω行）
		if (maxLength <= 0) return '...';

		if (x.lt(1)) return '';
		else if (x.lt(base))
			return (
				bracket(Math.max(otherwise.dimension, 1), otherwise.ascend, ...otherwise.basic) +
				this.numberToBMS(x.sub(1), base, --maxLength, otherwise)
			);
		else if (x.lt(base.pow(2))) {
			otherwise.dimension = Math.max(otherwise.dimension, 1);
			const s = bracket(otherwise.dimension, otherwise.ascend, ...otherwise.basic);
			--maxLength;
			otherwise.basic = [otherwise.basic[0] + 1, ...otherwise.basic.slice(1)];
			return s + this.numberToBMS(x.sub(base).add(1), base, --maxLength, otherwise);
		} else if (x.lt(base.pow(base.pow(base)))) {
			otherwise.dimension = Math.max(otherwise.dimension, 2);
			let log = x.log(base);
			let s = bracket(
				otherwise.dimension,
				otherwise.ascend,
				otherwise.basic[0]++,
				otherwise.basic[1]++,
			);
			--maxLength;
			s += bracket(otherwise.dimension, otherwise.ascend, ...otherwise.basic);
			--maxLength;
			let flag = false,
				boost = 1;
			if (log.gte(base)) flag = true;
			while ((log.gte(3) && !flag) || (log.gte(1) && flag)) {
				if (maxLength <= 0) break;
				if (log.gte(base.pow(boost))) {
					s += bracket(
						otherwise.dimension,
						otherwise.ascend,
						++otherwise.basic[0],
						otherwise.basic[1] + 1,
					);
					--maxLength;
					if (log.lt(base.pow(boost + 1))) log = log.sub(base.pow(boost));
					boost++;
				} else {
					s += bracket(otherwise.dimension, otherwise.ascend, ++otherwise.basic[0], 1);
					--maxLength;
					log = log.sub(1);
					if (boost > 1) boost = 1;
				}
			}

			const k = x.log(base).floor().pow_base(base);
			const residue = x.sub(k);

			if (residue.gte(base.sub(1))) {
				otherwise.basic[0]++;
				otherwise.basic[1] = 0;
				return s + this.numberToBMS(residue.sub(base).add(2), base, --maxLength, otherwise);
			} else {
				otherwise.dimension = 2;
				return s + this.numberToBMS(residue, base, --maxLength, otherwise);
			}
		} else if (x.lt(base.tetrate(base.toNumber()))) {
			otherwise.dimension = Math.max(otherwise.dimension, 2);
			const s = bracket(otherwise.dimension, otherwise.ascend, ...otherwise.basic);
			--maxLength;
			otherwise.ascend++;
			return s + this.numberToBMS(x.log(base), base, --maxLength, otherwise);
		} else if (x.lt(base.tetrate(base.toNumber()).mul(base.sqr()).pow_base(4).pow_base(4))) {
		  if (x.lt(base.pow(base).add(base.pow(2)).pow_base(4).pow_base(4))) {
		    let len = PostBOOrdinalTable[0].length
		    let index = x.log(base).log(base).sub(256).div(16/len).max(0).floor().toNumber()
		    return PostBOOrdinalTable[0][index]
		  }
		  if (x.lt(base.pow(base).add(base.pow(2).mul(2)).pow_base(4).pow_base(4))) {
		    let len = PostBOOrdinalTable[1].length
		    let index = x.log(base).log(base).sub(256+16).div(16/len).max(0).floor().toNumber()
		    return PostBOOrdinalTable[1][index]
		  }
		  if (x.lt(base.pow(base).add(base.pow(2).mul(3)).pow_base(4).pow_base(4))) {
		    let len = PostBOOrdinalTable[2].length
		    let index = x.log(base).log(base).sub(256+32).div(16/len).max(0).floor().toNumber()
		    return PostBOOrdinalTable[2][index]
		  }
			let temp = this.numberToBMS(
				x.iteratedlog(base, base.sub(2).toNumber()).div(base.pow(2)),
				new Decimal(4),
				maxLength,
			);
			let hasEllipsis = temp.endsWith('...');
			if (hasEllipsis) temp = temp.slice(0, -3);
			return (
				'>(' +
				temp
					.replace(/^>/, '')
					.slice(1, -1)
					.split(')(')
					.map((s, i) => `${i},${s}`)
					.join(')(') +
				')' +
				(hasEllipsis ? '...' : '')
			);
		} else {
			return `(0)(1<sup>ω</sup>)`;
		}
	},
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

//for (let i = 0; i <= 4; i+=0.01) console.log(i, OrdinalUtils.numberToBMS(new Decimal(i).mul(16).add(256.00000001).pow_base(4).pow_base(4), new Decimal(4), 30))
