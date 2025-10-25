import { loadSaves, player, restoreBackup } from '@/core/save';
import { createApp } from 'vue';
import VueLatex from 'vatex';
import { feature } from '@/core/global.ts';
import { NUMTHEORY } from '@/core/multiplication/numbertheory.ts';
import { Exponention } from '@/core/exponention/exponention.ts';
import { QolUpgrades } from '@/core/exponention/qolupg.ts';
import { Logarithm } from '@/core/exponention/logarithm.ts';
import hotkeys from 'hotkeys-js';
import { vHold } from './vHold.ts';
import { Dilute } from '@/core/hydra/dilute.ts';

import { startGameLoop, stopGameLoop, stopSaveLoop } from '@/core/game-loop';
import { NON_RECURSIVE } from '@/core/nonrecu/index.ts';
import ModalService from './Modal.ts';
import { keyboardEventListener } from '@/core/minigame/index.ts';

import App from '@/App.vue';
import { reinitializeMusic } from '@/core/music.ts';

import { timeCheck } from './time-check.ts';

export function init() {
	try {
		timeCheck();

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
		hotkeys('a', (event) => {
			if (player.singularity.stage >= 11) return;
			event.preventDefault();
			feature.ADDITION.UIreset();
		});

		hotkeys('m', (event) => {
			if (player.singularity.stage >= 11) return;
			event.preventDefault();
			feature.MULTIPLICATION.UIreset();
		});

		hotkeys('e', (event) => {
			if (player.singularity.stage >= 11) return;
			event.preventDefault();
			feature.EXPONENTION.UIreset();
		});

		hotkeys('h', (event) => {
			event.preventDefault();
			feature.Hydra.hydraReset(player.hydra.visiting);
		});
		hotkeys('n', (event) => {
			event.preventDefault();
			feature.NON_RECURSIVE.reset();
		});
		hotkeys('ArrowUp', keyboardEventListener);
		hotkeys('ArrowDown', keyboardEventListener);
		hotkeys('ArrowLeft', keyboardEventListener);
		hotkeys('ArrowRight', keyboardEventListener);
		//hardResetMiniGame();
		player.minigame.interact = 0;
		const app = createApp(App);
		app.use(VueLatex).directive('hold', vHold).mount('#app');

		document.addEventListener('DOMContentLoaded', function () {
			setTimeout(
				() => (document.getElementById('fullScreen1')!.style.cssText += 'opacity: 0'),
				1500,
			);
			setTimeout(
				() => (document.getElementById('fullScreen1')!.style.cssText += 'display: none;'),
				2000,
			);
		});
	} catch (e) {
		stopGameLoop();
		stopSaveLoop();
		throw e;
	}
	reinitializeMusic();
}
