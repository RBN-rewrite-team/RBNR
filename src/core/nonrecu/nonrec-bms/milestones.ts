import Decimal from 'break_eternity.js';

export const NonRecBMSMilestones = [
	[new Decimal(0), '', '0'],
	[new Decimal(1), '(1)', '1'],
	[new Decimal(2), '(1)(1)', '2'],
	[new Decimal(3), '(1)(1)(1)', '3'],
	[new Decimal(4), '(1)(2)', 'ω'],
	[new Decimal(5), '(1)(2)(3)', 'ω^ω'],
	[new Decimal(6), '(1)(2)(3)(4)', 'ω^ω^ω'],
	[new Decimal(7), '(1)(2)(3)(4)(5)', 'ω^ω^ω^ω'],
	[new Decimal(8), '(1)(2,1)', 'ε_0'],
	[new Decimal(9), '(1)(2,1)(3,2)', 'ψ(Ω_2)'],
	[new Decimal(10), '(1)(2,1)(3,2)(4,3)', 'ψ(Ω_3)'],
	[new Decimal(11), '(1)(2,1)(3,2)(4,3)(5,4)', 'ψ(Ω_4)'],
	[new Decimal(12), '(1)(2,1,1)', 'ψ(Ω_ω)'],
	[new Decimal(13), '(1)(2,1,1)(3,2,2)', 'ψ(ψ_α(α_ω))', 'ψ(ω-π-Π_0)'],
	[new Decimal(14), '(1)(2,1,1,1)', 'ψ(P(ω,0))', 'TSSO'],
	[new Decimal(15), '(1)(2,1,1,1,1)', 'ψ(S)', 'QSSO'],
	[new Decimal(16), '(1,1)', 'Ω'],
	[new Decimal(64), '(1,1,1)', 'Ω_2'],
	[new Decimal(1e330), '???'],
] as const;

export function getCurrentNRBMSMilestoneIndex(target: Decimal): number {
	if (target.lt(0) || target.isNan()) throw new Error('Unexpected Y Sequence Number.');
	if (target.lte(16)) return Math.floor(target.toNumber());

	let left = 16;
	let right = NonRecBMSMilestones.length;
	let resultIndex = -1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const comparison = NonRecBMSMilestones[mid][0].cmp(target);

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

export const getCurrentNRBMSMilestone = (target: Decimal) => {
	const base = NonRecBMSMilestones[getCurrentNRBMSMilestoneIndex(target)] ?? [
		new Decimal(NaN),
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

export function getCurrentNRBMSOrdinal(ord: Decimal): string {
	const milestone = getCurrentNRBMSMilestone(ord);
	if (milestone?.[2] === undefined) return milestone[1];
	return milestone.slice(1).join('=');
}
