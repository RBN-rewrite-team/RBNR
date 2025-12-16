import PowiainaNum from "powiaina_num.js";
import { Notation } from "../notation-class";
import formatXEY from "./xey-format";
export function preCheckString(
  num: PowiainaNum,
  t: {
    NaNString: string;
    PosInfString: string;
    NegInfString: string;
  }
) {
  if (num.isNaN()) return t.NaNString;
  if (num.isInfi()) {
    return num.sign == 1 ? t.PosInfString : t.NegInfString;
  }
}
export class FGHJNotation extends Notation {
  format(num: PowiainaNum, precision?: number): string {
    const precheck = preCheckString(num, this);
    if (precheck) return precheck;
    return formatXEY(num, precision);
  }
}
export class EngineeringNotation extends Notation {
  format(num: PowiainaNum, precision?: number): string {
    const precheck = preCheckString(num, this);
    if (precheck) return precheck;
    return formatXEY(num, precision, {
      engineering: true,
      UCF: false,
      reciprocate_format: false,
    });
  }
}
