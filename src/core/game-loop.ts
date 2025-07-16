import {player, feature} from'./global.ts';
import {nextTick} from 'vue';
import {UPGRADES, BUYABLES} from './mechanic.ts';
import Decimal from 'break_eternity.js';

export let diff = 0;

export function gameLoop() {
  diff = Date.now() - player.lastUpdated

  player.lastUpdated = Date.now();
  
  if(feature.NEXT.autoNextPerSecond().gte(0.001))
  {
	player.automationCD.next += diff;
	let cd = (new Decimal(1000)).div(feature.NEXT.autoNextPerSecond());
	if(cd.lt(player.automationCD.next))
	{
		let bulk = Math.floor(player.automationCD.next / Number(cd));
		player.automationCD.next %= Number(cd);
		feature.NEXT.doNext(bulk);
	}
  }
}
