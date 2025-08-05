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
}