import { createApp } from 'vue';
import App from '@/App.vue';
import VueLatex from 'vatex';
import { loadSaves, player, restoreBackup } from '@/core/save';
import { feature } from '@/core/global.ts';
import { NUMTHEORY } from '@/core/multiplication/numbertheory.ts';
import { Exponention } from '@/core/exponention/exponention.ts';
import { QolUpgrades } from '@/core/exponention/qolupg.ts';
import { Logarithm } from '@/core/exponention/logarithm.ts';
import hotkeys from 'hotkeys-js';
import { vHold } from './vHold.ts';
import { Dilute } from '@/core/hydra/dilute.ts';

import { startGameLoop } from '@/core/game-loop';
import { NON_RECURSIVE } from '@/core/nonrecu/index.ts';
import ModalService from './Modal.ts';
import { temp } from '@/core/temp-data.ts';

export function init() {
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
	NON_RECURSIVE.initMechanics();
	loadSaves();
	if (player.foundNaN && player.backup) {
		restoreBackup(player);
		ModalService.show({
			title: '已恢复存档',
			content:
				'此存档似乎出现了NaN或ω病毒（存在Not a Number或Infinity数值），因此游戏加载了备份。',
		});
	}
	player.foundNaN = false;
	player.frozen = false;
	player.run_a_tick_and_froze = false;
	startGameLoop();
	const app = createApp(App);
	setInterval(() => {
		if (temp.plotdisplay && !player.checkedPlots.includes(temp.plotdisplay)) {
			player.checkedPlots.push(temp.plotdisplay);
			player.checkedPlots = [...new Set(player.checkedPlots)];
		}
	}, 1000);
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

	hotkeys('h', (event) => {
		event.preventDefault();
		feature.Hydra.hydraReset(player.hydra.visiting);
	});
}
