import { player, feature } from './global.ts';
import { nextTick } from 'vue';
import { UPGRADES, BUYABLES } from './mechanic.ts';
import Decimal from 'break_eternity.js';

export let diff = 0;

export function gameLoop() {
  diff = Date.now() - player.lastUpdated;

  player.lastUpdated = Date.now();

  if (feature.successor.autosuccessorPerSecond().gte(0.001)) {
    player.automationCD.successor += diff;
    let cd = new Decimal(1000).div(feature.successor.autosuccessorPerSecond());
    if (cd.lt(player.automationCD.successor)) {
      let bulk = Math.floor(player.automationCD.successor / Number(cd));
      player.automationCD.successor %= Number(cd);
      feature.successor.dosuccessor(bulk);
    }
  }
}
