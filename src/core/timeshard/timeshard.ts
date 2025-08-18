import { player, feature } from '@/core/global';
import Decimal from 'break_eternity.js';
import { format, formatWhole } from '@/utils/format';

export const TimeShard = {
	generatorReceive(id = 0): void {
		let dn = Date.now();
		if (id == 0) {
			if (dn >= player.timeshard.cd[0]) {
				let r = Math.floor(Math.random() * 40) + 10;
				player.timeshard.value += r;
				player.timeshard.cd[0] = dn + 60 * 60 * 1000;
				player.timeshard.last[0] = r;
			}
		} else if (id == 1) {
			if (dn >= player.timeshard.cd[1]) {
				let r = Math.floor(Math.random() * 120) + 30;
				player.timeshard.value += r;
				player.timeshard.cd[1] = dn + 24 * 60 * 60 * 1000;
				player.timeshard.last[1] = r;
			}
		}
	},
	convert(minute = 0, mul = 1): void {
		if(player.timeshard.value < minute) return;
		player.timeshard.value -= minute;
		player.timeshard.tf += minute * 6e4 * mul;
	},
};
