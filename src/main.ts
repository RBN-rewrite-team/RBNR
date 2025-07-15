import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import {loadSaves, player, save, type Player} from './core/save'
import {gameLoop} from './core/game-loop'

loadSaves();
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


