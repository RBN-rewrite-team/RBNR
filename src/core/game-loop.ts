import { player, feature } from './global.ts';
import { nextTick } from 'vue';
import { UPGRADES, BUYABLES, upgrades, buyables } from './mechanic.ts';
import Decimal from 'break_eternity.js';

export let diff = 0;

export function gameLoop() {
  diff = Date.now() - player.lastUpdated;

  player.lastUpdated = Date.now();

  if (feature.SUCCESSOR.autoSuccessPerSecond().gte(0.001)) {
    player.automationCD.successor += diff;
    let cd = new Decimal(1000).div(feature.SUCCESSOR.autoSuccessPerSecond());
    if (cd.lt(player.automationCD.successor)) {
      let bulk = Math.floor(player.automationCD.successor / Number(cd));
      player.automationCD.successor %= Number(cd);
      feature.SUCCESSOR.success(bulk);
    }
  }
  
  for(let i in upgrades)
  {
	if(upgrades[i].keep != null && upgrades[i].keep())
	{
		player.upgrades[i as keyof typeof player.upgrades] = true;
	}
  }
  if(player.firstResetBit & 0b10)
  {
	player.multiplication.pfTime = player.multiplication.pfTime.add(diff);
  }
}
