import './assets/stylesheet/main.scss';
import './core/anti-cheat.ts';
import './core/automator/evaluator.ts';
import { init } from './utils/init.ts';

declare global {
	interface BigInt {
		toJSON(): string;
	}
}

BigInt.prototype.toJSON = function () {
	return this.toString();
};
init();

import { RETRIBUTION } from './core/post-nonrec/retribution.ts';
