import Decimal from 'break_eternity.js';
import { player } from '../save';
import { Hydra } from '../hydra/hydra';
import { Currencies, getCurrency } from '../currencies';
import { getTotalTheories } from './total-theories';
import { NON_RECURSIVE } from '.';

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
			player.hydra.dilute.solution = player.hydra.dilute.solution + 20;
		},
	}),
	new Study({
		id: '12',
		description: '基数之前全局速度x2',
		cost: new Decimal(1),
	}),
	new Study({
		id: '21',
		description: '九头蛇溶液的常数硬上限改为软上限',
		cost: new Decimal(3),
		canBuy() {
			return (
				player.nonrecu.studies_bought.includes(0) ||
				player.nonrecu.studies_bought.includes(1)
			);
		},
	}),
	new Study({
		id: '22',
		description: '基于九头蛇溶液大幅延迟九头蛇能量双重软上限',
		cost: new Decimal(3),
		canBuy() {
			return (
				player.nonrecu.studies_bought.includes(0) ||
				player.nonrecu.studies_bought.includes(1)
			);
		},
	}),
	new Study({
		id: '31',
		description: '九头蛇能量×100000再^1.05',
		cost: new Decimal(3),
		canBuy() {
			return (
				player.nonrecu.studies_bought.includes(2) ||
				player.nonrecu.studies_bought.includes(3)
			);
		},
	}),
] as const;
export function canBuyStudies(id: number) {
	const study = studies[id] as Study | undefined;
	if (!study) return false;
	if (player.nonrecu.studies_bought.includes(id)) return false;
	if (!getCurrency(Currencies.NRT).gte(study.cost)) return false;
	if (!study.canBuy()) return false;
	return true;
}
export function buyStudies(id: number) {
	const study = studies[id] as Study | undefined;
	if (!study) return;
	if (!canBuyStudies(id)) return;
	player.nonrecu.spentTheories = player.nonrecu.spentTheories.add(study.cost);
	player.nonrecu.studies_bought.push(id);
	study.onBought();
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
export function canBuyTheories(id: 0 | 1 | 2) {
	switch (id) {
		case 0:
			return player.hydra.power.gte(theoriesCost(0));
		case 1:
			return getCurrency(Currencies.SOLUTION).gte(theoriesCost(1));
		case 2:
			return player.nonrecu.power.gte(theoriesCost(2));
	}
}
export function addTheories(id: 0 | 1 | 2) {
	switch (id) {
		case 0:
			if (canBuyTheories(0)) {
				player.hydra.power = player.hydra.power.sub(theoriesCost(0));
				player.nonrecu.theories[0] = player.nonrecu.theories[0].add(1);
			}
			break;
		case 1:
			if (canBuyTheories(1)) {
				player.hydra.dilute.solutionCost =
					player.hydra.dilute.solutionCost +
					theoriesCost(1).clampMax(Number.MAX_VALUE).toNumber();
				player.nonrecu.theories[1] = player.nonrecu.theories[1].add(1);
			}
			break;
		case 2:
			if (canBuyTheories(2)) {
				player.nonrecu.power = player.nonrecu.power.sub(theoriesCost(2));
				player.nonrecu.theories[2] = player.nonrecu.theories[2].add(1);
			}
			break;
		default:
			let a: never = id;
	}
}

export function resetTheories() {
	player.nonrecu.studies_bought = [];
	player.nonrecu.spentTheories = new Decimal(0);
	NON_RECURSIVE.reset(true);
}
