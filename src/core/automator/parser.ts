import { CstParser } from 'chevrotain';
import {
	allTokens,
	AutomatorLexer,
	Identifier,
	Var,
	For,
	ForIn,
	While,
	Const,
	False,
	True,
	If,
	Else,
	FunctionKeyword,
	And,
	Or,
	Not,
	Xor,
	Add,
	Sub,
	Mul,
	Div,
	Pow,
	Mod,
	Tetrate,
	NumberLiteral,
	StringLiteral,
	Comma,
	SemiColen,
	GreaterThan,
	LessThan,
	Equal,
	NotEqual,
	LessThanOrEqualTo,
	GreaterThanOrEqualTo,
	LParen,
	RParen,
	LBrace,
	RBrace,
	LBracket,
	RBracket,
	Assign,
	Return,
	Call,
} from './lexer';

export class AutomatorParser extends CstParser {
	constructor() {
		super(allTokens);

		this.performSelfAnalysis();
	}

	public program = this.RULE('program', () => {
		this.MANY(() => {
			this.SUBRULE(this.statement);
		});
	});

	public statement = this.RULE('statement', () => {
		this.OR([
			{ ALT: () => this.SUBRULE(this.variableDeclaration) },
			{ ALT: () => this.SUBRULE(this.assignment) },
			{ ALT: () => this.SUBRULE(this.ifStatement) },
			{ ALT: () => this.SUBRULE(this.forStatement) },
			{ ALT: () => this.SUBRULE(this.forInStatement) },
			{ ALT: () => this.SUBRULE(this.whileStatement) },
			{ ALT: () => this.SUBRULE(this.functionDeclaration) },
			{ ALT: () => this.SUBRULE(this.returnStatement) },
			{ ALT: () => this.SUBRULE(this.expressionStatement) },
			{ ALT: () => this.SUBRULE(this.blockStatement) },
		]);
	});

	/**
	 * var a = 3;
	 * const a = 3;
	 * */
	public variableDeclaration = this.RULE('variableDeclaration', () => {
		this.OR([{ ALT: () => this.CONSUME(Var) }, { ALT: () => this.CONSUME(Const) }]);
		this.CONSUME(Identifier);
		this.OPTION(() => {
			this.CONSUME(Assign);
			this.SUBRULE(this.expression);
		});
		this.CONSUME(SemiColen);
	});

	/**
	 * b = 3;
	 */
	public assignment = this.RULE('assignment', () => {
		this.CONSUME(Identifier);
		this.CONSUME(Assign);
		this.SUBRULE(this.expression);
		this.CONSUME(SemiColen);
	});

	/**
	 * if (b) c; [else d;]
	 */
	public ifStatement = this.RULE('ifStatement', () => {
		this.CONSUME(If);
		this.CONSUME(LParen);
		this.SUBRULE(this.expression);
		this.CONSUME(RParen);
		this.SUBRULE1(this.statement);
		this.OPTION(() => {
			this.CONSUME(Else);
			this.SUBRULE2(this.statement);
		});
	});

	/**
	 * for (var a = 3; beta; gamma) delta;
	 */
	public forStatement = this.RULE('forStatement', () => {
		this.CONSUME(For);
		this.CONSUME(LParen);
		this.OPTION(() => this.SUBRULE(this.variableDeclaration));
		this.OPTION1(() => this.SUBRULE1(this.expression));
		this.CONSUME1(SemiColen);
		this.OPTION2(() => this.SUBRULE2(this.expression));
		this.CONSUME(RParen);
		this.SUBRULE(this.statement);
	});

	/**
	 * forin (a; iterable) beta;
	 * forIn (a; iterable) beta;
	 */
	public forInStatement = this.RULE('forInStatement', () => {
		this.CONSUME(ForIn);
		this.CONSUME(LParen);
		this.CONSUME(Identifier);
		this.CONSUME(SemiColen);
		this.SUBRULE(this.expression);
		this.CONSUME(RParen);
		this.SUBRULE(this.statement);
	});

	/**
	 * while (alpha) beta;
	 */
	public whileStatement = this.RULE('whileStatement', () => {
		this.CONSUME(While);
		this.CONSUME(LParen);
		this.SUBRULE(this.expression);
		this.CONSUME(RParen);
		this.SUBRULE(this.statement);
	});

	/**
	 * function alpha(beta, gamma,...) {}
	 */
	public functionDeclaration = this.RULE('functionDeclaration', () => {
		this.CONSUME(FunctionKeyword);
		this.CONSUME(Identifier);
		this.CONSUME(LParen);
		this.OPTION(() => {
			this.SUBRULE(this.parameterList);
		});
		this.CONSUME(RParen);
		this.SUBRULE(this.blockStatement);
	});

	/**
	 * return sth;
	 */
	public returnStatement = this.RULE('returnStatement', () => {
		this.CONSUME(Return);
		this.OPTION(() => {
			this.SUBRULE(this.expression);
		});
		this.CONSUME(SemiColen);
	});

	public parameterList = this.RULE('parameterList', () => {
		this.CONSUME1(Identifier);
		this.MANY(() => {
			this.CONSUME(Comma);
			this.CONSUME2(Identifier);
		});
	});

	public argumentsList = this.RULE('argumentsList', () => {
		this.SUBRULE(this.expression);
		this.MANY(() => {
			this.CONSUME(Comma);
			this.SUBRULE1(this.expression);
		});
	});

	/**
	 * a;
	 */
	public expressionStatement = this.RULE('expressionStatement', () => {
		this.SUBRULE(this.noAssignmentExpression);
		this.CONSUME(SemiColen);
	});

