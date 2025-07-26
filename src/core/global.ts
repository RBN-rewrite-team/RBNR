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
			let softcaps = 0,
				scList = ['number^1', 'number^2', 'number^3'];
			for (let i = 0; i < scList.length; i++) {
				if (SOFTCAPS.reach(scList[i], player.number)) {
					softcaps++;
					base = SOFTCAPS.fluidComputed(scList[i], base, player.number);
				}
			}
			if (CHALLENGE.inChallenge(0, 2))
				base = SOFTCAPS.fluidComputed('number_C1', base, player.number);
			return { value: base, softcaps: softcaps };
		},
		addpower() {
			let base = feature.ADDITION.gain();
			let softcaps = 0,
				scList = ['addpower^1', 'addpower^2', 'addpower^3'];
			for (let i = 0; i < scList.length; i++) {
				if (SOFTCAPS.reach(scList[i], player.addpower)) {
					softcaps++;
					base = SOFTCAPS.fluidComputed(scList[i], base, player.addpower);
				}
			}
			let passive = new Decimal(0);
			if (player.upgrades[38]) passive = passive.add(0.01);
			if (player.upgrades['441q']) passive = passive.add(1);
			return { value: base, passive: passive, softcaps: softcaps };
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
