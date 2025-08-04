import type Decimal from 'break_eternity.js';
import { player } from './save';

export enum Currencies {
	NUMBER = 'number',
	ADDITION_POWER = 'addition',
	MULTIPLICATION_POWER = 'multipl',
	EXPONENTION_POWER = 'exponent',
	QOL_POINTS = 'qol',
	ORDINAL = "ordinal",
}

abstract class Currency {
	static name: string = '未定义货币';
	static set current(x: Decimal) {
		throw new ReferenceError('Undefined currency.');
	}

	static get current(): Decimal {
		throw new ReferenceError('Undefined currency.');
	}
}

class NumberCurrency extends Currency {
	static name = '数值';
	static set current(x: Decimal) {
		player.number = x;
	}

	static get current() {
		return player.number;
	}
}

class AdditionPowerCurrency extends Currency {
	static name = '加法能量';
	static set current(x: Decimal) {
		player.addpower = x;
	}

	static get current() {
		return player.addpower;
	}
}

class MultiplicationPowerCurrency extends Currency {
	static name = '乘法能量';
	static set current(x: Decimal) {
		player.multiplication.mulpower = x;
	}

	static get current() {
		return player.multiplication.mulpower;
	}
}

class ExponentionPowerCurrency extends Currency {
	static name = '指数能量';
	static set current(x: Decimal) {
		player.exponention.exppower = x;
	}

	static get current() {
		return player.exponention.exppower;
	}
}

class QolPointsCurrency extends Currency {
	static name = '生活点数';
	static set current(x: Decimal) {
		player.exponention.qolpoints = x;
	}

	static get current() {
		return player.exponention.qolpoints;
	}
}

class Ordinal extends Currency {
	static name = '序数';
	static set current(x: Decimal) {
		player.ordinal.number = x;
	}
	
	static get current() {
		return player.ordinal.number;
	}
}

const currencyMap: Map<Currencies, typeof Currency> = new Map([
	[Currencies.NUMBER, NumberCurrency],
	[Currencies.ADDITION_POWER, AdditionPowerCurrency],
	[Currencies.MULTIPLICATION_POWER, MultiplicationPowerCurrency],
	[Currencies.EXPONENTION_POWER, ExponentionPowerCurrency],
	[Currencies.QOL_POINTS, QolPointsCurrency],
	[Currencies.ORDINAL, Ordinal],
]);

export function setCurrency(currency: Currencies, value: Decimal) {
	const currencyClass = currencyMap.get(currency);
	if (!currencyClass) throw ReferenceError('Undefined currency: ' + currency);

	currencyClass.current = value;
}
export function getCurrency(currency: Currencies) {
	const currencyClass = currencyMap.get(currency);
	if (!currencyClass) throw ReferenceError('Undefined currency: ' + currency);

	return currencyClass.current;
}
export function decreaseCurrency(currency: Currencies, decreases: Decimal) {
	const currencyClass = currencyMap.get(currency);
	if (!currencyClass) throw ReferenceError('Undefined currency: ' + currency);

	currencyClass.current = currencyClass.current.sub(decreases);
}
export function currencyName(currency: Currencies) {
	const currencyClass = currencyMap.get(currency);
	if (!currencyClass) throw ReferenceError('Undefined currency: ' + currency);

	return currencyClass.name;
}
