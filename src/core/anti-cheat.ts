import { player } from '@/core/global.ts';
import { loopInterval } from '@/core/game-loop';
import ModalService from '@/utils/Modal';
import type { Player } from './save';
import Decimal from 'break_eternity.js';
declare global {
	interface Window {
		game: object;
		player: Player;
		Modal: typeof ModalService;
		Decimal: typeof Decimal;
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
document.addEventListener('DOMContentLoaded', function () {
	if (import.meta.env.DEV) {
		window.player = player;
		window.Modal = ModalService;
		window.Decimal = Decimal;
	}
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
