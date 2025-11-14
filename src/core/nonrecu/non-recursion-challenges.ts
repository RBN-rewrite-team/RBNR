import Decimal from 'break_eternity.js';
import type { SingleChallenge } from '../challenge';
import { Dilute } from '../hydra/dilute';
import { player } from '../save';
import { format } from '@/utils/format';
import { getNRC4Kept } from './studies';
import { Hydra } from '../hydra/hydra';

export const NONREC_CHALS: SingleChallenge[] = [
	{
		loop() {
			let e = 0.4667 + Number(player.challenges[1][0]);
			if (player.upgrades['71']) e = 0.4667 + Number(player.challenges[1][0]) * 0.3;
			player.hydra.dilute.inDilute = true;
			player.hydra.dilute.solvent = [10, e, 10, 10, 10, 9, !0, !1, !1];
			if (Dilute.prions().sub(1).gte(player.hydra.deduceOrdinal[0])) {
				Dilute.diluteReset();
				player.hydra.dilute.prions = new Decimal(1);
			}
			if (
				player.hydra.power.gte(
					new Decimal(326649 ** player.challenges[1][0].add(1).toNumber())
						.pow10()
						.mul(0.99),
				)
			) {
				player.challengein = [-1, -1];
				player.challenges[1][0] = player.challenges[1][0].add(1).min(5);
			}
		},
		canEnter() {
			return player.nonrecu.studies_bought.includes(5);
		},
	},
	{
		loop() {
			if (player.hydra.dilute.solution.gte(player.challenges[1][1].pow_base(10).mul(4e6))) {
				player.challengein = [-1, -1];
				player.challenges[1][1] = player.challenges[1][1].add(1).min(5);
			}
		},
		canEnter() {
			return player.nonrecu.studies_bought.includes(11);
		},
	},
	{
		canEnter() {
			return player.nonrecu.studies_bought.includes(12);
		},
		loop() {
			if (
				player.hydra.dilute.solution.gte(
					255000000 * 5 ** player.challenges[1][2].toNumber(),
				)
			) {
				player.challengein = [-1, -1];
				player.challenges[1][2] = player.challenges[1][2].add(1).min(5);
			}
		},
		effect(x): Decimal {
			return x.gt(0) ? x.mul(0.1).add(0.1) : new Decimal(0);
		},
		effD(x): string {
			return (
				'非递归能量以(1+ln(ln(x^10+1)^' +
				format(x) +
				'+1)/5)幂增推演速度指数，当前：^' +
				format(player.nonrecu.power.pow(10).add(1).ln().pow(x).add(1).ln().div(5).add(1))
			);
		},
	},
	{
		canEnter() {
			return player.nonrecu.studies_bought.includes(23) && player.challenges[1][3].lt(2);
		},
		loop() {
			player.nonrecu.studies_bought = [
				...new Set(
					player.nonrecu.studies_bought.concat(
						getNRC4Kept(player.challenges[1][3].toNumber()),
					),
				),
			];
			if (
				player.hydra.power.gte(
					new Decimal(6 ** player.challenges[1][3].toNumber())
						.pow_base(2)
						.pow_base(2)
						.pow10(),
				)
			) {
				player.challengein = [-1, -1];
				player.challenges[1][3] = player.challenges[1][3].add(1).min(5);
			}
		},
		effect(x): Decimal {
			return x.gt(0) ? x.mul(0.1).add(1) : new Decimal(1);
		},
		effD(x): string {
			return '×' + x;
		},
		onExit() {
			player.nonrecu.studies_bought = [];
			player.nonrecu.spentTheories = new Decimal(0);
		},
	},
	{
		canEnter() {
			return player.nonrecu.studies_bought.includes(24);
		},
		loop() {
			const highest = Hydra.deduceSpeedBMS();
			if (player.challenges[1][4].lt(highest)) {
				player.challenges[1][4] = highest;
			}
		},
	},
	{
		canEnter() {
			return player.nonrecu.studies_bought.includes(25);
		},
		loop() {
			const highest = Dilute.prions().add(1).clampMin(10).log10().log10();
			if (player.challenges[1][5].lt(highest)) {
				player.challenges[1][5] = highest;
			}
		},
	},
	{
		canEnter() {
			return player.nonrecu.studies_bought.includes(28);
		},
		loop() {
			if (player.hydra.deduceOrdinal[0].gte('e1e4500000')) {
				player.challenges[1][6] = new Decimal(1);
			}
			// const highest = Dilute.prions().add(1).clampMin(10).log10().log10();
			// if (player.challenges[1][5].lt(highest)) {
			// 	player.challenges[1][5] = highest;
			// }
		},
	},
] as const;
