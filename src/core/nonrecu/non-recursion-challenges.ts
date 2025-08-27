import Decimal from 'break_eternity.js';
import type { SingleChallenge } from '../challenge';
import { Dilute } from '../hydra/dilute';
import { player } from '../save';
import { format } from '@/utils/format';

export const NONREC_CHALS: SingleChallenge[] = [
	{
		name: '突变',
		descEasy:
			'锁定在[10,0.4667+完成次数,10,10,10,9,true,false,false]中。溶剂2影响稀释升级。保留U5-S-9，但是你不免疫朊病毒，朊病毒增益反转且在你第一次推演后以100*10^完成次数倍每秒的速度增长，如果朊病毒超越你的推演次数，朊病毒重置为1并进行一次稀释级别的重置。',
		descHard:
			'锁定在[10,0.4667+完成次数,10,10,10,9,true,false,false]中。溶剂2影响稀释升级。保留U5-S-9，但是你不免疫朊病毒，朊病毒增益反转且在你第一次推演后以100*10^完成次数倍每秒的速度增长，如果朊病毒超越你的推演次数，朊病毒重置为1并进行一次稀释级别的重置。',
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
		effect(x): Decimal {
		    return x.pow_base(4);
		},
		effD(x): string {
		    return '朊病毒以ln(ln(x+1)+1)幂增九头蛇能量指数，且朊病毒增速×' + format(x);
		} 
	},
] as const;
