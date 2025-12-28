import PowiainaNum, { type PowiainaNumSource } from 'powiaina_num.js';
import { player } from '../global';
import { format, formatWhole } from '@/utils/format';
import { getMessage, i18n } from '@/utils/i18n';

export const FFFZ = {
	playerData() {
		return {
			deduced: new PowiainaNum(0),
			progress: new PowiainaNum(0),
		};
	},
	deduceSpeed(): PowiainaNum {
		let base = new PowiainaNum(1 / 80);
		return base;
	},
};
