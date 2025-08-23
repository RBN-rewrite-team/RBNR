import Decimal from 'break_eternity.js';
import { player } from '../save';
import { Hydra } from '../hydra/hydra';

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
	const study = studies[id] as Study | undefined;
	if (!study) return;
	if (player.nonrecu.studies_bought.includes(id)) return;
	if (!player.nonrecu.power.gte(study.cost)) return;

	player.nonrecu.power = player.nonrecu.power.sub(study.cost);
	player.nonrecu.studies_bought.push(id);
	study.onBought();
}
