import Decimal from 'break_eternity.js';

export const NonRecBMSMilestones = [
  [new Decimal(0), "", "0"],
  [new Decimal(1), "(1)", "1"],
  [new Decimal(2), "(1)(1)", "2"],
  [new Decimal(3), "(1)(1)(1)", "3"],
  [new Decimal(4), "(1)(2)", "ω"],
  [new Decimal(5), "(1)(2)(3)", "ω^ω"],
  [new Decimal(6), "(1)(2)(3)(4)", "ω^ω^ω"],
  [new Decimal(7), "(1)(2)(3)(4)(5)", "ω^ω^ω^ω"],
  [new Decimal(8), "(1)(2,1)", "ε_0"],
  [new Decimal(9), "(1)(2,1)(3,2)", "ψ(Ω_2)"],
  [new Decimal(10), "(1)(2,1)(3,2)(4,3)", "ψ(Ω_3)"],
  [new Decimal(11), "(1)(2,1)(3,2)(4,3)(5,4)", "ψ(Ω_4)"],
  [new Decimal(12), "(1)(2,1,1)", "ψ(Ω_ω)"],
  [new Decimal(13), "(1)(2,1,1)(3,2,2)", "ψ(ψ_α(α_ω))", "ψ(ω-π-Π_0)"],
  [new Decimal(14), "(1)(2,1,1,1)", "ψ(P(ω,0))" "TSSO"],
  [new Decimal(15), "(1)(2,1,1,1,1)", "ψ(S)" "QSSO"],
  [new Decimal(16), "(1,1)", "Ω"],
  [new Decimal(64), "(1,1,1)", "Ω_2"],
] as const