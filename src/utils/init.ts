import { createApp, watch } from 'vue';
import App from '@/App.vue';
import VueLatex from 'vatex';
import { loadSaves, player, save, type Player } from '@/core/save';
import { feature } from '@/core/global.ts';
import { NUMTHEORY } from '@/core/multiplication/numbertheory.ts';
import { Exponention } from '@/core/exponention/exponention.ts';
import { QolUpgrades } from '@/core/exponention/qolupg.ts';
import { Logarithm } from '@/core/exponention/logarithm.ts';
import { Ordinal } from '@/core/ordinal/ordinal.ts';

import { gameLoop, startGameLoop } from '@/core/game-loop';

export function init() {
	loadSaves();
	player.frozen = false;
	player.run_a_tick_and_froze = false;
	feature.SUCCESSOR.initMechanics();
	feature.ADDITION.initMechanics();
	feature.MULTIPLICATION.initMechanics();
	feature.PrimeFactor.initMechanics();
	NUMTHEORY.initMechanics();
	Exponention.initMechanics();
	QolUpgrades.initMechanics();
	feature.ChessBoard.initMechanics();
	Logarithm.initMechanics();
	startGameLoop();
	const app = createApp(App);

	app.use(VueLatex).mount('#app');
}
