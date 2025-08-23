import Decimal from 'break_eternity.js';
import { player } from '../save';
import { Hydra } from '../hydra/hydra';
import { Currencies, getCurrency } from '../currencies';

interface StudyConfig {
	id: string;
	description: string;
	cost: Decimal;
	canBuy?(): boolean;
	effect?(): Decimal;
	effectDesc?(): string;
	onBought?(): any;
}
export class Study {
	config: StudyConfig;
	constructor(config: StudyConfig) {
		this.config = config;
	}
	get id() {
		return this.config.id;
	}
	get description() {
		return this.config.description;
	}
	get cost() {
		return this.config.cost;
	}
	canBuy() {
		return this.config.canBuy?.() ?? true;
	}
	get effect() {
		return this.config.effect?.();
	}
	get effectDesc() {
		return this.config.effectDesc?.();
	}
	onBought() {
		return this.config.onBought?.();
	}
}

export const studies = [
	new Study({
		id: '11',
		description: '购买该升级或非递归重置时自动获取20九头蛇溶液',
		cost: new Decimal(1),
		onBought() {
			player.hydra.power = player.hydra.power.add(20);
			player.hydra.totalPower = player.hydra.totalPower.add(20);
			player.hydra.trueTotalPower = player.hydra.trueTotalPower.add(20);
		},
	}),
	new Study({
		id: '12',
		description: '基数之前全局速度x2',
		cost: new Decimal(1),
	}),
] as const;

export function buyStudies(id: number) {
	// const study = studies[id] as Study | undefined;
	// if (!study) return;
	// if (player.nonrecu.studies_bought.includes(id)) return;
	// if (!player.nonrecu.power.gte(study.cost)) return;
	// player.nonrecu.power = player.nonrecu.power.sub(study.cost);
	// player.nonrecu.studies_bought.push(id);
	// study.onBought();
}

export function getTotalTheories() {
	return player.nonrecu.theories.reduce((a, b) => a.add(b));
}
export function theoriesCost(id: 0 | 1 | 2) {
	switch (id) {
		case 0:
			if (player.nonrecu.theories[0].lte(10)) {
				return player.nonrecu.theories[0].pow10().pow10();
			} else if (player.nonrecu.theories[0].lte(70)) {
				return Decimal.tetrate(
					10,
					player.nonrecu.theories[0].mul(0.05).add(2.5).toNumber(),
				);
			} else {
				return Decimal.tetrate(
					10,
					5,
					player.nonrecu.theories[0].pow(2).mul(100).sub(489990),
				);
			}
		case 1:
			return player.nonrecu.theories[1].pow10().mul(1e4);
		case 2:
			return player.nonrecu.theories[2].pow_base(5);
		default:
			let a: never = id;
	}
	return new Decimal(1 / 0);
}
export function addTheories(id: 0 | 1 | 2) {
	switch (id) {
		case 0:
			if (player.hydra.power.gte(theoriesCost(0))) {
				player.hydra.power = player.hydra.power.sub(theoriesCost(0));
				player.nonrecu.theories[0] = player.nonrecu.theories[0].add(1);
			}
			break;
		case 1:
			if (getCurrency(Currencies.SOLUTION).gte(theoriesCost(1))) {
				player.hydra.dilute.solutionCost =
					player.hydra.dilute.solutionCost +
					theoriesCost(1).clampMax(Number.MAX_VALUE).toNumber();
				player.nonrecu.theories[1] = player.nonrecu.theories[1].add(1);
			}
			break;
		case 2:
			if (player.nonrecu.power.gte(theoriesCost(2))) {
				player.nonrecu.power = player.nonrecu.power.sub(theoriesCost(2));
				player.nonrecu.theories[2] = player.nonrecu.theories[2].add(1);
			}
			break;
		default:
			let a: never = id;
	}
}
