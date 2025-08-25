import { player } from './save';

export function unlockedPlots() {
	let a = 1;
	if (player.stat.chapter >= 0) {
		a++;
	}
	return a;
}
export function viewedPlotLength() {
	return player.checkedPlots.length;
}
