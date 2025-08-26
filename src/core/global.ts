import { player } from './save';
import Decimal from 'break_eternity.js';
import { Successor } from './successor/successor.ts';
import { upgrades, buyables, softcaps, UPGRADES, BUYABLES, SOFTCAPS } from './mechanic.ts';
import { Addition } from './addition/addition.ts';
import { Multiplication } from './multiplication/multiplication.ts';
import { PrimeFactor } from './multiplication/pf.ts';
import { Exponention } from './exponention/exponention.ts';
import * as ChessBoard from './exponention/chessboard.ts';
import * as SingularityGenerator from './exponention/singularity-generator.ts';
import { CHALLENGE } from './challenge.ts';
import { resourceGain } from './resource-gain.ts';
import { ORDINAL } from './ordinal/ordinal.ts';
import { NON_RECURSIVE } from './nonrecu/';
import { OrdinalNT } from './ordinal/ordinalNT.ts';
import { TimeShard } from './timeshard/timeshard.ts';
import { Hydra } from './hydra/hydra.ts';

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
	SingularityGenerator: SingularityGenerator,
	Ordinal: ORDINAL,
	OrdinalNT: OrdinalNT,
	Hydra: Hydra,

	resourceGain: resourceGain,
	TimeShard: TimeShard,
	NON_RECURSIVE: NON_RECURSIVE,
};

export { player, feature };
