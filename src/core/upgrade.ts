import Decimal from 'break_eternity.js';
import { Currencies, getCurrency } from './currencies';
import type { Requirement } from './requirements';
import { player } from './global';
import type { IntClosedRange } from 'type-fest';
//import { diluteAmount } from './hydra/dilute';

function diluteAmount(id: IntClosedRange<0, 8>): number;
function diluteAmount(id: IntClosedRange<6, 8>): boolean;
function diluteAmount(id: IntClosedRange<0, 8>): number | boolean {
	if (!player.hydra.dilute.inDilute) return id < 6 ? 0 : false;
	if (player.hydra.dilute.solvent[8]) {
		return id < 6 ? 10 : true;
	}
	return player.hydra.dilute.solvent[id];
} //没办法导入

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
		let cost = typeof this.cost === 'function' ? this.cost() : this.cost;
		if (player.hydra.dilute.inDilute) {
			cost = cost.pow(4 - 3 * 0.75 ** diluteAmount(1));
		}
		return getCurrency(this.currency).gte(cost);
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
