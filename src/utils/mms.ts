import PowiainaNum from 'powiaina_num.js';

export const MMSMilestones = [
	[new PowiainaNum(0), '\\varnothing', '0'],
	[new PowiainaNum(1), '()', '1'],
	[new PowiainaNum(2), '()()', '2'],
	[new PowiainaNum(3), '()()()', '3'],
	[new PowiainaNum(4), '()(1)', '\\w'],
	[PowiainaNum.arrow(10, 4, 2 ** 128), '()(1,1,1,\\cdots)'],
	[new PowiainaNum(1 / 0), '()(1,1,1,\\cdots)'],
] as const;

export function getCurrentMMSMilestoneIndex(target: PowiainaNum): number {
	if (target.lt(0) || target.isNaN()) throw new Error('Unexpected Y Sequence Number.');
	if (target.lte(1)) return Math.floor(target.toNumber());

	let left = 1;
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
