// Retribution: 果报(Guotribution(实际上就是Retribution)), 代码始终使用retribution及其英语变体

import { player } from '../save';
import { DC } from '../constants';
import { temp } from '../temp-data';
import ModalService from '@/utils/Modal';
import { PTreset } from '../pt';
import { getMessage } from '@/utils/i18n';
import { Upgrade } from '../upgrade';
import type Decimal from 'break_eternity.js';
import { feature } from '../global';
import { Ordinal } from '@/lib/ordinal';
import { Currencies } from '../currencies';

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
				title: getMessage('tab.retribution'),
				content: getMessage('retri.reset'),
				confirmText: getMessage('retri.ok'),
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
			return player.hydra.deduceOrdinal[0].gte(DC.D_4T6);
		}
		return false;
	},
	name: () => (player.options.isGuoGao ? '果糕' : '果报'),
};

export const psdupgrade = new (class U52 extends Upgrade {
	cost: () => Decimal = function () {
		return new Ordinal('w+4').toDecimal(feature.Ordinal.base());
	};
	ordinal = true;
	name = '?????';
	currency: Currencies = Currencies.NEVER;
})();
