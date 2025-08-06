import type { ASTNode } from "./ast";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

export function evaluateASTNode(ast: ASTNode, base:number) {
    return ast.toDecimal(base);
}
