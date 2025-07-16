import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import {loadSaves, player, save, type Player} from './core/save'
import {gameLoop} from './core/game-loop'
import {feature} from './core/global.ts';

loadSaves();
feature.NEXT.initMechanics();

setInterval(gameLoop, 40)
setInterval(save, 3000)
createApp(App).mount('#app')

declare global {
  interface Window {
    player?: Player
  }
}

if (import.meta.env.DEV) {
  window.player = player
}


