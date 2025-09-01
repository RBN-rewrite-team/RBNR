//import { predictableRandom } from '@/utils/algorithm';
import { deepCopy, player } from '../save';
import {
	BoxGameObject,
	FakeWallGameObject,
	GameObject,
	GuardGameObject,
	MoveableBoxGameObject,
	OreGameObject,
	RestrictedBoxObject,
	SwitchOnGameObject,
	TeleporterGameObject,
	WallGameObject,
	WallInvisibleGameObject,
} from './game-object';
import { initialMap, maps, type SingleMap } from './map';
import { predictableBigIntRandom } from '.';
import { map2_block } from './maps/map-dungeon2';
import ModalService from '@/utils/Modal';

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
	if (replacement.replacedTo == 'FAKEWALL') {
		// toJSON avaliable
		return new FakeWallGameObject();
	}
	if (replacement.replacedTo == 'WALL_INVISIBLE') {
		return new WallInvisibleGameObject();
	}
	if (replacement.replacedTo == 'W') {
		// toJSON avaliable
		return new WallGameObject();
	}
	let tryexec = /TIERBOX_(\d+)/.exec(replacement.replacedTo);
	if (tryexec && tryexec[1]) {
		// toJSON avaliable
		return new BoxGameObject(Number(tryexec[1]));
	}
	tryexec = /RESTRICTEDTIERBOX_(\d+)/.exec(replacement.replacedTo);
	if (tryexec && tryexec[1]) {
		// toJSON avaliable
		return new RestrictedBoxObject(Number(tryexec[1]));
	}
	if (replacement.replacedTo == 'BOX') {
		// toJSON avaliable
		return new MoveableBoxGameObject();
	}
	if (replacement.replacedTo == 'ACTIVE_SWITCH') {
		// toJSON avaliable
		return new SwitchOnGameObject();
	}
	return bl;
}
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
type AA<T> = T extends Record<any, infer V> ? V : any;
type BB<T> = T extends Array<infer C> ? C : any;

export function getCurrentBlock(room: number, x: bigint, y: bigint) {
	if (room == 943360095 || room == 1 || room == -999) {
		let block;
		if (room == 943360095) block = randomBlock(x, y);
		else if (room == 1) block = map2_block(Number(x), Number(y));
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
		let replacements = (player.minigame.replaces[room] ?? []).filter(
			(b) => b.x == x && b.y == y,
		);
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
	let a = initialMap()[room];
	let replacements = player.minigame.replaces[room] ?? [];
	for (let i = 0; i < replacements.length; i++) {
		let repl = replacements[i];
		if (!repl) continue;
		if (!a.map[Number(repl.y)]) continue;
		if (!a.map[Number(repl.y)][Number(repl.x)]) continue;

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
		return (player.minigame.replaces[0] ?? []).filter((x) => x.x == 24n && x.y == 14n)
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
export function positionEqual(xy1: [bigint, bigint], xy2: [bigint, bigint]) {
	return xy1[0] == xy2[0] && xy1[1] == xy2[1];
}
export function isTouched(x: bigint, y: bigint) {
	return (
		positionEqual(positionDirection([x, y], 'up'), [
			player.minigame.current_x,
			player.minigame.current_y,
		]) ||
		positionEqual(positionDirection([x, y], 'down'), [
			player.minigame.current_x,
			player.minigame.current_y,
		]) ||
		positionEqual(positionDirection([x, y], 'left'), [
			player.minigame.current_x,
			player.minigame.current_y,
		]) ||
		positionEqual(positionDirection([x, y], 'right'), [
			player.minigame.current_x,
			player.minigame.current_y,
		])
	);
}

export function addReplace(
	room: number,
	x: bigint,
	y: bigint,
	replacedTo: string,
	notPermanent: boolean = false,
) {
	if (!player.minigame.replaces[room]) {
		player.minigame.replaces[room] = [];
	}
	player.minigame.replaces[room].push({
		x,
		y,
		replacedTo,
		recover: notPermanent,
	});
}

export function removeReplaces(room: number, x: bigint, y: bigint) {
	if (!player.minigame.replaces[room]) {
		player.minigame.replaces[room] = [];
	} else {
		player.minigame.replaces[room] = player.minigame.replaces[room].filter(
			(a) => !(a.x == x && a.y == y),
		);
	}
}

export function initializeEditorMap() {
	ModalService.show({
		title: '初始化地图',
		content: '输入地图长宽高',
		fields: [
			{
				type: 'input',
				validation: (x) => Number.isInteger(Number(x)),
				placeholder: 'y轴长度',
			},
			{
				type: 'input',
				validation: (x) => Number.isInteger(Number(x)),
				placeholder: 'x轴长度',
			},
		],
		onConfirm(values: string[]) {
			player.minigame.replaces[-999] = [];
			player.minigame.initializeType.rect_height = BigInt(values[0]);
			player.minigame.initializeType.rect_width = BigInt(values[1]);
		},
	});
}

export type initializeInfo = {
	initializeType: 'rect';
	rect_width: bigint;
	rect_height: bigint;
};
