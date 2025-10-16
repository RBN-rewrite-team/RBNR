import Decimal from 'break_eternity.js';
import { Currencies, getCurrency } from './currencies';
import type { Requirement } from './requirements';
import { player } from './global';
import type { IntClosedRange } from 'type-fest';
import { diluteAmount } from './hydra/dilute';

export class Upgrade {
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
	auto(): boolean {
		return false;
	}
	show(): boolean {
		return true;
	}
	postBuy() {}
	canAfford(): boolean {
		let cost = typeof this.cost === 'function' ? this.cost() : this.cost;
		if (
			player.hydra.dilute.inDilute &&
			this.name.startsWith('U5') &&
			(!this.name.startsWith('U5-S') || player.challengein[0] == 1)
		) {
			cost = cost.pow(4 - 3 * 0.75 ** diluteAmount(1));
		}
		return getCurrency(this.currency).gte(cost);
	}
}
export class UpgradeWithEffect<T = any> extends Upgrade {
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
