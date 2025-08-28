// import { deepCopy } from '../save';
// import type { GameObject } from './game-object';
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
}
export function initMiniGameData(): PlayerMinigameData;
export function initMiniGameData(): PlayerMinigameData {
	let a = {
		current_room: 0,
		current_x: 0,
		current_y: 0,
		replaces: [],
	};
	return a;
}
// export function writeContext(ctx: CanvasRenderingContext2D) {}

export { miniGameLoop } from './minigame-loop';
export { keyboardEventListener } from './minigame-loop';
