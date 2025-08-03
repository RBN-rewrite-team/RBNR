import Decimal from 'break_eternity.js'
import {formatWhole} from './format'

export const OrdinalUtils = {
    numberToOrdinal(x: Decimal, base: Decimal, maxLength = 7): string {
        if(x.slog(base).gte(base)) return 'ε<sub>0</sub>'
        if(x.lt(base)) return formatWhole(x);
        if(maxLength == 0) return '...';
        let exp = x.log(base).floor();
        let mult = x.div(exp.pow_base(exp)).floor();
        let add = x.sub(exp.pow_base(exp).mul(mult)).floor();
        return 'ω' + (exp.gt(0) ? '<sup>' + this.numberToOrdinal(exp, base, maxLength--) + '</sup>' : '') + (mult.gt(1) ? formatWhole(mult) : '') + (add.gt(0) ? '+' + this.numberToOrdinal(add, base, maxLength--) : '');
    }
}