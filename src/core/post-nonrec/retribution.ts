// Retribution: 果报(Guotribution(实际上就是Retribution)), 代码始终使用retribution及其英语变体

import { player } from '../save';
import { DC } from '../constants';
import { temp } from '../temp-data';
import ModalService from '@/utils/Modal';
import { Analysis, PTreset } from '../pt';
import { getMessage } from '@/utils/i18n';
import { Upgrade } from '../upgrade';
import type Decimal from 'break_eternity.js';
import { feature } from '../global';
import { Ordinal } from '@/lib/ordinal';
import { Currencies } from '../currencies';
import { NON_RECURSIVE } from '../nonrecu';
import { Hydra } from '../hydra/hydra';
import { wellOrderPlayerData } from '../ordinal/well_ordering';
import { Y_SEQ } from './y-seq';
import { Oracle } from '../pt/oracle/oracle';
import { Garden } from '../pt/garden';
import { isDeveloper } from '../save/testing';

// prettier-ignore
const resetUpgrades = [
	/*'61',*/'610S','611','6110','6111','6112','6113','6114','611S','612','612S','613','613S','614','614S','615','615S','616S',
	'617','618','619','61R','61S','62','62R','62S','63','63R','63S','64','64R','64S','65','65R','65S','66','66R','66S','67R',
	'67S','68R','68S','69R','69S', '71','71UN','72','73','74','U6R11','U6R12','U6R13','U6R14','U6R15',
	'621','6210','6211','6212','621R','622','622R','623','624','625','626','627','628','629',
	'6210','6211','6212','6213','6214','6215','6216','6217','6218','6219','6220',
	'U6R21', 'U6R22', '81','82','83','84','85','86','87','88','89','810','811','812','813','814','815','816',
		'U6R31', 'U6R32', 'U6R33','U6R34','U6R35','U6R36','U6R37','U6R38','U6R39','U6R310','U6R311','U6R312',
		'7c1q', '7c2q', '7c3q', '7c4q', '7c5q', '7c6q', '7c7q', '7t1q', '7t2q', '7t3q', '7t4q', '7t5q', '7t6q', '7t7q', '7ta1q', '7ta2q', '7ta3q', '7tamq', '7hpa1q', '7hpm1q', '7hpa2q', '7hpm2q', '7hpa3q', '7hpm3q', '7hpa4q', '7hpm4q', '7nt4q', '7nt4uq', '7nt4bq', '7nt4bmq', '7nt5ubq', '7nt5bmq'
	
] as const satisfies (keyof typeof player.upgrades)[];

// prettier-ignore
const resetBuyables = [
	'611','612','613','614','61R','62R',
	'B6R11','B6R12','B6R13','B6R14','B6R15',
	'B6R21'
] as const satisfies (keyof typeof player.buyables)[];

export const RETRIBUTION = {
	reset() {
		player.nonrecu = NON_RECURSIVE.playerData();
		player.hydra = Hydra.playerData();
		player.challenges[1][0] = DC.D_0;
		player.challenges[1][1] = DC.D_0;
		player.challenges[1][2] = DC.D_0;
		player.challenges[1][3] = DC.D_0;
		player.challenges[1][4] = DC.D_0;
		player.challenges[1][5] = DC.D_0;
		player.challenges[1][6] = DC.D_0;
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
			'pt_1',
			'pt_2',
			'pt_3',
			'pt_4',
			'pt_5',
			'pt_6',
			'pt_7',
			'sin_1',
			'sin_2',
			'sin_3',
			'sin_4',
			'sin_5',
			'sin_6',
			'sin_7',
			'sin_8',
			'sin_9',
			'sin_10',
		]) {
			player.milestones[key] = false;
		}
		player.numbertheory.well_ordering = wellOrderPlayerData();
		player.numbertheory.GM.x = DC.D_0;
		player.postnonrec.yseq = Y_SEQ.playerData();
		player.pt = Analysis.playerData();
		player.oracle = Oracle.playerData();
		player.garden = Garden.playerData();
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
				content: (function () {
					if (player.retribution == 0) return getMessage('retri.reset');
					return getMessage('retri.reset2');
				})(),
				confirmText: getMessage('retri.ok'),
				onConfirm() {
					if (!RETRIBUTION.resetable()) return;
					RETRIBUTION.replayAnimation();
					setTimeout(function () {
						RETRIBUTION.reset();
						// 类型安全不要删
						if (player.retribution == 1) player.retribution = 2;
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
		if (player.retribution == 1)
			return (
				player.numbertheory.well_ordering.ySeqWellOrderness &&
				player.hydra.deduceOrdinal[1].gte(DC.D_F2P128)
			);

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
