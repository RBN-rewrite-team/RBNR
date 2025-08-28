import Decimal from 'break_eternity.js';
import type { SingleChallenge } from '../challenge';
import { Dilute } from '../hydra/dilute';
import { player } from '../save';
import { formatWhole, format } from '@/utils/format';

export const NONREC_CHALS: SingleChallenge[] = [
	{
		name: '突变',
		get descEasy() {
			return (
				'锁定在[10,0.4667+完成次数,10,10,10,9,true,false,false]中。溶剂2影响稀释升级。保留U5-S-9，但是你不免疫朊病毒，朊病毒增益反转且在你第一次推演后以100*10^完成次数倍每秒的速度增长，如果朊病毒超越你的推演次数，朊病毒重置为1并进行一次稀释级别的重置。<br>奖励：在非递归挑战1外使朊病毒增长速度×' +
				format(player.challenges[1][0].pow_base(4)) +
				'，首次完成使朊病毒以ln(x)^0.5幂次增益九头蛇能量获取'
			);
		},
		get descHard() {
			return this.descEasy;
		},
		loop() {
			player.hydra.dilute.inDilute = true;
			player.hydra.dilute.solvent = [
				10,
				0.4667 + Number(player.challenges[1][0]),
				10,
				10,
				10,
				9,
				!0,
				!1,
				!1,
			];
			if (Dilute.prions().sub(1).gte(player.hydra.deduceOrdinal[0])) {
				Dilute.diluteReset();
				player.hydra.dilute.prions = new Decimal(1);
			}
			if (
				player.hydra.power.gte(
					new Decimal(326649).pow(player.challenges[1][0].add(1)).pow10(),
				)
			) {
				player.challengein = [-1, -1];
				player.challenges[1][0] = player.challenges[1][0].add(1).min(5);
			}
		},
		canEnter() {
			return player.nonrecu.studies_bought.includes(5);
		},
	},
	{
		name: '能量折叠',
		get descEasy() {
			return '九头蛇能量的指数上限为log10(非递归能量+1)，额外乘数上限为10^(非递归能量^1/3)，推演乘数上限为10^(非递归能量^1/3)，九头蛇能量上限为(非递归能量+1)<br><span style="color: red">进入挑战将重置九头蛇溶液</span><br>奖励：首次完成时，九头蛇能量的二重软上限效果×80%，每次挑战完成使九头蛇能量指数^1.1(在二重软上限后)';
		},
		get descHard() {
			return this.descEasy;
		},
		loop() {
			if (
				player.hydra.dilute.solution >
				player.challenges[1][1].pow_base(10).mul(4e6).toNumber()
			) {
				player.challengein = [-1, -1];
				player.challenges[1][1] = player.challenges[1][1].add(1).min(5);
			}
		},
		canEnter() {
			return player.nonrecu.studies_bought.includes(11);
		},
	},
	{
		name: '强化稀释',
		get descEasy() {
			return '溶剂I的底数为20，溶剂III的时间/5，U5-S-14的最后一条效果无效，MD15无效，溶剂等级无法细化，溶剂VI的效果由 ^1-0.1x 变为 ^1-0.2x ，天启中全局速度变为1/1e(10*完成次数)。所有的九头蛇溶液额外倍率无效，公式升级亦无效。';
		},
		get descHard() {
			return this.descEasy;
		},
		canEnter() {
			return player.nonrecu.studies_bought.includes(12);
		},
	},
] as const;
