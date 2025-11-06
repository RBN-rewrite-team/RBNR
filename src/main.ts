import './assets/stylesheet/main.scss';
import './core/anti-cheat.ts';
import './core/automator/evaluator.ts';
import { init } from './utils/init.ts';

import './core/save/index.ts';
import './core/hydra/hydra.ts';
import { Logarithm } from './core/exponention/logarithm';

declare global {
	interface BigInt {
		toJSON(): string;
	}
}

BigInt.prototype.toJSON = function () {
	return this.toString();
};
init();

import PowiainaNum from 'powiaina_num.js';

console.log('我错了', new PowiainaNum(3));
