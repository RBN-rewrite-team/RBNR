import { predictableRandom } from '@/utils/algorithm';
import { deepCopy, player } from '../save';
import {
	BoxGameObject,
	GameObject,
	GuardGameObject,
	OreGameObject,
	WallGameObject,
} from './game-object';
import { initialMap, maps, type SingleMap } from './map';
export function randomBlock(x: number, y: number) {
	let randomer = predictableRandom(1000000 + x * 1000 + y);
	if (randomer < 0.1) return new WallGameObject();
	else if (randomer < 0.21) return new GuardGameObject(1);
	else if (randomer < 0.75) return null;
	else if (randomer < 0.8) return new BoxGameObject(1);
	else if (randomer < 0.81) return new BoxGameObject(2);
	else if (randomer < 0.811) return new BoxGameObject(3);
	else if (randomer < 0.8111) return new BoxGameObject(4);
	else if (randomer < 0.85) return new OreGameObject();
	return null;
}
type ArrayContent<T> = T extends Array<infer C> ? C : any;
export function replacement(
	bl: GameObject | null,
	replacement: ArrayContent<typeof player.minigame.replaces>,
) {
	if (replacement.replacedTo == '0') {
		return null;
	}
	return bl;
}
export function getCurrentBlock(room: number, x: number, y: number) {
	if (room == 943360095) {
		let block = randomBlock(x, y);
		let replacements = player.minigame.replaces.filter(
			(b) => b.room == player.minigame.current_room && b.x == x && b.y == y,
		);
		if (replacements[0]) {
			block = replacement(block, replacements[0]);
		}
		return block;
	}
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
		a.map[repl.y][repl.x] = replacement(a.map[repl.y][repl.x], repl);
	}
	return a;
}

export function getPlayerCurrentMap(room: number): SingleMap {
	return getPlayerMap(player.minigame.current_room);
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
	return 7;
}
export function isPlayerVisible(x: number, y: number) {
	if (x < player.minigame.current_x - visibleBlocks()) return false;
	if (x > player.minigame.current_x + visibleBlocks()) return false;
	if (y < player.minigame.current_y - visibleBlocks()) return false;
	if (y > player.minigame.current_y + visibleBlocks()) return false;
	return true;
}
