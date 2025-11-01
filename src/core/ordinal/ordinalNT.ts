import { BUYABLES, buyables, upgrades, UPGRADES } from '../mechanic';
import { player, feature } from '../global';
import { format, formatMult, formatWhole } from '@/utils/format';
import { OrdinalUtils } from '@/utils/ordinal';
import { Ordinal } from '@/lib/ordinal/';
import Decimal from 'break_eternity.js';
import { Buyable } from '../buyable';
import { Currencies } from '../currencies';
import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { Dilute } from '@/core/hydra/dilute';

export const OrdinalNT = {
	buyables: {
		'51R': new (class B51R extends Buyable<Decimal> {
			description = 'x<sub>3,1</sub>=x<sub>3,1</sub>+1';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^4').toDecimal(feature.Ordinal.base()).mul(x.pow_base(2));
			}
			ordinal = true;
			name = 'B4-R1-1';
			effect(x: Decimal): Decimal {
				return x;
			}
			effectDescription(x: Decimal) {
				return `x<sub>3,1</sub> = ` + format(this.effect(x));
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return player.ordinal.number.gte('e8e153');
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.max(1)
					.div(new Ordinal('w^4').toDecimal(feature.Ordinal.base()))
					.max(1)
					.log(2)
					.add(1)
					.floor();
			}
		})(),
		'52R': new (class B52R extends Buyable<Decimal> {
			description = 'SGH底数+1';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^4')
					.toDecimal(feature.Ordinal.base())
					.mul(x.pow_base(feature.Ordinal.base().toNumber()));
			}
			ordinal = true;
			name = 'B4-R1-2';
			effect(x: Decimal): Decimal {
				return x;
			}
			effectDescription(x: Decimal) {
				return '+' + format(this.effect(x));
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return player.ordinal.number.gte('e8e153');
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.max(1)
					.div(new Ordinal('w^4').toDecimal(feature.Ordinal.base()))
					.max(1)
					.log(feature.Ordinal.base().toNumber())
					.add(1)
					.floor();
			}
		})(),
		'53R': new (class B53R extends Buyable<Decimal> {
			description = 'HH底数-1';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^w').toDecimal(feature.Ordinal.base()).pow(x.pow_base(2));
			}
			ordinal = true;
			name = 'B4-R1-3';
			effect(x: Decimal): Decimal {
				return x.clampMax(6);
			}
			effectDescription(x: Decimal) {
				return '-' + this.effect(x);
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.max(1)
					.log(new Ordinal('w^w').toDecimal(feature.Ordinal.base()))
					.max(1)
					.log2()
					.floor();
			}
			capped(x: Decimal) {
				return x.gte(6);
			}
		})(),
		'54R': new (class B54R extends Buyable<Decimal> {
			description = '将x_3每秒增长倍率+0.05';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^w').toDecimal(feature.Ordinal.base()).pow(x);
			}
			ordinal = true;
			name = 'B4-R1-4';
			effect(x: Decimal): Decimal {
				return x.mul(0.05);
			}
			effectDescription(x: Decimal) {
				return '+' + format(this.effect(x));
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return player.ordinal.number.gte('e8e153');
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.max(1)
					.log(new Ordinal('w^w').toDecimal(feature.Ordinal.base()))
					.max(1)
					.floor();
			}
		})(),
		'55R': new (class B54R extends Buyable<Decimal> {
			description = '将x_3每秒增长指数+0.05';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^(w*2)')
					.toDecimal(feature.Ordinal.base())
					.pow(x.pow_base(feature.Ordinal.base().toNumber()));
			}
			ordinal = true;
			name = 'B4-R1-5';
			effect(x: Decimal): Decimal {
				return x.mul(0.05);
			}
			effectDescription(x: Decimal) {
				return '+' + format(this.effect(x));
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return player.ordinal.number.gte('e8e153');
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.max(1)
					.log(new Ordinal('w^w').toDecimal(feature.Ordinal.base()))
					.max(1)
					.log(feature.Ordinal.base().toNumber())
					.floor();
			}
		})(),
		'61R': new (class B61R extends Buyable<Decimal> {
			description = 'a = a + 1';
			cost(x: Decimal): Decimal {
				const cbase = player.retribution == 1 ? new Decimal('1e900') : new Decimal('ee3');
				let base = cbase.mul(x.pow_base(1e50));
				if (player.hydra.dilute.inDilute) {
					base = base.pow(4 - 3 * 0.75 ** player.hydra.dilute.solvent[1]);
				}
				return base;
			}
			name = 'B5-R1-1';
			effect(x: Decimal): Decimal {
				return x;
			}
			effectDescription(x: Decimal) {
				return 'a = ' + format(this.effect(x));
			}
			currency: Currencies = Currencies.HYDRA_POWER;
			canBuyMax(): boolean {
				return player.milestones.nonrec_8 || player.upgrades['7nt4bq'];
			}
			autoBuyMax(): boolean {
				return player.milestones.nonrec_8 || player.upgrades['7nt4bq'];
			}
			costInverse(x: Decimal): Decimal {
				const cbase = player.retribution == 1 ? new Decimal('1e900') : new Decimal('ee3');
				let expReduce = new Decimal(1);
				if (player.hydra.dilute.inDilute)
					expReduce = expReduce.mul(4 - 3 * 0.75 ** player.hydra.dilute.solvent[1]);
				return x.root(expReduce).div(cbase).max(1).log(1e50).floor().add(1);
			}
		})(),
		'62R': new (class B62R extends Buyable<Decimal> {
			description = 'BMS推演速度×2';
			cost(x: Decimal): Decimal {
				let base = new Decimal(100).mul(x.pow_base(10));
				if (player.hydra.dilute.inDilute) {
					base = base.pow(4 - 3 * 0.75 ** player.hydra.dilute.solvent[1]);
				}
				return base;
			}
			name = 'B5-R1-2';
			effect(x: Decimal): Decimal {
				return x.pow_base(2);
			}
			effectDescription(x: Decimal) {
				return '×' + format(this.effect(x));
			}
			currency: Currencies = Currencies.X4;
			canBuyMax(): boolean {
				return player.milestones.nonrec_8 || player.upgrades['7nt4bq'];
			}
			autoBuyMax(): boolean {
				return player.milestones.nonrec_8 || player.upgrades['7nt4bq'];
			}
			costInverse(x: Decimal): Decimal {
				let expReduce = new Decimal(1);
				if (player.hydra.dilute.inDilute)
					expReduce = expReduce.mul(4 - 3 * 0.75 ** player.hydra.dilute.solvent[1]);
				return x.root(expReduce).div(100).max(1).log(10).floor().add(1);
			}
		})(),
	} as const,
	upgrades: {
		'51R': new (class U51 extends Upgrade {
			description = '将底数降低1';
			cost = (): Decimal => new Ordinal('w^(w+5)').toDecimal(feature.Ordinal.base());
			ordinal = true;
			name = 'U4-R1-1';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'52R': new (class U52 extends Upgrade {
			description = '序数增长速度被乘以奇点能量';
			cost = (): Decimal => new Ordinal('w^(w*2+1)').toDecimal(feature.Ordinal.base());
			ordinal = true;
			name = 'U4-R1-2';
			currency: Currencies = Currencies.ORDINAL;
		})(),
		'61R': new (class U61R extends Upgrade {
			description = '将f(x)的公式加强为log<sub>2</sub> x';
			cost = new Decimal('e1050');
			currency = Currencies.HYDRA_POWER;
			name = 'U5-R1-1';
			keep() {
				return player.milestones.nonrec_8;
			}
		})(),
		'62R': new (class extends Upgrade {
			description = 'U5-1-1效果^1.125';
			cost = new Decimal(2500);
			currency = Currencies.X4;
			name = 'U5-R1-2';
			keep() {
				return player.milestones.nonrec_8;
			}
		})(),
		'63R': new (class extends UpgradeWithEffect<Decimal> {
			description = 'f(x)获得一个基于转生效果的指数';
			cost = new Decimal(1e4);
			currency = Currencies.X4;
			name = 'U5-R1-3';
			effect(): Decimal {
				return feature.Hydra.prestigeEff(0).log10().div(100).add(1);
			}
			effectDescription() {
				return '^' + format(this.effect());
			}
			keep() {
				return player.milestones.nonrec_8;
			}
		})(),
		'64R': new (class extends Upgrade {
			description = 'τ<sub>4</sub>的效果变为其十次方';
			cost = new Decimal(5);
			currency = Currencies.T4;
			name = 'U5-R1-4';
			keep() {
				return player.milestones.nonrec_8;
			}
		})(),
		'65R': new (class extends UpgradeWithEffect<Decimal> {
			description = '九头蛇能量加成轮回效果';
			cost = new Decimal(6);
			currency = Currencies.T4;
			name = 'U5-R1-5';
			effect(): Decimal {
				return player.hydra.power.max('e1000').log10().div(1000);
			}
			effectDescription() {
				return '×' + format(this.effect());
			}
			keep() {
				return player.milestones.nonrec_5;
			}
		})(),
		'66R': new (class extends Upgrade {
			description = 'g(x)的对数底数降低为5';
			cost = () =>
				player.retribution == 1 ? new Decimal('1e1500') : new Decimal('1.1551e1551');
			currency = Currencies.HYDRA_POWER;
			name = 'U5-R1-6';
			keep() {
				return player.milestones.nonrec_8;
			}
		})(),
		'67R': new (class extends Upgrade {
			description = 'g(x)的对数底数降低为2';
			cost = () => (player.retribution == 1 ? new Decimal('1e1600') : new Decimal('1e1900'));
			currency = Currencies.HYDRA_POWER;
			name = 'U5-R1-7';
			keep() {
				return player.milestones.nonrec_8;
			}
		})(),
		'68R': new (class extends UpgradeWithEffect<Decimal> {
			description = () =>
				'U5-R1-5加成以减弱的效果对飞升生效' +
				(player.retribution == 1 ? '<br>由于果报，效果增强' : '');
			cost = () =>
				player.retribution == 1 ? new Decimal('1e1800') : new Decimal('2.085e2085');
			currency = Currencies.HYDRA_POWER;
			name = 'U5-R1-8';
			effectDescription() {
				return '×' + format(this.effect());
			}
			effect(): Decimal {
				return upgrades['65R'].effect().pow(player.retribution == 1 ? 0.4 : 0.25);
			}
			keep() {
				return player.milestones.nonrec_8;
			}
		})(),
		'69R': new (class extends Upgrade {
			description = '解锁<b>稀释</b>';
			cost = () => {
				return player.retribution >= 1 ? new Decimal('1e2450') : new Decimal(2).pow(8192);
			};
			currency = Currencies.HYDRA_POWER;
			name = 'U5-R1-9';
			keep() {
				return player.milestones.nonrec_8;
			}
		})(),
		'621R': new (class extends Upgrade {
			description = 'x<sub>4</sub>加成压缩九头蛇能量';
			cost = new Decimal('1e1000');
			currency: Currencies = Currencies.HYDRA_POWER;
			name = 'U5-R1-2-1';
			keep() {
				return player.milestones.nonrec_8;
			}
			show() {
				return player.retribution >= 1;
			}
		})(),
		'622R': new (class extends UpgradeWithEffect<Decimal> {
			description = 'τ<sub>4</sub>加成U5-2-2效果';
			cost = new Decimal('1e1080');
			currency: Currencies = Currencies.HYDRA_POWER;
			name = 'U5-R1-2-2';
			keep() {
				return player.milestones.nonrec_8;
			}
			show() {
				return player.retribution >= 1;
			}
			effect(): Decimal {
				return OrdinalNT.varComputed('tau', 4).clampMin(1).log10().div(10);
			}
			effectDescription(values: Decimal): string {
				return '+' + format(values);
			}
		})(),
	} as const,
	initMechanics() {},
	varExp(id = 'x', layer = 3): Decimal {
		let base = new Decimal(1);
		base = base.mul(
			buyables['55R'].effect(player.buyables['55R']).add(1).pow(player.numbertheory.GH.t32),
		);
		return base;
	},
	varExpBase(id = 'x', layer = 3): Decimal {
		let base = new Decimal(1);
		base = base.add(buyables['55R'].effect(player.buyables['55R']));
		return base;
	},
	varMul(id = 'x', layer = 3): Decimal {
		let base = new Decimal(1);
		base = base.mul(
			buyables['54R'].effect(player.buyables['54R']).add(1).pow(player.numbertheory.GH.t31),
		);
		return base;
	},
	varMulBase(id = 'x', layer = 3): Decimal {
		let base = new Decimal(1);
		base = base.add(buyables['54R'].effect(player.buyables['54R']));
		return base;
	},
	varParam(id = 'x', layer = 3): string {
		if (layer == 3) {
			const exp = this.varExpBase(id, layer).gt(1);
			if (id == 'x')
				return (
					(exp ? '(' : '') +
					`x_{3,1}` +
					(this.varMul(id, layer).gt(1)
						? `\\times{` + format(this.varMulBase(id, layer)) + `^{t_{3, 1}}}`
						: ``) +
					(exp ? ')^{' + format(this.varExpBase()) + '^{t_{3,2}}}' : '')
				);
		}
		return ``;
	},
	varGain(id = 'x', layer = 3): Decimal {
		if (layer == 3) {
			if (id == 'x') {
				let base = buyables['51R'].effect(player.buyables['51R']);
				base = base.mul(this.varMul(id, layer));
				base = base.pow(this.varExp(id, layer));
				return base;
			}
		}
		if (layer == 4) {
			if (id == 'x') {
				if (Dilute.diluteAmount(3) > 0) {
					if (player.milestones.nonrec_3) return new Decimal(0);
					return new Decimal(player.hydra.dilute.spentTime)
						.pow(Dilute.diluteAmount(3))
						.sqrt();
				}
				let prod = new Decimal(1);
				const a = buyables['61R'].effect(player.buyables['61R']);
				for (let i = 0; i < feature.Hydra.pMaxUnlock(); i++) {
					prod = prod.mul(new Decimal(1).add(feature.Hydra.prestigeEff(i)));
				}
				const prod2 = this.functionL4('f', prod).mul(a);

				return prod2;
			}
		}
		return new Decimal(0);
	},
	functionL4(id = 'f', value: Decimal): Decimal {
		switch (id) {
			case 'f':
				const exp = this.functionL4exp('f');

				if (player.upgrades['61R']) return value.log2().pow(exp);
				return value.log10().pow(exp);
			case 'g':
				let base = 10;
				if (player.upgrades['66R']) base = 5;
				if (player.upgrades['67R']) base = 2;
				return value.log(base);
			default:
				return value;
		}
	},
	functionL4exp(id = 'f'): Decimal {
		switch (id) {
			case 'f':
				let exp = new Decimal(1);
				if (player.upgrades['63R']) exp = exp.mul(upgrades['63R'].effect());

				return exp;
			case 'g':
				return new Decimal(1);
			default:
				return new Decimal(1);
		}
	},
	varGainLoop(diff = 0.04): void {
		if (!player.upgrades[61]) {
			player.numbertheory.GH.x = player.numbertheory.GH.x.add(this.varGain('x', 3).mul(diff));
			if (player.upgrades[512])
				player.numbertheory.GH.t33 = player.numbertheory.GH.t33.add(diff);
		}
		if (Dilute.diluteAmount(3) > 0 || player.upgrades[65])
			player.numbertheory.GM.x = player.numbertheory.GM.x.add(this.varGain('x', 4).mul(diff));
	},
	varComputed(id = 'tau', layer = 3): Decimal {
		if (layer == 3) {
			if (id == 'tau') {
				let base;
				if (player.upgrades[515])
					base = new Ordinal(
						OrdinalUtils.numberToOrdinal(
							OrdinalNT.varComputed('a', 3),
							OrdinalNT.varComputed('hhBase', 3),
							7,
							false,
						),
					).toDecimal(
						new Ordinal(
							OrdinalUtils.numberToOrdinal(
								OrdinalNT.varComputed('a', 3),
								OrdinalNT.varComputed('hhBase', 3),
								7,
								false,
							),
						).toDecimal(this.varComputed('sghBase', 3)),
					);
				else
					base = new Ordinal(
						OrdinalUtils.numberToOrdinal(
							OrdinalNT.varComputed('a', 3),
							OrdinalNT.varComputed('hhBase', 3),
							7,
							false,
						),
					).toDecimal(this.varComputed('sghBase', 3));
				return base;
			} else if (id == 'a') {
				const base = OrdinalUtils.numberLogHH(
					player.numbertheory.GH.x,
					this.varComputed('hhBase', 3),
				);
				return base;
			} else if (id == 'hhBase') {
				let base = new Decimal(10);
				base = base.sub(buyables['53R'].effect(player.buyables['53R']));

				return base;
			} else if (id == 'sghBase') {
				let base = new Decimal(10);
				base = base.add(buyables['52R'].effect(player.buyables['52R']));
				base = base.add(player.numbertheory.GH.t33);
				return base;
			}
		}
		if (layer == 4) {
			if (id == 'tau') {
				if (Dilute.diluteAmount(3) > 0) {
					if (player.milestones.nonrec_3) return new Decimal(1);
					const base = player.numbertheory.GM.x.add(1).pow(0.5).max(1);
					if (isNaN(base.mag)) return new Decimal(1);
					return base;
				}
				const base = player.numbertheory.GM.x.add(10);
				return this.functionL4('g', base);
			}
		}
		return new Decimal(0);
	},
};
