import type { Entries } from 'type-fest';
import type { ASTNode, BlockStatementNode, FunctionDeclarationNode } from './compiler';
import { Environment } from './environment';
import { evaluateNode } from './evaluator';
import type Decimal from 'break_eternity.js';
import { format } from '@/utils/format';
export class AObject {
	get(key: any): AObject {
		throw new Error('Object not gettable');
	}
	set(key: any, value: any) {
		throw new Error('Object not settable');
	}
	has(key: any): boolean {
		throw new Error('Object is not hasable');
	}
	toString() {
		return '[AObject]';
	}
}
export interface Callable extends AObject {
	call(env: Environment, ...args: any[]): Promise<AObject>;

	toString(): string;
}
export class CodeCallable extends AObject implements Callable {
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

export class ReturnTag<T> extends AObject {
	value: T;
	constructor(value: T) {
		super();
		this.value = value;
	}
}

export class Dictionary<K = any, V extends AObject = AObject> extends AObject {
	keymap: Map<K, V> = new Map();
	readonly: boolean = false;
	get(key: any) {
		return this.keymap.get(key.toString()) ?? new AUndefined();
	}
	set(key: any, value: any) {
		if (this.readonly) throw new Error('Cannot set to readonly Dictionary');
		return this.keymap.set(key.toString(), value);
	}
	has(key: any) {
		return this.keymap.has(key.toString());
	}
	// dont use in automator env
	mapEntries() {
		return this.keymap.entries();
	}
	toString(parent?: any[]) {
		let res = '(';
		for (const a of this.mapEntries()) {
			if (a[1] instanceof Dictionary) {
				let q = '{recursion object}';
				let pass = true;
				if (parent) {
					for (let i = 0; i < (parent.length ?? 0); i++) {
						if (parent[i] === a[1]) {
							pass = false;
							break;
						}
					}
				}
				if (pass) {
					q = a[1].toString((parent ?? []).concat([this]));
				}

				res = res.concat(`${a[0]}=>${q},`);
			} else {
				res = res.concat(`${a[0]}=>${a[1].toString()},`);
			}
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

export class AUndefined extends AObject {
	toString() {
		return 'undefined';
	}
}
export class ADecimal extends AObject {
	dec: Decimal;
	constructor(dec: Decimal) {
		super();
		this.dec = dec;
	}
	toString() {
		return format(this.dec);
	}
}
export class AString extends AObject {
	str: string;
	constructor(str: string) {
		super();
		this.str = str;
	}
	toString(): string {
		return this.str;
	}
}
export class ABoolean extends AObject {
	bool: boolean;
	constructor(bool: boolean) {
		super();
		this.bool = bool;
	}
	toString(): string {
		return this.bool ? 'true' : 'false';
	}
}

export function isCallable(x: unknown): x is Callable {
	if (x === undefined) return false;
	if (x === null) return false;
	if (typeof x !== 'object') return false;
	if ('call' in x) {
		return true;
	}
	return false;
}
