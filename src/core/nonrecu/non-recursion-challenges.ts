import Decimal from 'break_eternity.js';
import type { SingleChallenge } from '../challenge';
import { Dilute } from '../hydra/dilute';
import { player } from '../save';
import { formatWhole, format } from '@/utils/format';
import { getNRC4Kept } from './studies';
import { Hydra } from '../hydra/hydra';

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
			let e = 0.4667 + Number(player.challenges[1][0]);
			if (player.upgrades['71']) e = 0.4667 + Number(player.challenges[1][0]) * 0.3;
			player.hydra.dilute.inDilute = true;
			player.hydra.dilute.solvent = [10, e, 10, 10, 10, 9, !0, !1, !1];
			if (Dilute.prions().sub(1).gte(player.hydra.deduceOrdinal[0])) {
				Dilute.diluteReset();
				player.hydra.dilute.prions = new Decimal(1);
			}
			if (
				player.hydra.power.gte(
					new Decimal(326649 ** player.challenges[1][0].add(1).toNumber())
						.pow10()
						.mul(0.99),
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
			if (player.hydra.dilute.solution.gte(player.challenges[1][1].pow_base(10).mul(4e6))) {
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
			return '溶剂I的底数为20，溶剂III的时间/5，U5-S-14的最后一条效果无效，MD15无效，溶剂等级无法细化，溶剂VI的效果由 ^1-0.1x 变为 ^1-(完成次数*0.2-0.2)x ，天启中全局速度变为1/1e(10*完成次数)。所有的九头蛇溶液额外倍率无效，公式升级亦无效。<br>奖励：如下。';
		},
		get descHard() {
			return this.descEasy;
		},
		canEnter() {
			return player.nonrecu.studies_bought.includes(12);
		},
		loop() {
			if (
				player.hydra.dilute.solution.gte(
					255000000 * 5 ** player.challenges[1][2].toNumber(),
				)
			) {
				player.challengein = [-1, -1];
				player.challenges[1][2] = player.challenges[1][2].add(1).min(5);
			}
		},
		effect(x): Decimal {
			return x.gt(0) ? x.mul(0.1).add(0.1) : new Decimal(0);
		},
		effD(x): string {
			return (
				'非递归能量以(1+ln(ln(x^10+1)^' +
				format(x) +
				'+1)/5)幂增推演速度指数，当前：^' +
				format(player.nonrecu.power.pow(10).add(1).ln().pow(x).add(1).ln().div(5).add(1))
			);
		},
	},
	{
		name: '反转研究',
		get descEasy() {
			return '挑战中你始终拥有前 2x-1 行研究，其效果完全反转(暂时只能进入第二次)<br>奖励：将非递归研究101的效果变为10%，基于完成次数增加非递归理论总量，前 2x-1 行非递归研究和购买本研究不再消耗任何东西';
		},
		get descHard() {
			return this.descEasy;
		},
		canEnter() {
			return player.nonrecu.studies_bought.includes(22) && player.challenges[1][3].lt(2);
		},
		loop() {
			player.nonrecu.studies_bought = [
				...new Set(
					player.nonrecu.studies_bought.concat(
						getNRC4Kept(player.challenges[1][3].toNumber()),
					),
				),
			];
			if (
				false &&
				player.hydra.power.gte(
					new Decimal(6 ** (player.challenges[1][3].toNumber() + 1))
						.pow_base(2)
						.sub(9)
						.pow_base(2)
						.pow10(),
				)
			) {
				player.challengein = [-1, -1];
				player.challenges[1][3] = player.challenges[1][3].add(1).min(5);
			}
		},
		effect(x): Decimal {
			return x.gt(0) ? x.mul(0.1).add(1) : new Decimal(1);
		},
		effD(x): string {
			return '×' + x;
		},
		onExit() {
			player.nonrecu.studies_bought = [];
			player.nonrecu.spentTheories = new Decimal(0);
		},
	},
	{
		name: '对数运算',
		get descEasy() {
			return '挑战中推演速度挑战中推演速度>10时=log10(log10(推演速度 max 10))+10,九头蛇溶液取以10为底对数，重置九头蛇溶液';
		},
		get descHard() {
			return this.descEasy;
		},
		canEnter() {
			return player.nonrecu.studies_bought.includes(22);
		},
		loop() {
			const highest = Hydra.deduceSpeedBMS();
			if (player.challenges[1][4].lt(highest)) {
				player.challenges[1][4] = highest;
			}
		},
	},
] as const;
