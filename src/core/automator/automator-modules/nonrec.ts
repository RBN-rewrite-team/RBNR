import { Dilute } from '@/core/hydra/dilute';
import { Hydra } from '@/core/hydra/hydra';
import { player } from '@/core/save';
import Decimal from 'break_eternity.js';
import { Callable, Dictionary, AutomatorArray } from '../a-objects';
import type { Environment } from '../environment';
import { buyStudies, studies } from '@/core/nonrecu/studies';
import { NON_RECURSIVE } from '@/core/nonrecu';

const nonrecBuyStudyFunction = new (class extends Callable {
	async call(env: Environment, ...args: any[]) {
		for (let i = 0; i < args.length; i++) {
			if (Number(args[i]) in studies) {
				buyStudies(Number(args[i]));
			}
		}
	}
})();
const nonrecResetFunction = new (class extends Callable {
	async call(env: Environment, ...args: any[]) {
		if (NON_RECURSIVE.resetable()) NON_RECURSIVE.reset();
	}
})();
const nonrecRespecFunction = new (class extends Callable {
	async call(env: Environment, ...args: any[]) {
		if (NON_RECURSIVE.resetable()) NON_RECURSIVE.reset();
	}
})();
export function importNonrec(parentEnvironment: Environment) {
	const readonlyDictionaryNonrec = new (class extends Dictionary {
		get(key: any) {
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
