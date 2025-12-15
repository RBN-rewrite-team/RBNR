/**
 * player data put at hydra inner
 */

import PowiainaNum from 'powiaina_num.js';

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
} as const;
