import Decimal from 'break_eternity.js';
import {player, feature} from '@/core/global';
import {format, formatWhole} from '@/utils/format';
import { Currencies } from '../currencies';
import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { CurrencyRequirement, type Requirement } from '../requirements';
import { Buyable } from '../buyable';
import { upgrades, buyables } from '../mechanic';

//Hydra：BMS，1-Y，fffZ
export const Hydra = {
	upgrades: {
		'61': new (class U61 extends Upgrade {
			description = '启动BMS推演，基础速度0.1次/s，根据推演中的序数增益序数';
			cost = new Decimal(0);
			name = 'U5-1';
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'611': new (class U611 extends UpgradeWithEffect<Decimal> {
			description = '累计九头蛇能量提升BMS推演速度';
			cost = new Decimal(10);
			name = 'U5-1-1';
			effect(): Decimal {
				return player.hydra.totalPower.max(10).log10();
			}
			effectDescription(): string {
				return 'x' + format(this.effect());
			}
			currency: Currencies = Currencies.HYDRA_POWER;
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
				return Hydra.pUnlock(1);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'614': new (class U614 extends UpgradeWithEffect<Decimal> {
			description = '当前九头蛇能量提升BMS乘数获取';
			cost = new Decimal(1e15);
			name = 'U5-1-4';
			effect(): Decimal {
				let base = player.hydra.power.div(1e15).max(1).root(10);
				if(base.gte(1e100)) base = base.log10().div(100).pow(0.75).mul(100).pow_base(10);
				return base;
			}
			effectDescription(): string {
				return 'x' + format(this.effect());
			}
			show(): boolean {
				return Hydra.pUnlock(2);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
		'62': new (class U62 extends UpgradeWithEffect<Decimal> {
			description = '基于累计九头蛇能量，每秒获得一定重置时获取的九头蛇能量和乘数';
			cost = new Decimal(1e45);
			name = 'U5-2';
			show(): boolean {
				return Hydra.pUnlock(2);
			}
			currency: Currencies = Currencies.HYDRA_POWER;
			effectDescription() {
			  return `+${format(this.effect().mul(100))}%/s`
			}
			effect() {
			  return player.hydra.totalPower.max(1).log10().div(22.5)
			}
		})(),
	},
	buyables: {
		'611': new (class B611 extends Buyable<Decimal> {
			description = 'BMS推演速度×+1';
			cost(x: Decimal): Decimal {
				return new Decimal(10).mul(x.pow_base(1.15));
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
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.div(10)
					.max(1)
					.log(1.15)
					.add(1)
					.max(99)
					.floor();
			}
			capped(x: Decimal) {
				return x.add(this.more()).gte(99);
			}
		})(),
		'612': new (class B612 extends Buyable<Decimal> {
			description = '基础指数+0.01';
			cost(x: Decimal): Decimal {
				return new Decimal(10000).mul(x.pow(2).pow_base(1.05));
			}
			name = 'B5-1-2';
			effect(x: Decimal): Decimal {
				return x.mul(0.01);
			}
			effectDescription(x: Decimal) {
				return '+' + format(this.effect(x));
			}
			currency: Currencies = Currencies.HYDRA_POWER;
			show(): boolean {
				return Hydra.pUnlock(1);
			}
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.div(10000)
					.max(1)
					.log(1.05)
					.root(2)
					.add(1)
					.floor();
			}
		})(),
		'613': new (class B613 extends Buyable<Decimal> {
			description = '乘数获取速度×1.1';
			cost(x: Decimal): Decimal {
				return new Decimal(1e8).mul(x.pow(2.5).pow_base(1.02));
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
				return Hydra.pUnlock(1);
			}
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
				return x
					.div(1e8)
					.max(1)
					.log(1.02)
					.root(2.5)
					.add(1)
					.floor();
			}
		})(),
	},
	deduceSpeed(i = 0): Decimal { //推演的速度
		let base = new Decimal(0);
		if(i == 0 && player.upgrades[61]) base = new Decimal(0.1);
		if(i == 0 && player.upgrades[611]) base = base.mul(upgrades[611].effect());
		if(i == 0) base = base.mul(buyables[611].effect(player.buyables[611]));
		if(player.upgrades[612]) base = base.mul(2);
		base = base.mul(Hydra.prestigeEff(0));
		return base;
	},
	deduceEff(i = 0): Decimal { //推演一位提高的乘数
		let base = new Decimal(0.001);
		if(Hydra.pUnlock(1)) base = base.mul(buyables[613].effect(player.buyables[613]));
		base = base.mul(Hydra.prestigeEff(2));
		if(i == 0 && player.upgrades[614]) base = base.mul(upgrades[614].effect());
		return base;
	},
	basePower(): Decimal {
		return player.hydra.powerMult[0].mul(player.hydra.powerMult[1].mul(player.hydra.powerMult[2].mul(player.hydra.powerMult[3])));
	},
	powerExp(): Decimal { //能量指数
		let base = new Decimal(1);
		base = base.add(Hydra.prestigeEff(1));
		if(Hydra.pUnlock(1)) base = base.add(buyables[612].effect(player.buyables[612]));
		return base;
	},
	powerExtraMult(): Decimal { //能量倍数
		let base = new Decimal(1);
		base = base.mul(Hydra.prestigeEff(0));
		return base;
	},
	powerGain(): Decimal { //能量产量
		let base = Hydra.basePower();
		base = base.mul(Hydra.powerExtraMult());
		base = base.pow(Hydra.powerExp());
		return base;
	},
	pUnlock(id = 0): boolean { //解锁转生
		if(id != 3 && Hydra.pUnlock(id + 1)) return true;
		if(id == 0) return player.hydra.prestige[0].gt(0) || Hydra.basePower().gte(2);
		else if(id == 1) return player.hydra.prestige[1].gt(0) || Hydra.prestigeEff(0, true).gte(20);
		else if(id == 2) return player.hydra.prestige[2].gt(0) || Hydra.prestigeEff(1, true).gte(1);
		return false;
	},
	prestigeBase(id = 0): Decimal {
		if(id == 0) return Hydra.basePower();
		else return Hydra.prestigeEff(id - 1, true);
		return new Decimal(0);
	},
	prestigeEff(id = 0, preview = false, relative=false): Decimal {
		if (relative) {
			return this.prestigeEff(id, true).div(this.prestigeEff(id, false));
		}
		let num = new Decimal(0);
		if(!preview) num = player.hydra.prestige[id];
		else num = Hydra.prestigeBase(id);
		let base = new Decimal(0);
		if(id == 0) base = num.max(1).pow(0.3).mul(num.add(2).log(2));
		else if(id == 1)
		{
			if(player.upgrades[613]) base = num.max(1).log10().mul(4).root(2).div(4).sub(0.389).max(0).mul(2.5);
			else base = num.div(2).max(1).log10().mul(4).root(2).div(4).sub(0.4).max(0).mul(2.5);
		}
		else if(id == 2) base = num.pow(3).mul(num.max(1).add(1).log(2)).pow_base(5);
		if(id == 0 && base.gte(100)) base = base.div(100).root(1.5).mul(100);
		if(id == 1 && base.gte(1)) base = base.root(2);
		if(!preview) return base;
		else return base.max(Hydra.prestigeEff(id, false));
	},
	deduce(i = 0, bulk = new Decimal(0)): void {
		player.hydra.deduceOrdinal[i] = player.hydra.deduceOrdinal[i].add(bulk);
	},
	prestige(i = 0): void {
		if(!Hydra.pUnlock(i)) return;
		if(!Hydra.prestigeEff(i, true).gt(Hydra.prestigeEff(i, false))) return;
		player.hydra.prestige[i] = player.hydra.prestige[i].max(Hydra.prestigeBase(i));
		for(let j = 0;j < 4;j++)
		{
			Hydra.hydraReset(j);
			player.hydra.powerMult[j] = new Decimal(1);
		}
		for(let j = 0;j < i;j++) player.hydra.prestige[j] = new Decimal(0);
		player.hydra.power = new Decimal(0);
	},
	hydraUpdate(diff = 0): void {
		for(let i = 0;i < 4;i++)
		{
			player.hydra.deduceProgress[i] = player.hydra.deduceProgress[i].add(Hydra.deduceSpeed(i).mul(diff));
			if(player.hydra.deduceProgress[i].gte(1))
			{
				let bulk = player.hydra.deduceProgress[i].floor();
				player.hydra.deduceProgress[i] = player.hydra.deduceProgress[i].sub(bulk);
				Hydra.deduce(i, bulk);
			}
		}
		if (player.upgrades[62]) {
		  player.hydra.power = player.hydra.power.add(Hydra.hydraPowerPassiveGeneration().mul(diff))
		  player.hydra.totalPower = player.hydra.totalPower.add(Hydra.hydraPowerPassiveGeneration().mul(diff))
			player.hydra.powerMult[0] = player.hydra.powerMult[0].add(Hydra.deduceEff(0).mul(player.hydra.deduceOrdinal[0]).mul(upgrades[62].effect()).mul(diff));
		}
	},
	hydraReset(i = 0): void {
		if(player.hydra.deduceOrdinal[player.hydra.visiting].eq(0)) return;
		player.hydra.powerMult[i] = player.hydra.powerMult[i].add(Hydra.deduceEff(i).mul(player.hydra.deduceOrdinal[i]));
		let gain = Hydra.powerGain();
		player.hydra.power = player.hydra.power.add(gain);
		player.hydra.totalPower = player.hydra.totalPower.add(gain);
		player.hydra.deduceProgress[player.hydra.visiting] = new Decimal(0);
		player.hydra.deduceOrdinal[player.hydra.visiting] = new Decimal(0);
	},
	hydraPowerPassiveGeneration() {
	  let gain = Hydra.powerGain()
	  let passive = upgrades[62].effect()
	  return gain.mul(passive)
	},
	
	hydraMilestone: [
		[
			['\\omega', new Decimal(4)],
			['\\omega^2', new Decimal(5)],
			['\\omega^\\omega', new Decimal(8)],
			['\\epsilon_0', new Decimal(4).pow(2)],
			['\\zeta_0', new Decimal(4).pow(3)],
			['\\psi(\\Omega_2)', new Decimal(4).pow(4)],
			['\\psi(\\Omega_2\\psi_{\\Omega_2}(\\Omega_2))', new Decimal(4).pow(8)],
			['\\psi(\\Omega_2^2)', new Decimal(4).pow(16)],
			['\\psi(\\Omega_2^2\\psi_{\\Omega_2}(\\Omega_2))', new Decimal(4).pow(20)],
			['\\psi(\\Omega_2^2\\psi_{\\Omega_2}(\\Omega_2^2))', new Decimal(4).pow(32)],
			['\\psi(\\Omega_2^3)', new Decimal(4).pow(64)],
			['\\psi(\\Omega_3)', new Decimal(4).pow(4 ** 4)],
			['\\psi(\\Omega_\\omega)', new Decimal(4).tetrate(4)],
			['???', new Decimal(1e400)],
		],
		[],
		[],
		[],
	],
};
