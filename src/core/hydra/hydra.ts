import Decimal from 'break_eternity.js';
import { player, feature } from '@/core/global';
import { format, formatWhole } from '@/utils/format';
import { Currencies, getCurrency } from '../currencies';
import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { CurrencyRequirement, type Requirement } from '../requirements';
import { Buyable } from '../buyable';
import { upgrades, buyables } from '../mechanic';
import { Dilute } from './dilute';
import type { IntClosedRange } from 'type-fest';

//Hydra：BMS，1-Y，fffZ
export const Hydra = {
	upgrades: {
		'61': new (class U61 extends Upgrade {
			description =
				'<span style="font-size: 14px">启动BMS推演，基础速度0.1次/s，根据推演中的序数增益序数<br>\
			  <span style="color: red">献祭一些升级、购买项......</span></span>';
			cost = new Decimal(0);
			name = 'U5-1';
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'611': new (class U611 extends UpgradeWithEffect<Decimal> {
			description = '累计九头蛇能量提升BMS推演速度';
			cost = new Decimal(10);
			name = 'U5-1-1';
			effect(): Decimal {
				let base = player.hydra.totalPower.max(10).log10();
				if(player.milestones['dut1']) base = base.mul(player.hydra.totalPower.add(1).min(10));
				if (player.upgrades[616]) base = base.pow(upgrades[616].effect());
				if (player.upgrades['62R']) base = base.pow(1.15);
				if (player.upgrades['61S']) {
					base = base.pow(upgrades['61S'].effect());
				}
				return base;
			}
			effectDescription(): string {
				return 'x' + format(this.effect());
			}
			currency: Currencies = Currencies.HYDRA_POWER;
			keep(): boolean {
				return player.milestones['dut1'];
			}
		})(),
		'612': new (class U612 extends Upgrade {
			description = '推演速度提高100%';
			cost = new Decimal(100);
			name = 'U5-1-2';
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'613': new (class U613 extends Upgrade {
			description = '飞升的公式变得更好';
			cost = new Decimal(1e15);
			name = 'U5-1-3';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(1);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'614': new (class U614 extends UpgradeWithEffect<Decimal> {
			description = '当前九头蛇能量提升BMS乘数获取';
			cost = new Decimal(1e15);
			name = 'U5-1-4';
			effect(): Decimal {
				let base = player.hydra.power.div(1e15).max(1).root(10);
				if (base.gte(1e100)) base = base.log10().div(100).pow(0.75).mul(100).pow_base(10);
				return base;
			}
			effectDescription(): string {
				return 'x' + format(this.effect());
			}
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(2);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'615': new (class U615 extends UpgradeWithEffect<Decimal> {
			description = '从40个开始，每5个B5-1-3提供一个额外的B5-1-2';
			cost = new Decimal(2).pow(512);
			name = 'U5-1-5';
			effect(): Decimal {
				const base = player.buyables[613].sub(40).div(5).floor().max(0);
				return base;
			}
			effectDescription(): string {
				return '+' + format(this.effect());
			}
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(2);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'616': new (class U616 extends UpgradeWithEffect<Decimal> {
			description = '每购买一个B5-1-3，U5-1-1效果^+0.01';
			cost = new Decimal(1e200);
			name = 'U5-1-6';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(2);
			}
			effectDescription(): string {
				return '^' + format(this.effect());
			}
			effect(): Decimal {
				return player.buyables[613].mul(0.01).add(1);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'617': new (class U617 extends UpgradeWithEffect<Decimal> {
			description = '九头蛇能量加成B5-1-2底数';
			cost = new Decimal('1e700');
			name = 'U5-1-7';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(3);
			}
			effectDescription(): string {
				return '×' + format(this.effect());
			}
			effect(): Decimal {
				return player.hydra.power.max(1).log10().max(500).div(500);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'618': new (class U618 extends UpgradeWithEffect<Decimal> {
			description = '轮回效果削弱转生/飞升第一软上限';
			cost = new Decimal('1e800');
			name = 'U5-1-8';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(3);
			}
			effectDescription(): string {
				return '^' + format(this.effect());
			}
			effect(): Decimal {
				return Hydra.prestigeEff(3).add(1).recip();
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'619': new (class extends UpgradeWithEffect<Decimal> {
			description = '轮回效果削弱九头蛇能量软上限';
			cost = new Decimal('1e1125');
			name = 'U5-1-9';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(3);
			}
			effectDescription(): string {
				return '^' + format(this.effect());
			}
			effect(): Decimal {
				return Hydra.prestigeEff(3).add(1).recip();
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'6110': new (class extends UpgradeWithEffect<Decimal> {
			description = '轮回效果降低B5-1-2~4的价格';
			cost = new Decimal('7.1717e1717');
			name = 'U5-1-10';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(3);
			}
			effectDescription(): string {
				return '^' + format(this.effect());
			}
			effect(): Decimal {
				return Hydra.prestigeEff(3).add(1).recip().pow(1.1);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'6111': new (class extends UpgradeWithEffect<Decimal> {
			description = '移除九头蛇能量的第一软上限，U5-1-8增益九头蛇能量获取';
			cost = new Decimal('2.695e2695');
			name = 'U5-1-11';
			show(): boolean {
				return player.upgrades["66S"];
			}
			effectDescription(): string {
				return '^' + format(this.effect());
			}
			effect(): Decimal {
				return upgrades["618"].effect().recip();
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'6112': new (class extends Upgrade {
			description = '移除B5-1-2的软上限';
			cost = new Decimal('2.857e2857');
			name = 'U5-1-12';
			show(): boolean {
				return player.upgrades["66S"];
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'62': new (class U62 extends UpgradeWithEffect<Decimal> {
			description = '基于累计九头蛇能量，每秒获得一定重置时获取的九头蛇能量和乘数';
			cost = new Decimal(1e45);
			name = 'U5-2';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(2);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
			effectDescription(): string {
				return `+${format(this.effect().mul(100))}%/s`;
			}
			effect(): Decimal {
				return player.hydra.totalPower.max(1).log10().div(22.5);
			}
		})(),
		'63': new (class U63 extends Upgrade {
			description = '转生和飞升不再重置九头蛇能量，转生不再重置乘数';
			cost = new Decimal(1e250);
			name = 'U5-3';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(2);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'64': new (class U64 extends Upgrade {
			description = '超越不再重置九头蛇能量，飞升不再重置乘数，转生不重置任何东西。';
			cost = new Decimal('1e600');
			name = 'U5-4';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(3);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'65': new (class U64 extends Upgrade {
			description = '飞升/超越/轮回不再重置任何东西。解锁<b>数论研究4</b>';
			cost = new Decimal('1e1000');
			name = 'U5-5';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(3);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'66': new (class U64 extends Upgrade {
			description = '转生/飞升自动重置阈值为+0 & ×1';
			cost = new Decimal('1.337e1337');
			name = 'U5-6';
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(3);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
	},
	buyables: {
		'611': new (class B611 extends Buyable<Decimal> {
			description = 'BMS推演速度×+1';
			cost(x: Decimal): Decimal {
				let cost = new Decimal(10).mul(x.pow_base(1.15));
				if (player.hydra.dilute.inDilute) {
					cost = cost.pow(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
				}
				return cost;
			}
			name = 'B5-1-1';
			effect(x: Decimal): Decimal {
				return x.add(1);
			}
			effectDescription(x: Decimal) {
				return 'x' + format(this.effect(x));
			}
			currency: Currencies = Currencies.HYDRA_POWER;
			canBuyMax(): boolean {
				return player.milestones['dut2'];
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				let expReduce = new Decimal(1);
				if (player.hydra.dilute.inDilute)
					expReduce = expReduce.mul(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
				return x.root(expReduce).div(10).max(1).log(1.15).add(1).min(99).floor();
			}
			capped(x: Decimal): boolean {
				return x.add(this.more()).gte(99);
			}
		})(),
		'612': new (class B612 extends Buyable<Decimal> {
			description = '基础指数+0.01';
			cost(x: Decimal): Decimal {
				let base = new Decimal(10000).mul(x.pow(2).pow_base(1.05));
				if (player.upgrades[6110]) base = base.pow(upgrades[6110].effect());
				if (player.hydra.dilute.inDilute) {
					base = base.pow(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
				}
				return base;
			}
			name = 'B5-1-2';
			effect(x: Decimal): Decimal {
				let eff = x.add(this.more()).mul(0.01);
				if (player.upgrades[617]) eff = eff.mul(upgrades[617].effect());
				if (!player.upgrades[6112] && eff.gte(1.5)) eff = eff.sub(0.5).log10().add(1.5);
				return eff;
			}
			effectDescription(x: Decimal) {
				return '+' + format(this.effect(x));
			}
			currency: Currencies = Currencies.HYDRA_POWER;
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(1);
			}
			canBuyMax(): boolean {
				return player.milestones['dut2'];
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				let expReduce = new Decimal(1);
				if (player.hydra.dilute.inDilute)
					expReduce = expReduce.mul(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
				if (player.upgrades[6110]) expReduce = expReduce.mul(upgrades[6110].effect());
				return x.root(expReduce).div(10000).max(1).log(1.05).root(2).add(1).floor();
			}
			more(): Decimal {
				let base = new Decimal(0);
				if (player.upgrades[615]) base = base.add(upgrades[615].effect());
				return base;
			}
		})(),
		'613': new (class B613 extends Buyable<Decimal> {
			description = '乘数获取速度×1.1';
			cost(x: Decimal): Decimal {
				let base = new Decimal(1e8).mul(x.pow(2.5).pow_base(1.02));
				if (player.upgrades[6110]) base = base.pow(upgrades[6110].effect());
				if (player.hydra.dilute.inDilute) {
					base = base.pow(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
				}
				return base;
			}
			name = 'B5-1-3';
			effect(x: Decimal): Decimal {
				return x.pow_base(1.1);
			}
			effectDescription(x: Decimal) {
				return 'x' + format(this.effect(x));
			}
			currency: Currencies = Currencies.HYDRA_POWER;
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(1);
			}
			canBuyMax(): boolean {
				return player.milestones['dut2'];
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				let expReduce = new Decimal(1);
				if (player.upgrades[6110]) expReduce = expReduce.mul(upgrades[6110].effect());
				if (player.hydra.dilute.inDilute)
					expReduce = expReduce.mul(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
				return x.root(expReduce).div(1e8).max(1).log(1.02).root(2.5).add(1).floor();
			}
		})(),
		'614': new (class B614 extends Buyable<Decimal> {
			description = '九头蛇能量软上限^0.9';
			cost(x: Decimal): Decimal {
				let base = new Decimal('1e875').mul(x.pow(2.35).pow_base(1e20));
				if (player.upgrades[6110]) base = base.pow(upgrades[6110].effect());
				if (player.hydra.dilute.inDilute) {
					base = base.pow(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
				}
				return base;
			}
			name = 'B5-1-4';
			effect(x: Decimal): Decimal {
				return x.pow_base(0.9);
			}
			effectDescription(x: Decimal) {
				return '^' + format(this.effect(x));
			}
			currency: Currencies = Currencies.HYDRA_POWER;
			show(): boolean {
				return Dilute.diluteAmount(6) || Hydra.pUnlock(3);
			}
			canBuyMax(): boolean {
				return player.milestones['dut2'];
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				let expReduce = new Decimal(1);
				if (player.upgrades[6110]) expReduce = expReduce.mul(upgrades[6110].effect());
				if (player.hydra.dilute.inDilute)
					expReduce = expReduce.mul(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
				return x.root(expReduce).div('1e875').max(1).log(1e20).root(2.35).add(1).floor();
			}
		})(),
	},
	deduceSpeed(i = 0): Decimal {
		//推演的速度
		let base = new Decimal(0);
		if (i == 0 && player.upgrades[61]) base = new Decimal(1);
		if (i == 0 && player.upgrades[611]) base = base.mul(upgrades[611].effect());
		if (i == 0) base = base.mul(buyables[611].effect(player.buyables[611]));
		if (player.upgrades[612]) base = base.mul(2);
		base = base.mul(Hydra.prestigeEff(0));
		if (player.buyables['62R'].gte(1))
			base = base.mul(buyables['62R'].effect(player.buyables['62R']));
		if (player.upgrades[65] && Dilute.diluteAmount(3) <= 0)
			base = base.mul(Hydra.NT4TauEffect());
		base = base.mul(Dilute.solutionEff().eff1);
		if(player.upgrades['62S']) base = base.mul(upgrades['62S'].effect());
		if (player.upgrades["63S"]) base = base.mul(upgrades['63S'].effect());
		if(player.upgrades['64S']) base = base.mul(upgrades['64S'].effect());
		if (player.milestones.dut5) base = base.pow(player.hydra.milestoneDut5Eff)

		if (Dilute.diluteAmount(5) > 0) base = base.pow(1 - (Dilute.diluteAmount(5) * 0.1));
		if (Dilute.diluteAmount(3) > 0)
			base = base.mul(Hydra.NT4TauEffect());
		base = base.div(5 ** (Dilute.diluteAmount(0) as number));
		if (player.hydra.dilute.inDilute)
			base = base.div(
				Array.from({ length: 6 }, (_, index: number) =>
					Dilute.diluteAmount(index as IntClosedRange<0, 5>),
				).reduce((total, num) => total + num, 1) ** 2,
			);
		return base.div(10);
	},
	deduceEff(i = 0): Decimal {
		//推演一位提高的乘数
		let base = new Decimal(0.001);
		if (Hydra.pUnlock(1)) base = base.mul(buyables[613].effect(player.buyables[613]));
		base = base.mul(Hydra.prestigeEff(2));
		if (i == 0 && player.upgrades[614]) base = base.mul(upgrades[614].effect());

		base = base.div(5 ** (Dilute.diluteAmount(0) as number));
		return base;
	},
	basePower(): Decimal {
		return player.hydra.powerMult[0].mul(
			player.hydra.powerMult[1].mul(player.hydra.powerMult[2].mul(player.hydra.powerMult[3])),
		);
	},
	powerExp(): Decimal {
		//能量指数
		let base = new Decimal(1);
		base = base.add(Hydra.prestigeEff(1));
		if (Hydra.pUnlock(1)) base = base.add(buyables[612].effect(player.buyables[612]));
		if (player.upgrades['6111']) base = base.mul(upgrades['6111'].effect());
		return base;
	},
	powerExpNerf(): Decimal {
		//软上限
		if (player.upgrades['6111'] || Hydra.powerExp().lt(4)) return new Decimal(1);
		let nerf = Hydra.powerExp().div(4).root(4).pow(-1);
		if (player.buyables[614].add(buyables[614]?.more?.()).gte(0))
			nerf = nerf.pow(buyables[614].effect(player.buyables[614]));
		if (player.upgrades[619]) nerf = nerf.pow(upgrades[619].effect());
		return nerf;
	},
	powerExtraMult(): Decimal {
		//能量倍数
		let base = new Decimal(1);
		base = base.mul(Hydra.prestigeEff(0));
		return base;
	},
	powerGain(): Decimal {
		//能量产量
		if (Dilute.diluteAmount(7) && player.hydra.dilute.spentTime > 5) return new Decimal(0);
		const base = this.powerGainBase();
		return this.powerGainAfterSoftcap(base);
	},
	powerGainAfterSoftcap(base: Decimal): Decimal {
		if (base.gte('e2400'))
			base = base
				.log10()
				.log10()
				.log10()
				.div(0.528943841769672644)
				.root(10)
				.mul(0.528943841769672644)
				.pow10()
				.pow10()
				.pow10();
		return base;
	},
	powerSoftcapNerf(base: Decimal): Decimal {
		if (!base.gte('e2400')) return new Decimal(1);
		else return this.powerGainAfterSoftcap(base).log(base);
	},
	powerGainBase(): Decimal {
		//能量产量
		let base = Hydra.basePower();
		base = base.mul(Hydra.powerExtraMult());
		base = base.pow(Hydra.powerExp().mul(Hydra.powerExpNerf()));
		return base;
	},
	pUnlock(id = 0): boolean {
		if (Dilute.diluteAmount(6)) return false;
		//解锁转生
		if (id != 3 && Hydra.pUnlock(id + 1)) return true;
		if (id == 0) return player.hydra.prestige[0].gt(0) || Hydra.basePower().gte(2);
		else if (id == 1)
			return player.hydra.prestige[1].gt(0) || Hydra.prestigeEff(0, true).gte(20);
		else if (id == 2)
			return player.hydra.prestige[2].gt(0) || Hydra.prestigeEff(1, true).gte(1);
		else if (id == 3)
			return player.hydra.prestige[3].gt(0) || Hydra.prestigeEff(2, true).gte(1e10);
		return false;
	},
	pMaxUnlock() {
		for (let i = 0; i < 4; i++) {
			if (this.pUnlock(i)) continue;
			return i;
		}
		return 4;
	},
	pAutoUnlock(id = 0): boolean {
		//解锁自动化
		if (Dilute.diluteAmount(6)) return false;
		if (id == 0 && player.milestones['dut3']) return true
		if (id == 0) return Hydra.pUnlock(2);
		else if (id == 1) return Hydra.pUnlock(3);
		else return false;
	},
	pAutoThreshold(id = 0): any {
		//推演阈值
		if (id == 0)
			return {
				add: (player.upgrades[66] || player.milestones['dut3'])
					? new Decimal(0)
					: new Decimal(10).div(player.hydra.totalPower.log10().root(2).sub(10).max(1)),
				mul: (player.upgrades[66] || player.milestones['dut3'])
					? new Decimal(1)
					: new Decimal(5).div(player.hydra.totalPower.log10().root(10).max(1).min(5)),
			};
		else if (id == 1)
			return {
				add: player.upgrades[66]
					? new Decimal(0)
					: new Decimal(0.2).div(player.hydra.totalPower.log10().root(10).sub(1).max(1)),
				mul: player.upgrades[66] ? new Decimal(1) : new Decimal(1),
			};
		else return { add: new Decimal(0), mul: new Decimal(1) };
	},
	prestigeBase(id = 0): Decimal {
		if (id == 0) return Hydra.basePower();
		else return Hydra.prestigeEff(id - 1, true);
		return new Decimal(0);
	},
	prestigeEff(id = 0, preview = false, relative = false): Decimal {
		if (relative) {
			return this.prestigeEff(id, true).div(this.prestigeEff(id, false));
		}
		if (Dilute.diluteAmount(6)) {
			if (id == 0) return new Decimal(1);
			if (id == 3) return new Decimal(1);
			if (id == 1) return new Decimal(0);
			if (id == 4) return new Decimal(0);
		}
		let num = new Decimal(0);
		if (!preview) num = player.hydra.prestige[id];
		else num = Hydra.prestigeBase(id);
		let base = new Decimal(0);
		const U618Eff = player.upgrades[618] && id != 3 ? upgrades[618].effect() : new Decimal(1);
		if (id == 0)
			base = num.max(1).pow(0.3).mul(num.add(2).log(2)).pow(Hydra.prestigeEff(3).add(1));
		else if (id == 1) {
			if (player.upgrades[613])
				base = num.max(1).log10().mul(4).root(2).div(4).sub(0.389).max(0).mul(2.5);
			else base = num.div(2).max(1).log10().mul(4).root(2).div(4).sub(0.4).max(0).mul(2.5);
		} else if (id == 2)
			base = num
				.pow(3)
				.mul(num.max(1).add(1).log(2))
				.pow_base(5)
				.pow(Hydra.prestigeEff(3).add(1));
		else if (id == 3) base = num.max(1e10).log10().div(10).sub(1);
		if (id == 0 && base.gte(100))
			base = base.div(100).root(new Decimal(1.5).pow(U618Eff)).mul(100);
		if (id == 0 && base.gte(1e25)) base = base.log10().div(25).root(2).mul(25).pow_base(10);
		if (id == 1 && base.gte(1)) base = base.root(new Decimal(2).pow(U618Eff));
		if (id == 1 && base.gte(2.25)) base = base.div(2.25).root(2).mul(2.25);
		if (id == 2 && base.gte(1e10)) base = base.log10().div(10).pow(0.5).mul(10).pow_base(10);
		if (id == 3 && player.upgrades['65R']) base = base.mul(upgrades['65R'].effect());
		if (id == 1 && player.upgrades['68R']) base = base.mul(upgrades['68R'].effect());
		if (id == 3 && base.gte(0.05)) base = base.sub(0.05).mul(0.5).add(0.05);
		if (id == 3 && base.gte(0.1)) base = base.div(0.1).pow(0.5).mul(0.1);
		return base;
	},
	deduce(i = 0, bulk = new Decimal(0)): void {
		player.hydra.deduceOrdinal[i] = player.hydra.deduceOrdinal[i].add(bulk);
		player.hydra.totalDeduceOrdinal[i] = player.hydra.totalDeduceOrdinal[i].add(bulk);
	},
	prestige(i = 0): void {
		if (!Hydra.pUnlock(i)) return;
		if (!Hydra.prestigeEff(i, true).gt(Hydra.prestigeEff(i, false))) return;
		let keepHP = false,
			keepO = false;
		player.hydra.prestige[i] = player.hydra.prestige[i].max(Hydra.prestigeBase(i));
		if (i == 0 && player.milestones['dut3']) return;
		if (i <= 3 && player.upgrades[65]) return;
		if (i == 0 && player.upgrades[64]) return;
		if(i == 0 && player.milestones['dut3']) return;
		if (i <= 1 && player.upgrades[63]) keepHP = true;
		if (i == 2 && player.upgrades[64]) keepHP = true;
		if (i == 0 && player.upgrades[63]) keepO = true;
		if (i == 1 && player.upgrades[64]) keepO = true;
		for (let j = 0; j < 4; j++) {
			Hydra.hydraReset(j);
			if (!keepO) player.hydra.powerMult[j] = new Decimal(1);
		}
		for (let j = 0; j < i; j++) player.hydra.prestige[j] = new Decimal(0);
		if (!keepHP) player.hydra.power = new Decimal(0);
	},
	hydraUpdate(diff = 0): void {
		if (Dilute.diluteAmount(8)) diff /= 1000;
		for (let i = 0; i < 4; i++) {
			player.hydra.deduceProgress[i] = player.hydra.deduceProgress[i].add(
				Hydra.deduceSpeed(i).mul(diff),
			);
			if (player.hydra.deduceProgress[i].gte(1)) {
				const bulk = player.hydra.deduceProgress[i].floor();
				player.hydra.deduceProgress[i] = player.hydra.deduceProgress[i].sub(bulk);
				Hydra.deduce(i, bulk);
			}
		}
		if (player.upgrades[62]) {
			let NT4Boost = new Decimal(1);
			if (player.upgrades[65]) NT4Boost = NT4Boost.mul(Hydra.NT4TauEffect());
			player.hydra.power = player.hydra.power.add(
				Hydra.hydraPowerPassiveGeneration().mul(diff),
			); // 已经加速过了，不用再写一遍
			player.hydra.totalPower = player.hydra.totalPower.add(
				Hydra.hydraPowerPassiveGeneration().mul(diff),
			);
			player.hydra.trueTotalPower = player.hydra.trueTotalPower.add(
				Hydra.hydraPowerPassiveGeneration().mul(diff),
			);
			player.hydra.powerMult[0] = player.hydra.powerMult[0].add(
				Hydra.deduceEff(0)
					.mul(player.hydra.deduceOrdinal[0])
					.mul(upgrades[62].effect())
					.mul(diff)
					.mul(NT4Boost),
			);
		}
		for (let i = 0; i < 4; i++) {
			if (player.hydra.pAuto[i] && Hydra.pAutoUnlock(i)) {
				if (
					Hydra.prestigeEff(i, true)
						.sub(Hydra.prestigeEff(i, false))
						.gte(Hydra.pAutoThreshold(i).add)
				) {
					if (
						Hydra.prestigeEff(i, true)
							.div(Hydra.prestigeEff(i, false))
							.gte(Hydra.pAutoThreshold(i).mul)
					) {
						Hydra.prestige(i);
					}
				}
			}
		}
	},
	hydraReset(i = 0): void {
		if (player.hydra.deduceOrdinal[player.hydra.visiting].eq(0)) return;
		player.hydra.powerMult[i] = player.hydra.powerMult[i].add(
			Hydra.deduceEff(i).mul(player.hydra.deduceOrdinal[i]),
		);
		const gain = Hydra.powerGain();
		player.hydra.power = player.hydra.power.add(gain);
		player.hydra.totalPower = player.hydra.totalPower.add(gain);
		player.hydra.trueTotalPower = player.hydra.trueTotalPower.add(gain);
		player.hydra.deduceProgress[player.hydra.visiting] = new Decimal(0);
		player.hydra.deduceOrdinal[player.hydra.visiting] = new Decimal(0);
	},
	hydraPowerPassiveGeneration() {
		if (!player.upgrades[62]) return new Decimal(0);
		const gain = Hydra.powerGain();
		let passive = upgrades[62].effect();
		if (player.upgrades[65]) passive = passive.mul(Hydra.NT4TauEffect());
		return gain.mul(passive);
	},
	hydraMilestone: [
		[
			['\\omega', new Decimal(4)],
			['\\omega^2', new Decimal(5)],
			['\\omega^\\omega', new Decimal(8)],
			['\\varepsilon_0', new Decimal(4).pow(2)],
			['\\zeta_0', new Decimal(4).pow(3)],
			['\\psi(\\Omega_2)', new Decimal(4).pow(4)],
			['\\psi(\\Omega_2\\psi_{\\Omega_2}(\\Omega_2))', new Decimal(4).pow(8)],
			['\\psi(\\Omega_2^2)', new Decimal(4).pow(16)],
			['\\psi(\\Omega_2^{\\psi_{\\Omega_2}(\\Omega_2^2))})', new Decimal(4).pow(32)],
			['\\psi(\\Omega_2^{\\Omega_2})', new Decimal(4).pow(64)],
			['\\psi(\\Omega_2^{\\Omega_2^{\\psi_{\\Omega_2}(\\Omega_2^2)}})', Decimal.pow(4, 81)],
			['\\psi(\\Omega_3)', new Decimal(4).pow(4 ** 4)],
			['\\psi(\\Omega_3\\cdot \\Omega_2)', new Decimal(4).pow(4 ** 5)],
			['\\psi(\\Omega_3\\psi_{\\Omega_2}(\\Omega_3))', new Decimal(4).pow(262144)],
			['\\psi(\\Omega_3\\psi_{\\Omega_2}(\\Omega_3\\psi_{\\Omega_2}(\\Omega_3)))', new Decimal(4).pow(2**28)],
			['\\psi(\\Omega_3^2)', new Decimal(4).pow(4 ** 16)],
			['\\psi(\\Omega_3^{Ω_3})', new Decimal(4).pow(4 ** 64)],
			['\\psi(\\Omega_\\omega)', new Decimal(4).tetrate(4)],
			['???', new Decimal(1e400)],
		],
		[],
		[],
		[],
	],
	NT4TauEffect() {
		let eff = feature.OrdinalNT.varComputed('tau', 4);
		if (Dilute.diluteAmount(3) > 0) return eff.recip().min(1);
		if (player.upgrades['64R']) eff = eff.pow(10);
		return eff;
	},
};