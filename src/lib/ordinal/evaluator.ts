import type { ASTNode } from './ast';
import Decimal from 'break_eternity.js';

export function evaluateASTNode(ast: ASTNode, base: Decimal) {
	return ast.toDecimal(base);
}
