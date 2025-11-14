import { player } from '../save';

//import { NON_RECURSIVE } from "."

export function getTotalTheories() {
	let base = player.nonrecu.theories.reduce((a, b) => a.add(b));
	if (player.upgrades['7tamq']) {
		base = base.mul(2);
	}
	if (player.nonrecu.studies_bought.includes(9))
		base = base.add(
			player.nonrecu.power
				.add(1)
				.ln()
				.add(1)
				.ln()
				.mul(
					player.nonrecu.studies_bought.includes(17)
						? player.nonrecu.secInThisReset.add(1).log10()
						: 1,
				)
				.floor()
				.max(0),
		);
	if (player.challenges[1][3].gt(0))
		base = base.mul(player.challenges[1][3].mul(0.1).add(1)).floor();

	if (player.upgrades['7t1q']) base = base.add(1);
	if (player.upgrades['7t2q']) base = base.add(2);
	if (player.upgrades['7t3q']) base = base.add(4);
	if (player.upgrades['7t4q']) base = base.add(10);
	if (player.upgrades['7t5q']) base = base.add(100);
	if (player.upgrades['7t6q']) base = base.add(10000);
	return base;
}
