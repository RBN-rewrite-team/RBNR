import Decimal from 'break_eternity.js';
import type { SingleChallenge } from '../challenge';
import { Dilute } from '../hydra/dilute';
import { player } from '../save';

export const NONREC_CHALS: SingleChallenge[] = [
	{
		name: '突变',
		descEasy:
			'锁定在[10,10,10,10,10,9.75,true,true,false]中。保留U5-S-9，但是你不免疫朊病毒，朊病毒增益反转且在你第一次推演后以100*10^完成次数倍每秒的速度增长，如果朊病毒超越你的推演次数，朊病毒重置为1并进行一次稀释级别的重置。',
		descHard:
			'锁定在[10,10,10,10,10,9.75,true,true,false]中。保留U5-S-9，但是你不免疫朊病毒，朊病毒增益反转且在你第一次推演后以100*10^完成次数倍每秒的速度增长，如果朊病毒超越你的推演次数，朊病毒重置为1并进行一次稀释级别的重置。',
		loop() {
			player.hydra.dilute.inDilute = true;
			player.hydra.dilute.solvent = [10, 10, 10, 10, 10, 9.75, !0, !0, !1];
			if (Dilute.prions().sub(1).gte(player.hydra.deduceOrdinal[0])) {
				Dilute.diluteReset();
				player.hydra.dilute.prions = new Decimal(1);
			}
		},
	},
] as const;
