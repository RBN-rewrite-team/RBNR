import {player} from "./save";
import {NEXT} from './next/next.ts';
import {upgrades, buyables, UPGRADES, BUYABLES} from './mechanic.ts';

const feature = {
	mechanic: {UPGRADES: UPGRADES, BUYABLES: BUYABLES},
	upgrades: upgrades,
	buyables: buyables,
	NEXT: NEXT
};

export {
	player, 
	feature,
};