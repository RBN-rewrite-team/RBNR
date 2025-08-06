import { Lexer } from "./lexer.ts"
import { Parser } from "./parser.ts"
import { MainNode } from "./ast.ts"
import Decimal from "break_eternity.js"
import { formatWhole } from '@/utils/format';

export class Ordinal {
  node: MainNode
  
  constructor(value: string) {
    this.node = new Parser(new Lexer(value)).parseToMainExpression()
  }
  
  toDecimal(base = 10) {
    return this.node.toDecimal(base).round()
  }
  
  static displayOrdinalColored(ord: Decimal | number, base: Decimal | number = 10) {
    //return displayOrd(ord, base)
    return displayOrd(ord, base, 0, 0, 0, 0, 1)
  }
}
// Ordinal Markup
export function displayOrd(
  ord: Decimal | number,
  base: Decimal | number = 10,
  over: Decimal | number = 0,
  trim: number = 0,
  large: number = 0,
  multoff: number = 0,
  colour: number = 0
): string {
  ord = new Decimal(ord).floor();
  const originalOrd = Decimal.fromValue(ord);
  let dispString = "";

  const bigBase = new Decimal(base);
  const ten = new Decimal(10);
  const three = new Decimal(3);

  if (ord.gte(bigBase.tetrate(ten))) {
    const prefix = colour === 1 
      ? "<span style='color:red;text-shadow:0 0 3px #fff'>ε<sub>0</sub></span>" 
      : "ε<sub>0</sub>";
    return prefix;
  }

  let length = 8;
  let largeOrd = false;

  while (
    ord.gte(bigBase) && 
    (trim < length || length === 0) && 
    !largeOrd
  ) {
    const exponent = ord.add(0.1).log(bigBase).floor();
    const basePower = Decimal.pow(bigBase, exponent);
    let coefficient = Decimal.floor(ord.add(0.1).div(basePower));
    
    let remainder = ord.sub(basePower.mul(coefficient)).round();

    if (ord.gte(Decimal.pow(bigBase, Decimal.pow(bigBase, length)))) {
      coefficient = new Decimal(1);
      remainder = new Decimal(0)
    }

    const isEnd = remainder.add(over).eq(0) || ord.gt(Decimal.tetrate(bigBase, three));

    const expOrdDisp = displayOrd(exponent, base, 0, 0, 0, 0, 0);
    const expPart = exponent.eq(1) 
      ? "" 
      : "<sup>" + expOrdDisp + "</sup>";
    
    const coeffPart = coefficient.eq(1) 
      ? "" 
      : coefficient.toString();
    
    const separator = isEnd || trim === length - 1 
      ? (isEnd ? "" : "+...") 
      : "+";

    const expression = "ω" + expPart + coeffPart + separator;

    if (colour === 1) {
      const hueValue = exponent.mul(8);
      const colorCode = HSL(hueValue);
      const shadowColor = getContrastColor(colorCode);
      dispString += `<span style='color:${colorCode};text-shadow:0 0 3px ${shadowColor}'>${expression}</span>`;
    } else {
      dispString += expression;
    }

    ord = remainder;
    trim++;
    if (ord.gt(Decimal.tetrate(bigBase, three))) {
      largeOrd = true;
    }
  }

  if ((ord.lt(bigBase) && !ord.eq(0) && trim !== length) || originalOrd.eq(0)) {
    const remainderValue = ord.add(over);
    if (colour === 1) {
      dispString += `<span style='color:red;text-shadow:0 0 3px #fff'>${formatWhole(remainderValue)}</span>`;
    } else {
      dispString += formatWhole(remainderValue);
    }
  }
  
  return dispString;
}

function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  
  return luminance > 0.5 ? "#000" : "#fff";
}

function HSL(hue: Decimal | number): string {
  let hueValue = new Decimal(hue);
  const cycle = new Decimal(360 * 360);
  
  if (hueValue.gte(cycle)) {
    hueValue = hueValue.div(cycle).naturalLogarithm().add(1).mul(cycle);
  }
  
  const normalizedHue = hueValue.mod(360).toNumber();
  const h = normalizedHue % 360;
  
  const s = 100;
  const l = 50;
  
  const c = (1 - Math.abs(2 * l/100 - 1)) * s/100;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l/100 - c/2;
  
  let r = 0, g = 0, b = 0;
  
  if (h < 60) [r, g] = [c, x];
  else if (h < 120) [r, g] = [x, c];
  else if (h < 180) [g, b] = [c, x];
  else if (h < 240) [g, b] = [x, c];
  else if (h < 300) [b, r] = [c, x];
  else [b, r] = [x, c];
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return convertHex(r, g, b);
}

function convertHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
