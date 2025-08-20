import Decimal from 'break_eternity.js';
import { player } from '../save';
import { Hydra } from './hydra';
import type { IntClosedRange } from 'type-fest';
import { diff } from '../game-loop';
import ModalService from '@/utils/Modal';
import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { getCurrency, Currencies } from '../currencies';
import { format, formatWhole } from '@/utils/format';
import { MILESTONES } from '../mechanic';

export type backupHydraType = {
	upgrades: (`${IntClosedRange<61, 69>}R` | keyof typeof Hydra.upgrades)[];
	buyables: Partial<Record<'61R' | '62R' | '611' | '612' | '613' | '614', Decimal>>;
	prestiges: Decimal[];
	totalPower: Decimal;
};

function minS1Level() {
  if (player.hydra.dilute.solvent[6] || player.hydra.dilute.solvent[7]) return 10
  return Math.max(
    Math.floor(player.hydra.dilute.solvent[1] / 2),
    Math.floor(player.hydra.dilute.solvent[2] / 2),
    player.hydra.dilute.solvent[3],
    player.hydra.dilute.solvent[4],
    player.hydra.dilute.solvent[5],
  )
}

export function diluteAmount(id: IntClosedRange<0, 8>): number | boolean {
	if (!player.hydra.dilute.inDilute) return id < 6 ? 0 : false;
	if (player.hydra.dilute.solvent[8]) {
		return id < 6 ? 10 : true;
	}
	if (id == 0) return Math.max(player.hydra.dilute.solvent[id], minS1Level())
	return player.hydra.dilute.solvent[id];
}

interface IDilute {
	diluteAmount(id: IntClosedRange<0, 5>): number;
	diluteAmount(id: IntClosedRange<6, 8>): boolean;
	diluteAmountOutside(id: IntClosedRange<0, 5>): number;
	diluteAmountOutside(id: IntClosedRange<6, 8>): boolean;
}
export const DiluteUpgrades = {
	"61S": new (class U61S extends UpgradeWithEffect<Decimal> {
		currency: Currencies = Currencies.SOLUTION;
		name: string = "U5-S-1";
		description: string = "溶液大幅加强U5-1-1的效果";
		cost: Decimal = new Decimal(10);
		effect(): Decimal {
			return new Decimal(player.hydra.dilute.solution ** 0.2);
		}
		effectDescription(): string {
			return '^' + format(this.effect());
		}
	})(),
	"62S": new (class U62S extends UpgradeWithEffect<Decimal> {
		currency: Currencies = Currencies.SOLUTION;
		name: string = "U5-S-2";
		description: string = "溶液中幅加快推演速度";
		cost: Decimal = new Decimal(10);
		effect(): Decimal {
			return new Decimal((player.hydra.dilute.solution * Math.max(player.hydra.dilute.solution / 2, 10)) ** 0.5);
		}
		effectDescription(): string {
			return 'x' + format(this.effect());
		}
	})(),
}
export const Dilute = {
	respec(){
		player.upgrades['61S'] = false;
		player.upgrades['62S'] = false;
		player.hydra.dilute.solutionCost = 0;
	},
	initMechanics(){
		MILESTONES.create('dut1', {
			displayName: 'M-Dilute-1',
			description: '保持U5-1-1，并且提升其公式',
			req: true,
			reqDescription: '在稀释中达到ψ(Ω<sub>2</sub>Ω)',
			requirement: new Decimal(4 ** 5),
			get canDone() {
				return player.hydra.dilute.inDilute && player.hydra.deduceOrdinal[0].gte(this.requirement);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut2', {
			displayName: 'M-Dilute-2',
			description: '解锁B5系列购买项的最大化',
			req: true,
			reqDescription: '在稀释中达到ψ(Ω<sub>2</sub><sup>ψ<sub>1</sub>(Ω<sub>2</sub><sup>2</sup>)</sup>)',
			requirement: new Decimal(4 ** 32),
			get canDone() {
				return player.hydra.dilute.inDilute && player.hydra.deduceOrdinal[0].gte(this.requirement);
			},
			show: true,
			currency: '',
		});
	},
	enterDilute() {
		if (player.hydra.dilute.solvent.map((x) => Number(x)).reduce((x, y) => x + y) < 1) {
			ModalService.show({
				title: '无法开启稀释',
				content: '先选择任意一个溶剂再开开启稀释！',
			});
			return;
		}
		const zero = new Decimal(0),
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
	exitDilute(manmade = true) {
		if (player.hydra.backupHydra) this.restoreHydra(player.hydra.backupHydra);
		else {
			console.warn('Cannot found restore datas');
		}
		if (this.solutionGain() > player.hydra.dilute.solution && manmade) {
			this.solutionCalc();
		}
		player.hydra.dilute.spentTime = 0;
		player.hydra.dilute.prionsTime = 0;
		player.numbertheory.GM.x = new Decimal(0);
		player.hydra.dilute.inDilute = false;
	},
	solutionCalc() {
		player.hydra.dilute.solution = Math.max(player.hydra.dilute.solution, this.solutionGain());
		player.hydra.dilute.lastSolvent = Array.from(player.hydra.dilute.solvent) as typeof player.hydra.dilute.solvent;
		player.hydra.dilute.lastDeduce = player.hydra.deduceOrdinal[0];
	},
	backupHydra(): backupHydraType {
		const items: (`${IntClosedRange<61, 69>}R` | keyof typeof Hydra.upgrades)[] = [];
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
		const items2: Partial<Record<'61R' | '62R' | keyof typeof Hydra.buyables, Decimal>> = {};
		for (const id2 of Object.keys(Hydra.buyables)) {
			const id = id2 as keyof typeof Hydra.buyables;
			items2[id] = player.buyables[id];
		}
		for (const id2 of ['61R', '62R']) {
			const id = id2 as keyof typeof Hydra.buyables;
			items2[id] = player.buyables[id];
		}
		const prestiges = [
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
			const s3Eff = 1000 / player.hydra.dilute.solvent[2] ** 2;
			player.hydra.dilute.spentTime = player.hydra.dilute.spentTime + diff / 1000;
			if (player.hydra.totalDeduceOrdinal[0].gte(1))
				player.hydra.dilute.prionsTime = player.hydra.dilute.prionsTime + diff / 1000;
			if (player.hydra.dilute.spentTime > s3Eff) this.exitDilute(false);
			if (this.prions().gt(player.hydra.totalDeduceOrdinal[0])) this.exitDilute(false);
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
		const deduceMult = player.hydra.deduceOrdinal[0].add(1).ln().min(base).min(100).toNumber();
		return deduceMult * base;
	},
	solutionEff() {
		let eff1 = new Decimal(getCurrency(Currencies.SOLUTION).pow(0.5)).max(1); //推演速度
		return {eff1: eff1};
	},
	prions() {
		return Decimal.pow(1 + this.diluteAmount(4) / 100, player.hydra.dilute.prionsTime).sub(1);
	},
} as IDilute & Record<string,any>;
