import { player } from '../save';

//import { NON_RECURSIVE } from "."

export function getTotalTheories() {
	let base = player.nonrecu.theories.reduce((a, b) => a.add(b));
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
				.floor(),
		);
	if (player.challenges[1][3].gt(0))
		base = base.mul(player.challenges[1][3].mul(0.1).add(1)).floor();
	return base;
}
