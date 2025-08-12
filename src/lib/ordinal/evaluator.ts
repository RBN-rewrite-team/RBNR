import type { ASTNode } from './ast';
import { Lexer } from './lexer';
import { Parser } from './parser';
import Decimal from 'break_eternity.js';

export function evaluateASTNode(ast: ASTNode, base: Decimal) {
	return ast.toDecimal(base);
}
