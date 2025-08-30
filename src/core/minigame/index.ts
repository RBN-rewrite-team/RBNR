// import { deepCopy } from '../save';
// import type { GameObject } from './game-object';

import { player } from '../save';
import type { initializeInfo } from './room';

// import { maps, type SingleMap } from './map';
interface Replacements {
	x: bigint;
	y: bigint;
	replacedTo: string;
	recover?: boolean;
}
export interface PlayerMinigameData {
	current_room: number;
	current_x: bigint;
	current_y: bigint;
	ateditor: boolean;
	replaces: {
		[key: string]: Replacements[];
	};
	hp: number;
	interact: number;
	xp: number;
	ore_gets: number;
	keys_have: number[];
	box_gets: number[];
	direction: 'up' | 'down' | 'left' | 'right';
	taking_box: boolean;
	editor_mode: 'replace' | 'remove';
	block: 'W' | '0' | 'FAKEWALL';
	initializeType: initializeInfo;
}
export function initMiniGameData(): PlayerMinigameData;
export function initMiniGameData(): PlayerMinigameData {
	let a = {
		current_room: 0,
		current_x: 1n,
		current_y: 1n,
		replaces: {},
		keys_have: [],
		hp: 10,
		interact: 0,
		xp: 0,
		ore_gets: 0,
		box_gets: [0, 0, 0],
		direction: 'left',
		taking_box: false,
		ateditor: false,
		editor_mode: 'replace',
		block: '0',
		initializeType: {
			initializeType: 'rect',
			rect_width: 7n,
			rect_height: 7n,
		},
	} satisfies PlayerMinigameData;
	return a;
}
// export function writeContext(ctx: CanvasRenderingContext2D) {}

export { miniGameLoop } from './minigame-loop';
export { keyboardEventListener } from './minigame-loop';

export function currentPlayerLV() {
	return Math.floor((-1 + (8 * player.minigame.xp + 1) ** 0.5) / 2 + 1);
}

export function nextLVxp() {
	return (currentPlayerLV() * (currentPlayerLV() + 1)) / 2;
}

export function hardResetMiniGame() {
	player.minigame = initMiniGameData();
}

export function predictableBigIntRandom(x: bigint): number {
	let start = 232344573n * (x % 97n) ** 4n;
	const a = 15485863n;
	const b = 521791n;
	start = (start * a) % b;
	for (let i = 0; i < ((x * x) % 90n) + 90n; i++) {
		start = (start * a) % b;
	}
	return Number(start) / 521791;
}
