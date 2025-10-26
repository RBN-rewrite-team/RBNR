import Decimal from 'break_eternity.js';
import {
	ArrayExpressionNode,
	AssignmentNode,
	ASTNode,
	BinaryExpressionNode,
	BlockStatementNode,
	BooleanLiteralNode,
	CallExpressionNode,
	ExpressionStatementNode,
	ForStatementNode,
	FunctionDeclarationNode,
	GetPropertyNode,
	HashTableExpressionNode,
	IdentifierNode,
	IfStatementNode,
	IncludeStatementNode,
	MemberExpressionNode,
	NumericLiteralNode,
	parseAndConvertToAst,
	ReturnStatementNode,
	StringLiteralNode,
	UnaryExpressionNode,
	VariableDeclarationNode,
	WhileStatementNode,
} from './compiler';
import { Environment, parentEnvironment, tryInclude } from './environment';
import { AutomatorArray, Callable, CodeCallable, Dictionary, ReturnTag } from './a-objects';
import { player } from '../save';

let interrupt = false;

const operators = {
	'+': 'add',
	'-': 'sub',
	'*': 'mul',
	'/': 'div',
	'%': 'mod',
	'**': 'pow',
	'^': 'pow',
	'***': 'tetrate',
	'^^': 'tetrate',
	'<': 'lt',
	'>': 'gt',
	'<=': 'lte',
	'>=': 'gte',
	'==': 'eq',
	'!=': 'neq',
} as const;

export async function evaluateHashTableExpressionNode(
	node: HashTableExpressionNode,
	env: Environment,
) {
	const res = new Dictionary();
	for (const key in node.hashtable) {
		res.set(key, await evaluateNode(node.hashtable[key], env));
	}
	return res;
}

export async function evaluateFunctionDeclarationNode(
	node: FunctionDeclarationNode,
	env: Environment,
) {
	const callable = new CodeCallable(node);
	env.adddeclare(node.name);
	env.set(node.name, callable);
	return callable;
}

export async function evaluateForStatementNode(node: ForStatementNode, env: Environment) {
	const variabledeclaration = node.init;
	if (!variabledeclaration)
		throw new ReferenceError('Cannot found Variable Declaration of for statement');
	const condition = node.test;
	const increment = node.update;
	if (!condition) throw new ReferenceError('cannot found test statement');
	if (!increment) throw new ReferenceError('cannot found update statement');
	let r = null;
	for (
		await evaluateAssignmentNode(variabledeclaration, env);
		await evaluateNode(condition, env);
		await evaluateNode(increment, env)
	) {
		r = await evaluateNode(node.body, env);
		if (interrupt) return;
	}
	return r;
}

export async function evaluateWhileStatementNode(node: WhileStatementNode, env: Environment) {
	const condition = node.condition;
	const body = node.body;
	let r = null;
	while (await evaluateNode(condition, env)) {
		r = await evaluateNode(body, env);
		if (interrupt) return;
	}
	return r;
}

