import Decimal from 'break_eternity.js';

declare module 'break_eternity.js' {
	export default interface Decimal {
		format(precision?: number): string;
		formatWhole(): string;
	}
}

import PowiainaNum from 'powiaina_num.js';

declare module 'powiaina_num.js' {
	export default interface PowiainaNum {
		format(precision?: number): string;
		formatWhole(): string;
	}
}
