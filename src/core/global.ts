import { player } from './save';
import Decimal from 'break_eternity.js';
import { Successor } from './successor/successor.ts';
import { upgrades, buyables, UPGRADES, BUYABLES } from './mechanic.ts';
import { Addition } from './addition/addition.ts';
import { Multiplication } from './multiplication/multiplication.ts';
import { PrimeFactor } from './multiplication/pf.ts';

const feature = {
	mechanic: { UPGRADES: UPGRADES, BUYABLES: BUYABLES },
	upgrades: upgrades,
	buyables: buyables,
	SUCCESSOR: Successor,
	ADDITION: Addition,
	MULTIPLICATION: Multiplication,
	PrimeFactor: PrimeFactor,

	resourceGain: {
		number() {
			let base = feature.SUCCESSOR.successorBulk();
			base = base.mul(feature.SUCCESSOR.autoSuccessPerSecond());
			let softcap = 0;
			let sc1 = new Decimal(2).pow(256),
				sc2 = new Decimal(2).pow(1024);
			if (player.number.gte(sc1)) {
				let exp = new Decimal(1).div(0.75).sub(1);
				base = base.div(player.number.div(sc1).pow(exp));
				softcap = 1;
			}
			if (player.number.gte(sc2)) {
				let exp = new Decimal(1).div(0.75).sub(1);
				base = base.div(player.number.div(sc2).pow(exp));
				softcap = 2;
			}
			return { value: base, softcap: softcap };
		},
		addpower() {
			let base = feature.ADDITION.gain();
			let softcap = 0;
			let sc1 = new Decimal(2).pow(384);
			if (player.addpower.gte(sc1)) {
				let exp = new Decimal(1).div(0.75).sub(1);
				base = base.div(player.addpower.div(sc1).pow(exp));
				softcap = 1;
			}
			let passive = new Decimal(0.01);
			return { value: base, passive: passive, softcap: softcap };
		},
		mulpower() {
			let base = feature.MULTIPLICATION.gain();
			return { value: base };
		},
	},
};

export { player, feature };
