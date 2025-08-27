import Decimal from 'break_eternity.js';
import type { SingleChallenge } from '../challenge';
import { Dilute } from '../hydra/dilute';
import { player } from '../save';
import { formatWhole, format } from '@/utils/format';

export const NONREC_CHALS: SingleChallenge[] = [
	{
		name: '突变',
		get descEasy() {
			return '锁定在[10,0.4667+完成次数,10,10,10,9,true,false,false]中。溶剂2影响稀释升级。保留U5-S-9，但是你不免疫朊病毒，朊病毒增益反转且在你第一次推演后以100*10^完成次数倍每秒的速度增长，如果朊病毒超越你的推演次数，朊病毒重置为1并进行一次稀释级别的重置。<br>奖励：在非递归挑战1外使朊病毒增长速度×'+format(player.challenges[1][0].pow_base(4))+"，首次完成使朊病毒以ln(x)^2幂次增益九头蛇能量获取"
		},
		get descHard() { return this.descEasy },
		loop() {
			player.hydra.dilute.inDilute = true;
			player.hydra.dilute.solvent = [10, 0.4667 + Number(player.challenges[1][0]), 10, 10, 10, 9, !0, !1, !1];
			if (Dilute.prions().sub(1).gte(player.hydra.deduceOrdinal[0])) {
				Dilute.diluteReset();
				player.hydra.dilute.prions = new Decimal(1);
			}
			if(player.hydra.power.gte('e326649'))
			{
			    player.challengein = [-1, -1];
			    player.challenges[1][0] = player.challenges[1][0].add(1).min(5);
			}
		},
		canEnter() {
		  return player.nonrecu.studies_bought.includes(5)
		}
	},
] as const;
