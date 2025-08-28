import { player } from '../save';
import { getPlayerCurrentMap, isUnreachable, positionDirection } from './room';

export function miniGameLoop(diff: number) {}
export type KeyPresses = 'up' | 'down' | 'left' | 'right';
export function setPosManmade(goalpos: [number, number]) {
	//debugger;
	let a = !isUnreachable(getPlayerCurrentMap(), goalpos[0], goalpos[1]);
	console.log(a);
	if (a) {
		player.minigame.current_x = goalpos[0];
		player.minigame.current_y = goalpos[1];
	}
}
export function handleKeyPress(key: KeyPresses) {
	if (['up', 'down', 'left', 'right'].includes(key)) {
		setPosManmade(
			positionDirection(
				[player.minigame.current_x, player.minigame.current_y],
				key as 'up' | 'down' | 'left' | 'right',
			),
		);
	}
}

export function keyboardEventListener(e: Event) {
	console.log(e);
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
