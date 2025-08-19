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
	w1ck,
}

export class Token {
	public type: Tokens;
	public literal: string;

	constructor(type: Tokens, literal = '') {
		this.type = type;
		this.literal = literal;
	}
}
