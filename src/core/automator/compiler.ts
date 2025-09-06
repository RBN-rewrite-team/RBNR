import AutomatorLexer from './lexer.ts';
import parserInstance, { AutomatorParser } from './parser.ts';
import Decimal from 'break_eternity.js';

class ASTNode {
	type: string;

	constructor(type: string) {
		this.type = type;
	}
}

class VariableDeclarationNode extends ASTNode {
	identifierName: string;
	expression: ASTNode | null;
	isConst: boolean;

	constructor(identifierName: string, isConst: boolean, expression?: ASTNode) {
		super('VariableDeclaration');
		this.identifierName = identifierName;
		this.isConst = isConst;
		this.expression = expression || null;
	}
}

class AssignmentNode extends ASTNode {
	identifierName: string;
	expression: ASTNode;

	constructor(identifierName: string, expression: ASTNode) {
		super('Assignment');
		this.identifierName = identifierName;
		this.expression = expression;
	}
}

class BinaryExpressionNode extends ASTNode {
	operator: string;
	left: ASTNode;
	right: ASTNode;

	constructor(operator: string, left: ASTNode, right: ASTNode) {
		super('BinaryExpression');
		this.operator = operator;
		this.left = left;
		this.right = right;
	}
}

class UnaryExpressionNode extends ASTNode {
	operator: string;
	argument: ASTNode;

	constructor(operator: string, argument: ASTNode) {
		super('UnaryExpression');
		this.operator = operator;
		this.argument = argument;
	}
}

class IdentifierNode extends ASTNode {
	name: string;

	constructor(name: string) {
		super('Identifier');
		this.name = name;
	}
}

class NumericLiteralNode extends ASTNode {
	value: Decimal;

	constructor(value: Decimal) {
		super('NumericLiteral');
		this.value = value;
	}
}

class StringLiteralNode extends ASTNode {
	value: string;

	constructor(value: string) {
		super('StringLiteral');
		this.value = value;
	}
}

class BooleanLiteralNode extends ASTNode {
	value: boolean;

	constructor(value: boolean) {
		super('BooleanLiteral');
		this.value = value;
	}
}

class IfStatementNode extends ASTNode {
	condition: ASTNode;
	consequent: ASTNode;
	alternate: ASTNode | null;

	constructor(condition: ASTNode, consequent: ASTNode, alternate?: ASTNode) {
		super('IfStatement');
		this.condition = condition;
		this.consequent = consequent;
		this.alternate = alternate || null;
	}
}

class ForStatementNode extends ASTNode {
	init: ASTNode | null;
	test: ASTNode | null;
	update: ASTNode | null;
	body: ASTNode;

	constructor(init: ASTNode | null, test: ASTNode | null, update: ASTNode | null, body: ASTNode) {
		super('ForStatement');
		this.init = init;
		this.test = test;
		this.update = update;
		this.body = body;
	}
}

class ForInStatementNode extends ASTNode {
	variable: IdentifierNode;
	iterable: ASTNode;
	body: ASTNode;

	constructor(variable: IdentifierNode, iterable: ASTNode, body: ASTNode) {
		super('ForInStatement');
		this.variable = variable;
		this.iterable = iterable;
		this.body = body;
	}
}

class WhileStatementNode extends ASTNode {
	condition: ASTNode;
	body: ASTNode;

	constructor(condition: ASTNode, body: ASTNode) {
		super('WhileStatement');
		this.condition = condition;
		this.body = body;
	}
}

class ReturnStatementNode extends ASTNode {
	argument: ASTNode | null;

	constructor(argument?: ASTNode) {
		super('ReturnStatement');
		this.argument = argument ?? null;
	}
}

class FunctionDeclarationNode extends ASTNode {
	name: string;
	parameters: IdentifierNode[];
	body: BlockStatementNode;

	constructor(name: string, parameters: IdentifierNode[], body: BlockStatementNode) {
		super('FunctionDeclaration');
		this.name = name;
		this.parameters = parameters;
		this.body = body;
	}
}

class BlockStatementNode extends ASTNode {
	body: ASTNode[];

	constructor(body: ASTNode[]) {
		super('BlockStatement');
		this.body = body;
	}
}

