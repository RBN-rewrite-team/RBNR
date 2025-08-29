import { deepCopy, player } from '../save';
import { GameObject, WallGameObject } from './game-object';
import { initialMap, maps, type SingleMap } from './map';

export function getCurrentBlock(room: number, x: number, y: number) {
	return getPlayerMap(room)?.map?.[y]?.[x];
}
export function isUnreachable(room: number, x: number, y: number) {
	let obj = getCurrentBlock(room, x, y);
	if (typeof obj === 'object' && obj instanceof GameObject && obj.solid()) {
		return true;
	}
	return false;
}

export function getPlayerMap(room: number): SingleMap {
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
	if (player.minigame.current_room == 0) {
		return player.minigame.replaces.filter((x) => x.x == 24 && x.y == 14 && x.room == 0)
			.length !== 0
			? 3
			: 1;
	}
	return 3;
}
export function isPlayerVisible(x: number, y: number) {
	if (x < player.minigame.current_x - visibleBlocks()) return false;
	if (x > player.minigame.current_x + visibleBlocks()) return false;
	if (y < player.minigame.current_y - visibleBlocks()) return false;
	if (y > player.minigame.current_y + visibleBlocks()) return false;
	return true;
}
