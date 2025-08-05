import { Lexer } from "./lexer.ts"
import { Parser } from "./parser.ts"
import { MainNode } from "./ast.ts"
export class Ordinal {
  node: MainNode
  
  constructor(value: string) {
    this.node = new Parser(new Lexer(value)).parseToMainExpression()
  }
  
  toDecimal(base = 10) {
    return this.node.toDecimal(base)
  }
}