import PowiainaNum from 'powiaina_num.js';

export const MMSMilestones = [
	[new PowiainaNum(0), '', '0'],
	[new PowiainaNum(1), '()', '1'],
	[new PowiainaNum(2), '()()', '2'],
	[new PowiainaNum(3), '()()()', '3'],
	[new PowiainaNum(4), '()(1)', 'ω'],
	[new PowiainaNum(5), '()(1)(1)', 'ω^2'],
	[new PowiainaNum(6), '()(1)(1)(1)', 'ω^3'],
	[new PowiainaNum(7), '()(1)(1)(1)(1)', 'ω^4'],
	[new PowiainaNum(8), '()(1)(2)', 'ω^{ω}'],
	[new PowiainaNum(9), '()(1)(2)(2)', 'ω^{ω^{2}}'],
	[new PowiainaNum(10), '()(1)(2)(2)(2)', 'ω^{ω^{3}}'],
	[new PowiainaNum(11), '()(1)(2)(2)(2)(2)', 'ω^{ω^{4}}'],
	[new PowiainaNum(12), '()(1)(2)(3)', 'ω^{ω^{ω}}'],
	[new PowiainaNum(13), '()(1)(2)(3)(3)', 'ω^{ω^{ω^2}}'],
	[new PowiainaNum(14), '()(1)(2)(3)(3)(3)', 'ω^{ω^{ω^3}}'],
	[new PowiainaNum(15), '()(1)(2)(3)(3)(3)(3)', 'ω^{ω^{ω^4}}'],
	[new PowiainaNum(16), '()(1)(2,1)', 'ε_0'],
	[new PowiainaNum(17), '()(1)(2,1)(2,1)', 'ε_1'],
	[new PowiainaNum(18), '()(1)(2,1)(2,1)(2,1)', 'ε_2'],
	[new PowiainaNum(19), '()(1)(2,1)(3,0)', 'ε_ω'],
	[new PowiainaNum(20), '()(1)(2,1)(3,1)', 'ζ_0'],
	[new PowiainaNum(21), '()(1)(2,1)(3,1)(3,1)', 'η_0'],
	[new PowiainaNum(22), '()(1)(2,1)(3,1)(4)', '\\varphi(ω,0)'],
	[new PowiainaNum(23), '()(1)(2,1)(3,1)(4,1)', '\\varphi(1,0,0)'],
	[new PowiainaNum(24), '()(1)(2,1)(3,2)', '\\psi(Ω_2)'],
	[new PowiainaNum(25), '()(1)(2,1)(3,2)(3,2)', '\\psi(Ω_2\\cdot2)'],
	[new PowiainaNum(26), '()(1)(2,1)(3,2)(4,1)', '\\psi(Ω_2\\cdotΩ)'],
	[new PowiainaNum(27), '()(1)(2,1)(3,2)(4,2)', '\\psi(Ω_2^2)'],
	[new PowiainaNum(28), '()(1)(2,1)(3,2)(4,2)(4,2)', '\\psi(Ω_2^3)'],
	[new PowiainaNum(29), '()(1)(2,1)(3,2)(4,2)(5)', '\\psi(Ω_2^{ω})'],
	[new PowiainaNum(30), '()(1)(2,1)(3,2)(4,2)(5,2)', '\\psi(Ω_2^{Ω_2})'],
	[new PowiainaNum(31), '()(1)(2,1)(3,2)(4,3)', '\\psi(Ω_3)'],
	[new PowiainaNum(32), '()(1)(2,1)(3,2,1)', '\\psi(Ω_ω)'],
	[new PowiainaNum(33), '()(1)(2,1)(3,2,1)(3,2,1)', '\\psi(Ω_ω\\cdot2)'],
	[new PowiainaNum(36), '()(1)(2,1)(3,2,1)(4,1)', '\\psi(Ω_ω\\cdotΩ)'],
	[new PowiainaNum(40), '()(1)(2,1)(3,2,1)(4,1)(3,2,1)', '\\psi(Ω_ω\\cdotΩ+Ω_ω)'],
	[new PowiainaNum(48), '()(1)(2,1)(3,2,1)(4,2)', '\\psi(Ω_ω\\cdotΩ_2)'],
	[new PowiainaNum(52), '()(1)(2,1)(3,2,1)(4,2)(3,2,1)', '\\psi(Ω_ω^2)'],
	[new PowiainaNum(64), '()(1)(2,1)(3,2,1)(4,2)(5,3)', '\\psi(Ω_{ω+1})'],
	[new PowiainaNum(72), '()(1)(2,1)(3,2,1)(4,2,1)', '\\psi(Ω_{ω+1})'],
	[new PowiainaNum(84), '()(1)(2,1)(3,2,1)(4,2,1)(5,2,1)', '\\psi(I_ω)'],
	[new PowiainaNum(90), '()(1)(2,1)(3,2,1)(4,3)', '\\psi(Π_ω)'],
	[
		new PowiainaNum(98),
		'()(1)(2,1)(3,2,1)(4,3,1)',
		'\\psi(\\lambda\\alpha.\\Omega_{\\alpha+2}-\\Pi_1)',
	],
	[new PowiainaNum(106), '()(1)(2,1)(3,2,1)(4,3,2)', '\\psi(\\psi_\\alpha(\\alpha_\\omega))'],
	[new PowiainaNum(112), '()(1)(2,1)(3,2,1)(4,3,2,1)', '\\text{TSSO}'],
	[new PowiainaNum(128), '()(1,1)', '\\text{SHO}'],
	[new PowiainaNum(144), '()(1,1)(1,1)', '1-Y(1,3,3)'],
	[new PowiainaNum(160), '()(1,1)(2)', '1-Y(1,3,4)'],
	[new PowiainaNum(1048576), '()(1,1)(2)(1,1)', '1-Y(1,3,4,3)'],
	[new PowiainaNum(2 ** 128), '()(1,1)(2,2,1)', '1-Y(1,3,9)'],
	[new PowiainaNum(2 ** 256), '()(1,1)(2,2,1)(3,3,2,1,1)', '1-Y(1,4)'],
	[new PowiainaNum(2 ** 512), '()(1,1)(2,2,1,1)', 'ω-Y(1,4)'],
	[new PowiainaNum(2 ** 768), '()(1,1)(2,2,1,1)(2,2,1,1)', 'ω-Y(1,5)'],
	[PowiainaNum.pow(2, 1024), '()(1,1)(2,2,1,1)(3)'],
	[PowiainaNum.tetrate(4, 6), '()(1,1)(2,2,1,1)(3)(2,2,1,1)'],
	[PowiainaNum.tetrate(4, 10), '()(1,1)(2,2,1,1)(3,3)'],
	[PowiainaNum.tetrate(4, 128), '()(1,1)(2,2,1,1)(3,3,2,2)'],
	[PowiainaNum.tetrate(4, 256), '()(1,1)(2,2,1,1)(3,3,2,2,1)'],
	[PowiainaNum.tetrate(4, 512), '()(1,1)(2,2,1,1)(3,3,2,2,1,1)'],
	[PowiainaNum.tetrate(4, PowiainaNum.pow(4, 5)), '()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4)'],
	[PowiainaNum.tetrate(4, PowiainaNum.pow(4, 16)), '()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4,3)'],
	[PowiainaNum.tetrate(4, PowiainaNum.pow(4, 32)), '()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4,3,3)'],
	[PowiainaNum.tetrate(4, PowiainaNum.pow(4, 64)), '()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4,3,3,2)'],
	[PowiainaNum.tetrate(4, PowiainaNum.pow(4, 128)), '()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4,3,3,2,2)'],
	[PowiainaNum.tetrate(4, PowiainaNum.pow(4, 256)), '()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4,3,3,2,2,1)'],
	[
		PowiainaNum.tetrate(4, PowiainaNum.pow(4, PowiainaNum.pow(4, 5))),
		'()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4,3,3,2,2,1,1)',
	],
	[
		PowiainaNum.tetrate(4, PowiainaNum.pow(4, PowiainaNum.pow(4, 16))),
		'()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4,4)',
	],
	[
		PowiainaNum.tetrate(4, PowiainaNum.pow(4, PowiainaNum.pow(4, 32))),
		'()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4,4,3)',
	],
	[
		PowiainaNum.tetrate(4, PowiainaNum.tetrate(4, 6)),
		'()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4,4,3,3,2,2,1)',
	],
	[
		PowiainaNum.tetrate(4, PowiainaNum.tetrate(4, 16)),
		'()(1,1)(2,2,1,1)(3,3,2,2,1,1)(4,4,3,3,2,2,1,1)',
	],
	[PowiainaNum.pentate(4, 16), '()(1,1,1)(2,2,2)'],
	[PowiainaNum.pentate(4, 256), '()(1,1,1)(2,2,2,1,1,1)'],
	[PowiainaNum.pentate(4, PowiainaNum.pow(4, 256)), '()(1,1,1)(2,2,2,1,1,1)(3)'],
	[PowiainaNum.pentate(4, PowiainaNum.tetrate(4, 256)), '()(1,1,1)(2,2,2,1,1,1)(3,3)'],
	[PowiainaNum.pentate(4, PowiainaNum.pentate(4, 256)), '()(1,1,1)(2,2,2,1,1,1)(3,3,3)'],
	[PowiainaNum.arrow(4, 4, 16), '()(1,1,1)(2,2,2,1,1,1)(3,3,3,2,2,2)'],
	[PowiainaNum.arrow(4, 4, 32), '()(1,1,1)(2,2,2,1,1,1)(3,3,3,2,2,2,1,1,1)'],
	[PowiainaNum.arrow(4, 4, 64), '()(1,1,1,1)'],
	[PowiainaNum.arrow(4, 4, 2 ** 32), '()(1,1,1,1)(2,2,2,2,1,1,1,1)'],
	[PowiainaNum.arrow(4, 4, 2 ** 64), '()(1,1,1,1)(2,2,2,2,1,1,1,1)(3,3,3,3,2,2,2,2,1,1,1,1)'],
	[PowiainaNum.arrow(4, 4, 2 ** 96), '()(1,1,1,1,1)'],
	[PowiainaNum.arrow(4, 4, 2 ** 112), '()(1,1,1,1,1,1)'],
	[PowiainaNum.arrow(4, 4, 2 ** 120), '()(1,1,1,1,1,1,1)'],
	[PowiainaNum.arrow(4, 4, 2 ** 124), '()(1,1,1,1,1,1,1,1)'],
	[PowiainaNum.arrow(4, 4, 2 ** 126), '()(1,1,1,1,1,1,1,1,1)'],
	[PowiainaNum.arrow(4, 4, 2 ** 127), '()(1,1,1,1,1,1,1,1,1,1)'],
	[
		PowiainaNum.arrow(4, 4, 2 ** 128),
		'()(1,1,1,\\cdots)',
		'\\text{zFOS}(0,1,ω,ε_0,ζ_0,\\varphi(ω,0))',
	],
	[new PowiainaNum(1 / 0), '()(1,1,1,\\cdots)'],
] as const;

export function getCurrentMMSMilestoneIndex(target: PowiainaNum): number {
	if (target.lt(0) || target.isNaN()) throw new Error('Unexpected Y Sequence Number.');
	if (target.lte(13)) return Math.floor(target.toNumber());

	let left = 13;
	let right = MMSMilestones.length;
	let resultIndex = -1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const comparison = MMSMilestones[mid][0].cmp(target);

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

export const getCurrentMMSMilestone = (target: PowiainaNum) => {
	const base = MMSMilestones[getCurrentMMSMilestoneIndex(target)] ?? [
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

export function getCurrentMMSOrdinal(ord: PowiainaNum): string {
	const milestone = getCurrentMMSMilestone(ord);
	if (milestone?.[2] === undefined) return milestone[1];
	return milestone.slice(1).join('=');
}