class ExpressionStatementNode extends ASTNode {
	expression: ASTNode;

	constructor(expression: ASTNode) {
		super('ExpressionStatement');
		this.expression = expression;
	}
}

class ArrayExpressionNode extends ASTNode {
	elements: ASTNode[];

	constructor(elements: ASTNode[]) {
		super('ArrayExpression');
		this.elements = elements;
	}
}

class CstToAstVisitor extends parserInstance.getBaseCstVisitorConstructor() {
	constructor() {
		super();
		this.validateVisitor();
	}

	program(ctx: any) {
		const statements = ctx.statement?.map((stmt: any) => this.visit(stmt)) || [];
		return new BlockStatementNode(statements);
	}

	statement(ctx: any) {
		if (ctx.variableDeclaration) {
			return this.visit(ctx.variableDeclaration);
		} else if (ctx.assignment) {
			return this.visit(ctx.assignment);
		} else if (ctx.ifStatement) {
			return this.visit(ctx.ifStatement);
		} else if (ctx.forStatement) {
			return this.visit(ctx.forStatement);
		} else if (ctx.forInStatement) {
			return this.visit(ctx.forInStatement);
		} else if (ctx.whileStatement) {
			return this.visit(ctx.whileStatement);
		} else if (ctx.returnStatement) {
			return this.visit(ctx.returnStatement);
		} else if (ctx.functionDeclaration) {
			return this.visit(ctx.functionDeclaration);
		} else if (ctx.expressionStatement) {
			return this.visit(ctx.expressionStatement);
		} else if (ctx.blockStatement) {
			return this.visit(ctx.blockStatement);
		}
		throw new Error('Unknown statement type');
	}

	variableDeclaration(ctx: any) {
		const isConst = !!ctx.Const;
		const identifierName = ctx.Identifier[0].image;
		const expression = ctx.expression ? this.visit(ctx.expression[0]) : undefined;
		return new VariableDeclarationNode(identifierName, isConst, expression);
	}

	assignment(ctx: any) {
		const identifierName = ctx.Identifier[0].image;
		const expression = this.visit(ctx.expression[0]);
		return new AssignmentNode(identifierName, expression);
	}

	ifStatement(ctx: any) {
		const condition = this.visit(ctx.expression[0]);
		const consequent = this.visit(ctx.statement[0]);
		const alternate = ctx.Else ? this.visit(ctx.statement[1]) : undefined;
		return new IfStatementNode(condition, consequent, alternate);
	}

	forStatement(ctx: any) {
		const init = ctx.variableDeclaration ? this.visit(ctx.variableDeclaration[0]) : null;
		const test = ctx.expression && ctx.expression[0] ? this.visit(ctx.expression[0]) : null;
		const update = ctx.expression && ctx.expression[1] ? this.visit(ctx.expression[1]) : null;
		const body = this.visit(ctx.statement[0]);
		return new ForStatementNode(init, test, update, body);
	}

	forInStatement(ctx: any) {
		const variable = new IdentifierNode(ctx.Identifier[0].image);
		const iterable = this.visit(ctx.expression[0]);
		const body = this.visit(ctx.statement[0]);
		return new ForInStatementNode(variable, iterable, body);
	}

	whileStatement(ctx: any) {
		const condition = this.visit(ctx.expression[0]);
		const body = this.visit(ctx.statement[0]);
		return new WhileStatementNode(condition, body);
	}

	functionDeclaration(ctx: any) {
		const name = ctx.Identifier[0].image;
		const parameters = ctx.parameterList ? this.visit(ctx.parameterList[0]) : [];
		const body = this.visit(ctx.blockStatement[0]);
		return new FunctionDeclarationNode(name, parameters, body);
	}

	parameterList(ctx: any) {
		const parameters: IdentifierNode[] = [];

		if (ctx.Identifier) {
			for (const identifier of ctx.Identifier) {
				parameters.push(new IdentifierNode(identifier.image));
			}
		}

		return parameters;
	}

	expressionStatement(ctx: any) {
		const expression = this.visit(ctx.noAssignmentExpression[0]);
		return new ExpressionStatementNode(expression);
	}

