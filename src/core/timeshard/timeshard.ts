import Decimal from 'break_eternity.js';
import { player } from '@/core/global';
import { Currencies } from '../currencies';
import { Upgrade } from '../upgrade';

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
				
				player.oracle.vowCoe = player.oracle.vowCoe.sub(5).max(20);
			}
		} else if (id == 1) {
			if (dn >= player.timeshard.cd[1]) {
				const r = Math.floor(Math.random() * 320) + 80;
				player.timeshard.value = player.timeshard.value.add(player.timeshard.next[1]);
				player.timeshard.cd[1] = dn + 24 * 60 * 60 * 1000;
				player.timeshard.last[1] = player.timeshard.next[1];
				player.timeshard.next[1] = r;
				
				player.oracle.vowCoe = player.oracle.vowCoe.sub(25).max(20);
			}
		} else if (id == 2) {
			if (dn >= player.timeshard.cd[2]) {
				const r = Math.floor(Math.random() * 4000) + 1000;
				player.timeshard.value = player.timeshard.value.add(player.timeshard.next[2]);
				player.timeshard.cd[2] = dn + 7 * 24 * 60 * 60 * 1000;
				player.timeshard.last[2] = player.timeshard.next[2];
				player.timeshard.next[2] = r;
				
				player.oracle.vowCoe = player.oracle.vowCoe.sub(125).max(20);
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
			cost = new Decimal(20);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 0;
			}
		})(),
		ts02: new (class extends Upgrade {
			cost = new Decimal(30);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 0;
			}
		})(),
		ts03: new (class extends Upgrade {
			cost = new Decimal(60);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 0;
			}
		})(),
		ts11: new (class extends Upgrade {
			cost = new Decimal(30);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 1;
			}
		})(),
		ts12: new (class extends Upgrade {
			cost = new Decimal(45);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 1;
			}
		})(),
		ts13: new (class extends Upgrade {
			cost = new Decimal(90);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 1;
			}
		})(),
		ts21: new (class extends Upgrade {
			cost = new Decimal(50);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 2;
			}
		})(),
		ts22: new (class extends Upgrade {
			cost = new Decimal(75);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 2;
			}
		})(),
		ts23: new (class extends Upgrade {
			cost = new Decimal(150);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.stat.chapter >= 2;
			}
		})(),
		ts_auto_pkg_hydra: new (class extends Upgrade {
			description = '获得自动机hydra包，可以使用include hydra;导入';
			cost = new Decimal(1000);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return (player.firstResetBit & 0b10000) == 0b10000;
			}
		})(),
		ts_auto_pkg_nonrec: new (class extends Upgrade {
			description = '获得自动机nonrec包，可以使用include nonrec;导入';
			cost = new Decimal(1000);
			currency: Currencies = Currencies.TIME_SHARD;
			show(): boolean {
				return player.pt.resetTimes.gte(1);
			}
		})(),
	} as const,
};
