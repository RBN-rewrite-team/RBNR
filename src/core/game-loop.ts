import {player} from "./save";

export let diff = 0;

export function gameLoop() {
  diff = Date.now() - player.lastUpdated

  player.lastUpdated = Date.now();
}
