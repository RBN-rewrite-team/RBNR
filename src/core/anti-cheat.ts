import { player } from '@/core/global.ts';
import { loopInterval, saveInterval } from '@/core/game-loop';
import ModalService from '@/utils/Modal';
import type { Player } from './save';
import Decimal from 'break_eternity.js';
import { OrdinalUtils } from '@/utils/ordinal';
import DisableDevtool from 'disable-devtool';
import { isDeveloper } from './save/testing.ts';

DisableDevtool({
	onDevtoolOpen(type, next) {
		clearInterval(loopInterval);
		clearInterval(saveInterval);
		document.body.innerHTML = '检测到恶意高危行为';

		next();
	},
	rewriteHTML: '检测到恶意高危行为',
	interval: 200,
	md5: 'df17d82024bd335488f86e0c9c4ed23c',
	url: 'https://localhost',
	ignore: isDeveloper,
	detectors: [0, 1, 3, 4, 6, 7], // Debugger容易被利用
});
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
