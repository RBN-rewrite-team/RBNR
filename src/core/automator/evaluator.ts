import Decimal from 'break_eternity.js';
import {
	ArrayExpressionNode,
	AssignmentNode,
	ASTNode,
	BinaryExpressionNode,
	BlockStatementNode,
	ExpressionStatementNode,
	IdentifierNode,
	IfStatementNode,
	NumericLiteralNode,
	parseAndConvertToAst,
	StringLiteralNode,
	VariableDeclarationNode,
} from './compiler';
import { Environment } from './environment';

const operators = {
	'+': 'add',
	'-': 'sub',
	'*': 'mul',
	'/': 'div',
	'%': 'mod',
	'**': 'pow',
} as const;

export async function evaluateBinaryExpressionNode(node: BinaryExpressionNode, env: Environment) {
	const left = await evaluateNode(node.left, env);
	const right = await evaluateNode(node.right, env);

	if (left instanceof Decimal && right instanceof Decimal) {
		if (['+', '-', '*', '/', '%', '**'].includes(node.operator)) {
			const methodName = operators[node.operator as '+' | '-' | '*' | '/' | '%' | '**'];

			return left[methodName](right);
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

export function evaluateIdentifierNode(node: IdentifierNode, env: Environment) {
	const trytest = env.get(node.name);
	if (trytest === 'nul') throw new Error('Cannot found ' + node.name);
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
		result = await evaluateNode(node, env);
	}
	return result;
}
export async function compileAndEvaluate(code: string, env: Environment = window.env1) {
	return evaluateNode(parseAndConvertToAst(code), env);
}

declare global {
	interface Window {
		compileAndEvaluate: typeof compileAndEvaluate;
		env1: Environment;
	}
}
window.compileAndEvaluate = compileAndEvaluate;
window.env1 = new Environment();
