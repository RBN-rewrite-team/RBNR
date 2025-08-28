// import { deepCopy } from '../save';
// import type { GameObject } from './game-object';
// import { maps, type SingleMap } from './map';

export interface PlayerMinigameData {
	current_room: number;
	current_x: number;
	current_y: number;
}
export function initMiniGameData(): PlayerMinigameData;
export function initMiniGameData(): PlayerMinigameData {
	let a = {
		current_room: 0,
		current_x: 0,
		current_y: 0,
	};
	return a;
}
// export function writeContext(ctx: CanvasRenderingContext2D) {}

export { miniGameLoop } from './minigame-loop';
export { keyboardEventListener } from './minigame-loop';
