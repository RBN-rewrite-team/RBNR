import { CstParser, IToken } from "chevrotain";
import AutomatorLexer, { allTokens } from "./lexer"

const tokenNames: {
  [key: string]: IToken
} = {}
allTokens.forEach(token => {
  tokenNames[token.name] = token
})

class AutomatorParser extends CstParser {
  constructor() {
    super(allTokens, {
      outPutCst: true,
      nodeLocationTracking: "full",
    })
    
    $.performSelfAnalysis()
  }
}