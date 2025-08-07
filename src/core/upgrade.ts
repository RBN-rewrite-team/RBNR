import Decimal from 'break_eternity.js';
import { Currencies, getCurrency } from './currencies';
import type { Requirement } from './requirements';

export abstract class Upgrade {
	currency: Currencies = Currencies.NUMBER;

	description: string | (() => string) = '数值获取×114514';
	name: string = 'U0-114514';
	cost: Decimal | (() => Decimal) = new Decimal(114514);
	ordinal = false;
	requirements(): Requirement[] {
		return [];
	}
	keep(): boolean {
		return false;
	}
	show(): boolean {
		return true;
	}
	postBuy() {}
	canAfford(): boolean {
		return getCurrency(this.currency).gte(
			typeof this.cost === 'function' ? this.cost() : this.cost,
		);
	}
}

export abstract class UpgradeWithEffect<T = any> extends Upgrade {
	effect(): T {
		throw new ReferenceError('Undefined effect');
	}
	effectDescription(values: T) {
		throw new ReferenceError('Undefined effect');
	}
	static isWithEffect<T>(x: Upgrade): x is UpgradeWithEffect<T> {
		return x instanceof UpgradeWithEffect;
	}
}
