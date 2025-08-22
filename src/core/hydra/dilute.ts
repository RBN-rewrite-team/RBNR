import Decimal from 'break_eternity.js';
import { player } from '../save';
import { Hydra } from './hydra';
import type { IntClosedRange } from 'type-fest';
import ModalService from '@/utils/Modal';
import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { getCurrency, Currencies } from '../currencies';
import { format, formatWhole } from '@/utils/format';
import { MILESTONES } from '../mechanic';
import { upgrades, buyables } from '../mechanic';

export type backupHydraType = {
	upgrades: (`${IntClosedRange<61, 69>}R` | keyof typeof Hydra.upgrades)[];
	buyables: Partial<Record<'61R' | '62R' | '611' | '612' | '613' | '614', Decimal>>;
	prestiges: Decimal[];
	totalPower: Decimal;
};

function minS1Level() {
	if (player.hydra.dilute.solvent[6] || player.hydra.dilute.solvent[7]) return 10;
	return Math.max(
		Math.floor(player.hydra.dilute.solvent[1] / 2),
		Math.floor(player.hydra.dilute.solvent[2] / 2),
		player.hydra.dilute.solvent[3],
		player.hydra.dilute.solvent[4],
		player.hydra.dilute.solvent[5],
	);
}

function diluteAmount(id: IntClosedRange<0, 8>): number | boolean {
	if (!player.hydra.dilute.inDilute) return id < 6 ? 0 : false;
	if (player.hydra.dilute.solvent[8]) {
		return id < 6 ? 10 : true;
	}
	if (id == 0) return Math.max(player.hydra.dilute.solvent[id], minS1Level());
	return player.hydra.dilute.solvent[id];
}
export { diluteAmount };

export function milestoneDut5Eff(): Decimal {
	if (!Dilute.diluteAmount(6)) return new Decimal(0);
	return player.hydra.power
		.div(1e55)
		.max(1)
		.log10()
		.add(1)
		.log10()
		.add(1)
		.log10()
		.add(1)
		.pow(player.milestones.dut15 ? 1.5 : (Dilute.diluteAmount(5) * 0.1 + 0.5))
		.pow((player.milestones.dut13 || (Dilute.diluteAmount(2) >= 10 && player.upgrades["67S"])) ? 1.35 : 1);
}

export function milestoneDut6Eff(): Decimal {
	if (player.hydra.dilute.solution < 2050000) return new Decimal(1);
	return Decimal.log10(player.hydra.dilute.solution - 2050000 + 1)
		.add(1)
		.log10()
		.add(1)
		.pow(0.3);
}

export function milestoneDut7Eff(): Decimal {
	return player.hydra.trueTotalPower
		.max('e3500')
		.log10()
		.sub(3500 - 1)
		.log10()
		.add(1)
		.pow(player.upgrades["612S"] ? 1 : 0.1);
}

export function milestoneDut16Eff(): Decimal {
	return player.hydra.dilute.prions.log10().add(1)
}

interface IDilute {
	diluteAmount(id: IntClosedRange<0, 5>): number;
	diluteAmount(id: IntClosedRange<6, 8>): boolean;
	diluteAmountOutside(id: IntClosedRange<0, 5>): number;
	diluteAmountOutside(id: IntClosedRange<6, 8>): boolean;
}

