import ModalService from '@/utils/Modal';
import { Callable } from './a-objects';
import { formatResult } from '.';

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
const putf = new PutFunction();
const delayf = new DelayFunction();
const parentEnvironment = new Environment();

parentEnvironment.set('puts', putf);
parentEnvironment.set('print', putf);
parentEnvironment.set('cout', putf);
parentEnvironment.set('delay', delayf);
parentEnvironment.set('wait', delayf);

export { parentEnvironment };