	blockStatement(ctx: any) {
		const body = ctx.statement?.map((stmt: any) => this.visit(stmt)) || [];
		return new BlockStatementNode(body);
	}

	expression(ctx: any) {
		return this.visit(ctx.assignmentExpression[0]);
	}

	noAssignmentExpression(ctx: any) {
		return this.visit(ctx.logicalOrExpression[0]);
	}

	assignmentExpression(ctx: any) {
		if (ctx.Assign) {
			const left = this.visit(ctx.logicalOrExpression[0]);
			const right = this.visit(ctx.assignmentExpression[0]);

			if (left.type !== 'Identifier') {
				throw new Error('Left side of assignment must be an identifier');
			}

			return new AssignmentNode((left as IdentifierNode).name, right);
		}

		return this.visit(ctx.logicalOrExpression[0]);
	}

	returnStatement(ctx: any) {
		const argument = ctx.expression ? this.visit(ctx.expression[0]) : undefined;
		return new ReturnStatementNode(argument);
	}

	logicalOrExpression(ctx: any) {
		if (ctx.Or) {
			let left = this.visit(ctx.logicalAndExpression[0]);

			for (let i = 0; i < ctx.Or.length; i++) {
				const right = this.visit(ctx.logicalAndExpression[i + 1]);
				left = new BinaryExpressionNode('||', left, right);
			}

			return left;
		}

		return this.visit(ctx.logicalAndExpression[0]);
	}

	logicalAndExpression(ctx: any) {
		if (ctx.And) {
			let left = this.visit(ctx.bitwiseXorExpression[0]);

			for (let i = 0; i < ctx.And.length; i++) {
				const right = this.visit(ctx.bitwiseXorExpression[i + 1]);
				left = new BinaryExpressionNode('&&', left, right);
			}

			return left;
		}

		return this.visit(ctx.bitwiseXorExpression[0]);
	}

	bitwiseXorExpression(ctx: any) {
		if (ctx.Xor) {
			let left = this.visit(ctx.equalityExpression[0]);

			for (let i = 0; i < ctx.Xor.length; i++) {
				const right = this.visit(ctx.equalityExpression[i + 1]);
				left = new BinaryExpressionNode('^', left, right);
			}

			return left;
		}

		return this.visit(ctx.equalityExpression[0]);
	}

	equalityExpression(ctx: any) {
		if (ctx.Equal || ctx.NotEqual) {
			let left = this.visit(ctx.relationalExpression[0]);

			for (let i = 0; i < (ctx.Equal?.length || ctx.NotEqual?.length); i++) {
				const operator = ctx.Equal?.[i] ? '==' : '!=';
				const right = this.visit(ctx.relationalExpression[i + 1]);
				left = new BinaryExpressionNode(operator, left, right);
			}

			return left;
		}

		return this.visit(ctx.relationalExpression[0]);
	}

	relationalExpression(ctx: any) {
		if (ctx.LessThan || ctx.GreaterThan || ctx.LessThanOrEqualTo || ctx.GreaterThanOrEqualTo) {
			let left = this.visit(ctx.additiveExpression[0]);

			for (
				let i = 0;
				i <
				(ctx.LessThan?.length ||
					ctx.GreaterThan?.length ||
					ctx.LessThanOrEqualTo?.length ||
					ctx.GreaterThanOrEqualTo?.length);
				i++
			) {
				let operator: string;

				if (ctx.LessThan?.[i]) operator = '<';
				else if (ctx.GreaterThan?.[i]) operator = '>';
				else if (ctx.LessThanOrEqualTo?.[i]) operator = '<=';
				else operator = '>=';

				const right = this.visit(ctx.additiveExpression[i + 1]);
				left = new BinaryExpressionNode(operator, left, right);
			}

			return left;
		}

		return this.visit(ctx.additiveExpression[0]);
	}

