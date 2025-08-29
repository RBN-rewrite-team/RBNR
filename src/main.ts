import './assets/main.scss';
import './core/anti-cheat.ts';
import './lib/ordinal/evaluator.ts';
import './utils/0-y.ts';
import { init } from './utils/init.ts';

// @ts-expect-error
BigInt.prototype.toJSON = function () {
	return this.toString();
};
init();
