import Decimal from 'break_eternity.js';
import type { DecimalSource } from 'break_eternity.js';
import { diff } from '@/core/game-loop';
import { player } from '@/core/global'

export enum notations {
  SCIENTIFIC,
  ENGINEERING,
  LOGARITHMIC,
  STANDARD,
  HYPER_E,
  LETTER,
  EMPTY,
  BINARY,
  TERNARY,
  QUATERNARY,
  SEXIMAL,
  OCTAL,
  DUODECIMAL,
  HEXADECIMAL,
  BASE36,
  BASE62,
  BALANCED_TERNARY,
  BIJECTIVE_DECIMAL,
  BASE_THREE_HALVES,
  BASE_PHI,
  BASE_E,
  BASE_PI,
  FGH,
  HH,
  OMEGA,
  POWEROF1
}

export const notationNamesMap = new Map([
  [notations.SCIENTIFIC, "科学记数法"],
  [notations.ENGINEERING, "工程记数法"],
  [notations.LOGARITHMIC, "对数记数法"],
  [notations.STANDARD, "标准记数法"],
  [notations.HYPER_E, "Hyper-E"],
  [notations.LETTER, "字母计数法"],
  [notations.EMPTY, "空白计数法"],
  [notations.BINARY, "二进制计数法"],
  [notations.TERNARY, "三进制计数法"],
  [notations.QUATERNARY, "四进制计数法"],
  [notations.SEXIMAL, "六进制计数法"],
  [notations.OCTAL, "八进制计数法"],
  [notations.DUODECIMAL, "十二进制计数法"],
  [notations.HEXADECIMAL, "十六进制计数法"],
  [notations.BASE36, "三十六进制计数法"],
  [notations.BASE62, "六十二进制计数法"],
  [notations.BALANCED_TERNARY, "平衡三进制计数法"],
  [notations.BIJECTIVE_DECIMAL, "双射十进制计数法"],
  [notations.BASE_THREE_HALVES, "1.5进制计数法"],
  [notations.BASE_PHI, "Φ进制计数法"],
  [notations.BASE_E, "e进制计数法"],
  [notations.BASE_PI, "π进制计数法"],
  [notations.FGH, "快速增长层级"],
  [notations.HH, "Hardy层级"],
  [notations.OMEGA, "欧米伽记数法"],
  [notations.POWEROF1, "1的指数"],
])

function exponentialFormat(num: Decimal, precision: number, mantissa = true): string {
  if (player.options.notation == notations.LOGARITHMIC) return "e" + format(num.log10(), precision)
  const eng = player.options.notation == notations.ENGINEERING
  let e = num.log10().floor()
  if (eng) e = num.log10().div(3).floor().mul(3)
  let m = num.div(Decimal.pow(10, e))
  if (Number(m.toStringWithDecimalPlaces(precision)) == (eng ? 1000 : 10)) {
    m = new Decimal(1)
    e = e.add(1)
  }
  const exp = (e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
  if (mantissa) return m.toStringWithDecimalPlaces(precision) + 'e' + exp
  else return 'e' + exp
}

function commaFormat(num: Decimal, precision: number) {
  if (num === null || num === undefined) return 'NaN'
  if (num.mag < 0.001) return (0).toFixed(precision)
  const init = num.toStringWithDecimalPlaces(precision)
  const portions = init.split('.')
  portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  if (portions.length == 1) return portions[0]
  return portions[0] + '.' + portions[1]
}

function regularFormat(num: Decimal, precision: number) {
  if (num === null || num === undefined) return 'NaN'
  if (num.mag < 0.0001) return (0).toFixed(precision)
  if (num.mag < 0.1 && precision !== 0) precision = Math.max(precision, 4)
  return num.toStringWithDecimalPlaces(precision)
}

export function format(decimal: DecimalSource, precision = 4): string {
  switch (player.options.notation) {
    case notations.STANDARD:
      return Standard.format(decimal)
    case notations.LETTER:
      return Letters.format(decimal)
    case notations.EMPTY:
      return ''
    case notations.HYPER_E:
      return HyperE.format(decimal)
    case notations.BINARY:
      return precision == 0 ? BinaryWhole.format(decimal) : BinaryFormat.format(decimal)
    case notations.TERNARY:
      return precision == 0 ? TernaryWhole.format(decimal) : TernaryFormat.format(decimal)
    case notations.QUATERNARY:
      return precision == 0 ? QuaternaryWhole.format(decimal) : QuaternaryFormat.format(decimal)
    case notations.SEXIMAL:
      return precision == 0 ? SeximalWhole.format(decimal) : SeximalFormat.format(decimal)
    case notations.OCTAL:
      return precision == 0 ? OctalWhole.format(decimal) : OctalFormat.format(decimal)
    case notations.DUODECIMAL:
      return precision == 0 ? DuodecimalFormat.format(decimal) : DuodecimalWhole.format(decimal)
    case notations.HEXADECIMAL:
      return precision == 0 ? HexadecimalFormat.format(decimal) : HexadecimalWhole.format(decimal)
    case notations.BASE36:
      return precision == 0 ? Base36Format.format(decimal) : Base36Whole.format(decimal)
    case notations.BASE62:
      return precision == 0 ? Base62Format.format(decimal) : Base62Whole.format(decimal)
    case notations.BALANCED_TERNARY:
      return precision == 0 ? BalancedTernary.format(decimal) : BalancedTernaryWhole.format(decimal)
    case notations.BIJECTIVE_DECIMAL:
      return BijectiveDecimal.format(decimal)
    // case notations.OMEGA_META_ZERO:
    //  return OmegaMetaZero.format(decimal)
    case notations.FGH:
      return FastGrowingHierarchy.format(decimal)
    case notations.HH:
      return HardyHierarchy.format(decimal)
    case notations.BASE_THREE_HALVES:
      return BaseThreeHalves.format(decimal)
    case notations.BASE_PHI:
      return BasePhi.format(decimal)
    case notations.BASE_PI:
      return BasePi.format(decimal)
    case notations.BASE_E:
      return BaseE.format(decimal)
    case notations.OMEGA:
      return Omega.format(decimal)
    case notations.POWEROF1:
      return 1 .toFixed(precision)
  }
  decimal = new Decimal(decimal)
  if (decimal.sign < 0) return '-' + format(decimal.neg(), precision)
  if (decimal.isNan()) return 'NaN'
  if (decimal.mag == Number.POSITIVE_INFINITY) return 'Infinity'
  if (decimal.gte('eeee1000')) {
    const slog = decimal.slog()
    if (slog.gte(1e6)) return 'F' + format(slog.floor())
    else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + 'F' + commaFormat(slog.floor(), 0)
  } else if (decimal.gte('ee8')) return exponentialFormat(decimal, precision, false)
  else if (decimal.gte('1e10000')){
    const reduce = decimal.log10().log10().floor().toNumber()
    const precisionReduced = Math.max(precision - reduce + 3, 0)
    return exponentialFormat(decimal, precisionReduced)
  }
  else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
  else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
  else if (decimal.gte(0.0001)) return regularFormat(decimal, precision)
  else if (decimal.gt(0)) {
    let exponent = decimal.log10().floor()
    if (player.options.notation == notations.ENGINEERING) exponent = decimal.log10().div(3).floor().mul(3)
    const mantissa = decimal.div(Decimal.pow(10, exponent))
    if (exponent.lte('-eee1000')) return '1/' + format(decimal.recip(), precision)
    if (exponent.lte(-1e9)) return 'e' + format(exponent, precision)
    if (player.options.notation == notations.LOGARITHMIC) return 'e' + format(exponent.add(mantissa.log10()), precision)
    return format(mantissa, precision) + 'e' + formatWhole(exponent)
  } else return (0).toFixed(precision)
}
const DT = Decimal.tetrate(10, 6)

export function formatGain(a: DecimalSource, e: DecimalSource, resourceName: string = '') {
	a = new Decimal(a);
	e = new Decimal(e);
	const FPS = 1000 / (diff || 40);
	const g = Decimal.add(a, e.div(FPS));

	if (g.neq(a)) {
		if (a.gte(Decimal.tetrate(10, 6))) {
			var oom = new Decimal(g).slog(10).sub(new Decimal(a).slog(10)).mul(FPS);
			if (oom.gte(1e-3)) return '(+' + format(oom) + '数量级<sup>数量级</sup>' + '/s)';
		}

		if (a.gte('ee100')) {
			let tower = Math.floor(new Decimal(a).slog(10).toNumber() - 1.3010299956639813);

			var oom = new Decimal(g)
					.iteratedlog(10, tower)
					.sub(new Decimal(a).iteratedlog(10, tower))
					.mul(FPS),
				rated = false;

			if (oom.gte(1)) rated = true;
			else if (tower > 2) {
				tower--;
				oom = new Decimal(g)
					.iteratedlog(10, tower)
					.sub(new Decimal(a).iteratedlog(10, tower))
					.mul(FPS);
				if (oom.gte(1)) rated = true;
			}

			if (rated) return '(+' + format(oom) + '数量级<sup>' + tower + '</sup>' + '/s)';
		}

		if (a.gte(1e100)) {
			const oom = g.div(a).log10().mul(FPS);
			if (oom.gte(1)) return '(+' + format(oom) + '数量级' + '/s)';
		}
	}

	return '(' + (e.sign >= 0 ? '+' : '') + format(e) + resourceName + '/s)';
}
export function formatTime(ex: DecimalSource, acc = 3, type = 's'): string {
  ex = new Decimal(ex)
  if (ex.mag == Infinity) return '5更新时'
  if (ex.gte(31536000)) {
    return format(ex.div(31536000).floor(), 0) + '年' + (ex.div(31536000).gte(1e9) ? '' : ' ' + formatTime(ex.mod(31536000), acc, '年'))
  }
  if (ex.gte(86400)) {
    var n = ex.div(86400).floor()
    return (n.gt(0) || type == 'd' ? format(ex.div(86400).floor(), 0) + '天' : '') + formatTime(ex.mod(86400), acc, '天')
  }
  if (ex.gte(3600)) {
    var n = ex.div(3600).floor()
    return (n.gt(0) || type == 'h' ? format(ex.div(3600).floor(), 0) + '时' : '') + formatTime(ex.mod(3600), acc, '时')
  }
  if (ex.gte(60)) {
    var n = ex.div(60).floor()
    return (n.gt(0) || type == 'm' ? format(n, 0) + '分' : '') + formatTime(ex.mod(60), acc, '分')
  }
  return ex.gt(0) || type == 's' ? format(ex, acc) + '秒' : ''
}

export function formatReduction(ex: DecimalSource, acc?: number) {
  return format(Decimal.sub(1, ex).mul(100), acc) + '%'
}

export function formatPercent(ex: DecimalSource, acc?: number) {
  return format(Decimal.mul(ex, 100), acc) + '%'
}

export function formatMult(ex: DecimalSource, acc?: number) {
  return Decimal.gte(ex, 1) ? '×' + format(ex, acc) : '/' + format(Decimal.pow(ex, -1), acc)
}

export function formatPow(ex: DecimalSource, acc?: number) {
  return '^' + format(ex, acc)
}

export function formatWhole(decimal: DecimalSource): string {
  decimal = new Decimal(decimal).floor()
  if (decimal.gte(1e9)) return format(decimal, 4)
  return format(decimal, 0)
}

export function formatLaTeX(decimal: DecimalSource) {
  switch (player.options.notation) {
    case notations.FGH:
      return FGHLatex.format(decimal)
    case notations.HH:
      return HHLatex.format(decimal)
    case notations.OMEGA:
      return OmegaLaTex.format(decimal)
    default: return "\\text{" + format(decimal) + "}"
  }
}

export function formatLaTeXWhole(decimal: DecimalSource) {
  switch (player.options.notation) {
    case notations.FGH:
      return FGHLatex.format(decimal)
    case notations.HH:
      return HHLatex.format(decimal)
    case notations.OMEGA:
      return OmegaLaTex.format(decimal)
    default: return "\\text{" + formatWhole(decimal) + "}"
  }
}
// https://github.com/MathCookie17/Eternal-Notations/blob/main/src/notations/physicalScale.ts

function toDecimal(value: DecimalSource): Decimal {
  if (typeof value == 'object') {
    let d = new Decimal()
    d.sign = value.sign
    d.mag = value.mag
    d.layer = value.layer
    return d
  } else if (typeof value == 'string') return Decimal.fromString(value, true)
  else return Decimal.fromValue(value)
}

export function inverse_factorial(value: DecimalSource, iterations: number = 1): Decimal {
  let valueD = toDecimal(value)
  if (valueD.eq(1)) return new Decimal(1)
  if (valueD.eq(2)) return new Decimal(2)
  if (iterations < 0) return iteratedfactorial(valueD, -iterations)
  //I'm not dealing with the uncertainty of negative factorials here. I carefully studied super-root to handle small inputs for it in break_eternity, and maybe with enough studying I could handle small inputs for a single-factorial, but multiple factorials would be far too chaotic.
  //Besides, handling special cases like that might be useful for break_eternity (a large number library), but not for eternal_notations (a notations library).
  if (valueD.lt(iteratedfactorial(0.461632144968362341262659542325, iterations)))
    throw new Error('Inverse_factorial is currently unsupported for values below the local minimum. Sorry!')
  //Loop procedure adapted from Decimal.linear_sroot
  let upperBound = new Decimal(2)
  if (valueD.gt(2)) upperBound = valueD.linear_sroot(Math.floor(iterations + 1)).mul(2) //x! is lower-bounded by (x/2)^^2
  let lower = Decimal.dZero //This is zero because we might be on a higher layer, so the lower bound might actually some 10^10^10...^0
  let layer = upperBound.layer
  if (layer == 0) lower = new Decimal(0.461632144968362341262659542325)
  let upper = upperBound.iteratedlog(10, layer, true)
  let previous = upper
  let guess = upper.div(2)
  let loopGoing = true
  while (loopGoing) {
    guess = lower.add(upper).div(2)
    if (iteratedfactorial(Decimal.iteratedexp(10, layer, guess, true), iterations).gt(valueD)) upper = guess
    else lower = guess
    if (guess.eq(previous)) loopGoing = false
    else previous = guess
  }
  if (iteratedfactorial(Decimal.iteratedexp(10, layer, guess, true), iterations).eq_tolerance(valueD, 1e-9))
    return Decimal.iteratedexp(10, layer, guess, true)
  else return new Decimal(NaN)
}

/**
 * This function is to iteratedexpmult and iteratedmultlog as slog is to iteratedexp/tetrate and iteratedlog.
 */
export function multslog(value: DecimalSource, base: DecimalSource, mult: DecimalSource): Decimal {
  let [valueD, baseD, multD] = [value, base, mult].map(toDecimal)
  return valueD.slog(baseD.pow(multD.recip()), 100, true)
}

/**
 * This function is to iteratedfactorial and inverse_factorial as slog is to iteratedexp and iteratedlog: it returns the amount of times factorial must be applied to the base to return the given value.
 * @param value ( Decimal ! ) The value we're finding the factorial_slog for.
 * @param base ( Decimal ) The number that the factorials are repeatedly applied to. The base must be greater than 2. Default is 3.
 */
export function factorial_slog(value: DecimalSource, base: DecimalSource = 3): Decimal {
  let valueD = toDecimal(value)
  let baseD = toDecimal(base)
  if (baseD.lte(2))
    throw new RangeError("factorial_slog is not supported for bases equal to or below 2, since iteratedfactorial isn't increasing for those bases.")
  if (valueD.eq(2)) return new Decimal(-Infinity)
  if (valueD.lt(2)) return new Decimal(NaN)
  if (valueD.eq(baseD)) return new Decimal(0) //Combats imprecision
  if (valueD.gte(Decimal.tetrate(baseD, 1e17))) return valueD.slog(baseD, 100, true) //At this scale the difference between factorial_slog and regular slog is lost in precision
  if (valueD.lt(baseD)) {
    let lower = -1e-18
    let upper = -2e-18
    let guess = 0
    while (iteratedfactorial(baseD, upper).gt(valueD)) {
      lower *= 2
      upper *= 2
    }
    let previous = -1
    while (previous != guess) {
      previous = guess
      guess = (lower + upper) / 2
      if (iteratedfactorial(baseD, guess).gt(valueD)) lower = guess
      else upper = guess
    }
    return toDecimal(guess)
  } else {
    let lower = 1e-18
    let upper = 2e-18
    let guess = 0
    while (iteratedfactorial(baseD, upper).lt(valueD)) {
      lower *= 2
      upper *= 2
    }
    let previous = -1
    while (previous != guess) {
      previous = guess
      guess = (lower + upper) / 2
      if (iteratedfactorial(baseD, guess).lt(valueD)) lower = guess
      else upper = guess
    }
    return toDecimal(guess)
  }
}

function iteratedfactorial(value: DecimalSource, iterations: number = 1): Decimal {
  let valueD = toDecimal(value)
  if (iterations == 0) return valueD
  if (iterations == 1) return valueD.factorial()
  if (valueD.lt(0.461632144968362341262659542325) && iterations % 1 != 0) return new Decimal(NaN) //I'm not sure what fractional iterations would mean below the local minimum
  if (iterations < 0) return inverse_factorial(valueD, -iterations)
  let wholeiterations = Math.floor(iterations)
  let fraciterations = iterations - wholeiterations
  let payload = valueD
  if (fraciterations != 0) payload = payload.mul(valueD.factorial().div(valueD).pow(fraciterations))
  for (let f = 0; f < wholeiterations; f++) {
    if (payload.eq(1)) return new Decimal(1) //1!!!!!... is always 1
    if (payload.eq(2)) return new Decimal(2) //2!!!!!... is always 2
    if (payload.gt(new Decimal(Number.MAX_SAFE_INTEGER).pow10())) return Decimal.iteratedexp(10, wholeiterations - f, payload, true)
    payload = payload.factorial()
    if (f > 10000) return payload //Bail after 10000 iterations if nothing is happening
  }
  return payload
}

/**
 * This function gives a physical description of the Decimal it's given, to get across how large the number is.
 * For reasonably-sized numbers, this function expresses them in terms of how large of a volume you could fill with that many litres of water.
 * Once we get beyond the observable universe, it starts going to 4D versions of galaxies and universes, then 5D, and so on.
 * Then, for numbers where the amount of dimensions gets too large, it switches to considering an endlessly-replicating bacteria colony that doubles every second, and it tells you how long it would take for that exponential growth to reach your number.
 * Once that timespan becomes too long, it switches to considering the amount of possible permutations of the atoms in various objects.
 * Beyond that point, it switches between the atoms and bacteria scenarios, examining permutations, then permutations of the permutations, and so on.
 * Finally, for tetrational numbers, it gives up on representing the number itself and instead considers writing them as a power tower of 10s and how tall that power tower would be.
 *
 * Though this function behaves similarly to a Notation, it is not actually a Notation.
 *
 * @param value ( Decimal ! ) The value to give a description of.
 */
export function physicalScale(value: DecimalSource): string {
  value = toDecimal(value)
  let negative = false
  if (value.eq(0)) return "拥有0升水，你会因无水可饮而口渴。"
  if (value.eq(Decimal.dInf) || value.eq(Decimal.dNegInf)) return '没有能衡量无穷大的尺度。'
  if (value.eq(Decimal.dNaN)) return '这不是一个数字。'
  if (!value.isFinite()) return '输入似乎存在错误。'
  if (value.lt(0)) {
    negative = true
    value = value.abs()
  }
  let recip = false
  if (value.lt(2.82e-42)) {
    recip = true
    value = value.recip()
  }
  if (negative && !recip) return '（暂不支持负数，所以使用其绝对值替代）' + physicalScale(value)
  if (!negative && recip) return '（这个数太小了，所以使用其倒数作为替代）' + physicalScale(value)
  if (negative && recip) return '（这个数是一个负数且非常小，所以使用其倒数的相反数替代）' + physicalScale(value)
  // let dn = new DefaultNotation();
  let scaleResult = physicalScaleInternal(value)
  if (scaleResult[0] == 0) {
    let amount = value.div(scaleResult[2])
    return '拥有' + format(value) + '升水，你可以填满' + format(amount) + scaleResult[1] + '。'
  } else if (scaleResult[0] == 1) {
    let dimension = scaleResult[3]
    let amount = value.div(scaleResult[2].pow(dimension.div(3)))
    return (
      '拥有' +
      format(value) +
      '升' +
      formatWhole(dimension) +
      '维水，你可以填满' +
      format(amount) +
      ' ' +
      formatWhole(dimension) +
      '维' +
      scaleResult[1] +
      '.'
    )
  } else if (scaleResult[0] == 2) {
    let factorials = scaleResult[3]
    let amount = inverse_factorial(value, factorials).div(scaleResult[2])
    if (factorials == 0) return format(value) + ' atoms would be enough to make ' + format(amount) + ' ' + scaleResult[1] + '.'
    else if (factorials == 1)
      return format(value) + '是重新排列' + format(amount) + scaleResult[1] + '中所有原子的方法种数。'
    else if (factorials == 2)
      return (
        'If you recorded every single way to rearrange all of the atoms in ' +
        format(amount) +
        ' ' +
        scaleResult[1] +
        ', then the amount of ways to rearrange that set of rearrangements would be ' +
        format(value) +
        '.'
      )
    else if (factorials == 2)
      return (
        'If you recorded every single way to rearrange all of the atoms in ' +
        format(amount) +
        ' ' +
        scaleResult[1] +
        ', then the amount of ways to rearrange that set of rearrangements would be ' +
        format(value) +
        '.'
      )
    else if (factorials == 3)
      return (
        'If you recorded every single way to rearrange all of the atoms in ' +
        format(amount) +
        ' ' +
        scaleResult[1] +
        ', then recorded every way to rearrange that set of rearrangements, then recorded every way to rearrange THAT set, the size of the final resulting set would be ' +
        format(value) +
        '.'
      )
    else if (factorials == 4)
      return (
        'If you recorded every single way to rearrange all of the atoms in ' +
        format(amount) +
        ' ' +
        scaleResult[1] +
        ', then recorded every way to rearrange that set of rearrangements, then recorded every way to rearrange THAT set, and repeat that step 1 more time, the size of the final resulting set would be ' +
        format(value) +
        '.'
      )
    else
      return (
        'If you recorded every single way to rearrange all of the atoms in ' +
        format(amount) +
        ' ' +
        scaleResult[1] +
        ', then recorded every way to rearrange that set of rearrangements, then recorded every way to rearrange THAT set, and repeat that step ' +
        format(factorials - 3) +
        ' more times, the size of the final resulting set would be ' +
        format(value) +
        '.'
      )
  } else if (scaleResult[0] == 3) {
    let factorials = scaleResult[3]
    let amount = inverse_factorial(value, factorials).log(2).div(scaleResult[2])
    if (factorials == 0)
      return (
        '如果从单个细菌开始，在无限空间和资源下每秒分裂一次，需要' +
        format(amount) + 
        scaleResult[1] +
        "的时间才能让菌落达到" +
        format(value) +
        '的种群数量。'
      )
    else if (factorials == 1)
      return (
        'If you started with a single bacteria and the bacteria split in two every second, then with unlimited space and resources, if you let it grow for ' +
        format(amount) +
        ' ' +
        scaleResult[1] +
        ', the amount of ways to rearrange all of the bacteria in the colony would be ' +
        format(value) +
        '.'
      )
    else if (factorials == 2)
      return (
        'If you started with a single bacteria and the bacteria split in two every second, then with unlimited space and resources, if you let it grow for ' +
        format(amount) +
        ' ' +
        scaleResult[1] +
        ', then you recorded every single way to rearrange all of the bacteria in the colony, then the amount of ways to rearrange that set of rearrangements would be ' +
        format(value) +
        '.'
      )
    else if (factorials == 3)
      return (
        'If you started with a single bacteria and the bacteria split in two every second, then with unlimited space and resources, if you let it grow for ' +
        format(amount) +
        ' ' +
        scaleResult[1] +
        ', then you recorded every single way to rearrange all of the bacteria in the colony, then recorded every way to rearrange that set of rearrangements, then recorded every way to rearrange THAT set, the size of the final resulting set would be ' +
        format(value) +
        '.'
      )
    else if (factorials == 4)
      return (
        'If you started with a single bacteria and the bacteria split in two every second, then with unlimited space and resources, if you let it grow for ' +
        format(amount) +
        ' ' +
        scaleResult[1] +
        ', then you recorded every single way to rearrange all of the bacteria in the colony, then recorded every way to rearrange that set of rearrangements, then recorded every way to rearrange THAT set, and repeat that step 1 more time, the size of the final resulting set would be ' +
        format(value) +
        '.'
      )
    else
      return (
        'If you started with a single bacteria and the bacteria split in two every second, then with unlimited space and resources, if you let it grow for ' +
        format(amount) +
        ' ' +
        scaleResult[1] +
        ', then you recorded every single way to rearrange all of the bacteria in the colony, then recorded every way to rearrange that set of rearrangements, then recorded every way to rearrange THAT set, and repeat that step ' +
        format(factorials - 3) +
        ' more times, the size of the final resulting set would be ' +
        format(value) +
        '.'
      )
  } else if (scaleResult[0] == 4 || scaleResult[0] == 5) {
    let nanocosmic = scaleResult[3]
    let amount = value.slog(10, 100, true).div(scaleResult[2])
    if (nanocosmic == 0) {
      if (scaleResult[0] == 5)
        return (
          'If ' +
          format(value) +
          ' was written as a power tower of 10s in 12-point font, that tower would be ' +
          format(amount) +
          ' times as tall as ' +
          scaleResult[1] +
          '.'
        )
      else
        return (
          'If ' +
          format(value) +
          ' was written as a power tower of 10s in 12-point font, that tower would be as tall as ' +
          format(amount) +
          ' ' +
          scaleResult[1] +
          '.'
        )
    } else if (nanocosmic == 1) {
      if (scaleResult[0] == 5)
        return (
          'If ' +
          format(value) +
          ' was written as a power tower of 10s in 12-point font, that tower would be ' +
          format(amount) +
          ' times as tall as ' +
          scaleResult[1] +
          ' in a larger universe where each proton is as large as our universe.'
        )
      else
        return (
          'If ' +
          format(value) +
          ' was written as a power tower of 10s in 12-point font, that tower would be as tall as ' +
          format(amount) +
          ' ' +
          scaleResult[1] +
          ' in a larger universe where each proton is as large as our universe.'
        )
    } else if (nanocosmic == 2) {
      if (scaleResult[0] == 5)
        return (
          'Consider a large universe where each proton is as large as a smaller universe, and each proton in such a smaller universe is itself as large as our universe. If ' +
          format(value) +
          ' was written as a power tower of 10s in 12-point font in our universe, that tower would be ' +
          format(amount) +
          ' times as tall as ' +
          scaleResult[1] +
          ' in that large universe.'
        )
      else
        return (
          'Consider a large universe where each proton is as large as a smaller universe, and each proton in such a smaller universe is itself as large as our universe. If ' +
          format(value) +
          ' was written as a power tower of 10s in 12-point font in our universe, that tower would be as tall as ' +
          format(amount) +
          ' ' +
          scaleResult[1] +
          ' in that large universe.'
        )
    } else {
      if (scaleResult[0] == 5)
        return (
          'Consider a large universe where each proton is as large as a smaller universe, and each proton in such a smaller universe is itself as another smaller universe, and so on, where our universe is ' +
          format(nanocosmic) +
          ' layers below the largest universe. If ' +
          format(value) +
          ' was written as a power tower of 10s in 12-point font in our universe, that tower would be ' +
          format(amount) +
          ' times as tall as ' +
          scaleResult[1] +
          ' in that large universe.'
        )
      else
        return (
          'Consider a large universe where each proton is as large as a smaller universe, and each proton in such a smaller universe is itself as another smaller universe, and so on, where our universe is ' +
          format(nanocosmic) +
          ' layers below the largest universe. If ' +
          format(value) +
          ' was written as a power tower of 10s in 12-point font in our universe, that tower would be as tall as ' +
          format(amount) +
          ' ' +
          scaleResult[1] +
          ' in that large universe.'
        )
    }
  } else return 'There appears to be an error, either in the input or in this function.'
}

function physicalScaleInternal(value: Decimal): [number, string, Decimal, ...any[]] {
  if (value.lt(Decimal.pow(2, 86400))) {
    /**
     * For reasonably-sized numbers, gives you how much that many litres of water would fill.
     * The main sources used were the Antimatter Dimensions Statistics page ( list of objects found https://antimatter-dimensions.fandom.com/wiki/Statistics ) and the Wikipedia article on Orders of magnitude (volume), https://en.wikipedia.org/wiki/Orders_of_magnitude_(volume). Note that Antimatter Dimensions itself clearly used that Wikipedia article as its own source.
     * The uranium nucleus volume was found by multiplying the volume of a proton by 238 (uranium's atomic weight, i.e. the amount of particles in its nucleus - protons and neutrons have near-idential volumes, so no need to differentiate between them)
     * The diameter of a water molecule seems to be somewhere from 260 to 280 pm according to various sources; 280 pm was used here since it was the figure I saw the most.
     * When I think of a "large" water bottle, I think of a one-litre bottle, and I feel that a water bottle is a good starting point as an amount of water a person can understand.
     * I've seen several sources claim that car fuel tanks hold on average 12-16 US gallons, so I used 14 US gallons here
     * Type C school bus dimensions taken from https://www.measuringknowhow.com/school-bus-dimensions/, using the mean for all three dimensions
     * Apparently the volume of Sydney Harbor is actually used as a unit sometimes
     * Lake Superior may not be the single largest lake in the world, but I think it counts as the most famous-for-its-size lake.
     * Of course I'm going to use the Pacific Ocean, the largest ocean in the world, here.
     * "Small dwarf galaxies" comes from "Estimated volume of a small dwarf galaxy like NGC 1705" on the Wikipedia article, "galaxies" uses the Milky Way, "galaxy groups" uses the Local Group, and "galactic superclusters" uses the Virgo Supercluster
     * Most of the rest agree with Antimatter Dimensions, but with some names changed
     * Beyond the observable universe, moves to 4D, then 5D, etc.
     */
    let objects = [
      '质子',
      '铀原子核',
      '氢原子',
      '水分子',
      '病毒',
      '红细胞',
      '沙粒',
      '米粒',
      '茶匙',
      '大号水瓶',
      '汽车油箱',
      '冰箱',
      '校车',
      '奥林匹克规格的游泳池',
      '吉萨大金字塔',
      '长城',
      '苏必利尔湖',
      '太平洋',
      '地球',
      '木星',
      '太阳',
      '红巨星',
      '超巨星',
      '星云',
      '奥尔特云',
      '小型矮星系',
      '银河系',
      '星系群',
      '超星系团',
      '可观测宇宙',
    ]
    let volumes = [
      2.82e-42, 6.7116e-40, 7.23e-27, 2.1952e-26, 5e-18, 9e-14, 6.2e-8, 5e-5, 3.555e-3, 1, 52.995764976, 1000, 67596.84, 2.5e6, 2.6006e9, 3.3e11,
      1.2232e16, 6.6988e20, 1.08321e24, 1.4313e27, 1.412e30, 5e35, 8e39, 1.7e48, 1.7e51, 3e58, 3.3e64, 5e71, 3.5e75, 3.4e83,
    ].map(toDecimal)
    let index = 0
    let dimension = new Decimal(3)
    let rootedValue = value
    if (value.gte(Decimal.pow(3.3e64, 4 / 3))) {
      index = 26
      dimension = value.log(3.4e83).mul(3).floor()
      rootedValue = value.root(dimension.div(3))
      let nextRootedValue = value.root(dimension.plus(1).div(3))
      if ((dimension.lt(6) && nextRootedValue.gte(5e71)) || (dimension.lt(9) && nextRootedValue.gte(3.5e75))) {
        dimension = dimension.plus(1)
        rootedValue = nextRootedValue
      }
    }
    while (index < objects.length - 1 && volumes[index + 1].lte(rootedValue)) index++
    if (dimension.eq(3)) return [0, objects[index], volumes[index], dimension]
    else return [1, objects[index], volumes[index], dimension]
  } else if (value.lt(Decimal.tetrate(10, 66))) {
    let factorials = factorial_slog(value).sub(factorial_slog(1.00369e14)).floor().max(0).toNumber()
    value = inverse_factorial(value, factorials)
    if (value.lt(Decimal.pow(2, 420))) {
      /**
       * How many atoms are in this object? (I chose to use atoms here rather than the previous litres use because rearranging atoms makes more sense than rearranging litres of water)
       * This time the main source is https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass).
       * For organic things like viruses and cells where I could find their mass but not the amount of atoms in them, I'm pretending they're made entirely of carbon and then doubling the amount that would give me (because of hydrogen atoms contributing less mass) - based on the result I got for a human body, this seems like a good rough estimate.
       * "Viruses" uses the human adenovirus since it's medium-sized, "bacteria" uses E.coli, and "cells" uses Wikipedia's estimate of the average human cell mass
       * I saw lots of different estimates for the amount of atoms in a grain of sand, so I used the grains of sand used by Antimatter Dimensions for volume and then turned that volume into an amount of atoms using sand's density (from https://www.aqua-calc.com/page/density-table/substance/sand-coma-and-blank-dry) and chemical composition (mostly silicon dioxide).
       * For pennies, I used the actual 95% zinc and 5% copper proportions, so that one should be pretty accurate
       * I think most of the material in a baseball is the wool, so I'm going with the carbon estimate again
       * Assuming a mass of 3,200 kg for the elephant - Wikipedia lists between 2,700 and 6,300, but other websites indicate that only the males go above the low end of that range.
       * https://www.britannica.com/animal/blue-whale says that blue whales average 150 (metric) tons
       * The asteroid here is 433 Eros (https://en.wikipedia.org/wiki/433_Eros), which I believe is the asteroid Antimatter Dimensions is comparing to. I'm assuming silicon dioxide for the composition here.
       * Earth's atmosphere is used for the atmosphere example
       * For anything beyond Earth here (Jupiter and upwards), it's assumed that 75% of the mass is hydrogen and 25% of the mass is helium
       * The Milky Way is the galaxy used, and the Laniakea Supercluster is the large galactic supercluster used.
       * After the observable universe, we switch back to the final few volume objects, jam-packing that amount of space with hydrogen atoms.
       */
      let objects = ['原子',
  '病毒',
  '细菌',
  '细胞', 
  '沙粒',
  '硬币',
  '棒球',
  '人体',
  '大象',
  '蓝鲸',
  '吉萨大金字塔',
  '大型小行星',
  '大气层',
  '地球',
  '木星',
  '太阳',
  '星团',
  '星系',
  '巨型星系超团',
  '可观测宇宙',
  '完全填满的星系',
  '完全填满的星系群',
  '完全填满的星系超团',
  '完全填满的可观测宇宙']
      let atoms = [
        1, 2.51e7, 1.00369e11, 1.00369e14, 3.0408e18, 2.306e22, 1.46036e25, 7.02583e27, 3.2118e29, 1.5055e31, 6.02215e35, 4.0216e41, 2.1205e44,
        1.33e50, 6.5074e53, 6.81697e56, 3.428e61, 7.8395e68, 6.817e73, 1e80, 4.564e90, 6.916e97, 4.841e101, 4.703e109,
      ].map(toDecimal)
      let index = 0
      while (index < objects.length - 1 && atoms[index + 1].lte(value)) index++
      return [2, objects[index], atoms[index], factorials]
    } else {
      /**
       * How long would a bacteria colony that doubles in size every second take to reach a population this large?
       */
      let units = [
        '秒',
        '分钟',
        '小时',
        '天',
        '周',
        '年',
        '世纪',
        '银河年',
        '太阳寿命',
        '红矮星寿命',
        '铋-209半衰期',
      ]
      let seconds = [1, 60, 3600, 86400, 604800, 31536000, 3153600000, 7.0956e15, 3.1536e17, 3.1536e20, 6.338736e26].map(
        toDecimal,
      )
      let time = value.log(2)
      let index = 0
      while (index < units.length - 1 && seconds[index + 1].lte(time)) index++
      return [3, units[index], seconds[index], factorials]
    }
  } else {
    /**
     * If the number was written as a power tower of 10s in 12-point font, how tall would the tower be?
     * https://en.wikipedia.org/wiki/Orders_of_magnitude_(length) was used as the source for this one.
     * 12-point font has each character be 1/6 inches tall.
     * Letter paper, which is 11 inches tall, is used for the piece of paper
     * "Adult human" takes the female average and the male average and averages them together
     * The Milky Way is used for "galaxies", and the Virgo Supercluster is used for "galactic superclusters".
     */
    let nanocosmic = 0
    let length = value.slog(10, 100, true)
    while (length.gte(2.5128216e34)) {
      nanocosmic++
      length = length.mul(1.12805703456e-42)
    }
    let objects = [
      'hydrogen atoms',
      'wavelengths of green light',
      'grains of sand',
      'pieces of paper',
      'adult humans',
      'American football fields',
      'Burj Khalifas',
      'Mount Everests',
      'the altitude of the International Space Station',
      'Earths',
      'the distance from the Earth to the Moon',
      'the distance from the Earth to the Sun',
      'the distance from the Sun to Neptune',
      'the distance from the Sun to Proxima Centauri',
      'galaxies',
      'galactic superclusters',
      'observable universes',
    ]
    let heights = [
      5.6692908e-8, 0.000125787444, 0.11811024, 66, 399.21258, 21600, 32598.43, 2090281.8, 9.8622e7, 3.009921e9, 9.094488e10, 3.533808e13,
      1.0626162e15, 9.430902e18, 1.95348e23, 1.1621016e25, 4.4919702e26, 2.094018e29,
    ].map(toDecimal)
    let types = [4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 5, 5, 5, 5, 4, 4, 4]
    let index = 0
    while (index < objects.length - 1 && heights[index + 1].lte(length)) index++
    return [types[index], objects[index], heights[index].div(Decimal.pow(1.12805703456e-42, nanocosmic)), nanocosmic]
  }
}

abstract class Notation {
  //Notation stuff
  public format(value: DecimalSource): string {
    let decimal = toDecimal(value)

    if (decimal.isNan()) return this.NaNString

    if (this.isInfinite(decimal)) {
      return decimal.sgn() < 0 ? this.negativeInfinite : this.infinite
    }

    if (decimal.neq(0) && this.isInfinite(decimal.recip())) {
      return this.format(0)
    }

    return decimal.sgn() < 0 ? this.formatNegativeDecimal(decimal.abs()) : this.formatDecimal(decimal)
  }

  public formatNegativeDecimal(value: Decimal): string {
    return this.negativeString[0] + this.formatDecimal(value) + this.negativeString[1]
  }

  public abstract formatDecimal(value: Decimal): string

  //Parameter stuff
  public negativeString: [string, string] = ['-', '']
  public infinityString: string = 'Infinite'
  public negativeInfinityString: string | null = null
  public NaNString: string = '???'
  public isInfinite = (decimal: Decimal): boolean => decimal.eq(Decimal.dInf) || decimal.eq(Decimal.dNegInf)
  public name: string = ''

  public get infinite(): string {
    return this.infinityString
  }

  public get negativeInfinite(): string {
    if (this.negativeInfinityString === null) return this.negativeString[0] + this.infinityString + this.negativeString[1]
    else return this.negativeInfinityString
  }

  /**
   * Sets the five parameters that all notations have, then returns back the notation it was given but with those changes made. Parameters left undefined here are not changed.
   * @param negativeString A [string, string] or undefined. If this is a pair of strings, negative numbers have negativeString[0] placed in front of them and negativeString[1] placed after them (default is ["-", ""]). The negative string is unaltered if this is undefined.
   * @param infinityString A string or undefined. If this is a string, this becomes what the notation returns for positive infinities ("Infinite" by default). The infinity string is unaltered if this is undefined.
   * @param negativeInfinityString A string, null, or undefined. If this is a string, this becomes what the notation returns for negative infinities. If this is null, then negative infinities use negativeString and infinityString concatenated (this is the default behavior). The negative infinity string is unaltered if this is undefined.
   * @param NaNString A string or undefined. If this is a string, this becomes what the notation returns for NaN ("???" by default). The NaN string is unaltered if this is undefined.
   * @param isInfinite A Decimal => boolean function, or undefined. If this is a function, then that function is what tests if a number is considered infinite (the default is (decimal.eq(Decimal.dInf) || decimal.eq(Decimal.dNegInf)), which means "only return true if the Decimal is actually infinite", but by changing this function, this can be changed to, say, mark anything above 2^1024 as infinite). The infinite-checking function is unaltered if this is undefined.
   */
  public setNotationGlobals(
    negativeString?: [string, string],
    infinityString?: string,
    negativeInfinityString?: string | null,
    NaNString?: string,
    isInfinite?: (decimal: Decimal) => boolean,
  ): this {
    if (negativeString !== undefined) this.negativeString = negativeString
    if (infinityString !== undefined) this.infinityString = infinityString
    if (negativeInfinityString !== undefined) this.negativeInfinityString = negativeInfinityString
    if (NaNString !== undefined) this.NaNString = NaNString
    if (isInfinite !== undefined) this.isInfinite = isInfinite
    return this
  }

  /**
   * Changes the name of the Notation, then gives you back the Notation. (i.e. returns this)
   */
  public setName(name: string): this {
    this.name = name
    return this
  }
}

function multabs(value: DecimalSource): Decimal {
  let valueD = toDecimal(value)
  if (valueD.eq(0)) return new Decimal(0)
  else if (valueD.abs().lt(1)) return valueD.recip()
  else return valueD
}

function onlyAllowedCharacters(str: string, allowed: string[]): boolean {
  for (let i = 0; i < str.length; i++) {
    if (allowed.indexOf(str[i]) === -1) return false
  }
  return true
}

function scientifify(
  value: DecimalSource,
  base: DecimalSource = Decimal.dTen,
  rounding: DecimalSource | ((value: Decimal) => Decimal) = Decimal.dZero,
  mantissaPower: DecimalSource = Decimal.dZero,
  engineerings: DecimalSource | DecimalSource[] = Decimal.dOne,
  expMultiplier: DecimalSource = Decimal.dOne,
): [Decimal, Decimal] {
  let valueD = toDecimal(value)
  let baseD = toDecimal(base)
  let mantissaPowerD = toDecimal(mantissaPower)
  let expMultiplierD = toDecimal(expMultiplier)
  if (!Array.isArray(engineerings)) engineerings = [engineerings]
  let engineeringsD: Decimal[] = engineerings.map(toDecimal)
  engineeringsD = engineeringsD
    .sort(function (a, b) {
      if (a.lt(b)) return -1
      else if (a.eq(b)) return 0
      else return 1
    })
    .reverse()
  if (valueD.eq(0)) return [new Decimal(0), new Decimal(-Infinity)]
  if (valueD.eq(Decimal.dInf)) return [new Decimal(Infinity), new Decimal(Infinity)]
  if (valueD.eq(Decimal.dNegInf)) return [new Decimal(-Infinity), new Decimal(Infinity)]
  if (!valueD.isFinite()) return [new Decimal(NaN), new Decimal(NaN)]
  if (valueD.lt(0)) {
    let preFlip = scientifify(valueD.neg(), baseD, rounding, mantissaPower, engineerings, expMultiplier)
    return [preFlip[0].neg(), preFlip[1]]
  }
  if (baseD.eq(1) || baseD.lte(0)) {
    if (baseD.lt(0)) console.log('Negative base in scientifify')
    else console.log('Invalid base in scientifify')
    return [baseD, new Decimal(NaN)]
  }
  let b = valueD.log(baseD)
  let e = currentEngineeringValue(b.sub(mantissaPowerD), engineeringsD)
  if (e.lt(0) && e.neq(b.sub(mantissaPowerD))) e = previousEngineeringValue(b.sub(mantissaPowerD), engineeringsD)
  b = Decimal.pow(base, b.sub(e))
  let unroundedB = b
  b = round(b, rounding)
  if (e.abs().gte(9e15)) b = Decimal.pow(baseD, mantissaPowerD)
  else {
    let oldB = Decimal.dZero
    let checkComplete = false
    let loopWatch = false
    do {
      oldB = unroundedB
      let upperLimit = baseD.pow(nextEngineeringValue(e, engineeringsD).sub(currentEngineeringValue(e, engineeringsD)).plus(mantissaPower))
      let lowerLimit = baseD.pow(mantissaPowerD)
      if (baseD.lt(1)) {
        if (b.lte(upperLimit)) {
          b = unroundedB.mul(baseD.pow(e)).div(baseD.pow(previousEngineeringValue(e, engineeringsD)))
          e = previousEngineeringValue(e, engineeringsD)
          unroundedB = b
          b = round(b, rounding)
          loopWatch = true
        } else if (b.gt(lowerLimit)) {
          b = unroundedB.mul(baseD.pow(e)).div(baseD.pow(nextEngineeringValue(e, engineeringsD)))
          e = nextEngineeringValue(e, engineeringsD)
          unroundedB = b
          if (loopWatch) b = lowerLimit //If we've gone both up and down, the mantissa is too close to the boundary, so just set it to the boundary value
          b = round(b, rounding)
          if (loopWatch) break
        } else checkComplete = true
      } else {
        if (b.gte(upperLimit)) {
          b = unroundedB.mul(baseD.pow(e)).div(baseD.pow(nextEngineeringValue(e, engineeringsD)))
          e = nextEngineeringValue(e, engineeringsD)
          unroundedB = b
          if (loopWatch) b = lowerLimit //If we've gone both up and down, the mantissa is too close to the boundary, so just set it to the boundary value
          b = round(b, rounding)
          if (loopWatch) break
        } else if (b.lt(lowerLimit)) {
          b = unroundedB.mul(baseD.pow(e)).div(baseD.pow(previousEngineeringValue(e, engineeringsD)))
          e = previousEngineeringValue(e, engineeringsD)
          unroundedB = b
          b = round(b, rounding)
          loopWatch = true
        } else checkComplete = true
      }
    } while (!checkComplete && oldB.neq(unroundedB))
  }
  e = e.mul(expMultiplierD)
  return [b, e]
}

export function engineeringValue(arr: Decimal[], engineerings: Decimal[]): Decimal {
  let result = new Decimal(0)
  engineerings = engineerings
    .sort(function (a, b) {
      if (a.lt(b)) return -1
      else if (a.eq(b)) return 0
      else return 1
    })
    .reverse()
  for (let i = 0; i < Math.min(arr.length, engineerings.length); i++) {
    result = result.plus(arr[i].mul(engineerings[i]))
  }
  return result
}

export function currentEngineeringValue(value: Decimal, engineerings: Decimal[]): Decimal {
  engineerings = engineerings
    .sort(function (a, b) {
      if (a.lt(b)) return -1
      else if (a.eq(b)) return 0
      else return 1
    })
    .reverse()
  if (value.eq(0)) return new Decimal(0)
  else if (value.lt(0)) return upperCurrentEngineeringValue(value.neg(), engineerings).neg()
  else return engineeringValue(currentEngineering(value, engineerings), engineerings)
}

export function nextEngineering(value: Decimal, engineerings: Decimal[]): Decimal[] {
  engineerings = engineerings
    .sort(function (a, b) {
      if (a.lt(b)) return -1
      else if (a.eq(b)) return 0
      else return 1
    })
    .reverse()
  let currentValue = Decimal.dInf
  let oldArr = currentEngineering(value, engineerings)
  let finalArr = new Array(...oldArr)
  for (let s = engineerings.length - 1; s >= 0; s--) {
    let newArr = new Array(...oldArr)
    newArr[s] = newArr[s].plus(1)
    for (let t = s + 1; t < engineerings.length; t++) {
      newArr[t] = new Decimal(0)
    }
    let newValue = engineeringValue(newArr, engineerings)
    if (newValue.gt(value) && newValue.lt(currentValue)) {
      currentValue = newValue
      finalArr = newArr
    }
  }
  return finalArr
}

export function nextEngineeringValue(value: Decimal, engineerings: Decimal[]): Decimal {
  engineerings = engineerings
    .sort(function (a, b) {
      if (a.lt(b)) return -1
      else if (a.eq(b)) return 0
      else return 1
    })
    .reverse()
  if (value.eq(0)) return engineerings[engineerings.length - 1]
  else if (value.lt(0)) return previousEngineeringValue(value.neg(), engineerings).neg()
  else return engineeringValue(nextEngineering(value, engineerings), engineerings)
}

export function previousEngineering(value: Decimal, engineerings: Decimal[]): Decimal[] {
  engineerings = engineerings
    .sort(function (a, b) {
      if (a.lt(b)) return -1
      else if (a.eq(b)) return 0
      else return 1
    })
    .reverse()
  let currentValue = Decimal.dNegInf
  let oldArr = currentEngineering(value, engineerings)
  let finalArr = new Array(...oldArr)
  for (let s = engineerings.length - 1; s >= 0; s--) {
    if (oldArr[s].gt(0)) {
      let newArr = new Array(...oldArr)
      newArr[s] = newArr[s].minus(1)
      newArr = newArr.slice(0, s + 1)
      let newValue = engineeringValue(newArr, engineerings)
      let difference = engineerings[s]
      for (let t = s + 1; t < engineerings.length; t++) {
        let coefficient = difference.div(engineerings[t]).floor().max(0)
        let portion = coefficient.mul(engineerings[t])
        if (portion.eq(difference)) {
          coefficient = coefficient.sub(1)
          portion = portion.sub(engineerings[t])
        }
        difference = difference.sub(portion)
        newValue = newValue.add(portion)
        newArr.push(coefficient)
      }
      if (newValue.lt(value) && newValue.gt(currentValue)) {
        currentValue = newValue
        finalArr = newArr
      }
    }
  }
  return finalArr
}

export function previousEngineeringValue(value: Decimal, engineerings: Decimal[]): Decimal {
  engineerings = engineerings
    .sort(function (a, b) {
      if (a.lt(b)) return -1
      else if (a.eq(b)) return 0
      else return 1
    })
    .reverse()
  if (value.eq(0)) return engineerings[engineerings.length - 1].neg()
  else if (value.lt(0)) return nextEngineeringValue(value.neg(), engineerings).neg()
  else return engineeringValue(previousEngineering(value, engineerings), engineerings)
}

export function currentEngineering(value: Decimal, engineerings: Decimal[]): Decimal[] {
  if (value.lt(0)) throw new RangeError('currentEngineering does not currently support negative values')
  if (value.eq(0)) return Array(engineerings.length).fill(Decimal.dZero)
  engineerings = engineerings
    .sort(function (a, b) {
      if (a.lt(b)) return -1
      else if (a.eq(b)) return 0
      else return 1
    })
    .reverse()
  let arr: Decimal[] = []
  let currentValue = new Decimal(value)
  for (let s = 0; s < engineerings.length; s++) {
    let portion = currentValue.div(engineerings[s]).floor().max(0)
    currentValue = currentValue.sub(portion.mul(engineerings[s]))
    if (currentValue.lt(0)) {
      portion = portion.sub(1)
      currentValue = currentValue.plus(engineerings[s])
    }
    arr.push(portion)
  }
  return arr
}

export function upperCurrentEngineeringValue(value: Decimal, engineerings: Decimal[]): Decimal {
  let c = currentEngineeringValue(value, engineerings)
  if (value.eq(c)) return c
  else return nextEngineeringValue(value, engineerings)
}

const defaultBaseChars = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '+',
  '/',
]

function hyperscientifify(
  value: DecimalSource,
  base: DecimalSource = Decimal.dTen,
  rounding: DecimalSource | ((value: Decimal) => Decimal) = Decimal.dZero,
  hypermantissaPower: DecimalSource = Decimal.dZero,
  engineerings: DecimalSource | DecimalSource[] = Decimal.dOne,
  expMultiplier: DecimalSource = Decimal.dOne,
  hyperexpMultiplier: DecimalSource = Decimal.dOne,
): [Decimal, Decimal] {
  let valueD = toDecimal(value)
  let baseD = toDecimal(base)
  let hypermantissaPowerD = toDecimal(hypermantissaPower)
  let expMultiplierD = toDecimal(expMultiplier)
  let hyperexpMultiplierD = toDecimal(hyperexpMultiplier)
  let effectiveBase = baseD.pow(expMultiplierD.recip())
  if (!Array.isArray(engineerings)) engineerings = [engineerings]
  let engineeringsD: Decimal[] = engineerings.map(toDecimal)
  engineeringsD = engineeringsD
    .sort(function (a, b) {
      if (a.lt(b)) return -1
      else if (a.eq(b)) return 0
      else return 1
    })
    .reverse()
  if (effectiveBase.lte(1)) return [baseD, new Decimal(NaN)]
  if (valueD.eq(Decimal.dInf)) return [new Decimal(Infinity), new Decimal(Infinity)]
  if (valueD.eq(Decimal.dNegInf)) return [new Decimal(-Infinity), new Decimal(-2)]
  if (!valueD.isFinite()) return [new Decimal(NaN), new Decimal(NaN)]
  if (valueD.gte(effectiveBase.tetrate(Infinity))) return [valueD.div(effectiveBase.tetrate(Infinity)), new Decimal(Infinity)]
  let e: Decimal, b: Decimal
  if (
    valueD.lt(iteratedexpmult(baseD, 1, engineeringsD[engineeringsD.length - 1].mul(10).toNumber(), expMultiplierD)) &&
    valueD.gt(Decimal.max(-Infinity, iteratedexpmult(baseD, 1, engineeringsD[engineeringsD.length - 1].mul(-10).toNumber(), expMultiplierD)))
  ) {
    // We really want to avoid calling slog on small numbers, so just let the "oldB" loop below handle it. The loop limit of 10 was chosen arbitrarily.
    e = new Decimal(0)
    b = valueD
  } else {
    e = currentEngineeringValue(multslog(valueD, baseD, expMultiplierD).sub(hypermantissaPowerD), engineeringsD)
    if (e.lt(0) && e.neq(multslog(valueD, baseD, expMultiplierD).sub(hypermantissaPowerD)))
      e = previousEngineeringValue(multslog(valueD, baseD, expMultiplierD).sub(hypermantissaPowerD), engineeringsD)
    b = iteratedmultlog(valueD, baseD, e.toNumber(), expMultiplierD)
  }
  let unroundedB = b
  b = round(b, rounding)
  if (e.abs().gte(9e15)) b = baseD.iteratedexp(hypermantissaPowerD.toNumber(), Decimal.dOne, true)
  else {
    let oldB = Decimal.dZero
    let checkComplete = false
    let loopWatch = false
    do {
      oldB = unroundedB
      let upperLimit = iteratedexpmult(
        baseD,
        Decimal.dOne,
        nextEngineeringValue(e, engineeringsD).sub(currentEngineeringValue(e, engineeringsD)).plus(hypermantissaPowerD).toNumber(),
        expMultiplierD,
      )
      let lowerLimit = iteratedexpmult(baseD, Decimal.dOne, hypermantissaPowerD.toNumber(), expMultiplierD)
      if (b.gte(upperLimit)) {
        b = iteratedmultlog(unroundedB, baseD, nextEngineeringValue(e, engineeringsD).sub(e).toNumber(), expMultiplierD)
        e = nextEngineeringValue(e, engineeringsD)
        unroundedB = b
        if (loopWatch) b = lowerLimit //If we've gone both up and down, the mantissa is too close to the boundary, so just set it to the boundary value
        b = round(b, rounding)
        if (loopWatch) break
      } else if (b.lt(lowerLimit)) {
        b = iteratedexpmult(baseD, unroundedB, e.sub(previousEngineeringValue(e, engineeringsD)).toNumber(), expMultiplierD)
        e = previousEngineeringValue(e, engineeringsD)
        unroundedB = b
        b = round(b, rounding)
        loopWatch = true
      } else checkComplete = true
    } while (!checkComplete && oldB.neq(unroundedB))
  }
  e = e.mul(hyperexpMultiplierD)
  return [b, e]
}

/**
 * Converts a given number into a different base.
 * @param value ( number ! ) The number to be converted.
 * @param base ( number | string[] ! ) This can be either a number or an array of strings. If the base is a number, the default set of digits for that base is used: 0 through 9, then A through Z, then a through z, then + and /. This notation will throw an error if base is a number above 64, as only 64 default digits are chosen. If base is an array of strings, then those strings are taken as the digits of the base (the number of the base is base.length in this case); bases above 64 are allowed if you provide an array with more than 64 strings.
 * @param placesAbove1 ( number ) The amount of decimal places shown for numbers above 1. If this is negative, then the absolute value of this parameter is the amount of significant figures shown (though place values before the decimal point are never cut off). This value must be set to zero if negaDigits is -1 or base, as bijective bases do not support non-whole numbers. Default is -4.
 * @param placesBelow1 ( number ) The amount of decimal places shown for numbers below 1. If this is negative, then the absolute value of this parameter is the amount of significant figures shown (though place values before the decimal point are never cut off). This value must be set to zero if negaDigits is -1 or base, as bijective bases do not support non-whole numbers. Default is -4.
 * @param negaDigits ( number ) How many of the digits are negative? Default is 0, which means the digits are from 0 to (base - 1). For example, if negaDigits is 1, the digits are from -1 to (base - 2). For odd bases, set this to (base - 1)/2 for the "balanced" version of that base. The maximum value of negaDigits is the base itself, and the minimum value is -1 (which results in the bijective version of the base); values outside this range will throw an error. You can't set negaDigits to anything other than 0 or -1 if base is given as a number (rather than an array of strings), since digits for negative numbers are not included in the default set of digits.
 * @param commasMin ( number ) The smallest value where commas are included. If this is negative, then commas are never included. Default is 0, though this is no different from any value under base^commaSpacing.
 * @param showZeroes ( number ) A positive, zero, or negative number; default is -1. If this is positive, all the decimal places up to (places) are shown, even if some of them are zeroes at the end. If this is zero, all the decimal places up to (places) are shown, even if some are zeroes at the end, but only if not all of the decimal places are zero. If this is negative, zeroes at the end of the decimal places are not shown. If this is negative infinity, all trailing zeroes are removed, even those before the decimal point.
 * @param reverseDigits ( boolean ) If this parameter is true, digits are written right-to-left instead of left-to-right. Default is false.
 * @param commaSpacing ( number ) How many digits are between each comma. Default is 3.
 * @param commaChars ( string[] ) What are the commas? If this array of strings has only one character, that character is used as the comma. If the array has multiple characters, the array is cycled through, so commaChars[0] is used for the first comma (the comma closest to the ones place), commaChars[1] is used for the second comma, and repeat, going back to commaChars[0] after the last entry. Default is [","].
 * @param decimalChar ( string ) The character used as the decimal point. Default is ".".
 * @param negativeChar ( string ) The character used as the negative sign. Default is "-". There is no negative sign if negaDigits is between 1 and (base - 2); if negaDigits equals (base - 1) or base, the negative sign is used for positive numbers instead of negative numbers.
 * @param precision ( number ) How many digits are actually calculated before the remaining ones are just set to 0; this parameter exists so the notation doesn't bother displaying meaningless digits beyond the limit of floating point precision. Default is however many digits (2^53 - 1) has in that base.
 * @param specialDigits ( [(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][] ) An array of pairs where each pair contains a (number, number?, number?) -> boolean function and a string array; this parameter allows different place values to use different digits (though the numeric value of the base remains the same).
 * The function's arguments are the place value of the digit (the ones place is place value 0), the digit's distance from the leftmost digit, and the value being inputted, and the function returns true if this digit is to use that set of special digits instead of the normal ones; the string array is the set of special digits to be used.
 * Earlier entries in specialDigits take priority, reverting back to the digits from base if none of the special digits apply or if the one that does apply doesn't have enough entries to represent that digit.
 * @param concatenation ( null | [boolean, string, string, Notation?] ) This parameter may either be null or an array containing a boolean, then two strings, then optionally a Notation. If this parameter is not null, then when multiple of the same digit are adjacent, they'll be concatenated into a single digit with a number next to it to indicate the amount of that digit that was concatenated.
 * concatenation[1] and concatenation[2] are placed before and after the concatenation number. If concatenation[3] is undefined, the concatenation number is written in the alternate base itself, otherwise it's written in whatever notation is given. If concatenation[0] is true, then the concatenation number comes after the digit being concatenated, otherwise it comes before.
 * Default is null, i.e. no concatenation occurs.
 */
export function BaseConvert(
  value: number,
  base: number | string[],
  placesAbove1: number = -4,
  placesBelow1: number = -4,
  negaDigits: number = 0,
  commasMin: number = 0,
  showZeroes: number = -1,
  reverseDigits: boolean = false,
  commaSpacing: number = 3,
  commaChars: string[] = [','],
  decimalChar: string = '.',
  negativeChar: string = '-',
  precision: number = typeof base == 'number'
    ? Math.floor(Math.log(Number.MAX_SAFE_INTEGER) / Math.log(base) + 1)
    : Math.floor(Math.log(Number.MAX_SAFE_INTEGER) / Math.log(base.length) + 1),
  specialDigits: [(placeValue: number, fromStart?: number, outerValue?: number) => boolean, string[]][] = [],
  concatenation: null | [boolean, string, string, Notation?] = null,
): string {
  if (typeof base == 'number') {
    if (base < 0) throw new RangeError('Negative bases are not implemented')
    if (base == 0) throw new RangeError('There is no such thing as base 0')
    if (base % 1 != 0) throw new RangeError('Fractional bases are not supported')
    if (base > 64 || (base == 64 && negaDigits == -1))
      throw new RangeError('There are only 64 default base digits; if you want to use a base above 64, provide your own character array.')
    if (negaDigits == -1) base = defaultBaseChars.slice(1, base + 1)
    else if (negaDigits == 0) base = defaultBaseChars.slice(0, base)
    else throw new RangeError('You have to specify your own characters for bases with negative digits.')
  }
  let originalValue = value
  let baseNum = base.length
  if (baseNum == 0) throw new RangeError('There is no such thing as base 0')
  if (negaDigits < -1 || negaDigits > baseNum || negaDigits % 1 != 0) throw new RangeError('Invalid negaDigits value in base conversion')
  if ((placesAbove1 > 0 || placesBelow1 > 0) && (negaDigits == -1 || negaDigits == baseNum))
    throw new Error('Bijective bases do not support non-whole numbers')
  if ((placesAbove1 > 0 || placesBelow1 > 0) && baseNum == 1) throw new Error('Unary does not support non-whole numbers')
  if (baseNum == 1) return base[0].repeat(value)
  if (Math.abs(value) < 1 && (negaDigits == -1 || negaDigits == baseNum)) return ''
  if (value == 0) {
    let result = base[negaDigits]
    if (showZeroes > 0 && placesAbove1 > 0) {
      if (reverseDigits) result = decimalChar + result
      else result += decimalChar
      for (let p = 0; p < placesAbove1; p++) {
        if (reverseDigits) result = base[negaDigits] + result
        else result += base[negaDigits]
      }
    }
    return result
  }
  if (negaDigits > baseNum - 2) {
    return BaseConvert(
      -value,
      base,
      placesAbove1,
      placesBelow1,
      baseNum - negaDigits - 1,
      commasMin,
      showZeroes,
      reverseDigits,
      commaSpacing,
      commaChars,
      decimalChar,
      negativeChar,
      precision,
      specialDigits,
      concatenation,
    )
  }
  let negative = false
  if (value < 0 && negaDigits < 1) {
    negative = true
    value *= -1
  }
  let precisionSoFar = 0
  let digits: number[] = []
  let digitPosition = Math.floor(Math.log(Math.abs(value)) / Math.log(baseNum))
  let startDigitPosition = digitPosition
  let places = Math.abs(value) < 1 ? placesBelow1 : placesAbove1
  if (digitPosition < 0) {
    value *= Math.pow(baseNum, -digitPosition)
    if (places > 0) {
      places = places + digitPosition
      if (places < 0)
        return BaseConvert(
          0,
          base,
          placesAbove1,
          placesBelow1,
          negaDigits,
          commasMin,
          showZeroes,
          reverseDigits,
          commaSpacing,
          commaChars,
          decimalChar,
          negativeChar,
          precision,
          specialDigits,
          concatenation,
        )
    }
    digitPosition = 0
  }
  let sigFigs = false
  if (places < 0) {
    sigFigs = true
    if (startDigitPosition < 0) places = -places - 1
    else places = Math.max(-places - startDigitPosition - 1, 0)
  }
  while (Math.abs(value) >= Math.pow(baseNum, -places) && digitPosition >= -places && precisionSoFar < precision) {
    if (digitPosition == -places) digits.push(Math.round(value / Math.pow(baseNum, digitPosition)))
    else digits.push(Math.floor(value / Math.pow(baseNum, digitPosition)))
    value -= digits[digits.length - 1] * Math.pow(baseNum, digitPosition)
    if (digits[digits.length - 1] < -negaDigits || digits[digits.length - 1] >= baseNum - negaDigits) {
      let analyzed = digits.length - 1
      while (digits[analyzed] < -negaDigits || digits[analyzed] >= baseNum - negaDigits) {
        if (analyzed == 0 && digits[analyzed] == 0) {
          //We can only get here in a bijective base
          digits.shift()
          startDigitPosition--
          break
        }
        let extracted = Math.floor((digits[analyzed] + negaDigits) / baseNum)
        digits[analyzed] -= extracted * baseNum
        if (analyzed == 0) {
          digits.unshift(extracted)
          if (startDigitPosition < 0) {
            value /= baseNum
            digitPosition--
          } else if (sigFigs && places > 0) places--
          startDigitPosition++
          precisionSoFar++
        } else {
          digits[analyzed - 1] += extracted
          analyzed--
        }
      }
    }
    digitPosition--
    precisionSoFar++
  }
  if (digitPosition >= 0 && negaDigits == -1) {
    //We can't end a bijective base string with a bunch of 0s, so subtract 1 from the last digit and end it with a bunch of the second-highest digit and one of the highest digit instead
    let analyzed = digits.length - 1
    digits[analyzed] -= 1
    while (digits[analyzed] == 0) {
      digits[analyzed] = baseNum
      analyzed--
      if (analyzed == -1) {
        digits.shift()
        startDigitPosition--
        break
      } else digits[analyzed] -= 1
    }
  }
  while (digits[0] == 0) {
    digits.shift()
    startDigitPosition--
  }
  if (showZeroes == Number.NEGATIVE_INFINITY) {
    while (digits[digits.length - 1] == 0) digits.pop()
  } else
    while (digitPosition >= 0 || (digitPosition >= -places && showZeroes >= 0)) {
      if (negaDigits == -1) {
        if (digitPosition == 0) digits.push(baseNum)
        else digits.push(baseNum - 1)
      } else digits.push(0)
      digitPosition--
    }
  digitPosition = startDigitPosition
  let digitChars: [string, number][] = []
  let result = ''
  while (digitPosition >= 0) {
    let digitLocation = base
    for (let d = 0; d < specialDigits.length; d++) {
      if (specialDigits[d][0](digitPosition, startDigitPosition - digitPosition, value) && specialDigits[d][1].length > digits[0] + negaDigits) {
        digitLocation = specialDigits[d][1]
        break
      }
    }
    digitChars.push([digitLocation[digits[0] + negaDigits], 1])
    digits.shift()
    if (digits.length == 0) break
    digitPosition--
  }
  if (concatenation !== null) {
    for (let c = 1; c < digitChars.length; c++) {
      if (digitChars[c][0] == digitChars[c - 1][0]) {
        digitChars[c - 1][1]++
        digitChars.splice(c, 1)
        c--
      }
    }
  }
  while (digitChars.length > 0) {
    let digitStr = digitChars[0][0]
    if (concatenation !== null && digitChars[0][1] > 1) {
      digitStr = ''
      if (concatenation[3] === undefined)
        digitStr = BaseConvert(
          digitChars[0][1],
          base,
          placesAbove1,
          placesBelow1,
          negaDigits,
          commasMin,
          showZeroes,
          reverseDigits,
          commaSpacing,
          commaChars,
          decimalChar,
          negativeChar,
          precision,
          specialDigits,
          concatenation,
        )
      else digitStr = concatenation[3].format(digitChars[0][1])
      digitStr = concatenation[1] + digitStr + concatenation[2]
      if (concatenation[0]) digitStr = digitChars[0][0] + digitStr
      else digitStr += digitChars[0][0]
    }
    if (reverseDigits) result = digitStr + result
    else result += digitStr
    digitChars.shift()
    if (commasMin >= 0 && Math.abs(originalValue) >= commasMin && digitChars.length % commaSpacing == 0 && digitChars.length != 0) {
      if (reverseDigits) result = commaChars[(digitChars.length / commaSpacing - 1) % commaChars.length] + result
      else result += commaChars[(digitChars.length / commaSpacing - 1) % commaChars.length]
    }
  }
  if (showZeroes <= 0 && onlyAllowedCharacters(digits.join(''), ['0'])) digits = []
  if (digits.length > 0) {
    while (digits[digits.length - 1] === 0 && showZeroes < 0) digits.pop()
  }
  if (digits.length > 0) {
    let digitLocation = base
    for (let d = 0; d < specialDigits.length; d++) {
      if (specialDigits[d][0](digitPosition, startDigitPosition - digitPosition, value) && specialDigits[d][1].length > digits[0] + negaDigits) {
        digitLocation = specialDigits[d][1]
        break
      }
    }
    digitChars.push([digitLocation[negaDigits], 1])
    if (startDigitPosition < 0) {
      for (let i = 1; i < -startDigitPosition; i++) {
        digitPosition--
        digitLocation = base
        for (let d = 0; d < specialDigits.length; d++) {
          if (specialDigits[d][0](digitPosition, startDigitPosition - digitPosition, value) && specialDigits[d][1].length > digits[0] + negaDigits) {
            digitLocation = specialDigits[d][1]
            break
          }
        }
        digitChars.push([digitLocation[negaDigits], 1])
      }
    }
    while (digits.length > 0) {
      digitPosition--
      digitLocation = base
      for (let d = 0; d < specialDigits.length; d++) {
        if (specialDigits[d][0](digitPosition, startDigitPosition - digitPosition, value) && specialDigits[d][1].length > digits[0] + negaDigits) {
          digitLocation = specialDigits[d][1]
          break
        }
      }
      digitChars.push([digitLocation[digits[0] + negaDigits], 1])
      digits.shift()
    }
    if (result == '') result = digitChars[0][0]
    digitChars.shift()
    if (reverseDigits) result = decimalChar + result
    else result += decimalChar
    if (concatenation !== null) {
      for (let c = 1; c < digitChars.length; c++) {
        if (digitChars[c][0] == digitChars[c - 1][0]) {
          digitChars[c - 1][1]++
          digitChars.splice(c, 1)
          c--
        }
      }
    }
    while (digitChars.length > 0) {
      let digitStr = digitChars[0][0]
      if (concatenation !== null && digitChars[0][1] > 1) {
        digitStr = ''
        if (concatenation[3] === undefined)
          digitStr = BaseConvert(
            digitChars[0][1],
            base,
            placesAbove1,
            placesBelow1,
            negaDigits,
            commasMin,
            showZeroes,
            reverseDigits,
            commaSpacing,
            commaChars,
            decimalChar,
            negativeChar,
            precision,
            specialDigits,
            concatenation,
          )
        else digitStr = concatenation[3].format(digitChars[0][1])
        digitStr = concatenation[1] + digitStr + concatenation[2]
        if (concatenation[0]) digitStr = digitChars[0][0] + digitStr
        else digitStr += digitChars[0][0]
      }
      if (reverseDigits) result = digitStr + result
      else result += digitStr
      digitChars.shift()
    }
  }
  if (negative) result = negativeChar + result
  return result
}

/**
 * Rounds the given value to the nearest multiple of some number.
 * @param value ( Decimal ) The value to be rounded.
 * @param rounding ( DecimalSource | ((value : Decimal) => Decimal) ) If this parameter is a Decimal, then "value" is rounded to the nearest multiple of "rounding".
 * If this parameter is a Decimal -> Decimal function, then "value" is plugged into that function, and whatever that function returns is used as the "rounding" to round to the nearest multiple of.
 * The rounding is not performed at all if "rounding" is 0.
 */
export function round(value: DecimalSource, rounding: DecimalSource | ((value: Decimal) => Decimal)): Decimal {
  let valueD = toDecimal(value)
  if (typeof rounding != 'function') {
    let funcD = toDecimal(rounding)
    rounding = (value) => funcD
  }
  let roundingVal = rounding(valueD)
  if (roundingVal.eq(0)) return valueD
  else return valueD.div(roundingVal).round().mul(roundingVal)
}

/**
 * Decimal's iteratedexp, except each exponentiation in the iteratedexp, instead of just being base^value, is base^(value/mult), so that taking the logarithm to undo it would require multiplying by the mult after said logarithm.
 */
//If you're wondering why this is a separate function... well, it had a more complex implementation until I realized it could be reduced to its current form.
export function iteratedexpmult(base: DecimalSource, payload: DecimalSource, height: number, mult: DecimalSource): Decimal {
  let [baseD, payloadD, multD] = [base, payload, mult].map(toDecimal)
  return Decimal.iteratedexp(baseD.pow(multD.recip()), height, payloadD, true)
}

function iteratedmultlog(value: DecimalSource, base: DecimalSource, times: number, mult: DecimalSource): Decimal {
  let [valueD, baseD, multD] = [value, base, mult].map(toDecimal)
  return Decimal.iteratedlog(valueD, baseD.pow(multD.recip()), times, true)
}

/**
 * Behaves similarly to DefaultNotation, but supports alternate bases (any whole-number base between 2 and 64, or higher if you provide your own digits) and has more customization.
 * @param base ( number | string[] ! ) This can be either a number or an array of strings. If the base is a number, the default set of digits for that base is used: 0 through 9, then A through Z, then a through z, then + and /. This notation will throw an error if base is a number above 64, as only 64 default digits are chosen. If base is an array of strings, then those strings are taken as the digits of the base (the number of the base is base.length in this case); bases above 64 are allowed if you provide an array with more than 64 strings.
 * @param negaDigits ( number ) How many of the digits are negative? Default is 0, which means the digits are from 0 to (base - 1). For example, if negaDigits is 1, the digits are from -1 to (base - 2). For odd bases, set this to (base - 1)/2 for the "balanced" version of that base. The maximum value of negaDigits is the base itself, and the minimum value is -1 (which results in the bijective version of the base); values outside this range will throw an error. You can't set negaDigits to anything other than 0 or -1 if base is given as a number (rather than an array of strings), since digits for negative numbers are not included in the default set of digits. Note that if negaDigits equals -1 or negaDigits equals the base, the amount of decimal places when calling format must be 0, as bijective bases do not support non-whole numbers.
 * @param placesAbove1 ( number ) For numbers above 1, this is the amount of decimal places shown. If this is negative, then the absolute value of this parameter is the amount of significant figures shown (though place values before the decimal point are never cut off). Default is -4.
 * @param placesBelow1 ( number ) For numbers below 1, this is the amount of decimal places shown. If this is negative, then the absolute value of this parameter is the amount of significant figures shown (though place values before the decimal point are never cut off). Default is -4.
 * @param commasMin ( Decimal ) Only numbers equal to or greater than this value show commas. Default is 0, which means commas are always shown. If this value is negative, commas are never used.
 * @param maxnum ( Decimal ) Numbers greater than or equal to this are converted into scientific notation. Default is base^12.
 * @param minnum ( Decimal ) Numbers less than this are converted into scientific notation. Default is base^-6.
 * @param max_exps_in_a_row ( number ) If the scientific representation would have more "exponential characters" (like the e in usual scientific notation) in the front than this, switches to F notation. Default is 5.
 * @param mantissaPower ( Decimal ) Normally, the mantissa in scientific notation is bounded by 1 and the base, which corresponds to the default mantissaPower of 0. If mantissaPower is 1, the bounds are base and base^2, if mantissaPower is 2 then the bounds are base^2 and base^3, and so on. For example, a number normally represented as "2.357e224" would become "23.57e223" with 1 mantissaPower and "235.7e222" with 2 mantissaPower.
 * @param hypermantissaPower ( Decimal ) Normally, the mantissa in hyperscientific notation is bounded by 1 and the base, which corresponds to the default hypermantissaPower of 0. If hypermantissaPower is 1, the bounds are base and base^^2, if hypermantissaPower is 2 then the bounds are base^^2 and base^^3, and so on. For example, a number normally represented as "2F8" would become "100F7" with 1 hypermantissaPower and "(1e100)F6" with 2 hypermantissaPower.
 * @param showZeroes ( number ) A positive, zero, or negative number; default is -1. If this is positive, all the decimal places up to (places) are shown, even if some of them are zeroes at the end. If this is zero, all the decimal places up to (places) are shown, even if some are zeroes at the end, but only if not all of the decimal places are zero. If this is negative, zeroes at the end of the decimal places are not shown. If this is negative infinity, then trailing zeroes are always removed, even those before the decimal point.
 * @param reverseDigits ( boolean ) If this parameter is true, digits are written right-to-left instead of left-to-right. Default is false.
 * @param commaSpacing ( number ) How many digits are between each comma? Default is 3.
 * @param commaChars ( string[] ) What are the commas? If this array of strings has only one character, that character is used as the comma. If the array has multiple characters, the array is cycled through, so commaChars[0] is used for the first comma (the comma closest to the ones place), commaChars[1] is used for the second comma, and repeat, going back to commaChars[0] after the last entry. Default is [","].
 * @param decimalChar ( string ) The character used as the decimal point. Default is ".".
 * @param expChars ( [[string, string], [string | boolean, string | boolean], [string, string], [string | boolean, string | boolean]] ) An array of four pairs of strings that are used as the between characters for scientific notation. In each pair, the first entry goes before the exponent, the second entry goes after the exponent. expChars[0] takes the place of the e in "1e10", expChars[1] takes the place of the first e in "e1e10", expChars[2] takes the place of the F in "1F10", and expChars[3] takes the place of the F in "F1e10". If expChars[1][0] is a boolean instead of a string: if it's false, then expChars[1][0] is set to be expChars[0][0] with the way this notation formats 1 tacked on the beginning, and if it's true than the 1 is tacked on the end instead. Likewise for expChars[1][1] (expChars[0][1] with a 1 on it), expChars[3][0] (expChars[2][0] with a 1 on it), and expChars[3][1] (expChars[2][1] with a 1 on it). Default is [["$", ""], ["$", ""], ["#", ""], ["#", ""]].
 * @param negExpChars ( null | [[string, string] | boolean, [string, string]] ) This can either be null or a pair of pairs of strings (in which the first pair of strings may be a boolean instead). Ignore this parameter if it's null, which is the default. If it's a pair of pairs of strings, then the first pair is used like expChars[0] but for negative exponents (so if it's ["d", ""], then 2e-4 would be 2d4 instead), and the second pair is used on small numbers whose reciprocals are large enough to need expChars[1], in which case the second pair indicates that a reciprocal has been taken. If negExpChars[0] is a boolean instead, then if it's true the notation goes directly to the reciprocal behavior for all inputs less than 1, while if it's false then single-iteration inputs don't use negExpChars but multi-iteration ones still use reciprocal behavior.
 * @param expBefore ( boolean ) If this parameter is true, the exponent comes before the mantissa instead of after. Default is false.
 * @param hyperexpBefore ( boolean ) If this parameter is true, the hyperexponent comes before the mantissa instead of after. Default is false.
 * @param precision ( number ) How many digits are actually calculated before the remaining ones are just set to 0; this parameter exists so the notation doesn't bother displaying meaningless digits beyond the limit of floating point precision. Default is however many digits (2^53 - 1) has in that base.
 * @param specialDigits ( [(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][] ) An array of pairs where each pair contains a (number, number?, number?) -> boolean function and a string array; this parameter allows different place values to use different digits (though the numeric value of the base remains the same).
 * The function's arguments are the place value of the digit (the ones place is place value 0), the digit's distance from the leftmost digit, and the value being inputted, and the function returns true if this digit is to use that set of special digits instead of the normal ones; the string array is the set of special digits to be used.
 * Earlier entries in specialDigits take priority, reverting back to the digits from base if none of the special digits apply or if the one that does apply doesn't have enough entries to represent that digit.
 * @param concatenation ( null | [boolean, string, string, Notation?] ) If this parameter is not null, then when multiple of the same digit are adjacent, they'll be concatenated into a single digit with a number next to it to indicate the amount of that digit that was concatenated.
 * concatenation[1] and concatenation[2] are placed before and after the concatenation number. If concatenation[3] is undefined, the concatenation number is written in the alternate base itself, otherwise it's written in whatever notation is given. If concatenation[0] is true, then the concatenation number comes after the digit being concatenated, otherwise it comes before.
 * Default is null, i.e. no concatenation occurs.
 *
 * This notation does not have an innerNotation parameter.
 */
export class AlternateBaseNotation extends Notation {
  private _base!: string[]
  public negaDigits = 0
  public placesAbove1 = -4
  public placesBelow1 = -4
  public commasMin: Decimal = Decimal.dZero
  public maxnum: Decimal
  public minnum: Decimal
  public max_exps_in_a_row = 5
  public mantissaPower: Decimal = Decimal.dZero
  public hypermantissaPower: Decimal = Decimal.dZero
  public showZeroes: number = -1
  public reverseDigits: boolean = false
  public commaSpacing = 3
  public commaChars = [',']
  public decimalChar = '.'
  private _expChars: [string, string][] = [
    ['$', ''],
    ['$', ''],
    ['#', ''],
    ['#', ''],
  ]
  public negExpChars: null | [[string, string] | boolean, [string, string]] = null
  public expBefore: boolean = false
  public hyperexpBefore: boolean = false
  public precision: number
  public specialDigits: [(placeValue: number, fromStart?: number, outerValue?: number) => boolean, string[]][] = []
  public concatenation: null | [boolean, string, string, Notation?] = null
  private unconvertedExpChars: [[string, string], [string | boolean, string | boolean], [string, string], [string | boolean, string | boolean]]

  constructor(
    base: number | string[],
    negaDigits: number = 0,
    placesAbove1: number = -4,
    placesBelow1: number = -4,
    commasMin: DecimalSource = 0,
    maxnum: DecimalSource = typeof base == 'number' ? Decimal.pow(base, 12) : Decimal.pow(base.length, 12),
    minnum: DecimalSource = typeof base == 'number' ? Decimal.pow(base, -6) : Decimal.pow(base.length, -6),
    max_exps_in_a_row: number = 5,
    mantissaPower: DecimalSource = 0,
    hypermantissaPower: DecimalSource = 0,
    showZeroes: number = -1,
    reverseDigits: boolean = false,
    commaSpacing: number = 3,
    commaChars: string[] = [','],
    decimalChar: string = '.',
    expChars: [[string, string], [string | boolean, string | boolean], [string, string], [string | boolean, string | boolean]] = [
      ['$', ''],
      ['$', ''],
      ['#', ''],
      ['#', ''],
    ],
    negExpChars: null | [[string, string] | boolean, [string, string]] = null,
    expBefore: boolean = false,
    hyperexpBefore: boolean = false,
    precision: number = typeof base == 'number'
      ? Math.floor(Math.log(Number.MAX_SAFE_INTEGER) / Math.log(base) + 1)
      : Math.floor(Math.log(Number.MAX_SAFE_INTEGER) / Math.log(base.length) + 1),
    specialDigits: [(placeValue: number, fromStart?: number, outerValue?: number) => boolean, string[]][] = [],
    concatenation: null | [boolean, string, string, Notation?] = null,
  ) {
    super()
    this.negaDigits = negaDigits
    this.base = base
    this.placesAbove1 = placesAbove1
    this.placesBelow1 = placesBelow1
    this.commasMin = toDecimal(commasMin)
    this.maxnum = toDecimal(maxnum)
    this.minnum = toDecimal(minnum)
    this.max_exps_in_a_row = max_exps_in_a_row
    this.mantissaPower = toDecimal(mantissaPower)
    this.hypermantissaPower = toDecimal(hypermantissaPower)
    this.showZeroes = showZeroes
    this.reverseDigits = reverseDigits
    this.commaSpacing = commaSpacing
    this.commaChars = commaChars
    this.decimalChar = decimalChar
    this.unconvertedExpChars = expChars
    this.expBefore = expBefore
    this.hyperexpBefore = hyperexpBefore
    this.precision = precision
    this.specialDigits = specialDigits
    this.concatenation = concatenation
    this.expChars = expChars
    this.negExpChars = negExpChars
  }

  public name = 'Alternate Base Notation'

  public format(value: DecimalSource): string {
    let decimal = toDecimal(value)

    if (decimal.isNan()) return this.NaNString

    if (this.isInfinite(decimal)) {
      return decimal.sgn() < 0 ? this.negativeInfinite : this.infinite
    }

    if (decimal.neq(0) && this.isInfinite(decimal.recip())) {
      return this.format(0)
    }

    return this.formatDecimal(decimal)
  }

  public formatDecimal(value: Decimal): string {
    if ((value.abs().gte(this.minnum) && value.abs().lt(this.maxnum)) || value.eq(0))
      return BaseConvert(
        value.toNumber(),
        this._base,
        this.placesAbove1,
        this.placesBelow1,
        this.negaDigits,
        this.commasMin.toNumber(),
        this.showZeroes,
        this.reverseDigits,
        this.commaSpacing,
        this.commaChars,
        this.decimalChar,
        this.negativeString[0],
        this.precision,
        this.specialDigits,
        this.concatenation,
      )
    let result = ''
    let negExp = false
    let baseNum = this._base.length
    let places = value.gte(1) ? this.placesAbove1 : this.placesBelow1
    if (this.negaDigits > baseNum || this.negaDigits < -1 || this.negaDigits % 1 != 0)
      throw new RangeError('negaDigits out of range in Alternate Base Notation')
    if (this.negaDigits > baseNum - 2) {
      let baseCopy = new AlternateBaseNotation(
        this._base,
        baseNum - this.negaDigits - 1,
        this.placesAbove1,
        this.placesBelow1,
        this.commasMin,
        this.maxnum,
        this.minnum,
        this.max_exps_in_a_row,
        this.mantissaPower,
        this.hypermantissaPower,
        this.showZeroes,
        this.reverseDigits,
        this.commaSpacing,
        this.commaChars,
        this.decimalChar,
        this.unconvertedExpChars,
        this.negExpChars,
        this.expBefore,
        this.hyperexpBefore,
        this.precision,
        this.specialDigits,
        this.concatenation,
      )
      return baseCopy.format(value.neg())
    }
    let sigFigPlaces = places
    if (places < 0) sigFigPlaces = -places - 1
    let mantissaLimit = 0
    for (let i = -this.mantissaPower; i <= sigFigPlaces; i++) {
      mantissaLimit += (baseNum - this.negaDigits - 1) / Math.pow(baseNum, i)
    }
    mantissaLimit += 1 / Math.pow(baseNum, sigFigPlaces)
    let hypermantissaLimit: DecimalSource = 0
    for (let i = 0; i <= sigFigPlaces; i++) {
      hypermantissaLimit += (baseNum - this.negaDigits - 1) / Math.pow(baseNum, i)
    }
    hypermantissaLimit += 1 / Math.pow(baseNum, sigFigPlaces)
    hypermantissaLimit = Decimal.iteratedexp(baseNum, this.hypermantissaPower.toNumber(), new Decimal(mantissaLimit), true)
    if (value.abs().lt(1)) {
      if (this.negExpChars != null && (this.negExpChars[0] == true || multabs(value.abs()).gte(Decimal.pow(baseNum, this.maxnum))))
        return this.negExpChars[1][0] + this.format(value.recip()) + this.negExpChars[1][1]
      negExp = true
      let [m, e] = scientifify(value, baseNum, 0, this.mantissaPower)
      value = Decimal.pow(baseNum, e.neg()).mul(m)
    }
    if (value.abs().lt(Decimal.pow(baseNum, this.maxnum))) {
      let [m, e] = scientifify(value, baseNum, 0, this.mantissaPower)
      let mantissa = m.toNumber()
      let exponent = e.toNumber()
      let unroundedmantissa = mantissa
      mantissa = Math.round(unroundedmantissa * Math.pow(baseNum, sigFigPlaces)) / Math.pow(baseNum, sigFigPlaces)
      while (Math.abs(mantissa) >= mantissaLimit) {
        unroundedmantissa /= baseNum
        mantissa = Math.round(unroundedmantissa * Math.pow(baseNum, sigFigPlaces)) / Math.pow(baseNum, sigFigPlaces)
        exponent += 1
      }
      while (Math.abs(mantissa) < mantissaLimit / baseNum) {
        unroundedmantissa *= baseNum
        mantissa = Math.round(unroundedmantissa * Math.pow(baseNum, sigFigPlaces)) / Math.pow(baseNum, sigFigPlaces)
        exponent -= 1
      }
      if (negExp) exponent *= -1
      let beforeChar = this._expChars[0][0]
      let afterChar = this._expChars[0][1]
      if (exponent < 0 && this.negExpChars !== null && this.negExpChars[0] !== false) {
        if (this.negExpChars[0] === true) return this.negExpChars[1][0] + this.format(value.recip()) + this.negExpChars[1][1]
        beforeChar = this.negExpChars[0][0]
        afterChar = this.negExpChars[0][1]
        exponent *= -1
      }
      let baseStr = BaseConvert(
        mantissa,
        this._base,
        this.placesAbove1,
        this.placesBelow1,
        this.negaDigits,
        this.commasMin.toNumber(),
        this.showZeroes,
        this.reverseDigits,
        this.commaSpacing,
        this.commaChars,
        this.decimalChar,
        this.negativeString[0],
        this.precision,
        this.specialDigits,
        this.concatenation,
      )
      let exponentStr = BaseConvert(
        exponent,
        this._base,
        this.placesAbove1,
        this.placesBelow1,
        this.negaDigits,
        this.commasMin.toNumber(),
        this.showZeroes,
        this.reverseDigits,
        this.commaSpacing,
        this.commaChars,
        this.decimalChar,
        this.negativeString[0],
        this.precision,
        this.specialDigits,
        this.concatenation,
      )
      if (this.expBefore) result = beforeChar + exponentStr + afterChar + baseStr
      else result = baseStr + beforeChar + exponentStr + afterChar
    } else {
      let negative = false
      if (value.lt(0)) {
        negative = true
        value = value.neg()
      }
      if (value.lt(Decimal.iteratedexp(baseNum, this.max_exps_in_a_row + 1, this.maxnum, true))) {
        let added_es = 0
        while (value.gte(Decimal.pow(baseNum, this.maxnum))) {
          added_es++
          value = value.log(baseNum).mul(value.sign)
        }
        if (negExp) value = value.neg()
        result = this.format(value)
        for (let e = 0; e < added_es; e++) result = this._expChars[1][0] + result + this._expChars[1][1]
      } else if (value.lt(Decimal.tetrate(baseNum, this.maxnum.toNumber(), 1, true))) {
        let [mantissa, exponent] = hyperscientifify(value, baseNum, 0, this.hypermantissaPower)
        let unroundedmantissa = mantissa
        mantissa = unroundedmantissa.mul(Math.pow(baseNum, sigFigPlaces)).round().div(Math.pow(baseNum, sigFigPlaces))
        while (mantissa.gt(hypermantissaLimit)) {
          unroundedmantissa = unroundedmantissa.log(baseNum)
          mantissa = unroundedmantissa.mul(Math.pow(baseNum, sigFigPlaces)).round().div(Math.pow(baseNum, sigFigPlaces))
          exponent = exponent.plus(1)
        }
        while (mantissa.lte(hypermantissaLimit.log(baseNum))) {
          unroundedmantissa = Decimal.pow(baseNum, unroundedmantissa)
          mantissa = unroundedmantissa.mul(Math.pow(baseNum, sigFigPlaces)).round().div(Math.pow(baseNum, sigFigPlaces))
          exponent = exponent.sub(1)
        }
        if (negExp) exponent = exponent.neg()
        let baseStr = this.format(mantissa)
        let exponentStr = this.format(exponent)
        if (this.hyperexpBefore) result = this._expChars[2][0] + exponentStr + this._expChars[2][1] + baseStr
        else result = baseStr + this._expChars[2][0] + exponentStr + this._expChars[2][1]
      } else {
        let exponent = value.slog(baseNum, 100, true)
        if (negExp) exponent = exponent.neg()
        result = this._expChars[3][0] + this.format(exponent) + this._expChars[3][1]
      }
      if (negative) result = this.negativeString[0] + result + this.negativeString[1]
    }
    return result
  }

  /**
   * Returns an array containing the digits of the base.
   */
  public get base() {
    return this._base
  }

  public set base(base: number | string[]) {
    if (typeof base == 'number') {
      if (base < 0) throw new RangeError('Negative bases are not implemented')
      if (base == 0) throw new RangeError('There is no such thing as base 0')
      if (base == 1) throw new RangeError('Tally marks are not an abbreviation')
      if (base % 1 != 0) throw new RangeError('Fractional bases are not supported')
      if (base > 64 || (base == 64 && this.negaDigits == -1))
        throw new RangeError('There are only 64 default base digits; if you want to use a base above 64, provide your own character array.')
      if (this.negaDigits == -1) base = defaultBaseChars.slice(1, base + 1)
      else if (this.negaDigits == 0) base = defaultBaseChars.slice(0, base)
      else throw new RangeError('You have to specify your own characters for bases with negative digits.')
    }
    this._base = base
  }

  public get expChars() {
    return this.unconvertedExpChars
  }

  public set expChars(input: [[string, string], [string | boolean, string | boolean], [string, string], [string | boolean, string | boolean]]) {
    let one = this.format(1)
    let expChars: [string, string][] = []
    expChars.push(input[0])
    expChars.push(['', ''])
    if (typeof input[1][0] == 'string') expChars[1][0] = input[1][0]
    else if (input[1][0] === false) expChars[1][0] = one + input[0][0]
    else if (input[1][0] === true) expChars[1][0] = input[0][0] + one
    if (typeof input[1][1] == 'string') expChars[1][1] = input[1][1]
    else if (input[1][1] === false) expChars[1][1] = one + input[0][1]
    else if (input[1][1] === true) expChars[1][1] = input[0][1] + one
    expChars.push(input[2])
    expChars.push(['', ''])
    if (typeof input[3][0] == 'string') expChars[3][0] = input[3][0]
    else if (input[3][0] === false) expChars[3][0] = one + input[2][0]
    else if (input[3][0] === true) expChars[3][0] = input[2][0] + one
    if (typeof input[3][1] == 'string') expChars[3][1] = input[3][1]
    else if (input[3][1] === false) expChars[3][1] = one + input[2][1]
    else if (input[3][1] === true) expChars[3][1] = input[2][1] + one
    this._expChars = expChars
  }
}

const BinaryFormat = new AlternateBaseNotation(2, 0, -8, -8, 0, 4096, 1 / 256, ...[, , , , ,], 3, ...[, ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const BinaryWhole = new AlternateBaseNotation(2, 0, -8, 0, 0, 4096, 1 / 256, ...[, , , , ,], 3, ...[, ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const TernaryFormat = new AlternateBaseNotation(3, 0, -7, -7, ...[, , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const TernaryWhole = new AlternateBaseNotation(3, 0, -7, 0, ...[, , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const QuaternaryFormat = new AlternateBaseNotation(4, 0, -6, -6, ...[, , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const QuaternaryWhole = new AlternateBaseNotation(4, 0, -6, 0, ...[, , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const SeximalFormat = new AlternateBaseNotation(6, 0, -5, -5, ...[, , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const SeximalWhole = new AlternateBaseNotation(6, 0, -5, 0, ...[, , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const OctalFormat = new AlternateBaseNotation(8, 0, -4, -4, ...[, , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const OctalWhole = new AlternateBaseNotation(8, 0, -4, 0, ...[, , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const DuodecimalFormat = new AlternateBaseNotation(12, ...[, , , , , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['#', ''],
  ['#', ''],
])
const DuodecimalWhole = new AlternateBaseNotation(12, ...[, , 0, , , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['#', ''],
  ['#', ''],
])
const HexadecimalFormat = new AlternateBaseNotation(16, ...[, , , , , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['#', ''],
  ['#', ''],
])
const HexadecimalWhole = new AlternateBaseNotation(16, ...[, , 0, , , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['#', ''],
  ['#', ''],
])
const Base36Format = new AlternateBaseNotation(36, ...[, , , , , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['#', ''],
  ['#', ''],
])
const Base36Whole = new AlternateBaseNotation(36, ...[, , 0, , , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['#', ''],
  ['#', ''],
])
const Base62Format = new AlternateBaseNotation(62, ...[, , , , , , , , , , , , , ,], [
  ['@', ''],
  ['@', ''],
  ['#', ''],
  ['#', ''],
])
const Base62Whole = new AlternateBaseNotation(62, ...[, , 0, , , , , , , , , , , ,], [
  ['@', ''],
  ['@', ''],
  ['#', ''],
  ['#', ''],
])
const BalancedTernary = new AlternateBaseNotation(['-', '0', '+'], 1, -7, -7, ...[, , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])
const BalancedTernaryWhole = new AlternateBaseNotation(['-', '0', '+'], 1, -7, 0, ...[, , , , , , , , , , ,], [
  ['e', ''],
  ['e', ''],
  ['F', ''],
  ['F', ''],
])

class ConditionalNotation extends Notation {
  public specialIncluded: boolean
  public options: [Notation, (value: Decimal) => boolean][]

  constructor(specialIncluded: boolean, ...options: [Notation, (value: Decimal) => boolean][]) {
    super()
    this.specialIncluded = specialIncluded
    this.options = options
  }
  public name = 'Conditional Notation'

  public format(value: DecimalSource): string {
    let decimal = toDecimal(value)

    if (this.specialIncluded) {
      for (let n = 0; n < this.options.length; n++) {
        if (this.options[n][1](decimal)) return this.options[n][0].format(decimal)
      }
      throw new Error('No notation was chosen.')
    } else {
      if (decimal.isNan()) return this.NaNString

      if (this.isInfinite(decimal)) {
        return decimal.sgn() < 0 ? this.negativeInfinite : this.infinite
      }

      if (decimal.neq(0) && this.isInfinite(decimal.recip())) {
        return this.format(0)
      }

      return decimal.sgn() < 0 && !this.specialIncluded ? this.formatNegativeDecimal(decimal.abs()) : this.formatDecimal(decimal)
    }
  }

  public formatNegativeDecimal(value: Decimal): string {
    return this.negativeString[0] + this.formatDecimal(value) + this.negativeString[1]
  }

  public formatDecimal(value: Decimal): string {
    for (let n = 0; n < this.options.length; n++) {
      if (this.options[n][1](value)) return this.options[n][0].format(value)
    }
    throw new Error('No notation was chosen.')
  }
}

class AppliedFunctionNotation extends Notation {
  public DecimalFunc: (value: Decimal) => Decimal
  public innerNotation: Notation
  public StringFunc: (value: string) => string
  public nonFiniteApplied: boolean = false

  constructor(
    DecimalFunc: (value: Decimal) => Decimal = (value) => value,
    innerNotation: Notation,
    StringFunc: (value: string) => string = (str) => str,
    nonFiniteApplied: boolean = false,
  ) {
    super()
    this.DecimalFunc = DecimalFunc
    this.innerNotation = innerNotation
    this.StringFunc = StringFunc
    this.nonFiniteApplied = nonFiniteApplied
  }

  public name = 'Applied Function Notation'

  public format(value: DecimalSource): string {
    value = toDecimal(value)
    if (!value.isFinite() && !this.nonFiniteApplied) return this.innerNotation.format(value)
    return this.StringFunc(this.innerNotation.format(this.DecimalFunc(value)))
  }

  public formatNegativeDecimal(value: Decimal): string {
    return this.StringFunc(this.innerNotation.formatNegativeDecimal(this.DecimalFunc(value)))
  }

  public formatDecimal(value: Decimal): string {
    return this.StringFunc(this.innerNotation.formatDecimal(this.DecimalFunc(value)))
  }
}

class PredeterminedNotation extends Notation {
  public str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  public format(value: DecimalSource): string {
    return this.str
  }

  public name = 'Predetermined Notation'

  public formatNegativeDecimal(value: Decimal): string {
    return this.str
  }

  public formatDecimal(value: Decimal): string {
    return this.str
  }
}

function recipBelow(notation: Notation, minnum: DecimalSource, recipStr: [string, string] = ['1 / ', ''], zeroStr: string | null = null): Notation {
  return new ConditionalNotation(
    false,
    [new PredeterminedNotation(zeroStr ? zeroStr : '0'), (value) => value.eq(0) && zeroStr !== null], // That ternary operator isn't actually needed here, but TypeScript demands it because it doesn't know there's a check to eliminate the null case
    [
      new AppliedFunctionNotation(
        (value) => value.recip(),
        notation,
        (str) => recipStr[0] + str + recipStr[1],
      ),
      (value) => value.lt(minnum) && value.neq(0),
    ],
    [notation, (value) => true],
  )
}

const BijectiveDecimal = recipBelow(
  new AlternateBaseNotation(['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A'], -1, 0, 0, ...[, , , ,], 3, 1, ...[, , , , ,], [
    ['e', ''],
    ['e', ''],
    ['#', ''],
    ['#', ''],
  ]),
  1,
)

/**
 * Adds commas to a string by inserting a comma between every few characters of the string, starting at the end.
 * @param str ( string ! ) The string to be formatted.
 * @param commaChar ( string[] ) The character to be inserted as a comma. Default is ",".
 * @param spacing ( number ) The amount of characters between each commas. Default is 3.
 */
export function addCommas(str: string, commaChars: string[] = [","], spacing: number = 3): string {
    let result = "";
    let commasSoFar = 0;
    while (str.length > spacing) {
        let substr = str.substring(str.length - spacing, str.length);
        str = str.substring(0, str.length - spacing);
        result = commaChars[commasSoFar % commaChars.length] + substr + result;
        commasSoFar++;
    }
    return (str + result);
}

/**
 * Takes a number and formats it with commas and decimals.
 * @param value ( number ! ) The number to be formatted.
 * @param placesAbove1 ( number ) For numbers 1 or greater, this is the amount of decimal places shown. If this is negative, then the absolute value of this parameter is the amount of significant figures shown (though place values before the decimal point are never cut off). Default is -4.
 * @param placesBelow1 ( number ) For numbers less than 1, this is the amount of decimal places shown. If this is negative, then the absolute value of this parameter is the amount of significant figures shown (though place values before the decimal point are never cut off). Default is -4.
 * @param commas ( number ) The smallest value where commas are included. If this is negative, then commas are never included. Default is 0, which means commas are always included.
 * @param decimalChar ( string ) The string used as the decimal point. Default is ".".
 * @param commaChar ( string ) The string used as the comma. Default is ",".
 */
export function commasAndDecimals(
  value: number,
  placesAbove1: number = -4,
  placesBelow1: number = -4,
  commas: number = 0,
  decimalChar = '.',
  commaChar = ',',
): string {
  if (value == 0) return '0'
  if (!isFinite(value)) return String(value)
  let places = Math.abs(value) < 1 ? placesBelow1 : placesAbove1
  if (places > 16) places = 16
  let negative = value < 0
  value = Math.abs(value)
  let [b, e] = scientifify(Decimal.fromNumber(value), Decimal.dTen)
  let base = b.toNumber()
  let exponent = e.toNumber()
  let sigFigs = false
  if (places < 0) {
    sigFigs = true
    places = Math.max(-places - exponent - 1, 0)
  }
  let result = ''
  if (value >= 1e21) {
    base = Math.round(base * Math.pow(10, places)) / Math.pow(10, places)
    if (base >= 10) {
      base /= 10
      exponent += 1
      if (sigFigs && places > 0) {
        places--
        base = Math.round(base * Math.pow(10, places)) / Math.pow(10, places)
      }
    }
    result = commasAndDecimals(base, placesAbove1, placesBelow1, commas)
    result += 'e'
    if (exponent >= 0) result += '+'
    result += String(exponent)
  } else if (value < 1) {
    let ending = Math.round(value * Math.pow(10, places))
    if (ending >= Math.pow(10, places + exponent + 1)) {
      base /= 10
      exponent += 1
      ending = Math.round(value * Math.pow(10, places))
    }
    if (ending == 0) return '0'
    let decimalString = String(ending)
    if (exponent >= 0) result = commasAndDecimals(ending / Math.pow(10, places), placesAbove1, placesBelow1, commas)
    else {
      result = '0' + decimalChar
      for (let i = 1; i < Math.abs(exponent); i++) result += '0'
      while (decimalString.length < places + exponent + 1) decimalString = '0' + decimalString
      while (decimalString[decimalString.length - 1] == '0') decimalString = decimalString.substring(0, decimalString.length - 1)
      if (decimalString !== '.') result += decimalString
    }
  } else {
    let whole = Math.trunc(value)
    let leftover = value - whole
    leftover *= Math.pow(10, places)
    leftover = Math.round(leftover)
    if (leftover >= Math.pow(10, places)) {
      leftover -= Math.pow(10, places)
      whole += 1
    }
    result = String(whole)
    if (value >= commas && commas >= 0) result = addCommas(result, [commaChar])
    let decimalString = String(leftover)
    if (leftover == 0) decimalString = ''
    else {
      while (decimalString.length < places) decimalString = '0' + decimalString
      decimalString = decimalChar + decimalString
      while (decimalString[decimalString.length - 1] == '0') decimalString = decimalString.substring(0, decimalString.length - 1)
    }
    if (decimalString !== decimalChar) result += decimalString
  }
  if (negative) result = '-' + result
  return result
}

/**
 * The default way to abbreviate numbers - any leftover numbers in other notations are typically put through this to add commas and decimal places.
 * Starts with unabbreviated numbers, then scientific notation, then scientific notation with multiple e's, and finally F notation.
 * @param placesAbove1 ( number ) For numbers above 1, this is the amount of decimal places shown. If this is negative, then the absolute value of this parameter is the amount of significant figures shown (though place values before the decimal point are never cut off). Default is -4.
 * @param placesBelow1 ( number ) For numbers below 1, this is the amount of decimal places shown. If this is negative, then the absolute value of this parameter is the amount of significant figures shown (though place values before the decimal point are never cut off). Default is -4.
 * @param commasMin ( Decimal ) Only numbers equal to or greater than this value show commas. Default is 0, which means commas are always shown. If this value is negative, commas are never used.
 * @param maxnum ( Decimal ) The point at which the notation switches to scientific. Default is 1e12.
 * @param minnum ( Decimal ) The point below 1 at which the notation switches to scientific with a negative exponent. Default is 1e-6.
 * @param max_es_in_a_row ( number ) If the scientific representation would have more e's in the front than this, switches to F notation. Default is 5.
 * @param decimalChar ( string ) The string used as the decimal point. Default is ".".
 * @param commaChar ( string ) The string used as the comma. Default is ",".
 *
 * This notation does not have an innerNotation parameter.
 */
export class DefaultNotation extends Notation {
  public placesAbove1 = -4
  public placesBelow1 = -4
  public commasMin = Decimal.dZero
  public maxnum = new Decimal(1e12)
  public minnum = new Decimal(1e-6)
  public max_es_in_a_row = 5
  public decimalChar = '.'
  public commaChar = ','

  constructor(
    placesAbove1 = -4,
    placesBelow1 = -4,
    commasMin: DecimalSource = 0,
    maxnum: DecimalSource = 1e12,
    minnum: DecimalSource = 1e-6,
    max_es_in_a_row: number = 5,
    decimalChar = '.',
    commaChar = ',',
  ) {
    super()
    this.placesAbove1 = placesAbove1
    this.placesBelow1 = placesBelow1
    this.commasMin = toDecimal(commasMin)
    this.maxnum = toDecimal(maxnum)
    this.minnum = toDecimal(minnum)
    this.max_es_in_a_row = max_es_in_a_row
    this.decimalChar = decimalChar
    this.commaChar = commaChar
  }

  public name = 'Default Notation'

  public formatDecimal(value: Decimal): string {
    if (value.eq(0)) return '0'
    if (value.gte(this.minnum) && value.lt(this.maxnum))
      return commasAndDecimals(value.toNumber(), this.placesAbove1, this.placesBelow1, this.commasMin.toNumber(), this.decimalChar, this.commaChar)
    let result = ''
    let negExp = false
    let places = value.gte(1) ? this.placesAbove1 : this.placesBelow1
    let sigFigs = false
    if (places < 0) {
      sigFigs = true
      places = -places - 1 //mantissa is always between 1 and 10 and exponent is always whole, so the significant figures calculation is simplified
    }
    if (value.lt(1)) {
      negExp = true
      let [m, e] = scientifify(value, 10, Math.pow(10, -places))
      value = e.neg().pow10().mul(m)
    }
    if (value.lt(Decimal.pow10(this.maxnum))) {
      let [m, e] = scientifify(value, 10, Math.pow(10, -places))
      let mantissa = m.toNumber()
      let exponent = e.toNumber()
      if (negExp) exponent *= -1
      result =
        commasAndDecimals(mantissa, this.placesAbove1, this.placesBelow1, this.commasMin.toNumber(), this.decimalChar, this.commaChar) +
        'e' +
        commasAndDecimals(exponent, this.placesAbove1, this.placesBelow1, this.commasMin.toNumber(), this.decimalChar, this.commaChar)
    } else if (value.lt(Decimal.iteratedexp(10, this.max_es_in_a_row + 1, this.maxnum, true))) {
      while (value.gte(Decimal.pow10(this.maxnum))) {
        result += 'e'
        value = value.log10()
      }
      if (negExp) value = value.neg()
      result += this.format(value)
    } else if (value.lt(Decimal.tetrate(10, this.maxnum.toNumber(), 1, true))) {
      let [m, e] = hyperscientifify(value, 10, Math.pow(10, -places))
      let mantissa = m.toNumber()
      let exponent = e.toNumber()
      if (negExp) exponent *= -1
      result =
        commasAndDecimals(mantissa, this.placesAbove1, this.placesBelow1, this.commasMin.toNumber(), this.decimalChar, this.commaChar) +
        'F' +
        commasAndDecimals(exponent, this.placesAbove1, this.placesBelow1, this.commasMin.toNumber(), this.decimalChar, this.commaChar)
    } else {
      let exponent = value.slog(10, 100, true)
      if (negExp) exponent = exponent.neg()
      result = 'F' + this.format(exponent)
    }
    return result
  }
}

/**
 * Writes numbers as the layers seen in VeproGames's "Omega Meta Zero". Sort of like a mixed radix base, but with Greek letters, alchemical planet symbols, exponent-styled towers of symbols, and more instead of digits and exponents.
 * This notation would be too complicated to explain all at once, so see the info on the parameters to understand each step of the process.
 * (Unless otherwise stated, whenever a parameter that's an array where each entry corresponds to a set of symbols is given less entries than the amount of sets of symbols, the unfilled entries are set to be the same as the last entry that was provided.)
 * @param symbols ( string[][] ) These are the digits of the mixed-radix base. Each entry of symbols is an array of strings used for one position in the base.
 * symbols[n][0] is the digit for 0 in that position, symbols[n][1] is the digit for 1, and so on. Default is
 * [["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω",
 * "Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι", "Κ", "Λ", "Μ", "Ν", "Ξ", "Ο", "Π", "Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω"
 * ], ["ϝ", "ϛ", "ͱ", "ϻ", "ϙ", "ͳ", "ϸ"], ["☿", "♀", "♁", "♂", "♃", "♄", "♅", "♆", "♇"]].
 * @param towerHeight ( Decimal | Decimal[] ) Rather than immediately incrementing the next set of symbols after reaching the last symbol of a set, this notation repeats that set of symbols but as an "exponent" on top of the last symbol in its set.
 * This continues until that tower reaches a certain height, and only afterwards does that set of symbols reset and the next set increment. This parameter controls that maximum tower height. If this parameter is a single Decimal,
 * every symbol set has the same maximum height. If it's an array of Decimals, towerHeight[n] is the tower height limit for symbols[n]. Default is 5.
 * @param towerChars ( ([string, string] | boolean )[] ) This parameter controls the characters used to indicate the aforementioned towers. If towerChars[n] is a pair of strings, then for each tower level, towerChars[n][0] goes before the symbol from symbols[n], towerChars[n][1] goes afterwards.
 * If towerChars[n] is a boolean, then a default pair of strings is used: ["s^", ""] for false, ["s<sup>", "</sup>"] for true, where that "s" is replaced with whatever the last symbol of symbols[n] is. Default is false for all entries.
 * @param visibleTowerMax ( number | number[] ) If a tower is taller than this, the tower's entries are concatenated into a "tower iteration" expression. Like with towerHeight, a single number applies to all symbol sets,
 * while an array of numbers has each number correspond to one symbol set. Default is 5.
 * @param toweriterationChars ( [string, string, boolean, Notation][] ) When a tower is tall enough to be concatenated, the entry of this array corresponding to that symbol set is used to express the amount of tower iterations.
 * towerIterationChars[n][0] goes before the amount of iterations, towerIterationChars[n][1] goes after the amount of iterations, towerIterationChars[n][2] is whether the iterations expression goes before or after the symbol atop the tower (before if false, after if true), and towerIterationChars[n][3] is the Notation that the amount of iterations is written in.
 * Default is [["((Ω^)^", ")", false, new DefaultNotation()], ["((ϸ^)^", ")", false, new DefaultNotation()], ["((♇^)^", ")", false, new DefaultNotation()]], though since visibleTowerMax isn't less than towerHeight by default, this parameter doesn't come into play unless one of those parameters is changed from its default.
 * @param symbolAfter ( boolean | boolean[] ) If symbolAfter[n] is true, then the symbol from the next symbol set will go after the current expression instead of before. If a single boolean is provided, all entries are set to that boolean. Default is false.
 * @param parentheses ( [string, string, string, string, string, string][] ) When the nth symbol set is added to the resulting string, parentheses[n][0] goes around the entire expression thus far and parentheses[n][1] goes after, before the new symbol is added.
 * parentheses[n][2] and [n][3] go before and after the new symbol, and parentheses[n][4] and [n][5] go before and after the entire expression after the new symbol is added.
 * The default has ["", "", "", "", "", ""] for parentheses[0] and ["(", ")", "", "", "", ""] for the rest of the entries.
 * @param symbolShown ( ((value : Decimal, index : number, symbolValues : Decimal[], digitIndex : number, decimalPlaceAmount : number, digitValues : Decimal[]) => boolean) | ((value : Decimal, index : number, symbolValues : Decimal[], digitIndex : number, decimalPlaceAmount : number, digitValues : Decimal[]) => boolean)[] )
 * The symbol of the nth symbol set is only shown in the resulting expression if calling symbolShown[n] on the value that symbol represents would return true.
 * If only a single function is provided, all entries are set to that function. The default has (value => true) for symbolShown[0] and (value => value.gt(0)) for the rest of the entries,
 * i.e. the greek letters are always visible but the higher two sets only show up if they're nonzero.
 * Like Array.map(), you can include extra arguments in the function: args[1] will be the symbol set's index (so the first symbol set will have index 0, the second symbol set has index 1, etc.), arg[2] is the entire array of symbol values for that digit,
 * arg[3] is the index of the digit this symbol set is part of (the ones place is index 0, the next larger digit is index 1, etc. If there are decimal places, they have negative index), arg[4] is the amount of decimal digits, and arg[5] is the entire array of digit values.
 * @param brackets ( [string, string, string, string, string, string][] ) After the last symbol set, this notation starts using multiple "digits", where a single "digit" consists of a run of symbols from each set.
 * The entries in brackets are placed around each digit (via the same rules as the entries of parentheses) in a cycle: brackets[0] is used for the last digit, brackets[1] for the second-to-last, brackets[2] for the third-to-last, and so on, looping back to brackets[0] after the last entry.
 * Default is [["", "", "[", "]", "", ""]].
 * @param firstBrackets ( [string, string, string, string, string, string][] ) If this array has any entries, the first few digits use those entries instead of the entries in brackets.
 * Default is [["", "", "", "", "", ""]], i.e. the first digit doesn't have the [] around it but the rest do.
 * @param lastBrackets ( [string, string, string, string, string, string][] ) If this array has any entries, the last few digits use those entries instead of the entries in brackets.
 * Default is [], i.e. there's no special treatment for the last digits.
 * @param reverseDigits ( boolean ) Normally, the largest digit is on the left and the smallest digit is on the right, like in a normal number base.
 * If this parameter is true, the order of the digits is reversed. Default is false.
 * @param maxVisibleDigits ( number ) The maximum amount of digits before the notation switches to scientific form (in which the amount of unshown digits is written as an exponent like in scientific notation). Default is 3.
 * @param expChars ( [string, string, string, string, string, string] ) The characters placed around the exponent in scientific form (using the same rules as parentheses and brackets). Default is ["", "", "{", "}", "", ""].
 * @param expAfter ( boolean ) If this parameter is true, the exponent is written after the digits instead of before. Default is false.
 * @param maxVisibleDigitsInExp ( number ) The amount of digits shown once the expression is in scientific form. Default is 2.
 * @param exponentOffset ( boolean ) If this parameter is false, the exponent is the amount of unwritten digits. If this parameter is true, the exponent is increased to one less than the amount of total digits, as if there was a decimal point after the first digit. Default is true.
 * @param bracketsInExp ( [string, string, string, string, string, string][] ) Same as brackets, but this parameter is used instead once the expression is in scientific form. Is the same as brackets by default.
 * @param firstBracketsInExp ( [string, string, string, string, string, string][] ) Same as firstBrackets, but this parameter is used instead once the expression is in scientific form. Is the same as firstBrackets by default.
 * @param lastBracketsInExp ( [string, string, string, string, string, string][] ) Same as lastBrackets, but this parameter is used instead once the expression is in scientific form. Is the same as lastBrackets by default.
 * @param expInnerNotation ( Notation | null ) If this parameter is null, the exponent is written in this Omega Meta Zero notation itself. If this parameter is a notation, the exponent is written in that notation. Default is null.
 * @param uncertainChar ( string ) If the exponent is so large that the digits cease to be relevant, this string is placed where the digits would be. Default is "◯".
 * @param uncertainThreshold ( Decimal ) If the exponent is equal to or greater than this value, uncertainChar is written instead of the digits. Default is 636152238258658, which matches with the point where the original Omega Meta Zero starts using ◯.
 * @param maxVisibleLayers ( number ) The maximum amount of layers of nested exponents before the notation starts writing the amount of additional layers separately (note that this is a little different from the original Omega Meta Zero, which switches to base-10 hyperscientific at this point). Default is 4.
 * @param layerChars ( [string, string, string, string, string, string] ) The characters placed around the amount of extra exponent layers (using the same rules as expChars). Default is ["", "", "◖", "◗", "", ""].
 * @param layerAfter ( boolean ) If this parameter is true, the amount of layers is written after the rest of the expression instead of before. Default is false.
 * @param maxVisibleLayersPost ( number ) The amount of nested exponent layers shown after the amount of extra layers starts being written separately. Default is 1.
 * @param layerOffset ( boolean ) If this parameter is false, the layer number is the amount of unwritten layers. If this parameter is true, the layer number is increased to one less than the amount of total layers. Default is false.
 * @param layerInnerNotation ( Notation | null ) If this parameter is null, the layer number is written in this Omega Meta Zero notation itself. If this parameter is a notation, the layer number is written in that notation. Default is null.
 * @param layerUncertainChar ( string ) If the layer is so large that the exponent and digits cease to be relevant, this string is placed where the exponent and digits would be. Is the same as uncertainChar by default.
 * @param layerUncertainThreshold ( Decimal ) If the layer amount is equal to or greater than this value, layerUncertainChair is written instead of the exponent and digits. Default is 9e15.
 * @param decimalPlaces ( number ) The amount of digits shown after the ones digit. Default is 0.
 * @param decimalPoint ( [string, string] ) Once all the sub-ones digits are written but before the whole digits are written, decimalPoint[0] goes before the expression, decimalPoint[1] goes after. Default is [";", ""].
 * @param decimalBrackets ( [string, string, string, string, string, string][] ) Same as brackets, but used for sub-ones digits instead. Default is [["", "", "[", "]", "", ""]].
 * @param showDecimalZeroes ( number ) If this number is negative, trailing zero sub-ones digits are not shown. If this number is zero, trailing zero sub-ones digits are only shown if at least one sub-ones digit is nonzero. If this number is positive, training zero sub-ones digits are shown. Default is 1.
 * @param negExpThreshold ( number ) If the amount of leading zero sub-one digits would be at least this, the number is written in scientific form (with a negative exponent) instead. Default is 1.
 * @param negExpChars ( null | [string, string, string, string, string, string] ) If this parameter is not null, then when the exponent is negative, negExpChars is used instead of expChars (and the exponent is written as its absolute value). Default is null.
 * @param negExpAfter ( boolean ) If negExpChars is used instead of expChars, negExpAfter is used instead of expAfter. Default is false.
 * @param recipThreshold ( number ) Numbers too small to write as themselves are written in terms of their reciprocals.
 * If recipThreshold is 0, anything below 1 is written in terms of its reciprocal. If recipThreshold is 1, then numbers that would be written in negative-exponent scientific are written in terms of their reciprocal.
 * If recipThreshold is 2, then the threshold for writing in terms of its reciprocal is the negative exponent point where the digits switch to using undefinedChar, or the point where a second exponent layer shows up, whichever is less small.
 * If recipThreshold is 3, the threshold is the second exponent layer. Any other recipThreshold value acts as 0. Default is 2.
 * @param recipString ( [string, string] ) When a number is written in terms of its reciprocal, recipString[0] goes before it, recipString[1] goes after. Default is ["/", ""].
 */
export class OmegaMetaZeroNotation extends Notation {
  private _symbols: string[][] = [
    [
      'α',
      'β',
      'γ',
      'δ',
      'ε',
      'ζ',
      'η',
      'θ',
      'ι',
      'κ',
      'λ',
      'μ',
      'ν',
      'ξ',
      'ο',
      'π',
      'ρ',
      'σ',
      'τ',
      'υ',
      'φ',
      'χ',
      'ψ',
      'ω',
      'Α',
      'Β',
      'Γ',
      'Δ',
      'Ε',
      'Ζ',
      'Η',
      'Θ',
      'Ι',
      'Κ',
      'Λ',
      'Μ',
      'Ν',
      'Ξ',
      'Ο',
      'Π',
      'Ρ',
      'Σ',
      'Τ',
      'Υ',
      'Φ',
      'Χ',
      'Ψ',
      'Ω',
    ],
    ['ϝ', 'ϛ', 'ͱ', 'ϻ', 'ϙ', 'ͳ', 'ϸ'],
    ['☿', '♀', '♁', '♂', '♃', '♄', '♅', '♆', '♇'],
  ]
  private _towerHeight: Decimal[] = [new Decimal(5), new Decimal(5), new Decimal(5)]
  private _towerChars: [string, string][] = []
  private _visibleTowerMax: number[] = [5, 5, 5]
  private _toweriterationChars: [string, string, boolean, Notation][] = []
  private _symbolAfter: boolean[] = [false, false, false]
  private _parentheses: [string, string, string, string, string, string][] = [
    ['', '', '', '', '', ''],
    ['(', ')', '', '', '', ''],
    ['(', ')', '', '', '', ''],
  ]
  private _symbolShown: ((
    value: Decimal,
    index: number,
    symbolValues: Decimal[],
    digitIndex: number,
    decimalPlaceAmount: number,
    digitValues: Decimal[],
  ) => boolean)[] = [(value) => true, (value) => value.gt(0), (value) => value.gt(0)]
  private _brackets: [string, string, string, string, string, string][] = [['', '', '[', ']', '', '']]
  public firstBrackets: [string, string, string, string, string, string][] = [['', '', '', '', '', '']]
  public lastBrackets: [string, string, string, string, string, string][] = []
  public reverseDigits: boolean = false
  private _maxVisibleDigits: number = 3
  public expChars: [string, string, string, string, string, string] = ['', '', '{', '}', '', '']
  public expAfter: boolean = false
  private _maxVisibleDigitsInExp: number = 2
  public exponentOffset: boolean = true
  private _bracketsInExp: [string, string, string, string, string, string][] = this._brackets
  public firstBracketsInExp: [string, string, string, string, string, string][] = this.firstBrackets
  public lastBracketsInExp: [string, string, string, string, string, string][] = this.lastBrackets
  public expInnerNotation: Notation | null = null
  public uncertainChar: string = '◯'
  public uncertainThreshold: Decimal = new Decimal(636152238258658)
  private _maxVisibleLayers: number = 4
  public layerChars: [string, string, string, string, string, string] = ['', '', '◖', '◗', '', '']
  public layerAfter: boolean = false
  private _maxVisibleLayersPost: number = 1
  public layerOffset: boolean = false
  public layerInnerNotation: Notation | null = null
  public layerUncertainChar: string = this.uncertainChar
  public layerUncertainThreshold: Decimal = new Decimal(9e15)
  private _decimalPlaces: number = 0
  public decimalPoint: [string, string] = [';', '']
  private _decimalBrackets: [string, string, string, string, string, string][] = [['', '', '[', ']', '', '']]
  public showDecimalZeroes: number = 1
  private _negExpThreshold: number = 1
  public negExpChars: null | [string, string, string, string, string, string] = null
  public negExpAfter: boolean = false
  public recipThreshold: number = 0
  public recipString: [string, string] = ['/', '']

  constructor(
    symbols: string[][] = [
      [
        'α',
        'β',
        'γ',
        'δ',
        'ε',
        'ζ',
        'η',
        'θ',
        'ι',
        'κ',
        'λ',
        'μ',
        'ν',
        'ξ',
        'ο',
        'π',
        'ρ',
        'σ',
        'τ',
        'υ',
        'φ',
        'χ',
        'ψ',
        'ω',
        'Α',
        'Β',
        'Γ',
        'Δ',
        'Ε',
        'Ζ',
        'Η',
        'Θ',
        'Ι',
        'Κ',
        'Λ',
        'Μ',
        'Ν',
        'Ξ',
        'Ο',
        'Π',
        'Ρ',
        'Σ',
        'Τ',
        'Υ',
        'Φ',
        'Χ',
        'Ψ',
        'Ω',
      ],
      ['ϝ', 'ϛ', 'ͱ', 'ϻ', 'ϙ', 'ͳ', 'ϸ'],
      ['☿', '♀', '♁', '♂', '♃', '♄', '♅', '♆', '♇'],
    ],
    towerHeight: DecimalSource | DecimalSource[] = 5,
    towerChars: ([string, string] | boolean)[] = [false],
    visibleTowerMax: number | number[] = 5,
    toweriterationChars: [string, string, boolean, Notation][] = [],
    symbolAfter: boolean | boolean[] = false,
    parentheses: [string, string, string, string, string, string][] = [
      ['', '', '', '', '', ''],
      ['(', ')', '', '', '', ''],
      ['(', ')', '', '', '', ''],
    ],
    symbolShown:
      | ((value: Decimal, index: number, symbolValues: Decimal[], digitIndex: number, decimalPlaceAmount: number, digitValues: Decimal[]) => boolean)
      | ((
          value: Decimal,
          index: number,
          symbolValues: Decimal[],
          digitIndex: number,
          decimalPlaceAmount: number,
          digitValues: Decimal[],
        ) => boolean)[] = [(value) => true, (value) => value.gt(0), (value) => value.gt(0)],
    brackets: [string, string, string, string, string, string][] = [['', '', '[', ']', '', '']],
    firstBrackets: [string, string, string, string, string, string][] = [['', '', '', '', '', '']],
    lastBrackets: [string, string, string, string, string, string][] = [],
    reverseDigits: boolean = false,
    maxVisibleDigits: number = 3,
    expChars: [string, string, string, string, string, string] = ['', '', '{', '}', '', ''],
    expAfter: boolean = false,
    maxVisibleDigitsInExp: number = 2,
    exponentOffset: boolean = true,
    bracketsInExp: [string, string, string, string, string, string][] = brackets,
    firstBracketsInExp: [string, string, string, string, string, string][] = firstBrackets,
    lastBracketsInExp: [string, string, string, string, string, string][] = lastBrackets,
    expInnerNotation: Notation | null = null,
    uncertainChar: string = '◯',
    uncertainThreshold: DecimalSource = 636152238258658,
    maxVisibleLayers: number = 4,
    layerChars: [string, string, string, string, string, string] = ['', '', '◖', '◗', '', ''],
    layerAfter: boolean = false,
    maxVisibleLayersPost: number = 1,
    layerOffset: boolean = false,
    layerInnerNotation: Notation | null = null,
    layerUncertainChar: string = uncertainChar,
    layerUncertainThreshold: DecimalSource = 9e15,
    decimalPlaces: number = 0,
    decimalPoint: [string, string] = [';', ''],
    decimalBrackets: [string, string, string, string, string, string][] = [['', '', '[', ']', '', '']],
    showDecimalZeroes: number = 1,
    negExpThreshold: number = 1,
    negExpChars: null | [string, string, string, string, string, string] = null,
    negExpAfter: boolean = false,
    recipThreshold: number = 0,
    recipString: [string, string] = ['/', ''],
  ) {
    super()
    this.setSymbolsAndOthers(symbols, towerHeight, towerChars, visibleTowerMax, toweriterationChars, symbolAfter, parentheses, symbolShown)
    this.brackets = brackets
    this.firstBrackets = firstBrackets
    this.lastBrackets = lastBrackets
    this.reverseDigits = reverseDigits
    this.maxVisibleDigits = maxVisibleDigits
    this.expChars = expChars
    this.expAfter = expAfter
    this.maxVisibleDigitsInExp = maxVisibleDigitsInExp
    this.exponentOffset = exponentOffset
    this.bracketsInExp = bracketsInExp
    this.firstBracketsInExp = firstBracketsInExp
    this.lastBracketsInExp = lastBracketsInExp
    this.expInnerNotation = expInnerNotation
    this.uncertainChar = uncertainChar
    this.uncertainThreshold = toDecimal(uncertainThreshold)
    this.maxVisibleLayers = maxVisibleLayers
    this.layerChars = layerChars
    this.layerAfter = layerAfter
    this.maxVisibleLayersPost = maxVisibleLayersPost
    this.layerOffset = layerOffset
    this.layerInnerNotation = layerInnerNotation
    this.layerUncertainChar = layerUncertainChar
    this.layerUncertainThreshold = toDecimal(layerUncertainThreshold)
    this.decimalPlaces = decimalPlaces
    this.decimalPoint = decimalPoint
    this.decimalBrackets = decimalBrackets
    this.showDecimalZeroes = showDecimalZeroes
    this.negExpThreshold = negExpThreshold
    this.negExpChars = negExpChars
    this.negExpAfter = negExpAfter
    this.recipThreshold = recipThreshold
    this.recipString = recipString
  }

  public name = 'Omega Meta Zero Notation'

  private formatSingleDigit(
    value: Decimal,
    limits?: Decimal[],
    transitions?: Decimal[],
    digitIndex: number = 0,
    decimalPlaces: number = 0,
    digitValues: Decimal[] = [value],
  ): string {
    if (limits === undefined) {
      limits = [new Decimal(this._symbols[0].length).mul(this._towerHeight[0])]
      for (let s = 1; s < this._symbols.length - 1; s++) limits.push(Decimal.mul(this._symbols[s].length, this._towerHeight[s]))
      limits.push(Decimal.dInf)
    }
    if (transitions === undefined) {
      transitions = [limits[0]]
      for (let s = 1; s < this._symbols.length - 1; s++) transitions.push(transitions[s - 1].mul(limits[s]))
      transitions.push(Decimal.dInf)
    }
    let currentValue = value
    let remainders: Decimal[] = []
    for (let s = this._symbols.length - 2; s >= 0; s--) {
      let thisRemainder = currentValue.div(transitions[s]).floor()
      remainders.push(thisRemainder)
      currentValue = currentValue.mod(transitions[s], true)
    }
    remainders.push(currentValue.round())
    remainders.reverse()
    let cleared = 0
    let copiedRemainders: Decimal[] = []
    for (let r = 0; r < remainders.length; r++) copiedRemainders.push(remainders[r])
    while (copiedRemainders.length > 1 && copiedRemainders[copiedRemainders.length - 1].eq(0)) copiedRemainders.pop()
    while (cleared < copiedRemainders.length) {
      if (copiedRemainders[cleared].eq(0) && copiedRemainders.length > 1) {
        let examined = cleared + 1
        while (examined < copiedRemainders.length) {
          if (copiedRemainders[examined].neq(0)) break
          examined++
        }
        if (examined == copiedRemainders.length) {
          copiedRemainders = copiedRemainders.slice(0, cleared)
          cleared--
          continue
        }
      }
      if (copiedRemainders[cleared].gte(0) && copiedRemainders[cleared].lt(limits[cleared])) cleared++
      else {
        let offset = copiedRemainders[cleared].div(limits[cleared]).floor()
        if (cleared == limits.length - 1) {
          if (copiedRemainders[cleared].lt(0)) {
            copiedRemainders[cleared] = copiedRemainders[cleared].sub(offset.mul(limits[cleared]))
            copiedRemainders.pop()
            cleared--
          } else break
        }
        if (cleared == copiedRemainders.length - 1) copiedRemainders.push(Decimal.dZero)
        copiedRemainders[cleared + 1] = copiedRemainders[cleared + 1].plus(offset)
        copiedRemainders[cleared] = copiedRemainders[cleared].sub(offset.mul(limits[cleared]))
      }
    }
    for (let r = 0; r < remainders.length; r++) remainders[r] = r < copiedRemainders.length ? copiedRemainders[r] : Decimal.dZero
    let result = ''
    for (let s = 0; s < remainders.length; s++) {
      let thisRemainder = remainders[s]
      if (this._symbolShown[s](thisRemainder, s, remainders, digitIndex, decimalPlaces, digitValues)) {
        let towerHeight = thisRemainder.div(this._symbols[s].length).floor()
        let numRemainder = thisRemainder.mod(this._symbols[s].length, true).toNumber()
        result = this._parentheses[s][0] + result + this._parentheses[s][1]
        let symbolStr = this._symbols[s][numRemainder]
        if (towerHeight.gte(0) && towerHeight.lte(this._visibleTowerMax[s])) {
          for (let t = 0; t < towerHeight.toNumber(); t++) symbolStr = this._towerChars[s][0] + symbolStr + this._towerChars[s][1]
        } else {
          let towerStr = this._toweriterationChars[s][0] + this._toweriterationChars[s][3].format(towerHeight) + this._toweriterationChars[s][1]
          if (this._toweriterationChars[s][2]) symbolStr = symbolStr + towerStr
          else symbolStr = towerStr + symbolStr
        }
        symbolStr = this._parentheses[s][2] + symbolStr + this._parentheses[s][3]
        if (this._symbolAfter[s]) result = result + symbolStr
        else result = symbolStr + result
        result = this._parentheses[s][4] + result + this._parentheses[s][5]
      }
    }
    return result
  }

  public formatDecimal(value: Decimal): string {
    let limits = [new Decimal(this._symbols[0].length).mul(this._towerHeight[0])]
    for (let s = 1; s < this._symbols.length; s++) limits.push(Decimal.mul(this._symbols[s].length, this._towerHeight[s]))
    let transitions = [limits[0]]
    for (let s = 1; s < this._symbols.length; s++) transitions.push(transitions[s - 1].mul(limits[s]))
    limits.pop()
    let digitBase = transitions[transitions.length - 1]
    let recipThreshold = Decimal.dOne
    if (this.recipThreshold == 1) {
      recipThreshold = digitBase.pow(-this._negExpThreshold)
    } else if (this.recipThreshold == 2) {
      let offset = this.exponentOffset ? 0 : this._maxVisibleDigitsInExp - 1
      let exponentLimit = Decimal.min(this.uncertainThreshold.plus(offset), Decimal.pow(digitBase, this._maxVisibleDigits))
      recipThreshold = Decimal.pow(digitBase, exponentLimit.plus(offset)).recip()
    } else if (this.recipThreshold == 3) {
      let offset = this.exponentOffset ? 0 : this._maxVisibleDigitsInExp - 1
      let exponentLimit = Decimal.pow(digitBase, this._maxVisibleDigits)
      recipThreshold = Decimal.pow(digitBase, exponentLimit.plus(offset)).recip()
    }
    if (value.neq(0) && value.lt(recipThreshold)) return this.recipString[0] + this.format(value.recip()) + this.recipString[1]
    let layerLimit = digitBase.pow(this._maxVisibleDigits)
    let layerMantissaLimit = layerLimit
    for (let l = 0; l < this._maxVisibleLayers; ) {
      if (!this.exponentOffset) layerLimit = layerLimit.plus(this._maxVisibleDigitsInExp - 1)
      layerLimit = digitBase.pow(layerLimit)
      if (l < this._maxVisibleLayersPost) layerMantissaLimit = layerLimit
      l++
      if (layerLimit.gte('e100')) {
        layerLimit = Decimal.iteratedexp(digitBase, this._maxVisibleLayers - l, layerLimit, true)
        if (l < this._maxVisibleLayersPost) layerMantissaLimit = Decimal.iteratedexp(digitBase, this._maxVisibleLayersPost - l, layerLimit, true)
        break
      }
    }
    transitions.pop() // Would have just put this statement into digitBase, but then TypeScript would have to account for the case where it's undefined
    let digits: Decimal[] = []
    let currentValue = value
    let exponent: Decimal = Decimal.dZero
    let layers: Decimal = Decimal.dZero
    let scientific = false
    let layerScientific = false
    if (value.gte(layerLimit)) {
      layerScientific = true
      if (currentValue.gte(layerMantissaLimit)) {
        let safeMax = Decimal.max('ee100', layerMantissaLimit)
        let safeMaxSlog = Decimal.slog(safeMax, digitBase, true)
        while (currentValue.gte(safeMax)) {
          if (!currentValue.isFinite()) currentValue = layerMantissaLimit // Combats imprecision
          let safeIterations = Decimal.slog(currentValue, digitBase, true).sub(safeMaxSlog).floor().plus(1).max(0).toNumber()
          layers = layers.plus(safeIterations)
          currentValue = currentValue.iteratedlog(digitBase, safeIterations, true)
        }
        while (currentValue.gte(layerMantissaLimit)) {
          if (!currentValue.isFinite()) currentValue = layerMantissaLimit // Combats imprecision
          currentValue = currentValue.log(digitBase)
          if (!this.exponentOffset) currentValue = currentValue.sub(this._maxVisibleDigitsInExp - 1)
          layers = layers.plus(1)
        }
      }
      if (this.layerOffset) layers = layers.plus(this._maxVisibleLayersPost)
    }
    if (layers.gte(this.layerUncertainThreshold)) exponent = Decimal.dInf
    else if (
      currentValue.gte(digitBase.pow(this._maxVisibleDigits)) ||
      (currentValue.neq(0) && currentValue.lt(digitBase.pow(-this._negExpThreshold)))
    ) {
      scientific = true
      ;[currentValue, exponent] = scientifify(currentValue, digitBase, 0, this._maxVisibleDigitsInExp - 1)
      if (this.exponentOffset) exponent = exponent.plus(this._maxVisibleDigitsInExp - 1)
    }
    let decimalPlaces = this._decimalPlaces
    if (scientific) decimalPlaces = 0
    if (value.eq(0)) decimalPlaces = 0
    if (exponent.abs().lt(this.uncertainThreshold)) {
      let digitExponent = Decimal.log(currentValue, digitBase).floor()
      for (let e = digitExponent.toNumber(); e > -decimalPlaces; e--) {
        let placeValue = Decimal.pow(digitBase, e)
        let thisRemainder = currentValue.div(placeValue).floor()
        digits.push(thisRemainder)
        currentValue = currentValue.mod(placeValue, true)
      }
      digits.push(currentValue.mul(Decimal.pow(digitBase, decimalPlaces)).floor())
      digits.reverse()
      while (digits.length > decimalPlaces && digits.length > 1 && digits[digits.length - 1].eq(0)) digits.pop()
      let cleared = 0
      let copiedDigits: Decimal[] = []
      for (let r = 0; r < digits.length; r++) copiedDigits.push(digits[r])
      while (cleared < digits.length) {
        if (copiedDigits[cleared].eq(0)) {
          let examined = cleared + 1
          while (examined < copiedDigits.length) {
            if (copiedDigits[examined].neq(0)) break
            examined++
          }
          if (examined == copiedDigits.length) {
            copiedDigits = copiedDigits.slice(0, cleared)
            cleared--
            if (copiedDigits.length == 0) break
            continue
          }
        }
        if (copiedDigits[cleared].gte(0) && copiedDigits[cleared].lt(digitBase)) cleared++
        else {
          let offset = copiedDigits[cleared].div(digitBase).floor()
          if (cleared == copiedDigits.length - 1) copiedDigits.push(Decimal.dZero)
          copiedDigits[cleared + 1] = copiedDigits[cleared + 1].plus(offset)
          copiedDigits[cleared] = copiedDigits[cleared].sub(offset.mul(digitBase))
        }
      }
      for (let r = 0; r < digits.length; r++) digits[r] = r < copiedDigits.length ? copiedDigits[r] : Decimal.dZero
    }
    let removeDecimalZeroes = false
    if (this.showDecimalZeroes < 0) removeDecimalZeroes = true
    else if (this.showDecimalZeroes > 0) removeDecimalZeroes = false
    else {
      removeDecimalZeroes = true
      for (let d = 0; d < this._decimalPlaces && d < digits.length; d++)
        if (digits[d].neq(0)) {
          removeDecimalZeroes = false
          break
        }
    }
    if (removeDecimalZeroes) {
      while (digits.length > 0 && digits[0].eq(0) && decimalPlaces > 0) {
        digits.shift()
        decimalPlaces--
      }
    }
    if (digits.length != 0) {
      while (digits.length < decimalPlaces + 1) digits.push(Decimal.dZero)
    }
    let result = ''
    if (exponent.eq(Infinity)) {
      result = this.layerUncertainChar
    } else {
      if (digits.length == 0) result = this.uncertainChar
      else
        for (let s = 0; s < digits.length; s++) {
          let thisDigit = digits[s]
          let usedBrackets: [string, string, string, string, string, string]
          if (scientific) {
            if (digits.length - s - 1 < this.firstBracketsInExp.length) usedBrackets = this.firstBracketsInExp[digits.length - s - 1]
            else if (s < this.lastBracketsInExp.length) usedBrackets = this.lastBracketsInExp[s]
            else usedBrackets = this._bracketsInExp[s % this._bracketsInExp.length]
          } else {
            if (s < decimalPlaces) usedBrackets = this.decimalBrackets[(-s - 1) % this._decimalBrackets.length]
            else if (digits.length - s - 1 < this.firstBrackets.length) usedBrackets = this.firstBrackets[digits.length - s - 1]
            else if (s - decimalPlaces < this.lastBrackets.length) usedBrackets = this.lastBrackets[s - decimalPlaces]
            else usedBrackets = this._brackets[(s - decimalPlaces) % this._brackets.length]
          }
          result = usedBrackets[0] + result + usedBrackets[1]
          let symbolStr = this.formatSingleDigit(thisDigit, undefined, undefined, s - decimalPlaces, decimalPlaces, digits)
          symbolStr = usedBrackets[2] + symbolStr + usedBrackets[3]
          if (this.reverseDigits) result = result + symbolStr
          else result = symbolStr + result
          result = usedBrackets[4] + result + usedBrackets[5]
          if (s == decimalPlaces - 1) {
            result = this.decimalPoint[0] + result + this.decimalPoint[1]
          }
        }
      if (scientific) {
        let usedExpChars = this.expChars
        let usedExpAfter = this.expAfter
        if (exponent.lt(0) && this.negExpChars !== null) {
          exponent = exponent.abs()
          usedExpChars = this.negExpChars
          usedExpAfter = this.negExpAfter
        }
        result = usedExpChars[0] + result + usedExpChars[1]
        let symbolStr: string
        if (this.expInnerNotation === null) symbolStr = this.format(exponent)
        else symbolStr = this.expInnerNotation.format(exponent)
        symbolStr = usedExpChars[2] + symbolStr + usedExpChars[3]
        if (usedExpAfter) result = result + symbolStr
        else result = symbolStr + result
        result = usedExpChars[4] + result + usedExpChars[5]
      }
    }
    if (layerScientific) {
      result = this.layerChars[0] + result + this.layerChars[1]
      let symbolStr: string
      if (this.layerInnerNotation === null) symbolStr = this.format(layers)
      else symbolStr = this.layerInnerNotation.format(layers)
      symbolStr = this.layerChars[2] + symbolStr + this.layerChars[3]
      if (this.layerAfter) result = result + symbolStr
      else result = symbolStr + result
      result = this.layerChars[4] + result + this.layerChars[5]
    }
    return result
  }

  private setSymbolsAndOthers(
    symbols: string[][],
    towerHeight: DecimalSource | DecimalSource[],
    towerChars: ([string, string] | boolean)[],
    visibleTowerMax: number | number[],
    toweriterationChars: [string, string, boolean, Notation][],
    symbolAfter: boolean | boolean[],
    parentheses: [string, string, string, string, string, string][],
    symbolShown:
      | ((value: Decimal, index: number, symbolValues: Decimal[], digitIndex: number, decimalPlaceAmount: number, digitValues: Decimal[]) => boolean)
      | ((
          value: Decimal,
          index: number,
          symbolValues: Decimal[],
          digitIndex: number,
          decimalPlaceAmount: number,
          digitValues: Decimal[],
        ) => boolean)[],
  ) {
    if (symbols.length == 0) throw new Error("Omega Meta Zero notation doesn't work without any symbols!")
    for (let s = 0; s < symbols.length; s++)
      if (symbols[s].length < 2) throw new Error('Each set of symbols in Omega Meta Zero notation must have at least two symbols')
    this._symbols = symbols
    // Changing the amount of symbol sets requires re-running a bunch of other setters too
    this.towerHeight = towerHeight
    this.towerChars = towerChars
    this.visibleTowerMax = visibleTowerMax
    this.towerIterationChars = toweriterationChars
    this.symbolAfter = symbolAfter
    this.parentheses = parentheses
    this.symbolShown = symbolShown
  }

  public get symbols() {
    return this._symbols
  }

  public set symbols(symbols: string[][]) {
    if (symbols.length == 0) throw new Error("Omega Meta Zero notation doesn't work without any symbols!")
    for (let s = 0; s < symbols.length; s++)
      if (symbols[s].length < 2) throw new Error('Each set of symbols in Omega Meta Zero notation must have at least two symbols')
    this.setSymbolsAndOthers(
      symbols,
      this._towerHeight,
      this._towerChars,
      this._visibleTowerMax,
      this._toweriterationChars,
      this._symbolAfter,
      this._parentheses,
      this._symbolShown,
    )
  }

  public get towerHeight() {
    return this._towerHeight
  }

  public set towerHeight(towerHeight: DecimalSource | DecimalSource[]) {
    if (!Array.isArray(towerHeight)) towerHeight = [towerHeight]
    let towerHeightD = towerHeight.map(toDecimal)
    if (towerHeightD.length == 0) towerHeightD.push(new Decimal(5))
    while (towerHeightD.length < this._symbols.length) towerHeightD.push(towerHeightD[towerHeightD.length - 1])
    this._towerHeight = towerHeightD
  }

  public get towerChars() {
    return this._towerChars
  }

  public set towerChars(towerChars: ([string, string] | boolean)[]) {
    if (towerChars.length == 0) towerChars.push(false)
    while (towerChars.length < this.symbols.length) towerChars.push(towerChars[towerChars.length - 1])
    // Another round of "writing the code in a more complicated way to make TypeScript happy":
    let newTowerChars: [string, string][] = []
    for (let t = 0; t < towerChars.length; t++) {
      let tc = towerChars[t]
      if (tc === true) newTowerChars.push([this.symbols[t][this.symbols[t].length - 1] + '<sup>', '</sup>'])
      else if (tc === false) newTowerChars.push([this.symbols[t][this.symbols[t].length - 1] + '^', ''])
      else newTowerChars.push(tc)
    }
    this._towerChars = newTowerChars
  }

  public get visibleTowerMax() {
    return this._visibleTowerMax
  }

  public set visibleTowerMax(visibleTowerMax: number | number[]) {
    if (!Array.isArray(visibleTowerMax)) visibleTowerMax = [visibleTowerMax]
    if (visibleTowerMax.length == 0) visibleTowerMax.push(5)
    while (visibleTowerMax.length < this.symbols.length) visibleTowerMax.push(visibleTowerMax[visibleTowerMax.length - 1])
    this._visibleTowerMax = visibleTowerMax
  }

  public get towerIterationChars() {
    return this._toweriterationChars
  }

  public set towerIterationChars(towerIterationChars: [string, string, boolean, Notation][]) {
    while (towerIterationChars.length < this.symbols.length)
      towerIterationChars.push([
        '(' + this._towerChars[towerIterationChars.length][0] + '^',
        this._towerChars[towerIterationChars.length][1] + ')',
        false,
        new DefaultNotation(),
      ])
    this._toweriterationChars = towerIterationChars
  }

  public get symbolAfter() {
    return this._symbolAfter
  }

  public set symbolAfter(symbolAfter: boolean | boolean[]) {
    if (!Array.isArray(symbolAfter)) symbolAfter = [symbolAfter]
    if (symbolAfter.length == 0) symbolAfter.push(false)
    while (symbolAfter.length < this.symbols.length) symbolAfter.push(symbolAfter[symbolAfter.length - 1])
    this._symbolAfter = symbolAfter
  }

  public get parentheses() {
    return this._parentheses
  }

  public set parentheses(parentheses: [string, string, string, string, string, string][]) {
    if (parentheses.length == 0) parentheses.push(['', '', '', '', '', ''])
    while (parentheses.length < this.symbols.length) parentheses.push(parentheses[parentheses.length - 1])
    this._parentheses = parentheses
  }

  public get symbolShown() {
    return this._symbolShown
  }

  public set symbolShown(
    symbolShown:
      | ((value: Decimal, index: number, symbolValues: Decimal[], digitIndex: number, decimalPlaceAmount: number, digitValues: Decimal[]) => boolean)
      | ((
          value: Decimal,
          index: number,
          symbolValues: Decimal[],
          digitIndex: number,
          decimalPlaceAmount: number,
          digitValues: Decimal[],
        ) => boolean)[],
  ) {
    if (!Array.isArray(symbolShown)) symbolShown = [symbolShown]
    if (symbolShown.length == 0) symbolShown.push((value) => value.gt(0))
    while (symbolShown.length < this.symbols.length) symbolShown.push(symbolShown[symbolShown.length - 1])
    this._symbolShown = symbolShown
  }

  public get brackets() {
    return this._brackets
  }

  public set brackets(brackets: [string, string, string, string, string, string][]) {
    if (brackets.length == 0) brackets = [['', '', '', '', '', '']]
    this._brackets = brackets
  }

  public get bracketsInExp() {
    return this._bracketsInExp
  }

  public set bracketsInExp(brackets: [string, string, string, string, string, string][]) {
    if (brackets.length == 0) brackets = [['', '', '', '', '', '']]
    this._bracketsInExp = brackets
  }

  public get maxVisibleDigits() {
    return this._maxVisibleDigits
  }

  public set maxVisibleDigits(maxVisibleDigits: number) {
    if (maxVisibleDigits < 1) throw new RangeError('maxVisibleDigits cannot be below 1 in Omega Meta Zero notation')
    if (maxVisibleDigits % 1 != 0) throw new RangeError('maxVisibleDigits must be a whole number in Omega Meta Zero notation')
    this._maxVisibleDigits = maxVisibleDigits
  }

  public get maxVisibleDigitsInExp() {
    return this._maxVisibleDigitsInExp
  }

  public set maxVisibleDigitsInExp(maxVisibleDigits: number) {
    if (maxVisibleDigits < 1) throw new RangeError('maxVisibleDigitsInExp cannot be below 1 in Omega Meta Zero notation')
    if (maxVisibleDigits % 1 != 0) throw new RangeError('maxVisibleDigitsInExp must be a whole number in Omega Meta Zero notation')
    this._maxVisibleDigitsInExp = maxVisibleDigits
  }

  public get maxVisibleLayers() {
    return this._maxVisibleLayers
  }

  public set maxVisibleLayers(maxVisibleLayers: number) {
    if (maxVisibleLayers < 0) throw new RangeError('maxVisibleLayers cannot be below 0 in Omega Meta Zero notation')
    if (maxVisibleLayers % 1 != 0) throw new RangeError('maxVisibleLayers must be a whole number in Omega Meta Zero notation')
    this._maxVisibleLayers = maxVisibleLayers
  }

  public get maxVisibleLayersPost() {
    return this._maxVisibleLayersPost
  }

  public set maxVisibleLayersPost(maxVisibleLayers: number) {
    if (maxVisibleLayers < 0) throw new RangeError('maxVisibleLayersPost cannot be below 0 in Omega Meta Zero notation')
    if (maxVisibleLayers % 1 != 0) throw new RangeError('maxVisibleLayersPost  must be a whole number in Omega Meta Zero notation')
    this._maxVisibleLayersPost = maxVisibleLayers
  }

  public get decimalPlaces() {
    return this._decimalPlaces
  }

  public set decimalPlaces(decimalPlaces: number) {
    if (decimalPlaces < 0) throw new RangeError('decimalPlaces cannot be below 0 in Omega Meta Zero notation')
    if (decimalPlaces % 1 != 0) throw new RangeError('decimalPlaces must be a whole number in Omega Meta Zero notation')
    this._decimalPlaces = decimalPlaces
  }

  public get decimalBrackets() {
    return this._decimalBrackets
  }

  public set decimalBrackets(decimalBrackets: [string, string, string, string, string, string][]) {
    if (decimalBrackets.length == 0) decimalBrackets = [['', '', '', '', '', '']]
    this._decimalBrackets = decimalBrackets
  }

  public get negExpThreshold() {
    return this._negExpThreshold
  }

  public set negExpThreshold(negExpThreshold: number) {
    if (negExpThreshold < 0) throw new RangeError('negExpThreshold cannot be below 0 in Omega Meta Zero notation')
    this._negExpThreshold = negExpThreshold
  }
}

  /**
   * Scientific notation, but with tetration instead of exponentiation. Abbreviates 9 as "9F0", 1,000 as "3F1", and 10^10^10^10 as "1F4".
   * @param maxnum ( Decimal ) Only exponents below this value are allowed - anything higher and the exponent itself is abbreviated in hyperscientific notation. Default is 1e10.
   * @param max_Fs_in_a_row ( number ) If the hyperscientific representation would have more F's at the beginning than this, those F's are made into an F^n expression. Default is 5.
   * @param rounding ( DecimalSource | ((value : Decimal) => Decimal) ) The mantissa is rounded to the nearest multiple of this value. If this parameter is a function, then the mantissa is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0.
   * @param engineerings ( Decimal | Decimal[] ) Either a DecimalSource or an array of DecimalSources; default is 1. This parameter controls the allowed hyperexponent values: if it's three then the hyperexponent will always be a multiple of 3, like in engineering notation. If this is an array, then multiples of those values are added from greatest to least to get the allowed values: for example, if engineerings is [5, 2], then the permitted hyperexponent values are 2, 4, 5, 7, 9, 10, 12, 14... and so on, i.e. multiples of 5 plus a multiple of 2 less than 5 (which may be 0). Default is 1, which corresponds to regular hyperscientific notation.
   * @param mantissaPower ( Decimal ) Normally, the mantissa in hyperscientific notation is bounded by 1 and the base, which corresponds to the default mantissaPower of 0. If mantissaPower is 1, the bounds are base and base^^2, if mantissaPower is 2 then the bounds are base^^2 and base^^3, and so on. For example, a number normally represented as "2F3" would become "100F2" with 1 mantissaPower and "(1e100)F1" with 2 mantissaPower.
   * @param iteration_zero ( boolean ) If this is true, then numbers less than maxnum will ignore the scientific notation and jump directly to the innerNotation - useful if you want 2 to just be abbreviated as "2" instead of "2F0". Default is false.
   * @param base ( Decimal ) Hyperscientific notation normally works in tetra-powers of 10, but you can change this value to change that. Default is 10. For example, set this to 9, and 81 becomes "2F1".
   * @param expChars ( [[string, string], [string | boolean, string | boolean], [string, string]] ) An array of three pairs of strings that are used as the between characters for scientific notation. In each pair, the first entry goes before the hyperexponent, the second entry goes after the hyperexponent. expChars[0] takes the place of the F in "1F10", expChars[1] takes the place of the first F in "F1F10", and expChars[2] takes the place of the (F^) in (F^10)4. If expChars[1][0] is a boolean instead of a string: if it's false, then expChars[1][0] is set to be expChars[0][0] with the way mantissaInnerNotation formats 1 tacked on the beginning, and if it's true than the 1 is tacked on the end instead. Likewise for expChars[1][1] (expChars[0][1] with a 1 on it). Default is [["F", ""], ["F", ""], ["(F^", ")"]].
   * @param negExpChars ( null | [[string, string] | boolean, [string, string]] ) This can either be null or a pair of pairs of strings (in which the first pair of strings may be a boolean instead). Ignore this parameter if it's null, which is the default. If it's a pair of pairs of strings, then the first pair is used like expChars[0] but for negative exponents (so if it's ["d", ""], then 2e-4 would be 2d4 instead), and the second pair is used on small numbers whose reciprocals are large enough to need expChars[1], in which case the second pair indicates that a reciprocal has been taken. If negExpChars[0] is a boolean instead, then if it's true the notation goes directly to the reciprocal behavior for all inputs less than 1, while if it's false then single-iteration inputs don't use negExpChars but multi-iteration ones still use reciprocal behavior.
   * @param expBefore ( boolean ) If this parameter is true, the hyperexponent comes before the mantissa instead of after. Default is false.
   * @param superexpAfter ( boolean ) If this parameter is true, (e^n) expressions come after the rest of the number instead of before. Default is false.
   * @param formatNegatives ( boolean ) If this parameter is false, negative numbers are just formatted using their absolute value with negativeString around it, like in most notations. If this parameter is true, negative numbers are formatted in hyperscientific directly. Default is true.
   * @param expMult ( Decimal ) On each single exponentiation in the tetration, the exponent is multiplied by this value. Default is 1.
   * @param hyperexpMult ( Decimal ) Each hyperexponent in the process is multiplied by this value. Default is 1.
   * @param mantissaInnerNotation ( Notation ) The notation that the numbers within the mantissas are themselves notated with. DefaultNotation is the default.
   * @param exponentInnerNotation ( Notation ) The notation that the highest hyperexponent is itself notated with. Is the same as mantissaInnerNotation by default.
   * @param superexponentInnerNotation ( Notation ) The notation that the number in an (F^n) expression is itself notated with. Is the same as exponentInnerNotation by default.
   */
export class HyperscientificNotation extends Notation {
    private _maxnum : Decimal = new Decimal(1e10);
    public max_Fs_in_a_row = 5;
    public rounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero;
    private _engineerings : Decimal[] = [Decimal.dOne];
    private _mantissaPower : Decimal = Decimal.dZero;
    public iteration_zero : boolean = false;
    private _base : Decimal = Decimal.dTen;
    private _expChars : [string, string][] = [["F", ""], ["F", ""], ["(F^", ")"]];
    public negExpChars : null | [[string, string] | boolean, [string, string]] = null;
    public expBefore : boolean = false;
    public superexpAfter : boolean = false;
    public formatNegatives : boolean = true;
    private _expMult : Decimal = Decimal.dOne;
    private _hyperexpMult : Decimal = Decimal.dOne;
    public mantissaInnerNotation : Notation = new DefaultNotation();
    public exponentInnerNotation : Notation = this.mantissaInnerNotation;
    public superexponentInnerNotation : Notation = this.exponentInnerNotation;
    private unconvertedExpChars : [[string, string], [string | boolean, string | boolean], [string, string]];

    constructor(
        maxnum: DecimalSource = 1e10,
        max_Fs_in_a_row: number = 5, 
        rounding : DecimalSource | ((value : Decimal) => Decimal) = 0,
        engineerings : DecimalSource | DecimalSource[] = 1, 
        mantissaPower : DecimalSource = 0,
        iteration_zero : boolean = false,
        base : DecimalSource = 10, 
        expChars : [[string, string], [string | boolean, string | boolean], [string, string]] = [["F", ""], ["F", ""], ["(F^", ")"]],
        negExpChars : null | [[string, string] | boolean, [string, string]] = null,
        expBefore : boolean = false,
        superexpAfter : boolean = false,
        formatNegatives : boolean = true,
        expMult : DecimalSource = 1,
        hyperexpMult : DecimalSource = 1,
        mantissaInnerNotation : Notation = new DefaultNotation(),
        exponentInnerNotation : Notation = mantissaInnerNotation,
        superexponentInnerNotation : Notation = exponentInnerNotation,
        ) {
      super();
      this.maxnum = maxnum;
      this.max_Fs_in_a_row = max_Fs_in_a_row;
      this.rounding = rounding;
      this.engineerings = engineerings;
      this.mantissaPower = mantissaPower;
      this.iteration_zero = iteration_zero;
      this._base = toDecimal(base);
      this.expBefore = expBefore;
      this.superexpAfter = superexpAfter;
      this.formatNegatives = formatNegatives;
      this.expMult = expMult;
      this.hyperexpMult = hyperexpMult;
      this.mantissaInnerNotation = mantissaInnerNotation;
      this.exponentInnerNotation = exponentInnerNotation;
      this.superexponentInnerNotation = superexponentInnerNotation;
      this.unconvertedExpChars = expChars;
      this.expChars = expChars;
      this.negExpChars = negExpChars;
    }

    public name = "Hyperscientific Notation";

    public format(
      value: DecimalSource
    ): string {

      let decimal = toDecimal(value);

      if (decimal.isNan()) return this.NaNString;
  
      if (this.isInfinite(decimal)) {
        return decimal.sgn() < 0 ? this.negativeInfinite : this.infinite;
      }

      if (decimal.neq(0) && this.isInfinite(decimal.recip())) {
        return this.format(0);
      }
  
      return (decimal.sgn() < 0 && !this.formatNegatives)
        ? this.formatNegativeDecimal(decimal.abs())
        : this.formatDecimal(decimal);
    }
  
    public formatDecimal(value: Decimal): string {
      if (this.iteration_zero && value.lt(this._maxnum) && value.gt(this._maxnum.recip())) return this.mantissaInnerNotation.format(value);
      let result = "";
      if (value.lt(iteratedexpmult(this._base, 1, this._maxnum.toNumber(), this._expMult))) {
        let [mantissa, exponent] = hyperscientifify(value, this._base, this.rounding, this._mantissaPower, this._engineerings, this._expMult, this._hyperexpMult);
        let beforeChar = this._expChars[0][0];
        let afterChar = this._expChars[0][1];
        if (exponent.lt(0) && this.negExpChars !== null && this.negExpChars[0] !== false) {
          if (this.negExpChars[0] === true) return this.negExpChars[1][0] + this.format(value.recip()) + this.negExpChars[1][1];
          beforeChar = this.negExpChars[0][0];
          afterChar = this.negExpChars[0][1];
          exponent = exponent.neg();
        }
        let mantissaStr = this.mantissaInnerNotation.format(mantissa);
        let exponentStr = this.exponentInnerNotation.format(exponent);
        if (this.expBefore) result = beforeChar + exponentStr + afterChar + mantissaStr;
        else result = mantissaStr + beforeChar + exponentStr + afterChar;
      }
      else {
        if (value.lt(1) && this.negExpChars !== null) return this.negExpChars[1][0] + this.format(value.recip()) + this.negExpChars[1][1];
        let added_Fs = 0;
        while (value.gte(iteratedexpmult(this._base, 1, this._maxnum.toNumber(), this._expMult))) {
          added_Fs++;
          value = multslog(value, this._base, this._expMult).mul(this._hyperexpMult);
        }
        result = this.format(value);
        if (added_Fs <= this.max_Fs_in_a_row) {
          result = this._expChars[1][0] + result + this._expChars[1][1];
        }
        else {
            let FStr = this.superexponentInnerNotation.format(added_Fs);
            FStr = this._expChars[2][0] + FStr + this._expChars[2][1];
            if (this.superexpAfter) result = result + FStr;
            else result = FStr + result;
        }
      }
      return result;
    }

    public get maxnum() {
      return this._maxnum;
    }

    public set maxnum(maxnum: DecimalSource) {
      let maxnumD = toDecimal(maxnum);
      if (maxnumD.lte(0)) throw new RangeError("Nonpositive maxnum in Hyperscientific Notation");
      this._maxnum = maxnumD;
    }

    public get engineerings() {
      return this._engineerings;
    }
  
    public set engineerings(engineerings : DecimalSource | DecimalSource[]) {
      if (!Array.isArray(engineerings)) engineerings = [engineerings];
      if (engineerings.length == 0) {
        this._engineerings = [Decimal.dOne];
        return;
      }
      let engineeringsD : Decimal[] = engineerings.map(toDecimal);
      this._engineerings = engineeringsD.sort(function(a, b){
          if (a.lt(b)) return -1;
          else if (a.eq(b)) return 0;
          else return 1;
      }).reverse();
    }

    public get base() {
      return this._base;
    }

    public set base(base : DecimalSource) {
      let baseD = toDecimal(base);
      if (baseD.pow(this._expMult.recip()).lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work for Hyperscientific Notation");
      this._base = baseD;
    }

    public get mantissaPower() {
      return this._mantissaPower;
    }

    public set mantissaPower(mantissaPower : DecimalSource) {
      let mantissaPowerD = toDecimal(mantissaPower);
      if (mantissaPowerD.lt(-2)) throw new RangeError("mantissaPower below -2 in Hyperscientific Notation");
      this._mantissaPower = mantissaPowerD;
    }

    public get expMult() {
      return this._expMult;
    }

    public set expMult(expMult : DecimalSource) {
      let expMultD = toDecimal(expMult);
      if (expMultD.eq(0)) throw new RangeError("expMult should not be zero");
      if (this._base.pow(expMultD.recip()).lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work for Hyperscientific Notation");
      this._expMult = expMultD;
    }
    
    public get hyperexpMult() {
      return this._hyperexpMult;
    }

    public set hyperexpMult(hyperexpMult : DecimalSource) {
      let hyperexpMultD = toDecimal(hyperexpMult);
      if (hyperexpMultD.eq(0)) throw new RangeError("hyperexpMult should not be zero");
      this._hyperexpMult = hyperexpMultD;
    }  
  
    public get expChars() {
      return this.unconvertedExpChars;
    }
  
    public set expChars(input : [[string, string], [string | boolean, string | boolean], [string, string]]) {
      let one = this.mantissaInnerNotation.format(1);
      let expChars : [string, string][] = [];
      expChars.push(input[0]);
      expChars.push(["", ""]);
      if (typeof input[1][0] == "string") expChars[1][0] = input[1][0];
      else if (input[1][0] === false) expChars[1][0] = one + input[0][0];
      else if (input[1][0] === true) expChars[1][0] = input[0][0] + one;
      if (typeof input[1][1] == "string") expChars[1][1] = input[1][1];
      else if (input[1][1] === false) expChars[1][1] = one + input[0][1];
      else if (input[1][1] === true) expChars[1][1] = input[0][1] + one;
      expChars.push(input[2]);
      this._expChars = expChars;
    }

  }

    /**
     * This notation performs hyperscientific notation a certain number of times. 1 iteration means the number is in the form AFB (where A and B are abbreviated using the innerNotation), 2 iterations means the number is in the form AFBFC, and so on.
     * @param iterations ( number ! ) The amount of iterations.
     * @param max_Fs_in_a_row ( number ) If the hyperscientific representation would have more F's at the beginning than this, those F's are made into an F^n expression. Default is 5.
     * @param rounding ( DecimalSource | ((value : Decimal) => Decimal) ) The mantissa is rounded to the nearest multiple of this value. If this parameter is a function, then the mantissa is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0.
     * @param engineerings ( Decimal | Decimal[] ) Either a DecimalSource or an array of DecimalSources; default is 1. This parameter controls the allowed hyperexponent values: if it's three then the hyperexponent will always be a multiple of 3, like in engineering notation. If this is an array, then multiples of those values are added from greatest to least to get the allowed values: for example, if engineerings is [5, 2], then the permitted hyperexponent values are 2, 4, 5, 7, 9, 10, 12, 14... and so on, i.e. multiples of 5 plus a multiple of 2 less than 5 (which may be 0). Default is 1, which corresponds to regular hyperscientific notation.
     * @param mantissaPower ( Decimal ) Normally, the mantissa in hyperscientific notation is bounded by 1 and the base, which corresponds to the default mantissaPower of 0. If mantissaPower is 1, the bounds are base and base^^2, if mantissaPower is 2 then the bounds are base^^2 and base^^3, and so on. For example, a number normally represented as "2F3" would become "100F2" with 1 mantissaPower and "(1e100)F1" with 2 mantissaPower.
     * @param base ( Decimal ) Hyperscientific notation normally works in tetra-powers of 10, but you can change this value to change that. Default is 10. For example, set this to 9, and 81 becomes "2F1".
     * @param expChars ( [[string, string], [string | boolean, string | boolean], [string, string]] ) An array of three pairs of strings that are used as the between characters for scientific notation. In each pair, the first entry goes before the hyperexponent, the second entry goes after the hyperexponent. expChars[0] takes the place of the F in "1F10", expChars[1] takes the place of the first F in "F1F10", and expChars[2] takes the place of the (F^) in (F^10)4. If expChars[1][0] is a boolean instead of a string: if it's false, then expChars[1][0] is set to be expChars[0][0] with the way mantissaInnerNotation formats 1 tacked on the beginning, and if it's true than the 1 is tacked on the end instead. Likewise for expChars[1][1] (expChars[0][1] with a 1 on it). Default is [["F", ""], ["F", ""], ["(F^", ")"]].
     * @param negExpChars ( null | [[string, string] | boolean, [string, string]] ) This can either be null or a pair of pairs of strings (in which the first pair of strings may be a boolean instead). Ignore this parameter if it's null, which is the default. If it's a pair of pairs of strings, then the first pair is used like expChars[0] but for negative exponents (so if it's ["d", ""], then 2e-4 would be 2d4 instead), and the second pair is used on small numbers whose reciprocals are large enough to need expChars[1], in which case the second pair indicates that a reciprocal has been taken. If negExpChars[0] is a boolean instead, then if it's true the notation goes directly to the reciprocal behavior for all inputs less than 1, while if it's false then single-iteration inputs don't use negExpChars but multi-iteration ones still use reciprocal behavior.
     * @param expBefore ( boolean ) If this parameter is true, the hyperexponent comes before the mantissa instead of after. Default is false.
     * @param superexpAfter ( boolean ) If this parameter is true, (e^n) expressions come after the rest of the number instead of before. Default is false.
     * @param formatNegatives ( boolean ) If this parameter is false, negative numbers are just formatted using their absolute value with negativeString around it, like in most notations. If this parameter is true, negative numbers are formatted in hyperscientific directly. Default is false.
     * @param expMult ( Decimal ) On each single exponentiation in the tetration, the exponent is multiplied by this value. Default is 1.
     * @param hyperexpMult ( Decimal ) Each hyperexponent in the process is multiplied by this value. Default is 1.
     * @param mantissaInnerNotation ( Notation ) The notation that the numbers within the mantissas are themselves notated with. DefaultNotation is the default.
     * @param exponentInnerNotation ( Notation ) The notation that the highest hyperexponent is itself notated with. Is the same as mantissaInnerNotation by default.
     * @param superexponentInnerNotation ( Notation ) The notation that the number in an (F^n) expression is itself notated with. Is the same as exponentInnerNotation by default.
     */
  export class HyperscientificIterationsNotation extends Notation {
    private _iterations ! : number;
    public max_Fs_in_a_row = 5;
    public rounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero;
    private _engineerings : Decimal[] = [Decimal.dOne];
    public mantissaPower : Decimal = Decimal.dZero;
    private _base : Decimal = Decimal.dTen;
    private _expChars : [string, string][] = [["F", ""], ["F", ""], ["(F^", ")"]];
    public negExpChars : null | [[string, string] | boolean, [string, string]] = null;
    public expBefore : boolean = false;
    public superexpAfter : boolean = false;
    public formatNegatives : boolean = false;
    private _expMult : Decimal = Decimal.dOne;
    private _hyperexpMult : Decimal = Decimal.dOne;
    public mantissaInnerNotation : Notation = new DefaultNotation();
    public exponentInnerNotation : Notation = this.mantissaInnerNotation;
    public superexponentInnerNotation : Notation = this.exponentInnerNotation;
    private unconvertedExpChars : [[string, string], [string | boolean, string | boolean], [string, string]];

    constructor(
        iterations: number,
        max_Fs_in_a_row: number = 5,
        rounding : DecimalSource | ((value : Decimal) => Decimal) = 0,
        engineerings : DecimalSource | DecimalSource[] = 1, 
        mantissaPower : DecimalSource = 0,
        base : DecimalSource = 10, 
        expChars : [[string, string], [string | boolean, string | boolean], [string, string]] = [["F", ""], ["F", ""], ["(F^", ")"]],
        negExpChars : null | [[string, string] | boolean, [string, string]] = null,
        expBefore : boolean = false,
        superexpAfter : boolean = false,
        formatNegatives : boolean = false,
        expMult : DecimalSource = 1,
        hyperexpMult : DecimalSource = 1,
        mantissaInnerNotation : Notation = new DefaultNotation(),
        exponentInnerNotation : Notation = mantissaInnerNotation,
        superexponentInnerNotation : Notation = exponentInnerNotation,
        ) {
      super();
      this.iterations = iterations;
      this.max_Fs_in_a_row = max_Fs_in_a_row;
      this.rounding = rounding;
      this.engineerings = engineerings;
      this.mantissaPower = toDecimal(mantissaPower);
      this._base = toDecimal(base);
      this.expBefore = expBefore;
      this.superexpAfter = superexpAfter;
      this.formatNegatives = formatNegatives;
      this.expMult = expMult;
      this.hyperexpMult = hyperexpMult;
      this.mantissaInnerNotation = mantissaInnerNotation;
      this.exponentInnerNotation = exponentInnerNotation;
      this.superexponentInnerNotation = superexponentInnerNotation;
      this.unconvertedExpChars = expChars;
      this.expChars = expChars;
      this.negExpChars = negExpChars;
    }

    public name = "Hyperscientific Iterations Notation";

    public format(
      value: DecimalSource
    ): string {

      let decimal = toDecimal(value);

      if (decimal.isNan()) return this.NaNString;
  
      if (this.isInfinite(decimal)) {
        return decimal.sgn() < 0 ? this.negativeInfinite : this.infinite;
      }

      if (decimal.neq(0) && this.isInfinite(decimal.recip())) {
        return this.format(0);
      }
  
      return (decimal.sgn() < 0 && !this.formatNegatives)
        ? this.formatNegativeDecimal(decimal.abs())
        : this.formatDecimal(decimal);
    }
  
    public formatDecimal(value: Decimal): string {
      if (this._iterations == 0) return this.mantissaInnerNotation.format(value);
      let iterations = this._iterations;
      let result = "";
      let added_Fs = 0;
      while (value.gt(Decimal.tetrate(10, Number.MAX_SAFE_INTEGER, 1, true)) && added_Fs < iterations) {
        added_Fs++;
        value = multslog(value, this._base, this._expMult).mul(this._hyperexpMult);
      }
      let sciArray = [value];
      for (let i = 0; i < iterations - added_Fs; i++) {
        if (sciArray[sciArray.length - 1].lte(0) && !this.formatNegatives) break;
        let [mantissa, exponent] = hyperscientifify(sciArray[sciArray.length - 1], this._base, this.rounding, this.mantissaPower, this._engineerings, this._expMult, this._hyperexpMult);
        sciArray.pop();
        sciArray.push(mantissa, exponent);
      }
      let endings = sciArray.length - 1;
      let beforeChar = this._expChars[0][0];
      let afterChar = this._expChars[0][1];
      while (sciArray.length > 0) {
        let numStr = "";
        let toFormat = sciArray[0];
        if (this.negExpChars !== null && typeof this.negExpChars[0] !== "boolean" && toFormat.lt(0)) {
          toFormat = toFormat.neg();
          beforeChar = this.negExpChars[0][0];
          afterChar = this.negExpChars[0][1];
        }
        if (sciArray.length == 1) numStr = this.exponentInnerNotation.format(toFormat);
        else numStr = this.mantissaInnerNotation.format(toFormat);
        if (this.expBefore) {
          if (sciArray.length <= endings) result = afterChar + result;
          result = numStr + result;
          sciArray.shift();
        }
        else {
          if (sciArray.length <= endings) result += beforeChar;
          result += numStr;
          sciArray.shift();
        }
        beforeChar = this._expChars[0][0];
        afterChar = this._expChars[0][1];
      }
      for (let e = 0; e < endings; e++) {
        if (this.expBefore) result = beforeChar + result;
        else result += afterChar;
      }
      if (added_Fs <= this.max_Fs_in_a_row) {
        for (let i = 0; i < added_Fs; i++) result = this._expChars[1][0] + result + this._expChars[1][1];
      }
      else {
        let FStr = this.superexponentInnerNotation.format(added_Fs);
        FStr = this._expChars[2][0] + FStr + this._expChars[2][1];
        if (this.superexpAfter) result = result + FStr;
        else result = FStr + result;
      }
      return result;
    }

    public get engineerings() {
      return this._engineerings;
    }
  
    public set engineerings(engineerings : DecimalSource | DecimalSource[]) {
      if (!Array.isArray(engineerings)) engineerings = [engineerings];
      if (engineerings.length == 0) {
        this._engineerings = [Decimal.dOne];
        return;
      }
      let engineeringsD : Decimal[] = engineerings.map(toDecimal);
      this._engineerings = engineeringsD.sort(function(a, b){
          if (a.lt(b)) return -1;
          else if (a.eq(b)) return 0;
          else return 1;
      }).reverse();
    }

    public get iterations() {
      return this._iterations;
    }

    public set iterations(iterations : number) {
      if (iterations % 1 != 0) throw new RangeError("Hyperscientific Iterations Notation requires a whole number of iterations");
      this._iterations = iterations;
    }

    public get base() {
      return this._base;
    }

    public set base(base : DecimalSource) {
      let baseD = toDecimal(base);
      if (baseD.pow(this._expMult.recip()).lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work for Hyperscientific Iterations Notation");
      this._base = baseD;
    }

    public get expMult() {
      return this._expMult;
    }

    public set expMult(expMult : DecimalSource) {
      let expMultD = toDecimal(expMult);
      if (expMultD.eq(0)) throw new RangeError("expMult should not be zero");
      if (this._base.pow(expMultD.recip()).lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work for Hyperscientific Iterations Notation");
      this._expMult = expMultD;
    }
    
    public get hyperexpMult() {
      return this._hyperexpMult;
    }

    public set hyperexpMult(hyperexpMult : DecimalSource) {
      let hyperexpMultD = toDecimal(hyperexpMult);
      if (hyperexpMultD.eq(0)) throw new RangeError("hyperexpMult should not be zero");
      this._hyperexpMult = hyperexpMultD;
    }  
  
    public get expChars() {
      return this.unconvertedExpChars;
    }
  
    public set expChars(input : [[string, string], [string | boolean, string | boolean], [string, string]]) {
      let one = this.mantissaInnerNotation.format(1);
      let expChars : [string, string][] = [];
      expChars.push(input[0]);
      expChars.push(["", ""]);
      if (typeof input[1][0] == "string") expChars[1][0] = input[1][0];
      else if (input[1][0] === false) expChars[1][0] = one + input[0][0];
      else if (input[1][0] === true) expChars[1][0] = input[0][0] + one;
      if (typeof input[1][1] == "string") expChars[1][1] = input[1][1];
      else if (input[1][1] === false) expChars[1][1] = one + input[0][1];
      else if (input[1][1] === true) expChars[1][1] = input[0][1] + one;
      expChars.push(input[2]);
      this._expChars = expChars;
    }

  }

// let OMZPlain = new OmegaMetaZeroNotation(
//   [
//     [
//       'α',
//       'β',
//       'γ',
//       'δ',
//       'ε',
//       'ζ',
//       'η',
//       'θ',
//       'ι',
//       'κ',
//       'λ',
//       'μ',
//       'ν',
//       'ξ',
//       'ο',
//       'π',
//       'ρ',
//       'σ',
//       'τ',
//       'υ',
//       'φ',
//       'χ',
//       'ψ',
//       'ω',
//       'Α',
//       'Β',
//       'Γ',
//       'Δ',
//       'Ε',
//       'Ζ',
//       'Η',
//       'Θ',
//       'Ι',
//       'Κ',
//       'Λ',
//       'Μ',
//       'Ν',
//       'Ξ',
//       'Ο',
//       'Π',
//       'Ρ',
//       'Σ',
//       'Τ',
//       'Υ',
//       'Φ',
//       'Χ',
//       'Ψ',
//       'Ω',
//     ],
//     ['ϝ', 'ϛ', 'ͱ', 'ϻ', 'ϙ', 'ͳ', 'ϸ'],
//     ['☿', '♀', '♁', '♂', '♃', '♄', '♅', '♆', '♇'],
//   ],
//   5,
//   [false],
//   5,
//   [
//     ['((Ω^)^', ')', false, new DefaultNotation()],
//     ['((ϸ^)^', ')', false, new DefaultNotation()],
//     ['((♇^)^', ')', false, new DefaultNotation()],
//   ],
// )
// 
// let OMZPlain2 = new ConditionalNotation(
//   false,
//   [OMZPlain, (value) => value.lte('eeee9e15')],
//   [
//     new HyperscientificNotation(
//       Infinity,
//       ...[, , ,],
//       Decimal.slog('9e15', 10, true).sub(1),
//       ...[, ,],
//       [
//         ['<|', '|>:'],
//         ['<|', '|>:'],
//         ['<<', '>>'],
//       ],
//       undefined,
//       true,
//       false,
//       false,
//       ...[, ,],
//       OMZPlain,
//     ),
//     (value) => true,
//   ],
// ).setName('Omega Meta Zero')
// 
// let OMZLatex = new OmegaMetaZeroNotation(
//   [
//     [
//       '\\alpha',
//       '\\beta',
//       '\\gamma',
//       '\\delta',
//       '\\varepsilon',
//       '\\zeta',
//       '\\eta',
//       '\\theta',
//       '\\iota',
//       '\\kappa',
//       '\\lambda',
//       '\\mu',
//       '\\nu',
//       '\\xi',
//       '\\omicron',
//       '\\pi',
//       '\\rho',
//       '\\sigma',
//       '\\tau',
//       '\\upsilon',
//       '\\phi',
//       '\\chi',
//       '\\psi',
//       '\\omega',
//       'A',
//       'B',
//       '\\Gamma',
//       '\\Delta',
//       'E',
//       'Z',
//       'H',
//       '\\Theta',
//       'I',
//       'K',
//       '\\Lambda',
//       'M',
//       'N',
//       '\\Xi',
//       'O',
//       '\\Pi',
//       'P',
//       '\\Sigma',
//       'T',
//       '\\Upsilon',
//       '\\Phi',
//       'X',
//       '\\Psi',
//       '\\Omega',
//     ],
//     ['\\digamma', 'ϛ', 'ͱ', 'ϻ', 'ϙ', 'ͳ', 'ϸ'],
//     ['☿', '♀', '♁', '♂', '♃', '♄', '♅', '♆', '♇'],
//   ],
//   5,
//   [false],
//   5,
//   [
//     ['((Ω^)^', ')', false, new DefaultNotation()],
//     ['((ϸ^)^', ')', false, new DefaultNotation()],
//     ['((♇^)^', ')', false, new DefaultNotation()],
//   ],
// )
// 
// const OmegaMetaZero = recipBelow(OMZPlain2, 1, ['/', '']).setName('Omega Meta Zero')
// 
// 

/**
 * f0(n) in the Fast-Growing Hierarchy. This is the successor function, f0(n) = n + 1.
 * @param value ( Decimal ) The input to f0.
 */
export function FGH0(value : DecimalSource) : Decimal {
    return Decimal.plus(value, 1);
}

/**
 * The inverse of f0(n) in the Fast-Growing Hierarchy. Equal to n - 1.
 * @param value ( Decimal ) The value that FGH0 will return when given the result of this function.
 */
export function FGH0inverse(value : DecimalSource) : Decimal {
    return Decimal.sub(value, 1);
}

/**
 * Applies FGH0 to 'value' 'times' times. Equivalent to value + times.
 * @param value ( Decimal ) The value to repeatedly apply FGH0 to.
 * @param times ( Decimal ) The amount of times FGH0 is applied to value.
 */
export function iteratedFGH0(value : DecimalSource, times : DecimalSource) : Decimal {
    return Decimal.plus(value, times);
}

/**
 * Applies FGH0inverse to 'value' 'times' times. Equivalent to value - times.
 * @param value ( Decimal ) The value to repeatedly apply FGH0inverse to.
 * @param times ( Decimal ) The amount of times FGH0inverse is applied to value.
 */
export function iteratedFGH0inverse(value : DecimalSource, times : DecimalSource) : Decimal {
    return Decimal.sub(value, times);
}

/**
 * f1(n) in the Fast-Growing Hierarchy. f1(n) = f0(f0(f0(f0...(n)))) with n f0's. Since f0() is just adding 1, f1(n) equals n * 2.
 * @param value ( Decimal ) The input to f1.
 */
export function FGH1(value : DecimalSource) : Decimal {
    return Decimal.mul(value, 2)
}

/**
 * The inverse of f1(n) in the Fast-Growing Hierarchy. Equal to n / 2.
 * @param value ( Decimal ) The value that FGH1 will return when given the result of this function.
 */
export function FGH1inverse(value : DecimalSource) : Decimal {
    return Decimal.div(value, 2);
}

/**
 * Applies FGH1 to 'value' 'times' times. Equivalent to value * 2^times.
 * @param value ( Decimal ) The value to repeatedly apply FGH1 to.
 * @param times ( Decimal ) The amount of times FGH1 is applied to value.
 */
export function iteratedFGH1(value : DecimalSource, times : DecimalSource) : Decimal {
    return Decimal.mul(value, Decimal.pow(2, times));
}

/**
 * One of the inverses of iteratedFGH1: given iteratedFGH1(base, x) = value and knowing what the base and value are, finds x.
 * Equivalent to the base-2 logarithm of (value / base).
 * @param value ( Decimal ) The answer given by iteratedFGH1 when called on the result this inverse outputs.
 * @param base ( Decimal ) The base that iteratedFGH1 is called on with the result this inverse outputs to return the given value.
 */
export function iteratedFGH1log(value : DecimalSource, base : DecimalSource) : Decimal {
    return Decimal.log2(Decimal.div(value, base));
}

/**
 * f2(n) in the Fast-Growing Hierarchy. f2(n) = f1(f1(f1(f1...(n)))) with n f1's. f2(n) = n * 2^n.
 * @param value ( Decimal ) The input to f2.
 */
export function FGH2(value : DecimalSource) : Decimal {
    let valueD = toDecimal(value);
    if (valueD.eq(-Infinity)) return new Decimal(0);
    if (valueD.isNan()) return new Decimal(NaN);
    return Decimal.mul(value, Decimal.pow(2, value));
}

/**
 * The inverse of f2(n) in the Fast-Growing Hierarchy. Similar to the base-2 logarithm for larger numbers.
 * This is basically the Lambert W function, just with a base of 2 instead of e.
 * @param value ( Decimal ) The value that FGH2 will output when given the result of this function.
 */
export function FGH2inverse(value : DecimalSource) : Decimal {
    let valueD = toDecimal(value);
    if (valueD.lt(-1 / (Math.E*Math.LN2)) || valueD.isNan()) return new Decimal(NaN);
    if (valueD.eq(0)) return new Decimal(0);
    if (valueD.gt("ee18")) return valueD.log2();
    return Decimal.increasingInverse((value : Decimal) => FGH2(value), false, undefined, undefined, undefined, -1 / (Math.E*Math.LN2))(value);
//     let has_changed_directions_once = false;
//     let previously_rose = false;
//     let result = (valueD.gt(1)) ? valueD.log2().toNumber() : 0;
//     let step_size = Math.max(0.001, result * 0.001);
//     for (var i = 1; i < 100; ++i)
//     {
//       let new_decimal = FGH2(result);
//       let currently_rose = new_decimal.gt(valueD);
//       if (i > 1)
//       {
//         if (previously_rose != currently_rose)
//         {
//           has_changed_directions_once = true;
//         }
//       }
//       previously_rose = currently_rose;
//       if (has_changed_directions_once)
//       {
//         step_size /= 2;
//       }
//       else
//       {
//         step_size *= 2;
//       }
//       step_size = Math.abs(step_size) * (currently_rose ? -1 : 1);
//       result += step_size;
//       if (step_size === 0) { break; }
//     }
//     return Decimal.fromNumber(result);
}

/**
 * Applies FGH2 to 'value' 'times' times. Similar in growth rate to base 2 iteratedexp.
 * @param value ( Decimal ) The value to repeatedly apply FGH2 to.
 * @param times ( number ) The amount of times FGH2 is applied to value.
 */
export function iteratedFGH2(value : DecimalSource, times : number) : Decimal {
    let valueD = toDecimal(value);
    if (valueD.eq(0) || times == 0) return valueD;
    if (valueD.gt(0) && valueD.lt(0.01) && times > 0) {
        let coveredDistance = iteratedFGH2log(valueD, 1).toNumber();
        return iteratedFGH2(1, coveredDistance + times);
    }
    if (valueD.eq(Infinity)) return new Decimal(Infinity);
    if (valueD.isNan()) return new Decimal(NaN);
    let wholetimes = Math.floor(times);
    let fractimes = times - wholetimes;
    if (fractimes != 0) {
        /* I really want the property of "f2^[n](x) = f2^[n - 1](f2(x))" to always hold: for example, regardless of what n is,
        f2^n(2) = f2^[n - 1](8). Therefore, rather than a straightforward linear approximation,
        I'm using a base of 1 as the base case and going from there. */
        if (valueD.eq(1)) valueD = Decimal.pow(2, fractimes);
        else return iteratedFGH2(1, iteratedFGH2log(valueD, 1).plus(times).toNumber());
        // valueD = valueD.mul(Decimal.pow(2, fractimes))
    }
    if (wholetimes < 0) {
        if (valueD.lt(0)) {
            // Starts decreasing, then goes NaN. I'm not bothering with this one, as it serves no use for Eternal Notations.
            return new Decimal(NaN);
        }
        else {
            if (times == Infinity) return new Decimal(0);
            if (valueD.gt("eee20")) {
                let safeIterations = Decimal.slog(valueD, 2, true).sub(Decimal.slog("eee20", 2, true)).floor().min(Math.abs(wholetimes)).toNumber();
                valueD = Decimal.iteratedlog(valueD, 2, safeIterations, true);
                wholetimes += safeIterations;
            }
            // Approaches 0 at a reciprocal rate, but offset by a factor of ln(2): for example, it takes 1,000/ln(2) iterations to go from 1 to 0.001
            while (wholetimes < 0) {
                valueD = FGH2inverse(valueD);
                wholetimes++;
                if (!valueD.isFinite) return new Decimal(valueD);
                if (valueD.lt(0.01)) {
                    let totaliterations = valueD.recip().mul(Math.LOG2E).sub(wholetimes);
                    return totaliterations.mul(Math.LN2).recip();
                }
            }
        }
    }
    else {
        if (valueD.lt(0)) {
            // Approaches 0 at a reciprocal rate, but offset by a factor of ln(2): for example, it takes 1,000/ln(2) iterations to go from -1 to -0.001
            if (times == Infinity) return new Decimal(0);
            while (wholetimes > 0) {
                valueD = FGH2(valueD);
                wholetimes--;
                if (valueD.gt(-0.01)) {
                    let totaliterations = valueD.recip().abs().mul(Math.LOG2E).plus(wholetimes);
                    return totaliterations.mul(Math.LN2).recip().neg();
                }
            }
        }
        else {
            // Tetrational growth
            if (times == Infinity) return new Decimal(Infinity);
            while (wholetimes > 0) {
                valueD = FGH2(valueD);
                wholetimes--;
                if (valueD.gt("1e20")) return Decimal.iteratedexp(2, wholetimes, valueD, true);
            }
        }
    }
    return valueD;
}

/**
 * One of the inverses of iteratedFGH2: given iteratedFGH2(base, x) = value and knowing what the base and value are, finds x.
 * Similar to base 2 slog.
 * @param value ( Decimal ) The answer given by iteratedFGH2 when called on the result this inverse outputs.
 * @param base ( Decimal ) The base that iteratedFGH2 is called on with the result this inverse outputs to return the given value.
 */
export function iteratedFGH2log(value : DecimalSource, base : DecimalSource) : Decimal {
    let valueD = toDecimal(value);
    let baseD = toDecimal(base);
    if (valueD.lt(0) || baseD.lte(0) || !baseD.isFinite()) return new Decimal(NaN);
    if (valueD.eq(0)) return new Decimal(-Infinity);
    if (valueD.lt(1e-20)) return valueD.recip().neg().mul(Math.LOG2E);
    if (valueD.eq(Infinity)) return new Decimal(Infinity);
    if (valueD.isNan()) return new Decimal(NaN);
    if (baseD.neq(1)) return iteratedFGH2log(valueD, 1).sub(iteratedFGH2log(baseD, 1));
    // For some reason calling Decimal.increasingInverse here is faster than just running the loop
    if (valueD.gte(baseD)) return Decimal.increasingInverse((value : Decimal) => iteratedFGH2(base, value.toNumber()))(valueD);
    let has_changed_directions_once = false;
    let previously_rose = false;
    let result = (valueD.gte(1)) ? valueD.slog(2, undefined, true).sub(baseD.slog(2, undefined, true)).toNumber() : valueD.recip().neg().mul(Math.LOG2E).toNumber();
    let step_size = Math.abs(Math.max(0.001, result * 0.001));
    for (var i = 1; i < 100; ++i)
    {
      let new_decimal = iteratedFGH2(base, result);
      let currently_rose = new_decimal.gt(valueD);
      if (i > 1)
      {
        if (previously_rose != currently_rose)
        {
          has_changed_directions_once = true;
        }
      }
      previously_rose = currently_rose;
      if (has_changed_directions_once)
      {
        step_size /= 2;
      }
      else
      {
        step_size *= 2;
      }
      step_size = Math.abs(step_size) * (currently_rose ? -1 : 1);
      result += step_size;
      if (result + step_size == result) { break; }
    }
    return Decimal.fromNumber(result);
}

/**
 * f3(n) in the Fast-Growing Hierarchy. f3(n) = f2(f2(f2(f2...(n)))) with n f2's. Grows tetrationally.
 * @param value ( Decimal ) The input to f3.
 */
export function FGH3(value : DecimalSource) : Decimal {
    let valueD = toDecimal(value);
    if (valueD.lt(0) || valueD.isNan()) return new Decimal(NaN);
    if (valueD.lt(1e-17)) return valueD;
    if (valueD.eq(Infinity)) return new Decimal(Infinity);
    return iteratedFGH2(valueD, valueD.toNumber());
}

/**
 * The inverse of f3(n) in the Fast-Growing Hierarchy. Similar to super-logarithm.
 * @param value ( Decimal ) The value that FGH3 will output when given the result of this function.
 */
export function FGH3inverse(value : DecimalSource) : Decimal {
    let valueD = toDecimal(value);
    if (valueD.lt(0) || valueD.isNan()) return new Decimal(NaN);
    if (valueD.lt(1e-17)) return valueD;
    if (valueD.eq(Infinity)) return new Decimal(Infinity);
    return Decimal.increasingInverse((value : Decimal) => FGH3(value))(valueD);
    // let has_changed_directions_once = false;
    // let previously_rose = false;
    // let result = (valueD.gte(2)) ? valueD.slog(2, undefined, true).toNumber() : valueD.toNumber();
    // let step_size = Math.abs(Math.max(0.001, result * 0.001));
    // for (var i = 1; i < 100; ++i)
    // {
    //   let new_decimal = FGH3(result);
    //   let currently_rose = new_decimal.gt(valueD);
    //   if (i > 1)
    //   {
    //     if (previously_rose != currently_rose)
    //     {
    //       has_changed_directions_once = true;
    //     }
    //   }
    //   previously_rose = currently_rose;
    //   if (has_changed_directions_once)
    //   {
    //     step_size /= 2;
    //   }
    //   else
    //   {
    //     step_size *= 2;
    //   }
    //   step_size = Math.abs(step_size) * (currently_rose ? -1 : 1);
    //   result += step_size;
    //   if (result + step_size == result) { break; }
    // }
    // return Decimal.fromNumber(result);
}

/**
 * Applies FGH3 to 'value' 'times' times. Grows pentationally with respect to 'times'.
 * @param value ( Decimal ) The value to repeatedly apply FGH3 to.
 * @param times ( number ) The amount of times FGH3 is applied to value.
 */
export function iteratedFGH3(value : DecimalSource, times : number) : Decimal {
    let valueD = toDecimal(value);
    if (valueD.eq(0) || times == 0) return valueD;
    if (valueD.eq(Infinity)) return new Decimal(Infinity);
    if (valueD.isNan() || Number.isNaN(times)) return new Decimal(NaN);
    let wholetimes = Math.floor(times);
    let fractimes = times - wholetimes;
    if (fractimes != 0) {
        if (valueD.eq(1)) valueD = Decimal.pow(2, fractimes);
        else return iteratedFGH3(1, iteratedFGH3log(valueD, 1).plus(times).toNumber());
        // let iteration1 = Decimal.slog(FGH3(valueD), 2, true).toNumber();
        // let iteration0 = Decimal.slog(valueD, 2, true).toNumber();
        // valueD = Decimal.tetrate(2, iteration0 * (1 - fractimes) + iteration1 * fractimes, 1, true);
    }
    if (wholetimes < 0) {
        let oldValue = Decimal.dZero;
        for (let i = 0; i < Math.abs(wholetimes); i++) {
            oldValue = valueD;
            valueD = FGH3inverse(valueD);
            if (valueD.eq(oldValue) || !valueD.isFinite()) return valueD;
        }
    }
    else {
        let oldValue = Decimal.dZero;
        for (let i = 0; i < wholetimes; i++) {
            oldValue = valueD;
            valueD = FGH3(valueD);
            if (valueD.eq(oldValue) || !valueD.isFinite()) return valueD;
        }
    }
    return valueD;
}

/**
 * One of the inverses of iteratedFGH3: given iteratedFGH3(base, x) = value and knowing what the base and value are, finds x.
 * Similar to penta_log.
 * @param value ( Decimal ) The answer given by iteratedFGH3 when called on the result this inverse outputs.
 * @param base ( Decimal ) The base that iteratedFGH3 is called on with the result this inverse outputs to return the given value.
 */
export function iteratedFGH3log(value : DecimalSource, base : DecimalSource) : Decimal {
    let valueD = toDecimal(value);
    let baseD = toDecimal(base);
    if (valueD.lt(0) || baseD.lte(0)) return new Decimal(NaN);
    if (valueD.eq(0)) return new Decimal(-Infinity);
    if (valueD.eq(Infinity)) return new Decimal(Infinity);
    if (valueD.isNan() || Number.isNaN(base)) return new Decimal(NaN);
    // return Decimal.increasingInverse((value : Decimal) => iteratedFGH3(base, value.toNumber()))(valueD);
    if (baseD.neq(1)) return iteratedFGH3log(valueD, 1).sub(iteratedFGH3log(baseD, 1));
    let result = 0;
    if (valueD.gt(baseD)) {
        let currentValue = baseD;
        while (currentValue.lt(valueD)) {
            currentValue = FGH3(currentValue);
            result += 1;
        }
    }
    else {
        let currentValue = baseD;
        while (currentValue.gt(valueD)) {
            currentValue = FGH3inverse(currentValue);
            result -= 1;
        }
    }

    let has_changed_directions_once = false;
    let previously_rose = false;
    let step_size = 1;
    for (var i = 1; i < 100; ++i)
    {
      let new_decimal = iteratedFGH3(base, result);
      let currently_rose = new_decimal.gt(valueD);
      if (i > 1)
      {
        if (previously_rose != currently_rose)
        {
          has_changed_directions_once = true;
        }
      }
      previously_rose = currently_rose;
      if (has_changed_directions_once)
      {
        step_size /= 2;
      }
      else
      {
        step_size *= 2;
      }
      step_size = Math.abs(step_size) * (currently_rose ? -1 : 1);
      result += step_size;
      if (result + step_size == result) { break; }
    }
    return Decimal.fromNumber(result);
}

// /**
//  * f4(n) in the Fast-Growing Hierarchy. f4(n) = f3(f3(f3(f3...(n)))) with n f3's. Grows pentationally.
//  * @param value ( Decimal ) The input to f4.
//  */
// export function FGH4(value : DecimalSource) : Decimal {
//     let valueD = toDecimal(value);
//     if (valueD.lt(0) || valueD.isNan()) return new Decimal(NaN);
//     if (valueD.eq(Infinity)) return new Decimal(Infinity);
//     return iteratedFGH3(valueD, valueD.toNumber());
// }

// /**
//  * The inverse of f4(n) in the Fast-Growing Hierarchy. Similar to penta-logarithm.
//  * @param value ( Decimal ) The value that FGH4 will output when given the result of this function.
//  */
// export function FGH4inverse(value : DecimalSource) : Decimal {
//     let valueD = toDecimal(value);
//     if (valueD.lt(0) || valueD.isNan()) return new Decimal(NaN);
//     if (valueD.eq(Infinity)) return new Decimal(Infinity);
//     // return Decimal.increasingInverse((value : Decimal) => FGH4(value))(valueD);
//     let has_changed_directions_once = false;
//     let previously_rose = false;
//     let result = 0;
//     let step_size = 0.001;
//     for (var i = 1; i < 100; ++i)
//     {
//       let new_decimal = FGH4(result);
//       let currently_rose = new_decimal.gt(valueD);
//       if (i > 1)
//       {
//         if (previously_rose != currently_rose)
//         {
//           has_changed_directions_once = true;
//         }
//       }
//       previously_rose = currently_rose;
//       if (has_changed_directions_once)
//       {
//         step_size /= 2;
//       }
//       else
//       {
//         step_size *= 2;
//       }
//       step_size = Math.abs(step_size) * (currently_rose ? -1 : 1);
//       result += step_size;
//       if (result + step_size == result) { break; }
//     }
//     return Decimal.fromNumber(result);
// }

    /**
     * A notation that abbreviates numbers using the Fast-Growing Hierarchy, a simple system of functions: f0(n) = n + 1, f1(n) is f0(f0(f0(f0...(n)))) with n f0's,
     * f2(n) is f1(f1(f1(f1...(n)))) with n f1's, and so on, with each function being a repeated version of the previous one.
     * The Fast-Growing Hierarchy functions have a similar growth rate to the hyperoperators: f1 multiplies, f2 is exponential, f3 is tetrational, f4 is pentational, and so on.
     * This notation only goes up to f3.
     * @param maximums ( Decimal[] ) If the number given is above maximums[0], another iteration of f0 is applied. Likewise, going above maximums[1] causes an iteration of f1 to be applied, going above maximums[2] causes an iteration of f2 to be applied, and so on.
     * Later functions are applied before earlier ones. Default is [1, 4, 32, ee41373247578.35493], which are the values that cause the argument to stay below 1 and the amount of iterations of each function to stay below 4.
     * If less than 4 entries are provided, the unfilled entries are set to Infinity, i.e. those later operators don't show up.
     * @param functionChars ( [string, string][] ) The strings used to show each application of each function. functionChars[n] corresponds to f[n]. For each entry, functionChars[n][0] goes before the argument,
     * functionChars[n][1] goes after. Default is [["f0(", ")"], ["f1(", ")"], ["f2(", ")"], ["f3(", ")"]]. If less than 4 entries are provided, the unfilled entries go back to their default values.
     * @param max_in_a_row ( number[] ) If the amount of iterations of f0 is above max_in_a_row[0], the f0's are concatenated into an (f0^n) expression. Likewise for the rest of the functions and their corresponding entries here.
     * Default is [4, 4, 4, 4]. If less than 4 entries are provided, the unfilled entries are set to the same value as the last filled one.
     * @param iterationChars ( [string, string, string][] ) The strings used when the amount of iterations is concatenated. In each entry, iterationChars[n][0] goes before the amount of iterations, iterationChars[n][1] goes after the amount of iterations,
     * and iterationChars[n][2] goes on the opposite side of the argument from the other two. Default is [["(f0^", ")", ""], ["(f1^", ")", ""], ["(f2^", ")", ""], ["(f3^", ")", ""]].
     * If less than 4 entries are provided, the unfilled entries go back to their default values.
     * @param iterationAfter ( boolean[] ) If iterationAfter[n] is true, then the amount of iterations of that function goes after the argument instead of before. Default is [false, false, false, false].
     * If less than 4 entries are provided, the unfilled entries are set to false.
     * @param edgeChars ( [string, string, boolean] ) If any of the functions are applied to the value at least once, then edgeChars[0] goes on the left end of the whole expression, edgeChars[1] goes on the right end.
     * If edgeChars[2] is true, then the other two edgeChars appear even if no other functions are visible. Default is ["", "", false].
     * @param argumentChars ( [string, string, boolean] ) If any of the functions are applied to the value at least once, then argumentChars[0] goes right before the argument, edgeChars[1] goes right after.
     * If argumentChars[2] is true, then the other two argumentChars appear even if no other functions are visible. Default is ["", "", false].
     * @param rounding ( DecimalSource | ((value : Decimal) => Decimal) ) The argument is rounded to the nearest multiple of this value. If this parameter is a function, then the argument is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0.
     * @param delimiterPermutation ( number ) The order that the functions are shown in when multiple are present (they're always applied from greatest to least; this parameter is only a visual change). The default is 23, which corresponds to [f0, f1, f2, f3]. Each value from 0 to 23 represents a different ordering.
     * @param engineerings ( Decimal | Decimal[][] ) Either a DecimalSource or an array of arrays of DecimalSources; default is 1. This parameter controls the allowed amount of iterations for each function: for example, if engineerings[0] is [3], then the amount of f0 iterations will always be a multiple of 3. If this is an array, then multiples of those values are added from greatest to least to get the allowed values: for example, if engineerings[1] is [5, 2], then the permitted amounts of f0 iterations are 2, 4, 5, 7, 9, 10, 12, 14... and so on, i.e. multiples of 5 plus a multiple of 2 less than 5 (which may be 0).
     * If engineerings is a single value, then every argument is given that single value as its engineerings entry. If less than 4 entries are provided, then all unfilled entries will be set equal to the last entry that was given.
     * @param innerNotation ( Notation ) The notation that the argument is itself written in. DefaultNotation is the default.
     * @param iterationInnerNotations ( Notation | Notation[] ) iterationInnerNotations[0] is the notation that the amount of iterations of f0 is written in, and likewise for the rest of the functions.
     * If only a single notation is provided, all 4 entries are set to that notation. If less than 4 entries are provided, the unfilled ones are set to be the same as the last given one. Is the same as innerNotation by default.
     * @param functionShown ( ((value : Decimal) => boolean)[] ) functionShown[0] controls when the f0 iterations are shown: the f0 iterations, whether concatenated or not, are only shown if functionShown[0](amount of f0 iterations) returns true.
     * Default is (value => value.gt(0)) for all five entries, i.e. the iterations are only shown if there's more than zero of them. If less than 4 entries are provided, the unfilled ones are set to be the same as the last given one. 
     */
export class FastGrowingHierarchyNotation extends Notation {
    private _maximums : Decimal[] = [Decimal.dOne, new Decimal(4), new Decimal(32), new Decimal("ee41373247578.35493")];
    private _functionChars : [string, string][] = [["f0(", ")"], ["f1(", ")"], ["f2(", ")"], ["f3(", ")"]];
    private _max_in_a_row : number[] = [4, 4, 4, 4];
    private _iterationChars : [string, string, string][] = [["(f0^", ")", ""], ["(f1^", ")", ""], ["(f2^", ")", ""], ["(f3^", ")", ""]];
    private _iterationAfter : boolean[] = [false];
    public edgeChars : [string, string, boolean] = ["", "", false];
    public argumentChars : [string, string, boolean] = ["", "", false];
    public rounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero;
    public delimiterPermutation : number = 23;
    private _engineerings : Decimal[][] = [[Decimal.dOne], [Decimal.dOne], [Decimal.dOne], [Decimal.dOne]];
    public innerNotation : Notation = new DefaultNotation();
    private _iterationInnerNotations : Notation[] = [this.innerNotation];
    private _functionShown : ((value : Decimal) => boolean)[] = [(value => value.gt(0))];

    constructor(
      maximums : DecimalSource[] = [Decimal.dOne, new Decimal(4), new Decimal(32), new Decimal("ee41373247578.35493")],
      functionChars : [string, string][] = [["f0(", ")"], ["f1(", ")"], ["f2(", ")"], ["f3(", ")"]],
      max_in_a_row : number | number[] = [4, 4, 4, 4],
      iterationChars : [string, string, string][] = [["(f0^", ")", ""], ["(f1^", ")", ""], ["(f2^", ")", ""], ["(f3^", ")", ""]],
      iterationAfter : boolean[] = [false],
      edgeChars : [string, string, boolean] = ["", "", false],
      argumentChars : [string, string, boolean] = ["", "", false],
      rounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero,
      delimiterPermutation : number = 23,
      engineerings : DecimalSource | DecimalSource[][] = 1,
      innerNotation : Notation = new DefaultNotation(),
      iterationInnerNotations : Notation | Notation[] = innerNotation,
      functionShown : ((value : Decimal) => boolean)[] = [(value => value.gt(0))]
    ) {
        super();
        this.maximums = maximums;
        this.functionChars = functionChars;
        this.max_in_a_row = max_in_a_row;
        this.iterationChars = iterationChars;
        this.iterationAfter = iterationAfter;
        this.edgeChars = edgeChars;
        this.argumentChars = argumentChars;
        this.rounding = rounding;
        this.delimiterPermutation = delimiterPermutation;
        this.engineerings = engineerings;
        this.innerNotation = innerNotation;
        this.iterationInnerNotations = iterationInnerNotations;
        this.functionShown = functionShown;
    }

    public name = "Fast-Growing Hierarchy Notation";

    public formatDecimal(value: Decimal): string {
      let currentValue = value;
      let roundedValues = [value, value, value, value];
      let iterations = [Decimal.dZero, Decimal.dZero, Decimal.dZero, Decimal.dZero];
      let initialRun = [true, true, true, true];
      if (value.eq(0)) initialRun = [false, false, false, false];
      while (roundedValues[3].gte(this._maximums[3]) || initialRun[3]) {
        initialRun[2] = initialRun[1] = initialRun[0] = true;
        currentValue = roundedValues[3];
        iterations[0] = Decimal.dZero;
        iterations[1] = Decimal.dZero;
        iterations[2] = Decimal.dZero;
        if (currentValue.gte(this._maximums[3])) {
          let iterations3 = currentEngineeringValue(iteratedFGH3log(currentValue, this._maximums[3]).floor().max(0), this._engineerings[3]).toNumber();
          currentValue = iteratedFGH3(currentValue, -iterations3);
          iterations[3] = iterations[3].plus(iterations3);
          while (currentValue.gte(this._maximums[3])) {
            iterations3 = nextEngineeringValue(iterations[3], this._engineerings[3]).sub(iterations[3]).toNumber();
            currentValue = iteratedFGH3(currentValue, -iterations3);
            iterations[3] = iterations[3].plus(iterations3);
          }
        }
        initialRun[3] = false;
        roundedValues[3] = roundedValues[2] = roundedValues[1] = roundedValues[0] = currentValue;
        while (roundedValues[2].gte(this._maximums[2]) || initialRun[2]) {
          initialRun[1] = initialRun[0] = true;
          currentValue = roundedValues[2];
          iterations[0] = Decimal.dZero;
          iterations[1] = Decimal.dZero;
          if (currentValue.gte(this._maximums[2])) {
            let iterations2 = currentEngineeringValue(iteratedFGH2log(currentValue, this._maximums[2]).floor().max(0), this._engineerings[2]).toNumber();
            currentValue = iteratedFGH2(currentValue, -iterations2);
            iterations[2] = iterations[2].plus(iterations2);
            while (currentValue.gte(this._maximums[2])) {
              iterations2 = nextEngineeringValue(iterations[2], this._engineerings[2]).sub(iterations[2]).toNumber();
              currentValue = iteratedFGH2(currentValue, -iterations2);
              iterations[2] = iterations[2].plus(iterations2);
            }
          }
          initialRun[2] = false;
          roundedValues[2] = roundedValues[1] = roundedValues[0] = currentValue;
          while (roundedValues[1].gte(this._maximums[1]) || initialRun[1]) {
            initialRun[0] = true;
            currentValue = roundedValues[1];
            iterations[0] = Decimal.dZero;
            if (currentValue.gte(this._maximums[1])) {
              let iterations1 = currentEngineeringValue(iteratedFGH1log(currentValue, this._maximums[1]).floor().max(0), this._engineerings[1]);
              currentValue = iteratedFGH1(currentValue, -iterations1);
              iterations[1] = iterations[1].plus(iterations1);
              while (currentValue.gte(this._maximums[1])) {
                iterations1 = nextEngineeringValue(iterations[1], this._engineerings[1]).sub(iterations[1]);
                currentValue = iteratedFGH1(currentValue, -iterations1);
                iterations[1] = iterations[1].plus(iterations1);
              }
            }
            initialRun[1] = false;
            roundedValues[1] = roundedValues[0] = currentValue;
            while (roundedValues[0].gte(this._maximums[0]) || initialRun[0]) {
              currentValue = roundedValues[0];
              let roundedValue = round(currentValue, this.rounding);
              if (roundedValue.gte(this._maximums[0])) {
                let iterations0 = currentEngineeringValue(roundedValue.sub(this._maximums[0]).floor().max(0), this._engineerings[0]);
                currentValue = iteratedFGH0(currentValue, -iterations0);
                roundedValue = round(currentValue, this.rounding);
                iterations[0] = iterations[0].plus(iterations0);
                while (roundedValue.gte(this._maximums[0])) {
                  iterations0 = nextEngineeringValue(iterations[0], this._engineerings[0]).sub(iterations[0]);
                  currentValue = iteratedFGH0(currentValue, -iterations0);
                  roundedValue = round(currentValue, this.rounding);
                  iterations[0] = iterations[0].plus(iterations0);
                }
              }
              initialRun[0] = false;
              roundedValues[0] = roundedValue;
            }
            roundedValues[1] = this.FGHEvaluate(roundedValues[0], [iterations[0]]);
          }
          roundedValues[2] = this.FGHEvaluate(roundedValues[1], [Decimal.dZero, iterations[1]]);
        }
        roundedValues[3] = this.FGHEvaluate(roundedValues[2], [Decimal.dZero, Decimal.dZero, iterations[2]]);
      }

      let anyIterations = false;
      for (let f = 0; f < 4; f++) if (this._functionShown[f](iterations[f])) { anyIterations = true; break; }
      let orderArray = [0];
      orderArray.splice(this.delimiterPermutation % 2, 0, 1);
      orderArray.splice(Math.floor(this.delimiterPermutation / 2) % 3, 0, 2);
      orderArray.splice(Math.floor(this.delimiterPermutation / 6) % 4, 0, 3);
      let result = this.innerNotation.format(roundedValues[0]);
      if (anyIterations || this.argumentChars[2]) result = this.argumentChars[0] + result + this.argumentChars[1];
      for (let o = 0; o < 4; o++) {
        let f = orderArray[o];
        if (this._functionShown[f](iterations[f])) {
          let currentiterations = iterations[f];
          if (currentiterations.gt(0) && currentiterations.lte(this._max_in_a_row[f]) && currentiterations.mod(1).eq(0)) {
            for (let i = 0; i < currentiterations.toNumber(); i++) {
              result = this._functionChars[f][0] + result + this._functionChars[f][1];
            }
          }
          else if (this._iterationAfter[f]) {
            result = this._iterationChars[f][2] + result + this._iterationChars[f][0] + this._iterationInnerNotations[f].format(iterations[f]) + this._iterationChars[f][1];
          }
          else result = this._iterationChars[f][0] + this._iterationInnerNotations[f].format(iterations[f]) + this._iterationChars[f][1] + result + this._iterationChars[f][2];
        }
      }
      if (anyIterations || this.edgeChars[2]) result = this.edgeChars[0] + result + this.edgeChars[1];
      return result;
    }

    private FGHEvaluate(argument : Decimal, iterationArray : Decimal[]) : Decimal {
      let result = argument;
      if (iterationArray.length > 0) result = iteratedFGH0(result, iterationArray[0]);
      if (iterationArray.length > 1) result = iteratedFGH1(result, iterationArray[1]);
      if (iterationArray.length > 2) result = iteratedFGH2(result, iterationArray[2].toNumber());
      if (iterationArray.length > 3) result = iteratedFGH3(result, iterationArray[3].toNumber());
      return result;
    }

    public get maximums() {
      return this._maximums;
    }

    public set maximums(maximums : DecimalSource[]) {
      let maximumsD = maximums.map(toDecimal);
      while (maximumsD.length < 4) maximumsD.push(Decimal.dInf);
      this._maximums = maximumsD;
    }

    public get functionChars() {
      return this._functionChars;
    }

    public set functionChars(functionChars : [string, string][]) {
      let result : [string, string][] = [["f0(", ")"], ["f1(", ")"], ["f2(", ")"], ["f3(", ")"]];
      for (let f = 0; f < Math.min(4, functionChars.length); f++) result[f] = functionChars[f];
      this._functionChars = result;
    }

    public get max_in_a_row() {
      return this._max_in_a_row;
    }

    public set max_in_a_row(max_in_a_row : number | number[]) {
      if (!Array.isArray(max_in_a_row)) max_in_a_row = [max_in_a_row];
      if (max_in_a_row.length == 0) max_in_a_row.push(4);
      while (max_in_a_row.length < 4) max_in_a_row.push(max_in_a_row[max_in_a_row.length - 1]);
      this._max_in_a_row = max_in_a_row;
    }

    public get iterationChars() {
      return this._iterationChars;
    }

    public set iterationChars(iterationChars : [string, string, string][]) {
      let result : [string, string, string][] = [["(f0^", ")", ""], ["(f1^", ")", ""], ["(f2^", ")", ""], ["(f3^", ")", ""]];
      for (let f = 0; f < Math.min(4, iterationChars.length); f++) result[f] = iterationChars[f];
      this._iterationChars = result;
    }

    public get iterationAfter() {
      return this._iterationAfter;
    }

    public set iterationAfter(iterationAfter : boolean[]) {
      while (iterationAfter.length < 4) iterationAfter.push(false);
      this._iterationAfter = iterationAfter;
    }

    public get engineerings() {
      return this._engineerings;
    }

    public set engineerings(input : DecimalSource | DecimalSource[][]) {
      if (!(Array.isArray(input))) input = [[input]];
      let result : Decimal[][] = [[Decimal.dOne]];
      for (let i = 0; i < input.length; i++) {
          let entry = input[i];
          if (entry.length == 0) result[i] = [Decimal.dOne];
          else result[i] = entry.map(toDecimal);
      }
      while (result.length < 4) result.push(result[result.length - 1]);
      this._engineerings = result;
    }

    public get iterationInnerNotations() {
      return this._iterationInnerNotations;
    }

    public set iterationInnerNotations(iterationInnerNotations : Notation | Notation[]) {
      if (!Array.isArray(iterationInnerNotations)) iterationInnerNotations = [iterationInnerNotations];
      if (iterationInnerNotations.length == 0) iterationInnerNotations.push(new DefaultNotation());
      while (iterationInnerNotations.length < 4) iterationInnerNotations.push(iterationInnerNotations[iterationInnerNotations.length - 1]);
      this._iterationInnerNotations = iterationInnerNotations;
    }

    public get functionShown() {
      return this._functionShown;
    }

    public set functionShown(functionShown : ((value : Decimal) => boolean)[]) {
      if (functionShown.length == 0) functionShown.push(value => value.gt(0));
      while (functionShown.length < 4) functionShown.push(functionShown[functionShown.length - 1]);
      this._functionShown = functionShown;
    }

}

const FastGrowingHierarchy = recipBelow(new FastGrowingHierarchyNotation(...[,,,,,,,], 1e-4), 1).setName("Fast-Growing Hierarchy");
const HardyHierarchy = recipBelow(new FastGrowingHierarchyNotation([1, 10, 5120, "(e^9)1544.461457532905"], [["", ""], ["ω + ", ""], ["ω^2 + ", ""], ["ω^3 + ", ""]], 1, [["", "", ""], ["ω", " + ", ""], ["ω^2*", " + ", ""], ["ω^3*", " + ", ""]], [false], ["H[", "", false], ["](", ")", false], 1e-4, ...[,,,], [new DefaultNotation(), new DefaultNotation()], [value => true, value => value.gt(0)]), 1).setName("Hardy Hierarchy");

const FGHLatex = recipBelow(new FastGrowingHierarchyNotation(undefined, [["f_0(", ")"], ["f_1(", ")"], ["f_2(", ")"], ["f_3(", ")"], ["f_4(", ")"]], ...[,,,,,], 1e-4), 1).setName("Fast-Growing Hierarchy");
const HHLatex = recipBelow(new FastGrowingHierarchyNotation([1, 10, 5120, "(e^9)1544.461457532905"], undefined, -1, [["", "", ""], ["\\omega", "+", ""], ["\\omega^2", "+", ""], ["\\omega^3", "+", ""]], [false], ["H_{", "", false], ["}(", ")", false], 1e-4, ...[,,,], [new DefaultNotation(), new ConditionalNotation(true, [new PredeterminedNotation(""), value => value.lte(1)], [new DefaultNotation(), value => true])], [value => true, value => value.gt(0)]), 1).setName("Hardy Hierarchy")


    /**
     * The progression of this notation is similar to Default notation: unabbreviated, then scientific, then hyperscientific. However, this notation is not itself a default: instead, it lets you customize the process.
     * @param maxnum ( Decimal ) The point at which the notation switches to scientific. Default is 1e12.
     * @param minnum ( Decimal ) The point below 1 at which the notation switches to scientific with a negative exponent. Default is 1e-6.
     * @param max_es_in_a_row ( number ) If the scientific representation would have more e's than this, switches to F notation. Default is 5.
     * @param logBase ( Decimal ) The base of the scientific notation. Default is 10.
     * @param rounding ( DecimalSource | ((value : Decimal) => Decimal) ) The mantissa is rounded to the nearest multiple of this value. If this parameter is a function, then the mantissa is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0.
     * @param mantissaPower ( Decimal ) Normally, the mantissa in scientific notation is bounded by 1 and the base, which corresponds to the default mantissaPower of 0. If mantissaPower is 1, the bounds are base and base^2, if mantissaPower is 2 then the bounds are base^2 and base^3, and so on. For example, a number normally represented as "2.357e224" would become "23.57e223" with 1 mantissaPower and "235.7e222" with 2 mantissaPower.
     * @param hypermantissaPower ( Decimal ) Normally, the mantissa in hyperscientific notation is bounded by 1 and the base, which corresponds to the default hypermantissaPower of 0. If hypermantissaPower is 1, the bounds are base and base^^2, if hypermantissaPower is 2 then the bounds are base^^2 and base^^3, and so on. For example, a number normally represented as "2F8" would become "100F7" with 1 hypermantissaPower and "(1e100)F6" with 2 hypermantissaPower. 
     * @param engineerings ( Decimal | DecimalSource[] ) Either a DecimalSource or an array of DecimalSources; default is 1. This parameter controls the allowed exponent values: if it's three then the exponent will always be a multiple of 3, as in engineering notation. If this is an array, then multiples of those values are added from greatest to least to get the allowed values: for example, if engineerings is [5, 2], then the permitted exponent values are 2, 4, 5, 7, 9, 10, 12, 14... and so on, i.e. multiples of 5 plus a multiple of 2 less than 5 (which may be 0). Default is 1, which corresponds to regular scientific notation.
     * @param hyperengineerings ( Decimal | DecimalSource[] ) Same as engineerings, but for the hyperexponent instead.
     * @param expChars ( [[string, string], [string | boolean, string | boolean], [string, string], [string | boolean, string | boolean]] ) An array of four pairs of strings that are used as the between characters for scientific notation. In each pair, the first entry goes before the exponent, the second entry goes after the exponent. expChars[0] takes the place of the e in "1e10", expChars[1] takes the place of the first e in "e1e10", expChars[2] takes the place of the F in "1F10", and expChars[3] takes the place of the F in "F1e10". If expChars[1][0] is a boolean instead of a string: if it's false, then expChars[1][0] is set to be expChars[0][0] with the way this notation formats 1 tacked on the beginning, and if it's true than the 1 is tacked on the end instead. Likewise for expChars[1][1] (expChars[0][1] with a 1 on it), expChars[3][0] (expChars[2][0] with a 1 on it), and expChars[3][1] (expChars[2][1] with a 1 on it). Default is [["e", ""], ["e", ""], ["F", ""], ["F", ""]].
     * @param negExpChars ( null | [[string, string] | boolean, [string, string]] ) This can either be null or a pair of pairs of strings (in which the first pair of strings may be a boolean instead). Ignore this parameter if it's null, which is the default. If it's a pair of pairs of strings, then the first pair is used like expChars[0] but for negative exponents (so if it's ["d", ""], then 2e-4 would be 2d4 instead), and the second pair is used on small numbers whose reciprocals are large enough to need expChars[1], in which case the second pair indicates that a reciprocal has been taken. If negExpChars[0] is a boolean instead, then if it's true the notation goes directly to the reciprocal behavior for all inputs less than 1, while if it's false then single-iteration inputs don't use negExpChars but multi-iteration ones still use reciprocal behavior.
     * @param expBefore ( boolean ) If this parameter is true, the exponent comes before the mantissa instead of after. Default is false.
     * @param hyperexpBefore ( boolean ) If this parameter is true, the hyperexponent comes before the mantissa instead of after. Default is false.
     * @param expMult ( Decimal ) Each exponentiation in the process is multiplied by this value. Default is 1.
     * @param hyperexpMult ( Decimal ) Each hyperexponent in the process is multiplied by this value. Default is 1.
     * @param mantissaInnerNotation ( Notation ) The notation that the mantissa is itself notated with. DefaultNotation is the default.
     * @param exponentInnerNotation ( Notation ) The notation that the exponent is itself notated with. Is the same as mantissaInnerNotation by default.
     * @param hyperexpFormat ( [boolean, boolean] ) A pair of booleans that determines whether the numbers in a hyperscientific expression are notated using ExpandedDefaultNotation itself rather than the innerNotations. The first entry is for the mantissa, the second is for the hyperexponent. This only applies to "xFy" expressions; "Fx" expressions (where x is over the maxnum) always formats x in ExpandedDefaultNotation itself. Default is [false, false].
     */
export class ExpandedDefaultNotation extends Notation {
    private _maxnum : Decimal = new Decimal(1e12);
    private _minnum : Decimal = new Decimal(1e-6);
    public max_es_in_a_row : number = 5;
    private _logBase : Decimal = Decimal.dTen;
    public rounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero;
    public mantissaPower : Decimal = Decimal.dZero;
    private _hypermantissaPower : Decimal = Decimal.dZero;
    private _engineerings : Decimal[] = [Decimal.dOne];
    private _hyperengineerings : Decimal[] = [Decimal.dOne];
    private _expChars : [string, string][] = [["e", ""], ["e", ""], ["F", ""], ["F", ""]];
    public negExpChars : null | [[string, string] | boolean, [string, string]] = null;
    public expBefore : boolean = false;
    public hyperexpBefore : boolean = false;
    private _expMult : Decimal = Decimal.dOne;
    private _hyperexpMult : Decimal = Decimal.dOne;
    public mantissaInnerNotation : Notation = new DefaultNotation();
    public exponentInnerNotation : Notation = this.mantissaInnerNotation;
    public hyperexpFormat : [boolean, boolean] = [false, false];
    private unconvertedExpChars : [[string, string], [string | boolean, string | boolean], [string, string], [string | boolean, string | boolean]];

    constructor(
        maxnum : DecimalSource = new Decimal(1e12),
        minnum : DecimalSource = new Decimal(1e-6),
        max_es_in_a_row : number = 5,
        logBase : DecimalSource = Decimal.dTen,
        rounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero,
        mantissaPower : DecimalSource = Decimal.dZero,
        hypermantissaPower : DecimalSource = Decimal.dZero,
        engineerings : DecimalSource[] = [Decimal.dOne],
        hyperengineerings : DecimalSource[] = [Decimal.dOne],
        expChars : [[string, string], [string | boolean, string | boolean], [string, string], [string | boolean, string | boolean]] = [["e", ""], ["e", ""], ["F", ""], ["F", ""]],
        negExpChars : null | [[string, string] | boolean, [string, string]] = null,
        expBefore : boolean = false,
        hyperexpBefore : boolean = false,
        expMult : DecimalSource = Decimal.dOne,
        hyperexpMult : DecimalSource = Decimal.dOne,
        mantissaInnerNotation : Notation = new DefaultNotation(),
        exponentInnerNotation : Notation = mantissaInnerNotation,
        hyperexpFormat : [boolean, boolean] = [false, false]
    ) {
        super();
        this._maxnum = toDecimal(maxnum);
        this.minnum = minnum;
        this.max_es_in_a_row = max_es_in_a_row;
        this._logBase = toDecimal(logBase);
        this.rounding = rounding;
        this.mantissaPower = toDecimal(mantissaPower);
        this.hypermantissaPower = hypermantissaPower;
        this.engineerings = engineerings;
        this.hyperengineerings = hyperengineerings;
        this.expBefore = expBefore;
        this.hyperexpBefore = hyperexpBefore;
        this.expMult = expMult;
        this.hyperexpMult = hyperexpMult;
        this.mantissaInnerNotation = mantissaInnerNotation;
        this.exponentInnerNotation = exponentInnerNotation;
        this.hyperexpFormat = hyperexpFormat;
        this.unconvertedExpChars = expChars;
        this.expChars = expChars;
        this.negExpChars = negExpChars;
    }

    public name = "Expanded Default Notation";

    public formatDecimal(value: Decimal): string {
        if (value.eq(0) || (value.abs().gte(this._minnum) && value.abs().lt(this._maxnum))) return this.mantissaInnerNotation.format(value);
        let negative = false;
        if (value.lt(0)) {
            negative = true;
            value = value.neg();
        }
        let result = "";
        if (multabs(value.abs()).lt(iteratedexpmult(this._logBase, this._maxnum, 1, this._expMult))) {
            let [mantissa, exponent] = scientifify(value, this._logBase, this.rounding, this.mantissaPower, this._engineerings, this._expMult);
            let beforeChar = this._expChars[0][0];
            let afterChar = this._expChars[0][1];
            if (exponent.lt(0) && this.negExpChars !== null && this.negExpChars[0] !== false) {
              if (this.negExpChars[0] === true) return this.negExpChars[1][0] + this.format(value.recip()) + this.negExpChars[1][1];
              beforeChar = this.negExpChars[0][0];
              afterChar = this.negExpChars[0][1];
              exponent = exponent.neg();
            }
            let mantissaStr = this.mantissaInnerNotation.format(mantissa);
            let exponentStr = this.exponentInnerNotation.format(exponent);
            if (this.expBefore) result = beforeChar + exponentStr + afterChar + mantissaStr;
            else result = mantissaStr + beforeChar + exponentStr + afterChar;
          }
          else {
            let negExp = false;
            if (value.lt(1)) {
              if (this.negExpChars != null) return this.negExpChars[1][0] + this.format(value.recip()) + this.negExpChars[1][1];
              negExp = true;
              let [m, e] = scientifify(value, 10, this.rounding);
              value = e.neg().pow10().mul(m);
            }
            if (value.lt(iteratedexpmult(this._logBase, this._maxnum, this.max_es_in_a_row + 1, this._expMult))) {
                let added_es = 0;
                while (value.gte(iteratedexpmult(this._logBase, this._maxnum, 1, this._expMult))) {
                  added_es++;
                  value = iteratedmultlog(value, this._logBase, 1, this._expMult);
                }
                if (negExp) value = value.neg();
                result = this.format(value);
                for (let e = 0; e < added_es; e++) result = this._expChars[1][0] + result + this._expChars[1][1];
              }
              else if (value.lt(iteratedexpmult(this._logBase, 1, this._maxnum.div(this._hyperexpMult).toNumber(), this._expMult))) {
                let [mantissa, exponent] = hyperscientifify(value, this._logBase, this.rounding, this._hypermantissaPower, this._hyperengineerings, this._expMult, this._hyperexpMult);
                if (negExp) exponent = exponent.neg();
                let baseStr = (this.hyperexpFormat[0]) ? this.format(mantissa) : this.mantissaInnerNotation.format(mantissa);
                let exponentStr = (this.hyperexpFormat[1]) ? this.format(exponent) : this.exponentInnerNotation.format(exponent);
                if (this.hyperexpBefore) result = this._expChars[2][0] + exponentStr + this._expChars[2][1] + baseStr;
                else result = baseStr + this._expChars[2][0] + exponentStr + this._expChars[2][1];
              }
              else {
                let exponent = multslog(value, this._logBase, this._expMult).mul(this._hyperexpMult);
                if (negExp) exponent = exponent.neg();
                result = this._expChars[3][0] + this.format(exponent) + this._expChars[3][1];
              }
              if (negative) result = this.negativeString + result;
          }
          return result;
    }

    public get maxnum() {
      return this._maxnum;
    }

    public set maxnum(maxnum: DecimalSource) {
      let maxnumD = toDecimal(maxnum);
      if (maxnumD.lte(0)) throw new RangeError("Nonpositive maxnum in Expanded Default Notation");
      if (this._minnum.gte(maxnumD)) throw new RangeError("Maxnum below minnum in Expanded Default Notation");
      this._maxnum = maxnumD;
    }

    public get minnum() {
      return this._minnum;
    }

    public set minnum(minnum: DecimalSource) {
      let minnumD = toDecimal(minnum);
      if (minnumD.gte(this._maxnum)) throw new RangeError("Minnum above maxnum in Expanded Default Notation");
      this._minnum = minnumD;
    }

    public get logBase() {
      return this._logBase;
    }

    public set logBase(logBase : DecimalSource) {
      let logBaseD = toDecimal(logBase);
      if (logBaseD.pow(this._expMult.recip()).lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work for Expanded Default Notation");
      this._logBase = logBaseD;
    }

    public get hypermantissaPower() {
      return this._hypermantissaPower;
    }

    public set hypermantissaPower(hypermantissaPower : DecimalSource) {
      let hypermantissaPowerD = toDecimal(hypermantissaPower);
      if (hypermantissaPowerD.lt(-2)) throw new RangeError("hypermantissaPower below -2 in Hyperscientific Notation");
      this._hypermantissaPower = hypermantissaPowerD;
    }

    public get engineerings() {
      return this._engineerings;
    }
  
    public set engineerings(engineerings : DecimalSource | DecimalSource[]) {
      if (!Array.isArray(engineerings)) engineerings = [engineerings];
      if (engineerings.length == 0) {
        this._engineerings = [Decimal.dOne];
        return;
      }
      let engineeringsD : Decimal[] = engineerings.map(toDecimal);
      this._engineerings = engineeringsD.sort(function(a, b){
          if (a.lt(b)) return -1;
          else if (a.eq(b)) return 0;
          else return 1;
      }).reverse();
    }

    public get hyperengineerings() {
      return this._hyperengineerings;
    }
  
    public set hyperengineerings(hyperengineerings : DecimalSource | DecimalSource[]) {
      if (!Array.isArray(hyperengineerings)) hyperengineerings = [hyperengineerings];
      if (hyperengineerings.length == 0) {
        this._hyperengineerings = [Decimal.dOne];
        return;
      }
      let hyperengineeringsD : Decimal[] = hyperengineerings.map(toDecimal);
      this._hyperengineerings = hyperengineeringsD.sort(function(a, b){
          if (a.lt(b)) return -1;
          else if (a.eq(b)) return 0;
          else return 1;
      }).reverse();
    }

    public get expMult() {
      return this._expMult;
    }

    public set expMult(expMult : DecimalSource) {
      let expMultD = toDecimal(expMult);
      if (expMultD.eq(0)) throw new RangeError("expMult should not be zero");
      if (this._logBase.pow(expMultD.recip()).lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work for Expanded Default Notation");
      this._expMult = expMultD;
    }
    
    public get hyperexpMult() {
      return this._hyperexpMult;
    }

    public set hyperexpMult(hyperexpMult : DecimalSource) {
      let hyperexpMultD = toDecimal(hyperexpMult);
      if (hyperexpMultD.eq(0)) throw new RangeError("hyperexpMult should not be zero");
      this._hyperexpMult = hyperexpMultD;
    }  
  
    public get expChars() {
      return this.unconvertedExpChars;
    }
  
    public set expChars(input : [[string, string], [string | boolean, string | boolean], [string, string], [string | boolean, string | boolean]]) {
      let one = this.format(1);
      let expChars : [string, string][] = [];
      expChars.push(input[0]);
      expChars.push(["", ""]);
      if (typeof input[1][0] == "string") expChars[1][0] = input[1][0];
      else if (input[1][0] === false) expChars[1][0] = one + input[0][0];
      else if (input[1][0] === true) expChars[1][0] = input[0][0] + one;
      if (typeof input[1][1] == "string") expChars[1][1] = input[1][1];
      else if (input[1][1] === false) expChars[1][1] = one + input[0][1];
      else if (input[1][1] === true) expChars[1][1] = input[0][1] + one;
      expChars.push(input[2]);
      expChars.push(["", ""]);
      if (typeof input[3][0] == "string") expChars[3][0] = input[3][0];
      else if (input[3][0] === false) expChars[3][0] = one + input[2][0];
      else if (input[3][0] === true) expChars[3][0] = input[2][0] + one;
      if (typeof input[3][1] == "string") expChars[3][1] = input[3][1];
      else if (input[3][1] === false) expChars[3][1] = one + input[2][1];
      else if (input[3][1] === true) expChars[3][1] = input[2][1] + one;
      this._expChars = expChars;
    }

}

    /**
     * Writes numbers in the form of a polynomial-ish expression, with x having a certain value. For example, if x is 10, then 346 is written as 3x^2 + 4x + 6.
     * @param value ( Decimal ) The value of x. Default is 10.
     * @param formatExponents ( number ) If this parameter is positive, then exponents are also written as polynomials, so x^x, x^(3x + 2), x^x^4x, and so on can appear. If this parameter is negative, the exponents are only written as numbers. If this parameter is zero, the exponents are not written at all. Default is 1.
     * @param minimumTerm ( Decimal ) The lowest power of x that gets a term, which may have a non-whole coefficient to account for what would be terms below this one. Default is 0, i.e. the constant term.
     * @param fractionInverse ( boolean ) This parameter controls how negative powers of x are handled.
     * If this parameter is true, then the powers of x continue below the constant term, so if x = 10, then 1.25 is written as 1 + 2x^-1 + 5x^-2.
     * If this parameter is false, then the negative powers of x use denominators instead of negative exponents, so if x = 10, then 1.25 is written as 1 + 2/x + 5/x^2.
     * Default is true.
     * @param maxTerms ( number ) The highest amount of terms shown; terms after the first few are cut off. Default is 8.
     * @param variableStr ( string ) The string used to represent the variable. Default is "x".
     * @param maxMultiTerm ( Decimal ) Only values below this have multiple terms shown. Values above this only show a single term and a coefficient (which may be non-whole). Default is value^^3 or 3^30, whichever is larger. 
     * @param maxSingleTerm ( Decimal ) Values above this are considered too big to show on their own, so they get an x^ placed before them and are written in terms of that exponent. Default is value^^5.
     * @param maxExps ( number ) The highest amount of x^'s that can be placed before the polynomial in a row; any more than this and they're abbreviated in (x^)^n form. Default is 5.
     * @param showZeroTerms ( number ) If this parameter is negative, terms with a coefficient of zero are skipped. If this parameter is zero, then terms with a coefficient of zero are shown as long as there's some term with a nonzero coefficient later on. If this parameter is positive, terms, even those with a coefficient of zero, continue to be shown until the maximum amount of terms is hit. Default is -1.
     * @param innerNotation ( Notation ) The notation that the numbers within the expression are themselves notated with. DefaultNotation is the default.
     * @param additionSign ( string ) This string is placed between each term. Default is " + ".
     * @param subtractionSign ( string ) This string is placed between each term for negative numbers. Default is " - ".
     * @param multiplicationSign ( string ) This string is placed between the coefficient and the variable term. Default is the empty string.
     * @param divisionSign ( string ) This string is placed between the coefficient and the variable term for terms below x^0 when inverseTerms is positive. Default is "/".
     * @param multiplicationBefore ( boolean ) If this parameter is true, the coefficient is placed before the variable instead of after. Default is true.
     * @param powerStrings ( [string, string] ) A pair of strings used to denote exponents on variables: powerStrings[0] goes before the exponent, powerStrings[1] goes after the exponent. Default is ["<sup>", "</sup>"].
     * @param coefficientStrings ( [string, string] ) A pair of strings used to denote coefficients on variables: coefficientStrings[0] goes before the coefficient, coefficientStrings[1] goes after the coefficient. Default is ["", ""].
     * @param parenthesizePower ( number ) If this parameter is negative, parentheses are not placed around the exponent. If this parameter is zero, parentheses are placed around the exponent if it contains variables, but not if it's just a number. If this parameter is positive, parentheses are always placed around the exponent. Default is -1.
     * @param unitCoefficientShown ( [boolean, boolean] ) If unitCoefficientShown[0] is true, the coefficient is shown even if it's 1. unitCoefficientShown[1] does the same thing, but for when divisionSign is used instead of for multiplicationSign. Default is [false, true].
     * @param unitPowerShown ( boolean ) Normally, the exponent on x is not shown if it's 1, but it's shown even in that case if unitPowerShown is true. Default is false.
     * @param expStrings ( [[string, string], [string, string], [string, string], [string, string]] ) An array of four pairs of strings that indicate exponentiation on large numbers. In each pair, expStrings[n][0] goes before the value in question, expStrings[n][1] goes after.
     * expStrings[0] replaces the x^() that directly surrounds the number when it's large enough to get x^'s before it. expStrings[1] concerns the rest of the x^'s - expStrings[0] is only for the innermost x^, expStrings[1] is for the rest.
     * expStrings[2] replaces the (x^)^n that indicates repeated exponentiation when that n is just a number, expStrings[3] does the same thing but for when that n contains variables.
     * Default is [["x^(", ")"], ["x^", ""], ["(x^)^", " "], ["(x^)^(", ") "]], where that x is replaced with whatever variableStr is.
     * @param superexpBefore ( boolean ) If this value is true, the repeated exponentiation string stuff comes before the polynomial instead of afterwards. Default is true.
     * @param frontSubtractionSign ( string ) This string is placed at the beginning of the expression for negative numbers. Is the same as subtractionSign by default.
     * @param constantStrings ( [string, string] ) A pair of strings used to denote the constant term: coefficientStrings[0] goes before the constant term, coefficientStrings[1] goes after the constant term. Default is ["", ""].
     * @param precision ( Decimal ) The expression will stop once it gets to within this level of precision compared to the original value, to ensure that meaningless terms (like an x^2 term in an expression with an x^2,000) from floating point imprecision aren't included. Default is 1.2e-16.
     * @param minimumTermRounding ( DecimalSource | ((value : Decimal) => Decimal) ) If the expression includes the minimum term, the minimum term is rounded to the nearest multiple of this value. If this parameter is a function, then the minimum term is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0.
     */
export class PolynomialNotation extends Notation {
    private _value : Decimal = Decimal.dTen;
    public formatExponents : number = 1;
    public minimumTerm : Decimal = Decimal.dZero;
    public fractionInverse : boolean = true;
    private _maxTerms : number = 8;
    public variableStr : string = "x";
    public maxMultiTerm : Decimal = this._value.tetrate(3).max(3**30);
    public maxSingleTerm : Decimal = this._value.tetrate(5);
    public maxExps : number = 5;
    public showZeroTerms : number = -1;
    public innerNotation : Notation = new DefaultNotation();
    public additionSign : string = " + ";
    public subtractionSign : string = " - ";
    public multiplicationSign : string = "";
    public divisionSign : string = "/";
    public multiplicationBefore : boolean = true;
    public powerStrings : [string, string] = ["<sup>", "</sup>"];
    public coefficientStrings : [string, string] = ["", ""]
    public parenthesizePower : number = -1;
    public unitCoefficientShown : [boolean, boolean] = [false, true];
    public unitPowerShown : boolean = false;
    public expStrings : [[string, string], [string, string], [string, string], [string, string]];
    public superexpBefore : boolean = true;
    public frontSubtractionSign : string = this.subtractionSign;
    public constantStrings : [string, string] = ["", ""];
    public precision : Decimal = new Decimal(1.2e-16);
    public minimumTermRounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero;

    constructor(
        value : DecimalSource = 10,
        formatExponents : number = 1,
        minimumTerm : DecimalSource = 0,
        fractionInverse : boolean = true,
        maxTerms : number = 8,
        variableStr : string = "x",
        maxMultiTerm : DecimalSource = Decimal.tetrate(value, 3).max(3**30),
        maxSingleTerm : DecimalSource = Decimal.tetrate(value, 5),
        maxExps : number = 5,
        showZeroTerms : number = -1,
        innerNotation : Notation = new DefaultNotation(),
        additionSign : string = " + ",
        subtractionSign : string = " - ",
        multiplicationSign : string = "",
        divisionSign : string = "/",
        multiplicationBefore : boolean = true,
        powerStrings : [string, string] = ["<sup>", "</sup>"],
        coefficientStrings : [string, string] = ["", ""],
        parenthesizePower : number = -1,
        unitCoefficientShown : [boolean, boolean] = [false, true],
        unitPowerShown : boolean = false,
        expStrings : [[string, string], [string, string], [string, string], [string, string]] = [[variableStr + "^(", ")"], [variableStr + "^", ""], ["(" + variableStr + "^)^", " "], ["(" + variableStr + "^)^(", ") "]],
        superexpBefore : boolean = true,
        frontSubtractionSign : string = subtractionSign,
        constantStrings : [string, string] = ["", ""],
        precision : DecimalSource = 1.2e-16,
        minimumTermRounding : DecimalSource | ((value : Decimal) => Decimal) = 0
    ) {
        super();
        this.formatExponents = formatExponents;
        this.value = value;
        this.minimumTerm = toDecimal(minimumTerm);
        this.fractionInverse = fractionInverse;
        this.maxTerms = maxTerms;
        this.variableStr = variableStr;
        this.maxMultiTerm = toDecimal(maxMultiTerm);
        this.maxSingleTerm = toDecimal(maxSingleTerm);
        this.maxExps = maxExps;
        this.showZeroTerms = showZeroTerms;
        this.innerNotation = innerNotation;
        this.additionSign = additionSign;
        this.subtractionSign = subtractionSign;
        this.multiplicationSign = multiplicationSign;
        this.divisionSign = divisionSign;
        this.multiplicationBefore = multiplicationBefore;
        this.powerStrings = powerStrings;
        this.coefficientStrings = coefficientStrings;
        this.parenthesizePower = parenthesizePower;
        this.unitCoefficientShown = unitCoefficientShown;
        this.unitPowerShown = unitPowerShown;
        this.expStrings = expStrings;
        this.superexpBefore = superexpBefore;
        this.frontSubtractionSign = frontSubtractionSign;
        this.constantStrings = constantStrings;
        this.precision = toDecimal(precision);
        this.minimumTermRounding = minimumTermRounding;
    }

    public name = "Polynomial Notation";

    public format(
        value: DecimalSource
      ): string {
  
        let decimal = toDecimal(value);
  
        if (decimal.isNan()) return this.NaNString;
    
        if (this.isInfinite(decimal)) {
          return decimal.sgn() < 0 ? this.negativeInfinite : this.infinite;
        }
  
        if (decimal.neq(0) && this.isInfinite(decimal.recip())) {
          return this.format(0);
        }
    
        return this.formatDecimal(decimal);
      }

    public formatDecimal(value: Decimal): string {
        if (value.eq(0)) return this.innerNotation.format(0);
        let result = ""
        let negative = false;
        if (value.lt(0)) {
            negative = true;
            value = value.abs();
            result = this.frontSubtractionSign;
        };
        if (value.lte(this.maxMultiTerm.recip()) || (this.minimumTerm.isFinite() && value.lt(this._value.pow(this.minimumTerm)) && value.lt(this._value.pow(this.minimumTerm.neg().div(2))))) {
            result += this.innerNotation.format(1) + this.divisionSign + "(" + this.format(value.recip()) + ")";
            return result;
        }
        let baseString = this.variableStr;
        let bottomExps = (value.gte(this.maxSingleTerm)) ? value.slog(this._value, 100, true).sub(this.maxSingleTerm.slog(this._value, 100, true)).plus(1).floor().max(0) : Decimal.dZero;
        if (bottomExps.lt(9e15)) {
            value = value.iteratedlog(this._value, bottomExps.toNumber(), true);
        let currentValue = value;
        let bottom = value.mul(this.precision);
        let roundingMultiple = (this.minimumTerm.eq(-Infinity)) ? Decimal.dZero : (typeof this.minimumTermRounding == "function") ? this.minimumTermRounding(value.mod(this._value.pow(this.minimumTerm))) : toDecimal(this.minimumTermRounding);
        currentValue = round(currentValue, (this.minimumTerm.eq(-Infinity)) ? Decimal.dZero : this._value.pow(this.minimumTerm).mul(roundingMultiple));
        let termsSoFar = 0;
        let maxTerms = (currentValue.lt(this.maxMultiTerm)) ? this._maxTerms : 1;
        let power = currentValue.log(this._value).floor().plus(1);
        while (termsSoFar < maxTerms && (currentValue.gte(bottom) || this.showZeroTerms > 0)) {
            termsSoFar++;
            let coefficient : Decimal;
            let powerNum : Decimal;
            if (this.showZeroTerms >= 0) {
                power = power.sub(1);
                powerNum = this._value.pow(power);
                coefficient = currentValue.div(powerNum);
            }
            else {
                [coefficient, power] = scientifify(currentValue, this._value);
                powerNum = this._value.pow(power);
            }
            if (power.lt(this.minimumTerm)) {
                power = this.minimumTerm;
                powerNum = this._value.pow(power);
                coefficient = currentValue.div(powerNum);
            }
            if (value.lt(this.maxMultiTerm) && power.gt(this.minimumTerm)) coefficient = coefficient.floor();
            else coefficient = round(coefficient, this.minimumTermRounding);
            let subresult = "";
            if (power.eq(0)) subresult = this.constantStrings[0] + this.innerNotation.format(coefficient) + this.constantStrings[1];
            else {
                let reciprocal = false;
                if (this.fractionInverse && power.lt(0)) {
                    reciprocal = true;
                    power = power.abs();
                }
                let powerString = "";
                if (this.formatExponents != 0 && (this.unitPowerShown || power.neq(1))) {
                    if (this.formatExponents > 0) powerString = this.format(power);
                    else powerString = this.innerNotation.format(power);
                    if (this.parenthesizePower > 0 || (this.parenthesizePower == 0 && power.abs().gte(this._value) && this.formatExponents > 0)) powerString = "(" + powerString + ")";
                    powerString = this.powerStrings[0] + powerString + this.powerStrings[1];
                }
                powerString = baseString + powerString;
                let coefficientString = "";
                if (coefficient.neq(1) || ((this.unitCoefficientShown[0] && !reciprocal) || (this.unitCoefficientShown[1] && reciprocal))) {
                    coefficientString = this.innerNotation.format(coefficient);
                    coefficientString = this.coefficientStrings[0] + coefficientString + this.coefficientStrings[1];
                }
                subresult = powerString;
                let usedSign = (reciprocal) ? this.divisionSign : this.multiplicationSign;
                if (coefficientString) {
                    if (this.multiplicationBefore) subresult = coefficientString + usedSign + powerString;
                    else subresult = powerString + usedSign + coefficientString;
                }
            }
            result += subresult;
            if (power.lte(this.minimumTerm)) break;
            currentValue = currentValue.sub(powerNum.mul(coefficient));
            if (termsSoFar < maxTerms && (currentValue.gt(bottom) || this.showZeroTerms > 0)) {
                if (negative) result += this.subtractionSign;
                else result += this.additionSign;
            }
        }
        }
        if (bottomExps.gt(0) && bottomExps.lte(this.maxExps)) {
            result = this.expStrings[0][0] + result + this.expStrings[0][1];
            for (let i = 1; i < bottomExps.toNumber(); i++) result = this.expStrings[1][0] + result + this.expStrings[1][1];
        }
        else if (bottomExps.gt(this.maxExps)) {
            let superexpString = "";
            if (bottomExps.lt(this._value)) superexpString = this.expStrings[2][0] + this.format(bottomExps) + this.expStrings[2][1];
            else superexpString = this.expStrings[3][0] + this.format(bottomExps) + this.expStrings[3][1];
            if (this.superexpBefore) result = superexpString + result;
            else result += superexpString;
        }
        return result;
    }

    public get value() {
        return this._value;
    }

    public set value(value : DecimalSource) {
        let valueD = toDecimal(value);
        if (valueD.lte(1)) throw new RangeError("Value <= 1 in Polynomial Notation");
        if (this.formatExponents > 0 && valueD.lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work in Polynomial Notation with formatted exponents");
        this._value = valueD;
    }

    public get maxTerms() {
        return this._maxTerms;
    }

    public set maxTerms(maxTerms : number) {
        if (maxTerms <= 0) throw new RangeError("Nonpositive max terms in Polynomial Notation");
        this._maxTerms = maxTerms;
    }
}

const BaseThreeHalves = new ExpandedDefaultNotation(1.5**12, 1, 5, 1.5, ...[,,,,,,,,,,,], new PolynomialNotation(1.5, 0, -Infinity, false, 12, "", 1.5**12, 1.5**12, 5, 1, undefined, "", "", "", "", ...[,,,,], [true, true], ...[,,,], "-", ["", "."])).setName("Base 1.5");
const BasePhi = new ExpandedDefaultNotation(1.618033988749895**11, 1, 5, 1.618033988749895, ...[,,,,,,,,,,,], new PolynomialNotation(1.618033988749895, 0, -Infinity, false, 11, "", 1.618033988749895**11, 1.618033988749895**11, 5, 1, undefined, "", "", "", "", ...[,,,,], [true, true], ...[,,,], "-", ["", "."])).setName("Base phi");
const BaseE = new ExpandedDefaultNotation(2.718281828459045**11, 1, 5, 2.718281828459045, ...[,,,,,,,,,,,], new PolynomialNotation(2.718281828459045, 0, -Infinity, false, 11, "", 2.718281828459045**11, 2.718281828459045**11, 5, 1, undefined, "", "", "", "", ...[,,,,], [true, true], ...[,,,], "-", ["", "."])).setName("Base e");
const BasePi = new ExpandedDefaultNotation(3.141592653589793**11, 1, 5, 3.141592653589793, ...[,,,,,,,,,,,], new PolynomialNotation(3.141592653589793, 0, -Infinity, false, 11, "", 3.141592653589793**11, 3.141592653589793**11, 5, 1, undefined, "", "", "", "", ...[,,,,], [true, true], ...[,,,], "-", ["", "."])).setName("Base e");

    /**
     * Uses the names of large numbers to abbreviate them: a million is 1 M, two billion is 2 B, and so on. Larger names use the -illion scheme devised by Jonathan Bowers.
     * @param dialect ( number ) Controls which set of prefixes is used. Dialect 0 is MathCookie's Standard (the set of prefixes chosen by the creator of eternal_notations), dialect 1 uses the prefixes from Antimatter Dimensions, and dialect 2 is Aarex's Abbreviation System by Aarex Tiaokhiao. Default is 0 (MathCookie's Standard). Any value other than 0, 1, or 2 will default back to 0.
     * @param longScale ( boolean ) The short scale is used if this is false, the long scale is used if this is true. Default is false.
     * @param rounding ( DecimalSource | ((value : Decimal) => Decimal) ) The mantissa is rounded to the nearest multiple of this value. If this parameter is a function, then the mantissa is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0.
     * @param entriesLimit ( number ) How many "entries" of a single tier can show up before the notation cuts off with an ellipsis. Default is 6. For example, NNgNeMc-NNgNeMl-NNgNe has 3 entries.
     * @param charLimit ( number ) How many characters long the abbreviation can be (not including the number at the front, just the -illion prefix) before the notation cuts off with an ellipsis. Default is 100.
     * @param innerNotation ( Notation ) The notation that the numbers within the expression are themselves notated with. DefaultNotation is the default.
     */
export class StandardNotation extends Notation {
    private _dialect : number = 0;
    public longScale : boolean = false;
    public rounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero;
    private _entriesLimit : number = 5;
    private _charLimit : number = 50;
    public innerNotation : Notation = new DefaultNotation();

    private prefixes : any // This object can have different parameters, so I'm making this any type
    private charLimitReached : boolean = false;

    constructor(
        dialect : number = 0,
        longScale : boolean = false,
        rounding : DecimalSource | ((value : Decimal) => Decimal) = 0,
        entriesLimit : number = 5,
        charLimit : number = 50,
        innerNotation : Notation = new DefaultNotation(),
        ) {
      super();
      this.dialect = dialect;
      this.longScale = longScale;
      this.rounding = rounding;
      this.entriesLimit = entriesLimit;
      this.charLimit = charLimit;
      this.innerNotation = innerNotation;
      if (this._dialect == 1) {
        // Antimatter Dimensions Standard
        this.prefixes = {
            early1: ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No"], 
            layer1: [["", "U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"], 
                     ["", "Dc", "Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn"], 
                     ["", "Ce", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]], 
            early2: ["", "MI", "MC", "NA", "PC", "FM", "AT", "ZP"]
        };
      }
      else if (dialect == 2) this.prefixes = {
        // Aarex's Abbreviation System
        early1: ["k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "N"], 
        layer1: [["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "N"], 
                 ["", "De", "Vg", "Tg", "Qg", "Qq", "Sg", "St", "Og", "Ng"], 
                 ["", "Ce", "Dc", "Tc", "Qe", "Qu", "Se", "Su", "Oe", "Ne"]], 
        early2: ["", "Mi", "Mc", "Na", "Pc", "Fem", "At", "Zep", "Yo", "Xn", "Vc", "Me", "Du", "Tre", "Te", "Pe", "He", "Hp", "Ot", "En"], 
        layer2: [["", "Me", "Du", "Tre", "Te", "Pe", "He", "Hp", "Ot", "En", "Ve", "Mec", "Duc", "Trc", "Tec", "Pc", "Hxc", "Hpc", "Otc", "Ec"],
                 ["", "Vc", "Is", "TrC", "TeC", "PeC", "HeC", "HpC", "OtC", "EnC"],
                 ["", "Hec", "DHc", "TrH", "TeH", "PeH", "HeH", "HpH", "OtH", "EnH"]],
        early3: ["", "Kl", "Mg", "Gi", "Ter", "Pt", "Ex", "Zt", "Yt", "Xe", "Dk", "Hn", "Dok", "TrD", "TeD", "PeD", "ExD", "ZeD", "YoD", "NeD"],
        layer3: [["", "eN", "oD", "tR", "tE", "pT", "eX", "zE", "yO", "xN",
                  "DaK", "En", "Dok", "TrD", "TeD", "PeD", "ExD", "ZeD", "YoD", "NeD",
                  "Ik", "IkeN", "IcoD", "IctR", "IctE", "IkpT", "IkeX", "IczE", "IkyO", "IcxN",
                  "Trk", "TkeN", "TcoD", "TctR", "TctE", "TkpT", "TkeX", "TczE", "TkyO", "TcxN",
                  "Tek", "TekeN", "TecoD", "TectR", "TectE", "TekpT", "TekeX", "TeczE", "TekyO", "TecxN",
                  "Pek", "PkeN", "PcoD", "PctR", "PctE", "PkpT", "PkeX", "PczE", "PkyO", "PcxN",
                  "Exk", "EkeN", "EcoD", "EctR", "EctE", "EkpT", "EkeX", "EczE", "EkyO", "EcxN",
                  "Zak", "ZkeN", "ZcoD", "ZctR", "ZctE", "ZkpT", "ZkeX", "ZczE", "ZkyO", "ZcxN",
                  "Yok", "YkeN", "YcoD", "YctR", "YctE", "YkpT", "YkeX", "YczE", "YkyO", "YcxN",
                  "Nek", "NkeN", "NcoD", "NctR", "NctE", "NkpT", "NkeX", "NczE", "NkyO", "NcxN"],
                  ["T", "EN", "OD", "TR", "TE", "PT", "EC", "ZT", "YT", "XE",
                  "DaK", "En", "DoK", "TrD", "TeD", "PeD", "ExD", "ZeD", "YoD", "NeD",
                  "IK", "IkeN", "IcoD", "IctR", "IctE", "IkpT", "IkeX", "IczE", "IkyO", "IcxN",
                  "TrK", "TkeN", "TcoD", "TctR", "TctE", "TkpT", "TkeX", "TczE", "TkyO", "TcxN",
                  "TeK", "TekeN", "TecoD", "TectR", "TectE", "TekpT", "TekeX", "TeczE", "TekyO", "TecxN",
                  "PeK", "PkeN", "PcoD", "PctR", "PctE", "PkpT", "PkeX", "PczE", "PkyO", "PcxN",
                  "ExK", "EkeN", "EcoD", "EctR", "EctE", "EkpT", "EkeX", "EczE", "EkyO", "EcxN",
                  "ZaK", "ZkeN", "ZcoD", "ZctR", "ZctE", "ZkpT", "ZkeX", "ZczE", "ZkyO", "ZcxN",
                  "YoK", "YkeN", "YcoD", "YctR", "YctE", "YkpT", "YkeX", "YczE", "YkyO", "YcxN",
                  "NeK", "NkeN", "NcoD", "NctR", "NctE", "NkpT", "NkeX", "NczE", "NkyO", "NcxN"],
                  ["", "Ho", "Do", "To", "Tr", "Po", "Ex", "Zo", "Yo", "No"]], // layer3[0] is the layer3 entries below 100, layer3[1] is the layer3 entries below 100 when they come after a multiple of 100, and layer3[2] is the multiples of 100
        prefixearly3: ["", "", "D", "T", "Tr", "P", "Ex", "Z", "Y", "N", "DK", "HN", "DoK", "TrD", "TeD", "PeD", "ExD", "ZeD", "YoD", "NeD"],
        early4: ["", "KaL", "MeJ", "GiJ", "AsT", "LuN", "FrM", "JoV", "SoL", "BeT", "GaX", "GlO", "SuP", "VrS", "MlT"]
      };
      else this.prefixes = {
        // MathCookie's Standard
        early1: ["k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"], // Below a decillion
        layer1: [["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "O", "N"], 
                 ["", "Dc", "Vg", "Tg", "Qg", "Qq", "Sg", "St", "Og", "Ng"], 
                 ["", "Cn", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]], // Ones, tens, and hundreds prefixes on layer 1
        early2: ["", "Ml", "Mc", "Na", "Pc", "Fm", "At", "Zp", "Yc", "Xn", "Vc", "Mec", "Duc", "Tec", "Ttc", "Pnc", "Hxc", "Hpc", "Otc", "Enc"], // First 19 on layer 2
        layer2: [["", "Me", "Du", "To", "Tt", "Pn", "Hx", "Hp", "Ot", "En", "Vc", "Mec", "Duc", "Tec", "Ttc", "Pnc", "Hxc", "Hpc", "Otc", "Enc"], 
                 ["", "Vc", "Ic", "Ta", "Te", "Pe", "He", "Ht", "Oa", "Ea"],
                 ["", "Hc", "Dh", "Th", "Tth", "Ph", "Hxh", "Hph", "Oh", "Eh"]], // Ones, tens, and hundreds on layer 2. 11 through 19 use their ones entry, but higher numbers go back to ones + tens
        early3: ["", "Ki", "Mg", "Gg", "Tr", "Pt", "Ex", "Zt", "Yt", "Xe", "Da", "Hd", "Dok", "Tad", "Ted", "Pd", "Ed", "Zd", "Yd", "Nd"], // First 19 on layer 3
        layer3: [["", "Hd", "Di", "Ti", "Tr", "Pt", "Ex", "Zt", "Yt", "Xe", "Da", "Hd", "Dok", "Tad", "Ted", "Pd", "Ed", "Zd", "Yd", "Nd"],
                 ["", "Da", "Ik", "Tak", "Tek", "Pk", "Ek", "Zk", "Yk", "Nk"],
                 ["", "Ho", "Bo", "Tro", "Tot", "Po", "Eo", "Zo", "Yo", "Nt"]], // Ones, tens, and hundreds on layer 3. Behaves the same as layer 2
        prefixearly3: ["", "", "Dl", "Ta", "Tl", "Pl", "El", "Zl", "Yl", "Nl", "Da", "Hd", "Dok", "Tad", "Ted", "Pd", "Ed", "Zd", "Yd", "Nd"], // When layer 3 entries below 20 are used as a prefix on a layer 4 entry rather than standing on their own, these are used. The usual layer3 entries are used above 20.
        early4: ["", "Ka", "Mj", "Gj", "As", "Lu", "Fr", "Jv", "Sl", "Bt", "Gx", "Go", "Sp", "Vs", "Mu"] // Layer 4; the illions run out after Mu
      };
    }

    public name = "Standard Notation";
  
    public formatDecimal(value: Decimal): string {
      this.charLimitReached = false;
      if (value.eq(0)) return this.innerNotation.format(0);
      let result = "";
      let negExp = false;
      let base = new Decimal(1000);
      if (this.longScale) base = new Decimal(1e6);
      if (value.lt(1) && this._dialect == 2) {
        if (value.gte(0.01)) return this.innerNotation.format(value);
        let recipNotation = new AppliedFunctionNotation(
            function(value : Decimal) : Decimal {return value.recip();},
            this, function(value : string) {return "1/" + value;}
        )
        return recipNotation.format(value);
      }
      if (value.lt(1)) {
        negExp = true;
        let [m, e] = scientifify(value, base);
        value = base.pow(e.neg()).mul(m); 
      }
      if (this._dialect == 2 && value.gte(Decimal.tetrate(10, base.toNumber()))) {
        if (negExp) result += "/";
        result += "MXS^";
        result += this.format(value.slog(10));
        return result;
      }
      else if (this._dialect != 2 && value.gte(base.pentate(2))) {
        if (negExp) result += "/";
        result += "Il^";
        result += this.format(value.slog(base));
        return result;
      }
      else {
        let limit = new Decimal("eee3e45");
        if (this._dialect == 1) {
            if (this.longScale) limit = new Decimal("e6e24");
            else limit = new Decimal("e3e24");
        }
        let aboveLimit = false;
        if (value.gte(limit)) {
            aboveLimit = true;
            let limBase = base;
            if (this._dialect == 2) limBase = Decimal.dTen;
            let fronts = value.slog(limBase).sub(limit.slog(limBase)).plus(1).floor();
            value = value.iteratedlog(limBase, fronts.toNumber(), true);
            if (this._dialect == 2) {
                if (negExp) result += "/";
                if (fronts.eq(1)) result += "MXS-(";
                else result += "MXS^" + this.format(fronts) + "-(";
                negExp = false;
            }
            else {
                if (negExp) result += "/";
                if (fronts.eq(1)) result += "Il(";
                else result += "Il^" + this.format(fronts) + "(";
                negExp = false;
            }
        }
        let [mantissa, illion] = scientifify(value, base, this.rounding);
        if (value.lte(base.pow(Decimal.pow(1000, this._entriesLimit)))) result += this.innerNotation.format(mantissa);
        if (illion.eq(0)) return result; //No -illion here
        if (value.lte(base.pow(Decimal.pow(1000, this._entriesLimit)))) result += " ";
        if (negExp) result += "/";
        if (!this.longScale) illion = illion.sub(1); //Since 1,000 is the "0th" illion and 1,000,000 is the first; this isn't an issue in long scale
        let charsSoFar = 0; //This is used to keep track of whether we've hit the character limit
        if (illion.lt(10)) result += this.prefixes.early1[illion.toNumber()];
        else {
            let iterations = 0;
            while (iterations < this._entriesLimit && illion.gt(0)) {
                //Layer 1 loop
                iterations++;
                let superillion = illion.log(1000).floor();
                let coefficient = illion.div(Decimal.pow(1000, superillion)).floor();
                //These next few if statements address imprecision errors
                let imprecisions = 0;
                if (coefficient.eq(0)) {
                    superillion = superillion.sub(1);
                    coefficient = illion.div(Decimal.pow(1000, superillion)).floor();
                    imprecisions++;
                }
                if (coefficient.gte(1000)) {
                    superillion = superillion.plus(1);
                    coefficient = illion.div(Decimal.pow(1000, superillion)).floor();
                    imprecisions++;
                }
                if (coefficient.eq(0) && imprecisions == 2) {
                    //If we've run into both bounding errors and we're back to zero, we're too close to the boundary, so just act as if we're there
                    coefficient = Decimal.dOne;
                    illion = Decimal.dZero;
                }
                else illion = illion.sub(coefficient.mul(Decimal.pow(1000, superillion)));
                let coefficientPart = this.prefixes.layer1[0][coefficient.mod(10).toNumber()] + this.prefixes.layer1[1][coefficient.div(10).floor().mod(10).toNumber()] + this.prefixes.layer1[2][coefficient.div(100).floor().mod(10).toNumber()];
                if (coefficient.gt(1) || superillion.eq(0)) {
                    result += coefficientPart;
                    charsSoFar += coefficientPart.length;
                }
                let superPart = "";
                superPart += this.calcLayer2(superillion, charsSoFar);
                charsSoFar += superPart.length;
                result += superPart;
                if (this.charLimitReached) break;
                if (illion.gt(0)) {
                    result += "-";
                    charsSoFar += 1;
                }
                if (charsSoFar > this._charLimit && illion.gt(0)) this.charLimitReached = true;
                if (this.charLimitReached) break;
            }
            if (iterations == this._entriesLimit && illion.gt(0)) this.charLimitReached = true;
        }
        if (this.charLimitReached) result += "...";
        if (aboveLimit) result += ")";
      }
      return result;
    }

    private calcLayer2(illion : Decimal, charsComingIn : number = 0): string {
        let result = "";
        let charsSoFar = 0;
        let iterations = 0;
        while (iterations < this._entriesLimit && illion.gt(0)) {
            //Layer 2 loop
            iterations++;
            illion = illion.floor(); //Combats imprecision
            let superillion = illion.log(1000).floor();
            let coefficient = illion.div(Decimal.pow(1000, superillion)).floor();
            let imprecisions = 0;
            if (coefficient.eq(0)) {
                superillion = superillion.sub(1);
                coefficient = illion.div(Decimal.pow(1000, superillion)).floor();
                imprecisions++;
            }
            if (coefficient.gte(1000)) {
                superillion = superillion.plus(1);
                coefficient = illion.div(Decimal.pow(1000, superillion)).floor();
                imprecisions++;
            }
            if (coefficient.eq(0) && imprecisions == 2) {
                //If we've run into both bounding errors and we're back to zero, we're too close to the boundary, so just act as if we're there
                coefficient = Decimal.dOne;
                illion = Decimal.dZero;
            }
            else illion = illion.sub(coefficient.mul(Decimal.pow(1000, superillion)));
            let coefficientPart = "";
            if (coefficient.mod(100).lt(20)) {
                if (superillion.eq(0) && coefficient.lt(100)) coefficientPart = this.prefixes.early2[coefficient.mod(100).toNumber()];
                else coefficientPart = this.prefixes.layer2[0][coefficient.mod(100).toNumber()];
            }
            else coefficientPart = this.prefixes.layer2[0][coefficient.mod(10).toNumber()] + this.prefixes.layer2[1][coefficient.div(10).floor().mod(10).toNumber()];
            if (coefficient.gte(100)) coefficientPart += this.prefixes.layer2[2][coefficient.div(100).floor().mod(10).toNumber()];
            if (coefficient.gt(1) || superillion.eq(0)) {
                result += coefficientPart;
                charsSoFar += coefficientPart.length;
            }
            let superPart = this.calcLayer3(superillion, charsComingIn + charsSoFar);
            charsSoFar += superPart.length;
            result += superPart;
            if (this.charLimitReached) break;
            if (illion.gt(0)) {
                if (this._dialect == 2) {
                    result += "a'";
                    charsSoFar += 2;
                }
                else {
                    result += "_";
                    charsSoFar += 1;
                }
            }
            if (charsComingIn + charsSoFar > this._charLimit && illion.gt(0)) this.charLimitReached = true;
            if (this.charLimitReached) break;
        }
        if (iterations == this._entriesLimit && illion.gt(0)) this.charLimitReached = true;
        return result;
    }

    private calcLayer3(illion : Decimal, charsComingIn : number = 0): string {
        let result = "";
        let charsSoFar = 0;
        let iterations = 0;
        while (iterations < this._entriesLimit && illion.gt(0)) {
            //Layer 3 loop
            iterations++;
            illion = illion.floor(); //Combats imprecision
            let superillion = illion.log(1000).floor();
            let coefficient = illion.div(Decimal.pow(1000, superillion)).floor();
            let imprecisions = 0;
            if (coefficient.eq(0)) {
                superillion = superillion.sub(1);
                coefficient = illion.div(Decimal.pow(1000, superillion)).floor();
                imprecisions++;
            }
            if (coefficient.gte(1000)) {
                superillion = superillion.plus(1);
                coefficient = illion.div(Decimal.pow(1000, superillion)).floor();
                imprecisions++;
            }
            if (coefficient.eq(0) && imprecisions == 2) {
                //If we've run into both bounding errors and we're back to zero, we're too close to the boundary, so just act as if we're there
                coefficient = Decimal.dOne;
                illion = Decimal.dZero;
            }
            else illion = illion.sub(coefficient.mul(Decimal.pow(1000, superillion)));
            let coefficientPart = "";
            if (coefficient.lt(20) || (coefficient.mod(100).lt(20) && this._dialect != 2)) {
                if (superillion.eq(0) && coefficient.lt(100)) coefficientPart += this.prefixes.early3[coefficient.mod(100).toNumber()];
                else if (superillion.eq(0)) coefficientPart += this.prefixes.layer3[0][coefficient.mod(100).toNumber()];
                else coefficientPart += this.prefixes.prefixearly3[coefficient.mod(100).toNumber()];
                if (coefficient.gte(100)) coefficientPart += this.prefixes.layer3[2][coefficient.div(100).floor().mod(10).toNumber()];
            }
            else {
                if (this._dialect == 2) {
                    coefficientPart += this.prefixes.layer3[2][coefficient.div(100).floor().mod(10).toNumber()];
                    if (coefficient.lt(100)) coefficientPart += this.prefixes.layer3[0][coefficient.mod(100).toNumber()];
                    else coefficientPart += this.prefixes.layer3[1][coefficient.mod(100).toNumber()];
                }
                else {
                    coefficientPart = this.prefixes.layer3[0][coefficient.mod(10).toNumber()] + this.prefixes.layer3[1][coefficient.div(10).floor().mod(10).toNumber()];
                    if (coefficient.gte(100)) coefficientPart += this.prefixes.layer3[2][coefficient.div(100).floor().mod(10).toNumber()];
                }
            }
            let superPart = "";
            superPart = this.prefixes.early4[superillion.toNumber()]; //No need for a calcLayer4 because the illions don't go that far
            if (this._dialect == 2 && superillion.gt(0)) {
                //Aarex's Abbreviation System has some character manipulation at Tier 4
                if (coefficient.gt(1)) {
                    superPart = superPart.substring(1);
                    if (superillion.eq(9)) superPart = "eeT";
                    superPart = coefficientPart + superPart;
                }
                if (illion.lt(4)) {
                    superPart += this.prefixes.layer3[0][illion.toNumber()];
                    result += superPart;
                    charsSoFar += superPart.length;
                    illion = Decimal.dZero;
                }
                else {
                    if (superillion.eq(3)) superPart += "`";
                    else superPart = superPart.substring(0, superPart.length - 1);
                    result += superPart;
                    charsSoFar += superPart.length;
                }
            }
            else {
                result += coefficientPart;
                charsSoFar += coefficientPart.length;
                charsSoFar += superPart.length;
                result += superPart;
            }
            if (this.charLimitReached) break;
            if (illion.gt(0) && this._dialect != 2) {
                result += "~";
                charsSoFar += 1;
            }
            if (charsComingIn + charsSoFar > this._charLimit && illion.gt(0)) this.charLimitReached = true;
            if (this.charLimitReached) break;
        }
        if (iterations == this._entriesLimit && illion.gt(0)) this.charLimitReached = true;
        return result;
    }

    public get dialect() {
        return this._dialect;
    }

    public set dialect(dialect : number) {
        this._dialect = dialect;
        if (this._dialect == 1) {
            // Antimatter Dimensions Standard
            this.prefixes = {
                early1: ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No"], 
                layer1: [["", "U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"], 
                         ["", "Dc", "Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn"], 
                         ["", "Ce", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]], 
                early2: ["", "MI", "MC", "NA", "PC", "FM", "AT", "ZP"]
            };
          }
          else if (dialect == 2) this.prefixes = {
            // Aarex's Abbreviation System
            early1: ["k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "N"], 
            layer1: [["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "N"], 
                     ["", "De", "Vg", "Tg", "Qg", "Qq", "Sg", "St", "Og", "Ng"], 
                     ["", "Ce", "Dc", "Tc", "Qe", "Qu", "Se", "Su", "Oe", "Ne"]], 
            early2: ["", "Mi", "Mc", "Na", "Pc", "Fem", "At", "Zep", "Yo", "Xn", "Vc", "Me", "Du", "Tre", "Te", "Pe", "He", "Hp", "Ot", "En"], 
            layer2: [["", "Me", "Du", "Tre", "Te", "Pe", "He", "Hp", "Ot", "En", "Ve", "Mec", "Duc", "Trc", "Tec", "Pc", "Hxc", "Hpc", "Otc", "Ec"],
                     ["", "Vc", "Is", "TrC", "TeC", "PeC", "HeC", "HpC", "OtC", "EnC"],
                     ["", "Hec", "DHc", "TrH", "TeH", "PeH", "HeH", "HpH", "OtH", "EnH"]],
            early3: ["", "Kl", "Mg", "Gi", "Ter", "Pt", "Ex", "Zt", "Yt", "Xe", "Dk", "Hn", "Dok", "TrD", "TeD", "PeD", "ExD", "ZeD", "YoD", "NeD"],
            layer3: [["", "eN", "oD", "tR", "tE", "pT", "eX", "zE", "yO", "xN",
                      "DaK", "En", "Dok", "TrD", "TeD", "PeD", "ExD", "ZeD", "YoD", "NeD",
                      "Ik", "IkeN", "IcoD", "IctR", "IctE", "IkpT", "IkeX", "IczE", "IkyO", "IcxN",
                      "Trk", "TkeN", "TcoD", "TctR", "TctE", "TkpT", "TkeX", "TczE", "TkyO", "TcxN",
                      "Tek", "TekeN", "TecoD", "TectR", "TectE", "TekpT", "TekeX", "TeczE", "TekyO", "TecxN",
                      "Pek", "PkeN", "PcoD", "PctR", "PctE", "PkpT", "PkeX", "PczE", "PkyO", "PcxN",
                      "Exk", "EkeN", "EcoD", "EctR", "EctE", "EkpT", "EkeX", "EczE", "EkyO", "EcxN",
                      "Zak", "ZkeN", "ZcoD", "ZctR", "ZctE", "ZkpT", "ZkeX", "ZczE", "ZkyO", "ZcxN",
                      "Yok", "YkeN", "YcoD", "YctR", "YctE", "YkpT", "YkeX", "YczE", "YkyO", "YcxN",
                      "Nek", "NkeN", "NcoD", "NctR", "NctE", "NkpT", "NkeX", "NczE", "NkyO", "NcxN"],
                      ["T", "EN", "OD", "TR", "TE", "PT", "EC", "ZT", "YT", "XE",
                      "DaK", "En", "DoK", "TrD", "TeD", "PeD", "ExD", "ZeD", "YoD", "NeD",
                      "IK", "IkeN", "IcoD", "IctR", "IctE", "IkpT", "IkeX", "IczE", "IkyO", "IcxN",
                      "TrK", "TkeN", "TcoD", "TctR", "TctE", "TkpT", "TkeX", "TczE", "TkyO", "TcxN",
                      "TeK", "TekeN", "TecoD", "TectR", "TectE", "TekpT", "TekeX", "TeczE", "TekyO", "TecxN",
                      "PeK", "PkeN", "PcoD", "PctR", "PctE", "PkpT", "PkeX", "PczE", "PkyO", "PcxN",
                      "ExK", "EkeN", "EcoD", "EctR", "EctE", "EkpT", "EkeX", "EczE", "EkyO", "EcxN",
                      "ZaK", "ZkeN", "ZcoD", "ZctR", "ZctE", "ZkpT", "ZkeX", "ZczE", "ZkyO", "ZcxN",
                      "YoK", "YkeN", "YcoD", "YctR", "YctE", "YkpT", "YkeX", "YczE", "YkyO", "YcxN",
                      "NeK", "NkeN", "NcoD", "NctR", "NctE", "NkpT", "NkeX", "NczE", "NkyO", "NcxN"],
                      ["", "Ho", "Do", "To", "Tr", "Po", "Ex", "Zo", "Yo", "No"]], // layer3[0] is the layer3 entries below 100, layer3[1] is the layer3 entries below 100 when they come after a multiple of 100, and layer3[2] is the multiples of 100
            prefixearly3: ["", "", "D", "T", "Tr", "P", "Ex", "Z", "Y", "N", "DK", "HN", "DoK", "TrD", "TeD", "PeD", "ExD", "ZeD", "YoD", "NeD"],
            early4: ["", "KaL", "MeJ", "GiJ", "AsT", "LuN", "FrM", "JoV", "SoL", "BeT", "GaX", "GlO", "SuP", "VrS", "MlT"]
          };
          else this.prefixes = {
            // MathCookie's Standard
            early1: ["k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"], // Below a decillion
            layer1: [["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "O", "N"], 
                     ["", "Dc", "Vg", "Tg", "Qg", "Qq", "Sg", "St", "Og", "Ng"], 
                     ["", "Cn", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]], // Ones, tens, and hundreds prefixes on layer 1
            early2: ["", "Ml", "Mc", "Na", "Pc", "Fm", "At", "Zp", "Yc", "Xn", "Vc", "Mec", "Duc", "Tec", "Ttc", "Pnc", "Hxc", "Hpc", "Otc", "Enc"], // First 19 on layer 2
            layer2: [["", "Me", "Du", "To", "Tt", "Pn", "Hx", "Hp", "Ot", "En", "Vc", "Mec", "Duc", "Tec", "Ttc", "Pnc", "Hxc", "Hpc", "Otc", "Enc"], 
                     ["", "Qc", "Ic", "Ta", "Te", "Pe", "He", "Ht", "Oa", "Ea"],
                     ["", "Hc", "Dh", "Th", "Tth", "Ph", "Hxh", "Hph", "Oh", "Eh"]], // Ones, tens, and hundreds on layer 2. 11 through 19 use their ones entry, but higher numbers go back to ones + tens
            early3: ["", "Ki", "Mg", "Gg", "Tr", "Pt", "Ex", "Zt", "Yt", "Xe", "Da", "Hd", "Dok", "Tad", "Ted", "Pd", "Ed", "Zd", "Yd", "Nd"], // First 19 on layer 3
            layer3: [["", "Hd", "Di", "Ti", "Tr", "Pt", "Ex", "Zt", "Yt", "Xe", "Da", "Hd", "Dok", "Tad", "Ted", "Pd", "Ed", "Zd", "Yd", "Nd"],
                     ["", "Da", "Ik", "Tak", "Tek", "Pk", "Ek", "Zk", "Yk", "Nk"],
                     ["", "Ho", "Bo", "Tro", "Tot", "Po", "Eo", "Zo", "Yo", "Nt"]], // Ones, tens, and hundreds on layer 3. Behaves the same as layer 2
            prefixearly3: ["", "", "Dl", "Ta", "Tl", "Pl", "El", "Zl", "Yl", "Nl", "Qt", "Hd", "Dok", "Tad", "Ted", "Pd", "Ed", "Zd", "Yd", "Nd"], // When layer 3 entries below 20 are used as a prefix on a layer 4 entry rather than standing on their own, these are used. The usual layer3 entries are used above 20.
            early4: ["", "Ka", "Mj", "Gj", "As", "Lu", "Fr", "Jv", "Sl", "Bt", "Gx", "Go", "Sp", "Vs", "Mu"] // Layer 4; the illions run out after Mu
          };
    }

    public get entriesLimit() {
        return this._entriesLimit;
    }

    public set entriesLimit(entriesLimit : number) {
        if (entriesLimit <= 0) throw new RangeError("Non-positive entriesLimit in Standard Notation");
        this._entriesLimit = entriesLimit;
    }
    public get charLimit() {
        return this._charLimit;
    }

    public set charLimit(charLimit : number) {
        if (charLimit <= 0) throw new RangeError("Non-positive charLimit in Standard Notation");
        this._charLimit = charLimit;
    }
  }
  
function defaultRound(value : Decimal) {
    if (value.eq(0)) return new Decimal(0);
    return value.abs().log10().floor().sub(3).pow_base(10).min(1);
}
const Standard = new StandardNotation(0, false, defaultRound).setName("Standard");

/**
 * Splits a Decimal into an array of four decimals, [M, E, T, P], such that if b is the base, b^^b^^b^^...^^(b^b^b^b...^(m * b^e))) = the original Decimal, where there are T b^'s and P b^^'s.
 * In other words, this function splits a Decimal into a hyperoperator array like in OmegaNum, except there's an exponentiation entry between the mantissa and the tetration entry.
 * @param value ( Decimal ! ) The Decimal inputted into the function.
 * @param base ( Decimal ) The base of the exponentiation, tetration, and pentation. Default is 10.
 * @param maximums ( Decimal[] ) The largest allowed values for each operator: anything equal to or above this rolls over to the next operator. maximums[0] is the mantissa limit, maximums[1] is the exponent limit, maximums[2] is the tetration limit. Default is [10, 10, 10], where that 10 is replaced with whatever the base is. Setting maximums[0] to 0 effectively disables the mantissa, setting maximums[1] to be equal to or less than expMult effectively disables the exponent, and setting maximums[2] to be equal to or less than hyperexpMult effectively disables the tetration.
 * @param originalMaximums ( Decimal[] ) These are the maximums that apply when the next operator is 0: for example, if maximums is [10, 10, 10] but originalMaximums is [100, 10, 10], then the mantissa can go up to 100 before exponents begin but once the exponent has begun increasing then the mantissa is limited to 10 (this applies even if tetration or pentation is above 0, as long as exponent is still 0). Is the same as maximums by default.
 * @param minnum ( Decimal ) Values above this and below maximums[0] will just return [value, 0, 0, 0] instead of doing any splitting; this prevents small-but-not-too-small values like 2 from forcing negative exponents. Default is 1. Set this value to a negative number to disable this functionality.
 * @param mantissaRounding ( DecimalSource | ((value : Decimal) => Decimal) ) The mantissa is rounded to the nearest multiple of this value. If this parameter is a function, then the mantissa is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0. 
 * @param engineerings ( Decimal | Decimal[] ) Either a DecimalSource or an array of DecimalSources; default is 1. This parameter controls the allowed exponent values: if it's three then the exponent will always be a multiple of 3, as in engineering notation. If this is an array, then multiples of those values are added from greatest to least to get the allowed values: for example, if engineerings is [5, 2], then the permitted exponent values are 2, 4, 5, 7, 9, 10, 12, 14... and so on, i.e. multiples of 5 plus a multiple of 2 less than 5 (which may be 0). Default is 1, which corresponds to regular scientific notation.
 * @param hyperengineerings ( Decimal | Decimal[] ) Same as engineerings, but for the tetration value instead.
 * @param pentaengineerings ( Decimal | Decimal[] ) Same as engineerings, but for the pentation value instead.
 * @param expMult ( Decimal ) Each exponentiation in the process is multiplied by this value. Default is 1.
 * @param hyperexpMult ( Decimal ) Each tetration in the process is multiplied by this value. Default is 1.
 * @param pentaexpMult ( Decimal ) The pentation value is multiplied by this value. Default is 1.
 */
export function hypersplit(
    value : DecimalSource,
    base : DecimalSource = 10,
    maximums : DecimalSource[] = [10, 10, 10],
    originalMaximums : DecimalSource[] = maximums,
    minnum : DecimalSource = 1,
    mantissaRounding : DecimalSource | ((value : Decimal) => Decimal) = 0,
    engineerings : DecimalSource | DecimalSource[] = 1,
    hyperengineerings : DecimalSource | DecimalSource[] = 1,
    pentaengineerings : DecimalSource | DecimalSource[] = 1,
    expMult : DecimalSource = 1,
    hyperexpMult : DecimalSource = 1,
    pentaexpMult : DecimalSource = 1) : [Decimal, Decimal, Decimal, Decimal] {
        let valueD = toDecimal(value);
        let baseD = toDecimal(base);
        let maximumsD = maximums.map(toDecimal);
        if (maximumsD.length == 0) maximumsD.push(new Decimal(base));
        while (maximumsD.length < 3) maximumsD.push(maximumsD[maximumsD.length - 1]);
        let originalMaximumsD = originalMaximums.map(toDecimal);
        if (originalMaximumsD.length == 0) originalMaximumsD = maximumsD;
        while (originalMaximumsD.length < 3) originalMaximumsD.push(originalMaximumsD[originalMaximumsD.length - 1]);
        let minnumD = toDecimal(minnum);
        if (!Array.isArray(engineerings)) engineerings = [engineerings];
        let engineeringsD : Decimal[] = engineerings.map(toDecimal);
        engineeringsD = engineeringsD.sort(function(a, b){
            if (a.lt(b)) return -1;
            else if (a.eq(b)) return 0;
            else return 1;
        }).reverse();
        if (!Array.isArray(hyperengineerings)) hyperengineerings = [hyperengineerings];
        let hyperengineeringsD : Decimal[] = hyperengineerings.map(toDecimal);
        hyperengineeringsD = hyperengineeringsD.sort(function(a, b){
            if (a.lt(b)) return -1;
            else if (a.eq(b)) return 0;
            else return 1;
        }).reverse();
        if (!Array.isArray(pentaengineerings)) pentaengineerings = [pentaengineerings];
        let pentaengineeringsD : Decimal[] = pentaengineerings.map(toDecimal);
        pentaengineeringsD = pentaengineeringsD.sort(function(a, b){
            if (a.lt(b)) return -1;
            else if (a.eq(b)) return 0;
            else return 1;
        }).reverse();
        let expMultD = toDecimal(expMult);
        let hyperexpMultD = toDecimal(hyperexpMult);
        let pentaexpMultD = toDecimal(pentaexpMult);
        if (baseD.pow(expMultD.recip()).lte(1.44466786100976613366)) throw new RangeError("Hypersplit does not support convergent tetrations")

        let mantissaRemoved = (maximumsD[0].eq(0));
        let amountRemoved = 0;
        if (maximumsD[1].lte(expMultD)) {
            amountRemoved = 1;
            maximumsD[1] = Decimal.dOne;
            if (maximumsD[2].lte(hyperexpMultD)) {
                amountRemoved = 2;
                maximumsD[2] = Decimal.dOne;
            }
        }
        let limits = [maximumsD[0]];
        if (mantissaRemoved) {
            limits.push(iteratedexpmult(baseD, maximumsD[1], 1, expMultD));
            limits.push(iteratedexpmult(baseD, limits[1], previousEngineeringValue(maximumsD[2].div(hyperexpMult), hyperengineeringsD).toNumber(), expMultD));
            limits[2] = limits[2].max(limits[1]);
        }
        else {
            limits.push(iteratedexpmult(baseD, previousEngineeringValue(maximumsD[1], engineeringsD), 1, expMultD).mul(maximumsD[0]));
            limits[1] = limits[1].max(limits[0]);
            limits.push(iteratedexpmult(baseD, limits[1], previousEngineeringValue(maximumsD[2].div(hyperexpMult), hyperengineeringsD).toNumber(), expMultD));
            limits[2] = limits[2].max(limits[1]);
        }
        let originalLimits = [originalMaximumsD[0]];
        if (mantissaRemoved) {
            originalLimits.push(iteratedexpmult(baseD, originalMaximumsD[1], 1, expMultD));
            originalLimits.push(iteratedexpmult(baseD, limits[1], previousEngineeringValue(originalMaximumsD[2].div(hyperexpMult), hyperengineeringsD).toNumber(), expMultD));
            originalLimits[2] = originalLimits[2].max(originalLimits[1]);
        }
        else {
            originalLimits.push(iteratedexpmult(baseD, previousEngineeringValue(originalMaximumsD[1], engineeringsD), 1, expMultD).mul(maximumsD[0]));
            originalLimits[1] = originalLimits[1].max(originalLimits[0]);
            originalLimits.push(iteratedexpmult(baseD, limits[1], previousEngineeringValue(originalMaximumsD[2].div(hyperexpMult), hyperengineeringsD).toNumber(), expMultD));
            originalLimits[2] = originalLimits[2].max(originalLimits[1]);
        }

        if (valueD.eq(0) && amountRemoved == 0) return [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)];
        if (!mantissaRemoved && minnumD.gte(0) && valueD.abs().lt(originalMaximumsD[0]) && valueD.abs().gte(minnumD)) return [valueD, new Decimal(0), new Decimal(0), new Decimal(0)];
        if (valueD.lt(1) && amountRemoved == 1) {
            if (mantissaRemoved) {
                let tetration = multslog(valueD, baseD, expMultD).mul(hyperexpMultD);
                tetration = round(tetration, mantissaRounding)
                return [new Decimal(0), new Decimal(0), tetration, new Decimal(0)];
            }
            else {
                let tetration = previousEngineeringValue(Decimal.dZero, hyperengineeringsD);
                while (valueD.lt(0) && tetration.gt(-2)) tetration = previousEngineeringValue(tetration, hyperengineeringsD);
                let mantissa = iteratedmultlog(valueD, baseD, tetration.toNumber(), expMult);
                return [mantissa, new Decimal(0), tetration.mul(hyperexpMult), new Decimal(0)];
            }
        }
        if (valueD.lt(1) && amountRemoved == 2) {
            if (mantissaRemoved) {
                //Just use the same values as for tetration, I don't have any better ideas
                let pentation = multslog(valueD, baseD, expMultD).mul(hyperexpMultD);
                pentation = round(pentation, mantissaRounding);
                return [new Decimal(0), new Decimal(0), new Decimal(0), pentation];
            }
            else {
                let pentation = nextEngineeringValue(new Decimal(0), pentaengineeringsD);
                for (let p = 0; p < pentation.toNumber(); p++) {
                    valueD = multslog(valueD, baseD, expMultD).mul(hyperexpMultD);
                }
                return [valueD, new Decimal(0), new Decimal(0), pentation.mul(pentaexpMultD)];
            }
        } 
        let negative = false;
        if (valueD.lt(0)) {
            negative = true;
            valueD = valueD.neg();
        }
        let negExp = false;
        if (valueD.lt(1) && valueD.recip().gte(originalLimits[1]) && amountRemoved < 1) {
            negExp = true;
            valueD = valueD.recip();
        }
        let oldB = Decimal.dZero;
        let checkComplete = false;
        let pentation = new Decimal(0);
        if (mantissaRemoved && amountRemoved > 1) {
            while (valueD.gte(baseD)) {
                valueD = multslog(valueD, baseD, expMultD).mul(hyperexpMultD);
                pentation = pentation.plus(1);
            }
            pentation = pentation.plus(valueD.log(baseD)).mul(hyperexpMult)
            pentation = round(pentation, mantissaRounding)
            return [new Decimal(0), new Decimal(0), new Decimal(0), pentation];
        }
        if (valueD.gte(originalLimits[2])) {
            while (valueD.gte(limits[2])) {
                let pentIncrease = nextEngineeringValue(pentation, pentaengineeringsD).sub(pentation).toNumber();
                for (let p = 0; p < pentIncrease; p++) {
                    valueD = multslog(valueD, baseD, expMultD).mul(hyperexpMultD);
                }
                pentation = pentation.plus(pentIncrease);
            }
        }
        pentation = pentation.mul(pentaexpMultD);
        let [hypermantissa, tetration] = [valueD, new Decimal(0)];
        if (mantissaRemoved && amountRemoved > 0) {
            tetration = multslog(valueD, baseD, expMult).mul(hyperexpMult);
            tetration = round(tetration, mantissaRounding)
            if (tetration.gte(maximumsD[2])) {
                valueD = toDecimal(value);
                let pentIncrease = nextEngineeringValue(pentation, pentaengineeringsD).sub(pentation).toNumber();
                for (let p = 0; p < pentIncrease; p++) {
                    valueD = multslog(valueD, baseD, expMultD).mul(hyperexpMultD);
                }
                let [m, e, t, p] = hypersplit(valueD, base, maximums, originalMaximums, minnum, mantissaRounding, engineerings, hyperengineerings, pentaengineerings, expMult, hyperexpMult);
                p = p.plus(pentIncrease);
                return [m, e, t, p.mul(pentaexpMult)];
            }
            else return [new Decimal(0), new Decimal(0), tetration, pentation];
        }
        if (amountRemoved > 1) {
            hypermantissa = round(hypermantissa, mantissaRounding);
        }
        else if ((pentation.eq(0) && valueD.gte(originalLimits[1])) || (pentation.gt(0) && valueD.gte(limits[1]))) {
            let hypermantissaPower = multslog(limits[1], baseD, expMultD);
            [hypermantissa, tetration] = hyperscientifify(valueD, baseD, 0, hypermantissaPower, hyperengineeringsD, expMultD);
            oldB = Decimal.dZero;
            checkComplete = false;
            do {
                oldB = hypermantissa;
                if (hypermantissa.gte(limits[1])) {
                    hypermantissa = iteratedmultlog(hypermantissa, baseD, nextEngineeringValue(tetration, hyperengineeringsD).sub(tetration).toNumber(), expMultD); 
                    tetration = nextEngineeringValue(tetration, hyperengineeringsD);
                }
                else if (iteratedexpmult(baseD, hypermantissa, tetration.sub(previousEngineeringValue(tetration, hyperengineeringsD)).toNumber(), expMultD).lt(limits[1])) {
                    hypermantissa = iteratedexpmult(baseD, hypermantissa, tetration.sub(previousEngineeringValue(tetration, hyperengineeringsD)).toNumber(), expMultD);
                    tetration = previousEngineeringValue(tetration, hyperengineeringsD);
                }
                else checkComplete = true;
            } while (!checkComplete && oldB.neq(hypermantissa));
        }
        let mantissaPower = Decimal.dZero;
        let [mantissa, exponent] = [hypermantissa, new Decimal(0)];
        let scientififyLoopDone = false;
        do {
            mantissaPower = Decimal.dZero;
            [mantissa, exponent] = [hypermantissa, new Decimal(0)];
            if (mantissaRemoved) {
                [mantissa, exponent] = [new Decimal(0), round(hypermantissa.log(baseD), mantissaRounding)];
            }
            else if (amountRemoved < 1 && mantissa.gte(originalMaximumsD[0])) {
                mantissaPower = limits[0].log(baseD).sub(engineeringsD[engineeringsD.length - 1]); // Not a perfect value, but we'll let the loop below fix the errors. We guarantee mantissaPower behaves as we want it to here because mantissaPower cares about the lower limit while hypersplit cares about the upper limit, and once engineerings is involved the two won't coincide so easily.
                [mantissa, exponent] = scientifify(hypermantissa, baseD, 0, mantissaPower, engineeringsD);
            }
            let unroundedmantissa = new Decimal(mantissa);
            mantissa = round(mantissa, mantissaRounding);
            if (amountRemoved < 1 && !mantissaRemoved) {
                let oldB = Decimal.dZero;
                let checkComplete = false;
                let loopWatch = false;
                do {
                    oldB = unroundedmantissa;
                    let upperLimit = (exponent.eq(0)) ? originalLimits[0] : limits[0];
                    let lowerLimit = upperLimit.div(baseD.pow(exponent.sub(previousEngineeringValue(exponent, engineeringsD))));
                    if (mantissa.gte(upperLimit)) {
                        unroundedmantissa = unroundedmantissa.mul(baseD.pow(exponent)).div(baseD.pow(nextEngineeringValue(exponent, engineeringsD)));
                        exponent = nextEngineeringValue(exponent, engineeringsD);
                        if (loopWatch) mantissa = lowerLimit; //If we've gone both up and down, the mantissa is too close to the boundary, so just set it to the boundary value
                        mantissa = round(unroundedmantissa, mantissaRounding);
                        if (loopWatch) break;
                    }
                    else if (mantissa.lt(lowerLimit)) {
                        unroundedmantissa = unroundedmantissa.mul(baseD.pow(exponent)).div(baseD.pow(previousEngineeringValue(exponent, engineeringsD)));
                        exponent = previousEngineeringValue(exponent, engineeringsD);
                        mantissa = round(unroundedmantissa, mantissaRounding);
                        loopWatch = true;
                    }
                    else checkComplete = true;
                } while (!checkComplete && oldB.neq(unroundedmantissa))
            }
            if (exponent.gte((tetration.eq(0)) ? originalMaximumsD[1] : maximumsD[1])) { //Rounding might set us over the limit
                hypermantissa = iteratedmultlog(hypermantissa, baseD, nextEngineeringValue(tetration, hyperengineeringsD).sub(tetration).toNumber(), expMultD); 
                tetration = nextEngineeringValue(tetration, hyperengineeringsD);
            }
            else scientififyLoopDone = true;
        } while (!scientififyLoopDone);
        tetration = tetration.mul(hyperexpMultD);
        if (tetration.gte((pentation.eq(0)) ? originalMaximumsD[2] : maximumsD[2])) {
            valueD = toDecimal(value);
            let pentIncrease = nextEngineeringValue(pentation, pentaengineeringsD).sub(pentation).toNumber();
            for (let p = 0; p < pentIncrease; p++) {
                valueD = multslog(valueD, baseD, expMultD).mul(hyperexpMultD);
            }
            let [m, e, t, p] = hypersplit(valueD, base, maximums, originalMaximums, minnum, mantissaRounding, engineerings, hyperengineerings, pentaengineerings, expMult, hyperexpMult);
            p = p.plus(pentIncrease);
            return [m, e, t, p.mul(pentaexpMult)];
        }
        exponent = exponent.mul(expMultD);
        if (negExp) exponent = exponent.neg();
        if (negative) mantissa = mantissa.neg();
        if (amountRemoved > 0) exponent = new Decimal(0);
        if (amountRemoved > 1) tetration = new Decimal(0);
        return [mantissa, exponent, tetration, pentation];
    }


    /**
     * Writes numbers using increasingly powerful operators: first addition, then multiplication, then exponentiation with a fixed top (i.e. root-style exponentiation),
     * then exponentiation with a fixed bottom (logarithm-style), then tetration with a fixed top (super-root), then tetration with a fixed bottom (super-logarithm).
     * Once too many of one operator is used but before it gets high enough to switch to the next, it starts showing how many times that operator is applied.
     * Smaller numbers with the operators applied to them are themselves written in this notation, allowing for nesting parameters.
     * @param bases ( Decimal | Decimal[] ) bases[0] is the number being added to for addition, bases[1] is the number being multiplied by for multiplication, bases[2] is the height of the exponentiation for roots, bases[3] is the base of the exponentiation for exponentiation, bases[4] is the height of the tetration for super-roots, and bases[5] is the base of the tetration for tetration. If less than 6 entries are provided, then the remaining entries are filled in with defaults: addition's default is 10, multiplication matches addition by default, root gets 2 by default, exponentiation matches multiplication by default, super-root matches root by default, and tetration matches exponentiation by default. If a single Decimal is provided instead of an array, that Decimal is taken as addition's base and the rest are filled in with defaults. The default value of this parameter is 10.
     * @param maximums ( Decimal[] ) An array of Decimals: each one is a forced maximum for one operator, such that if the number being formatted is equal to or above that maximum, it's forced to the next operator. maximums[0] is the default plain number (i.e. the maximum number that doesn't get any operators at all), maximums[1] is for addition, maximums[2] is for multiplication, maximums[3] is for roots, maximums[4] is for exponentiation, and maximums[5] is for super-roots (tetration doesn't get a maximum because there's no operator after it). If less than 6 entries are provided, the remaining ones are set to Infinity (there are other ways for an operator to max out, so this is fine). If the array is empty, then maximums[0] (this one shouldn't be infinite, as if it was the operators wouldn't be used at all) is set to bases[0]. The default value for this parameter has maximums[0] be 10 and the rest of the maximums be Infinity.
     * @param operatorChars ( [[string, string], [string, string], [string, string], [string, string]][] ) An array of arrays of four pairs of strings (the outermost array's length is not fixed like the inner arrays' lengths are). In each of these inner arrays, each pair of strings determines what goes around a number to represent an operator. For example:
     * operatorChars[0][0] is the pair of strings used for the innermost addition for the addition operator, with operatorChars[0][0][0] going before the number being added to and operatorChars[0][0][1] going afterwards. operatorChars[0][1] is also for addition, but for additions after the first one (in case you want to add parentheses around inner ones but not the outermost one, for example). operatorChars[0][2] and [0][3] are for once nesting addition begins, with [0][2] going around the number being added to and [0][3] going around the amount of addition operators applied. operatorChars[1] does all the same things as operatorChars[0] but for multiplication instead of addition, operatorChars[2] is for root, operatorChars[3] is for exponentiation, operatorChars[4] is for super-root, and operatorChars[5] is for tetration.
     * Default is [
        
        [["10 + ", ""], ["10 + ", ""], [" + ", ""], ["10 * ", ""]],
            
        [["10 * ", ""], ["10 * ", ""], [" * ", ""], ["10^", ""]],
            
        [["", "^2"], ["(", ")^2"], ["", ""], ["^2^", ""]],
            
        [["10^", ""], ["10^", ""], [" ", ""], ["(10^)^", ""]],
            
        [["", "^^2"], ["(", ")^^2"], ["", ""], [" (^^2)^", ""]],
            
        [["10^^", ""], ["10^^", ""], [" ", ""], ["(10^^)^", ""]]

     ]
     
     * @param thresholds ( [Decimal, Decimal | boolean, number, Decimal, number][] ) Again, each entry in the outer array corresponds to one of the six operators.
        In the inner arrays, thresholds[n][0] is the value at which the number being added to/multiplied by/raised to a power/etc., the "argument", switches from being written in plainInnerNotation to being written within the Increasing Operator notation itself, and thresholds[n][3] is that notation switch threshold for the amount of times the operator is applied once the nesting form begins.
        thresholds[n][1] is a forced maximum on the argument, i.e. if the argument is not less than this value then another instance of the operator is applied to get it back below the threshold. thresholds[n][2] is the highest amount of times an operator can be applied before it switches to nesting form,
        and thresholds[n][4] is the highest amount of "nestings" (i.e. where the amount of times the operator is applied is itself written in this notation with this operator being applied) before forcefully switching to the next operator.
        thresholds[n][1] can be a boolean instead of a Decimal: if it's false then it's set to the maximum argument of the PREVIOUS operator, and if it's true then it's set to the maximum value before nesting form begins of the previous operator (thresholds[0][1] has no previous operator to refer to, so if it's a boolean then it's set to maximums[0]).
        Default is an array containing six entries that are all [10, true, 4, 10, 2].
     * @param rootBehavior ( null | [boolean, Decimal, Decimal | boolean] ) If this is null (which is the default), then roots behave like the other operators, applying multiple times then switching to nesting form. However, if this is not null, then roots aren't applied multiple times: instead, the degree of the root increases for larger numbers.
        rootBehavior[1] is how much the root degree changes by each time it increases; this value is added to the degree is rootBehavior[0] is false, but it multiplies the degree if rootBehavior[0] is true. rootBehavior[2] is the maximum height of the root before nesting in the height; thresholds[2][2] is ignored if rootBehavior is not null, but thresholds[2][4] still applies.
        rootBehavior[2] can be a boolean, which follows the same rules as thresholds[2][1] does as a boolean.
     * @param superRootBehavior ( null | [boolean, Decimal, Decimal | boolean] ) Same as rootBehavior, but for super-roots instead. Default is null.
     * @param roundings ( [DecimalSource | ((value : Decimal) => Decimal), DecimalSource | ((value : Decimal) => Decimal), DecimalSource | ((value : Decimal) => Decimal)][] ) For a given operator, if rounding[n][0] is not 0, then the argument is rounded to the nearest multiple of that value if we're not in nesting form yet. If roundings[n][0] is a function, then the argument is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of.
     * roundings[n][1] and roundings[n][2] are similar, but [n][1] is for the argument in nesting form and [n][2] is for the amount of times the operator is applied in nesting form. Default is an array consisting of six [0, 0, 0]s, i.e. no rounding occurs.
     * @param preAdditionFormats ( [Decimal, string, string, string, string, (value : Decimal) => boolean, Notation][] ) Well, that's certainly a confusing type for this parameter, isn't it? Let me explain.
     * This parameter is used to format numbers before the operator begins, for the sake of notations like Omega and Fours. When one of these formats is applied, the number is subtracted by a certain amount and displayed surrounded by some strings corresponding to that amount.
     * Here's what each entry does:
     * preAdditionFormats[n][0] is the value that that format begins being used at, which is also the amount the number is subtracted by.
     * preAdditionFormats[n][1] and [n][2] go before and after the number respectively. preAdditionFormats[n][3] and [n][4] also go before and after the number respectively, on the inside of the gap between [n][1] and [n][2]. (in other words, the writing goes [n][1], [n][3], number, [n][4], [n][2]).
     * The reason [n][3] and [n][4] exist is because of [n][5], a Decimal => boolean function. If this function returns true, then the number is shown, but if it returns false, the number isn't shown. [n][3] and [n][4] are only shown if the number is shown, but [n][1] and [n][2] are shown even if the number isn't.
     * Finally, [n][6] is the notation that the number is formatted in within this expression.
     * All of this means nothing by default, though, since the default for preAdditionFormats is [], i.e. there are no preAdditionFormats by default.
     * @param nestingBefore ( boolean[] ) For each entry of this array (each entry corresponds to one of the six operators), if that entry is true, then when that operator switches to nesting form, the amount of times the operator is applied is written before the argument instead of after. Default is [true, true, false, true, false, true]. If less than six entries are provided, the remaining ones are set to their default values.
     * @param parenthesize ( [[string, string, boolean], [string, string, boolean], [string, string, boolean]][] ) Each entry in the outer array corresponds to one of the six operators, so let's focus on what's inside each entry.
     * Each entry consists of three [string, string, boolean] arrays, used to add parentheses to the argument and application number of an operator.
     * parenthesize[n][0][0] goes before the argument, parenthesize[n][0][1] goes afterwards, and parenthesize[n][0][2] determines when the parentheses start showing up:
     * if it's false then the parentheses only appear once the argument starts being written with Increasing Operator notation itself, but if it's true then the parentheses are always there (If you don't want the parentheses at all, just set the two strings to empty strings).
     * parenthesize[n][0] is for the argument before nesting form activates, parenthesize[n][1] is for the argument in nesting form, and parenthesize[n][2] is for the amount of times the operator is applied in nesting form.
     * @param argumentShown ( [(value : Decimal) => boolean, (value : Decimal) => boolean, [string, string]?, [string, string]?][] ) This parameter allows you to set times when the argument is not shown. As usual, each entry of the outer array corresponds to one of the six operators.
     * In each inner array, argumentShown[n][0] and [n][1] are Decimal -> boolean functions; the argument is only shown if that function returns true. [n][0] is for before nesting form, [n][1] is for during nesting form.
     * If the argument is not shown before nesting form, then argumentShown[n][2] and [n][3] replace operatorChars[n][0] and [n][1] respectively (for nesting form, the part with the argument is simply omitted, meaning operatorChars[n][2] is not used but [n][3] is).
     * @param plainInnerNotation ( Notation ) The notation that regular numbers, i.e. numbers below maximums[0], are written in. DefaultNotation is the default.
     * @param innerNotations ( Notation | [Notation, Notation, Notation][] ) Each entry in the outer array corresponds to one of the six operators.
     * innerNotations[n][0] is the notation that the argument for that operator is written in before switching to nesting form, innerNotations[n][1] is the notation the argument is written in in nesting form, and innerNotations[n][2] is the notation the operator number is written in in nesting form. These notations only apply before the argument and operator number's notational thresholds are reached.
     * You can also just input a single notation here and it will be used everywhere. (I wanted to also allow inputting a single [Notation, Notation, Notation], but it seems TypeScript has no way of safely distinguishing arrays from arrays of arrays...), which is what's done by default:
     * the default value of this parameter is DefaultNotation.
     * @param minnum ( Decimal ) Values smaller than this are written in terms of their reciprocal. The default is the reciprocal of maximums[0].
     * @param recipString ( [string, string] | null ) When a number is written in terms of its reciprocal, recipString[0] goes before that reciprocal, recipString[1] goes afterwards. Default is null, which means recipString is set to ["1 / (", ")"], where that 1 is however 1 is written in plainInnerNotation.
     */
export class IncreasingOperatorNotation extends Notation {
    private _bases : Decimal[];
    private _maximums : Decimal[];
    private _operatorChars : [[string, string], [string, string], [string, string], [string, string]][];
    private _thresholds ! : [Decimal, Decimal, number, Decimal, number][]; //setMaximums in the constructor assigns this
    private _rootBehavior : null | [boolean, Decimal, Decimal | boolean];
    private _superRootBehavior : null | [boolean, Decimal, Decimal | boolean];
    private _roundings : [DecimalSource | ((value : Decimal) => Decimal), DecimalSource | ((value : Decimal) => Decimal), DecimalSource | ((value : Decimal) => Decimal)][];
    private _preAdditionFormats : [Decimal, string, string, string, string, (value : Decimal) => boolean, Notation][];
    private _nestingBefore : boolean[];
    private _parenthesize : [[string, string, boolean], [string, string, boolean], [string, string, boolean]][];
    private _argumentShown : [(value : Decimal) => boolean, (value : Decimal) => boolean, [string, string]?, [string, string]?][];
    public plainInnerNotation : Notation;
    private _innerNotations : [Notation, Notation, Notation][];
    public minnum : Decimal;
    public recipString : [string, string] | null;

    private argumentMaximums ! : Decimal[]; //setMaximums in the constructor assigns this
    private symbolicMaximums ! : Decimal[]; //setMaximums in the constructor assigns this
    private nestingMaximums ! : Decimal[]; //setMaximums in the constructor assigns this
    private unconvertedThresholds : [Decimal, Decimal | boolean, number, Decimal, number][];

    constructor(
        bases : DecimalSource | DecimalSource[] = 10,
        maximums : DecimalSource[] = [10, Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf],
        operatorChars : [[string, string], [string, string], [string, string], [string, string]][] = [
            [["10 + ", ""], ["10 + ", ""], [" + ", ""], ["10 * ", ""]],
            [["10 * ", ""], ["10 * ", ""], [" * ", ""], ["10^", ""]],
            [["", "^2"], ["(", ")^2"], ["", ""], ["^2^", ""]],
            [["10^", ""], ["10^", ""], [" ", ""], ["(10^)^", ""]],
            [["", "^^2"], ["(", ")^^2"], ["", ""], [" (^^2)^", ""]],
            [["10^^", ""], ["10^^", ""], [" ", ""], ["(10^^)^", ""]]
        ],
        thresholds : [DecimalSource, DecimalSource | boolean, number, DecimalSource, number][] = [
            [10, true, 4, 10, 2],
            [10, true, 4, 10, 2],
            [10, true, 4, 10, 2],
            [10, true, 4, 10, 2],
            [10, true, 4, 10, 2],
            [10, true, 4, 10, 2]
        ],
        rootBehavior : null | [boolean, DecimalSource, DecimalSource | boolean] = null,
        superRootBehavior : null | [boolean, DecimalSource, DecimalSource | boolean] = rootBehavior,
        roundings : [DecimalSource | ((value : Decimal) => Decimal), DecimalSource | ((value : Decimal) => Decimal), DecimalSource | ((value : Decimal) => Decimal)][] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        preAdditionFormats : [DecimalSource, string, string, string, string, (value : Decimal) => boolean, Notation][] = [],
        nestingBefore : boolean[] = [true, true, false, true, false, true],
        parenthesize : [[string, string, boolean], [string, string, boolean], [string, string, boolean]][] = [
            [["", "", false], ["", "", false], ["(", ")", false]],
            [["(", ")", false], ["(", ")", false], ["(", ")", false]],
            [["(", ")", false], ["(", ")", false], ["(", ")", false]],
            [["(", ")", false], ["", "", false], ["(", ")", false]],
            [["(", ")", false], ["", "", false], ["(", ")", false]],
            [["(", ")", false], ["", "", false], ["(", ")", false]]
        ],
        argumentShown : [(value : Decimal) => boolean, (value : Decimal) => boolean, [string, string]?, [string, string]?][] = [],
        plainInnerNotation : Notation = new DefaultNotation(),
        innerNotations : Notation | [Notation, Notation, Notation][] = new DefaultNotation(),
        minnum : DecimalSource | undefined = undefined,
        recipString : [string, string] | null = null,
    ) { //Normally I make these constructors call the set methods, but so many set methods call setMaximums that I think it's best to have the constructor do things in full here
        super();
        if (!Array.isArray(bases)) bases = [bases];
        this._bases = bases.map(toDecimal);
        while (this._bases.length < 6) {
            if (this._bases.length == 0) this._bases.push(Decimal.dTen);
            if (this._bases.length == 1) this._bases.push(this._bases[0]);
            if (this._bases.length == 2) this._bases.push(Decimal.dTwo); //Default root height is 2
            if (this._bases.length == 3) this._bases.push(this._bases[1]);
            if (this._bases.length == 4) this._bases.push(this._bases[2]); //Default super-root height matches root height
            if (this._bases.length == 5) this._bases.push(this._bases[3]);
        }
        if (this._bases[0].lte(0)) throw new RangeError("Addition base <= 0 in Increasing Operator notation");
        if (this._bases[1].lte(1)) throw new RangeError("Multiplication base <= 1 in Increasing Operator notation");
        if (this._bases[2].lte(1)) throw new RangeError("Root height <= 1 in Increasing Operator notation");
        if (this._bases[3].lte(1.44466786100976613366)) throw new RangeError("Exponent base <= e^(1/e) in Increasing Operator notation");
        if (this._bases[4].lte(1)) throw new RangeError("Super-root height <= 1 in Increasing Operator notation");
        if (this._bases[5].lte(1.44466786100976613366)) throw new RangeError("Tetration base <= e^(1/e) in Increasing Operator notation");
        this._maximums = maximums.map(toDecimal);
        while (this._maximums.length < 6) {
            if (this._maximums.length == 0) this._maximums.push(this._bases[0]);
            else this._maximums.push(Decimal.dInf);
        }
        this._operatorChars = operatorChars;
        let defaultOperatorChars : [[string, string], [string, string], [string, string], [string, string]][] = [
            [["10 + ", ""], ["10 + ", ""], [" + ", ""], ["10 * ", ""]],
            [["10 * ", ""], ["10 * ", ""], [" * ", ""], ["10^", ""]],
            [["", "^2"], ["(", ")^2"], ["", ""], ["^2^", ""]],
            [["10^", ""], ["10^", ""], [" ", ""], ["(10^)^", ""]],
            [["", "^^2"], ["(", ")^^2"], ["", ""], [" (^^2)^", ""]],
            [["10^^", ""], ["10^^", ""], [" ", ""], ["(10^^)^", ""]]
        ];
        while (this._operatorChars.length < 6) this._operatorChars.push(defaultOperatorChars[this._operatorChars.length]);
        if (rootBehavior === null) this._rootBehavior = rootBehavior;
        else { // I have to jump through a lot of hoops to make TypeScript happy here
            let RB0 = rootBehavior[0];
            let RB1 = toDecimal(rootBehavior[1]);
            let RB2 = (typeof rootBehavior[2] == "boolean") ? rootBehavior[2] : toDecimal(rootBehavior[2])
            this._rootBehavior = [RB0, RB1, RB2];
        }
        if (superRootBehavior === null) this._superRootBehavior = superRootBehavior;
        else { // I have to jump through a lot of hoops to make TypeScript happy here
            let RB0 = superRootBehavior[0];
            let RB1 = toDecimal(superRootBehavior[1]);
            let RB2 = (typeof superRootBehavior[2] == "boolean") ? superRootBehavior[2] : toDecimal(superRootBehavior[2])
            this._superRootBehavior = [RB0, RB1, RB2];
        }
        while (roundings.length < 6) roundings.push([Decimal.dZero, Decimal.dZero, Decimal.dZero]);
        this._roundings = roundings;
        this._preAdditionFormats = preAdditionFormats.map((value) => ([toDecimal(value[0]), value[1], value[2], value[3], value[4], value[5], value[6]]));
        this._preAdditionFormats = this._preAdditionFormats.sort((value, other) => (Decimal.cmp(value[0], other[0])));
        this.unconvertedThresholds = [];
        for (let t = 0; t < thresholds.length; t++) {
            let possibleBool = thresholds[t][1]
            if ((typeof possibleBool == "boolean")) this.unconvertedThresholds.push([toDecimal(thresholds[t][0]), possibleBool, thresholds[t][2], toDecimal(thresholds[t][3]), thresholds[t][4]]);
            else this.unconvertedThresholds.push([toDecimal(thresholds[t][0]), toDecimal(possibleBool), thresholds[t][2], toDecimal(thresholds[t][3]), thresholds[t][4]]);
        }
        if (this.unconvertedThresholds.length == 0) this.unconvertedThresholds.push([Decimal.dTen, true, 4, Decimal.dTen, 2]);
        while (this.unconvertedThresholds.length < 6) this.unconvertedThresholds.push(this.unconvertedThresholds[this.unconvertedThresholds.length - 1]);
        this.setMaximums(this.unconvertedThresholds);
        this._nestingBefore = nestingBefore;
        while (this._nestingBefore.length < 6) {
            if (this._nestingBefore.length == 0 || this._nestingBefore.length % 2 == 1) this._nestingBefore.push(true);
            else this._nestingBefore.push(false);
        }
        this._parenthesize = parenthesize;
        while (this._parenthesize.length < 6) this._parenthesize.push([["", "", false], ["", "", false], ["", "", false]]);
        this.plainInnerNotation = plainInnerNotation;
        this._argumentShown = argumentShown;
        while (this._argumentShown.length < 6) this._argumentShown.push([(value) => true, (value) => true]);
        if (!Array.isArray(innerNotations)) innerNotations = [[innerNotations, innerNotations, innerNotations]];
        this._innerNotations = innerNotations;
        if (this._innerNotations.length == 0) this._innerNotations.push([new DefaultNotation(), new DefaultNotation(), new DefaultNotation()])
        while (this._innerNotations.length < 6) this._innerNotations.push(this._innerNotations[this._innerNotations.length - 1]);
        if (minnum === undefined) this.minnum = this._maximums[0].recip();
        else this.minnum = toDecimal(minnum);
        this.recipString = recipString;
    }

    public name = "Increasing Operator Notation";

    private setMaximums(thresholds? : [Decimal, Decimal | boolean, number, Decimal, number][]) {
        let argumentMaximums : Decimal[] = []; //The highest number allowed to stand on its own on each operator before another symbol of that operator is brought in
        let symbolicMaximums : Decimal[] = []; //The highest number on each operator before its nesting begins
        let nestingMaximums : Decimal[] = []; //The limit of each operator before moving to the next operator
        if (thresholds != undefined) this._thresholds = [];
        let possibleBool : Decimal | boolean;
        //Addition maximums
        if (thresholds !== undefined) {
            possibleBool = thresholds[0][1];
            if (typeof possibleBool == "boolean") possibleBool = this._maximums[0];
            this._thresholds.push([thresholds[0][0], possibleBool, thresholds[0][2], thresholds[0][3], thresholds[0][4]]);
        }
        argumentMaximums.push(this._thresholds[0][0].min(this._maximums[1]).max(this._maximums[0]).min(this._thresholds[0][1]));
        if (!argumentMaximums[0].isFinite()) argumentMaximums[0] = Decimal.dInf;
        symbolicMaximums.push(argumentMaximums[0].plus(this._bases[0].mul(this._thresholds[0][2])));
        if (!symbolicMaximums[0].isFinite()) symbolicMaximums[0] = Decimal.dInf;
        nestingMaximums.push(symbolicMaximums[0].max(this._thresholds[0][3]).mul(this._bases[0].pow(this._thresholds[0][4])));
        if (!nestingMaximums[0].isFinite()) nestingMaximums[0] = Decimal.dInf;
        nestingMaximums[0] = nestingMaximums[0].min(this._maximums[1]).max(this._maximums[0]);
        if (!nestingMaximums[0].isFinite()) nestingMaximums[0] = Decimal.dInf;
        //Multiplication maximums
        if (thresholds !== undefined) {
            possibleBool = thresholds[1][1];
            if (possibleBool === false) possibleBool = argumentMaximums[0];
            else if (possibleBool === true) possibleBool = symbolicMaximums[0];
            this._thresholds.push([thresholds[1][0], possibleBool, thresholds[1][2], thresholds[1][3], thresholds[1][4]]);
        }
        argumentMaximums.push(this._thresholds[1][0].min(this._maximums[2]).max(nestingMaximums[0]).min(this._thresholds[1][1]));
        if (!argumentMaximums[1].isFinite()) argumentMaximums[1] = Decimal.dInf;
        symbolicMaximums.push(argumentMaximums[1].mul(this._bases[1].pow(this._thresholds[1][2])));
        if (!symbolicMaximums[1].isFinite()) symbolicMaximums[1] = Decimal.dInf;
        nestingMaximums.push(Decimal.iteratedexp(this._bases[1], this._thresholds[1][4], symbolicMaximums[1].max(this._thresholds[1][3]), true));
        if (!nestingMaximums[1].isFinite()) nestingMaximums[1] = Decimal.dInf;
        nestingMaximums[1] = nestingMaximums[1].min(this._maximums[2]).max(nestingMaximums[0]);
        if (!nestingMaximums[1].isFinite()) nestingMaximums[1] = Decimal.dInf;
        //Root maximums
        if (thresholds !== undefined) {
            possibleBool = thresholds[2][1];
            if (possibleBool === false) possibleBool = argumentMaximums[1];
            else if (possibleBool === true) possibleBool = symbolicMaximums[1];
            this._thresholds.push([thresholds[2][0], possibleBool, thresholds[2][2], thresholds[2][3], thresholds[2][4]]);
        }
        argumentMaximums.push(this._thresholds[2][0].min(this._maximums[3]).max(nestingMaximums[1]).min(this._thresholds[2][1]));
        if (!argumentMaximums[2].isFinite()) argumentMaximums[2] = Decimal.dInf;
        if (this._rootBehavior === null) {
            symbolicMaximums.push(argumentMaximums[2].pow(this._bases[2].pow(this._thresholds[2][2])));
            if (!symbolicMaximums[2].isFinite()) symbolicMaximums[2] = Decimal.dInf;
            let nestedRootMaximum = symbolicMaximums[2].max(this._thresholds[2][3]);
            for (let r = 0; r < this._thresholds[2][4]; r++) nestedRootMaximum = argumentMaximums[2].pow(this._bases[2].pow(nestedRootMaximum));
            nestingMaximums.push(nestedRootMaximum);
        }
        else {
            possibleBool = this._rootBehavior[2];
            if (possibleBool === false) possibleBool = argumentMaximums[1];
            else if (possibleBool === true) possibleBool = symbolicMaximums[1];
            let maxDegree = Decimal.min(possibleBool, nestingMaximums[1]);
            symbolicMaximums.push(argumentMaximums[2].pow(maxDegree));
            if (!symbolicMaximums[2].isFinite()) symbolicMaximums[2] = Decimal.dInf;
            let nestedRootMaximum = symbolicMaximums[2];
            for (let r = 0; r < this._thresholds[2][4]; r++) nestedRootMaximum = argumentMaximums[2].pow(nestedRootMaximum);
            nestingMaximums.push(nestedRootMaximum);
        }
        if (!nestingMaximums[2].isFinite()) nestingMaximums[2] = Decimal.dInf;
        nestingMaximums[2] = nestingMaximums[2].min(this._maximums[3]).max(nestingMaximums[1]);
        if (!nestingMaximums[2].isFinite()) nestingMaximums[2] = Decimal.dInf;
        //Exponentiation maximums
        if (thresholds !== undefined) {
            possibleBool = thresholds[3][1];
            if (possibleBool === false) possibleBool = argumentMaximums[2];
            else if (possibleBool === true) possibleBool = symbolicMaximums[2];
            this._thresholds.push([thresholds[3][0], possibleBool, thresholds[3][2], thresholds[3][3], thresholds[3][4]]);
        }
        argumentMaximums.push(this._thresholds[3][0].min(this._maximums[4]).max(nestingMaximums[2]).min(this._thresholds[3][1]));
        if (!argumentMaximums[3].isFinite()) argumentMaximums[3] = Decimal.dInf;
        symbolicMaximums.push(Decimal.iteratedexp(this._bases[3], this._thresholds[3][2], argumentMaximums[3], true));
        if (!symbolicMaximums[3].isFinite()) symbolicMaximums[3] = Decimal.dInf;
        nestingMaximums.push(Decimal.pentate(this._bases[3], this._thresholds[3][4], symbolicMaximums[3].max(this._thresholds[3][3]), true));
        if (!nestingMaximums[3].isFinite()) nestingMaximums[3] = Decimal.dInf;
        nestingMaximums[3] = nestingMaximums[3].min(this._maximums[4]).max(nestingMaximums[2]);
        if (!nestingMaximums[3].isFinite()) nestingMaximums[3] = Decimal.dInf;
        //Super-root maximums
        if (thresholds !== undefined) {
            possibleBool = thresholds[4][1];
            if (possibleBool === false) possibleBool = argumentMaximums[3];
            else if (possibleBool === true) possibleBool = symbolicMaximums[3];
            this._thresholds.push([thresholds[4][0], possibleBool, thresholds[4][2], thresholds[4][3], thresholds[4][4]]);
        }
        argumentMaximums.push(this._thresholds[4][0].min(this._maximums[5]).max(nestingMaximums[3]).min(this._thresholds[4][1]));
        if (!argumentMaximums[4].isFinite()) argumentMaximums[4] = Decimal.dInf;
        if (this._superRootBehavior === null) {
            let symbolicSRootMaximum = argumentMaximums[4];
            for (let r = 0; r < this._thresholds[4][2]; r++) symbolicSRootMaximum = Decimal.tetrate(symbolicSRootMaximum, this._bases[4].toNumber(), 1, true);
            symbolicMaximums.push(symbolicSRootMaximum);
            if (!symbolicMaximums[4].isFinite()) symbolicMaximums[4] = Decimal.dInf;
            let nestedSRootMaximum = symbolicMaximums[4].max(this._thresholds[4][3]);
            for (let r = 0; r < this._thresholds[4][4] && nestedSRootMaximum.isFinite(); r++) {
                let currentValue = argumentMaximums[4];
                let iterations = 0;
                while (iterations < nestedSRootMaximum.toNumber()) {
                    currentValue = Decimal.tetrate(currentValue, this._bases[4].toNumber(), 1, true);
                    iterations++;
                    if (currentValue.gte("F10")) {
                        currentValue = currentValue.layeradd10((nestedSRootMaximum.toNumber() - iterations) * Math.ceil(this._bases[4].toNumber() - 1), true);
                        break;
                    }
                }
                nestedSRootMaximum = currentValue;
            }
            nestingMaximums.push(nestedSRootMaximum);
        }
        else {
            possibleBool = this._superRootBehavior[2];
            if (possibleBool === false) possibleBool = argumentMaximums[3];
            else if (possibleBool === true) possibleBool = symbolicMaximums[3];
            let maxDegree = Decimal.min(possibleBool, nestingMaximums[3]);
            symbolicMaximums.push(argumentMaximums[4].tetrate(maxDegree.toNumber(), 1, true));
            if (!symbolicMaximums[4].isFinite()) symbolicMaximums[4] = Decimal.dInf;
            let nestedSRootMaximum = symbolicMaximums[4];
            for (let r = 0; r < this._thresholds[4][4] && nestedSRootMaximum.isFinite(); r++) nestedSRootMaximum = argumentMaximums[4].tetrate(nestedSRootMaximum.toNumber(), 1, true)
            nestingMaximums.push(nestedSRootMaximum);
        }
        if (!nestingMaximums[4].isFinite()) nestingMaximums[4] = Decimal.dInf;
        nestingMaximums[4] = nestingMaximums[4].min(this._maximums[5]).max(nestingMaximums[3]);
        if (!nestingMaximums[4].isFinite()) nestingMaximums[4] = Decimal.dInf;
        //Tetration maximums
        if (thresholds !== undefined) {
            possibleBool = thresholds[5][1];
            if (possibleBool === false) possibleBool = argumentMaximums[4];
            else if (possibleBool === true) possibleBool = symbolicMaximums[4];
            this._thresholds.push([thresholds[5][0], possibleBool, thresholds[5][2], thresholds[5][3], thresholds[5][4]]);
        }
        argumentMaximums.push(this._thresholds[5][0].max(nestingMaximums[4]).min(this._thresholds[5][1]));
        if (!argumentMaximums[5].isFinite()) argumentMaximums[5] = Decimal.dInf;
        let symbolicTetrationMaximum = argumentMaximums[4];
        for (let r = 0; r < this._thresholds[5][2] && symbolicTetrationMaximum.isFinite(); r++) symbolicTetrationMaximum = Decimal.tetrate(this._bases[5], symbolicTetrationMaximum.toNumber(), 1, true);
        symbolicMaximums.push(symbolicTetrationMaximum);
        if (!symbolicMaximums[5].isFinite()) symbolicMaximums[5] = Decimal.dInf;
        nestingMaximums.push(Decimal.dInf); //Tetration is the highest operator here, so no need for a maximum (plus the nesting maximum would be hexational, and that's way above break_eternity's scope)
        this.argumentMaximums = argumentMaximums;
        this.symbolicMaximums = symbolicMaximums;
        this.nestingMaximums = nestingMaximums;
    }

    public formatDecimal(value: Decimal): string {
        if (value.lt(this.minnum) && (value.neq(0) || this._maximums[0].lt(0))) {
            if (value.eq(0)) return this.plainInnerNotation.format(0);
            let recipStr = ["", ""]
            if (this.recipString === null) recipStr = [this.plainInnerNotation.format(1) + " / (", ")"];
            else recipStr = this.recipString;
            return recipStr[0] + this.format(value.recip()) + recipStr[1];
        }
        let operator = -1;
        if (value.gte(this._maximums[0])) {
            operator++;
            while (operator < 5 && value.gte(this.nestingMaximums[operator])) operator++;
        }
        if (operator == -1) {
            if (this._preAdditionFormats.length == 0 || value.lt(this._preAdditionFormats[0][0])) {
                return this.plainInnerNotation.format(value);
            }
            else {
                let prf = 0;
                while (prf < this._preAdditionFormats.length - 1 && value.gte(this._preAdditionFormats[prf + 1][0])) prf++;
                let argument = value.sub(this._preAdditionFormats[prf][0]);
                let result = "";
                if (this._preAdditionFormats[prf][5](argument)) result = this._preAdditionFormats[prf][3] + this._preAdditionFormats[prf][6].format(argument) + this._preAdditionFormats[prf][4];
                result = this._preAdditionFormats[prf][1] + result + this._preAdditionFormats[prf][2];
                return result;
            }
        }
        
        let result = "";
        let argument = Decimal.dZero;
        let operatorNum = Decimal.dZero;
        let argumentStr = "";
        let operatorStr = "";
        let rootHeighting = false;
        if ((operator == 2 && this._rootBehavior !== null) || (operator == 4 && this._superRootBehavior !== null)) rootHeighting = true;
        
        if (operator == 0) {
            operatorNum = value.sub(this.argumentMaximums[0]).div(this._bases[0]).floor().plus(1);
            argument = value.sub(operatorNum.mul(this._bases[0]));
        }
        else if (operator == 1) {
            operatorNum = value.div(this.argumentMaximums[1]).log(this._bases[1]).floor().plus(1);
            argument = value.div(this._bases[1].pow(operatorNum));
        }
        else if (operator == 2) {
            if (this._rootBehavior === null) {
                operatorNum = value.log(this.argumentMaximums[2]).log(this._bases[2]).floor().plus(1);
                argument = value.root(this._bases[2].pow(operatorNum));
            }
            else if (this._rootBehavior[0] === false) {
                operatorNum = value.log(this.argumentMaximums[2]).sub(this._bases[2]).div(this._rootBehavior[1]).plus(1).floor().mul(this._rootBehavior[1]).plus(this._bases[2]);
                argument = value.root(operatorNum);
            }
            else {
                operatorNum = value.log(this.argumentMaximums[2]).div(this._bases[2]).log(this._rootBehavior[1]).plus(1).floor().pow_base(this._rootBehavior[1]).mul(this._bases[2]);
                argument = value.root(operatorNum);
            }
        }
        else if (operator == 3) {
            operatorNum = value.slog(this._bases[3], 100, true).sub(this.argumentMaximums[3].slog(this._bases[3], 100, true)).floor().plus(1);
            argument = (operatorNum.gte(9e15)) ? this.argumentMaximums[3] : value.iteratedlog(this._bases[3], operatorNum.toNumber(), true);
        }
        else if (operator == 4) {
            if (this._superRootBehavior === null) {
                operatorNum = Decimal.slog(value.min(this.argumentMaximums[4]), 10, true).sub(Decimal.slog(Decimal.iteratedexp(10, Math.ceil(this._bases[4].toNumber()) + 1, new Decimal(Number.MAX_SAFE_INTEGER)), 10, true)).div(Math.ceil(this._bases[4].toNumber()) - 1).floor().plus(1).max(0);
                argument = value;
                if (operatorNum.gt(0)) argument = (operatorNum.gte(9e15)) ? this.argumentMaximums[4] : Decimal.iteratedlog(argument, 10, operatorNum.mul(Math.ceil(this._bases[4].toNumber()) - 1).toNumber(), true);
                while (argument.gte(this.argumentMaximums[4])) {
                    operatorNum = operatorNum.plus(1);
                    argument = argument.linear_sroot(this._bases[4].toNumber());
                }
            }
            else if (this._superRootBehavior[0] === false) {
                operatorNum = value.slog(this.argumentMaximums[4]).plus(1).sub(this._bases[4]).div(this._superRootBehavior[1]).floor().mul(this._superRootBehavior[1]).plus(this._bases[4]);
                argument = value.linear_sroot(operatorNum.toNumber());
            }
            else {
                operatorNum = value.slog(this.argumentMaximums[4]).plus(1).div(this._bases[4]).log(this._superRootBehavior[1]).floor().pow_base(this._superRootBehavior[1]).mul(this._bases[4]);
                argument = value.linear_sroot(operatorNum.toNumber());
            }
        }
        else if (operator == 5) {
            let split = hypersplit(value, this._bases[5], [this.argumentMaximums[5], 1, 1]);
            operatorNum = split[3];
            argument = split[0];
        }


        if (!rootHeighting && value.lt(this.symbolicMaximums[operator]) && operatorNum.gte(0)) {
            argument = round(argument, this._roundings[operator][0]);
            if (argument.lt(this._thresholds[operator][0])) argumentStr = this._innerNotations[operator][0].format(argument);
            else argumentStr = this.format(argument);
            if (this._argumentShown[operator][0](argument)) {
                result = argumentStr;
                if (this._parenthesize[operator][0][2] || argument.gte(this._thresholds[operator][0])) result = this._parenthesize[operator][0][0] + result + this._parenthesize[operator][0][1];
                for (let i = 0; i < operatorNum.toNumber(); i++) result = this._operatorChars[operator][(i == 0) ? 0 : 1][0] + result + this._operatorChars[operator][(i == 0) ? 0 : 1][1];
            }
            else {
                let replacementBelow = this._argumentShown[operator][2];
                let replacementAbove = this._argumentShown[operator][3]
                if (replacementBelow === undefined) result = this._operatorChars[operator][0][0] + result + this._operatorChars[operator][0][1];
                else result = replacementBelow[0] + result + replacementBelow[1];
                for (let i = 1; i < operatorNum.toNumber(); i++) {
                    if (replacementAbove === undefined) result = this._operatorChars[operator][1][0] + result + this._operatorChars[operator][1][1];
                    else result = replacementAbove[0] + result + replacementAbove[1];
                }
            }
        }
        else {
            argument = round(argument, this._roundings[operator][1]); 
            operatorNum = round(operatorNum, this._roundings[operator][2]);
            if (argument.lt(this._thresholds[operator][0])) argumentStr = this._innerNotations[operator][1].format(argument);
            else argumentStr = this.format(argument);
            if (this._parenthesize[operator][1][2] || argument.gte(this._thresholds[operator][0])) argumentStr = this._parenthesize[operator][1][0] + argumentStr + this._parenthesize[operator][1][1];
            if (operatorNum.lt(this._thresholds[operator][3])) operatorStr = this._innerNotations[operator][2].format(operatorNum);
            else operatorStr = this.format(operatorNum);
            if (this._parenthesize[operator][2][2] || operatorNum.gte(this._thresholds[operator][3])) operatorStr = this._parenthesize[operator][2][0] + operatorStr + this._parenthesize[operator][2][1];
            argumentStr = this._operatorChars[operator][2][0] + argumentStr + this._operatorChars[operator][2][1];
            operatorStr = this._operatorChars[operator][3][0] + operatorStr + this._operatorChars[operator][3][1];
            if (!(this._argumentShown[operator][1](argument))) result = operatorStr;
            else if (this._nestingBefore[operator]) result = operatorStr + argumentStr;
            else result = argumentStr + operatorStr; 
        }
        return result;
    }

    public get bases() {
        return this._bases;
    }

    public set bases(bases : DecimalSource | DecimalSource[]) {
        if (!Array.isArray(bases)) bases = [bases];
        let basesD = bases.map(toDecimal);
        while (basesD.length < 6) {
            if (basesD.length == 0) basesD.push(Decimal.dTen);
            if (basesD.length == 1) basesD.push(basesD[0]);
            if (basesD.length == 2) basesD.push(Decimal.dTwo); //Default root height is 2
            if (basesD.length == 3) basesD.push(basesD[1]);
            if (basesD.length == 4) basesD.push(basesD[2]); //Default super-root height matches root height
            if (basesD.length == 5) basesD.push(basesD[3]);
        }
        if (basesD[0].lte(0)) throw new RangeError("Addition base <= 0 in Increasing Operator notation");
        if (basesD[1].lte(1)) throw new RangeError("Multiplication base <= 1 in Increasing Operator notation");
        if (basesD[2].lte(1)) throw new RangeError("Root height <= 1 in Increasing Operator notation");
        if (basesD[3].lte(1.44466786100976613366)) throw new RangeError("Exponent base <= e^(1/e) in Increasing Operator notation");
        if (basesD[4].lte(1)) throw new RangeError("Super-root height <= 1 in Increasing Operator notation");
        if (basesD[5].lte(1.44466786100976613366)) throw new RangeError("Tetration base <= e^(1/e) in Increasing Operator notation");
        this._bases = basesD;
        this.setMaximums(this.unconvertedThresholds);
    }

    public get maximums() {
        return this._maximums;
    }

    public set maximums(maximums : DecimalSource[]) {
        let maximumsD = maximums.map(toDecimal);
        while (maximumsD.length < 6) {
            if (maximumsD.length == 0) maximumsD.push(this._bases[0]);
            else maximumsD.push(Decimal.dInf);
        }
        this._maximums = maximumsD;
        this.setMaximums(this.unconvertedThresholds);
    }

    public get operatorChars() {
        return this._operatorChars;
    }

    public set operatorChars(operatorChars : [[string, string], [string, string], [string, string], [string, string]][]) {
        let defaultOperatorChars : [[string, string], [string, string], [string, string], [string, string]][] = [
            [["10 + ", ""], ["10 + ", ""], ["", ""], ["10 * ", " + "]],
            [["10 * ", ""], ["10 * ", ""], ["", ""], ["10^", " * "]],
            [["", "^2"], ["(", ")^2"], ["", ""], ["^2^", ""]],
            [["10^", ""], ["10^", ""], ["", ""], ["(10^)^", " "]],
            [["", "^^2"], ["(", ")^^2"], ["", ""], [" (^^2)^", ""]],
            [["10^^", ""], ["10^^", ""], ["", ""], ["(10^^)^", " "]],
        ];
        while (operatorChars.length < 6) operatorChars.push(defaultOperatorChars[operatorChars.length]);
        this._operatorChars = operatorChars;
    }

    public get thresholds() {
        return this.unconvertedThresholds;
    }

    public set thresholds(thresholds : [DecimalSource, DecimalSource | boolean, number, DecimalSource, number][]) {
        let unconvertedThresholds : [Decimal, boolean | Decimal, number, Decimal, number][] = [];
        for (let t = 0; t < thresholds.length; t++) {
            let possibleBool = thresholds[t][1]
            if ((typeof possibleBool == "boolean")) unconvertedThresholds.push([toDecimal(thresholds[t][0]), possibleBool, thresholds[t][2], toDecimal(thresholds[t][3]), thresholds[t][4]]);
            else unconvertedThresholds.push([toDecimal(thresholds[t][0]), toDecimal(possibleBool), thresholds[t][2], toDecimal(thresholds[t][3]), thresholds[t][4]]);
        }
        if (unconvertedThresholds.length == 0) unconvertedThresholds.push([Decimal.dTen, true, 4, Decimal.dTen, 2]);
        while (unconvertedThresholds.length < 6) unconvertedThresholds.push(unconvertedThresholds[unconvertedThresholds.length - 1]);
        this.unconvertedThresholds = unconvertedThresholds;
        this.setMaximums(this.unconvertedThresholds);
    }

    public get rootBehavior() {
        return this._rootBehavior;
    }

    public set rootBehavior(rootBehavior : null | [boolean, Decimal, Decimal | boolean]) {
        this._rootBehavior = rootBehavior;
        this.setMaximums(this.unconvertedThresholds);
    }

    public get superRootBehavior() {
        return this._superRootBehavior;
    }

    public set superRootBehavior(superRootBehavior : null | [boolean, Decimal, Decimal | boolean]) {
        this._superRootBehavior = superRootBehavior;
        this.setMaximums(this.unconvertedThresholds);
    }

    public get roundings() {
        return this._roundings;
    }

    public set roundings(roundings : [DecimalSource | ((value : Decimal) => Decimal), DecimalSource | ((value : Decimal) => Decimal), DecimalSource | ((value : Decimal) => Decimal)][]) {
        while (roundings.length < 6) roundings.push([Decimal.dZero, Decimal.dZero, Decimal.dZero]);
        this._roundings = roundings;
    }

    public get preAdditionFormats() {
        return this._preAdditionFormats;
    }

    public set preAdditionFormats(preAdditionFormats : [DecimalSource, string, string, string, string, (value : Decimal) => boolean, Notation][]) {
        let preAdditionFormatsD : [Decimal, string, string, string, string, (value: Decimal) => boolean, Notation][] = preAdditionFormats.map((value) => ([toDecimal(value[0]), value[1], value[2], value[3], value[4], value[5], value[6]]));
        this._preAdditionFormats = preAdditionFormatsD.sort((value, other) => (Decimal.cmp(value[0], other[0])));
    }

    public get nestingBefore() {
        return this._nestingBefore;
    }

    public set nestingBefore(nestingBefore : boolean[]) {
        while (nestingBefore.length < 6) {
            if (nestingBefore.length == 0 || nestingBefore.length % 2 == 1) nestingBefore.push(true);
            else nestingBefore.push(false);
        }
        this._nestingBefore = nestingBefore;
    }

    public get parenthesize() {
        return this._parenthesize;
    }

    public set parenthesize(parenthesize : [[string, string, boolean], [string, string, boolean], [string, string, boolean]][]) {
        while (parenthesize.length < 6) parenthesize.push([["(", ")", false], ["(", ")", false], ["(", ")", false]]);
        this._parenthesize = parenthesize;
    }

    public get argumentShown() {
        return this._argumentShown;
    }
    
    public set argumentShown(argumentShown : [(value : Decimal) => boolean, (value : Decimal) => boolean, [string, string]?, [string, string]?][]) {
        while (argumentShown.length < 4) argumentShown.push([(value) => true, (value) => true]);
        this._argumentShown = argumentShown;
    }

    public get innerNotations() {
        return this._innerNotations;
    }

    public set innerNotations(innerNotations : Notation | [Notation, Notation, Notation][]) {
        if (!Array.isArray(innerNotations)) innerNotations = [[innerNotations, innerNotations, innerNotations]];
        if (innerNotations.length == 0) innerNotations.push([new DefaultNotation(), new DefaultNotation(), new DefaultNotation()])
        while (innerNotations.length < 6) innerNotations.push(innerNotations[innerNotations.length - 1]);
        this._innerNotations = innerNotations;
    }
}
const Omega = new IncreasingOperatorNotation(
    8000,
    [8000, Infinity, Infinity, 0, Infinity, 0],
    [
        [["ω^", ""], ["ω^", ""], ["", ""], ["ω(", ")^"]],
        [["ω(", ")"], ["ω(", ")"], ["(", ")"], ["ω[", "]"]],
        [["", ""], ["", ""], ["", ""], ["", ""]],
        [["ω[", "]"], ["ω[", "]"], ["[", "]"], ["ω{", "}"]]
    ], 
    [
        [0, 8000, 3, 10, 5],
        [0, 8000, 0, 100, 5]
    ], null, null, undefined,
    [
        [0, "β<", ">", "", "", (value) => true, new DefaultNotation(0, 0)],
        [1000, "ζ<", ">", "", "", (value) => true, new DefaultNotation(0, 0)],
        [2000, "λ<", ">", "", "", (value) => true, new DefaultNotation(0, 0)],
        [3000, "ψ<", ">", "", "", (value) => true, new DefaultNotation(0, 0)],
        [4000, "Σ<", ">", "", "", (value) => true, new DefaultNotation(0, 0)],
        [5000, "Θ<", ">", "", "", (value) => true, new DefaultNotation(0, 0)],
        [6000, "Ψ<", ">", "", "", (value) => true, new DefaultNotation(0, 0)],
        [7000, "ω<", ">", "", "", (value) => true, new DefaultNotation(0, 0)],
    ], undefined, [], undefined, new DefaultNotation(0, 0), new DefaultNotation(0, 0), 1, ["Ʊ(", ")"]
).setNotationGlobals(undefined, "Ω").setName("Omega")
const OmegaLaTex = new IncreasingOperatorNotation(
    8000,
    [8000, Infinity, Infinity, 0, Infinity, 0],
    [
        [["\\omega^{", "}"], ["\\omega^{", "}"], ["", ""], ["\\omega(", ")\\text{\\char`\\^}"]],
        [["\\omega(", ")"], ["\\omega(", ")"], ["(", ")"], ["\\omega[", "]"]],
        [["", ""], ["", ""], ["", ""], ["", ""]],
        [["\\omega[", "]"], ["\\omega[", "]"], ["[", "]"], ["\\omega{", "}"]]
    ], 
    [
        [0, 8000, 3, 10, 5],
        [0, 8000, 0, 100, 5]
    ], null, null, undefined,
    [
        [0, "\\beta_{", "}", "", "", (value) => true, new DefaultNotation(0, 0)],
        [1000, "\\zeta_{", "}", "", "", (value) => true, new DefaultNotation(0, 0)],
        [2000, "\\lambda_{", "}", "", "", (value) => true, new DefaultNotation(0, 0)],
        [3000, "\\psi_{", "}", "", "", (value) => true, new DefaultNotation(0, 0)],
        [4000, "\\Sigma_{", "}", "", "", (value) => true, new DefaultNotation(0, 0)],
        [5000, "\\Theta_{", "}", "", "", (value) => true, new DefaultNotation(0, 0)],
        [6000, "\\Psi_{", "}", "", "", (value) => true, new DefaultNotation(0, 0)],
        [7000, "\\omega_{", "}", "", "", (value) => true, new DefaultNotation(0, 0)],
    ], undefined, [], undefined, new DefaultNotation(0, 0), new DefaultNotation(0, 0), 1, ["Ʊ(", ")"]
).setNotationGlobals(undefined, "\\Omega").setName("Omega")

  /**
   * Scientific notation. Abbreviates 9 as "9e0" and 10^50 as "1e50". For larger numbers, switches to abbreviations like "e1e17" and eventually "(e^7)1e6", similarly to break_eternity's default toString.
   * @param maxnum ( Decimal ) Only exponents below this value are allowed - anything higher and the exponent itself is abbreviated in scientific notation. Default is 1e12.
   * @param max_es_in_a_row ( number ) If the scientific representation would have more e's at the beginning than this, those e's are made into an e^n expression. Default is 5.
   * @param rounding ( DecimalSource | ((value : Decimal) => Decimal) ) The mantissa is rounded to the nearest multiple of this value. If this parameter is a function, then the mantissa is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0.
   * @param engineerings ( Decimal | Decimal[] ) Either a DecimalSource or an array of DecimalSources; default is 1. This parameter controls the allowed exponent values: if it's three then the exponent will always be a multiple of 3, as in engineering notation. If this is an array, then multiples of those values are added from greatest to least to get the allowed values: for example, if engineerings is [5, 2], then the permitted exponent values are 2, 4, 5, 7, 9, 10, 12, 14... and so on, i.e. multiples of 5 plus a multiple of 2 less than 5 (which may be 0). Default is 1, which corresponds to regular scientific notation.
   * @param mantissaPower ( Decimal ) Normally, the mantissa in scientific notation is bounded by 1 and the base, which corresponds to the default mantissaPower of 0. If mantissaPower is 1, the bounds are base and base^2, if mantissaPower is 2 then the bounds are base^2 and base^3, and so on. For example, a number normally represented as "2.357e224" would become "23.57e223" with 1 mantissaPower and "235.7e222" with 2 mantissaPower.
   * @param iteration_zero ( boolean ) If this is true, then numbers less than maxnum will ignore the scientific notation and jump directly to the innerNotation - useful if you want 2 to just be abbreviated as "2" instead of "2e0". Default is false.
   * @param base ( Decimal ) Scientific notation normally works in powers of 10, but you can change this value to change that. Default is 10. For example, set this to 9, and 81 becomes "1e2".
   * @param expChars ( [[string, string], [string | boolean, string | boolean], [string, string]] ) An array of three pairs of strings that are used as the between characters for scientific notation. In each pair, the first entry goes before the exponent, the second entry goes after the exponent. expChars[0] takes the place of the e in "1e10", expChars[1] takes the place of the first e in "e1e10", and expChars[2] takes the place of the (e^) in (e^10)4. If expChars[1][0] is a boolean instead of a string: if it's false, then expChars[1][0] is set to be expChars[0][0] with the way mantissaInnerNotation formats 1 tacked on the beginning, and if it's true than the 1 is tacked on the end instead. Likewise for expChars[1][1] (expChars[0][1] with a 1 on it). Default is [["e", ""], ["e", ""], ["(e^", ")"]].
   * @param negExpChars ( null | [[string, string] | boolean, [string, string]] ) This can either be null or a pair of pairs of strings (in which the first pair of strings may be a boolean instead). Ignore this parameter if it's null, which is the default. If it's a pair of pairs of strings, then the first pair is used like expChars[0] but for negative exponents (so if it's ["d", ""], then 2e-4 would be 2d4 instead), and the second pair is used on small numbers whose reciprocals are large enough to need expChars[1], in which case the second pair indicates that a reciprocal has been taken. If negExpChars[0] is a boolean instead, then if it's true the notation goes directly to the reciprocal behavior for all inputs less than 1, while if it's false then single-iteration inputs don't use negExpChars but multi-iteration ones still use reciprocal behavior.
   * @param expBefore ( boolean ) If this parameter is true, the exponent comes before the mantissa instead of after. Default is false.
   * @param superexpAfter ( boolean ) If this parameter is true, (e^n) expressions come after the rest of the number instead of before. Default is false.
   * @param expMult ( Decimal ) Each exponentiation in the process is multiplied by this value. Default is 1.
   * @param mantissaInnerNotation ( Notation ) The notation that the numbers within the mantissas are themselves notated with. DefaultNotation is the default.
   * @param exponentInnerNotation ( Notation ) The notation that the highest exponent is itself notated with. Is the same as mantissaInnerNotation by default.
   * @param superexponentInnerNotation ( Notation ) The notation that the number in an (e^n) expression is itself notated with. Is the same as exponentInnerNotation by default.
   */
export class ScientificNotation extends Notation {
    private _maxnum : Decimal = new Decimal(1e12);
    public max_es_in_a_row = 5;
    public rounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero;
    private _engineerings : Decimal[] = [Decimal.dOne];
    public mantissaPower : Decimal = Decimal.dZero;
    public iteration_zero : boolean = false;
    private _base : Decimal = Decimal.dTen;
    private _expChars : [string, string][] = [["e", ""], ["e", ""], ["(e^", ")"]];
    public negExpChars : null | [[string, string] | boolean, [string, string]] = null;
    public expBefore : boolean = false;
    public superexpAfter : boolean = false;
    private _expMult : Decimal = Decimal.dOne;
    public mantissaInnerNotation : Notation = new DefaultNotation();
    public exponentInnerNotation : Notation = this.mantissaInnerNotation;
    public superexponentInnerNotation : Notation = this.exponentInnerNotation;
    private unconvertedExpChars : [[string, string], [string | boolean, string | boolean], [string, string]];

    constructor(
        maxnum: DecimalSource = 1e12,
        max_es_in_a_row: number = 5,
        rounding : DecimalSource | ((value : Decimal) => Decimal) = 0,
        engineerings : DecimalSource | DecimalSource[] = 1, 
        mantissaPower : DecimalSource = 0,
        iteration_zero : boolean = false,
        base : DecimalSource = 10, 
        expChars : [[string, string], [string | boolean, string | boolean], [string, string]] = [["e", ""], ["e", ""], ["(e^", ")"]],
        negExpChars : null | [[string, string] | boolean, [string, string]] = null,
        expBefore : boolean = false,
        superexpAfter : boolean = false,
        expMult : DecimalSource = 1,
        mantissaInnerNotation : Notation = new DefaultNotation(),
        exponentInnerNotation : Notation = mantissaInnerNotation,
        superexponentInnerNotation : Notation = exponentInnerNotation
        ) {
      super();
      this.maxnum = maxnum;
      this.max_es_in_a_row = max_es_in_a_row;
      this.rounding = rounding;
      this.engineerings = engineerings;
      this.mantissaPower = toDecimal(mantissaPower);
      this.iteration_zero = iteration_zero;
      this._base = toDecimal(base);
      this.expBefore = expBefore;
      this.superexpAfter = superexpAfter;
      this.expMult = expMult;
      this.mantissaInnerNotation = mantissaInnerNotation;
      this.exponentInnerNotation = exponentInnerNotation;
      this.superexponentInnerNotation = superexponentInnerNotation;
      this.unconvertedExpChars = expChars;
      this.expChars = expChars;
      this.negExpChars = negExpChars;
    }

    public name = "Scientific Notation";
  
    public formatDecimal(value: Decimal): string {
      if (value.eq(0)) return this.mantissaInnerNotation.format(0);
      if (this.iteration_zero && value.lt(this._maxnum) && value.gt(this._maxnum.recip())) return this.mantissaInnerNotation.format(value);
      let result = "";
      if (multabs(value).lt(Decimal.pow(this._base, this._maxnum))) {
        let [mantissa, exponent] = scientifify(value, this._base, this.rounding, this.mantissaPower, this._engineerings, this._expMult);
        let beforeChar = this._expChars[0][0];
        let afterChar = this._expChars[0][1];
        if (exponent.lt(0) && this.negExpChars !== null && this.negExpChars[0] !== false) {
          if (this.negExpChars[0] === true) return this.negExpChars[1][0] + this.format(value.recip()) + this.negExpChars[1][1];
          beforeChar = this.negExpChars[0][0];
          afterChar = this.negExpChars[0][1];
          exponent = exponent.neg();
        }
        let mantissaStr = this.mantissaInnerNotation.format(mantissa);
        let exponentStr = this.exponentInnerNotation.format(exponent);
        if (this.expBefore) result = beforeChar + exponentStr + afterChar + mantissaStr;
        else result = mantissaStr + beforeChar + exponentStr + afterChar;
      }
      else {
        let negExp = false;
        if (value.lt(1)) {
          if (this.negExpChars != null) return this.negExpChars[1][0] + this.format(value.recip()) + this.negExpChars[1][1];
          negExp = true;
          let [m, e] = scientifify(value, this._base, this.rounding, this.mantissaPower, this._engineerings, this._expMult);
          value = Decimal.pow(this._base, e.neg()).mul(m);
        }
        let added_es = multslog(value, this._base, this._expMult).sub(multslog(this._maxnum, this._base, this._expMult)).floor().toNumber();
        value = (added_es > 9e15) ? this._maxnum : iteratedmultlog(value, this._base, added_es, this._expMult);
        if (value.isNan()) value = this._maxnum; // Quick fix
        while (value.gte(Decimal.pow(this._base, this._maxnum))) {
          added_es += 1;
          value = iteratedmultlog(value, this._base, 1, this._expMult);
        }
        if (negExp) value = value.neg();
        result = this.format(value)
        if (added_es <= this.max_es_in_a_row) {
            for (let i = 0; i < added_es; i++) {
              result = this._expChars[1][0] + result + this._expChars[1][1];
            }
        }
        else {
            let eStr = this.superexponentInnerNotation.format(added_es);
            eStr = this._expChars[2][0] + eStr + this._expChars[2][1];
            if (this.superexpAfter) result = result + eStr;
            else result = eStr + result; 
        }
      }
      return result;
    }

    public get maxnum() {
      return this._maxnum;
    }

    public set maxnum(maxnum: DecimalSource) {
      let maxnumD = toDecimal(maxnum);
      if (maxnumD.lte(0)) throw new RangeError("Nonpositive maxnum in Scientific Notation");
      this._maxnum = maxnumD;
    }

    public get engineerings() {
      return this._engineerings;
    }
  
    public set engineerings(engineerings : DecimalSource | DecimalSource[]) {
      if (!Array.isArray(engineerings)) engineerings = [engineerings];
      if (engineerings.length == 0) {
        this._engineerings = [Decimal.dOne];
        return;
      }
      let engineeringsD : Decimal[] = engineerings.map(toDecimal);
      this._engineerings = engineeringsD.sort(function(a, b){
          if (a.lt(b)) return -1;
          else if (a.eq(b)) return 0;
          else return 1;
      }).reverse();
    }

    public get base() {
      return this._base;
    }

    public set base(base : DecimalSource) {
      let baseD = toDecimal(base);
      if (baseD.pow(this._expMult.recip()).lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work for Scientific Notation");
      this._base = baseD;
    }

    public get expMult() {
      return this._expMult;
    }

    public set expMult(expMult : DecimalSource) {
      let expMultD = toDecimal(expMult);
      if (expMultD.eq(0)) throw new RangeError("expMult should not be zero");
      if (this._base.pow(expMultD.recip()).lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work for Scientific Notation");
      this._expMult = expMultD;
    }  

    public get expChars() {
      return this.unconvertedExpChars;
    }
  
    public set expChars(input : [[string, string], [string | boolean, string | boolean], [string, string]]) {
      let one = this.mantissaInnerNotation.format(1);
      let expChars : [string, string][] = [];
      expChars.push(input[0]);
      expChars.push(["", ""]);
      if (typeof input[1][0] == "string") expChars[1][0] = input[1][0];
      else if (input[1][0] === false) expChars[1][0] = one + input[0][0];
      else if (input[1][0] === true) expChars[1][0] = input[0][0] + one;
      if (typeof input[1][1] == "string") expChars[1][1] = input[1][1];
      else if (input[1][1] === false) expChars[1][1] = one + input[0][1];
      else if (input[1][1] === true) expChars[1][1] = input[0][1] + one;
      expChars.push(input[2]);
      this._expChars = expChars;
    }

  }

  /**
   * This notation performs scientific notation a certain number of times. 1 iteration means the number is in the form AeB (where A and B are abbreviated using the innerNotation), 2 iterations means the number is in the form AeBeC, and so on.
   * @param iterations ( number ! ) The amount of iterations.
   * @param max_es_in_a_row ( number ) If the scientific representation would have more e's at the beginning than this, those e's are made into an e^n expression. Default is 5.
   * @param rounding ( DecimalSource | ((value : Decimal) => Decimal) ) The mantissa is rounded to the nearest multiple of this value. If this parameter is a function, then the mantissa is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0.
   * @param engineerings ( Decimal | Decimal[] ) Either a DecimalSource or an array of DecimalSources; default is 1. This parameter controls the allowed exponent values: if it's three then the exponent will always be a multiple of 3, as in engineering notation. If this is an array, then multiples of those values are added from greatest to least to get the allowed values: for example, if engineerings is [5, 2], then the permitted exponent values are 2, 4, 5, 7, 9, 10, 12, 14... and so on, i.e. multiples of 5 plus a multiple of 2 less than 5 (which may be 0). Default is 1, which corresponds to regular scientific notation.
   * @param mantissaPower ( Decimal ) Normally, the mantissa in scientific notation is bounded by 1 and the base, which corresponds to the default mantissaPower of 0. If mantissaPower is 1, the bounds are base and base^2, if mantissaPower is 2 then the bounds are base^2 and base^3, and so on. For example, a number normally represented as "2.357e224" would become "23.57e223" with 1 mantissaPower and "235.7e222" with 2 mantissaPower.
   * @param base ( Decimal ) Scientific notation normally works in powers of 10, but you can change this value to change that. Default is 10. For example, set this to 9, and 81 becomes "1e2".
   * @param expChars ( [[string, string], [string | boolean, string | boolean], [string, string]] ) An array of three pairs of strings that are used as the between characters for scientific notation. In each pair, the first entry goes before the exponent, the second entry goes after the exponent. expChars[0] takes the place of the e in "1e10", expChars[1] takes the place of the first e in "e1e10", and expChars[2] takes the place of the (e^) in (e^10)4. If expChars[1][0] is a boolean instead of a string: if it's false, then expChars[1][0] is set to be expChars[0][0] with the way mantissaInnerNotation formats 1 tacked on the beginning, and if it's true than the 1 is tacked on the end instead. Likewise for expChars[1][1] (expChars[0][1] with a 1 on it). Default is [["e", ""], ["e", ""], ["(e^", ")"]].
   * @param negExpChars ( null | [[string, string] | boolean, [string, string]] ) This can either be null or a pair of pairs of strings (in which the first pair of strings may be a boolean instead). Ignore this parameter if it's null, which is the default. If it's a pair of pairs of strings, then the first pair is used like expChars[0] but for negative exponents (so if it's ["d", ""], then 2e-4 would be 2d4 instead), and the second pair is used on small numbers whose reciprocals are large enough to need expChars[1], in which case the second pair indicates that a reciprocal has been taken. If negExpChars[0] is a boolean instead, then if it's true the notation goes directly to the reciprocal behavior for all inputs less than 1, while if it's false then single-iteration inputs don't use negExpChars but multi-iteration ones still use reciprocal behavior.
   * @param expBefore ( boolean ) If this parameter is true, the exponent comes before the mantissa instead of after. Default is false.
   * @param superexpAfter ( boolean ) If this parameter is true, (e^n) expressions come after the rest of the number instead of before. Default is false.
   * @param expMult ( Decimal ) Each exponentiation in the process is multiplied by this value. Default is 1.
   * @param mantissaInnerNotation ( Notation ) The notation that the numbers within the mantissas are themselves notated with. DefaultNotation is the default.
   * @param exponentInnerNotation ( Notation ) The notation that the highest exponent is itself notated with. Is the same as mantissaInnerNotation by default.
   * @param superexponentInnerNotation ( Notation ) The notation that the number in an (e^n) expression is itself notated with. Is the same as exponentInnerNotation by default.
   */
export class ScientificIterationsNotation extends Notation {
  private _iterations ! : number;
  public max_es_in_a_row = 5;
  public rounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero;
  private _engineerings : Decimal[] = [Decimal.dOne];
  public mantissaPower : Decimal = Decimal.dZero;
  public _base : Decimal = Decimal.dTen;
  private _expChars : [string, string][] = [["e", ""], ["e", ""], ["(e^", ")"]];
  public negExpChars : null | [[string, string] | boolean, [string, string]] = null;
  public expBefore : boolean = false;
  public superexpAfter : boolean = false;
  private _expMult : Decimal = Decimal.dOne;
  public mantissaInnerNotation : Notation = new DefaultNotation();
  public exponentInnerNotation : Notation = this.mantissaInnerNotation;
  public superexponentInnerNotation : Notation = this.exponentInnerNotation;
  private unconvertedExpChars : [[string, string], [string | boolean, string | boolean], [string, string]];

  constructor(
      iterations: number,
      max_es_in_a_row: number = 5,
      rounding : DecimalSource | ((value : Decimal) => Decimal) = 0,
      engineerings : DecimalSource | DecimalSource[] = 1, 
      mantissaPower : DecimalSource = 0,
      base : DecimalSource = 10, 
      expChars : [[string, string], [string | boolean, string | boolean], [string, string]] = [["e", ""], ["e", ""], ["(e^", ")"]],
      negExpChars : null | [[string, string] | boolean, [string, string]] = null,
      expBefore : boolean = false,
      superexpAfter : boolean = false,
      expMult : DecimalSource = 1,
      mantissaInnerNotation : Notation = new DefaultNotation(),
      exponentInnerNotation : Notation = mantissaInnerNotation,
      superexponentInnerNotation : Notation = exponentInnerNotation
      ) {
    super();
    this.iterations = iterations;
    this.max_es_in_a_row = max_es_in_a_row;
    this.rounding = rounding;
    this.engineerings = engineerings;
    this.mantissaPower = toDecimal(mantissaPower);
    this._base = toDecimal(base);
    this.expBefore = expBefore;
    this.superexpAfter = superexpAfter;
    this.expMult = expMult;
    this.mantissaInnerNotation = mantissaInnerNotation;
    this.exponentInnerNotation = exponentInnerNotation;
    this.superexponentInnerNotation = superexponentInnerNotation;
    this.unconvertedExpChars = expChars;
    this.expChars = expChars;
    this.negExpChars = negExpChars;
  }

  public name = "Scientific Iterations Notation";

  public formatDecimal(value: Decimal): string {
    if (value.eq(0)) return this.mantissaInnerNotation.format(0);
    if (this._iterations == 0) return this.mantissaInnerNotation.format(value);
    let iterations = this._iterations;
    let result = "";
    let negExp = false;
    let originalValue = value;
    if (value.lt(1)) {
      negExp = true;
      let [m, e] = scientifify(value, this._base, this.rounding, this.mantissaPower, this._engineerings, this._expMult);
      value = Decimal.pow(this._base, e.neg()).mul(m);
    }
    if (iterations > multslog(value, this._base, this._expMult).ceil().toNumber() + 3) iterations = multslog(value, this._base, this._expMult).ceil().toNumber() + 3;
    let added_es = Decimal.min(this._iterations, multslog(value, this._base, this._expMult).sub(multslog(new Decimal(Number.MAX_SAFE_INTEGER), this._base, this._expMult)).floor()).toNumber();
    if (added_es < iterations - multslog(new Decimal(Number.MAX_SAFE_INTEGER), this._base, this._expMult).ceil().toNumber()) added_es = iterations - multslog(new Decimal(Number.MAX_SAFE_INTEGER), this._base, this._expMult).ceil().toNumber();
    if (added_es < 0) added_es = 0;
    if (negExp && this.negExpChars !== null && (added_es > 0 || this.negExpChars[0] === true)) return this.negExpChars[1][0] + this.format(originalValue.recip()) + this.negExpChars[1][1];
    value = iteratedmultlog(value, this._base, added_es, this._expMult);
    let sciArray = [value];
    for (let i = 0; i < iterations - added_es; i++) {
      if (sciArray[sciArray.length - 1].eq(0)) break;
      let [mantissa, exponent] = scientifify(sciArray[sciArray.length - 1], this._base, this.rounding, this.mantissaPower, this._engineerings, this._expMult);
      if (i == 0 && negExp) exponent = exponent.neg();
      sciArray.pop();
      sciArray.push(mantissa, exponent);
    }
    let negMantissa = false;
    if (sciArray.length == 1 && negExp) {
      sciArray[0] = sciArray[0].neg();
      negMantissa = true;
    }
    let endings = sciArray.length - 1;
    let beforeChar = this._expChars[0][0];
    let afterChar = this._expChars[0][1];
    while (sciArray.length > 0) {
      let numStr = "";
      let toFormat = sciArray[0];
      if (this.negExpChars !== null && typeof this.negExpChars[0] !== "boolean" && toFormat.lt(0) && !negMantissa) {
        toFormat = toFormat.neg();
        beforeChar = this.negExpChars[0][0];
        afterChar = this.negExpChars[0][1];
        negExp = false;
      }
      if (sciArray.length == 1) numStr = this.exponentInnerNotation.format(toFormat);
      else numStr = this.mantissaInnerNotation.format(toFormat);
      // if (!onlyNumericCharacters(numStr) && !(onlyNumericCharacters(numStr, true) && sciArray.length == 1)) numStr = "(" + numStr + ")";
      if (this.expBefore) {
        if (sciArray.length <= endings) result = afterChar + result;
        result = numStr + result;
        sciArray.shift();
      }
      else {
        if (sciArray.length <= endings) result += beforeChar;
        result += numStr;
        sciArray.shift();
      }
      beforeChar = this._expChars[0][0];
      afterChar = this._expChars[0][1];
    }
    for (let e = 0; e < endings; e++) {
      if (this.expBefore) result = beforeChar + result;
      else result += afterChar;
    }
    if (added_es <= this.max_es_in_a_row) {
      for (let i = 0; i < added_es; i++) result = this._expChars[1][0] + result + this._expChars[1][1];
    }
    else {
      let eStr = this.superexponentInnerNotation.format(added_es);
      eStr = this._expChars[2][0] + eStr + this._expChars[2][1];
      if (this.superexpAfter) result = result + eStr;
      else result = eStr + result;
    }
    return result;
  }

  public get iterations() {
    return this._iterations;
  }

  public set iterations(iterations : number) {
    if (iterations % 1 != 0) throw new RangeError("Scientific Iterations Notation requires a whole number of iterations");
    this._iterations = iterations;
  }

  public get engineerings() {
    return this._engineerings;
  }

  public set engineerings(engineerings : DecimalSource | DecimalSource[]) {
    if (!Array.isArray(engineerings)) engineerings = [engineerings];
    if (engineerings.length == 0) {
      this._engineerings = [Decimal.dOne];
      return;
    }
    let engineeringsD : Decimal[] = engineerings.map(toDecimal);
    this._engineerings = engineeringsD.sort(function(a, b){
        if (a.lt(b)) return -1;
        else if (a.eq(b)) return 0;
        else return 1;
    }).reverse();
  }

  public get base() {
    return this._base;
  }

  public set base(base : DecimalSource) {
    let baseD = toDecimal(base);
    if (baseD.lte(1)) throw new RangeError("Base <= 1 in Scientific Iterations Notation");
    this._base = toDecimal(base);
  }

  public get expMult() {
    return this._expMult;
  }

  public set expMult(expMult : DecimalSource) {
    let expMultD = toDecimal(expMult);
    if (this._base.lte(1)) throw new RangeError("Base <= 1 in Scientific Iterations Notation");
    if (expMultD.eq(0)) throw new RangeError("expMult should not be zero");
    this._expMult = expMultD;
  }  

  public get expChars() {
    return this.unconvertedExpChars;
  }

  public set expChars(input : [[string, string], [string | boolean, string | boolean], [string, string]]) {
    let one = this.mantissaInnerNotation.format(1);
    let expChars : [string, string][] = [];
    expChars.push(input[0]);
    expChars.push(["", ""]);
    if (typeof input[1][0] == "string") expChars[1][0] = input[1][0];
    else if (input[1][0] === false) expChars[1][0] = one + input[0][0];
    else if (input[1][0] === true) expChars[1][0] = input[0][0] + one;
    if (typeof input[1][1] == "string") expChars[1][1] = input[1][1];
    else if (input[1][1] === false) expChars[1][1] = one + input[0][1];
    else if (input[1][1] === true) expChars[1][1] = input[0][1] + one;
    expChars.push(input[2]);
    this._expChars = expChars;
  }

}

/**
 * Abbreviates a number by splitting it into hyperoperators like how OmegaNum does, except there's an exponentiation entry between the mantissa and the tetration entry.
 * @param delimiters ( [string, string][] ) An array of pairs of strings. Each pair of strings is placed around one of the numbers in the split to indicate which hyperoperator it is, with the first string in the pair coming before the number and the second string in the pair coming after the number. delimiters[0] goes with the mantissa, delimiters[1] goes with the exponent, delimiters[2] goes with the tetration, delimiters[3] goes with the pentation. Default is [["", ""], ["*10^", ""], ["((10^)^", ") "], ["((10^^)^", ") "]]. If there are less than four entries, the remaining entries are filled in with empty strings.
 * @param base ( Decimal ) The base of the exponentiation, tetration, and pentation. Default is 10.
 * @param maximums ( Decimal | Decimal[] ) The largest allowed values for each operator: anything equal to or above this rolls over to the next operator. maximums[0] is the mantissa limit, maximums[1] is the exponent limit, maximums[2] is the tetration limit. Default is [10, 10, 10], where that 10 is whatever the base is. Setting the mantissa maximum to 0 or either of the other two maximums to 1 (actually, anything less than or equal to its corresponding expMult) will effectively disable that operator: for example, if maximums[1] is 1, then exponentiation is effectively excluded from the operators. If just one Decimal is given rather than an array, all three maximums are the same. If there are less than three entries, the last entry is copied to fill the remaining ones.
 * @param showZeroes ( number | number[] ) This parameter controls whether hyperoperators in the split with a value of 0 are shown or not. Default is [1, -1, -1, -1], where for each operator, a positive value means it's always shown even if zero, a negative value means it's not shown if it's zero, and a 0 means it's shown when it's zero but only if a higher hyperoperator is nonzero. If only one number is given rather than an array, then the latter three entries all become that value, but the mantissa's showZeroes always defaults to 1 unless you directly change it with an array. If there are less than four entries, the last entry is copied to fill the remaining ones.
 * @param delimiterPermutation ( number ) The order that the hyperoperators go in when multiple are present. The default is 1, which corresponds to [pentation, tetration, mantissa, exponent]. Each value from 0 to 23 represents a different ordering.
 * @param originalMaximums ( Decimal | Decimal[] ) These are the maximums that apply when the next operator is 0: for example, if maximums is [10, 10, 10] but originalMaximums is [100, 10, 10], then the mantissa can go up to 100 before exponents begin but once the exponent has begun increasing then the mantissa is limited to 10 (this applies even if tetration or pentation is above 0, as long as exponent is still 0). Is the same as maximums by default.
 * @param minnum ( Decimal ) Values above this and below maximums[0] will just return [value, 0, 0, 0] instead of doing any splitting; this prevents small-but-not-too-small values like 2 from forcing negative exponents. Default is 1. Set this value to a negative number to disable this functionality.
 * @param mantissaRounding ( DecimalSource | ((value : Decimal) => Decimal) ) The mantissa is rounded to the nearest multiple of this value. If this parameter is a function, then the mantissa is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0. 
 * @param innerNotations ( Notation | Notations[] ) The notations that the numbers are themselves notated with. Has up to four entries, corresponding to the mantissa, exponent, tetration, and pentation in that order. The default is for DefaultNotation to be used for all four. If this is just a single Notation instead of an array, all four hyperoperators use the same innerNotation. If there are less than four entries, the last entry is copied to fill the remaining ones.
 * @param engineerings ( Decimal | [Decimal | Decimal[], Decimal | Decimal[], Decimal | Decimal[]] ) An array of three arrays of Decimals, each of which may potentially be just a single Decimal instead of an array of them. These behave like the engineerings parameter in other notations; the first entry is for exponentiation, the second is for tetration, the third is for pentation. You may make this a single Decimal instead of an array at all to give all three the same single engineering value, but you can't make a single array to give to all three because an array of single Decimals uses "different single values for each of the three hyperoperators" rather than "the same array for all three hyperoperators"... in other words, if you use an array, the upper-level array needs to have three entries, one for each non-mantissa hyperoperator in the split, and each entry of this three-entry array behaves as an engineerings parameter. Default is [[1], [1], [1]], and if less than three entries are provided, the remaining ones are set to [1].
 * @param expMultipliers ( Decimal | Decimal[] ) An array of up to three Decimals which multiply the exponent, tetration, and pentation respectively; this multiplication happens once to start and one more time between each application of the next hyperoperator. Default is [1, 1, 1]. If just one Decimal is given rather than an array, all three multipliers are the same. If there are less than three entries, the remaining ones are set to 1.
 */
export class HypersplitNotation extends Notation {
    private _delimiters : [string, string][] = [["", ""], ["*10^", ""], ["((10^)^", ") "], ["((10^^)^", ") "]];
    private _base : Decimal = Decimal.dTen;
    private _maximums : Decimal[] = [Decimal.dTen, Decimal.dTen, Decimal.dTen];
    private _showZeroes : number[] = [1, -1, -1, -1];
    public delimiterPermutation : number = 1;
    private _originalMaximums : Decimal[] = this._maximums;
    public minnum : Decimal = Decimal.dOne;
    public mantissaRounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero;
    private _innerNotations : Notation[] = [new DefaultNotation()];
    private _engineerings : [Decimal[], Decimal[], Decimal[]] = [[Decimal.dOne], [Decimal.dOne], [Decimal.dOne]];
    private _expMultipliers : Decimal[] = [Decimal.dOne, Decimal.dOne, Decimal.dOne];

    constructor(
        delimiters : [string, string][] = [["", ""], ["*10^", ""], ["((10^)^", ") "], ["((10^^)^", ") "]],
        base : DecimalSource = 10,
        maximums : DecimalSource | DecimalSource[] = base,
        showZeroes : number | number[] = [1, -1, -1, -1],
        delimiterPermutation : number = 1,
        originalMaximums : DecimalSource | DecimalSource[] = maximums,
        minnum : DecimalSource = 1,
        mantissaRounding : DecimalSource | ((value : Decimal) => Decimal) = 0,
        innerNotations : Notation | Notation[] = new DefaultNotation(),
        engineerings : DecimalSource | [DecimalSource | DecimalSource[], DecimalSource | DecimalSource[], DecimalSource | DecimalSource[]] = 1,
        expMultipliers : DecimalSource | DecimalSource[] = 1
    ) {
        super();
        this.delimiters = delimiters;
        this._base = toDecimal(base);
        this.maximums = maximums;
        this.showZeroes = showZeroes;
        this.delimiterPermutation = delimiterPermutation;
        this.originalMaximums = originalMaximums;
        this.minnum = toDecimal(minnum);
        this.mantissaRounding = mantissaRounding;
        this.innerNotations = innerNotations;
        this.engineerings = engineerings;
        this.expMultipliers = expMultipliers
    }

    public name = "Hypersplit Notation";

    public format(
        value: DecimalSource
      ): string {

        let decimal = toDecimal(value);

        if (decimal.isNan()) return this.NaNString;

        if (this.isInfinite(decimal)) {
          return decimal.sgn() < 0 ? this.negativeInfinite : this.infinite;
        }
  
        if (decimal.neq(0) && this.isInfinite(decimal.recip())) {
          return this.format(0);
        }
    
        return (decimal.sgn() < 0 && this._maximums[0].eq(0))
        ? this.formatNegativeDecimal(decimal.abs())
        : this.formatDecimal(decimal);
      }

    public formatDecimal(value: Decimal): string {
        let hp = hypersplit(value, this._base, this._maximums, this._originalMaximums, this.minnum, this.mantissaRounding, this._engineerings[0], this._engineerings[1], this._engineerings[2], this._expMultipliers[0], this._expMultipliers[1], this._expMultipliers[2]);
        let orderArray = [0];
        orderArray.splice(this.delimiterPermutation % 2, 0, 1);
        orderArray.splice(Math.floor(this.delimiterPermutation / 2) % 3, 0, 2);
        orderArray.splice(Math.floor(this.delimiterPermutation / 6) % 4, 0, 3);
        let result = "";
        while (orderArray.length > 0) {
            if (orderArray[0] == 0 && (this._showZeroes[0] > 0 || (this._showZeroes[0] == 0 && (hp[1].neq(0) || hp[2].neq(0) || hp[3].neq(0))) || hp[0].neq(0))) result += this._delimiters[0][0] + this._innerNotations[0].format(hp[0]) + this._delimiters[0][1];
            else if (orderArray[0] == 1 && (this._showZeroes[1] > 0 || (this._showZeroes[1] == 0 && (hp[2].neq(0) || hp[3].neq(0))) || hp[1].neq(0))) result += this._delimiters[1][0] + this._innerNotations[1].format(hp[1]) + this._delimiters[1][1];
            else if (orderArray[0] == 2 && (this._showZeroes[2] > 0 || (this._showZeroes[2] == 0 && hp[3].neq(0)) || hp[2].neq(0))) result += this._delimiters[2][0] + this._innerNotations[2].format(hp[2]) + this._delimiters[2][1];
            else if (orderArray[0] == 3 && (this._showZeroes[3] > 0 || hp[3].neq(0))) result += this._delimiters[3][0] + this._innerNotations[3].format(hp[3]) + this._delimiters[3][1];
            orderArray.shift();
        }
        return result;
    }

    public get delimiters() {
      return this._delimiters;
    }

    public set delimiters(delimiters : [string, string][]) {
      while (delimiters.length < 4) delimiters.push(["", ""]);
      this._delimiters = delimiters;
    }

    public get base() {
      return this._base;
    }

    public set base(base : DecimalSource) {
      let baseD = toDecimal(base);
      if (baseD.pow(this._expMultipliers[0].recip()).lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work for Hypersplit Notation");
      this._base = baseD;
    }

    public get maximums() {
      return this._maximums;
    }

    public set maximums(maximums : DecimalSource | DecimalSource[]) {
      if (!Array.isArray(maximums)) maximums = [maximums];
        this._maximums = maximums.map(toDecimal);
        while (this._maximums.length < 3) this._maximums.push(this._maximums[this._maximums.length - 1]);
    }

    public get showZeroes() {
      return this._showZeroes;
    }

    public set showZeroes(showZeroes : number | number[]) {
      if (!Array.isArray(showZeroes)) showZeroes = [1, showZeroes];
        this._showZeroes = showZeroes;
        while (this._showZeroes.length < 4) this._showZeroes.push(this._showZeroes[this._showZeroes.length - 1]);
    }

    public get originalMaximums() {
      return this._originalMaximums;
    }

    public set originalMaximums(originalMaximums : DecimalSource | DecimalSource[]) {
      if (!Array.isArray(originalMaximums)) originalMaximums = [originalMaximums];
        this._originalMaximums = originalMaximums.map(toDecimal);
        while (this._originalMaximums.length < 3) this._originalMaximums.push(this._originalMaximums[this._originalMaximums.length - 1]);
    }

    public get innerNotations() {
      return this._innerNotations;
    }

    public set innerNotations(innerNotations : Notation | Notation[]) {
      if (!Array.isArray(innerNotations)) innerNotations = [innerNotations];
        this._innerNotations = innerNotations;
        while (this._innerNotations.length < 4) this._innerNotations.push(this._innerNotations[this._innerNotations.length - 1]);
    }

    public get engineerings() {
      return this._engineerings;
    }

    public set engineerings(input : DecimalSource | [DecimalSource | DecimalSource[], DecimalSource | DecimalSource[], DecimalSource | DecimalSource[]]) {
      if (!(Array.isArray(input))) input = [input, input, input];
      let result : [Decimal[], Decimal[], Decimal[]] = [[Decimal.dOne], [Decimal.dOne], [Decimal.dOne]];
      for (let i = 0; i < input.length; i++) {
          let entry = input[i];
          if (!(Array.isArray(entry))) result[i] = [toDecimal(entry)];
          else if (entry.length == 0) result[i] = [Decimal.dOne];
          else result[i] = entry.map(toDecimal);
      }
      this._engineerings = result;
    }

    public get expMultipliers() {
      return this._expMultipliers;
    }

    public set expMultipliers(expMultipliers : DecimalSource | DecimalSource[]) {
      if (!Array.isArray(expMultipliers)) expMultipliers = [expMultipliers];
      while (expMultipliers.length < 3) expMultipliers.push(Decimal.dOne);
      if (this._base.pow(Decimal.recip(expMultipliers[0])).lte(1.44466786100976613366)) throw new RangeError("Bases with convergent tetration don't work for Hypersplit Notation");
      this._expMultipliers = expMultipliers.map(toDecimal);
    }
}

const HyperE = new ConditionalNotation(false,
    [
        new ScientificNotation(...[,,], defaultRound, ...[,,,,], [["E", ""], ["E", ""], ["(E^", ")"]]), 
        function(value){return (multabs(value).lt("1e10") || value.eq(0));}
    ],
    [
        new HypersplitNotation([["", ""], ["E", ""], ["#", ""], ["#", ""]], 10, [0, 1e10, 1e10 - 1], [-1, 1, 0, 0], 23, undefined, 0, defaultRound, [new DefaultNotation(), new DefaultNotation(), new AppliedFunctionNotation(function(value){return value.plus(1);}, new DefaultNotation(), function(str){return str;})]), 
        function(value){return true;}
    ]
)

const lowercaseAlphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const uppercaseAlphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

    /**
     * Each power of 1,000 gets a letter of the alphabet, so 1,000 is 1a, 55,430,000 is 55.43b, 10^15 is 1e, and so on. aa comes after z, aaa comes after zz.
     * 100A means that there would be 100 lowercase letters in the full expression, 1Aa means 1,000A, 1Ad means (10^12)A, 100B means there would be 100 lowercase letters in an expression beginning with A,
     * 200C means that there would be 200 lowercase letters in an expression beginning with B, and so on. AA comes after Z. 100@ means there would be 100 uppercase letters in a full expression, 1 '@a'
     * (the quotes aren't there, they're just in this explanation to avoid @ doing parameter stuff) means 1,000@, and so on.
     * @param letters ( [string[], string[], string[]] ) An array of three arrays of strings. The first array is the lowercase letters, the second array is the uppercase letters, and the third is the "third letters", of which @ is the only one in the default system. The default setting has the 26 lowercase letters as the first array, the 26 uppercase letters as the second array, and a single-entry array containing only @ as the third array.
     * @param negaLetters ( number | [number, number, number] ) If you think of the letters as being numbers in an alternate base, how many of the digits in the base are negative? Default is -1, which corresponds to a bijective base. 0 would be a regular base, i.e. including a letter for zero.
     * This parameter must be between -1 and (the amount of letters - 2). If this parameter is a single number, then that's the amount of negative letters for all three letter types, but if it's an array then negaLetters[0] is for the lowercase letters, negaLetters[1] is for the uppercase letters, and negaLetters[2] is for the third letters.
     * @param rounding ( DecimalSource | ((value : Decimal) => Decimal) ) The mantissa is rounded to the nearest multiple of this value. If this parameter is a function, then the mantissa is plugged into the function, and whatever the function returns is used as the value to round to the nearest multiple of. The rounding is not performed at all if rounding is 0. Default is 0.
     * @param base ( Decimal ) The number that the letters represent powers of. Default is 1,000.
     * @param max_letters ( number ) The highest amount of letters of a single tier - any more, and they're truncated into the next tier. Default is 12.
     * @param between ( string ) This string goes between the number and the letters. Default is the empty string.
     * @param separator ( string ) This string goes between each letter. Default is the empty string.
     * @param hyperseparator ( string ) This string goes between each tier of letters. Default is the empty string.
     * @param alwaysHyperseparate ( boolean ) If this parameter is true, hyperseparators appear for every letter tier after the first non-empty one, even if some of the later ones are empty (and thus would normally skip their hyperseparator). Default is false.
     * @param innerNotation ( Notation ) The notation that the numbers within the expression are themselves notated with. DefaultNotation is the default.
     * @param lettersOrder ( number ) The order that the different types of letters go in when multiple are present. Default is 0, which corresponds to [third, uppercase, lowercase]. Each value from 0 to 5 represents a different ordering.
     * @param reverseLetters ( boolean ) If this is true, the letters of a single type are written right to left instead of left to right. Default is false.
     * @param mantissaAfter ( boolean ) If this is true, the number comes after all the letters instead of before. Default is false.
     * @param divisionChar ( [string, string] ) The strings used to represent that the letter expression is actually its reciprocal (for numbers below 1); divisionChar[0] goes before the letter expression, divisionChar[1] goes after the letter expression. Default is ["/", ""].
     * @param specialLetters ( [[(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][], [(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][], [(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][]] )
     * An array of three arrays of pairs where each pair contains a (number, number?, number?) -> boolean function and a string array; this parameter allows different place values to use different letters (though the amount of letters remains the same). specialLetters[0] is for the lowercase letters, specialLetters[1] is for the uppercase letters, and specialLetters[2] is for the third letters.
     * The function's arguments are the place value of the letter (the last place is place value 0), the letter's distance from the leftmost letter, and the "value" of that letter string (a is 1, z is 26, aa is 27, etc.), and the function returns true if this letter is to use that set of special letters instead of the normal ones; the string array is the set of special letters to be used.
     * Earlier entries in specialLetters take priority, reverting back to the regular letters if none of the special letters apply or if the one that does apply doesn't have enough entries to represent that letter.
     * @param fixedLetters ( [[number, string][], [number, string][], [number, string][]] ) If the value of the letter string matches any of the numbers in that letter type's array in here (fixedLetters[0] is for the lowercase letters, fixedLetters[1] is for the uppercase letters, fixedLetters[2] is for the third letters), the regular letters are not used - instead, the letter string is just set to that number's corresponding string in this array. Default is [[], [], []], i.e. there are no fixed letters.
     * @param concatenation ( [null | [boolean, string, string, Notation?], null | [boolean, string, string, Notation?], null | [boolean, string, string, Notation?]] ) concatenation[0] is for lowercase letters, concatenation[1] is for uppercase letters, concatenation[2] is for third letters.
     * If a concatenation entry is not null, then when multiple of the same letter of a single tier are adjacent, they'll be concatenated into a single letter with a number next to it to indicate the amount of that digit that was concatenated.
     * concatenation[n][1] and concatenation[n][2] are placed before and after the concatenation number. If concatenation[n][3] is undefined, the concatenation number is written as a letter string itself, otherwise it's written in whatever notation is given. If concatenation[n][0] is true, then the concatenation number comes after the letter being concatenated, otherwise it comes before.
     * Default is [null, null, null], i.e. no concatenation occurs.
     */
export class LettersNotation extends Notation {
    private _letters : [string[], string[], string[]] = [lowercaseAlphabet, uppercaseAlphabet, ["@"]];
    private _negaLetters : [number, number, number] = [-1, -1, -1];
    public rounding : DecimalSource | ((value : Decimal) => Decimal) = Decimal.dZero;
    private _base : Decimal = new Decimal(1000);
    private _max_letters = 12;
    public between : string = "";
    public separator : string = "";
    public hyperseparator : string = "";
    public alwaysHyperseparate : boolean = false;
    public innerNotation : Notation = new DefaultNotation();
    public lettersOrder : number = 0;
    public reverseLetters : boolean = false;
    public mantissaAfter : boolean = false;
    public divisionChar : [string, string] = ["/", ""];
    public specialLetters : [[(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][], [(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][], [(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][]] = [[], [], []];
    public fixedLetters : [[number, string][], [number, string][], [number, string][]] = [[], [], []];
    public concatenation : [null | [boolean, string, string, Notation?], null | [boolean, string, string, Notation?], null | [boolean, string, string, Notation?]] = [null, null, null];

    constructor(
        letters : [string[], string[], string[]] = [lowercaseAlphabet, uppercaseAlphabet, ["@"]],
        negaLetters : number | [number, number, number] = -1,
        rounding : DecimalSource | ((value : Decimal) => Decimal) = 0,
        base : DecimalSource = 1000,
        max_letters = 12,
        between : string = "",
        separator : string = "",
        hyperseparator : string = "",
        alwaysHyperseparate : boolean = false,
        innerNotation : Notation = new DefaultNotation(),
        lettersOrder : number = 0,
        reverseLetters : boolean = false,
        mantissaAfter : boolean = false,
        divisionChar : [string, string] = ["/", ""],
        specialLetters : [[(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][], [(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][], [(placeValue : number, fromStart? : number, outerValue? : number) => boolean, string[]][]] = [[], [], []],
        fixedLetters : [[number, string][], [number, string][], [number, string][]] = [[], [], []],
        concatenation : [null | [boolean, string, string, Notation?], null | [boolean, string, string, Notation?], null | [boolean, string, string, Notation?]] = [null, null, null]
        ) {
      super();
      this.letters = letters;
      this.negaLetters = negaLetters;
      this.rounding = rounding;
      this.base = base;
      this.max_letters = max_letters;
      this.between = between;
      this.separator = separator;
      this.hyperseparator = hyperseparator;
      this.alwaysHyperseparate = alwaysHyperseparate;
      this.innerNotation = innerNotation;
      this.lettersOrder = lettersOrder;
      this.reverseLetters = reverseLetters;
      this.mantissaAfter = mantissaAfter;
      this.divisionChar = divisionChar;
      this.specialLetters = specialLetters;
      this.fixedLetters = fixedLetters;
      this.concatenation = concatenation;
    }

    public name = "Letters Notation";
  
    public formatDecimal(value: Decimal): string {
      if (value.eq(0)) return this.innerNotation.format(0);
      let result = "";
      let negExp = false;
      if (value.lt(1)) {
        negExp = true;
        let [m, e] = scientifify(value, this._base);
        value = this._base.pow(e.neg()).mul(m); 
      }
      let lowercaseLimit = this._max_letters + 1;
      let uppercaseLimit = this._max_letters + 1;
      if (this._letters[0].length > 1) lowercaseLimit = ((this._letters[0].length - this._negaLetters[0] - 1) * Math.pow(this._letters[0].length, this._max_letters) + this._negaLetters[0]) / (this._letters[0].length - 1);
      if (this._letters[1].length > 1) uppercaseLimit = ((this._letters[1].length - this._negaLetters[1] - 1) *  Math.pow(this._letters[1].length, this._max_letters) + this._negaLetters[1]) / (this._letters[1].length - 1);
      let [mantissa, letter] = [Decimal.dZero, Decimal.dZero];
      let uppercaseLetter = Decimal.dZero;
      let thirdLetter = Decimal.dNegOne;
      do {
        thirdLetter = thirdLetter.plus(1);
        if (thirdLetter.gt(0)) {
            if (this._letters[0].length == 1) uppercaseLetter = uppercaseLetter.plus(value.slog(this._base));
            else {
              if (value.gte(Decimal.iteratedexp(10, 4, this._base))) {
                let uppercaseLetterAddition = value.slog(10, 100, true).sub(this._base.slog(10, 100, true)).sub(4).div(2).floor().plus(1);
                value = (uppercaseLetterAddition.gte(4.5e15)) ? Decimal.dOne : value.iteratedlog(10, uppercaseLetterAddition.mul(2).toNumber(), true);
                uppercaseLetter = uppercaseLetter.plus(uppercaseLetterAddition);
              }
              while (value.gte(this._base.pow(lowercaseLimit))) {
                  uppercaseLetter = uppercaseLetter.plus(1);
                  value = value.log(this._base).mul(this._letters[0].length - 1).sub(this._negaLetters[0]).div(this._letters[0].length - this._negaLetters[0] - 1).log(this._letters[0].length).plus(1);
              }
              uppercaseLetter = uppercaseLetter.plus(value.log(this._base));
            }
            if (this._letters[1].length == 1) value = uppercaseLetter;
            else value = uppercaseLetter.log(this._letters[1].length).plus(1);
            uppercaseLetter = Decimal.dZero;
        }
        if (this._letters[0].length == 1) {
            if (value.gte(this._base.pow(lowercaseLimit))) {
                uppercaseLetter = value.slog(this._base).sub(new Decimal(lowercaseLimit).slog(this._base)).floor();
                value = (uppercaseLetter.gte(9e15)) ? Decimal.dOne : value.iteratedlog(this._base, uppercaseLetter.toNumber(), true);
            }
        }
        else {
            if (value.gte(Decimal.iteratedexp(10, 4, this._base))) {
                uppercaseLetter = value.slog(10, 100, true).sub(this._base.slog(10, 100, true)).sub(4).div(2).floor().plus(1);
                value = (uppercaseLetter.gte(4.5e15)) ? Decimal.dOne : value.iteratedlog(10, uppercaseLetter.mul(2).toNumber(), true);
            }
            while (value.gte(this._base.pow(lowercaseLimit))) {
                uppercaseLetter = uppercaseLetter.plus(1);
                value = value.log(this._base).mul(this._letters[0].length - 1).sub(this._negaLetters[0]).div(this._letters[0].length - this._negaLetters[0] - 1).log(this._letters[0].length).plus(1);
            }
        }
        if (uppercaseLetter.lt(uppercaseLimit)) {
          [mantissa, letter] = scientifify(value, this._base, this.rounding);
          if (letter.gte(lowercaseLimit)) {
            uppercaseLetter = uppercaseLetter.plus(1);
            if (this._letters[0].length == 1) value = value.log(this._base);
            else value = value.log(this._base).mul(this._letters[0].length - 1).sub(this._negaLetters[0]).div(this._letters[0].length - this._negaLetters[0] - 1).log(this._letters[0].length).plus(1);
            [mantissa, letter] = scientifify(value, this._base, this.rounding);
          }
        }
      } while (uppercaseLetter.gte(uppercaseLimit));
      let resultArray : string[] = [];
      let mantissaStr = this.innerNotation.format(mantissa);
      if (negExp) result += this.divisionChar;
      let fixedLettersIndices = [this.fixedLetters[0].map((value) => value[0]).indexOf(letter.toNumber()), this.fixedLetters[1].map((value) => value[0]).indexOf(uppercaseLetter.toNumber()), this.fixedLetters[2].map((value) => value[0]).indexOf(thirdLetter.toNumber())];
      if (thirdLetter.toNumber() == 0) resultArray.push("");
      else if (fixedLettersIndices[2] != -1) resultArray.push(this.fixedLetters[2][fixedLettersIndices[2]][1])
      else resultArray.push(BaseConvert(thirdLetter.toNumber(), this._letters[2], 0, 0, this._negaLetters[2], 0, -1, this.reverseLetters, 1, [this.separator], undefined, undefined, undefined, this.specialLetters[2], this.concatenation[2]));
      if (uppercaseLetter.toNumber() == 0) resultArray.push("");
      else if (fixedLettersIndices[1] != -1) resultArray.push(this.fixedLetters[1][fixedLettersIndices[1]][1])
      else resultArray.push(BaseConvert(uppercaseLetter.toNumber(), this._letters[1], 0, 0, this._negaLetters[1], 0, -1, this.reverseLetters, 1, [this.separator], undefined, undefined, undefined, this.specialLetters[1], this.concatenation[1]));
      if (letter.toNumber() == 0) resultArray.push("");
      else if (fixedLettersIndices[0] != -1) resultArray.push(this.fixedLetters[0][fixedLettersIndices[0]][1])
      else resultArray.push(BaseConvert(letter.toNumber(), this._letters[0], 0, 0, this._negaLetters[0], 0, -1, this.reverseLetters, 1, [this.separator], undefined, undefined, undefined, this.specialLetters[0], this.concatenation[0]));
      let orderArray = [2];
      orderArray.splice(this.lettersOrder % 2, 0, 1);
      orderArray.splice(Math.floor(this.lettersOrder / 2) % 3, 0, 0);
      let lettersStr = "";
      while (!(resultArray[orderArray[0]]) && orderArray.length > 0) {
        orderArray.shift();
      }
      while (orderArray.length > 0) {
          lettersStr += resultArray[orderArray[0]];
          let visible = !!resultArray[orderArray[0]];
          orderArray.shift();
          let addAHyperseparator = false;
          for (let o = 0; o < orderArray.length; o++) {
            if (resultArray[orderArray[o]]) addAHyperseparator = true;
          }
          if (orderArray.length != 0 && (this.alwaysHyperseparate || (visible && addAHyperseparator))) lettersStr += this.hyperseparator;
      }
      if (negExp) lettersStr = this.divisionChar[0] + lettersStr + this.divisionChar[1];
      if (this.mantissaAfter) result = lettersStr + this.between + mantissaStr;
      else result = mantissaStr + this.between + lettersStr;
      return result;
    }

    public get letters() {
      return this._letters;
    }

    public set letters(letters : [string[], string[], string[]]) {
      if (letters[0].length == 0 || letters[1].length == 0 || letters[2].length == 0) throw new Error("Empty letters array in Letters Notation");
      this._letters = letters;
    }

    public get negaLetters() {
      return this._negaLetters;
    }
    
    public set negaLetters(negaLetters : number | [number, number, number]) {
      if (!Array.isArray(negaLetters)) negaLetters = [negaLetters, negaLetters, negaLetters];
      this._negaLetters = negaLetters;
    }

    public get base() {
      return this._base;
    }

    public set base(base: DecimalSource) {
      let baseD = toDecimal(base);
      if (baseD.lte(1)) throw new RangeError("Base <= 1 in Letters notation");
      this._base = baseD;
    }

    public get max_letters() {
      return this._max_letters;
    }

    public set max_letters(max_letters : number) {
      if (max_letters <= 0) throw new RangeError("Nonpositive max letters in Letters notation")
      this._max_letters = max_letters;
    }
  }

const Letters = new LettersNotation(...[,,], defaultRound).setName("Letters");
