import { player } from './save';
import Decimal from 'break_eternity.js';
import { Successor } from './successor/successor.ts';
import { upgrades, buyables, softcaps, UPGRADES, BUYABLES, SOFTCAPS } from './mechanic.ts';
import { Addition } from './addition/addition.ts';
import { Multiplication } from './multiplication/multiplication.ts';
import { PrimeFactor } from './multiplication/pf.ts';
import { Exponention } from './exponention/exponention.ts';
import * as ChessBoard from './exponention/chessboard.ts';
import { CHALLENGE } from './challenge.ts';
import { resourceGain } from './resource-gain.ts';

const feature = {
	mechanic: { UPGRADES: UPGRADES, BUYABLES: BUYABLES },
	upgrades: upgrades,
	buyables: buyables,
	SUCCESSOR: Successor,
	ADDITION: Addition,
	MULTIPLICATION: Multiplication,
	PrimeFactor: PrimeFactor,
	EXPONENTION: Exponention,
	ChessBoard: ChessBoard,

	resourceGain: resourceGain,
};

export { player, feature };
