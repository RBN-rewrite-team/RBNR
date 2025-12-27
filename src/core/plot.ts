import type { $t } from '@/utils/types';
import { player } from './save';
import { getMessage, i18n } from '@/utils/i18n';
export const PlotMilestones = [
	() => true,
	() => player.stat.chapter >= 0,
	() => player.stat.chapter >= 1,
	() => player.stat.chapter >= 2,
	() => player.upgrades['39'] || player.stat.chapter >= 3,
	() => player.stat.chapter >= 3,
	() =>
		player.buyables['lgr_emp'].gte(1) ||
		player.milestones['log_G'] ||
		player.stat.chapter >= 3.1,
	() => player.milestones['log_G'] || player.stat.chapter >= 4,
	() => player.singularity.enabled || player.stat.chapter >= 4,
	() => player.stat.chapter >= 4 || player.retribution >= 1,
	() => player.stat.chapter >= 5 || player.retribution >= 1,
	() => player.upgrades['69R'] || player.retribution >= 1,
	() => player.upgrades['69S'] || player.stat.chapter >= 6 || player.retribution >= 1,
	() => player.stat.chapter >= 6 || player.retribution >= 1,
	() => player.challenges[1][0].gt(0) || player.retribution >= 1,
	() => player.milestones.nonrec_24 || player.retribution >= 1,
	() => player.challenges[1][6].gt(0) || player.retribution >= 1,
	() => player.numbertheory.well_ordering.energy.gte('1e750000000') || player.retribution >= 1,
	() =>
		(player.numbertheory.well_ordering.energy.gte('1e750000000') && player.currentTab == 28) ||
		player.retribution >= 1,
	() => player.pt.resetTimes.gte(1) || player.retribution >= 2,
] as const;
export const plotTitles = [
	'第\\(-\\epsilon\\)章',
	'第0章',
	'第1章',
	'第2章',
	'乘法挑战',
	'第3章',
	'天文学家',
	'对数膨胀',
	'奇点生成器',
	'第4章',
	'第5章',
	'稀释',
	'朊病毒',
	'第6章',
	'完成第一次NRC1',
	'里程碑M-6-24',
	'NRC7',
	'到达BMS极限',
	'果报',
	'证明论重置',
] as const;
export function unlockedPlots2() {
	for (let unlocked = PlotMilestones.length - 1; unlocked >= 0; unlocked--) {
		if (PlotMilestones[unlocked]()) return unlocked + 1;
	}
	return 0;
}
export function unlockedPlots(): number[] {
	const unlockedp = [] as number[];
	let a = unlockedPlots2();
	for (let i = 0; i < a; i++) {
		unlockedp.push(i);
	}
	return unlockedp;
}
export function viewedPlotLength() {
	return player.checkedPlots.length;
}

export function plotLength(id: number, $tm: (x: string) => string[]): number {
	if (id <= 0) return 0;
	return $tm('plotcontent')[id - 1].length;
}
export const characterImages = {
	Numerorum: 'url(./plot_image/NumerorumColor.png)',
	天文学家: 'url(./plot_image/EdenGameMaster.png)',
	Astronomer: 'url(./plot_image/EdenGameMaster.png)',
	Hydra: 'url(./plot_image/Hydra.png)',
	VeryRDefie: 'url(./plot_image/VeryRDefie.png)',
} as Record<string, string | undefined>;
export function stringToPlot(a: string, $t: $t) {
	const res = {
		image: 'url(./plot_image/placeholder.png)',
		name: '???',
		text: '拜谢',
	};
	const args = a.split('\t');
	if (args.length == 1) {
		res.text = args[0];
		res.name = $t('plot.narrator');
	} else if (args.length == 3) {
		res.name = args[0];
		res.text = args[2];
		const imagea = characterImages[args[1]];
		if (imagea) {
			res.image = imagea;
		}
	} else {
		res.name = args[0];
		res.text = args[1];
		const imagea = characterImages[res.name];
		if (imagea) {
			res.image = imagea;
		}
	}
	if (res.name == '天文学家' && i18n.global.locale !== 'zh-CN') {
		res.name = getMessage('plot.astronomer');
	}
	return res;
}
