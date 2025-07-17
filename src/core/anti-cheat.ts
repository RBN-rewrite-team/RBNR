import { player } from '@/core/global.ts';
import { loopInterval } from '@/main.ts';
import ModalService from '@/utils/Modal';
declare global {
	interface Window {
		game: object;
	}
}

Object.defineProperty(window, 'game', {
	get() {
		return JSON.parse(JSON.stringify(player));
	},
	set() {
		clearInterval(loopInterval);
		for (let i = 1; i <= 100; i++) {
			console.error('Uncaught Error: Unexpected behaviour.');
		}
		throw new Error('Unexpected behaviour.');
	},
	enumerable: false,
	configurable: false,
});

let cheat = false;

function detectTimerHooker(): void {
	if (document.getElementsByClassName('_th-container')[0] != void 0) {
		if (cheat) throw new Error('?'); // 防止卡死
		clearInterval(loopInterval);
		ModalService.show({
			title: '作弊检测',
			content: '检测到您正在使用作弊程序，请关闭后再试！',
			closeOnClickMask: false,
			showCancelButton: false,
			showConfirmButton: false,
		});
		cheat = true;
	}
}

setInterval(detectTimerHooker, 1000);

export {};
