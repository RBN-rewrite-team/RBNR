import Decimal from 'break_eternity.js'
import {formatWhole} from './format'

export const OrdinalUtils = {
    numberToOrdinal(x: Decimal, base: Decimal, maxLength = 7): string {
        if(x.gte(base.tetrate(base.toNumber()))) return 'ε<sub>0</sub>'
        if(x.lt(base)) return formatWhole(x);
        if(maxLength == 0) return '...';
        let exp = x.log(base).add(1e-9).floor();
        let mult = x.div(exp.pow_base(base)).add(1e-9).floor();
        let add = x.sub(exp.pow_base(base).mul(mult)).add(1e-9).floor();
        return 'ω' + (exp.gt(1) ? '<sup>' + this.numberToOrdinal(exp, base, --maxLength) + '</sup>' : '') + (mult.gt(1) ? formatWhole(mult) : '') + (add.gt(0) ? '+' + this.numberToOrdinal(add, base, --maxLength) : '');
    },
	ordinalToNumber(x: string, base: Decimal): Decimal {
		let pos = 0, num = new Decimal(0);
		for(;pos < x.length;pos++)
		{
			if(x[pos] >= '0' && x[pos] <= '9') num = new Decimal(Number(num) * 10 + Number(x[pos]));
			else if(x[pos] == '^')
			{
				let pos2 = pos + 1, str2 = '';
				while(x[pos2] != ')')
				{
					if(x[pos2] != '(' && x[pos2] != ')') str2 += x[pos2];
					pos2++, pos++;
				}
				num = num.pow(this.ordinalToNumber(str2, base));
			}
			else if(x[pos] == '*')
			{
				let pos2 = pos + 1, str2 = '';
				while(x[pos2] != ')')
				{
					if(x[pos2] != '(' && x[pos2] != ')') str2 += x[pos2];
					pos2++, pos++;
				}
				num = num.mul(this.ordinalToNumber(str2, base));
			}
			else if(x[pos] == '+')
			{
				let str2 = '';
				for(let i = pos + 1;i < x.length;i++)
				{
					if(x[i] != '(' && x[i] != ')') str2 += x[i];
				}
				return num.add(this.ordinalToNumber(str2, base));
			}
			else if(x[pos] == 'w') num = base;
			else if(x[pos] == 'e') return Decimal.iteratedexp(base, base.toNumber(), new Decimal(1));
		}
		return num;
	}
}