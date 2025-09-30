import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { Buyable } from '../buyable';
import { getCurrency, Currencies } from '../currencies';
import { format, formatWhole } from '@/utils/format';
import { upgrades, buyables } from '../mechanic';
import Decimal from 'break_eternity.js';
import { player } from '../save';
import type { FixedLengthArray } from 'type-fest';
import { DC } from '../constants';
import { getTotalTheories } from '../nonrecu/total-theories.ts';

function B6R13_B6R14_base() {
	let base = new Decimal(0.05);
	base = base.mul(buyables.B6R15.effect(player.buyables.B6R15).add(1));
	if (player.numbertheory.well_ordering.steps_proceeded.includes(7)) base = base.mul(2);
	return base;
}

export const WellOrderingBuyables = {
	B6R11: new (class extends Buyable<Decimal> {
		name = 'B6-R-1-1';
		description = '点击获得推演能量按钮获取量+1';
		cost(x: Decimal): Decimal {
			return x.pow_base(1.3).mul(100);
		}
		effect(x: Decimal): Decimal {
			let eff = x;
			if (player.upgrades.U6R13) eff = eff.pow(2);
			eff = eff.pow(buyables.B6R13.effect(player.buyables.B6R13));
			return eff;
		}
		effectDescription(x: Decimal) {
			return '+' + formatWhole(this.effect(x));
		}
		costInverse(x: Decimal): Decimal {
			return x.div(100).log(1.3).add(1).floor();
		}
		canBuyMax(): boolean {
			return player.upgrades.U6R15;
		}
		autoBuyMax(): boolean {
			return player.upgrades.U6R17;
		}
		currency: Currencies = Currencies.DEDUCE_ENERGY;
	})(),
	B6R12: new (class extends Buyable<Decimal> {
		name = 'B6-R-1-2';
		description = '每秒点击(该购买项等级)<sup>2</sup>次推演能量按钮';
		cost(x: Decimal): Decimal {
			return x.pow_base(1.5).mul(500);
		}
		effect(x: Decimal): Decimal {
			let eff = x.pow(2);
			eff = eff.pow(buyables.B6R13.effect(player.buyables.B6R13));
			if (eff.gte(1e9)) eff = eff.log10().div(9).pow(0.5).mul(9).pow10();
			return eff;
		}
		effectDescription(x: Decimal) {
			return formatWhole(this.effect(x)) + '/s';
		}
		costInverse(x: Decimal): Decimal {
			return x.div(500).log(1.5).add(1).floor();
		}
		canBuyMax(): boolean {
			return player.upgrades.U6R15;
		}
		autoBuyMax(): boolean {
			return player.upgrades.U6R17;
		}
		currency: Currencies = Currencies.DEDUCE_ENERGY;
	})(),
	B6R13: new (class extends Buyable<Decimal> {
		name = 'B6-R-1-3';
		description = '前两个购买项的效果指数+0.05';
		cost(x: Decimal): Decimal {
			return x.pow(1.2).pow_base(2).mul(1e15);
		}
		effect(x: Decimal): Decimal {
			return x.mul(B6R13_B6R14_base()).add(1);
		}
		effectDescription(x: Decimal) {
			return '+' + format(this.effect(x).sub(1));
		}
		costInverse(x: Decimal): Decimal {
			return x.div(1e15).log(2).root(1.2).add(1).floor();
		}
		canBuyMax(): boolean {
			return player.upgrades.U6R15;
		}
		autoBuyMax(): boolean {
			return player.upgrades.U6R17;
		}
		currency: Currencies = Currencies.DEDUCE_ENERGY;
	})(),
	B6R14: new (class extends Buyable<Decimal> {
		name = 'B6-R-1-4';
		description = 'U6-R-1-1的效果指数+0.05';
		cost(x: Decimal): Decimal {
			return x.pow(1.2).pow_base(4).mul(1e16);
		}
		effect(x: Decimal): Decimal {
			return x.mul(B6R13_B6R14_base());
		}
		effectDescription(x: Decimal) {
			return '+' + format(this.effect(x));
		}
		costInverse(x: Decimal): Decimal {
			return x.div(1e16).log(4).root(1.2).add(1).floor();
		}
		canBuyMax(): boolean {
			return player.upgrades.U6R15;
		}
		autoBuyMax(): boolean {
			return player.upgrades.U6R17;
		}
		currency: Currencies = Currencies.DEDUCE_ENERGY;
	})(),
	B6R15: new (class extends Buyable<Decimal> {
		name = 'B6-R-1-5';
		description = 'U6-R-1-3~4的效果底数+0.015';
		cost(x: Decimal): Decimal {
			return x.pow_base(1.2).sub(1).pow_base(1e50).mul('1e325');
		}
		base(): Decimal {
			let base = new Decimal(0.015);
			if (player.upgrades.U6R16) base = base.mul(1.05);
			return base;
		}
		effect(x: Decimal): Decimal {
			return x.mul(this.base());
		}
		effectDescription(x: Decimal) {
			return '+' + format(this.effect(x));
		}
		costInverse(x: Decimal): Decimal {
			return x.div('1e325').log(1e50).add(1).log(1.2).add(1).floor();
		}
		canBuyMax(): boolean {
			return false;
		}
		autoBuyMax(): boolean {
			return false;
		}
		currency: Currencies = Currencies.DEDUCE_ENERGY;
	})(),
} as const;
export const WellOrderingUpgrades = {
	U6R11: new (class extends UpgradeWithEffect<Decimal> {
		description = '基于非递归能量加成推演能量获取';
		cost = new Decimal(5e6);
		name = 'U6-R-1-1';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		effect(): Decimal {
			let exp = new Decimal(0.15);
			exp = exp.add(buyables.B6R14.effect(player.buyables.B6R14));
			let eff = player.nonrecu.power.add(1).log10().add(1).pow(exp);
			if (eff.gte(1e225)) eff = eff.log10().div(225).pow(0.5).mul(225).pow10();
			return eff;
		}
		effectDescription(): string {
			return 'x' + format(this.effect());
		}
	})(),
	U6R12: new (class extends Upgrade {
		description = '你可以同时购买三列非递归研究树的第5到第7行';
		cost = new Decimal(1e8);
		name = 'U6-R-1-2';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
	})(),
	U6R13: new (class extends Upgrade {
		description = 'B6-R-1-1的效果变为其平方';
		cost = new Decimal(5e9);
		name = 'U6-R-1-3';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
	})(),
	U6R14: new (class extends UpgradeWithEffect {
		description = '累计非递归定理加成推演能量获取';
		cost = new Decimal(1e45);
		name = 'U6-R-1-4';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		effect(): Decimal {
			return getTotalTheories().add(1).pow(2);
		}
		effectDescription(): string {
			return 'x' + format(this.effect());
		}
	})(),
	U6R15: new (class extends Upgrade {
		description = '你可以最大购买B6-R-1~4';
		cost = new Decimal(1e160);
		name = 'U6-R-1-5';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
	})(),
	U6R16: new (class extends Upgrade {
		description = 'B6-R-1-5增强5%';
		cost = new Decimal('1e996');
		name = 'U6-R-1-6';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades[76];
		}
	})(),
	U6R17: new (class extends Upgrade {
		description = '自动最大B6-R-1~4';
		cost = new Decimal('1e1750');
		name = 'U6-R-1-7';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades[76];
		}
	})(),
} as const;
export const nt = {
	get p() {
		return player.numbertheory.well_ordering;
	},
};
export function wellOrderGainPerClick() {
	let a = new Decimal(1);

	a = a.add(buyables.B6R11.effect(player.buyables.B6R11));

	if (player.numbertheory.well_ordering.steps_proceeded.includes(2)) a = a.mul(10);
	if (player.numbertheory.well_ordering.steps_proceeded.includes(3))
		a = a.mul(player.challenges[1][5].add(1));
	if (player.numbertheory.well_ordering.steps_proceeded.includes(6))
		a = a.mul(player.hydra.dilute.solution.add(1).root(100));
	if (player.upgrades.U6R11) a = a.mul(upgrades.U6R11.effect());
	if (player.upgrades.U6R14) a = a.mul(upgrades.U6R14.effect());

	if (player.upgrades[75]) a = a.pow(1.25);
	if (player.numbertheory.well_ordering.steps_proceeded.includes(14)) a = a.pow(1.5);

	if (a.gte(1e15)) a = a.log10().div(15).pow(0.5).mul(15).pow10();

	return a;
}
export function clickWellOrder() {
	nt.p.energy = nt.p.energy.add(wellOrderGainPerClick());
}

