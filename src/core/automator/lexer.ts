import { createToken, Lexer } from "chevrotain";

const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/
})

const Var = createToken({
  name: "Var",
  pattern: /var/, 
  longer_alt: Identifier,
})

const For = createToken({
  name: "For",
  pattern: /for/,
  longer_alt: Identifier,
})

const While = createToken({ name: "While", pattern: /while/, longer_alt: Identifier })

const Const = createToken({ name: "Const", pattern: /const/, longer_alt: Identifier })

const In = createToken({ name: "In", pattern: /in/, longer_alt: Identifier })

const False = createToken({ name: "False", pattern: /false/,longer_alt: Identifier })

const True = createToken({ name: "True", pattern: /true/, longer_alt: Identifier })

const If = createToken({ name: "If", pattern: /if/, longer_alt: Identifier })

const Else = createToken({ name: "Else", pattern: /else/, longer_alt: Identifier })

const FunctionKeyword = createToken({ name: "Function", pattern: /function/, longer_alt: Identifier })

const And = createToken({ name: "And", pattern: /&&/})

const Or = createToken({ name: "Or", pattern: /\|\|/})

const Not = createToken({ name: "Not", pattern: /!/})

const Xor = createToken({ name: "Xor", pattern: /\^/})

const Add = createToken({ name: "Add", pattern: /\+/})

const Sub = createToken({ name: "Sub", pattern: /-/})

const Mul = createToken({ name: "Mul", pattern: /\*/})

const Pow = createToken({ name: "Pow", pattern: /\*\*/})

const Tetrate = createToken({ name: "Tetrate", pattern: /\*\*\*/})

const NumberLiteral = createToken({
  name: "Number",
  //这里不带符号，防止与加减法混淆
  pattern: /Infinity|NaN|((0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?)/,
});

const Comma = createToken({
  name: "Comma",
  pattern: /,/
})

const SemiColen = createToken({
  name: "SemiColen",
  pattern: /;/
})

const GreaterThan = createToken({
  name: "GreaterThan",
  pattern: />/
})

const LessThan = createToken({
  name: "LessThan",
  pattern: /</
})

const Equal = createToken({
  name: "Equal",
  pattern: /==/
})

const NotEqual = createToken({
  name: "Equal",
  pattern: /!=/
})

const LessThanOrEqualTo = createToken({
  name: "LessThanOrEqualTo",
  pattern: /<=/
})

const GreaterThanOrEqualTo = createToken({
  name: "GreaterThanOrEqualTo",
  pattern: />=/
})

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
})

const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/
});

const LParen = createToken({ name: "LParen", pattern: /\(/ })
const RParen = createToken({ name: "RParen", pattern: /\)/ })
const LBrace = createToken({ name: "LBrace", pattern: /{/ })
const RBrace = createToken({ name: "RBrace", pattern: /}/ })
const LBracket = createToken({ name: "LBracket", pattern: /\[/ })
const RBracket = createToken({ name: "RBracket", pattern: /\]/ })
const Assign = createToken({ name: "Assign", pattern: /=/ })

export const allTokens = [
  WhiteSpace,
  
  StringLiteral,
  NumberLiteral,
  
  Var,
  For,
  While,
  Const,
  In,
  False,
  True,
  If,
  Else,
  FunctionKeyword,
  
  Identifier,
  
  Comma,
  SemiColen,
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
]

const AutomatorLexer = new Lexer(allTokens)

export default AutomatorLexer