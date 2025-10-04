import type { ASTNode, BlockStatementNode, FunctionDeclarationNode } from './compiler';
import { Environment } from './environment';
import { evaluateNode } from './evaluator';

export class Callable {
	async call(env: Environment, ...args: any[]) {}
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
}

export class ReturnTag<T> {
	value: T;
	constructor(value: T) {
		this.value = value;
	}
}
