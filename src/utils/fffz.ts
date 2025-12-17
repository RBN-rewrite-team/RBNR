import PowiainaNum from 'powiaina_num.js';

export const FFFZMilestones = [
  [new PowiainaNum(0), "0"],
  [new PowiainaNum(1), "\\z0", "1"],
  [new PowiainaNum(2), "{\\z0}+{\\z0}", "2"],
  [new PowiainaNum(3), "{\\z0}+{\\z0}+{\\z0}", "2"],
  [new PowiainaNum(4), "\\z1", "ω"],
] as const;

export const FFFZmacros = {
  "\\z": function (context) {
    let nextArg = context.consumeArg()
    if (context.future().text === "EOF" || context.future().text === "}") return `ψ_Z\\left(${nextArg.tokens.reverse().map(x => x.text).join("")}\\right)`
    return `ψ_Z\\left[${context.consumeArg().tokens.reverse().map(x => x.text).join("")}\\right]\\left(${nextArg.tokens.reverse().map(x => x.text).join("")}\\right)`
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
