import ModalService from '@/utils/Modal';
import { Callable } from './a-objects';
import { formatResult } from '.';
import { Call } from './lexer';

export class Environment {
	parent: Environment | null = null;
	map: Map<string, any> = new Map();
	constructor(parent?: Environment) {
		if (parent) this.parent = parent;
	}
	get(key: string): any {
		return this.map.get(key) ?? this.parent?.get?.(key);
	}
	set(key: string, value: any) {
		return this.map.set(key, value);
	}
	has(key: string): boolean {
		return this.map.has(key) ? (this.parent?.has?.(key) ?? false) : false;
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
			throw new Error('1 argument required, but no or more arguments');
		}
		return args[0].toString();
	}
}
const putf = new PutFunction();
const delayf = new DelayFunction();
const toStringFunction = new ToStringFunction();
const maxFunction = new (class MaxFunction extends Callable {
	async call(env: Environment, ...args: any[]) {
		return Math.max(...args);
	}
})();
const minFunction = new (class MinFunction extends Callable {
	async call(env: Environment, ...args: any[]) {
		return Math.min(...args);
	}
})();
const getFunction = new (class GetFunction extends Callable {
	async call(env: Environment, ...args: any[]) {
		if (args[0] === window) throw new Error('检测到越界访问行为，该访问已被禁止');
		return args[0][args[1]];
	}
})();
const setFunction = new (class SetFunction extends Callable {
	async call(env: Environment, ...args: any[]) {
		return (args[0][args[1]] = args[2]);
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
parentEnvironment.set('max', maxFunction);
parentEnvironment.set('min', minFunction);
parentEnvironment.set('get', getFunction);
parentEnvironment.set('set', setFunction);

export { parentEnvironment };
