//import { predictableRandom } from '@/utils/algorithm';
import { player } from '../save';
import {
	BoxGameObject,
	GuardGameObject,
	OreGameObject,
	TeleporterGameObject,
	WallGameObject,
} from './game-object';
import { predictableBigIntRandom } from '.';
import ModalService from '@/utils/Modal';
import { getMessage } from '@/utils/i18n';

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
	const randomer = predictableBigIntRandom(1000000n + x * 1000n + y);
	if (randomer < 0.1) return new WallGameObject();
	else if (randomer < 0.21) return new GuardGameObject(1, getMessage);
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
			const a: never = x;
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
	if (player.minigame.current_room == 4) return 3n;
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
