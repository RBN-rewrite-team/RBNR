import PowiainaNum from 'powiaina_num.js';

export const FFFZMilestones = [
  [new PowiainaNum(0), "0"],
  [new PowiainaNum(1), "\\z0", "1"],
  [new PowiainaNum(2), "{\\z0}+{\\z0}", "2"],
  [new PowiainaNum(3), "{\\z0}+{\\z0}+{\\z0}", "2"],
  [new PowiainaNum(4), "\\z1", "ω"],
  [new PowiainaNum(5), "\\z2", "ω^2"],
  [new PowiainaNum(6), "\\z3", "ω^3"],
  [new PowiainaNum(7), "\\z4", "ω^4"],
  [new PowiainaNum(8), "\\zωω", "ω^ω"],
  [new PowiainaNum(9), "\\zω{\\z2}", "ω^{ω^2}"],
  [new PowiainaNum(10), "\\zω{\\z3}", "ω^{ω^3}"],
  [new PowiainaNum(11), "\\zω{\\z4}", "ω^{ω^4}"],
  [new PowiainaNum(12), "\\zω{\\zωω}", "ω^{ω^ω}"],
  [new PowiainaNum(13), "\\zω{\\zω{\\z2}}", "ω^{ω^{ω^2}}"],
  [new PowiainaNum(14), "\\zω{\\zω{\\z3}}", "ω^{ω^{ω^3}}"],
  [new PowiainaNum(15), "\\zω{\\zω{\\z4}}", "ω^{ω^{ω^4}}"],
  [new PowiainaNum(16), "\\zω", "ε_0"],
  [new PowiainaNum(17), "\\z{ω^2}", "ζ_0"],
  [new PowiainaNum(18), "\\z{ω^ω}{ω^ω}", "ψ(Ω^ω)"],
  [new PowiainaNum(19), "\\z{ω^ω}{\\z{ω^ω}{ω^ω}}", "ψ(Ω^{ψ(Ω^ω)})"],
  [new PowiainaNum(20), "\\z{ω^ω}", "ψ(Ω^Ω)"],
  [new PowiainaNum(21), "\\z{ω^{ω^ω}}{ω^{ω^ω}}", "ψ(Ω^{Ω^ω})"],
  [new PowiainaNum(22), "\\z{ω^{ω^ω}}", "ψ(Ω^{Ω^Ω})"],
  [new PowiainaNum(23), "\\z{ω^{ω^{ω^ω}}}", "ψ(Ω^{Ω^{Ω^Ω}})"],
  [new PowiainaNum(24), "\\z{ε_0}{ε_0}", "ψ(Ω_2)", "\\text{BHO}"],
  [new PowiainaNum(28), "\\z{ε_0}{\\z{ε_0}{ε_0}}", "ψ(Ω_3)"],
  [new PowiainaNum(32), "\\z{ε_0}", "ψ(Ω_ω)", "\\text{BO}"],
  [new PowiainaNum(40), "\\z{ε_1}{\\z{ε_0}}", "(0)(1,1,1)(2,2,2)", "\\text{p.f.e.c.LRO}"],
  [new PowiainaNum(48), "\\z{ε_1}", "(0)(1^4)", "\\text{TSSO}"],
  [new PowiainaNum(52), "\\z{ε_2}{ε_2}", "(0)(1^4)(2,2)"],
  [new PowiainaNum(56), "\\z{ε_2}", "(0)(1^5)", "\\text{QSSO}"],
  [new PowiainaNum(60), "\\z{ε_3}", "(0)(1^6)", "\\text{QiSSO}"],
  [new PowiainaNum(62), "\\z{ε_4}", "(0)(1^7)"],
  [new PowiainaNum(63), "\\z{ε_5}", "(0)(1^8)"],
  [new PowiainaNum(64), "\\z{ε_ω}{ε_ω}", "(0)(1^ω)", "\\text{SHO}"],
  [new PowiainaNum(68), "\\z{ε_ω, ε_ω\\cdotω}{ε_ω\\cdotω}", "Y(1,3,4)", "(0)(1^ω)(2)"],
  [new PowiainaNum(80), "\\z{ε_ω}{\\z{ε_ω, ε_ω\\cdotω}{ε_ω\\cdotω}}", "Y(1,3,4,2,5,8,10)", "(0)(1^Ω)"],
  [new PowiainaNum(96), "\\z{ε_ω}", "Y(1,3,4,3)"],
  [new PowiainaNum(256), "\\z{ε_{ω^2}}{ε_{ω^2}}", "Y(1,ω)", "\\text{SYO}"],
  [new PowiainaNum(4096), "\\z{ε_{ω^3}}{ε_{ω^3}}", "2-Y(1,ω)"],
  [new PowiainaNum(16384), "\\z{ε_{ω^4}}{ε_{ω^4}}", "3-Y(1,ω)"],
  [new PowiainaNum(32768), "\\z{ε_{ω^5}}{ε_{ω^5}}", "4-Y(1,ω)"],
  [new PowiainaNum(49152), "\\z{ε_{ω^6}}{ε_{ω^6}}", "4-Y(1,ω)"],
  [new PowiainaNum(57344), "\\z{ε_{ω^7}}{ε_{ω^7}}", "5-Y(1,ω)"],
  [new PowiainaNum(61440), "\\z{ε_{ω^8}}{ε_{ω^8}}", "6-Y(1,ω)"],
  [new PowiainaNum(63488), "\\z{ε_{ω^9}}{ε_{ω^9}}", "7-Y(1,ω)"],
  [new PowiainaNum(64512), "\\z{ε_{ω^{10}}}{ε_{ω^{10}}}", "8-Y(1,ω)"],
  [new PowiainaNum(65024), "\\z{ε_{ω^{11}}}{ε_{ω^{11}}}", "9-Y(1,ω)"],
  [new PowiainaNum(65280), "\\z{ε_{ω^{12}}}{ε_{ω^{12}}}", "10-Y(1,ω)"],
  [new PowiainaNum(65408), "\\z{ε_{ω^{13}}}{ε_{ω^{13}}}", "11-Y(1,ω)"],
  [new PowiainaNum(65472), "\\z{ε_{ω^{14}}}{ε_{ω^{14}}}", "12-Y(1,ω)"],
  [new PowiainaNum(65504), "\\z{ε_{ω^{15}}}{ε_{ω^{15}}}", "13-Y(1,ω)"],
  [new PowiainaNum(65520), "\\z{ε_{ω^{16}}}{ε_{ω^{16}}}", "14-Y(1,ω)"],
  [new PowiainaNum(65536), "\\z{ε_{ω^ω}}{ε_{ω^ω}}", "ω-Y(1,ω)", "\\text{MHO}"],
] as const;

