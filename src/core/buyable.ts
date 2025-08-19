import Decimal from 'break_eternity.js';
import { Currencies, getCurrency } from './currencies';
import type { Requirement } from './requirements';
import { player } from './save';

export abstract class Buyable<T> {
	currency: Currencies = Currencies.NUMBER;

	description: string = '基于xxx增加数值xx';
	descriptionDilated: string = '';
	name: string = 'B0-114514';

	/**
	 *
	 * @param x 当前购买项的数量（不包含more()函数的内容）
	 * @returns
	 */
	cost(x: Decimal): Decimal {
		return new Decimal(114514).pow(x);
	}
	ordinal: boolean = false;
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
		return true;
	}
	/**
	 * @param x 当前购买想的数量（不包含more()函数的内容）
	 */
	effect(x: Decimal): T {
		throw new ReferenceError('Undefined effect');
	}
	effectDescription(values: T): string {
		throw new ReferenceError('Undefined effect');
	}
	effectDilated(value: Decimal): [Decimal, string] {
		return [new Decimal(0), 'nothing'];
	}

	more(): Decimal {
		return new Decimal(0);
	}
	canBuyMax() {
		return false;
	}
	autoBuyMax() {
		return false;
	}
	/**
	 * 当前资源可以购买几个此购买想
	 * 这个购买项的价格函数的反函数
	 * @param x 当前资源
	 */
	costInverse(x: Decimal): Decimal {
		return new Decimal(0);
	}
	/**
	 * 是否被上限
	 * @param x 当前购买项的数量（不包含more）
	 */
	capped(x: Decimal): boolean {
		return false;
	}
	/**
	 *
	 * @param x player.buyables[this.id]
	 * @returns
	 */
	canBuy(x: Decimal): Decimal {
		return this.costInverse(getCurrency(this.currency)).sub(x);
	}
	postBuyMax() {}
}
