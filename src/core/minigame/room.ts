//import { predictableRandom } from '@/utils/algorithm';
import { deepCopy, player } from '../save';
import {
	BoxGameObject,
	GameObject,
	GuardGameObject,
	MoveableBoxGameObject,
	OreGameObject,
	TeleporterGameObject,
	WallGameObject,
} from './game-object';
import { initialMap, maps, type SingleMap } from './map';
import { predictableBigIntRandom } from '.';
import { map2_block } from './maps/map-dungeon2';

/**
 * 目前生成规则
 * 10%: 墙
 * 1%: 守卫
 * 0.05%: 传送门
 * 68.95%: 棍母
 * 5%: 奖励 tier1
 * 1%: 奖励 tier 2
 * 0.1%: 奖励 tier 3
 * 0.01%: 奖励 tier 4
 * 3.89%: 矿石
 */
export function randomBlock(x: bigint, y: bigint) {
	let randomer = predictableBigIntRandom(1000000n + x * 1000n + y);
	if (randomer < 0.1) return new WallGameObject();
	else if (randomer < 0.21) return new GuardGameObject(1);
	else if (randomer < 0.2105)
		return new TeleporterGameObject(
			[x + BigInt(Math.floor(randomer * 514)), y - BigInt(Math.floor(randomer * 114))],
			943360095,
		);
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
	bl: GameObject | null | undefined,
	replacement: ArrayContent<typeof player.minigame.replaces>,
) {
	if (replacement.replacedTo == '0') {
		return null;
	}
	if (replacement.replacedTo == 'BOX') {
		return new MoveableBoxGameObject();
	}
	return bl;
}
export function getCurrentBlock(room: number, x: bigint, y: bigint) {
	if (room == 943360095 || room == 1) {
		let block;
		if (room == 943360095) block = randomBlock(x, y);
		else block = map2_block(Number(x), Number(y));
		let replacements = player.minigame.replaces.filter(
			(b) => b.room == room && b.x == x && b.y == y,
		);
		if (x == 4n && y == 4n) debugger;
		for (let i = 0; i < replacements.length; i++) {
			block = replacement(block, replacements[i]);
		}
		return block;
	}
	return getPlayerMap(room)?.map?.[Number(y)]?.[Number(x)];
}
export function isUnreachable(room: number, x: bigint, y: bigint) {
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
		a.map[Number(repl.y)][Number(repl.x)] = replacement(
			a.map[Number(repl.y)][Number(repl.x)],
			repl,
		);
	}
	return a;
}

export function getPlayerCurrentMap(): SingleMap {
	return getPlayerMap(player.minigame.current_room);
}

export function positionDirection(
	pos: [bigint, bigint],
	x: 'up' | 'down' | 'left' | 'right',
): [bigint, bigint] {
	switch (x) {
		case 'up':
			return [pos[0], pos[1] - 1n];
		case 'left':
			return [pos[0] - 1n, pos[1]];
		case 'right':
			return [pos[0] + 1n, pos[1]];
		case 'down':
			return [pos[0], pos[1] + 1n];
		default:
			let a: never = x;
	}
	return [0n, 0n];
}

export function visibleBlocks() {
	if (player.minigame.current_room == 0) {
		return player.minigame.replaces.filter((x) => x.x == 24n && x.y == 14n && x.room == 0)
			.length !== 0
			? 3n
			: 1n;
	}
	if (player.minigame.current_room == 1) return 3n;
	if (player.minigame.current_room == 2) return 1n;
	return import.meta.env.DEV ? 10n : 1n;
}
export function isPlayerVisible(x: bigint, y: bigint) {
	if (x < player.minigame.current_x - visibleBlocks()) return false;
	if (x > player.minigame.current_x + visibleBlocks()) return false;
	if (y < player.minigame.current_y - visibleBlocks()) return false;
	if (y > player.minigame.current_y + visibleBlocks()) return false;
	return true;
}
