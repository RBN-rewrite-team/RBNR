import { player } from '../save';
import { WallGameObject } from './game-object';
import { maps, type SingleMap } from './map';

export function getCurrentBlock(map: SingleMap | undefined, x: number, y: number) {
	return map?.map?.[y]?.[x];
}
export function isUnreachable(map: SingleMap, x: number, y: number) {
	let obj = getCurrentBlock(map, x, y);
	if (typeof obj === 'object' && obj instanceof WallGameObject) {
		return true;
	}
	return false;
}

export function getPlayerCurrentMap(): SingleMap {
	let a = maps[player.minigame.current_room];

	return a;
}

export function positionDirection(
	pos: [number, number],
	x: 'up' | 'down' | 'left' | 'right',
): [number, number] {
	switch (x) {
		case 'up':
			return [pos[0], pos[1] - 1];
		case 'left':
			return [pos[0] - 1, pos[1]];
		case 'right':
			return [pos[0] + 1, pos[1]];
		case 'down':
			return [pos[0], pos[1] + 1];
		default:
			let a: never = x;
	}
	return [0, 0];
}
