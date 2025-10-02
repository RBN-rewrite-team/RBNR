// Retribution: 果报(Guotribution(实际上就是Retribution)), 代码始终使用retribution及其英语变体

import Decimal from 'break_eternity.js';
import { Hydra } from '../hydra/hydra';
import { NON_RECURSIVE } from '../nonrecu';
import { player } from '../save';
import { DC } from '../constants';
import { wellOrderPlayerData } from '../ordinal/well_ordering';
import ModalService from '@/utils/Modal';
// prettier-ignore
const resetUpgrades = [
    /*'61',*/'610S','611','6110','6111','6112','6113','6114','611S','612','612S','613','613S','614','614S','615','615S','616S',
    '617','618','619','61R','61S','62','62R','62S','63','63R','63S','64','64R','64S','65','65R','65S','66','66R','66S','67R',
    '67S','68R','68S','69R','69S', '71','71UN','72','73','74','U6R11','U6R12','U6R13','U6R14','U6R15'
] as const satisfies (keyof typeof player.upgrades)[];

// prettier-ignore
const resetBuyables = [
    '611','612','613','614','61R','62R',
    'B6R11','B6R12','B6R13','B6R14','B6R15',
] as const satisfies (keyof typeof player.buyables)[];

export const RETRIBUTION = {
	reset() {
		player.nonrecu = NON_RECURSIVE.playerData();
		player.hydra = Hydra.playerData();
		player.challenges[1] = [DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0];
		player.challengein = [-1, -1];
		for (const key of resetUpgrades) {
			player.upgrades[key] = false;
		}
		for (const key of resetBuyables) {
			player.buyables[key] = DC.D_0;
		}
		for (const key of [
			'dut1',
			'dut2',
			'dut3',
			'dut4',
			'dut5',
			'dut6',
			'dut7',
			'dut8',
			'dut9',
			'dut10',
			'dut11',
			'dut12',
			'dut13',
			'dut14',
			'dut15',
			'dut16',
			'dut17',
			'dut18',

			'nonrec_1',
			'nonrec_2',
			'nonrec_3',
			'nonrec_4',
			'nonrec_5',
			'nonrec_6',
			'nonrec_7',
			'nonrec_8',
			'nonrec_9',
			'nonrec_10',
			'nonrec_11',
			'nonrec_12',
			'nonrec_13',
			'nonrec_14',
			'nonrec_15',
			'nonrec_16',
			'nonrec_17',
			'nonrec_18',
			'nonrec_19',
			'nonrec_20',
			'nonrec_21',
			'nonrec_22',
			'nonrec_23',
			'nonrec_24',
			'nonrec_25',
			'nonrec_26',
		]) {
			player.milestones[key] = false;
		}
		player.numbertheory.well_ordering = wellOrderPlayerData();
		player.numbertheory.GM.x = DC.D_0;
		player.currentTab = 19;
	},
	resetUI() {
		if (this.resetable()) {
			ModalService.show({
				title: this.name(),
				content:
					'你会失去你所有的非递归进度，以及当前九头蛇进度，以及升级...<br>但是你会获得启示，获得更恐怖的力量...',
				confirmText: '确定...',
				onConfirm() {
					RETRIBUTION.reset();
					// 类型安全不要删
					if (player.retribution == 0) player.retribution = 1;
				},
			});
		}
	},
	resetable() {
		if (player.retribution == 0) {
			return player.hydra.deduceOrdinal[0].gte(DC.D_4P4P256);
		}
		return false;
	},
	name: () => (player.options.isGuoGao ? '果糕' : '果报'),
};
