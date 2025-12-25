import { worldPosChange } from '.';

export function cardinalKeyboardListener(e: Event) {
	if (e instanceof KeyboardEvent) {
		switch (e.key) {
			case 'ArrowUp':
				worldPosChange('up');
				break;
			case 'ArrowDown':
				worldPosChange('down');
				break;
			case 'ArrowLeft':
				worldPosChange('left');
				break;
			case 'ArrowRight':
				worldPosChange('right');
				break;
		}
	}
}
