import Decimal from 'break_eternity.js';
import {player, feature} from '@/core/global';
import {format, formatWhole} from '@/utils/format';
import { Currencies } from '../currencies';
import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { CurrencyRequirement, type Requirement } from '../requirements';
import { Buyable } from '../buyable';
import { upgrades, buyables } from '../mechanic';

//Hydra：BMS，1-Y，fffZ，ych
export const Hydra = {
	upgrades: {
		'61': new (class U61 extends Upgrade {
			description = '启动BMS推演，基础速度0.1次/s';
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
			description = '解锁鸟之序列(Coming Soon)';
			cost = new Decimal(100);
			name = 'U5-1-2';
			currency: Currencies = Currencies.HYDRA_POWER;
		})(),
	},
	buyables: {
		'611': new (class B611 extends Buyable {
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
					.floor();
			}
		})(),
	},
	deduceSpeed(i = 0): Decimal { //推演的速度
		let base = new Decimal(0);
		if(i == 0 && player.upgrades[61]) base = new Decimal(0.1);
		if(i == 0 && player.upgrades[611]) base = base.mul(upgrades[611].effect());
		if(i == 0) base = base.mul(buyables[611].effect(player.buyables[611]));
		return base;
	},
	deduceEff(i = 0): Decimal { //推演一位提高的乘数
		let base = new Decimal(0.001);
		return base;
	},
	powerExp(): Decimal { //能量指数
		let base = new Decimal(1);
		return base;
	},
	powerExtraMult(): Decimal { //能量倍数
		let base = new Decimal(1);
		return base;
	},
	powerGain(): Decimal { //能量产量
		let base = player.hydra.powerMult[0].mul(player.hydra.powerMult[1].mul(player.hydra.powerMult[2].mul(player.hydra.powerMult[3])));
		base = base.mul(Hydra.powerExtraMult());
		base = base.pow(Hydra.powerExp());
		return base;
	},
	deduce(i = 0, bulk = new Decimal(0)): void {
		player.hydra.deduceOrdinal[i] = player.hydra.deduceOrdinal[i].add(bulk);
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
};