const ProcceedingCost = [
	new Decimal(1 / 0),
	DC.D_10,
	new Decimal(1e5),
	new Decimal(5e8),
	new Decimal(1e15),
	new Decimal(1e17),
	new Decimal(1e34),
	new Decimal(1e52),
	new Decimal(2).pow(1024),
	new Decimal('3e320'),
	new Decimal('3e325'),
	new Decimal('1e690'),
	new Decimal('1e695'),
	new Decimal('1e700'),
	new Decimal('1e1125'),
	new Decimal(1 / 0),
];

export function stepProceed(x: number) {
	if (!nt.p.steps_proceeded.includes(x)) {
		if (nt.p.energy.gte(ProcceedingCost[x] ?? new Decimal(1 / 0))) {
			nt.p.energy = nt.p.energy.sub(ProcceedingCost[x]);
			nt.p.steps_proceeded.push(x);
		}
	}
}
export function wellOrderPlayerData() {
	return {
		selecting: 1,
		energy: DC.D_0,
		pages: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as FixedLengthArray<number, 10>,
		steps_proceeded: [] as number[],
	};
}

export function energyToUNOCFSpeed() {
	return player.numbertheory.well_ordering.energy.add(1).clampMin(1);
}

export function wellOrderingLoop(diff: number) {
	player.numbertheory.well_ordering.energy = player.numbertheory.well_ordering.energy
		.add(buyables.B6R11.effect(player.buyables.B6R11).mul(diff).mul(wellOrderGainPerClick()))
		.clampMax('f1e250');
}
