import Decimal from 'break_eternity.js';
import { player, feature } from '@/core/global';
import { format, formatMult, formatWhole } from '@/utils/format';
import { Currencies, getCurrency } from '../currencies';
import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { CurrencyRequirement, type Requirement } from '../requirements';
import { Buyable } from '../buyable';
import { upgrades, buyables } from '../mechanic';

export const TimeShard = {
	generatorReceive(id = 0): void {
		const dn = Date.now();
		if (id == 0) {
			if (dn >= player.timeshard.cd[0]) {
				const r = Math.floor(Math.random() * 40) + 10;
				player.timeshard.value = player.timeshard.value.add(player.timeshard.next[0]);
				player.timeshard.cd[0] = dn + 60 * 60 * 1000;
				player.timeshard.last[0] = player.timeshard.next[0];
				player.timeshard.next[0] = r;
			}
		} else if (id == 1) {
			if (dn >= player.timeshard.cd[1]) {
				const r = Math.floor(Math.random() * 320) + 80;
				player.timeshard.value = player.timeshard.value.add(player.timeshard.next[1]);
				player.timeshard.cd[1] = dn + 24 * 60 * 60 * 1000;
				player.timeshard.last[1] = player.timeshard.next[1];
				player.timeshard.next[1] = r;
			}
		} else if (id == 2) {
			if (dn >= player.timeshard.cd[2]) {
				const r = Math.floor(Math.random() * 4000) + 1000;
				player.timeshard.value = player.timeshard.value.add(player.timeshard.next[2]);
				player.timeshard.cd[2] = dn + 7 * 24 * 60 * 60 * 1000;
				player.timeshard.last[2] = player.timeshard.next[2];
				player.timeshard.next[2] = r;
			}
		}
	},
	convert(minute = 0, mul = 1): void {
		if (player.timeshard.value.lt(minute)) return;
		player.timeshard.value = player.timeshard.value.sub(minute);
		player.timeshard.tf = player.timeshard.tf.add(minute * 6e4 * mul);
	},

	upgrades: {
		ts01: new (class extends Upgrade {
			description = () =>
				player.stat.chapter == 0
					? 'x1.5后继批量'
					: '<span style="color: red; font-weight: bold">(需要在第0章)</span>';
			cost = new Decimal(20);
			name = '第0章加速包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 0;
			}
		})(),
		ts02: new (class extends Upgrade {
			description = 'x1.5后继批量';
			cost = new Decimal(30);
			name = '第0章永久包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 0;
			}
		})(),
		ts03: new (class extends Upgrade {
			description = () =>
				player.stat.chapter == 0
					? 'x2后继批量'
					: '<span style="color: red; font-weight: bold">(需要在第0章)</span>';
			cost = new Decimal(60);
			name = '第0章超级加速包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 0;
			}
		})(),
		ts11: new (class extends Upgrade {
			description = () =>
				player.stat.chapter == 1
					? 'x1.5加法能量'
					: '<span style="color: red; font-weight: bold">(需要在第1章)</span>';
			cost = new Decimal(30);
			name = '第1章加速包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 1;
			}
		})(),
		ts12: new (class extends Upgrade {
			description = 'x1.5加法能量';
			cost = new Decimal(45);
			name = '第1章永久包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 1;
			}
		})(),
		ts13: new (class extends Upgrade {
			description = () =>
				player.stat.chapter == 1
					? 'x2加法能量'
					: '<span style="color: red; font-weight: bold">(需要在第1章)</span>';
			cost = new Decimal(90);
			name = '第1章超级加速包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 1;
			}
		})(),
		ts21: new (class extends Upgrade {
			description = () =>
				player.stat.chapter == 2
					? 'x2乘法能量'
					: '<span style="color: red; font-weight: bold">(需要在第2章)</span>';
			cost = new Decimal(50);
			name = '第2章加速包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 2;
			}
		})(),
		ts22: new (class extends Upgrade {
			description = 'x2乘法能量';
			cost = new Decimal(75);
			name = '第2章永久包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 2;
			}
		})(),
		ts23: new (class extends Upgrade {
			description = () =>
				player.stat.chapter == 2
					? 'x3乘法能量'
					: '<span style="color: red; font-weight: bold">(需要在第2章)</span>';
			cost = new Decimal(150);
			name = '第2章超级加速包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 2;
			}
		})(),
		ts_auto_pkg_hydra: new (class extends Upgrade {
			description = '获得自动机hydra包，可以使用include hydra;导入';
			cost = new Decimal(1000);
			name = '自动机hydra包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return (player.firstResetBit & 0b10000) == 0b10000;
			}
		})(),
		ts_auto_pkg_nonrec: new (class extends Upgrade {
			description = '获得自动机nonrec包，可以使用include nonrec;导入';
			cost = new Decimal(1000);
			name = '自动机nonrec包';
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.pt.resetTimes.gte(1);
			}
		})(),
	} as const,
};
