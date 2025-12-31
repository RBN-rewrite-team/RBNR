import Decimal from 'break_eternity.js';
import PowiainaNum from 'powiaina_num.js';

import { format, formatWhole } from './utils/format.ts';

Decimal.prototype.format = function (precision: number = 4) {
	return format(this);
};

Decimal.prototype.formatWhole = function () {
	return formatWhole(this);
};

PowiainaNum.prototype.format = function (precision: number = 4) {
	return format(this);
};

PowiainaNum.prototype.formatWhole = function () {
	return formatWhole(this);
};

BigInt.prototype.toJSON = function () {
	return this.toString();
};
