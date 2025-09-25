// Retribution: 果报(Guotribution), 代码始终使用retribution及其英语变体

import { NON_RECURSIVE } from '../nonrecu';
import { player } from '../save';

export const RETRIBUTION = {
	doRetributed() {
		player.nonrecu = NON_RECURSIVE.playerData();
	},
};
