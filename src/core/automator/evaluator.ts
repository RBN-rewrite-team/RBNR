import Decimal from 'break_eternity.js';
import {
	ArrayExpressionNode,
	AssignmentNode,
	ASTNode,
	BinaryExpressionNode,
	BlockStatementNode,
	CallExpressionNode,
	ExpressionStatementNode,
	ForStatementNode,
	FunctionDeclarationNode,
	IdentifierNode,
	IfStatementNode,
	NumericLiteralNode,
	parseAndConvertToAst,
	ReturnStatementNode,
	StringLiteralNode,
	VariableDeclarationNode,
	WhileStatementNode,
} from './compiler';
import { Environment, parentEnvironment } from './environment';
import { Callable, CodeCallable, ReturnTag } from './a-objects';
import { player } from '../save';
let interrupt = false;
const operators = {
	'+': 'add',
	'-': 'sub',
	'*': 'mul',
	'/': 'div',
	'%': 'mod',
	'**': 'pow',
	'^^': 'tetrate',
	'<': 'lt',
	'>': 'gt',
	'<=': 'lte',
	'>=': 'gte',
	'==': 'eq',
	'!=': 'neq',
} as const;
export async function evaluateFunctionDeclarationNode(
	node: FunctionDeclarationNode,
	env: Environment,
) {
	const callable = new CodeCallable(node);

	env.set(node.name, callable);
	return callable;
}
export async function evaluateForStatementNode(node: ForStatementNode, env: Environment) {
	const variabledeclaration = node.init;
	if (!variabledeclaration) throw new Error('Cannot found Variable Declaration of for statement');
	const condition = node.test;
	const increment = node.update;
	if (!condition) throw new Error('cannot found test statement');
	if (!increment) throw new Error('cannot found update statement');
	let r = null;
	for (
		await evaluateAssignmentNode(variabledeclaration, env);
		await evaluateNode(condition, env);
		await evaluateNode(increment, env)
	) {
		r = await evaluateNode(node.body, env);
	}
	return r;
}
export async function evaluateWhileStatementNode(node: WhileStatementNode, env: Environment) {
	const condition = node.condition;
	const body = node.body;
	let r = null;
	while (await evaluateNode(condition, env)) {
		r = await evaluateNode(body, env);
	}
	return r;
}
export async function evaluateBinaryExpressionNode(node: BinaryExpressionNode, env: Environment) {
	const left = await evaluateNode(node.left, env);
	const right = await evaluateNode(node.right, env);

	if (left instanceof Decimal && right instanceof Decimal) {
		if (
			['+', '-', '*', '/', '%', '**', '<=', '>=', '<', '>', '==', '!=', '^^'].includes(
				node.operator,
			)
		) {
			const methodName =
				operators[
					node.operator as
						| '+'
						| '-'
						| '*'
						| '/'
						| '%'
						| '**'
						| '<='
						| '>='
						| '<'
						| '>'
						| '=='
						| '!='
						| '^^'
				];
			if (methodName === 'tetrate') return left[methodName](right.toNumber());
			else return left[methodName](right);
		}
	} else if (typeof left === 'string' && typeof right === 'string') {
		if (node.operator === '+') return left + right;
	}
	console.error(node);
	throw new Error('Binary Expression Invalid');
}

export async function evaluateAssignmentNode(
	node: VariableDeclarationNode | AssignmentNode,
	env: Environment,
): Promise<any> {
	if (node.expression === null) throw new Error('Received null expression');
	const rightvalue = await evaluateNode(node.expression, env);
	env.set(node.identifierName, rightvalue);
	return rightvalue;
}
export async function evaluateCallExpressionNode(node: CallExpressionNode, env: Environment) {
	const leftval = await evaluateNode(node.becalled, env);
	const argsevaluated = [];
	for (let i = 0; i < node.arguments.length; i++) {
		argsevaluated.push(await evaluateNode(node.arguments[i], env));
	}

	if (leftval instanceof Callable) {
		return await leftval.call(env, ...argsevaluated);
	}
	throw new Error('left Value is not callable');
}
export function evaluateIdentifierNode(node: IdentifierNode, env: Environment) {
	const trytest = env.get(node.name);
	if (trytest === null || trytest === undefined) throw new Error('Cannot found ' + node.name);
	return trytest;
}
export async function evaluateArrayExpressionNode(node: ArrayExpressionNode, env: Environment) {
	const result = [];
	for (let i = 0; i < node.elements.length; i++) {
		result.push(await evaluateNode(node.elements[i], env));
	}
	return result;
}
export async function evaluateIfStatementNode(node: IfStatementNode, env: Environment) {
	const trycondition = await evaluateNode(node.condition, env);
	if (trycondition) return await evaluateNode(node.consequent, env);
	else {
		if (node.alternate === null) return null;
		return await evaluateNode(node.alternate, env);
	}
}
export async function evaluateReturnStatementNode(node: ReturnStatementNode, env: Environment) {
	if (node.argument === null) throw new Error('Cannot find node argument');
	return new ReturnTag(await evaluateNode(node.argument, env));
}
export async function evaluateNode(node: ASTNode, env: Environment): Promise<any> {
	if (node instanceof BlockStatementNode) {
		return await evaluateBlockStatement(node, env);
	} else if (node instanceof VariableDeclarationNode || node instanceof AssignmentNode) {
		return await evaluateAssignmentNode(node, env);
	} else if (node instanceof NumericLiteralNode) {
		return node.value;
	} else if (node instanceof ExpressionStatementNode) {
		return await evaluateNode(node.expression, env);
	} else if (node instanceof IdentifierNode) {
		return evaluateIdentifierNode(node, env);
	} else if (node instanceof StringLiteralNode) {
		return node.value;
	} else if (node instanceof ArrayExpressionNode) {
		return await evaluateArrayExpressionNode(node, env);
	} else if (node instanceof IfStatementNode) {
		return await evaluateIfStatementNode(node, env);
	} else if (node instanceof BinaryExpressionNode) {
		return await evaluateBinaryExpressionNode(node, env);
	} else if (node instanceof ForStatementNode) {
		return await evaluateForStatementNode(node, env);
	} else if (node instanceof WhileStatementNode) {
		return await evaluateWhileStatementNode(node, env);
	} else if (node instanceof ReturnStatementNode) {
		return await evaluateReturnStatementNode(node, env);
	} else if (node instanceof FunctionDeclarationNode) {
		return await evaluateFunctionDeclarationNode(node, env);
	} else if (node instanceof CallExpressionNode) {
		return await evaluateCallExpressionNode(node, env);
	}
	console.error(node);
	throw new Error('Not implemented for ');
}
export async function evaluateBlockStatement(
	program: BlockStatementNode,
	env: Environment,
): Promise<any> {
	let result;
	for (const node of program.body) {
		if (player.timeshard.value.lt(0.1)) {
			return result;
		}
		player.timeshard.value = player.timeshard.value.sub(0.1);
		result = await evaluateNode(node, env);
		if (result instanceof ReturnTag) {
			return result.value;
		}
		if (interrupt) return result;
	}
	return result;
}
export async function compileAndEvaluate(code: string, env: Environment = window.env1) {
	return await evaluateNode(parseAndConvertToAst(code), env);
}

declare global {
	interface Window {
		compileAndEvaluate: typeof compileAndEvaluate;
		env1: Environment;
	}
}
window.compileAndEvaluate = compileAndEvaluate;
window.env1 = new Environment(parentEnvironment);
