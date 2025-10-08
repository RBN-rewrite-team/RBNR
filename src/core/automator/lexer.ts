import { createToken, Lexer } from 'chevrotain';

export const Identifier = createToken({
	name: 'Identifier',
	pattern: /[a-zA-Z_\x80-\uffff][a-zA-Z0-9_\x80-\uffff]*/,
});

export const Var = createToken({
	name: 'Var',
	pattern: /var/,
	longer_alt: Identifier,
});

export const For = createToken({
	name: 'For',
	pattern: /for/,
	longer_alt: Identifier,
});

export const Return = createToken({
	name: 'Return',
	pattern: /return/,
	longer_alt: Identifier,
});

export const While = createToken({ name: 'While', pattern: /while/, longer_alt: Identifier });

export const Const = createToken({ name: 'Const', pattern: /const/, longer_alt: Identifier });

export const ForIn = createToken({ name: 'ForIn', pattern: /for(i|I)n/, longer_alt: Identifier });

export const False = createToken({ name: 'False', pattern: /false/, longer_alt: Identifier });

export const True = createToken({ name: 'True', pattern: /true/, longer_alt: Identifier });

export const If = createToken({ name: 'If', pattern: /if/, longer_alt: Identifier });
export const Include = createToken({
	name: 'Include',
	pattern: /(include|#include|import)/,
	longer_alt: Identifier,
});

export const Else = createToken({ name: 'Else', pattern: /else/, longer_alt: Identifier });
export const Call = createToken({ name: 'Call', pattern: /call/, longer_alt: Identifier });

export const FunctionKeyword = createToken({
	name: 'Function',
	pattern: /function/,
	longer_alt: Identifier,
});

export const And = createToken({ name: 'And', pattern: /&&/ });

export const Or = createToken({ name: 'Or', pattern: /\|\|/ });

export const Not = createToken({ name: 'Not', pattern: /!/ });

export const Xor = createToken({ name: 'Xor', pattern: /\^/ });

export const Add = createToken({ name: 'Add', pattern: /\+/ });

export const Sub = createToken({ name: 'Sub', pattern: /-/ });

export const Mul = createToken({ name: 'Mul', pattern: /\*/ });

export const Div = createToken({ name: 'Div', pattern: /\// });

export const Pow = createToken({ name: 'Pow', pattern: /\*\*/ });

export const Mod = createToken({ name: 'Mod', pattern: /%/ });

export const Tetrate = createToken({ name: 'Tetrate', pattern: /\*\*\*/ });

export const NumberLiteral = createToken({
	name: 'Number',
	//这里不带符号，防止与加减法混淆
	pattern: /Infinity|NaN|((\d+(\.\d*)?|\d*\.\d+)?([EeFf]([-\+]?)))*(0|\d+(\.\d*)?|\d*\.\d+)/,
});

export const Comma = createToken({
	name: 'Comma',
	pattern: /,/,
});

export const SemiColen = createToken({
	name: 'SemiColen',
	pattern: /;/,
});
export const Colen = createToken({
	name: 'SemiColen',
	pattern: /:/,
});

export const GreaterThan = createToken({
	name: 'GreaterThan',
	pattern: />/,
});

export const LessThan = createToken({
	name: 'LessThan',
	pattern: /</,
});

export const Equal = createToken({
	name: 'Equal',
	pattern: /==/,
});

export const NotEqual = createToken({
	name: 'NotEqual',
	pattern: /!=/,
});

export const LessThanOrEqualTo = createToken({
	name: 'LessThanOrEqualTo',
	pattern: /<=/,
});

export const GreaterThanOrEqualTo = createToken({
	name: 'GreaterThanOrEqualTo',
	pattern: />=/,
});

export const WhiteSpace = createToken({
	name: 'WhiteSpace',
	pattern: /(\s)+/,
	group: Lexer.SKIPPED,
});

export const StringLiteral = createToken({
	name: 'StringLiteral',
	pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/,
});
export const Dot = createToken({
	name: 'Dot',
	pattern: /\./,
});
export const LParen = createToken({ name: 'LParen', pattern: /\(/ });
export const RParen = createToken({ name: 'RParen', pattern: /\)/ });
export const LBrace = createToken({ name: 'LBrace', pattern: /{/ });
export const RBrace = createToken({ name: 'RBrace', pattern: /}/ });
export const LBracket = createToken({ name: 'LBracket', pattern: /\[/ });
export const RBracket = createToken({ name: 'RBracket', pattern: /\]/ });
export const Assign = createToken({ name: 'Assign', pattern: /=/ });

export const SingleLineComment = createToken({
	name: 'SingleLineComment',
	pattern: /\/\/[^\n\r]*/,
	group: Lexer.SKIPPED,
});

export const MultiLineComment = createToken({
	name: 'MultiLineComment',
	pattern: /\/\*[\s\S]*?\*\//,
	group: Lexer.SKIPPED,
});

export const SingleLineCommentWithoutIgnored = createToken({
	name: 'SingleLineComment',
	pattern: /\/\/[^\n\r]*/,
});

export const MultiLineCommentWithoutIgnored = createToken({
	name: 'MultiLineComment',
	pattern: /\/\*[\s\S]*?\*\//,
});

export const allTokens = [
	WhiteSpace,
	SingleLineComment,
	MultiLineComment,

	StringLiteral,
	NumberLiteral,

	Var,
	Const,
	ForIn,
	For,
	While,
	False,
	True,
	If,
	Else,
	FunctionKeyword,
	Return,

	Call,
	Include,

	Identifier,

	Comma,
	SemiColen,
	Colen,
	Dot,
	LParen,
	RParen,
	LBrace,
	RBrace,
	LBracket,
	RBracket,

	LessThanOrEqualTo,
	GreaterThanOrEqualTo,
	LessThan,
	GreaterThan,
	NotEqual,
	Equal,

	Assign,

	And,
	Or,
	Not,
	Xor,

	Tetrate,
	Pow,
	Add,
	Sub,
	Mul,
	Div,
	Mod,
];

export const allTokens2 = [
	WhiteSpace,
	SingleLineCommentWithoutIgnored,
	MultiLineCommentWithoutIgnored,

	StringLiteral,
	NumberLiteral,

	Var,
	Const,
	ForIn,
	For,
	While,
	False,
	True,
	If,
	Else,
	FunctionKeyword,
	Return,
	Call,
	Include,

	Identifier,

	Comma,
	SemiColen,
	Colen,
	Dot,
	LParen,
	RParen,
	LBrace,
	RBrace,
	LBracket,
	RBracket,

	LessThanOrEqualTo,
	GreaterThanOrEqualTo,
	LessThan,
	GreaterThan,
	NotEqual,
	Equal,

	Assign,

	And,
	Or,
	Not,
	Xor,

	Tetrate,
	Pow,
	Add,
	Sub,
	Mul,
	Div,
	Mod,
];

export const AutomatorLexer = new Lexer(allTokens);

const HighLightLexer = new Lexer(allTokens2);

export default AutomatorLexer;

export function highlightAutomator(code: string) {
	// 1. 进行词法分析
	const lexResult = HighLightLexer.tokenize(code);

	let result = '';
	let lastEndOffset = 0;
	for (const token of lexResult.tokens) {
		// 添加两个 Token 之间的空白文本
		if (token.startOffset > lastEndOffset) {
			const whitespace = code.substring(lastEndOffset, token.startOffset);
			result += escapeHtml(whitespace)
				.replace(/ /g, '&nbsp;')
				.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
				.replace(/\n/g, '<br>')
				.replace(/\r/g, '');
		}

		// 添加高亮 Token
		const content = escapeHtml(token.image);
		result += `<span class="automator-${token.tokenType.name.toLowerCase()}">${content}</span>`;

		lastEndOffset = (token.endOffset ?? 0) + 1;
	}

	// 添加最后的空白文本（如果有）
	if (lastEndOffset < code.length) {
		const trailingWhitespace = code.substring(lastEndOffset);
		result += escapeHtml(trailingWhitespace)
			.replace(/ /g, '&nbsp;')
			.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
			.replace(/\n/g, '<br>')
			.replace(/\r/g, '');
	}

	return result;
}

function escapeHtml(text: string) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}
