import ModalService from '@/utils/Modal';
import { AutomatorArray, Callable, Dictionary } from './a-objects';
import { formatResult } from '.';
import { Call } from './lexer';
import { player } from '../global';
import Decimal from 'break_eternity.js';
import { Hydra } from '../hydra/hydra';
import { Dilute } from '../hydra/dilute';
import { importMusic } from './music-play';

export class Environment {
	parent: Environment | null = null;
	map: Map<string, any> = new Map();
	isReadonly: boolean = false;
	declared: Set<string> = new Set();
	nodeclarecheck = true;
	constructor(parent?: Environment, readonly = false) {
		if (parent) this.parent = parent;
		this.isReadonly = readonly;
	}
	get(key: string): any {
		let res = this.map.get(key) ?? this.parent?.get?.(key);
		if (res === undefined && !this.nodeclarecheck && !this.declared.has(key)) {
			throw new ReferenceError('未声明变量');
		}
		return res;
	}
	set(key: string, value: any) {
		//检测当前或上游环境是否有readonly key
		if (this.readonlykey(key)) throw new Error('Cannot set to readonly object');
		if (!this.nodeclarecheck && !this.declared.has(key)) {
			throw new ReferenceError('赋值前先声明变量');
		}
		return this.map.set(key, value);
	}
	has(key: string): boolean {
		return this.map.has(key) ? (this.parent?.has?.(key) ?? false) : false;
	}
	readonlykey(key: string): boolean {
		if (this.map.has(key) && this.isReadonly) return true;
		if (!this.parent) return false;

		return this.parent.readonlykey(key);
	}
	adddeclare(key: string) {
		return this.declared.add(key);
	}
}

class PutFunction extends Callable {
	call(env: Environment, ...args: any[]) {
		return new Promise<void>(function (resolve) {
			ModalService.show({
				title: '自动机提示',
				content: formatResult(args[0]),
				onConfirm() {
					resolve();
				},
				onClose() {
					resolve();
				},
			});
		});
	}
}
class DelayFunction extends Callable {
	call(env: Environment, ...args: any[]) {
		return new Promise<void>(function (resolve) {
			setTimeout(() => {
				resolve();
			}, args[0].toNumber());
		});
	}
}
class ToStringFunction extends Callable {
	call(env: Environment, ...args: any[]) {
		if (args.length == 0 || args.length >= 2) {
			throw new TypeError('1 argument required, but no or more arguments');
		}
		return args[0].toString();
	}
}
const putf = new PutFunction();
const delayf = new DelayFunction();
const toStringFunction = new ToStringFunction();
const maxFunction = new (class MaxFunction extends Callable {
	async call(env: Environment, ...args: any[]) {
		let max = new Decimal(-Infinity);
		for (const number of args) {
			console.log(max, number);
			max = max.max(number);
		}
		return max;
	}
})();
const minFunction = new (class MinFunction extends Callable {
	async call(env: Environment, ...args: any[]) {
		let min = new Decimal(Infinity);
		for (const number of args) {
			min = min.min(number);
		}
		return min;
	}
})();
const getFunction = new (class GetFunction extends Callable {
	async call(env: Environment, ...args: any[]) {
		if (args[0].get) {
			return args[0].get(args[1]);
		}
		throw new ReferenceError('cannot get index of non-gettable');
	}
})();
const setFunction = new (class SetFunction extends Callable {
	async call(env: Environment, ...args: any[]) {
		if (args[0].set) {
			return args[0].set(args[1], args[2]);
		}
		throw new ReferenceError('cannot set index of non-settable');
	}
})();
const getPlayerData = new (class getPlayerData extends Callable {
	async call(env: Environment, ...args: any[]) {
		return Object.freeze(JSON.parse(JSON.stringify(player)));
	}
})();

const parentEnvironment = new (class extends Environment {})();

parentEnvironment.set('puts', putf);
parentEnvironment.set('print', putf);
parentEnvironment.set('cout', putf);
parentEnvironment.set('dialog', putf);
parentEnvironment.set('delay', delayf);
parentEnvironment.set('wait', delayf);
parentEnvironment.set('string', toStringFunction);
parentEnvironment.set('get', getFunction);
parentEnvironment.set('set', setFunction);
parentEnvironment.set('player', getPlayerData);
parentEnvironment.isReadonly = true;

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
		throw new TypeError('错误的:hydra.dilute参数');
	}
})();
export function tryInclude(pkg: string) {
	if (pkg == 'math') {
		const readonlyDictionary = new Dictionary();
		readonlyDictionary.set('max', maxFunction);
		readonlyDictionary.set('min', minFunction);
		readonlyDictionary.readonly = true;
		parentEnvironment.isReadonly = false;
		parentEnvironment.set('math', readonlyDictionary);
		parentEnvironment.isReadonly = true;
		return;
	}
	if (pkg == 'hydra' && player.upgrades['ts_auto_pkg_hydra']) {
		const readonlyDictionaryHydra = new (class extends Dictionary {
			get(key: any) {
				if (key !== 'deduces') {
					return Dictionary.prototype.get.call(this, key);
				}
				if (key == 'deduces') {
					return new AutomatorArray([player.hydra.deduceOrdinal[0].add(1).sub(1)]);
				}
				return undefined;
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
		return;
	}
	if (pkg == 'music') {
		importMusic(parentEnvironment);
		return;
	}
	throw new ReferenceError('Cannot find package ' + pkg);
}
export { parentEnvironment };
