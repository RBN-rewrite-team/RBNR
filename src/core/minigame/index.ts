// import { deepCopy } from '../save';
// import type { GameObject } from './game-object';

import { player } from '../save';

// import { maps, type SingleMap } from './map';
interface Replacements {
	room: number;
	x: bigint;
	y: bigint;
	replacedTo: string;
}
export interface PlayerMinigameData {
	current_room: number;
	current_x: bigint;
	current_y: bigint;
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
		current_x: 1n,
		current_y: 1n,
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
	return Math.floor((-1 + (8 * player.minigame.xp + 1) ** 0.5) / 2 + 1);
}

export function nextLVxp() {
	return currentPlayerLV() * (currentPlayerLV() + 1) / 2;
}

export function hardResetMiniGame() {
	player.minigame = initMiniGameData();
}

export function predictableBigIntRandom(x: bigint): number {
  let start = 232344573n * (x % 97n) ** 4n
  const a = 15485863n;
  const b = 521791n;
  start = (start * a) % b;
  for (let i = 0; i < (x * x) % 90n + 90n; i++) {
    start = (start * a) % b;
  }
  return Number(start) / 521791;
}