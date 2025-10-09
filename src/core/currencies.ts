import Decimal from 'break_eternity.js';
import { player } from './save';
import { feature } from './global';
import { getTotalTheories } from './nonrecu/total-theories';

export enum Currencies {
	NUMBER = 'number',
	ADDITION_POWER = 'addition',
	MULTIPLICATION_POWER = 'multipl',
	EXPONENTION_POWER = 'exponent',
	QOL_POINTS = 'qol',
	ORDINAL = 'ordinal',
	HYDRA_POWER = 'hydra',
	COMP_HYDRA = 'compressed_hydra',
	X4 = 'x4',
	T4 = 'τ4',
	SOLUTION = 'solution',
	NONREC = 'nonrec',
	NRT = 'nrt',
	DEDUCE_ENERGY = 'deduce_energy',
	TIME_SHARD = 'ts',
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

class HydraPowerCurrency extends Currency {
	static name = '九头蛇能量';
	static set current(x: Decimal) {
		player.hydra.power = x;
	}

	static get current() {
		return player.hydra.power;
	}
}
class CompressedHydraPowerCurrency extends Currency {
	static name = '压缩九头蛇能量';
	static set current(x: Decimal) {
		player.hydra.compressedPower = x;
	}

	static get current() {
		return player.hydra.compressedPower;
	}
}

class X4Currency extends Currency {
	static name = 'x<sub>4</sub>';
	static set current(x: Decimal) {
		return;
	}

	static get current() {
		return player.numbertheory.GM.x;
	}
}

class T4Currency extends Currency {
	static name = 'τ<sub>4</sub>';
	static set current(x: Decimal) {
		return;
	}

	static get current() {
		return feature.OrdinalNT.varComputed('tau', 4);
	}
}

class SolutionCurrency extends Currency {
	static name = '九头蛇溶液';
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
	static name = '非递归能量';
	static set current(x: Decimal) {
		player.nonrecu.power = x;
	}

	static get current() {
		return player.nonrecu.power;
	}
}
class DeduceEnergyCurrency extends Currency {
	static name = '推演能量';
	static set current(x: Decimal) {
		player.numbertheory.well_ordering.energy = x;
	}

	static get current() {
		return player.numbertheory.well_ordering.energy;
	}
}
class NRTCurrency extends Currency {
	static name = '非递归理论';
	static set current(x: Decimal) {
		player.nonrecu.spentTheories = getTotalTheories().sub(x);
	}

	static get current() {
		return getTotalTheories().sub(player.nonrecu.spentTheories).clampMin(0);
	}
}
class TimeShard extends Currency {
	static name = '时间碎片';
	static set current(x: Decimal) {
		player.timeshard.value = x;
	}

	static get current() {
		return player.timeshard.value;
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
	[Currencies.DEDUCE_ENERGY, DeduceEnergyCurrency],
	[Currencies.COMP_HYDRA, CompressedHydraPowerCurrency],
	[Currencies.TIME_SHARD, TimeShard],
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
