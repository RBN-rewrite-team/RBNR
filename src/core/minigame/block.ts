import { player } from '../save';
import {
	GameObject,
	SwitchOnGameObject,
	RestrictedBoxObject,
	BoxGameObject,
	FakeWallGameObject,
	WallGameObject,
	WallInvisibleGameObject,
} from './game-object';
import { initialMap } from './map';
import { map2_block } from './maps/map-dungeon2';
import { map3_block } from './maps/map-dungeon3';
import type { Directions } from './minigame-loop';
import { replacement } from './replacement';
import { randomBlock } from './room';

export function blockToJSON(x: null | undefined | GameObject) {
	if (x === undefined || x === null) {
		return '0';
	}
	if (x instanceof SwitchOnGameObject) {
		return 'ACTIVE_SWITCH';
	}
	if (x instanceof RestrictedBoxObject) {
		return 'RESTRICTEDTIERBOX_' + x.tier;
	}
	if (x instanceof BoxGameObject) {
		return 'TIERBOX_' + x.tier;
	}
	if (x instanceof FakeWallGameObject) {
		return 'FAKEWALL';
	}
	if (x instanceof WallGameObject) {
		return 'W';
	}
	if (x instanceof WallInvisibleGameObject) {
		return 'WALL_INVISIBLE';
	}
	return 'UNSUPPORTED';
}

export function getCurrentBlock(room: number, x: bigint, y: bigint, nonreplaced = false) {
	if (room == 943360095 || room == 1 || room == -999 || room == 0 || room == 2 || room == 4) {
		let block;
		if (room == 943360095) block = randomBlock(x, y);
		else if (room == 0 || room == 2) {
			block = initialMap()[room].map[Number(y)]?.[Number(x)];
		} else if (room == 1) block = map2_block(Number(x), Number(y));
		else if (room == 4) block = map3_block(Number(x), Number(y));
		else if (room == -999) {
			if (player.minigame.initializeType.initializeType === 'rect') {
				if (x < 0n || y < 0n) block = undefined;
				else if (
					x > player.minigame.initializeType.rect_width ||
					y > player.minigame.initializeType.rect_height
				)
					block = undefined;
				else if (x == 0n) block = new WallGameObject();
				else if (y == 0n) block = new WallGameObject();
				else if (x == player.minigame.initializeType.rect_width)
					block = new WallGameObject();
				else if (y == player.minigame.initializeType.rect_height)
					block = new WallGameObject();
				else block = null;
			}
		}
		if (!nonreplaced) {
			let replacements = (player.minigame.replaces[room] ?? []).filter(
				(b) => b.x == x && b.y == y,
			);
			for (let i = 0; i < replacements.length; i++) {
				block = replacement(block, replacements[i]);
			}
		}
		return block;
	}
	return undefined;
}
export function isUnreachable(
	room: number,
	x: bigint,
	y: bigint,
	direction: Directions = 'other',
	playerxy: [bigint, bigint],
) {
	let obj = getCurrentBlock(room, x, y);
	if (typeof obj === 'object' && obj instanceof GameObject && obj.solid(direction, playerxy)) {
		return true;
	}
	return false;
}
