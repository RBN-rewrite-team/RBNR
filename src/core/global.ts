import { player } from './save';
import Decimal from 'break_eternity.js';
import { Successor } from './successor/successor.ts';
import { upgrades, buyables, softcaps, UPGRADES, BUYABLES, SOFTCAPS } from './mechanic.ts';
import { Addition } from './addition/addition.ts';
import { Multiplication } from './multiplication/multiplication.ts';
import { PrimeFactor } from './multiplication/pf.ts';
import { Exponention } from './exponention/exponention.ts';
import { CHALLENGE } from './challenge.ts';

const feature = {
	mechanic: { UPGRADES: UPGRADES, BUYABLES: BUYABLES },
	upgrades: upgrades,
	buyables: buyables,
	SUCCESSOR: Successor,
	ADDITION: Addition,
	MULTIPLICATION: Multiplication,
	PrimeFactor: PrimeFactor,
	EXPONENTION: Exponention,

	resourceGain: {
		number(num = player.number) {
			let base = feature.SUCCESSOR.successorBulk().pow(feature.SUCCESSOR.successorPow());
			base = base.mul(feature.SUCCESSOR.autoSuccessPerSecond());
			base = SOFTCAPS.fluidComputed('number^1', base, player.number);
			base = SOFTCAPS.fluidComputed('number^2', base, player.number);
			if (CHALLENGE.inChallenge(0, 2))
				base = SOFTCAPS.fluidComputed('number_C1', base, player.number);
			return { value: base };
		},
		addpower() {
			let base = feature.ADDITION.gain();
			let softcap = 0;
			let sc1 = new Decimal(2).pow(384);
			base = SOFTCAPS.fluidComputed('addpower^1', base, player.addpower);
			let passive = new Decimal(0.01);
			return { value: base, passive: passive };
		},
		mulpower() {
			let base = feature.MULTIPLICATION.gain();
			return { value: base };
		},
		exppower() {
			let base = feature.EXPONENTION.gain();
			return { value: base };
		},
	},
};

export { player, feature };
