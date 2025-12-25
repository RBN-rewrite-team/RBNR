import Decimal from 'break_eternity.js';
import { player } from '@/core/save';

export const Cardinal = {
	playerData() {
		return {
			stability: 100,
			cardinality: 0,

			world_pos: [0, 0] as [number, number],

			openedmap: false,
		};
	},
};

export function posVisitable(x: number, y: number) {
	return true;
}
export function visit(x: number, y: number) {
	if (posVisitable(x, y)) player.cardinal.world_pos = [x, y];
}
export function posis(x: number, y: number) {
	return player.cardinal.world_pos[0] == x && player.cardinal.world_pos[1] == y;
}
export function worldPosChange(direction: 'up' | 'down' | 'right' | 'left') {
	switch (direction) {
		case 'up':
			visit(player.cardinal.world_pos[0], player.cardinal.world_pos[1] + 1);
			break;
		case 'down':
			visit(player.cardinal.world_pos[0], player.cardinal.world_pos[1] - 1);
			break;
		case 'right':
			visit(player.cardinal.world_pos[0] + 1, player.cardinal.world_pos[1]);
			break;
		case 'left':
			visit(player.cardinal.world_pos[0] - 1, player.cardinal.world_pos[1]);
			break;
	}
}
