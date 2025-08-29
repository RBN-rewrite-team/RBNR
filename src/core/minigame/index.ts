// import { deepCopy } from '../save';
// import type { GameObject } from './game-object';

import { player } from '../save';

// import { maps, type SingleMap } from './map';
interface Replacements {
	room: number;
	x: number;
	y: number;
	replacedTo: string;
}
export interface PlayerMinigameData {
	current_room: number;
	current_x: number;
	current_y: number;
	replaces: Replacements[];
	hp: number;
	interact: number;
	xp: number;
	ore_gets: number;
	keys_have: number[];
}
export function initMiniGameData(): PlayerMinigameData;
export function initMiniGameData(): PlayerMinigameData {
	let a = {
		current_room: 0,
		current_x: 1,
		current_y: 1,
		replaces: [],
		keys_have: [],
		hp: 10,
		interact: 0,
		xp: 0,
		ore_gets: 0,
	} satisfies PlayerMinigameData;
	return a;
}
// export function writeContext(ctx: CanvasRenderingContext2D) {}

export { miniGameLoop } from './minigame-loop';
export { keyboardEventListener } from './minigame-loop';

export function currentPlayerLV() {
	return Math.floor(player.minigame.xp + 1);
}

export function hardResetMiniGame() {
	player.minigame = initMiniGameData();
}
