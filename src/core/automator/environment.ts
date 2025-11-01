import ModalService from '@/utils/Modal';
import { ABoolean, AObject, AUndefined, type Callable } from './a-objects';
import { formatResult } from '.';
import { player } from '../global';

export class Environment {
	parent: Environment | null = null;
	map: Map<string, AObject> = new Map();
	isReadonly: boolean = false;
	declared: Set<string> = new Set();
	nodeclarecheck = true;
	constructor(parent?: Environment, readonly = false) {
		if (parent) this.parent = parent;
		this.isReadonly = readonly;
	}
	get(key: string): AObject {
		const res = this.map.get(key) ?? this.parent?.get?.(key);
		if (res === undefined && !this.nodeclarecheck && !this.declared.has(key)) {
			throw new ReferenceError('未声明变量');
		}
		return res ?? new AUndefined();
	}
	set(key: string, value: AObject) {
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

class PutFunction extends AObject implements Callable {
	call(env: Environment, ...args: any[]) {
		return new Promise<AObject>(function (resolve) {
			ModalService.show({
				title: '自动机提示',
				content: formatResult(args[0]),
				onConfirm() {
					resolve(new ABoolean(true));
				},
				onClose() {
					resolve(new ABoolean(false));
				},
			});
		});
	}
}
class DelayFunction extends AObject implements Callable {
	call(env: Environment, ...args: any[]) {
		return new Promise<AObject>(function (resolve) {
			setTimeout(() => {
				resolve(new AUndefined());
			}, args[0].dec.toNumber());
		});
	}
}
class ToStringFunction extends AObject implements Callable {
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

const getFunction = new (class GetFunction extends AObject implements Callable {
	async call(env: Environment, ...args: any[]) {
		if (args[0].get) {
			return args[0].get(args[1]);
		}
		throw new ReferenceError('cannot get index of non-gettable');
	}
})();
const setFunction = new (class SetFunction extends AObject implements Callable {
	async call(env: Environment, ...args: any[]) {
		if (args[0].set) {
			return args[0].set(args[1], args[2]);
		}
		throw new ReferenceError('cannot set index of non-settable');
	}
})();
const getPlayerData = new (class getPlayerData extends AObject implements Callable {
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
export { tryInclude } from './module-include';
export { parentEnvironment };
