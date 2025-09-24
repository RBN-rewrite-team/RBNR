import { player } from '../save';
import { isUnreachable, getCurrentBlock } from './block';
import { positionDirection } from './room';

export function miniGameLoop(diff: number) {}
export type KeyPresses = 'up' | 'down' | 'left' | 'right';
export type Directions = 'up' | 'down' | 'left' | 'right' | 'other';
export function setPosManmade(goalpos: [bigint, bigint]) {
	//debugger;
	let a = !isUnreachable(player.minigame.current_room, goalpos[0], goalpos[1]);
	// console.log(a);
	if (a) {
		player.minigame.current_x = goalpos[0];
		player.minigame.current_y = goalpos[1];
	}
}
export function interactBlock(room: number, x: bigint, y: bigint, key: Directions) {
	return getCurrentBlock(room, x, y)?.interact?.(x, y, key);
}
export function handleKeyPress(key: KeyPresses) {
	if (['up', 'down', 'left', 'right'].includes(key)) {
		if (player.minigame.interact == 0) {
			let pos = positionDirection(
				[player.minigame.current_x, player.minigame.current_y],
				key as 'up' | 'down' | 'left' | 'right',
			);
			setPosManmade(pos);
			interactBlock(player.minigame.current_room, pos[0], pos[1], key);
		}
	}
}

export function keyboardEventListener(e: Event) {
	if (player.currentTab !== 1225) return;
	if (e instanceof KeyboardEvent) {
		switch (e.key) {
			case 'ArrowUp':
				handleKeyPress('up');
				break;
			case 'ArrowDown':
				handleKeyPress('down');
				break;
			case 'ArrowLeft':
				handleKeyPress('left');
				break;
			case 'ArrowRight':
				handleKeyPress('right');
				break;
		}
	}
}