export const FFFZmacros = {
  "\\z": function (context: any) {
    let nextArg = context.consumeArg()
    if (context.future().text === "EOF" || context.future().text === "}") return `ψ_Z\\left(${nextArg.tokens.reverse().map((x: any) => x.text).join("")}\\right)`
    return `ψ_Z\\left[${nextArg.tokens.reverse().map((x: any) => x.text).join("")}\\right]\\left(${context.consumeArg().tokens.reverse().map((x: any) => x.text).join("")}\\right)`
  }
}

export function getCurrentFFFZMilestoneIndex(target: PowiainaNum): number {
	if (target.lt(0) || target.isNaN()) throw new Error('Unexpected Y Sequence Number.');
	// if (target.lte(0)) return Math.floor(target.toNumber());

	let left = 0;
	let right = FFFZMilestones.length;
	let resultIndex = -1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const comparison = FFFZMilestones[mid][0].cmp(target);

		if (comparison === 0) {
			return mid;
		} else if (comparison < 0) {
			resultIndex = mid;
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return resultIndex;
}

export const getCurrentFFFZMilestone = (target: PowiainaNum) => {
	const base = FFFZMilestones[getCurrentFFFZMilestoneIndex(target)] ?? [
		new PowiainaNum(NaN),
		'Not a Ordinal',
	];
	// const last = base[base.length - 1];
	// if (typeof last === 'function') {
	//   if (target.eq(base[0])) return base.slice(-1) as [Decimal, string, ...string[]];
	//   else {
	//     const ret = last(target);
	//     return [target, ret, base?.[2] ? '>' + base[2] : base[1]];
	//   }
	// }
	return base;
};

export function getCurrentFFFZOrdinal(ord: PowiainaNum): string {
	const milestone = getCurrentFFFZMilestone(ord);
	if (milestone?.[2] === undefined) return milestone[1];
	return milestone.slice(1).join('=');
}
