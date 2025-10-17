import type Decimal from 'break_eternity.js';
import { DC } from './constants';
import type { ChooseTypes } from '@/utils/types';
import { player, type Player } from './save';

type ResetRecord = {
	last: number; // timestamp
	gain: Decimal;
};

export type PlayerStat = {
	chapter: number;
	totalNumber: Decimal;
	highestNumber: Decimal;
	totalMulpower: Decimal;
	highestMulpower: Decimal;
	totalAddpower: Decimal;
	hightestAddpower: Decimal;
	totalExppower: Decimal;
	highestExppower: Decimal;
	highestOrdLevel: number;
	recent10AddReset: ResetRecord[];
	recent10MulReset: ResetRecord[];
	recent10ExpReset: ResetRecord[];
	recent10HydraReset: ResetRecord[];
	recent10NonRecReset: ResetRecord[];
};

export function getInitialStat(): PlayerStat {
	return {
		recent10AddReset: [],
		recent10MulReset: [],
		recent10ExpReset: [],
		recent10HydraReset: [],
		recent10NonRecReset: [],
		chapter: -1,
		totalNumber: DC.D_0,
		highestNumber: DC.D_0,
		totalMulpower: DC.D_0,
		highestMulpower: DC.D_0,
		totalAddpower: DC.D_0,
		hightestAddpower: DC.D_0,
		totalExppower: DC.D_0,
		highestExppower: DC.D_0,
		highestOrdLevel: 0,
	};
}
export function updateResetStatData(
	resetkey: ChooseTypes<PlayerStat, ResetRecord[]>,
	gain: Decimal,
) {
	player.stat[resetkey].splice(0, 0, {
		last: Date.now(),
		gain,
	});
	player.stat[resetkey] = player.stat[resetkey].slice(0, 10);
}

export function getInterval(resetkey: ChooseTypes<PlayerStat, ResetRecord[]>) {
	if (player.stat[resetkey].length == 0) return 1 / 0;
	else if (player.stat[resetkey].length == 1)
		return player.stat[resetkey][0].last - player.saveCreateTime;
	else return player.stat[resetkey][0].last - player.stat[resetkey][1].last;
}
