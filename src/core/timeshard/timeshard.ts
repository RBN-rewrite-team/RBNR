import { player, feature } from '@/core/global';
import Decimal from 'break_eternity.js';
import { format, formatWhole } from '@/utils/format';

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
};
