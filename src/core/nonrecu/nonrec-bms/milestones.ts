import Decimal from 'break_eternity.js';

export const NonRecBMSMilestones = [
  [new Decimal(0), "", "0"],
  [new Decimal(1), "(1)", "1"],
  [new Decimal(2), "(1)(1)", "2"],
  [new Decimal(3), "(1)(1)(1)", "3"],
  [new Decimal(4), "(1)(2)", "ω"],
  [new Decimal(8), "(1)(2,1)", "ε_0"],
  [new Decimal(12), "(1)(2,1,1)", "ψ(Ω_ω)"],
  [new Decimal(16), "(1,1)", "Ω"],
] as const