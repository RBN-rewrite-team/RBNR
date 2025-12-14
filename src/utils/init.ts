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

import { startGameLoop, startSaveLoop, stopGameLoop, stopSaveLoop } from '@/core/game-loop';
import { NON_RECURSIVE } from '@/core/nonrecu/index.ts';
import ModalService from './Modal.ts';
import { keyboardEventListener } from '@/core/minigame/index.ts';

import { reinitializeMusic } from '@/core/music.ts';

import { timeCheck } from './time-check.ts';
import { initPTMilestones } from '@/core/pt/milestones.ts';
import App from '@/App.tsx';
import { getMessage, i18n } from './i18n.ts';
import { initSINMiletones } from '@/core/pt/oracle/sin.ts';
import { tryGetFingerprintJS } from './fingerprint.ts';
import { MultiTabDetector } from './tab-detector.ts';
let detector;
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
		initPTMilestones();
		initSINMiletones();
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
		if (player.fingerprint === 'no-any-content') {
			console.log('Detected No any fingerprint data, trying to get');
			tryGetFingerprintJS().then((x) => {
				console.log('Got fingerprint, ', x);
				player.fingerprint = x;
			});
		}
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
		// window.temp = temp;
		setTimeout(function () {
			const app = createApp(App);

			app.use(i18n).use(VueLatex).directive('hold', vHold).mount('#app');
		}, 500);

		document.addEventListener('DOMContentLoaded', function () {
			setTimeout(
				() => (document.getElementById('fullScreen1')!.style.cssText += 'opacity: 0'),
				import.meta.env.DEV ? 0 : 1500,
			);
			setTimeout(
				() => (document.getElementById('fullScreen1')!.style.cssText += 'display: none;'),
				import.meta.env.DEV ? 0 : 2000,
			);
		});
		detector = new MultiTabDetector({
			heartbeatInterval: 3000,
			onMultipleTabs: (result) => {
				// isMultiTab.value = result.isMultiTab;
				// tabCount.value = result.tabCount;
				// if (options?.onDetection) {
				//   options.onDetection(result);
				// }
				console.log('Detected multi tabs');
				ModalService.show({
					title: getMessage('detectedmulti.title'),
					content: getMessage('detectedmulti.content'),
				});
				stopSaveLoop();
			},
			onSingleTab: (result) => {
				console.log("There\'s no wrong");
				// isMultiTab.value = false;
				// tabCount.value = 1;
				startSaveLoop();
			},
		});
		detector.detect();

		// console.log(JSON.stringify(localization));
	} catch (e) {
		stopGameLoop();
		stopSaveLoop();
		throw e;
	}
	reinitializeMusic();
}
