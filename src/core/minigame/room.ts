import { deepCopy, player } from '../save';
import { GameObject, WallGameObject } from './game-object';
import { initialMap, maps, type SingleMap } from './map';

export function getCurrentBlock(map: SingleMap | undefined, x: number, y: number) {
	return map?.map?.[y]?.[x];
}
export function isUnreachable(map: SingleMap, x: number, y: number) {
	let obj = getCurrentBlock(map, x, y);
	if (typeof obj === 'object' && obj instanceof GameObject && obj.solid()) {
		return true;
	}
	return false;
}

export function getPlayerCurrentMap(): SingleMap {
	let a = initialMap()[player.minigame.current_room];
	let replacements = player.minigame.replaces.filter(
		(x) => x.room == player.minigame.current_room,
	);
	for (let i = 0; i < replacements.length; i++) {
		let repl = replacements[i];
		if (repl.replacedTo == '0') {
			a.map[repl.y][repl.x] = null;
		}
	}
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

export function visibleBlocks() {
	return 114;
}
export function isPlayerVisible(x: number, y: number) {
	if (x < player.minigame.current_x - visibleBlocks()) return false;
	if (x > player.minigame.current_x + visibleBlocks()) return false;
	if (y < player.minigame.current_y - visibleBlocks()) return false;
	if (y > player.minigame.current_y + visibleBlocks()) return false;
	return true;
}
