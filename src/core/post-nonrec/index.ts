import { MMS } from './mms';
import { PTO } from './pto';
import { Y_SEQ } from './y-seq';

export const POST_NONREC = {
	Y_SEQ,
	PTO,
	MMS,
	playerData() {
		return {
			yseq: Y_SEQ.playerData(),
		};
	},
} as const;
