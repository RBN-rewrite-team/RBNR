import Decimal from 'break_eternity.js';
import { player } from '../save';
import { Hydra } from '../hydra/hydra';
import { Currencies, getCurrency } from '../currencies';
import { getTotalTheories } from './total-theories';
import { NON_RECURSIVE } from '.';
import { NONREC_CHALS } from './non-recursion-challenges';
import { CHALLENGE } from '../challenge';

type StudyConfig = {
	id: string;
	description: string;
	cost: Decimal;
	canBuy?(): boolean;
	effect?(): Decimal;
	effectDesc?(): string;
	onBought?(): any;
} & (
	| {
			isChallenge: boolean;
			chal_id: number;
	  }
	| {
			isChallenge?: never;
			chal_id?: never;
	  }
);
export class Study {
	config: StudyConfig;
	constructor(config: StudyConfig) {
		this.config = config;
	}
	get id() {
		return this.config.id;
	}
	get description() {
		if (this.isChallenge) {
			return `非递归挑战${this.chalID + 1}${CHALLENGE.inChallenge(1, this.chalID) ? '(挑战中)' : ''}<br>目标:${this.config.description.split('\t')[1] ?? ''}`;
		}
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
	get isChallenge() {
		return this.config.isChallenge ?? false;
	}
	get chalID() {
		return this.config.chal_id ?? -1;
	}
}

export const studies = [
	new Study({
		id: '11', //0
		description: '购买该升级或非递归重置时自动获取20九头蛇能量、溶液',
		cost: new Decimal(1),
		onBought() {
			player.hydra.power = player.hydra.power.add(20);
			player.hydra.totalPower = player.hydra.totalPower.add(20);
			player.hydra.trueTotalPower = player.hydra.trueTotalPower.add(20);
			player.hydra.dilute.solution = player.hydra.dilute.solution + 20;
		},
	}),
	new Study({
		id: '12', //1
		description: '基数之前全局速度x2',
		cost: new Decimal(1),
	}),
	new Study({
		id: '21', //2
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
		id: '22', //3
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
		id: '31', //4
		description: '九头蛇能量×100000再^1.05',
		cost: new Decimal(3),
		canBuy() {
			return (
				player.nonrecu.studies_bought.includes(2) ||
				player.nonrecu.studies_bought.includes(3)
			);
		},
	}),
	new Study({
		id: 'NRC1', //5
		description: '非递归挑战1\t1.00e326649 九头蛇能量 ',
		cost: new Decimal(10),
		canBuy() {
			return player.nonrecu.studies_bought.includes(3);
		},
		isChallenge: true,
		chal_id: 0,
	}),
	new Study({
		id: '41', //6
		description: '非递归能量获取×10',
		cost: new Decimal(4),
		canBuy() {
			return player.nonrecu.studies_bought.includes(4);
		},
	}),
	new Study({
		id: '42', //7
		description: '朊病毒增速×10',
		cost: new Decimal(5),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: '51', // 8
		description: '九头蛇能量获取×35, 九头蛇能量获取指数^1.25',
		cost: new Decimal(3),
		canBuy() {
			return (
				!(
					player.nonrecu.studies_bought.includes(9) ||
					player.nonrecu.studies_bought.includes(10)
				) && player.nonrecu.studies_bought.includes(6)
			);
		},
	}),
	new Study({
		id: '52', //9
		description: '基于本次非递归重置内将获得的非递归能量获得额外的非递归理论(没做)',
		cost: new Decimal(5),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: '53', //10
		description: '稀释I的底数从5降低到3',
		cost: new Decimal(2),
		canBuy() {
			return (
				!(
					player.nonrecu.studies_bought.includes(8) ||
					player.nonrecu.studies_bought.includes(9)
				) && player.nonrecu.studies_bought.includes(6)
			);
		},
	}),
	new Study({
		id: 'NRC2', //11
		description: '解锁非递归挑战2(没做)',
		cost: new Decimal(15),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: 'NRC3', //12
		description: '解锁非递归挑战3(没做)',
		cost: new Decimal(20),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: '61', //13
		description: '移除九头蛇能量和BMS推演的硬上限',
		cost: new Decimal(4),
		canBuy() {
			return player.nonrecu.studies_bought.includes(8);
		},
	}),
	new Study({
		id: '62', //14
		description: '每个剩余的非递归理论令推演速度膨胀+0.01(没做)',
		cost: new Decimal(4),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: '63', //15
		description: '九头蛇溶液获取x1.2, ^1.01',
		cost: new Decimal(6),
		canBuy() {
			return player.nonrecu.studies_bought.includes(10);
		},
	}),
	new Study({
		id: '71', //16
		description: '基于本次非递归重置时间提升非递归能量获取',
		cost: new Decimal(5),
		canBuy() {
			return player.nonrecu.studies_bought.includes(13);
		},
	}),
	new Study({
		id: '72', //17
		description: '基于本次非递归重置时间提升非递归研究52的效果(没做)',
		cost: new Decimal(3),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: '73', //18
		description: '基于本次非递归重置时间提升非九头蛇溶液获取(没做)',
		cost: new Decimal(5),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: '81', //19
		description: '可以同时购买第5行三岔路的两个分支 (没做)',
		cost: new Decimal(15),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: '91', //20
		description: '九头蛇溶液获取^1.025(没做)',
		cost: new Decimal(7),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: '92', //21
		description: '九头蛇能量获取膨胀1.1(没做)',
		cost: new Decimal(7),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: '101',
		description: '每秒获取1%重置时获取的非递归能量(没做)',
		cost: new Decimal(30),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: 'NRC4',
		description: '解锁非递归挑战4(没做)',
		cost: new Decimal(20),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: 'NRC5',
		description: '解锁非递归挑战5(没做)',
		cost: new Decimal(25),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: 'NRC6',
		description: '解锁非递归挑战6(没做)',
		cost: new Decimal(30),
		canBuy() {
			return false;
		},
	}),
	new Study({
		id: '111',
		description: '基于非递归定理增加九头蛇溶液效果指数(没做)',
		cost: new Decimal(30),
		canBuy() {
			return false;
		},
	}),
] as const;
export function canBuyStudies(id: number) {
	if (player.nonrecu.studies_bought.includes(5)) return false;
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
	NON_RECURSIVE.reset();
	player.challengein = [-1, -1];
}
