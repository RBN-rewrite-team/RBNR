// Retribution: 果报(Guotribution(实际上就是Retribution)), 代码始终使用retribution及其英语变体

import Decimal from 'break_eternity.js';
import { Hydra } from '../hydra/hydra';
import { NON_RECURSIVE } from '../nonrecu';
import { player } from '../save';
import { DC } from '../constants';
import { wellOrderPlayerData } from '../ordinal/well_ordering';
import { temp } from '../temp-data';
import ModalService from '@/utils/Modal';
import { PTreset } from '../pt';

export const RETRIBUTION = {
	reset() {
		PTreset();
		player.currentTab = 19;
	},
	replayAnimation() {
		temp.retribution = 1;
		setTimeout(function () {
			temp.retribution = 0.5;
			setTimeout(function () {
				temp.retribution = 0;
			}, 5000);
		}, 20000);
	},
	resetUI() {
		if (this.resetable()) {
			ModalService.show({
				title: this.name(),
				content:
					'你会失去你所有的非递归进度，以及当前九头蛇进度，以及升级...<br>但是你会获得启示，获得更恐怖的力量...',
				confirmText: '确定...',
				onConfirm() {
					if (!RETRIBUTION.resetable()) return;
					RETRIBUTION.replayAnimation();
					setTimeout(function () {
						RETRIBUTION.reset();
						// 类型安全不要删
						if (player.retribution == 0) player.retribution = 1;
					}, 20000);
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
