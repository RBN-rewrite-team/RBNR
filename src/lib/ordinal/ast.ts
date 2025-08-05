import Decimal from "break_eternity.js"

export abstract class ASTNode {
  abstract readonly type:
    "Number" |
    "Omega" |
    "Addition" |
    "Multiply" |
    "Exponention" |
    "Epsilon"
  constructor() {}
  abstract toDecimal(base: number): Decimal;
}

export class NumberNode extends ASTNode {
  public readonly type = "Number" as const
  public readonly value: number
  
  constructor(value: number) {
    super();
    if (!Number.isInteger(value) || value < 0) {
      throw new TypeError("NumberNode value is must be a natural number.")
    }
    this.value = value
  }
  
  toDecimal(_base: number) {
    return Decimal.fromNumber(this.value)
  }
}

export class OmegaNode extends ASTNode {
  public readonly type = "Omega" as const

  constructor() {
    super();
  }
  
  toDecimal(base: number) {
    return new Decimal(base)
  }
}

export class AddNode extends ASTNode {
  public readonly type = "Addition" as const
  public readonly params: [ASTNode, ASTNode]

  constructor(param1: ASTNode, param2: ASTNode) {
    super();
    this.params = [param1, param2]
  }
  
  toDecimal(base: number) {
    return Decimal.add(
      this.params[0].toDecimal(base),
      this.params[1].toDecimal(base),
    )
  }
}

export class MultiplyNode extends ASTNode {
  public readonly type = "Multiply" as const
  public readonly params: [ASTNode, ASTNode]

  constructor(param1: ASTNode, param2: ASTNode) {
    super();
    this.params = [param1, param2]
  }
  
  toDecimal(base: number) {
    return Decimal.mul(
      this.params[0].toDecimal(base),
      this.params[1].toDecimal(base),
    )
  }
}

export class ExponentNode extends ASTNode {
  public readonly type = "Exponention" as const
  public readonly params: [ASTNode, ASTNode]

  constructor(param1: ASTNode, param2: ASTNode) {
    super();
    this.params = [param1, param2]
  }
  
  toDecimal(base: number) {
    return Decimal.pow(
      this.params[0].toDecimal(base),
      this.params[1].toDecimal(base),
    )
  }
}

export class EpsilonNode {
  public readonly type = "Epsilon" as const
  public readonly childNode: ASTNode;
  
  constructor(node: ASTNode) {
    this.childNode = node;
  }
  
  toDecimal(base: number) {
    return Decimal.tetrate(base, this.childNode.toDecimal().add(base))
  }
}