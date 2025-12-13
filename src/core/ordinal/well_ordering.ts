import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { Buyable } from '../buyable';
import { Currencies } from '../currencies';
import { format, formatWhole } from '@/utils/format';
import { upgrades, buyables } from '../mechanic';
import Decimal from 'break_eternity.js';
import { player } from '../save';
import type { FixedLengthArray, IntClosedRange } from 'type-fest';
import { DC } from '../constants';
import { getTotalTheories } from '../nonrecu/total-theories.ts';
import { RETRIBUTION } from '@/core/post-nonrec/retribution';
import { unwrapDecimalValue } from '@/lib/funcs.ts';
import { Analysis } from '@/core/pt/index.ts';

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
			return player.upgrades.U6R15 || player.upgrades['7nt5ubq'];
		}
		autoBuyMax(): boolean {
			return player.upgrades.U6R17 || player.upgrades['7nt5ubq'];
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
			return player.upgrades.U6R15 || player.upgrades['7nt5ubq'];
		}
		autoBuyMax(): boolean {
			return player.upgrades.U6R17 || player.upgrades['7nt5ubq'];
		}
		currency: Currencies = Currencies.DEDUCE_ENERGY;
	})(),
	B6R13: new (class extends Buyable<Decimal> {
		name = 'B6-R-1-3';
		description = '前两个购买项的效果指数+0.05';
		cost(x: Decimal): Decimal {
			return x
				.pow(1.2)
				.pow_base(2)
				.mul(1e15)
				.pow(buyables.B6R21.effect(player.buyables.B6R21));
		}
		effect(x: Decimal): Decimal {
			let base = x.mul(B6R13_B6R14_base()).add(1);
			if (base.gte(2500)) base = base.div(2500).pow(0.5).sub(1).mul(2).add(1).mul(2500);
			return base;
		}
		effectDescription(x: Decimal) {
			return '+' + format(this.effect(x).sub(1));
		}
		costInverse(x: Decimal): Decimal {
			return x
				.root(buyables.B6R21.effect(player.buyables.B6R21))
				.div(1e15)
				.log(2)
				.root(1.2)
				.add(1)
				.floor();
		}
		canBuyMax(): boolean {
			return player.upgrades.U6R15 || player.upgrades['7nt5ubq'];
		}
		autoBuyMax(): boolean {
			return player.upgrades.U6R17 || player.upgrades['7nt5ubq'];
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
			let base = x.mul(B6R13_B6R14_base());
			if (base.gte(1250)) base = base.div(1250).pow(0.5).sub(1).mul(2).add(1).mul(1250);
			return base;
		}
		effectDescription(x: Decimal) {
			return '+' + format(this.effect(x));
		}
		costInverse(x: Decimal): Decimal {
			return x.div(1e16).log(4).root(1.2).add(1).floor();
		}
		canBuyMax(): boolean {
			return player.upgrades.U6R15 || player.upgrades['7nt5ubq'];
		}
		autoBuyMax(): boolean {
			return player.upgrades.U6R17 || player.upgrades['7nt5ubq'];
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
			return player.upgrades['7nt5ubq'];
		}
		autoBuyMax(): boolean {
			return player.upgrades['7nt5ubq'];
		}
		currency: Currencies = Currencies.DEDUCE_ENERGY;
	})(),
	B6R21: new (class extends Buyable<Decimal> {
		name = 'B6-R-2-1';
		description = '基于推演能量降低B6-R-1-3~4价格';
		cost(x: Decimal): Decimal {
			return x.pow_base(this.base()).sub(1).pow_base('1e1800').mul('1e2975');
		}
		effect(x: Decimal): Decimal {
			return x.pow_base(0.95);
		}
		base(): Decimal {
			let base = new Decimal(2);
			if (player.numbertheory.well_ordering.steps_proceeded.includes(18))
				base = new Decimal(1.95);
			return base.max(1.000001);
		}
		effectDescription(x: Decimal) {
			return '^' + format(this.effect(x));
		}
		costInverse(x: Decimal): Decimal {
			return x.div('1e2975').log('1e1800').add(1).log(this.base()).add(1).floor();
		}
		canBuyMax(): boolean {
			return player.upgrades['7nt5ubq'];
		}
		autoBuyMax(): boolean {
			return player.upgrades['7nt5ubq'];
		}
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.numbertheory.well_ordering.steps_proceeded.includes(17);
		}
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
		cost = new Decimal('9.95e995');
		name = 'U6-R-1-6';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades[76];
		}
	})(),
	U6R17: new (class extends Upgrade {
		description = '自动最大B6-R-1~4';
		cost = new Decimal('1.749e1749');
		name = 'U6-R-1-7';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades[76];
		}
	})(),
	U6R18: new (class extends Upgrade {
		description = () =>
			`推演能量×1e100<br>解锁<b class="baseRetribution">${RETRIBUTION.name()}</b>`;
		cost = () => new Decimal('1e1777');
		name = 'U6-R-1-8';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades[76];
		}
	})(),
	U6R21: new (class extends Upgrade {
		description = '移除非递归能量的二重软上限';
		cost = () => new Decimal(player.retribution == 1 ? '1e42252' : '4.2257e42257');
		name = 'U6-R-2-1';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.numbertheory.well_ordering.steps_proceeded.includes(18);
		}
	})(),
	U6R22: new (class extends UpgradeWithEffect<Decimal> {
		description = '当前非递归内重置时间加成推演能量获取速度';
		cost = () =>
			new Decimal(
				player.retribution == 1
					? '2e42252'
					: player.options.hardMode
						? '1e42260'
						: '1e42258',
			);
		name = 'U6-R-2-2';
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.numbertheory.well_ordering.steps_proceeded.includes(18);
		}
		effect() {
			let base = player.nonrecu.secInThisReset.pow_base(10);
			if (base.gte('e2.5e7'))
				base = base.log10().div(2.5e7).pow(0.5).sub(1).mul(2).add(1).mul(2.5e7).pow10();
			return base;
		}
		effectDescription() {
			return 'x' + format(this.effect());
		}
	})(),
	U6R31: new (class extends Upgrade {
		name = 'U6-R-3-1';
		cost = () => new Decimal('1f26500');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.milestones['sin_10'];
		}
	})(),
	U6R32: new (class extends Upgrade {
		name = 'U6-R-3-2';
		cost = () => new Decimal('1f35000');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.milestones['sin_10'];
		}
	})(),
	U6R33: new (class extends UpgradeWithEffect<Decimal> {
		name = 'U6-R-3-3';
		cost = () => new Decimal('1f37500');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades['U6R32'];
		}
		effect() {
			return player.numbertheory.well_ordering.lemmas.mul(
				player.numbertheory.well_ordering.lemma_level.sub(1).pow_base(4),
			);
		}
		effectDescription(values: Decimal): string {
			return `×${format(values)}`;
		}
	})(),
	U6R34: new (class extends UpgradeWithEffect<Decimal> {
		name = 'U6-R-3-4';
		cost = () => new Decimal('1f165000');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades['U6R33'];
		}
		effect() {
			let base = player.hydra.totalCompressedPower.slog().clampMin(10).log10();
			if(player.upgrades['U6R38']) base = base.pow(2);
			return base;
		}
		effectDescription(values: Decimal): string {
			return `×${format(values)}`;
		}
	})(),
	U6R35: new (class extends UpgradeWithEffect<Decimal> {
		name = 'U6-R-3-5';
		cost = () => new Decimal('f6e5');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades['U6R34'];
		}
		effect() {
			let base = player.hydra.totalCompressedPower.slog().clampMin(10).log10();
			if(player.upgrades['U6R38']) base = base.pow(1.5);
			return base;
		}
		effectDescription(values: Decimal): string {
			return `×${format(values)}`;
		}
	})(),
	U6R36: new (class extends Upgrade {
		name = 'U6-R-3-6';
		cost = () => new Decimal('f1.5e6');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades['U6R34'];
		}
	})(),
	U6R37: new (class extends Upgrade {
		name = 'U6-R-3-7';
		cost = () => new Decimal('f5e6');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades['U6R34'];
		}
	})(),
	U6R38: new (class extends Upgrade {
		name = 'U6-R-3-8';
		cost = () => new Decimal('f7.5e6');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades['U6R34'];
		}
	})(),
	U6R39: new (class extends Upgrade {
		name = 'U6-R-3-9';
		cost = () => new Decimal('f4e7');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades['U6R38'];
		}
	})(),
	U6R310: new (class extends UpgradeWithEffect<Decimal> {
		name = 'U6-R-3-10';
		cost = () => new Decimal('f2e8');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades['U6R38'];
		}
		effect() {
			let base = player.hydra.totalCompressedPower.slog().max(1).root(4);
			return base;
		}
		effectDescription(values: Decimal): string {
			return `×${format(values)}`;
		}
	})(),
	U6R311: new (class extends UpgradeWithEffect<Decimal> {
		name = 'U6-R-3-11';
		cost = () => new Decimal('f2e10');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades['U6R38'];
		}
		effect() {
			let base = player.numbertheory.well_ordering.lemmas.mul(4).max(1).root(4).mul(10).sub(9);
			if(player.upgrades['U6R312']) base = base.pow(1.5);
			return base;
		}
		effectDescription(values: Decimal): string {
			return `×${format(values)}`;
		}
	})(),
	U6R312: new (class extends Upgrade {
		name = 'U6-R-3-12';
		cost = () => new Decimal('f4e11');
		currency: Currencies = Currencies.DEDUCE_ENERGY;
		show(): boolean {
			return player.upgrades['U6R38'];
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
	if (player.upgrades.U6R18) a = a.mul(1e100);
	if (player.upgrades.U6R22) a = a.mul(upgrades.U6R22.effect());

	a = a.pow(Analysis.systemEffect[3].value(player.pt.analysis[3]));
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
	new Decimal('1e2435'),
	new Decimal('1e2940'),
	() => (player.retribution == 1 ? new Decimal('1e2960') : new Decimal('1e2975')),
	new Decimal('1e8320'),
	new Decimal('1e42258'),
	() => (player.retribution == 1 ? new Decimal('1e58888') : new Decimal('1e75000')),
	() => (player.retribution == 1 ? new Decimal('e6e4') : new Decimal('e5e5')),
	() => (player.retribution == 1 ? new Decimal('e88000') : new Decimal('ee6')),
	new Decimal('ee8'),
	new Decimal(1 / 0),
];
export function stepProceed(x: number) {
	console.log(x);
	if (!nt.p.steps_proceeded.includes(x)) {
		console.log(x);
		if (nt.p.energy.gte(unwrapDecimalValue(ProcceedingCost[x] ?? new Decimal(1 / 0)))) {
			nt.p.energy = nt.p.energy.sub(unwrapDecimalValue(ProcceedingCost[x]));
			nt.p.steps_proceeded.push(x);
		}
	}
}
export function wellOrderPlayerData() {
	return {
		selecting: 1 as IntClosedRange<0, 10>,
		energy: DC.D_0,
		pages: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as FixedLengthArray<number, 10>,
		steps_proceeded: [] as number[],
		lemmas: new Decimal(0),
		theorems: new Decimal(0),
		theorems_th: new Decimal(0),
		lemma_level: new Decimal(1),
		theorem_level: new Decimal(1),
		theoremProveStatus: true,
	};
}

export function energyToUNOCFSpeed() {
	return player.numbertheory.well_ordering.energy.add(1).clampMin(1);
}
export function wellOrderingGain(diff: number) {
	let a = buyables.B6R11.effect(player.buyables.B6R11).mul(diff).mul(wellOrderGainPerClick());
	if (player.numbertheory.well_ordering.energy.gte('e1.5e8') && player.retribution < 1) {
		a = a.clampMax(player.numbertheory.well_ordering.energy.mul('1e1000000'));
	}
	return a;
}
export function ltEffect() {
	const a: [Decimal, Decimal] = [new Decimal(0), new Decimal(0)];
	a[0] = player.numbertheory.well_ordering.lemmas
		.add(1)
		.mul(0.1)
		.mul(Decimal.pow(1.5, player.numbertheory.well_ordering.lemma_level.sub(1)));
	a[1] = player.numbertheory.well_ordering.theorems
		.add(Math.E)
		.ln()
		.pow(Decimal.pow(1.5, player.numbertheory.well_ordering.theorem_level.sub(1)));
	a[0] = a[0].mul(a[1]);
	if(player.upgrades['U6R37']) a[0] = a[0].mul(10);
	if(player.upgrades['U6R39']) a[0] = a[0].pow(1.1);
	return a;
}

export function ltGain() {
	const a: [Decimal, Decimal] = [new Decimal(0), new Decimal(0)];
	if (player.upgrades['U6R31']) {
		a[0] = a[0].add(1 / 10);
	}
	if (player.upgrades['U6R32']) {
		a[1] = a[1].add(1 / 100);
	}
	if (player.upgrades['U6R34']) {
		a[0] = a[0].mul(upgrades['U6R34'].effect());
		a[1] = a[1].mul(upgrades['U6R34'].effect());
	}
	if (player.upgrades['U6R35']) {
		a[0] = a[0].mul(upgrades['U6R35'].effect());
	}
	if (player.upgrades['U6R37']) {
		a[0] = a[0].mul(10);
		a[1] = a[1].mul(10);
	}
	if (player.upgrades['U6R310']) {
		a[0] = a[0].mul(upgrades['U6R310'].effect());
	}
	if (player.upgrades['U6R311']) {
		a[1] = a[1].mul(upgrades['U6R311'].effect());
	}
	if (!player.upgrades['U6R312']) a[0] = a[0].div(Decimal.pow(4, player.numbertheory.well_ordering.lemma_level.sub(1)));
	a[1] = a[1].div(Decimal.pow(4, player.numbertheory.well_ordering.theorem_level.sub(1)));
	if (a[0].gte('1e10')) {
		a[0] = a[0].div(1e10).pow(0.001).mul(1e10);
	}
	return a;
}
export function wellOrderingLoop(diff: number) {
	player.numbertheory.well_ordering.energy = player.numbertheory.well_ordering.energy.add(
		wellOrderingGain(diff),
	);
	if (player.upgrades['U6R31']) {
		const [lemma, theorem] = ltGain();
		player.numbertheory.well_ordering.lemmas = player.numbertheory.well_ordering.lemmas.add(
			lemma.mul(diff),
		);
		player.numbertheory.well_ordering.theorems_th =
			player.numbertheory.well_ordering.theorems_th.add(theorem.mul(diff));
		if (
			player.numbertheory.well_ordering.theorems_th.gte(1) &&
			player.numbertheory.well_ordering.theoremProveStatus
		) {
			let gain = player.numbertheory.well_ordering.lemmas
				.div(4)
				.floor()
				.min(player.numbertheory.well_ordering.theorems_th.floor());
			if (player.upgrades['U6R36'])
				gain = player.numbertheory.well_ordering.theorems_th.floor();
			const cost = gain.mul(4);
			if (cost.lte(player.numbertheory.well_ordering.lemmas) || player.upgrades['U6R36']) {
				if (!player.upgrades['U6R36'])
					player.numbertheory.well_ordering.lemmas =
						player.numbertheory.well_ordering.lemmas.sub(cost);
				player.numbertheory.well_ordering.theorems_th =
					player.numbertheory.well_ordering.theorems_th.sub(gain);
				player.numbertheory.well_ordering.theorems =
					player.numbertheory.well_ordering.theorems.add(gain);
			}
		}
	}
	if (player.retribution < 1) {
		player.numbertheory.well_ordering.energy =
			player.numbertheory.well_ordering.energy.clampMax('1e750000000');
	}
}
export function levelreq(x: 0 | 1) {
	if (x == 0) {
		return player.numbertheory.well_ordering.lemma_level.pow10();
	}
	let base = player.numbertheory.well_ordering.theorem_level.add(1).pow(2).pow10();
	return base;
}
export function levelup(x: 0 | 1) {
	if (x == 0) {
		const req = levelreq(0);
		if (player.numbertheory.well_ordering.theorems.gte(req)) {
			player.numbertheory.well_ordering.theorems =
				player.numbertheory.well_ordering.theorems.sub(req);
			player.numbertheory.well_ordering.lemma_level =
				player.numbertheory.well_ordering.lemma_level.add(1);
		}
	}
	else {
		const req = levelreq(1);
		if (player.numbertheory.well_ordering.theorems.gte(req)) {
			player.numbertheory.well_ordering.lemmas = new Decimal(0);
			player.numbertheory.well_ordering.theorems = new Decimal(0);
			player.numbertheory.well_ordering.lemma_level = new Decimal(1);
			player.numbertheory.well_ordering.theorem_level =
				player.numbertheory.well_ordering.theorem_level.add(1);
		}
	}
}

export function leveldown(x: 0 | 1) {
	if (x == 0) {
		if (player.numbertheory.well_ordering.lemma_level.gte(1)) {
			player.numbertheory.well_ordering.lemma_level =
				player.numbertheory.well_ordering.lemma_level.sub(1);
		}
	}
}
