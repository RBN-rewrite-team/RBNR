import type { Entries } from 'type-fest';
import type { ASTNode, BlockStatementNode, FunctionDeclarationNode } from './compiler';
import { Environment } from './environment';
import { evaluateNode } from './evaluator';
import type Decimal from 'break_eternity.js';

export class Callable {
	async call(env: Environment, ...args: any[]): Promise<any> {}

	toString() {
		return `[javascript function]`;
	}
}
export class CodeCallable extends Callable {
	body: BlockStatementNode;
	node: FunctionDeclarationNode;
	async call(env: Environment, ...args: any[]) {
		const localEnvironment = new Environment(env);
		let i = 0;
		for (const identifiernode of this.node.parameters) {
			localEnvironment.set(identifiernode.name, args[i]);
			i++;
		}
		const result = await evaluateNode(this.body, localEnvironment);
		return result;
	}
	constructor(body: FunctionDeclarationNode) {
		super();
		this.body = body.body;
		this.node = body;
	}
	toString(): string {
		return `function`;
	}
}

export class ReturnTag<T> {
	value: T;
	constructor(value: T) {
		this.value = value;
	}
}

export class Dictionary<K = any, V = any> {
	keymap: Map<K, V> = new Map();
	readonly: boolean = false;
	get(key: any) {
		console.log(this.keymap, key);
		return this.keymap.get(key);
	}
	set(key: any, value: any) {
		if (this.readonly) throw new Error('Cannot set to readonly Dictionary');
		return this.keymap.set(key, value);
	}
	has(key: any) {
		return this.keymap.has(key);
	}
	// dont use in automator env
	mapEntries() {
		return this.keymap.entries();
	}
	toString() {
		let res = '(';
		for (let a of this.mapEntries()) {
			res = res.concat(`${a[0]}=>${a[1]},`);
		}
		res = res.slice(0, -1) + ')';
		return res;
	}
}
export class AutomatorArray extends Dictionary<string, any> {
	constructor(arr: ArrayLike<any>) {
		super();
		for (const entr of Object.entries(arr)) {
			this.keymap.set(String(entr[0]), entr[1]);
		}
	}
	get(key: Decimal) {
		return this.keymap.get(String(key));
	}
	set(key: Decimal, value: any) {
		return this.keymap.set(String(key), value);
	}
}
