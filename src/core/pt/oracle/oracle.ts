import { player } from '@/core/global';
import { format } from '@/utils/format';
import Decimal, { type DecimalSource } from 'break_eternity.js';
import { DC } from '../../constants';
import ModalService from '@/utils/Modal';
import { predictableRandom } from '@/utils/algorithm.ts';
import { deepCopy } from '../../save';
import { updateResetStatData } from '../../stats';
import { getMessage, i18n } from '@/utils/i18n';
import type { $t } from '@/utils/types';
import { Garden } from '../garden.ts';

function nextDayDate(date: Date): Date {
	const nextDay = new Date(date.getTime());
	nextDay.setHours(0, 0, 0, 0);
	nextDay.setDate(nextDay.getDate() + 1);
	return nextDay;
}

export const Oracle = {
	isUnlocked(): boolean {
		return Garden.level().gte(10);
	},
	nowBitsHave(): Decimal {
		return player.oracle.totalBits.sub(player.oracle.spendBits);
	},
	nextBitCD(): Decimal {
		let baseTime = new Decimal(30000);
		let scale = new Decimal(2);
		return baseTime.mul(scale.pow(player.oracle.totalBits));
	},
	bitGainProgress(): number {
		let diff = Oracle.bitGainSpeedMult().mul(Date.now() - player.oracle.startDate);
		return diff.div(Oracle.nextBitCD()).toNumber();
	},
	bitGainSpeedMult(): Decimal {
		let base = new Decimal(1);
		return base;
	},
	canGainBit(): boolean {
		return Oracle.bitGainProgress() >= 1;
	},
	fateCost(id: number): Decimal {
		if(player.oracle.fateBought[id] < 3) return new Decimal(1);
		else return new Decimal(3).pow(player.oracle.fateBought[id] - 3);
	},
	oracleLoop(diff: number) {
		if(!Oracle.isUnlocked())
		{
			player.oracle.startDate = Date.now();
			return;
		}
		if (Oracle.canGainBit()) {
			player.oracle.totalBits = player.oracle.totalBits.add(1);
			player.oracle.startDate = Date.now();
		}
	},
	playerData() {
		return {
			totalBits: new Decimal(0),
			spendBits: new Decimal(0),
			startDate: 0,
			fate: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
			fateBought: [0, 0, 0, 0, 0],
		};
	},
} as const;
