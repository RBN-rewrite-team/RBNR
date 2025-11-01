import { player } from '@/core/save';
import { type Callable, Dictionary, AObject, ADecimal, AUndefined } from '../a-objects';
import type { Environment } from '../environment';
import { buyStudies, resetTheories, studies } from '@/core/nonrecu/studies';
import { NON_RECURSIVE } from '@/core/nonrecu';

const nonrecBuyStudyFunction = new (class extends AObject implements Callable {
	async call(env: Environment, ...args: any[]) {
		for (let i = 0; i < args.length; i++) {
			if (i >= 1) {
				if (player.timeshard.value.lt(0.05)) {
					return new AUndefined();
				}
				player.timeshard.value = player.timeshard.value.sub(0.05);
			}
			if (Number(args[i]) in studies) {
				buyStudies(Number(args[i]));
			}
		}
		return new AUndefined();
	}
})();
const nonrecResetFunction = new (class extends AObject implements Callable {
	async call(env: Environment, ...args: any[]) {
		if (NON_RECURSIVE.resetable()) NON_RECURSIVE.reset();
		return new AUndefined();
	}
})();
const nonrecRespecFunction = new (class extends AObject implements Callable {
	async call(env: Environment, ...args: any[]) {
		if (NON_RECURSIVE.resetable()) resetTheories();
		return new AUndefined();
	}
})();
export function importNonrec(parentEnvironment: Environment) {
	const readonlyDictionaryNonrec = new (class extends Dictionary {
		get(key: any) {
			if (key == 'power') {
				return new ADecimal(player.nonrecu.power);
			}
			return Dictionary.prototype.get.call(this, key);
		}
		set(key: any, value: any) {
			return Dictionary.prototype.set.call(this, key, value);
		}
	})();
	readonlyDictionaryNonrec.set('buyStudy', nonrecBuyStudyFunction);
	readonlyDictionaryNonrec.set('respec', nonrecRespecFunction);
	readonlyDictionaryNonrec.set('reset', nonrecResetFunction);
	readonlyDictionaryNonrec.readonly = true;
	parentEnvironment.isReadonly = false;
	parentEnvironment.set('nonrec', readonlyDictionaryNonrec);
	parentEnvironment.isReadonly = true;
}
