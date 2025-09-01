import './assets/main.scss';
import './core/anti-cheat.ts';
import './lib/ordinal/evaluator.ts';
import './utils/0-y.ts';
import "./core/automator/compiler.ts"

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
