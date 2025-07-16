import './assets/main.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { loadSaves, player, save, type Player } from './core/save';
import { gameLoop } from './core/game-loop';
import { feature } from './core/global.ts';
import ModalService from './utils/Modal.ts';

loadSaves();
feature.successor.initMechanics();
feature.ADDITION.initMechanics();

setInterval(gameLoop, 40);
setInterval(save, 3000);
const app = createApp(App);

app.mount('#app');

declare global {
  interface Window {
    player?: Player;
    ModalService?: typeof ModalService;
  }
}

if (import.meta.env.DEV) {
  window.player = player;
  window.ModalService = ModalService;
}
