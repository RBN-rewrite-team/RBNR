import { reactive } from 'vue';
import { type CoreEquipment } from './minigame/index.ts';
import type { Path } from './minigame/path-searcher.ts';
import { player } from './global.ts';
import Decimal from 'break_eternity.js';

export const temp = reactive({
	select_ach: [0, 0],
	plotdisplay: 0,
	plotstep: 0,
	plotcd: Date.now(),
	minigametip: '',
	dungeonsSP: 0,
	get innerWidth(): number {
		return window.innerWidth;
	},
	get useMobileStyle(): boolean {
		return document.body.clientWidth / document.body.clientHeight < 0.75;
	},
	openingCore: false,
	coreViewEquipment: null as null | CoreEquipment,
	coreViewColor(eq = temp.coreViewEquipment): string {
		const r = eq?.rarity ?? 0;
		if (r >= 1.9) return 'cyan';
		if (r >= 1.8) return 'red';
		if (r >= 1.6) return 'orange';
		if (r >= 1.4) return 'purple';
		if (r >= 1.0) return 'blue';
		return 'var(--color)';
	},
	pathdata: [] as Path[],
	pathsearch_locker: false,
	lastBMSDeduce: new Decimal(0), //修复推演速度显示bug
	retribution: 0,
	garden: reactive({
		press: false,
		press_last: [0, 0] as [number, number],

		tpress: false,
		tpress_last: [0, 0] as [number, number],
		focus_pos: [0, 0] as [number, number],
	}),
});
export function inPathData(x: bigint, y: bigint) {
	if (player.minigame.interact !== 5) return false;
	return temp.pathdata.findIndex((a) => a.x == x && a.y == y) !== -1;
}
