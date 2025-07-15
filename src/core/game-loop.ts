import {player, feature} from'./global.ts';

export let diff = 0;

export function gameLoop() {
  diff = Date.now() - player.lastUpdated

  player.lastUpdated = Date.now();
}
