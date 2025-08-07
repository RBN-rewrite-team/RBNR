export enum Tokens {
	number,
	omega,
	addition,
	multiply,
	exponention,
	epsilon,
	zeta,
	lparen,
	rparen,
	eof,
}

export class Token {
	public type: Tokens;
	public literal: string;

	constructor(type: Tokens, literal = '') {
		this.type = type;
		this.literal = literal;
	}
}
