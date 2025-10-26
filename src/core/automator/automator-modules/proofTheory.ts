import { PTresetCore } from "../../pt/index.ts"
import { Callable, Dictionary } from '../a-objects';
import type { Environment } from '../environment';
const ptResetFunction = new (class MinFunction extends Callable {
	async call(env: Environment, ...args: any[]) {
		PTresetCore()
	}
})();
export function importPT(parentEnvironment: Environment) {
	const readonlyDictionary = new Dictionary();
	readonlyDictionary.set('reset', ptResetFunction);
	readonlyDictionary.readonly = true;
	parentEnvironment.isReadonly = false;
	parentEnvironment.set('proofTheory', readonlyDictionary);
	parentEnvironment.isReadonly = true;
}