	additiveExpression(ctx: any) {
		if (ctx.Add || ctx.Sub) {
			let left = this.visit(ctx.multiplicativeExpression[0]);

			for (let i = 0; i < (ctx.Add?.length || ctx.Sub?.length); i++) {
				const operator = ctx.Add?.[i] ? '+' : '-';
				const right = this.visit(ctx.multiplicativeExpression[i + 1]);
				left = new BinaryExpressionNode(operator, left, right);
			}

			return left;
		}

		return this.visit(ctx.multiplicativeExpression[0]);
	}

	multiplicativeExpression(ctx: any) {
		if (ctx.Mul || ctx.Mod || ctx.Div) {
			let left = this.visit(ctx.exponentialExpression[0]);

			for (let i = 0; i < (ctx.Mul?.length || ctx.Mod?.length || ctx.Div?.length); i++) {
				const operator = ctx.Mul?.[i] ? '*' : ctx.Div?.[i] ? '/' : '%';
				const right = this.visit(ctx.exponentialExpression[i + 1]);
				left = new BinaryExpressionNode(operator, left, right);
			}

			return left;
		}

		return this.visit(ctx.exponentialExpression[0]);
	}

	exponentialExpression(ctx: any) {
		if (ctx.Pow || ctx.Tetrate) {
			let left = this.visit(ctx.unaryExpression[0]);

			for (let i = 0; i < (ctx.Pow?.length || ctx.Tetrate?.length); i++) {
				const operator = ctx.Pow?.[i] ? '**' : '^^';
				const right = this.visit(ctx.unaryExpression[i + 1]);
				left = new BinaryExpressionNode(operator, left, right);
			}

			return left;
		}

		return this.visit(ctx.unaryExpression[0]);
	}

	unaryExpression(ctx: any) {
		if (ctx.Not || ctx.Sub) {
			const operator = ctx.Not?.[0] ? '!' : '-';
			const argument = this.visit(ctx.unaryExpression[0]);
			return new UnaryExpressionNode(operator, argument);
		}

		return this.visit(ctx.primaryExpression[0]);
	}

	primaryExpression(ctx: any) {
		if (ctx.Number) {
			return new NumericLiteralNode(new Decimal(ctx.Number[0].image));
		} else if (ctx.StringLiteral) {
			const str = ctx.StringLiteral[0].image;
			return new StringLiteralNode(str.substring(1, str.length - 1));
		} else if (ctx.True) {
			return new BooleanLiteralNode(true);
		} else if (ctx.False) {
			return new BooleanLiteralNode(false);
		} else if (ctx.Identifier) {
			return new IdentifierNode(ctx.Identifier[0].image);
		} else if (ctx.expression) {
			return this.visit(ctx.expression[0]);
		} else if (ctx.LBracket) {
			const elements = ctx.arrayElements ? this.visit(ctx.arrayElements[0]) : [];
			return new ArrayExpressionNode(elements);
		}

		console.log(ctx);
		throw new Error('Unknown primary expression');
	}

	arrayElements(ctx: any) {
		const elements: ASTNode[] = [];

		if (ctx.expression) {
			for (const expr of ctx.expression) {
				elements.push(this.visit(expr));
			}
		}

		return elements;
	}
}

function parseAndConvertToAst(code: string) {
	const lexResult = AutomatorLexer.tokenize(code);

	if (lexResult.errors.length > 0) {
		throw new Error('词法分析出错：' + lexResult.errors.map((e) => e.message).join(', '));
	}

	const parser = new AutomatorParser();
	parser.input = lexResult.tokens;
	const cst = parser.program();

	if (parser.errors.length > 0) {
		throw new Error('语法解析出错：' + parser.errors.map((e) => e.message).join(', '));
	}

	const visitor = new CstToAstVisitor();
	return visitor.visit(cst);
}

export {
	ASTNode,
	VariableDeclarationNode,
	AssignmentNode,
	BinaryExpressionNode,
	UnaryExpressionNode,
	IdentifierNode,
	NumericLiteralNode,
	StringLiteralNode,
	BooleanLiteralNode,
	IfStatementNode,
	ForStatementNode,
	ForInStatementNode,
	WhileStatementNode,
	FunctionDeclarationNode,
	BlockStatementNode,
	ExpressionStatementNode,
	ArrayExpressionNode,
	CstToAstVisitor,
	ReturnStatementNode,
	parseAndConvertToAst,
};
