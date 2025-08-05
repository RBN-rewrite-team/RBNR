import type { ASTNode } from "./ast";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

export function evaluateASTNode(ast: ASTNode, base:number) {
    return ast.toDecimal(base);
}

console.log(evaluateASTNode((function (){
    const lexer = new Lexer("w^w^w*2"); // w^(w^2)*2
    const parse = new Parser(lexer);
    const a = parse.parseToMainExpression();
    console.log(a);
    return a;
})(),10))