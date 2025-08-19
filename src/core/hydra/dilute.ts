import Decimal from 'break_eternity.js';
import { player } from '../save';
import { Hydra } from './hydra';
import type { IntClosedRange } from 'type-fest';
import { diff } from '../game-loop';
import ModalService from '@/utils/Modal';

export type backupHydraType = {
	upgrades: (`${IntClosedRange<61, 69>}R` | keyof typeof Hydra.upgrades)[];
	buyables: Partial<Record<'61R' | '62R' | '611' | '612' | '613' | '614', Decimal>>;
	prestiges: Decimal[];
	totalPower: Decimal;
};

export function diluteAmount(id: IntClosedRange<0, 8>): number | boolean {
	if (!player.hydra.dilute.inDilute) return id < 6 ? 0 : false;
	if (player.hydra.dilute.solvent[8]) {
		return id < 6 ? 10 : true;
	}
	return player.hydra.dilute.solvent[id];
}

interface IDilute {
	diluteAmount(id: IntClosedRange<0, 5>): number;
	diluteAmount(id: IntClosedRange<6, 8>): boolean;
	diluteAmountOutside(id: IntClosedRange<0, 5>): number;
	diluteAmountOutside(id: IntClosedRange<6, 8>): boolean;
}

export const Dilute = {
	enterDilute() {
		if (player.hydra.dilute.solvent.map((x) => Number(x)).reduce((x, y) => x + y) < 1) {
			ModalService.show({
				title: '无法开启稀释',
				content: '先选择任意一个溶剂再开开启稀释！',
			});
			return;
		}
		let zero = new Decimal(0),
			one = new Decimal(1);
		player.hydra.backupHydra = this.backupHydra();
		for (const id2 of (
			[
				['61R', '62R', '63R', '64R', '65R', '66R', '67R', '68R'],
				Object.keys(Hydra.upgrades),
			] as const
		).flat()) {
			if (id2 !== '61') player.upgrades[id2 as keyof typeof player.upgrades] = false;
		}
		for (const id2 of Object.keys(Hydra.buyables)) {
			const id = id2 as keyof typeof Hydra.buyables;
			player.buyables[id] = zero;
		}
		for (const id2 of ['61R', '62R']) {
			const id = id2 as keyof typeof Hydra.buyables;
			player.buyables[id] = zero;
		}
		player.hydra.prestige = [zero, zero, zero, zero];
		player.hydra.power = zero;
		player.hydra.totalPower = zero;
		player.hydra.deduceOrdinal = [zero, zero, zero, zero];
		player.hydra.totalDeduceOrdinal = [zero, zero, zero, zero];
		player.hydra.deduceProgress = [zero, zero, zero, zero];
		player.hydra.powerMult = [one, one, one, one];
		player.hydra.dilute.spentTime = 0;
		player.hydra.dilute.prionsTime = 0;
		player.numbertheory.GM.x = zero;
		player.hydra.dilute.inDilute = true;
	},
	exitDilute() {
		if (player.hydra.backupHydra) this.restoreHydra(player.hydra.backupHydra);
		else {
			console.warn('Cannot found restore datas');
		}
		if (this.solutionGain() > player.hydra.dilute.solution) {
			this.solutionCalc();
		}
		player.hydra.dilute.spentTime = 0;
		player.hydra.dilute.prionsTime = 0;
		player.hydra.dilute.inDilute = false;
	},
	solutionCalc() {
		player.hydra.dilute.solution = Math.max(player.hydra.dilute.solution, this.solutionGain());
		player.hydra.dilute.lastSolvent = player.hydra.dilute.solvent;
		player.hydra.dilute.lastDeduce = player.hydra.deduceOrdinal[0];
	},
	backupHydra(): backupHydraType {
		let items: (`${IntClosedRange<61, 69>}R` | keyof typeof Hydra.upgrades)[] = [];
		for (const id2 of Object.keys(Hydra.upgrades)) {
			const id = id2 as keyof typeof Hydra.upgrades;
			if (player.upgrades[id]) {
				items.push(id);
			}
		}
		for (const id2 of ['61', '62', '63', '64', '65', '66', '67', '68', '69'] as const) {
			const id = (id2 + 'R') as `${IntClosedRange<61, 69>}R`;
			if (player.upgrades[id]) {
				items.push(id);
			}
		}
		let items2: Partial<Record<'61R' | '62R' | keyof typeof Hydra.buyables, Decimal>> = {};
		for (const id2 of Object.keys(Hydra.buyables)) {
			const id = id2 as keyof typeof Hydra.buyables;
			items2[id] = player.buyables[id];
		}
		for (const id2 of ['61R', '62R']) {
			const id = id2 as keyof typeof Hydra.buyables;
			items2[id] = player.buyables[id];
		}
		let prestiges = [
			player.hydra.prestige[0],
			player.hydra.prestige[1],
			player.hydra.prestige[2],
			player.hydra.prestige[3],
		];
		return {
			upgrades: items,
			buyables: items2,
			prestiges,
			totalPower: player.hydra.totalPower,
		};
	},
	restoreHydra(item: backupHydraType) {
		for (const id of item.upgrades) {
			player.upgrades[id] = true;
		}
		for (const id2 in item.buyables) {
			const id = id2 as keyof typeof item.buyables;
			player.buyables[id] = new Decimal(item.buyables[id]) ?? new Decimal(0);
		}
		player.hydra.prestige[0] = new Decimal(item.prestiges[0]);
		player.hydra.prestige[1] = new Decimal(item.prestiges[1]);
		player.hydra.prestige[2] = new Decimal(item.prestiges[2]);
		player.hydra.prestige[3] = new Decimal(item.prestiges[3]);
		player.hydra.totalPower = new Decimal(item.totalPower);
	},
	diluteButton() {
		if (player.hydra.dilute.inDilute) {
			this.exitDilute();
		} else {
			this.enterDilute();
		}
	},
	diluteLoop() {
		if (player.hydra.dilute.inDilute) {
			let s3Eff = 1000 / player.hydra.dilute.solvent[2] ** 2;
			player.hydra.dilute.spentTime = player.hydra.dilute.spentTime + diff / 1000;
			if (player.hydra.totalDeduceOrdinal[0].gte(1e4))
				player.hydra.dilute.prionsTime = player.hydra.dilute.prionsTime + diff / 1000;
			if (this.solutionGain() > player.hydra.dilute.solution) {
				this.solutionCalc();
			}
			if (player.hydra.dilute.spentTime > s3Eff) this.exitDilute();
			if (this.prions().gt(player.hydra.totalDeduceOrdinal[0])) this.exitDilute();
		}
	},
	/**
	 * 溶剂数量，在稀释未开启时会设置为falsy
	 * @returns
	 */
	diluteAmount(id) {
		return diluteAmount(id);
	},
	diluteAmountOutside(id) {
		if (player.hydra.dilute.solvent[8]) {
			return id < 6 ? 10 : true;
		}
		return player.hydra.dilute.solvent[id];
	},
	solutionGain() {
		let base: number = Array(6)
			.fill(null)
			.map((_, index) => this.diluteAmount(index as IntClosedRange<0, 5>))
			.reduce((tot, num) => tot + num * num);
		if (this.diluteAmount(6)) base *= 2;
		if (this.diluteAmount(7)) base *= 3;
		if (this.diluteAmount(8)) base *= 10;
		let deduceMult = player.hydra.deduceOrdinal[0].add(1).ln().min(4.99359204e304).toNumber();
		return deduceMult * base;
	},
	prions() {
		return Decimal.pow(1 + this.diluteAmount(4) / 100, player.hydra.dilute.prionsTime).sub(1);
	},
} as IDilute & Record<string, any>;
