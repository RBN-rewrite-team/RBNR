import { createApp } from 'vue';
import App from '@/App.vue';
import VueLatex from 'vatex';
import { loadSaves, player } from '@/core/save';
import { feature } from '@/core/global.ts';
import { NUMTHEORY } from '@/core/multiplication/numbertheory.ts';
import { Exponention } from '@/core/exponention/exponention.ts';
import { QolUpgrades } from '@/core/exponention/qolupg.ts';
import { Logarithm } from '@/core/exponention/logarithm.ts';
import hotkeys from 'hotkeys-js';
import { vHold } from './vHold.ts';
import { Dilute } from '@/core/hydra/dilute.ts';

import { startGameLoop } from '@/core/game-loop';

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
	Dilute.initMechanics();
	startGameLoop();
	const app = createApp(App);

	app.use(VueLatex).directive('hold', vHold).mount('#app');

	hotkeys('a', (event) => {
		event.preventDefault();
		feature.ADDITION.UIreset();
	});

	hotkeys('m', (event) => {
		event.preventDefault();
		feature.MULTIPLICATION.UIreset();
	});

	hotkeys('e', (event) => {
		event.preventDefault();
		feature.EXPONENTION.UIreset();
	});
}
