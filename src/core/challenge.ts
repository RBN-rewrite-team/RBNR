import type Decimal from 'break_eternity.js';
import { feature, player } from './global';
import { MULTI_CHALS } from './multiplication/challenges';
import { NON_RECURSIVE } from './nonrecu';
import { NONREC_CHALS } from './nonrecu/non-recursion-challenges';
export type SingleChallenge<T extends object = {}> = {
	// name: string;
	// descEasy: string;
	// descHard: string;
	loop?(): void; //Run every tick in challenge, use for update challenge amount;
	canEnter?(): boolean;
	onExit?(): void;
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
export const CHALLENGE = {
	resetFunctions: [
		function () {
			feature.MULTIPLICATION.reset(true);
		},
		function () {
			NON_RECURSIVE.reset(true);
		},
	] as (() => void)[],
	challenges: [MULTI_CHALS, NONREC_CHALS] as SingleChallenge[][],

	enterChallenge(x: number, y: number) {
		if (!this.inChallenge(x, y)) {
			if (x >= this.challenges.length) throw Error('not a valid error');
			if (y >= this.challenges[x].length) throw Error('not a valid error');

			if (!(this.challenges[x][y].canEnter?.() ?? true)) return;
			const a = x == 0;
			if (a) this.resetFunctions[x]();
			player.challengein[0] = x;
			player.challengein[1] = y;

			if (!a) this.resetFunctions[x]();
		}
	},
	exitChallenge(x: number, y: number) {
		this.resetFunctions[player.challengein[0]]();
		player.challengein[0] = -1;
		player.challengein[1] = -1;
		this.challenges[x][y].onExit?.();
	},
	inChallenge(x: number, y: number) {
		return player.challengein[0] == x && player.challengein[1] == y;
	},
	amountChallenge(x: number, y: number) {
		return player.challenges[x][y];
	},
	challengeLoop() {
		if (player.challengein[0] !== -1 && player.challengein[1] !== -1) {
			const curchal = this.challenges[player.challengein[0]][player.challengein[1]];
			curchal.loop?.();
		}
	},
};
