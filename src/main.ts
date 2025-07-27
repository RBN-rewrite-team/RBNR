import './assets/main.scss';
import './core/anti-cheat.ts';

import { createApp, watch } from 'vue';
import App from './App.vue';
import VueLatex from 'vatex';
import { loadSaves, save, type Player } from './core/save';
import { gameLoop } from './core/game-loop';
import { feature } from './core/global.ts';
import ModalService from './utils/Modal.ts';
import { NUMTHEORY } from './core/multiplication/numbertheory.ts';
import { Exponention } from './core/exponention/exponention.ts';
import { QolUpgrades } from './core/exponention/qolupg.ts';

export let loopInterval = NaN;
export let saveInterval = setInterval(save, 3000);

export function startGameLoop() {
	loopInterval = setInterval(gameLoop, 40);
}

export function stopGameLoop() {
	clearInterval(loopInterval);
}

loadSaves();
feature.SUCCESSOR.initMechanics();
feature.ADDITION.initMechanics();
feature.MULTIPLICATION.initMechanics();
feature.PrimeFactor.initMechanics();
NUMTHEORY.initMechanics();
Exponention.initMechanics();
QolUpgrades.initMechanics();
feature.ChessBoard.initMechanics();
startGameLoop();
const app = createApp(App);

app.use(VueLatex).mount('#app');