export async function evaluateBinaryExpressionNode(node: BinaryExpressionNode, env: Environment) {
	const left = await evaluateNode(node.left, env);
	const right = await evaluateNode(node.right, env);

	if (left instanceof Decimal && right instanceof Decimal) {
		if (
			[
				'+',
				'-',
				'*',
				'/',
				'%',
				'**',
				'^',
				'***',
				'^^',
				'<=',
				'>=',
				'<',
				'>',
				'==',
				'!=',
				'^^',
			].includes(node.operator)
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
						| '^'
						| '***'
						| '^^'
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
	throw new SyntaxError('Binary Expression Invalid');
}

export async function evaluateAssignmentNode(
	node: VariableDeclarationNode | AssignmentNode,
	env: Environment,
): Promise<any> {
	if (node instanceof VariableDeclarationNode) {
		env.adddeclare(node.identifierName);
		if (node.expression === null) return;
	}
	if (node.expression === null) throw new ReferenceError('Received null expression');
	const rightvalue = await evaluateNode(node.expression, env);
	env.set(node.identifierName, rightvalue);
	return rightvalue;
}

export async function evaluateCallExpressionNode(node: CallExpressionNode, env: Environment) {
	const callee = await evaluateNode(node.callee, env); // 修改：使用 callee 而不是 becalled
	const argsevaluated = [];
	for (let i = 0; i < node.arguments.length; i++) {
		argsevaluated.push(await evaluateNode(node.arguments[i], env));
		if (interrupt) return;
	}

	if (callee instanceof Callable) {
		return await callee.call(env, ...argsevaluated);
	}
	throw new TypeError('Callee is not callable');
}

export async function evaluateUnaryExpressionNode(node: UnaryExpressionNode, env: Environment) {
	const rightvalue = await evaluateNode(node.argument, env);

	if (rightvalue instanceof Decimal && node.operator == '-') {
		return rightvalue.neg();
	}
	if (node.operator == '!') {
		return !rightvalue;
	}
	throw new Error('Invalid unary expression');
}

export function evaluateIdentifierNode(node: IdentifierNode, env: Environment) {
	const trytest = env.get(node.name);
	if (trytest === null || trytest === undefined)
		throw new ReferenceError('Cannot found ' + node.name);
	return trytest;
}

export async function evaluateArrayExpressionNode(node: ArrayExpressionNode, env: Environment) {
	const result = [];
	for (let i = 0; i < node.elements.length; i++) {
		result.push(await evaluateNode(node.elements[i], env));
		if (interrupt) return result;
	}
	return new AutomatorArray(result);
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

// 新增：处理成员表达式（属性访问）
export async function evaluateMemberExpressionNode(node: MemberExpressionNode, env: Environment) {
	const object = await evaluateNode(node.object, env);
	const property = await evaluateNode(node.property, env);

	// 如果 property 是 IdentifierNode，获取其名称
	let propertyName: string;
	if (property instanceof IdentifierNode) {
		propertyName = property.name;
	} else if (typeof property === 'string') {
		propertyName = property;
	} else {
		throw new TypeError('Property must be an identifier or string');
	}

	// 尝试从对象获取属性
	if (object && typeof object === 'object' && propertyName in object) {
		return object[propertyName];
	}

	throw new ReferenceError(`Property '${propertyName}' not found on object`);
}

export async function evaluateGetPropertyNode(node: GetPropertyNode, env: Environment) {
	const leftval = await evaluateNode(node.expression, env);
	if (!leftval.get) throw new Error('cannot get leftval prop');
	return leftval.get(node.property);
}

export async function evaluateNode(node: ASTNode, env: Environment): Promise<any> {
	if (interrupt) return;
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
	} else if (node instanceof HashTableExpressionNode) {
		return await evaluateHashTableExpressionNode(node, env);
	} else if (node instanceof IncludeStatementNode) {
		return tryInclude(node.include);
	} else if (node instanceof MemberExpressionNode) {
		// 新增：处理成员表达式
		return await evaluateMemberExpressionNode(node, env);
	} else if (node instanceof UnaryExpressionNode) {
		return await evaluateUnaryExpressionNode(node, env);
	} else if (node instanceof BooleanLiteralNode) {
		return node.value;
	} else if (node instanceof GetPropertyNode) {
		return await evaluateGetPropertyNode(node, env);
	}
	console.error(node);
	throw new Error('Not implemented for ' + node.constructor.name);
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
	interrupt = false;
	let res = await evaluateNode(parseAndConvertToAst(code), env);
	if (interrupt) interrupt = false;
	return res;
}

declare global {
	interface Window {
		compileAndEvaluate: typeof compileAndEvaluate;
		env1: Environment;
	}
}

window.compileAndEvaluate = compileAndEvaluate;
window.env1 = new (class extends Environment {
	nodeclarecheck: boolean = false;
})(parentEnvironment);

export function setInterrupt(a: boolean) {
	interrupt = a;
}
