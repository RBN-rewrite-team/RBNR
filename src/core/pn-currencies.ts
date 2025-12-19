import Decimal from 'break_eternity.js';
import { player } from './save';
import { feature } from './global';
import { getTotalTheories } from './nonrecu/total-theories';
import type { $t } from '@/utils/types';
import type PowiainaNum from 'powiaina_num.js';

export enum PNCurrencies {
	CHARGED_HYDRA_ENERGY,
}
abstract class PNCurrency {
	static name: string = '未定义货币';
	static set current(x: PowiainaNum) {
		throw new ReferenceError('Undefined currency.');
	}

	static get current(): PowiainaNum {
		throw new ReferenceError('Undefined currency.');
	}
}

const pncurrencyMap: Map<PNCurrencies, typeof PNCurrency> = new Map([
	// [PNCurrencies.CHARGED_HYDRA_ENERGY, ],
]);

export function setCurrency(currency: PNCurrencies, value: PowiainaNum) {
	const currencyClass = pncurrencyMap.get(currency);
	if (!currencyClass) throw ReferenceError('Undefined currency: ' + currency);

	currencyClass.current = value;
}
export function getCurrency(currency: PNCurrencies) {
	const currencyClass = pncurrencyMap.get(currency);
	if (!currencyClass) throw ReferenceError('Undefined currency: ' + currency);

	return currencyClass.current;
}
export function decreaseCurrency(currency: PNCurrencies, decreases: PowiainaNum) {
	const currencyClass = pncurrencyMap.get(currency);
	if (!currencyClass) throw ReferenceError('Undefined currency: ' + currency);

	currencyClass.current = currencyClass.current.sub(decreases);
}
export function currencyName(currency: PNCurrencies, $t: $t) {
	return $t(`currency.${currency}`);

	// const currencyClass = currencyMap.get(currency);
	// if (!currencyClass) throw ReferenceError('Undefined currency: ' + currency);

	// return currencyClass.name;
}
