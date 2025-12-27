import './assets/stylesheet/main.scss';

import PowiainaNum from 'powiaina_num.js';
PowiainaNum.throwErrorOnResultNaN = true;
import './core/anti-cheat.ts';
import './core/automator/evaluator.ts';
import { init } from './utils/init.ts';
import './core/save/index.ts';
import './core/hydra/hydra.ts';

declare global {
	interface BigInt {
		toJSON(): string;
	}
}
BigInt.prototype.toJSON = function () {
	return this.toString();
};
init();

console.log('我错了', new PowiainaNum(3));
import './test.tsx';
