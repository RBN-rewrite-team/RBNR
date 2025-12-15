import PowiainaNum from 'powiaina_num.js';

export const MMSMilestones = [
	[new PowiainaNum(0), '\\varnothing', '0'],
	[new PowiainaNum(1), '()', '1'],
	[new PowiainaNum(2), '()()', '2'],
	[new PowiainaNum(3), '()()()', '3'],
	[new PowiainaNum(4), '()(1)', '\\w'],
	[new PowiainaNum(5), '()(1)(1)', '\\w^2'],
	[new PowiainaNum(6), '()(1)(1)(1)', '\\w^3'],
	[new PowiainaNum(7), '()(1)(1)(1)(1)', '\\w^4'],
	[new PowiainaNum(8), '()(1)(2)', '\\w^{\\w}'],
	[new PowiainaNum(9), '()(1)(2)(2)', '\\w^{\\w^{2}}'],
	[new PowiainaNum(10), '()(1)(2)(2)(2)', '\\w^{\\w^{3}}'],
	[new PowiainaNum(11), '()(1)(2)(2)(2)(2)', '\\w^{\\w^{4}}'],
	[new PowiainaNum(12), '()(1)(2)(3)', '\\w^{\\w^{\\w}}'],
	[new PowiainaNum(13), '()(1)(2)(3)(3)', '\\w^{\\w^{\\w^2}}'],
	[new PowiainaNum(14), '()(1)(2)(3)(3)(3)', '\\w^{\\w^{\\w^3}}'],
	[new PowiainaNum(15), '()(1)(2)(3)(3)(3)(3)', '\\w^{\\w^{\\w^4}}'],
	[new PowiainaNum(16), '()(1)(2,1)', '\\varepsilon_0'],
	[PowiainaNum.arrow(10, 4, 2 ** 128), '()(1,1,1,\\cdots)'],
	[new PowiainaNum(1 / 0), '()(1,1,1,\\cdots)'],
] as const;

export function getCurrentMMSMilestoneIndex(target: PowiainaNum): number {
	if (target.lt(0) || target.isNaN()) throw new Error('Unexpected Y Sequence Number.');
	if (target.lte(16)) return Math.floor(target.toNumber());

	let left = 16;
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
