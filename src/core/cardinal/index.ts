import Decimal from 'break_eternity.js';
import { player } from '@/core/save';

export const Cardinal = {
	playerData() {
		return {
			stability: 100,
			cardinality: 0,

			world_pos: [0, 0] as [number, number],
		};
	},
};

export function worldPosChange(direction: 'up'|'down'|'right'|'left') {
	switch (direction) {
		case 'up':
			player.cardinal.world_pos[1]++;
			break;
		case 'down':
			player.cardinal.world_pos[1]--;
			break;
		case 'right':
			player.cardinal.world_pos[0]++;
			break;
		case 'left':
			player.cardinal.world_pos[0]--;
			break;
	}
}