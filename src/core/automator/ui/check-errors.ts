import type { IRecognitionException } from 'chevrotain';
import { ALexerError, AParserError } from '../a-errors';
import { CstToAstVisitor } from '../compiler';
import AutomatorLexer from '../lexer';
import { AutomatorParser } from '../parser';

export function parseAndCheckErrors(code: string) {
	const lexResult = AutomatorLexer.tokenize(code);

	const errors: {
		offset: number | undefined;
		offset2: number | undefined;
	}[] = [];
	if (lexResult.errors.length > 0) {
		errors.push({
			offset: lexResult.errors[0].offset,
			offset2: lexResult.errors[0].offset + lexResult.errors[0].length,
		});
		return errors;
	}

	const parser = new AutomatorParser();
	parser.input = lexResult.tokens;
	const cst = parser.program();

	if (parser.errors.length > 0) {
		parser.errors.forEach((x) => {
			const startIndex = x.token?.startOffset ?? 0;
			let endIndex = x.token?.endOffset ?? startIndex + 1;
			if (x.token.tokenType.name == 'EOF') {
				errors.push({
					offset: code.length - 1,
					offset2: code.length,
				});
				return;
			}
			// 如果 token 不存在，尝试从上下文推断位置
			if (!x.token) {
				// 可以根据错误信息或上下文估算位置
				const estimatedPosition = estimateErrorPosition(x, code);
				if (estimatedPosition) {
					endIndex = estimatedPosition.end;
				} else {
					// 如果无法估算，默认标记前10个字符
					endIndex = Math.min(startIndex + 10, code.length);
				}
			}

			// 确保结束位置不小于起始位置
			endIndex = Math.max(endIndex, startIndex + 1);

			errors.push({
				offset: startIndex,
				offset2: endIndex,
			});
		});
		return errors;
	}
	return errors;
}

/**
 * 估算错误位置（当token信息不完整时使用）
 */
function estimateErrorPosition(
	error: IRecognitionException,
	documentText: string,
): { start: number; end: number } | null {
	// 方法1：从错误消息中提取相关信息
	if (error.message && error.context) {
		const context = error.context;

		// 如果有之前的token，在其后开始
		if ('tokenVector' in context && Array.isArray(context.tokenVector)) {
			if (context.tokenVector && context.tokenVector.length > 0) {
				const lastToken = context.tokenVector[context.tokenVector.length - 1];
				return {
					start: lastToken.endOffset ?? lastToken.startOffset + 1,
					end: Math.min(lastToken.endOffset + 10, documentText.length),
				};
			}
		}
	}

	// 方法2：在文档中搜索可能的错误模式
	const commonPatterns = [/unexpected token/i, /expecting/i, /mismatched/i];

	for (const pattern of commonPatterns) {
		if (error.message && pattern.test(error.message)) {
			// 在错误消息中查找提到的token
			const tokenMatch = error.message.match(/['"]([^'"]+)['"]/);
			if (tokenMatch) {
				const token = tokenMatch[1];
				const tokenIndex = documentText.indexOf(token);
				if (tokenIndex !== -1) {
					return {
						start: tokenIndex,
						end: tokenIndex + token.length,
					};
				}
			}
		}
	}

	return null;
}
