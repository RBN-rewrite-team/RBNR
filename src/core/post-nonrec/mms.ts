/**
 * player data put at hydra inner
 */

import PowiainaNum from 'powiaina_num.js';

export const MMS = {
	playerData() {
		return {
			deduced: new PowiainaNum(0),
		};
	},
} as const;
