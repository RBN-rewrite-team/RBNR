import { Y_SEQ } from './y-seq';

export const POST_NONREC = {
	Y_SEQ,
	playerData() {
		return {
			yseq: Y_SEQ.playerData(),
		};
	},
} as const;
