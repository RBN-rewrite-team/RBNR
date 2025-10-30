import Decimal from 'break_eternity.js';
import { ADecimal, AObject, type Callable, Dictionary } from '../a-objects';
import type { Environment } from '../environment';
const maxFunction = new (class MaxFunction extends AObject implements Callable {
	async call(env: Environment, ...args: any[]) {
		let max = new Decimal(-Infinity);
		for (const number of args) {
			max = max.max(number.dec);
		}
		return new ADecimal(max);
	}
})();
const minFunction = new (class MinFunction extends AObject implements Callable {
	async call(env: Environment, ...args: any[]) {
		let min = new Decimal(Infinity);
		for (const number of args) {
			min = min.min(number.dec);
		}
		return new ADecimal(min);
	}
})();
export function importMath(parentEnvironment: Environment) {
	const readonlyDictionary = new Dictionary();
	readonlyDictionary.set('max', maxFunction);
	readonlyDictionary.set('min', minFunction);
	readonlyDictionary.readonly = true;
	parentEnvironment.isReadonly = false;
	parentEnvironment.set('math', readonlyDictionary);
	parentEnvironment.isReadonly = true;
}
