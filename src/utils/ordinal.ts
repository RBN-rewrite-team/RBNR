export const OrdinalUtils = {
    numberToOrdinal(x: Decimal, base: Decimal, maxLength = 7, displayMode = true): string { //数值转序数
        if(x.gte(base.tetrate(base.toNumber()))) return 'ε<sub>0</sub>'
        if(x.lt(base)) return formatWhole(x);
        if(maxLength <= 0) return '...';
        let exp = x.log(base).add(1e-9).floor();
        let mult = x.div(exp.pow_base(base)).add(1e-9).floor();
        let add = x.sub(exp.pow_base(base).mul(mult)).add(1e-9).floor();
        if(displayMode) return 'ω' + (exp.gt(1) ? '<sup>' + this.numberToOrdinal(exp, base, --maxLength, true) + '</sup>' : '') + (mult.gt(1) ? formatWhole(mult) : '') + (add.gt(0) ? '+' + this.numberToOrdinal(add, base, --maxLength, true) : '');
		else return 'w' + (exp.gt(1) ? '^(' + this.numberToOrdinal(exp, base, --maxLength, false) + ')' : '') + (mult.gt(1) ? '*(' + formatWhole(mult) + ')' : '') + (add.gt(0) ? '+' + this.numberToOrdinal(add, base, --maxLength, false) : '');
	},
	numberToLaTeXOrdinal(x: Decimal, base: Decimal, maxLength = 7): string { //数值转Latex表达法序数
	    if(x.gte(base.tetrate(base.toNumber()))) return '\\epsilon_0'
        if(x.lt(base)) return formatWhole(x);
        if(maxLength <= 0) return '...';
        let exp = x.log(base).add(1e-9).floor();
        let mult = x.div(exp.pow_base(base)).add(1e-9).floor();
        let add = x.sub(exp.pow_base(base).mul(mult)).add(1e-9).floor();
        return '\\omega' + (exp.gt(1) ? '^{' + this.numberToOrdinal(exp, base, --maxLength, true) + '}' : '') + (mult.gt(1) ? formatWhole(mult) : '') + (add.gt(0) ? '+' + this.numberToOrdinal(add, base, --maxLength, true) : '');
	},
	ordinalChangeBase(x: Decimal, base: Decimal, nBase: Decimal): Decimal { //序数换底
		return new Ordinal(this.numberToOrdinal(x, base, 7, false)).toDecimal(nBase.toNumber());
	},
	numberLogHH(x: Decimal, base: Decimal): Decimal { //数值被HH Log
		let lbb = base.log(2);
		if(x.lt(base.pow_base(2).mul(base)))
		{
			let k = new Decimal(0), n = new Decimal(0);
			while(base.mul(k.add(1).pow_base(2)).add(n.mul(k.add(1).pow_base(2))).lte(x.add(1e-9))) k = k.add(1);
			while(base.mul(k.pow_base(2)).add(n.add(1).mul(k.pow_base(2))).lte(x.add(1e-9))) n = n.add(1);
			return base.mul(k).add(n);
		}
		else if(x.lt(base.pow_base(2).mul(base).pow_base(2).mul(base)))
		{
			return base.pow(2).add(this.numberLogHH(x.div(base).log(2), base));
		}
		else if(x.slog(2).gte(8))
		{
			let s = x.slog(2).floor().sub(2);
			let lx = x.iteratedlog(2, s.toNumber());
			return this.numberLogHH(lx, base).add(base.pow(2).mul(s));
		}
		else
		{
			let an = new Decimal(1), lx = x, wp2 = 0;
			while(an.pow_base(2).mul(base).lte(x.add(1e-9)))
			{
				an = an.pow_base(2).mul(base);
				lx = lx.div(base).log(2);
				wp2++;
			}
			return this.numberLogHH(lx, base).add(base.pow(2).mul(wp2));
		}
	},
}

console.log(OrdinalUtils.numberLogHH(new Decimal(11), new Decimal(10)));