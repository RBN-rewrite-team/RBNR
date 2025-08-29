import type Decimal from 'break_eternity.js';
import { feature, player } from './global';
import { MULTI_CHALS } from './multiplication/challenges';
import { NON_RECURSIVE } from './nonrecu';
import { NONREC_CHALS } from './nonrecu/non-recursion-challenges';
export type SingleChallenge<T extends {} = {}> = {
	name: string;
	descEasy: string;
	descHard: string;
	loop?(): void; //Run every tick in challenge, use for update challenge amount;
	canEnter?(): boolean;
} & (
	| {
			effect(x: Decimal): Decimal;
			effD(x: Decimal): string;
	  }
	| {
			effect?(): never;
			effD?(): never;
	  }
) &
	T;
export const CHALLENGE: {
	resetFunctions: (() => void)[];
	challenges: SingleChallenge[][];

	enterChallenge(x: number, y: number): void;
	exitChallenge(): void;

	amountChallenge(x: number, y: number): Decimal;
	inChallenge(x: number, y: number): boolean;
	challengeLoop(): void;
} = {
	resetFunctions: [
		function () {
			feature.MULTIPLICATION.reset(true);
		},
		function () {
			NON_RECURSIVE.reset(true);
		},
	],
	challenges: [MULTI_CHALS, NONREC_CHALS] as const,

	enterChallenge(x, y) {
		if (!this.inChallenge(x, y)) {
			if (x >= this.challenges.length) throw Error('not a valid error');
			if (y >= this.challenges[x].length) throw Error('not a valid error');

			if (!(this.challenges[x][y].canEnter?.() ?? true)) return;
			player.challengein[0] = x;
			player.challengein[1] = y;

			this.resetFunctions[x]();
		}
	},
	exitChallenge() {
		this.resetFunctions[player.challengein[0]]();
		player.challengein[0] = -1;
		player.challengein[1] = -1;
	},
	inChallenge(x, y) {
		return player.challengein[0] == x && player.challengein[1] == y;
	},
	amountChallenge(x, y) {
		return player.challenges[x][y];
	},
	challengeLoop() {
		if (player.challengein[0] !== -1 && player.challengein[1] !== -1) {
			const curchal = this.challenges[player.challengein[0]][player.challengein[1]];
			curchal.loop?.();
		}
	},
};
