import { Dilute } from '@/core/hydra/dilute';
import { Hydra } from '@/core/hydra/hydra';
import { player } from '@/core/save';
import Decimal from 'break_eternity.js';
import { Callable, Dictionary, AutomatorArray } from '../a-objects';
import type { Environment } from '../environment';
import { UPGRADES, upgrades } from '@/core/mechanic';

export function importRbnr(parentEnvironment: Environment) {
	const readonlyDictionaryRbnr = new (class extends Dictionary {
		get(key: any) {
			if (key == 'upgs') {
				let a: (keyof typeof upgrades)[] = [];
				for (let key in upgrades) {
					let key2 = key;
					if (key2 in upgrades) {
						a.push(key2 as keyof typeof upgrades);
					}
				}
				a = a.filter((x) => upgrades[x].show());
				return new AutomatorArray(a);
			}
			return Dictionary.prototype.get.call(this, key);
		}
		set(key: any, value: any) {
			return Dictionary.prototype.set.call(this, key, value);
		}
	})();
	readonlyDictionaryRbnr.set(
		'buy',
		new (class extends Callable {
			async call(env: Environment, ...args: any[]) {
				let keyid = args[0];
				if (keyid in upgrades) {
					UPGRADES.buy(keyid);
				}
			}
		})(),
	);
	readonlyDictionaryRbnr.readonly = true;
	parentEnvironment.isReadonly = false;
	parentEnvironment.set('rbnr', readonlyDictionaryRbnr);
	parentEnvironment.isReadonly = true;
}
