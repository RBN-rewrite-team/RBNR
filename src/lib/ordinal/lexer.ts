import { Tokens, Token } from "./tokens.ts"

export class Lexer {
  private position: number;
  private currentChar: string | null;
  private input: string;
  
  constructor(input: string) {
    this.input = input;
    this.currentChar = input[0]
    this.position = 0
  }
  
  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token = this.nextToken();
    while (token.type !== Tokens.eof) {
      tokens.push(token)
      token = this.nextToken()
    }
    tokens.push(token)
    return tokens
  }
  
  private nextToken(): Token {
    this.skipWhiteSpace();
    if (this.currentChar === null) {
      return new Token(Tokens.eof)
    }
    
    if (/\d/.test(this.currentChar)) {
      return this.readNumber()
    }
    
    let token: Token;
    switch (this.currentChar) {
      case 'w':
      case 'ω':
        token = new Token(Tokens.omega)
        break;
      case '+':
        token = new Token(Tokens.addition)
        break;
      case '*':
      case '×':
        token = new Token(Tokens.multiply)
        break;
      case '^':
        token = new Token(Tokens.exponention)
        break;
      case 'e':
      case 'ε':
        token = new Token(Tokens.epsilon)
        break;
      case 'z':
      case 'ζ':
        token = new Token(Tokens.zeta)
        break;
      case '(':
        token = new Token(Tokens.lparen)
        break;
      case ')':
        token = new Token(Tokens.rparen)
        break;
      default:
        throw new SyntaxError(`Invalid or unexpected token: '${this.currentChar}'`)
    }
    
    this.shift()
    return token
  }
  
  private shift() {
    this.position++;
    this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
  }
  
  private skipWhiteSpace(): void {
    while (this.currentChar !== null && /\s/.test(this.currentChar)) {
      this.shift()
    }
  }
  
  private readNumber(): Token {
    let literal = "";
    while (this.currentChar !== null && /\d/.test(this.currentChar)) {
      literal += this.currentChar
      this.shift()
    }
    return new Token(Tokens.number, literal)
  }
}