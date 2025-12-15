/**
 * player data put at hydra inner
 */

import PowiainaNum from 'powiaina_num.js';
import { player } from '../global';

export const MMS = {
	playerData() {
		return {
			deduced: new PowiainaNum(0),
			progress: new PowiainaNum(0),
		};
	},
	deduceSpeed() {
		let base = new PowiainaNum(0.025);

		return base;
	},
	loop(diff: number) {
		player.hydra.mms.progress = player.hydra.mms.progress.add(this.deduceSpeed().mul(diff));
		if (player.hydra.mms.progress.gte(1)) {
			const int = player.hydra.mms.progress.floor();
			player.hydra.mms.progress = player.hydra.mms.progress.sub(int);
			player.hydra.mms.deduced = player.hydra.mms.deduced.add(int);
		}
	},
} as const;
