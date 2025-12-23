import PowiainaNum from 'powiaina_num.js';

export const FFFZMilestones = [
	[new PowiainaNum(0), '0'],
	[new PowiainaNum(1), '\\z0', '1'],
	[new PowiainaNum(2), '{\\z0}+{\\z0}', '2'],
	[new PowiainaNum(3), '{\\z0}+{\\z0}+{\\z0}', '3'],
	[new PowiainaNum(3.5), '{\\z0}+{\\z0}+{\\z0}+{\\z0}', '4'],
	[new PowiainaNum(3.75), '{\\z0}+{\\z0}+{\\z0}+{\\z0}+{\\z0}', '5'],
	[new PowiainaNum(4), '\\z1', 'ω'],
	[new PowiainaNum(4.25), '{\\z1}+{\\z0}', 'ω+1'],
	[new PowiainaNum(4.375), '{\\z1}+{\\z0}+{\\z0}', 'ω+2'],
	[new PowiainaNum(4.5), '{\\z1}+{\\z1}', 'ω\\cdot2'],
	[new PowiainaNum(4.625), '{\\z1}+{\\z1}+{\\z0}', 'ω\\cdot2+1'],
	[new PowiainaNum(4.75), '{\\z1}+{\\z1}+{\\z1}', 'ω\\cdot3'],
	[new PowiainaNum(4.875), '{\\z1}+{\\z1}+{\\z1}+{\\z1}', 'ω\\cdot4'],
	[new PowiainaNum(5), '\\z2', 'ω^2'],
	[new PowiainaNum(5.125), '{\\z2}+{\\z0}', 'ω^2+1'],
	[new PowiainaNum(5.1875), '{\\z2}+{\\z0}', 'ω^2+2'],
	[new PowiainaNum(5.25), '{\\z2}+{\\z1}', 'ω^2+ω'],
	[new PowiainaNum(5.375), '{\\z2}+{\\z1}+{\\z1}', 'ω^2+ω\\cdot2'],
	[new PowiainaNum(5.5), '{\\z2}+{\\z2}', 'ω^2\\cdot2'],
	[new PowiainaNum(5.5625), '{\\z2}+{\\z2}+{\\z0}', 'ω^2\\cdot2+1'],
	[new PowiainaNum(5.625), '{\\z2}+{\\z2}+{\\z1}', 'ω^2\\cdot2+ω'],
	[new PowiainaNum(5.75), '{\\z2}+{\\z2}+{\\z2}', 'ω^2\\cdot3'],
	[new PowiainaNum(5.875), '{\\z2}+{\\z2}+{\\z2}+{\\z2}', 'ω^2\\cdot4'],
	[new PowiainaNum(6), '\\z3', 'ω^3'],
	[new PowiainaNum(6.5), '{\\z3}+{\\z3}', 'ω^3\\cdot2'],
	[new PowiainaNum(6.75), '{\\z3}+{\\z3}+{\\z3}', 'ω^3\\cdot3'],
	[new PowiainaNum(7), '\\z4', 'ω^4'],
	[new PowiainaNum(7.25), '{\\z4}+{\\z4}', 'ω^4\\cdot2'],
	[new PowiainaNum(7.5), '{\\z5}', 'ω^5'],
	[new PowiainaNum(7.75), '{\\z6}', 'ω^6'],
	[new PowiainaNum(7.875), '{\\z7}', 'ω^7'],
	[new PowiainaNum(8), '\\zωω', 'ω^ω'],
	[new PowiainaNum(8.25), '\\zω{ω+1}', 'ω^{ω+1}'],
	[new PowiainaNum(8.375), '\\zω{ω+2}', 'ω^{ω+2}'],
	[new PowiainaNum(8.5), '\\zω{ω\\cdot2}', 'ω^{ω\\cdot2}'],
	[new PowiainaNum(8.75), '\\zω{ω\\cdot3}', 'ω^{ω\\cdot3}'],
	[new PowiainaNum(8.875), '\\zω{ω\\cdot4}', 'ω^{ω\\cdot4}'],
	[new PowiainaNum(9), '\\zω{\\z2}', 'ω^{ω^2}'],
	[new PowiainaNum(9.25), '\\zω{{\\z2}+{\\z1}}', 'ω^{ω^2+ω}'],
	[new PowiainaNum(9.5), '\\zω{{\\z2}+{\\z2}}', 'ω^{ω^2\\cdot2}'],
	[new PowiainaNum(9.75), '\\zω{{\\z2}+{\\z2}+{\\z2}}', 'ω^{ω^2\\cdot3}'],
	[new PowiainaNum(10), '\\zω{\\z3}', 'ω^{ω^3}'],
	[new PowiainaNum(10.5), '\\zω{{\\z3}+{\\z3}}', 'ω^{ω^3\\cdot2}'],
	[new PowiainaNum(10.75), '\\zω{{\\z3}+{\\z3}+{\\z3}}', 'ω^{ω^3\\cdot3}'],
	[new PowiainaNum(11), '\\zω{\\z4}', 'ω^{ω^4}'],
	[new PowiainaNum(11.5), '\\zω{\\z5}', 'ω^{ω^5}'],
	[new PowiainaNum(11.75), '\\zω{\\z6}', 'ω^{ω^6}'],
	[new PowiainaNum(12), '\\zω{\\zωω}', 'ω^{ω^ω}'],
	[new PowiainaNum(13), '\\zω{\\zω{\\z2}}', 'ω^{ω^{ω^2}}'],
	[new PowiainaNum(14), '\\zω{\\zω{\\z3}}', 'ω^{ω^{ω^3}}'],
	[new PowiainaNum(15), '\\zω{\\zω{\\z4}}', 'ω^{ω^{ω^4}}'],
	[new PowiainaNum(15.25), '\\zω{\\zω{\\z5}}', 'ω^{ω^{ω^5}}'],
	[new PowiainaNum(15.375), '\\zω{\\zω{\\z6}}', 'ω^{ω^{ω^6}}'],
	[new PowiainaNum(15.5), '\\zω{\\zω{\\zωω}}', 'ω^{ω^{ω^{ω^ω}}}'],
	[new PowiainaNum(15.75), '\\zω{\\zω{\\zω{\\zωω}}}', 'ω^{ω^{ω^{ω^{ω^ω}}}}'],
	[new PowiainaNum(16), '\\zω', 'ε_0'],
	[new PowiainaNum(16.03125), '\\z{ω+1}', 'ε_0\\cdotω'],
	[new PowiainaNum(16.0625), '\\z{ω\\cdot2}{ω\\cdot2}', 'ε_0\\cdotω^ω'],
	[new PowiainaNum(16.078125), '\\z{ω\\cdot2}{\\zω}', 'ε_0^2'],
	[new PowiainaNum(16.09375), '\\z{ω\\cdot2}{\\z{ω\\cdot2}{ω\\cdot2}}', 'ω^{ω^{ε_0+ω}}'],
	[new PowiainaNum(16.125), '\\z{ω\\cdot2}', 'ε_1'],
	[new PowiainaNum(16.1875), '\\z{ω\\cdot3}', 'ε_2'],
	[new PowiainaNum(16.21625), '\\z{ω\\cdot4}', 'ε_3'],
	[new PowiainaNum(16.25), '\\z{ω^2}{ω}', 'ε_ω'],
	[new PowiainaNum(16.3125), '\\z{ω^2}{\\z2}', 'ε_{ω^2}'],
	[new PowiainaNum(16.375), '\\z{ω^2}{\\zωω}', 'ε_{ω^ω}'],
	[new PowiainaNum(16.4375), '\\z{ω^2}{\\zω{\\zω}}', 'ε_{ω^{ω^ω}}'],
	[new PowiainaNum(16.5), '\\z{ω^2}{\\zω}', 'ε_{ε_0}'],
	[new PowiainaNum(16.75), '\\z{ω^2}{\\z{ω^2}{\\zω}}', 'ε_{ε_{ε_0}}'],
	[new PowiainaNum(17), '\\z{ω^2}', 'ζ_0'],
	[new PowiainaNum(17.125), '\\z{ω^2\\cdot2}', 'ζ_2'],
	[new PowiainaNum(17.1875), '\\z{ω^2\\cdot3}', 'ζ_3'],
	[new PowiainaNum(17.25), '\\z{ω^3}{ω^3}', 'ζ_ω'],
	[new PowiainaNum(17.375), '\\z{ω^3}{\\z{ω^3}{ω^3}}', 'ζ_{ζ_ω}'],
	[new PowiainaNum(17.5), '\\z{ω^4}', 'η_0'],
	[new PowiainaNum(17.5625), '\\z{ω^4\\cdot2}', 'η_1'],
	[new PowiainaNum(17.625), '\\z{ω^5}{ω^5}', 'η_ω'],
	[new PowiainaNum(17.75), '\\z{ω^5}', 'φ(4,0)'],
	[new PowiainaNum(17.875), '\\z{ω^6}', 'φ(5,0)'],
	[new PowiainaNum(18), '\\z{ω^ω}{ω^ω}', 'ψ(Ω^ω)'],
	[new PowiainaNum(19), '\\z{ω^ω}{\\z{ω^ω}{ω^ω}}', 'ψ(Ω^{ψ(Ω^ω)})'],
	[new PowiainaNum(20), '\\z{ω^ω}', 'ψ(Ω^Ω)'],
	[new PowiainaNum(21), '\\z{ω^{ω^ω}}{ω^{ω^ω}}', 'ψ(Ω^{Ω^ω})'],
	[new PowiainaNum(22), '\\z{ω^{ω^ω}}', 'ψ(Ω^{Ω^Ω})'],
	[new PowiainaNum(23), '\\z{ω^{ω^{ω^ω}}}', 'ψ(Ω^{Ω^{Ω^Ω}})'],
	[new PowiainaNum(24), '\\z{ε_0}{ε_0}', 'ψ(Ω_2)', '\\text{BHO}'],
	[new PowiainaNum(28), '\\z{ε_0}{\\z{ε_0}{ε_0}}', 'ψ(Ω_3)'],
	[new PowiainaNum(32), '\\z{ε_0}', 'ψ(Ω_ω)', '\\text{BO}'],
	[new PowiainaNum(40), '\\z{ε_1}{\\z{ε_0}}', '(0)(1,1,1)(2,2,2)', '\\text{p.f.e.c.LRO}'],
	[new PowiainaNum(48), '\\z{ε_1}', '(0)(1^4)', '\\text{TSSO}'],
	[new PowiainaNum(52), '\\z{ε_2}{ε_2}', '(0)(1^4)(2,2)'],
	[new PowiainaNum(56), '\\z{ε_2}', '(0)(1^5)', '\\text{QSSO}'],
	[new PowiainaNum(60), '\\z{ε_3}', '(0)(1^6)', '\\text{QiSSO}'],
	[new PowiainaNum(62), '\\z{ε_4}', '(0)(1^7)'],
	[new PowiainaNum(63), '\\z{ε_5}', '(0)(1^8)'],
	[new PowiainaNum(64), '\\z{ε_ω}{ε_ω}', '(0)(1^ω)', '\\text{SHO}'],
	[new PowiainaNum(68), '\\z{ε_ω, ε_ω\\cdotω}{ε_ω\\cdotω}', 'Y(1,3,4)', '(0)(1^ω)(2)'],
	[new PowiainaNum(80), '\\z{ε_ω}{\\z{ε_ω, ε_ω\\cdotω}{ε_ω\\cdotω}}', 'Y(1,3,4,2,5,8,10)', '(0)(1^Ω)'],
	[new PowiainaNum(96), '\\z{ε_ω}', 'Y(1,3,4,3)'],
	[new PowiainaNum(256), '\\z{ε_{ω^2}}{ε_{ω^2}}', 'Y(1,ω)', '\\text{SYO}'],
	[new PowiainaNum(4096), '\\z{ε_{ω^3}}{ε_{ω^3}}', '2-Y(1,ω)'],
	[new PowiainaNum(16384), '\\z{ε_{ω^4}}{ε_{ω^4}}', '3-Y(1,ω)'],
	[new PowiainaNum(32768), '\\z{ε_{ω^5}}{ε_{ω^5}}', '4-Y(1,ω)'],
	[new PowiainaNum(49152), '\\z{ε_{ω^6}}{ε_{ω^6}}', '5-Y(1,ω)'],
	[new PowiainaNum(57344), '\\z{ε_{ω^7}}{ε_{ω^7}}', '6-Y(1,ω)'],
	[new PowiainaNum(61440), '\\z{ε_{ω^8}}{ε_{ω^8}}', '7-Y(1,ω)'],
	[new PowiainaNum(63488), '\\z{ε_{ω^9}}{ε_{ω^9}}', '8-Y(1,ω)'],
	[new PowiainaNum(65536), '\\z{ε_{ω^ω}}{ε_{ω^ω}}', 'ω-Y(1,ω)', '\\text{MHO}'],
	[new PowiainaNum(81920), '\\z{ε_{ω^ω}}'],
	[new PowiainaNum(131072), '\\z{ε_{ω^{ω2}}}'],
	[new PowiainaNum(262144), '\\z{ε_{ω^{ω^2}}}'],
	[new PowiainaNum(1048576), '\\z{ε_{ω^{ω^3}}}'],
	[new PowiainaNum(67108864), '\\z{ε_{ω^{ω^ω}}}{ε_{ω^{ω^ω}}}'],
	[new PowiainaNum(4294967296), '\\z{ε_{ω^{ω^ω}}}'],
	[new PowiainaNum(4 ** 24), '\\z{ε_{ε_0}}{ε_{ε_0}}'],
	[new PowiainaNum(4 ** 32), '\\z{ε_{ε_0}}'],
	[PowiainaNum.BEAF(4, 4, 4, 2 ** 128), 'α\\mapstoψ_Z\\left(α\\right)~\\mathrm{fp.}'],
] as const;

export const FFFZmacros = {
	'\\z': function (context: any) {
		let nextArg = context.consumeArg();
		if (context.future().text === 'EOF' || context.future().text === '}')
			return `ψ_Z\\left(${nextArg.tokens
				.reverse()
				.map((x: any) => x.text)
				.join('')}\\right)`;
		return `ψ_Z\\left[${nextArg.tokens
			.reverse()
			.map((x: any) => x.text)
			.join('')}\\right]\\left(${context
			.consumeArg()
			.tokens.reverse()
			.map((x: any) => x.text)
			.join('')}\\right)`;
	},
};

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
	const base = FFFZMilestones[getCurrentFFFZMilestoneIndex(target)] ?? [new PowiainaNum(NaN), 'Not a Ordinal'];
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