export const DiluteUpgrades = {
	'61S': new (class U61S extends UpgradeWithEffect<Decimal> {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-1';
		description: string = '溶液大幅加强U5-1-1的效果';
		cost: Decimal = new Decimal(10);
		effect(): Decimal {
			return new Decimal(player.hydra.dilute.solution ** 0.2);
		}
		effectDescription(): string {
			return '^' + format(this.effect());
		}
	})(),
	'62S': new (class U62S extends UpgradeWithEffect<Decimal> {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-2';
		description: string = '溶液中幅加快推演速度';
		cost: Decimal = new Decimal(10);
		effect(): Decimal {
			return new Decimal(
				(player.hydra.dilute.solution * Math.max(player.hydra.dilute.solution / 2, 10)) **
					0.5,
			);
		}
		effectDescription(): string {
			return 'x' + format(this.effect());
		}
	})(),
	'63S': new (class U63S extends UpgradeWithEffect<Decimal> {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-3';
		description: string = '基于总九头蛇能量增益推演速度(稀释不重置该效果，但在稀释中变得更弱)';
		cost: Decimal = new Decimal(1e4);
		effect(): Decimal {
			let base = player.hydra.trueTotalPower.max(1).log10().sub(2466.037724479333951).max(0);
			if (!player.hydra.dilute.inDilute) base = base.pow10();
			else {
				base = base.add(1);
				if (base.gte(250)) base = base.div(250).pow(0.25).mul(250);
			}
			return base.max(1);
		}
		effectDescription(): string {
			return 'x' + format(this.effect());
		}
	})(),
	'64S': new (class U64S extends UpgradeWithEffect<Decimal> {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-4';
		description: string = '基于可用溶液增益推演速度';
		cost: Decimal = new Decimal(1e4);
		effect(): Decimal {
			let base = getCurrency(Currencies.SOLUTION)
				.pow(0.375)
				.mul(getCurrency(Currencies.SOLUTION).add(2).log(2));
			return base.max(1);
		}
		effectDescription(): string {
			return 'x' + format(this.effect());
		}
	})(),
	'65S': new (class U65S extends UpgradeWithEffect<Decimal> {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-5';
		description: string = '基于总溶液增益乘数获取量';
		cost: Decimal = new Decimal(1.5e4);
		effect(): Decimal {
			let base = new Decimal(player.hydra.dilute.solution).pow(0.25);
			return base.max(1);
		}
		effectDescription(): string {
			return 'x' + format(this.effect());
		}
	})(),
	'66S': new (class U66S extends Upgrade {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-6';
		description: string = '解锁4个九头蛇引擎升级';
		cost: Decimal = new Decimal(2e6);
	})(),
	'67S': new (class extends Upgrade {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-7';
		description: string = '若溶剂III的等级为10，在其中获得的M-Dilute-5效果^1.35';
		cost: Decimal = new Decimal(2175000);
		show(): boolean {
			return player.milestones.dut10;
		}
	})(),
	'68S': new (class extends Upgrade {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-8';
		description: string = '削弱九头蛇能量获取的二重软上限';
		cost: Decimal = new Decimal(2201250);
		show(): boolean {
			return player.milestones.dut10;
		}
	})(),
	'69S': new (class extends UpgradeWithEffect<Decimal> {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-9';
		description: string = '朊病毒加成推演速度且被免疫，你可以在任何时候获得朊病毒(×2/s)';
		cost: Decimal = new Decimal(2215312.5);
		show(): boolean {
			return player.milestones.dut10;
		}
		effect(): Decimal {
		  return Dilute.prions().add(1)
		}
		effectDescription() {
		  return "×" + format(this.effect())
		}
	})(),
	'610S': new (class extends UpgradeWithEffect<Decimal> {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-10';
		description: string = '基于总溶液增益朊病毒获取速度底数';
		cost: Decimal = new Decimal(2277812.5);
		show(): boolean {
			return player.milestones.dut10;
		}
		effect(): Decimal {
		  return new Decimal(player.hydra.dilute.solution / 2050000).max(1).pow(10)
		}
		effectDescription() {
		  return "×" + format(this.effect())
		}
	})(),
	'611S': new (class extends Upgrade {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-11';
		description: string = 'B5-1-2在稀释中也生效';
		cost: Decimal = new Decimal(2312812.5);
		show(): boolean {
			return player.milestones.dut10;
		}
	})(),
	'612S': new (class extends Upgrade {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-12';
		description: string = '大幅削弱九头蛇能量的二重软上限，M-Dilute-7的效果变得更好';
		cost: Decimal = new Decimal(2370000);
		show(): boolean {
			return player.milestones.dut10;
		}
	})(),
	'613S': new (class extends UpgradeWithEffect<Decimal> {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-13';
		description: string = '基于九头蛇能量削弱二重九头蛇能量软上限';
		cost: Decimal = new Decimal(2501250);
		show(): boolean {
			return player.milestones.dut10;
		}
		effect(): Decimal {
		  return Decimal.add(1,player.hydra.power.max("e17000").slog(10).sub(2.728280896245905).max(0)).recip().pow(4).max(0.9)
		}
		effectDescription(): string {
		  return format(this.effect().mul(100))+"%"
		}
	})(),
	'614S': new (class extends Upgrade {
		currency: Currencies = Currencies.SOLUTION;
		name: string = 'U5-S-14';
		description: string = '移除飞升、轮回效果的二重软上限，地球爆炸不再退出稀释';
		cost: Decimal = new Decimal(2501250);
		show(): boolean {
			return player.milestones.dut10;
		}
	})(),
};
export const Dilute = {
	respec() {
		player.upgrades['61S'] = false;
		player.upgrades['62S'] = false;
		player.upgrades['63S'] = false;
		player.upgrades['64S'] = false;
		player.upgrades['65S'] = false;
		player.upgrades['66S'] = false;
		player.hydra.dilute.solutionCost = 0;
	},
	initMechanics() {
		MILESTONES.create('dut1', {
			displayName: 'M-Dilute-1',
			description: '保持U5-1-1，并且提升其公式',
			req: true,
			reqDescription: '在稀释中达到ψ(Ω<sub>2</sub>Ω)',
			requirement: new Decimal(4 ** 5),
			get canDone() {
				return (
					player.hydra.dilute.inDilute &&
					player.hydra.deduceOrdinal[0].gte(this.requirement)
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut2', {
			displayName: 'M-Dilute-2',
			description: '解锁B5系列购买项的最大化',
			req: true,
			reqDescription:
				'在稀释中达到ψ(Ω<sub>2</sub><sup>ψ<sub>1</sub>(Ω<sub>2</sub><sup>2</sup>)</sup>)',
			requirement: new Decimal(4 ** 32),
			get canDone() {
				return (
					player.hydra.dilute.inDilute &&
					player.hydra.deduceOrdinal[0].gte(this.requirement)
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut3', {
			displayName: 'M-Dilute-3',
			description: '转生永久不重置任何东西，永久解锁自动转生，(仅在稀释VII)初始解锁所有升级',
			req: true,
			reqDescription: '在满级稀释2的稀释中达到0.135轮回效果且总计拥有过19000九头蛇溶液',
			requirement: new Decimal(0.135),
			get canDone() {
				return (
					player.hydra.dilute.inDilute &&
					(diluteAmount(1) as number) >= 10 &&
					Hydra.prestigeEff(3).gte(0.135) &&
					player.hydra.dilute.solution >= 19000
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut4', {
			displayName: 'M-Dilute-4',
			description: '飞升永久不重置任何东西，永久解锁自动飞升，保持U5-2',
			requirement: new Decimal(25000),
			get canDone() {
				return player.hydra.dilute.solution >= 25000;
			},
			show: true,
			currency: '九头蛇溶液',
		});
		MILESTONES.create('dut5', {
			displayName: 'M-Dilute-5',
			get description() {
				return (
					'在药剂7等级为1的稀释中最高九头蛇能量和药剂6等级加成推演速度<br>效果：^' +
					format(player.hydra.milestoneDut5Eff)
				);
			},
			req: true,
			reqDescription: '在药剂7等级为1的药剂中达到1e55九头蛇能量',
			requirement: new Decimal(1e55),
			get canDone() {
				return (
					player.hydra.dilute.inDilute &&
					(diluteAmount(6) as boolean) &&
					player.hydra.power.gte(1e55)
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut6', {
			displayName: 'M-Dilute-6',
			get description() {
				return (
					'在2,050,000以上的累计九头蛇溶液数量增益推演速度<br>效果：^' +
					format(milestoneDut6Eff())
				);
			},
			req: true,
			reqDescription: '2,070,000九头蛇溶液',
			requirement: new Decimal(2070000),
			get canDone() {
				return player.hydra.dilute.solution >= 2070000;
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut7', {
			displayName: 'M-Dilute-7',
			get description() {
				return (
					'(稀释不重置)累计九头蛇能量增益推演速度<br>效果：^' +
					format(milestoneDut7Eff())
				);
			},
			req: true,
			reqDescription: '2,095,000九头蛇溶液 & 1e3500九头蛇能量',
			requirement: new Decimal(2095000),
			get canDone() {
				return (
					player.hydra.dilute.solution >= 2095000 &&
					player.hydra.trueTotalPower.gte('e3500')
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut8', {
			displayName: 'M-Dilute-8',
			description: "削弱九头蛇能量获取的二重软上限",
			req: true,
			reqDescription: '^1.25 M-Dilute-5效果',
			requirement: new Decimal(1.25),
			get canDone() {
				return (
					player.hydra.milestoneDut5Eff.gte(1.25)
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut9', {
			displayName: 'M-Dilute-9',
			description: "自动购买B5-1系列购买项，你可以购买非整数次B5-1购买项",
			req: true,
			reqDescription: '2,151,250 九头蛇溶液',
			requirement: new Decimal(2151250),
			get canDone() {
				return (
					player.hydra.dilute.solution >= 2151250
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut10', {
			displayName: 'M-Dilute-10',
			description: "永久保留U5-1-2~4，购买稀释升级不再消耗九头蛇溶液",
			req: true,
			reqDescription: '2,175,000 九头蛇溶液',
			requirement: new Decimal(2175000),
			get canDone() {
				return (
					player.hydra.dilute.solution >= 2175000
				);
			},
			show: true,
			currency: '',
			onDone() {
			  player.hydra.dilute.solutionCost = 0;
			}
		});
		MILESTONES.create('dut11', {
			displayName: 'M-Dilute-11',
			description: "稀释VI的调整刻度细化至0.25",
			req: true,
			reqDescription: '2,201,250 九头蛇溶液',
			requirement: new Decimal(2201250),
			get canDone() {
				return (
					player.hydra.dilute.solution >= 2201250
				);
			},
			show: true,
			currency: '',
			onDone() {
			  player.hydra.dilute.solutionCost = 0;
			}
		});
		MILESTONES.create('dut12', {
			displayName: 'M-Dilute-12',
			description: "削弱九头蛇能量获取的二重软上限",
			req: true,
			reqDescription: '^1.46 M-Dilute-5效果',
			requirement: new Decimal(1.46),
			get canDone() {
				return (
					player.hydra.milestoneDut5Eff.gte(this.requirement)
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut13', {
			displayName: 'M-Dilute-13',
			description: "你可以在药剂III等级不为10的时候获得U5-S-7的加成",
			req: true,
			reqDescription: '1e6100 九头蛇能量 ',
			requirement: new Decimal("e6100"),
			get canDone() {
				return (
					player.hydra.power.gte(this.requirement)
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut14', {
			displayName: 'M-Dilute-14',
			description: "U5-2的效果+1000%",
			req: true,
			reqDescription: '2,261,250 九头蛇能量 ',
			requirement: new Decimal(2261250),
			get canDone() {
				return (
					player.hydra.dilute.solution >= 2261250
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut15', {
			displayName: 'M-Dilute-15',
			description: "M-Dilute-5效果不再依赖于药剂6等级(相当于原来的10级)",
			req: true,
			reqDescription: '2.45 M-Dilute-5效果',
			requirement: new Decimal(2.45),
			get canDone() {
				return (
					player.hydra.milestoneDut5Eff.gte(2.45)
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut16', {
			displayName: 'M-Dilute-16',
			get description() {
			  return "朊病毒加成推演速度(在稀释6后)，稀释不再重置朊病毒<br>效果：" + (player.hydra.dilute.inDilute ? "×" : "^") + format(milestoneDut16Eff())
			},
			req: true,
			reqDescription: '1e18,915九头蛇能量',
			requirement: new Decimal("e18915"),
			get canDone() {
				return (
					player.hydra.power.gte("e18915")
				);
			},
			show: true,
			currency: '',
		});
		MILESTONES.create('dut17', {
			displayName: 'M-Dilute-17',
			get description() {
			  return "总计九头蛇能量加成朊病毒获取速度底数<br>效果：×" + format(player.hydra.trueTotalPower.add(1))
			},
			req: true,
			reqDescription: 'e1.0000e104/s推演速度',
			requirement: new Decimal("ee104"),
			get canDone() {
				return (
					Hydra.deduceSpeed(0).gte(this.requirement)
				);
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
		if (!player.milestones.dut16) player.hydra.dilute.prions = one;
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
		if (!player.milestones.dut16) player.hydra.dilute.prions = new Decimal(1);
		player.numbertheory.GM.x = new Decimal(0);
		player.hydra.dilute.inDilute = false;
	},
	solutionCalc() {
		player.hydra.dilute.solution = Math.max(player.hydra.dilute.solution, this.solutionGain());
		player.hydra.dilute.lastSolvent = Array.from(
			player.hydra.dilute.solvent,
		) as typeof player.hydra.dilute.solvent;
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
	diluteLoop(diff: number) {
		if (player.upgrades["69S"] || (player.hydra.totalDeduceOrdinal[0].gte(1) && player.hydra.dilute.inDilute))
			player.hydra.dilute.prions = player.hydra.dilute.prions.mul(this.prionsBase().pow(diff / 1000).root(this.diluteAmount(8)?1000:1));
		if (player.hydra.dilute.inDilute) {
			player.hydra.milestoneDut5Eff = player.hydra.milestoneDut5Eff.max(milestoneDut5Eff());
			const s3Eff = 1000 / player.hydra.dilute.solvent[2] ** 2;
			player.hydra.dilute.spentTime = player.hydra.dilute.spentTime + diff / 1000;
			if (!player.upgrades["614S"] && player.hydra.dilute.spentTime > s3Eff) {
				ModalService.show({
					title: '已退出稀释',
					content:
						'你被地球爆炸给炸死了！（你已进入稀释' +
						s3Eff +
						'秒，超出了稀释III的限制。）',
				});
				this.exitDilute(false);
			}
			if (!player.upgrades["69S"] &&this.prions().gt(player.hydra.totalDeduceOrdinal[0])) {
				ModalService.show({
					title: '已退出稀释',
					content: '朊病毒吃掉了你的脑子！（你的朊病毒超过了你的推演总数量）',
				});
				this.exitDilute(false);
			}
		}
	},
	prionsBase() {
	  let base = new Decimal(1 + this.diluteAmount(4) / 100);
	  if (player.upgrades["69S"]) base = new Decimal(2)
	  if (player.upgrades["610S"]) base = base.mul(upgrades["610S"].effect())
	  if (player.milestones.dut17) base = base.mul(player.hydra.trueTotalPower.add(1))
	  return base;
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
		if (this.diluteAmount(6)) base *= 5;
		if (this.diluteAmount(7)) base *= 10;
		if (this.diluteAmount(8)) base *= 100;
		const deduceMult = player.hydra.deduceOrdinal[0].add(1).ln().min(base).min(100).toNumber();
		return deduceMult * base;
	},
	solutionEff() {
		let eff1 = new Decimal(getCurrency(Currencies.SOLUTION).pow(0.5)).max(1); //推演速度
		return { eff1: eff1 };
	},
	prions() {
		return player.hydra.dilute.prions.sub(1);
	},
} as IDilute & Record<string, any>;