	public blockStatement = this.RULE('blockStatement', () => {
		this.CONSUME(LBrace);
		this.MANY(() => {
			this.SUBRULE(this.statement);
		});
		this.CONSUME(RBrace);
	});

	public expression = this.RULE('expression', () => {
		this.SUBRULE(this.assignmentExpression);
	});

	public noAssignmentExpression = this.RULE('noAssignmentExpression', () => {
		this.SUBRULE(this.logicalOrExpression);
	});

	public assignmentExpression = this.RULE('assignmentExpression', () => {
		this.SUBRULE(this.logicalOrExpression);
		this.OPTION(() => {
			this.CONSUME(Assign);
			this.SUBRULE(this.assignmentExpression);
		});
	});

	public logicalOrExpression = this.RULE('logicalOrExpression', () => {
		this.SUBRULE(this.logicalAndExpression);
		this.MANY(() => {
			this.CONSUME(Or);
			this.SUBRULE2(this.logicalAndExpression);
		});
	});

	public logicalAndExpression = this.RULE('logicalAndExpression', () => {
		this.SUBRULE(this.bitwiseXorExpression);
		this.MANY(() => {
			this.CONSUME(And);
			this.SUBRULE2(this.bitwiseXorExpression);
		});
	});

	public bitwiseXorExpression = this.RULE('bitwiseXorExpression', () => {
		this.SUBRULE(this.equalityExpression);
		this.MANY(() => {
			this.CONSUME(Xor);
			this.SUBRULE2(this.equalityExpression);
		});
	});

	public equalityExpression = this.RULE('equalityExpression', () => {
		this.SUBRULE(this.relationalExpression);
		this.MANY(() => {
			this.OR([{ ALT: () => this.CONSUME(Equal) }, { ALT: () => this.CONSUME(NotEqual) }]);
			this.SUBRULE2(this.relationalExpression);
		});
	});

	public relationalExpression = this.RULE('relationalExpression', () => {
		this.SUBRULE(this.additiveExpression);
		this.MANY(() => {
			this.OR([
				{ ALT: () => this.CONSUME(LessThan) },
				{ ALT: () => this.CONSUME(GreaterThan) },
				{ ALT: () => this.CONSUME(LessThanOrEqualTo) },
				{ ALT: () => this.CONSUME(GreaterThanOrEqualTo) },
			]);
			this.SUBRULE2(this.additiveExpression);
		});
	});

	public additiveExpression = this.RULE('additiveExpression', () => {
		this.SUBRULE(this.multiplicativeExpression);
		this.MANY(() => {
			this.OR([{ ALT: () => this.CONSUME(Add) }, { ALT: () => this.CONSUME(Sub) }]);
			this.SUBRULE2(this.multiplicativeExpression);
		});
	});

	public multiplicativeExpression = this.RULE('multiplicativeExpression', () => {
		this.SUBRULE(this.exponentialExpression);
		this.MANY(() => {
			this.OR([
				{ ALT: () => this.CONSUME(Mul) },
				{ ALT: () => this.CONSUME(Div) },
				{ ALT: () => this.CONSUME(Mod) },
			]);
			this.SUBRULE2(this.exponentialExpression);
		});
	});

	public exponentialExpression = this.RULE('exponentialExpression', () => {
		this.SUBRULE(this.unaryExpression);
		this.MANY(() => {
			this.OR([{ ALT: () => this.CONSUME(Pow) }, { ALT: () => this.CONSUME(Tetrate) }]);
			this.SUBRULE2(this.unaryExpression);
		});
	});

	public unaryExpression = this.RULE('unaryExpression', () => {
		this.OR1([
			{
				ALT: () => {
					this.OR2([{ ALT: () => this.CONSUME(Not) }, { ALT: () => this.CONSUME(Sub) }]);
					this.SUBRULE(this.unaryExpression);
				},
			},
			{
				ALT: () => this.SUBRULE(this.primaryExpression),
			},
		]);
	});

	public primaryExpression = this.RULE('primaryExpression', () => {
		this.OR([
			{ ALT: () => this.CONSUME(NumberLiteral) },
			{ ALT: () => this.CONSUME(StringLiteral) },
			{ ALT: () => this.CONSUME(True) },
			{ ALT: () => this.CONSUME(False) },
			{ ALT: () => this.CONSUME(Identifier) },
			{
				ALT: () => {
					this.CONSUME(LParen);
					this.SUBRULE(this.expression);
					this.CONSUME(RParen);
				},
			},
			{
				ALT: () => {
					this.CONSUME(LBracket);
					this.OPTION(() => {
						this.SUBRULE(this.arrayElements);
					});
					this.CONSUME(RBracket);
				},
			},
			// 添加函数调用作为表达式
			{
				ALT: () => this.SUBRULE(this.callExpression),
			},
		]);
	});

	public arrayElements = this.RULE('arrayElements', () => {
		this.SUBRULE(this.expression);
		this.MANY(() => {
			this.CONSUME(Comma);
			this.SUBRULE2(this.expression);
		});
	});

	// 修改 callExpression，移除分号，使其可以作为表达式
	public callExpression = this.RULE('callExpression', () => {
		this.CONSUME(Call);
		this.SUBRULE(this.expression);
		this.CONSUME(LParen);
		this.OPTION(() => {
			this.SUBRULE(this.argumentsList);
		});
		this.CONSUME(RParen);
		// 移除 this.CONSUME(SemiColen); 使其可以作为表达式
	});
}

const parser = new AutomatorParser();

export default parser;
