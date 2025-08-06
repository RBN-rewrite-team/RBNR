import { AddNode, EpsilonNode, ExponentNode, MultiplyNode, NumberNode, OmegaNode, type ASTNode, MainNode, ZetaNode } from "./ast.ts";
import { Lexer } from "./lexer.ts"
import { Tokens, Token } from "./tokens.ts"


const precedences = new Map<Tokens, number>();

export class Parser {
    lexer: Lexer;
    
    tokens: Token[];
    pos: number;
    prefixParseFns = new Map<Tokens, () => ASTNode>();
    infixParseFns = new Map<Tokens, (lf: ASTNode) => ASTNode>();
    constructor(lex: Lexer) {
        this.lexer = lex;
        this.tokens = this.lexer.tokenize();
        this.pos=0;
        this.prefixParseFns.set(Tokens.epsilon, this.parseEpsilonExpression.bind(this));
        this.prefixParseFns.set(Tokens.omega, this.parseOmegaExpression.bind(this));
        this.prefixParseFns.set(Tokens.number, this.parseNumberExpression.bind(this));
        this.prefixParseFns.set(Tokens.lparen, this.parseGroupedExpression.bind(this))
        this.prefixParseFns.set(Tokens.zeta, this.parseZetaExpression.bind(this))
        this.infixParseFns.set(Tokens.addition, this.parseAdditionExpression.bind(this));
        this.infixParseFns.set(Tokens.multiply, this.parseMultExpression.bind(this));
        this.infixParseFns.set(Tokens.exponention, this.parseExpoExpression.bind(this));
        precedences.set(Tokens.epsilon, 8);
        precedences.set(Tokens.zeta, 8);
        precedences.set(Tokens.number, 8);
        precedences.set(Tokens.omega, 8);
        precedences.set(Tokens.addition, 3);
        precedences.set(Tokens.multiply, 4);
        precedences.set(Tokens.exponention, 5);
    }
    nextToken() {
        return this.tokens[this.pos++];
    }
    curTokenIs(tok: Tokens) {
        return this.tokens[this.pos]?.type==tok;
    }
    peekTokenIs(tok: Tokens) {
        return this.tokens[this.pos+1]?.type==tok;
    }
    peekPrecedence () {
        return precedences.get(this.tokens[this.pos+1]?.type)
    }
    curPrecedence () {
        return precedences.get(this.tokens[this.pos]?.type)
    }
    parseToMainExpression(): MainNode {
        const mainExpression = new MainNode(this.parseExpression(0));

        return mainExpression
    }

    parseExpression(precedence: number): ASTNode {
        const prefix = this.prefixParseFns.get(this.tokens[this.pos].type)
        if (!prefix) throw new Error
        let leftExp = prefix()
        while (!this.peekTokenIs(Tokens.eof) && precedence < (this.curPrecedence()??0)) {
            const infix = this.infixParseFns.get(this.tokens[this.pos].type)
            if (!infix) return leftExp
            if (!leftExp) throw new Error
            leftExp = infix(leftExp)
        }
        return leftExp
    }

    parseEpsilonExpression(): EpsilonNode {
        this.nextToken();
        const expression = this.parseExpression(8);
        const epsilonExpress = new EpsilonNode(expression);

        return epsilonExpress
    }
    parseZetaExpression(): ZetaNode {
        this.nextToken();
        const expression = this.parseExpression(8);
        const zetaExpress = new ZetaNode(expression);

        return zetaExpress
    }
    parseNumberExpression(): NumberNode {
        const n = Number(this.tokens[this.pos].literal)
        const numberExpress = new NumberNode(n);
        this.nextToken();

        return numberExpress
    }

    parseOmegaExpression(): OmegaNode {
        this.nextToken();
        return new OmegaNode();
    }

    parseAdditionExpression(left: ASTNode): AddNode {
        this.nextToken();
        const right = this.parseExpression(3);

        return new AddNode(left, right);
    }
    parseMultExpression(left: ASTNode): MultiplyNode {
        this.nextToken();
        const right = this.parseExpression(4);

        return new MultiplyNode(left, right);
    }
    parseExpoExpression(left: ASTNode): ExponentNode {
        this.nextToken();
        const right = this.parseExpression(4.5);

        return new ExponentNode(left, right);
    }
    parseGroupedExpression(): ASTNode {
        this.nextToken()
        const expression = this.parseExpression(0)
        if (!this.curTokenIs(Tokens.rparen)) throw new Error("')' expected.")
        this.nextToken();
        return expression
    }
}