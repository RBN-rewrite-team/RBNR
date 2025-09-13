import Decimal from 'break_eternity.js';
import { player } from './save';
import { feature } from './global';
import { getTotalTheories } from './nonrecu/total-theories';
import { getI18NData, I18NData, type AvaliableLangs, type Avaliables } from './i18n-data';
export enum Currencies {
	NUMBER = 'number',
	ADDITION_POWER = 'addition',
	MULTIPLICATION_POWER = 'multipl',
	EXPONENTION_POWER = 'exponent',
	QOL_POINTS = 'qol',
	ORDINAL = 'ordinal',
	HYDRA_POWER = 'hydra',
	X4 = 'x4',
	T4 = 'τ4',
	SOLUTION = 'solution',
	NONREC = 'nonrec',
	NRT = 'nrt',
}
type ttttttt<A> = keyof {
	[key in keyof A as A[key] extends string ? key : never]: A[key];
};
type I18NCurrencyKey = ttttttt<(typeof I18NData)[AvaliableLangs]>;
abstract class Currency {
	static i18ndata: I18NCurrencyKey = 'number';
	static set current(x: Decimal) {
		throw new ReferenceError('Undefined currency.');
	}

	static get current(): Decimal {
		throw new ReferenceError('Undefined currency.');
	}
}

class NumberCurrency extends Currency {
	static i18ndata: I18NCurrencyKey = 'number';
	static set current(x: Decimal) {
		player.number = x;
	}

	static get current() {
		return player.number;
	}
}

class AdditionPowerCurrency extends Currency {
	static i18ndata: I18NCurrencyKey = 'add_power';
	static set current(x: Decimal) {
		player.addpower = x;
	}

	static get current() {
		return player.addpower;
	}
}

class MultiplicationPowerCurrency extends Currency {
	static i18ndata: I18NCurrencyKey = 'mul_power';
	static set current(x: Decimal) {
		player.multiplication.mulpower = x;
	}

	static get current() {
		return player.multiplication.mulpower;
	}
}

class ExponentionPowerCurrency extends Currency {
	static i18ndata: I18NCurrencyKey = 'exp_power';
	static set current(x: Decimal) {
		player.exponention.exppower = x;
	}

	static get current() {
		return player.exponention.exppower;
	}
}

class QolPointsCurrency extends Currency {
	static i18ndata: I18NCurrencyKey = 'qol_point';
	static set current(x: Decimal) {
		player.exponention.qolpoints = x;
	}

	static get current() {
		return player.exponention.qolpoints;
	}
}

class Ordinal extends Currency {
	static i18ndata: I18NCurrencyKey = 'ordinal';
	static set current(x: Decimal) {
		player.ordinal.number = x;
	}

	static get current() {
		return player.ordinal.number;
	}
}

class HydraPowerCurrency extends Currency {
	static i18ndata: I18NCurrencyKey = 'hydra_power';

	static set current(x: Decimal) {
		player.hydra.power = x;
	}

	static get current() {
		return player.hydra.power;
	}
}

class X4Currency extends Currency {
	static i18ndata: I18NCurrencyKey = 'x_4';

	static set current(x: Decimal) {
		return;
	}

	static get current() {
		return player.numbertheory.GM.x;
	}
}

class T4Currency extends Currency {
	static i18ndata: I18NCurrencyKey = 'tau_4';
	static set current(x: Decimal) {
		return;
	}

	static get current() {
		return feature.OrdinalNT.varComputed('tau', 4);
	}
}

class SolutionCurrency extends Currency {
	static i18ndata: I18NCurrencyKey = 'hydra_solution';
	static set current(x: Decimal) {
		if (player.milestones.dut10) return;
		player.hydra.dilute.solutionCost = new Decimal(player.hydra.dilute.solution)
			.sub(x)
			.clamp(0, Number.MAX_VALUE);
	}

	static get current() {
		return player.hydra.dilute.solution.sub(player.hydra.dilute.solutionCost);
	}
}
class NonRecCurrency extends Currency {
	static i18ndata: I18NCurrencyKey = 'nonrec_power';
	static set current(x: Decimal) {
		player.nonrecu.power = x;
	}

	static get current() {
		return player.nonrecu.power;
	}
}
class NRTCurrency extends Currency {
	static i18ndata: I18NCurrencyKey = 'nonrec_theory';
	static set current(x: Decimal) {
		player.nonrecu.spentTheories = getTotalTheories().sub(x);
	}

	static get current() {
		return getTotalTheories().sub(player.nonrecu.spentTheories).clampMin(0);
	}
}
const currencyMap: Map<Currencies, typeof Currency> = new Map([
	[Currencies.NUMBER, NumberCurrency],
	[Currencies.ADDITION_POWER, AdditionPowerCurrency],
	[Currencies.MULTIPLICATION_POWER, MultiplicationPowerCurrency],
	[Currencies.EXPONENTION_POWER, ExponentionPowerCurrency],
	[Currencies.QOL_POINTS, QolPointsCurrency],
	[Currencies.ORDINAL, Ordinal],
	[Currencies.HYDRA_POWER, HydraPowerCurrency],
	[Currencies.X4, X4Currency],
	[Currencies.T4, T4Currency],
	[Currencies.SOLUTION, SolutionCurrency],
	[Currencies.NONREC, NonRecCurrency],
	[Currencies.NRT, NRTCurrency],
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

	return getI18NData(currencyClass.i18ndata);
}
