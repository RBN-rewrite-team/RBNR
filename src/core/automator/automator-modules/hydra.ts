import { Dilute } from '@/core/hydra/dilute';
import { Hydra } from '@/core/hydra/hydra';
import { player } from '@/core/save';
import Decimal from 'break_eternity.js';
import { Callable, Dictionary, AutomatorArray } from '../a-objects';
import type { Environment } from '../environment';

const hydraResetFunction = new (class hydraReset extends Callable {
	async call(env: Environment, ...args: any[]) {
		if (args[0] instanceof Decimal) {
			if (args[0].eq(0)) {
				Hydra.hydraReset();
				return;
			} else if (args[0].eq(1)) {
				Hydra.prestige(0);
				return;
			} else if (args[0].eq(2)) {
				Hydra.prestige(1);
				return;
			} else if (args[0].eq(3)) {
				Hydra.prestige(2);
				return;
			} else if (args[0].eq(4)) {
				Hydra.prestige(3);
				return;
			}
		}
		throw new TypeError('错误的:hydra.reset参数');
	}
})();
const hydraDiluteFunction = new (class hydraReset extends Callable {
	async call(env: Environment, ...args: any[]) {
		if (args[0] === undefined) {
			return Dilute.diluteButton();
		}
		if (args[0] instanceof Decimal) {
		}
		throw new TypeError('错误的:hydra.dilute参数');
	}
})();
const hydraDiluteSetFunction = new (class hydraReset extends Callable {
	async call(env: Environment, ...args: any[]) {
		if (args[0] instanceof Decimal && args[1] instanceof Decimal) {
			if (player.hydra.dilute.inDilute) return;
			const i = args[0].toNumber();
			const v = args[1].toNumber();
			if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(i)) {
				if (i == 7 || i == 8 || i == 9) {
					player.hydra.dilute.solvent[i - 1] = !!v;
				} else {
					player.hydra.dilute.solvent[i - 1] = v;
				}
				return;
			}
		}
		throw new TypeError('错误的:hydra.diluteset参数');
	}
})();
export function importHydra(parentEnvironment: Environment) {
	const readonlyDictionaryHydra = new (class extends Dictionary {
		get(key: any) {
			if (key == 'deduces') {
				return new AutomatorArray([player.hydra.deduceOrdinal[0].add(1).sub(1)]);
			}
			if (key == 'indilute') {
				return player.hydra.dilute.inDilute;
			}
			return Dictionary.prototype.get.call(this, key);
		}
		set(key: any, value: any) {
			return Dictionary.prototype.set.call(this, key, value);
		}
	})();
	readonlyDictionaryHydra.set('reset', hydraResetFunction);
	readonlyDictionaryHydra.set('dilute', hydraDiluteFunction);
	readonlyDictionaryHydra.set('diluteset', hydraDiluteSetFunction);
	readonlyDictionaryHydra.readonly = true;
	parentEnvironment.isReadonly = false;
	parentEnvironment.set('hydra', readonlyDictionaryHydra);
	parentEnvironment.isReadonly = true;
}
