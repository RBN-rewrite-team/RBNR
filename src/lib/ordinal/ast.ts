import Decimal from 'break_eternity.js';

export abstract class ASTNode {
	abstract type:
		| 'Number'
		| 'Omega'
		| 'Addition'
		| 'Multiply'
		| 'Exponention'
		| 'Epsilon'
		| 'Zeta'
		| 'Main'
		| "PSI"
		| "FUO_OMEGA"
		| 'W1CK';
	constructor() {}
	abstract toDecimal(base: Decimal): Decimal;
	abstract HTMLForm(): string;
}

export class NumberNode extends ASTNode {
	public type = 'Number' as const;
	public value: number;

	constructor(value: number) {
		super();
		if (!Number.isInteger(value) || value < 0) {
			throw new TypeError('NumberNode value is must be a natural number.');
		}
		this.value = value;
	}

	toDecimal(_base: Decimal) {
		return Decimal.fromNumber(this.value)
	}
	HTMLForm(): string {
		return this.value.toFixed(2);
	}
}

export class OmegaNode extends ASTNode {
	public type = 'Omega' as const;

	constructor() {
		super();
	}

	toDecimal(base: Decimal) {
		return new Decimal(base);
	}
	HTMLForm(): string {
		return 'ω';
	}
}
export class W1CKNode extends ASTNode {
	public type = 'W1CK' as const;

	constructor() {
		super();
	}

	toDecimal(base: Decimal) {
		return Decimal.dInf;
	}
	HTMLForm(): string {
		return 'Ω';
	}
}
export class AddNode extends ASTNode {
	public type = 'Addition' as const;
	public params: [ASTNode, ASTNode];

	constructor(param1: ASTNode, param2: ASTNode) {
		super();
		this.params = [param1, param2];
	}

	toDecimal(base:Decimal) {
		return Decimal.add(this.params[0].toDecimal(base), this.params[1].toDecimal(base));
	}
	HTMLForm(): string {
		return `(${this.params[0].HTMLForm()})+(${this.params[1].HTMLForm()})`;
	}
}

export class MultiplyNode extends ASTNode {
	public type = 'Multiply' as const;
	public params: [ASTNode, ASTNode];

	constructor(param1: ASTNode, param2: ASTNode) {
		super();
		this.params = [param1, param2];
	}

	toDecimal(base: Decimal) {
		return Decimal.mul(this.params[0].toDecimal(base), this.params[1].toDecimal(base));
	}
	HTMLForm(): string {
		return `(${this.params[0].HTMLForm()})×(${this.params[1].HTMLForm()})`;
	}
}

export class ExponentNode extends ASTNode {
	public type = 'Exponention' as const;
	public params: [ASTNode, ASTNode];

	constructor(param1: ASTNode, param2: ASTNode) {
		super();
		this.params = [param1, param2];
	}

	toDecimal(base: Decimal) {
		return Decimal.pow(this.params[0].toDecimal(base), this.params[1].toDecimal(base));
	}
	HTMLForm(): string {
		return `${this.params[0].HTMLForm()}<sup>${this.params[1].HTMLForm()}</sup>`;
	}
	bot_omega_destruct(): ASTNode {
		if (this.params[0] !instanceof OmegaNode) return this;
		let destructed = this.params[1];
		this.params[0] = destructed;
		let addition;
		if (destructed instanceof AddNode) {
			addition = destructed.params[1];
			destructed = destructed.params[0];
			this.params[0] = new MultiplyNode(this.params[0], 
				new ExponentNode(new OmegaNode(), addition).bot_omega_destruct()
			);
		}
		return destructed
	}
}

export class EpsilonNode extends ASTNode {
	public type = 'Epsilon' as const;
	public childNode: ASTNode;

	constructor(node: ASTNode) {
		super();
		this.childNode = node;
	}

	toDecimal(base: Decimal) {
		return Decimal.tetrate(base, this.childNode.toDecimal(base).mul(base).add(base).toNumber());
	}
	HTMLForm(): string {
		return `ε<sub>${this.childNode.HTMLForm()}</sub>`;
	}
}
export class FUO_OMEGA_Node extends ASTNode {
	public type = 'FUO_OMEGA' as const;
	public childNode: ASTNode; // W_xxxx

	constructor(node: ASTNode) {
		super();
		this.childNode = node;
	}

	toDecimal(base: Decimal) {
		return Decimal.dInf;
	}
	HTMLForm(): string {
		return `Ω<sub>${this.childNode.HTMLForm()}</sub>`;
	}
}export class PSI_Node extends ASTNode {
	public type = 'PSI' as const;
	public sub: ASTNode; // psi_xxx()
	public content: ASTNode;
	constructor(node: ASTNode, cont: ASTNode) {
		super();
		this.sub = node;
		this.content = cont;
	}

	toDecimal(base: Decimal) {
		return Decimal.dInf;
	}
	HTMLForm(): string {
		return `ψ<sub>${this.sub.HTMLForm()}</sub>()`;
	}
}
export class ZetaNode extends ASTNode {
	public type = 'Zeta' as const;
	public childNode: ASTNode;

	constructor(node: ASTNode) {
		super();
		this.childNode = node;
	}

	toDecimal(base: Decimal) {
		return Decimal.dInf;
	}
	HTMLForm(): string {
		return `ζ<sub>${this.childNode.HTMLForm()}</sub>`;
	}
}

export class MainNode extends ASTNode {
	node: ASTNode;
	constructor(node: ASTNode) {
		super();
		this.node = node;
	}

	toDecimal(base: Decimal): Decimal {
		return this.node.toDecimal(base);
	}

	type = 'Main' as const;
	HTMLForm(): string {
		return this.node.HTMLForm();
	}
}
