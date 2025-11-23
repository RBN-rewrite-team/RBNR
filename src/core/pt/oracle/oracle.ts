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

export const Oracle = {
	isUnlocked(): boolean {
		return Garden.level().gte(10);
	},
	playerData() {
		return {
			bits: new Decimal(0),
			loop: new Decimal(0),
			startDate: 0,
		};
	},
} as const;
