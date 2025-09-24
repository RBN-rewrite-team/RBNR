import { format } from '@/utils/format';
import { currentPlayerLV, getWorldLevel } from '.';
import { deepCopy, player } from '../save';

interface BattleInfo {
	hp: number;
	atk: number;
	def: number;
	xp?: number;
	hpMax?: number;
	/**
	 * 敌人对玩家HP造成的减益
	 */
	m_hp_debuff?: number;
	/**
	 * 敌人对玩家ATK造成的减益
	 */
	m_atk_debuff?: number;
}
interface BattleStatus {
	hp_after_battle: number;
	status: 'fail' | 'win';
}
/**
 * 进行战斗，me为玩家，enemy为敌人
 *
 * @returns 玩家在战斗后的属性
 *
 * @other This code is fixed by Deepseek
 */
export function runBattleFast(
	me: BattleInfo,
	enemy: BattleInfo,
): BattleStatus & {
	extendinfo: {
		hp_cost: number;
	};
} {
	// 应用debuff计算实际属性
	const actualMeHp = Math.floor(me.hp * (enemy.m_hp_debuff ?? 1));
	const actualMeAtk = Math.floor(me.atk * (enemy.m_atk_debuff ?? 1));

	// 计算每次攻击造成的伤害
	const meDamagePerAttack = Math.max(0, actualMeAtk - enemy.def);
	const enemyDamagePerAttack = Math.max(0, enemy.atk - me.def);

	// 初始化战斗状态
	let currentMeHp = actualMeHp;
	let currentEnemyHp = enemy.hp;

	// 记录总伤害（用于计算hp_cost）
	let totalDamageTaken = 0;

	// 回合制战斗：玩家先攻
	while (currentMeHp > 0 && currentEnemyHp > 0) {
		// 玩家攻击回合
		currentEnemyHp -= meDamagePerAttack;
		if (currentEnemyHp <= 0) {
			// 怪物死亡，玩家胜利
			const hpAfterBattle = currentMeHp;
			const hpCost = me.hp - hpAfterBattle + (me.hp - actualMeHp); // 战斗伤害 + debuff损失

			return {
				hp_after_battle: hpAfterBattle,
				status: 'win',
				extendinfo: {
					hp_cost: hpCost,
				},
			};
		}

		// 怪物攻击回合
		const damageThisRound = enemyDamagePerAttack;
		currentMeHp -= damageThisRound;
		totalDamageTaken += damageThisRound;

		if (currentMeHp <= 0) {
			// 玩家死亡，战斗失败
			const hpCost = me.hp; // 玩家死亡，消耗全部生命值

			return {
				hp_after_battle: 0,
				status: 'fail',
				extendinfo: {
					hp_cost: hpCost,
				},
			};
		}
	}

	// 理论上不会执行到这里，但为了类型安全
	return {
		hp_after_battle: 0,
		status: 'fail',
		extendinfo: {
			hp_cost: me.hp,
		},
	};
}

export function guardBattleInfo(tier: number, type = 1): Omit<Required<BattleInfo>, 'hpMax'> {
	tier = getWorldLevel();
	if (type == 1) {
		return {
			hp: 5 * tier,
			atk: 3 * tier,
			def: 1 * tier,
			xp: 1 * tier,
			m_hp_debuff: 1,
			m_atk_debuff: 1,
		};
	} else if (type == 2) {
		return {
			hp: 20 * tier,
			atk: 10 * tier,
			def: 5 * tier,
			xp: 5 * tier,
			m_hp_debuff: 0.9,
			m_atk_debuff: 0.9,
		};
	} else if (type == 3) {
		return {
			hp: 7.5 * tier,
			atk: 5 * tier,
			def: 2 * tier,
			xp: 2 * tier,
			m_hp_debuff: 0.98,
			m_atk_debuff: 0.98,
		};
	} else if (type == 4) {
		return {
			hp: 15 * tier,
			atk: 4.5 * tier,
			def: 4 * tier,
			xp: 3 * tier,
			m_hp_debuff: 0.99,
			m_atk_debuff: 0.95,
		};
	} else if (type == 5) {
		return {
			hp: 9 * tier,
			atk: 6 * tier,
			def: 2 * tier,
			xp: 3 * tier,
			m_hp_debuff: 0.9,
			m_atk_debuff: 1,
		};
	} else if (type == 6) {
		return {
			hp: 25 * tier,
			atk: 15 * tier,
			def: 5 * tier,
			xp: 10 * tier,
			m_hp_debuff: 0.85,
			m_atk_debuff: 0.85,
		};
	} else {
		return {
			hp: 1,
			atk: 0,
			def: -99999,
			xp: 0,
			m_hp_debuff: 1,
			m_atk_debuff: 1,
		};
	}
}
export function meBattleInfo(): BattleInfo & {
	hpMax: NonNullable<BattleInfo['hpMax']>;
} {
	let hpMax = 10;
	if (player.minigame.skilltree_bought.includes(2)) hpMax += 5;
	if (player.minigame.skilltree_bought.includes(5)) hpMax += 15;
	if (player.minigame.skilltree_bought.includes(8)) hpMax += 3;
	hpMax *= currentPlayerLV();
	if (player.minigame.skilltree_bought.includes(0)) hpMax += 2 * currentPlayerLV();
	if (player.minigame.skilltree_bought.includes(3)) hpMax *= 1.5;
	if (player.minigame.skilltree_bought.includes(6)) hpMax *= 1.5;

	let atk = 5;
	if (player.minigame.skilltree_bought.includes(1)) atk += 1;
	if (player.minigame.skilltree_bought.includes(7)) atk += 2;
	atk *= currentPlayerLV();
	if (player.minigame.skilltree_bought.includes(4)) hpMax *= 1.2;
	return {
		hp: player.minigame.hp,
		hpMax,
		atk,
		def: 0,
	};
}

/**
 * 计算需要提升多少生命值 玩家才能不死亡
 */
export function calculateRequiredHpIncrease(
	me: BattleInfo,
	enemy: BattleInfo,
): { requiredHp: number; isPossible: boolean; reason?: string } {
	// 应用debuff计算实际属性
	const actualMeAtk = Math.floor(me.atk * (enemy.m_atk_debuff ?? 1));
	const meDamagePerAttack = Math.max(0, actualMeAtk - enemy.def);
	const enemyDamagePerAttack = Math.max(0, enemy.atk - me.def);

	// 检查玩家是否能对怪物造成伤害
	if (meDamagePerAttack <= 0) {
		return {
			requiredHp: Infinity,
			isPossible: false,
			reason: `玩家不能通过提升生命值来打败敌人`,
		};
	}

	// 检查怪物是否能对玩家造成伤害
	if (enemyDamagePerAttack <= 0) {
		return {
			requiredHp: 0,
			isPossible: true,
			reason: '怪物无法对玩家造成伤害，玩家当前血量即可获胜',
		};
	}

	// 计算击败怪物需要的回合数
	const roundsToKillEnemy = Math.ceil(enemy.hp / meDamagePerAttack);

	// 计算在这些回合中玩家需要承受的伤害
	// 由于玩家先攻，怪物攻击次数 = roundsToKillEnemy - 1
	const totalDamageTaken = enemyDamagePerAttack * (roundsToKillEnemy - 1);

	// 计算考虑debuff后的实际所需血量
	const debuff = enemy.m_hp_debuff ?? 1;
	const requiredHpAfterDebuff = totalDamageTaken + 1; // +1 确保存活

	// 计算原始血量需求（考虑debuff前的血量）
	const requiredOriginalHp = Math.ceil(requiredHpAfterDebuff / debuff);

	// 计算需要增加的血量
	const currentOriginalHp = me.hp;
	const hpIncreaseNeeded = Math.max(0, requiredOriginalHp - currentOriginalHp);

	// 检查是否可能（防止数值过大或不合理）
	const isPossible = hpIncreaseNeeded < 1000000; // 设置一个合理的上限

	return {
		requiredHp: hpIncreaseNeeded,
		isPossible: isPossible,
		reason: isPossible
			? `玩家提升+${format(hpIncreaseNeeded)}点生命值就可以获胜`
			: `玩家所需生命值提升过大，需要+${format(hpIncreaseNeeded)}HP，通过提升生命值可能不可行`,
	};
}

export function calculateRequiredAtkIncrease(
	me: BattleInfo,
	enemy: BattleInfo,
): { requiredAtk: number; isPossible: boolean; reason?: string } {
	// 应用debuff计算实际属性
	const atkDebuff = enemy.m_atk_debuff ?? 1;
	const hpDebuff = enemy.m_hp_debuff ?? 1;

	const actualMeHp = Math.floor(me.hp * hpDebuff);
	const enemyDamagePerAttack = Math.max(0, enemy.atk - me.def);

	// 检查怪物是否能对玩家造成伤害
	if (enemyDamagePerAttack <= 0) {
		return {
			requiredAtk: 0,
			isPossible: true,
			reason: '怪物无法对玩家造成伤害，玩家当前攻击力即可获胜',
		};
	}

	// 检查玩家当前是否能对怪物造成伤害
	const currentMeDamage = Math.max(0, me.atk * atkDebuff - enemy.def);
	if (currentMeDamage <= 0) {
		// 玩家无法破防，需要先达到能造成伤害的水平
		const minAtkToDamage = Math.ceil((enemy.def + 1) / atkDebuff);
		const atkIncreaseNeeded = Math.max(0, minAtkToDamage - me.atk);

		// 继续计算破防后还需要多少攻击力才能获胜
		const meWithMinAtk = { ...me, atk: minAtkToDamage };
		const resultAfterBreakDef = calculateRequiredAtkAfterBreakDef(meWithMinAtk, enemy);

		if (!resultAfterBreakDef.isPossible) {
			return {
				requiredAtk: atkIncreaseNeeded,
				isPossible: false,
				reason: `玩家需要至少 +${format(atkIncreaseNeeded)} 点攻击力才能破防，但破防后仍无法获胜`,
			};
		}

		return {
			requiredAtk: atkIncreaseNeeded + resultAfterBreakDef.requiredAtk,
			isPossible: true,
			reason: `玩家需要提升 ${format(atkIncreaseNeeded)} 点攻击力破防，再提升 ${format(resultAfterBreakDef.requiredAtk)} 点就可以获胜`,
		};
	}

	return calculateRequiredAtkAfterBreakDef(me, enemy);
}

function calculateRequiredAtkAfterBreakDef(
	me: BattleInfo,
	enemy: BattleInfo,
): { requiredAtk: number; isPossible: boolean; reason?: string } {
	const atkDebuff = enemy.m_atk_debuff ?? 1;
	const hpDebuff = enemy.m_hp_debuff ?? 1;

	const actualMeHp = Math.floor(me.hp * hpDebuff);
	const enemyDamagePerAttack = Math.max(0, enemy.atk - me.def);
	const currentMeDamage = Math.max(0, me.atk * atkDebuff - enemy.def);

	// 计算玩家能够承受的最大怪物攻击回合数
	// 由于玩家先攻，怪物攻击次数 = 玩家攻击次数 - 1
	const maxMonsterAttackRounds = Math.floor(actualMeHp / enemyDamagePerAttack);

	// 玩家需要在这些回合内击败怪物
	// 需要的玩家攻击次数 = 怪物攻击次数 + 1
	const requiredPlayerAttackRounds = maxMonsterAttackRounds + 1;

	// 计算每次攻击需要造成的伤害
	const requiredDamagePerAttack = Math.ceil(enemy.hp / requiredPlayerAttackRounds);

	// 计算需要的原始攻击力（考虑debuff）
	const requiredActualAtk = requiredDamagePerAttack + enemy.def;
	const requiredOriginalAtk = Math.ceil(requiredActualAtk / atkDebuff);

	// 计算需要增加的攻击力
	const atkIncreaseNeeded = Math.max(0, requiredOriginalAtk - me.atk);

	// 检查可行性（设置一个合理的攻击力上限）
	const isPossible = atkIncreaseNeeded < 10000; // 合理的上限

	if (!isPossible) {
		return {
			requiredAtk: atkIncreaseNeeded,
			isPossible: false,
			reason: '所需攻击力提升过大，需要+' + format(atkIncreaseNeeded) + '，可能不可行',
		};
	}

	// 验证计算结果
	const verifiedMeDamage = Math.max(0, requiredOriginalAtk * atkDebuff - enemy.def);
	const actualRoundsToKill = Math.ceil(enemy.hp / verifiedMeDamage);
	const monsterAttackRounds = actualRoundsToKill - 1;
	const totalDamageTaken = monsterAttackRounds * enemyDamagePerAttack;

	if (totalDamageTaken >= actualMeHp) {
		return {
			requiredAtk: atkIncreaseNeeded + 1, // 保险起见多加1点
			isPossible: true,
			reason: `玩家需要提升 ${format(atkIncreaseNeeded)} 点攻击力（验证后建议增加 ${format(atkIncreaseNeeded + 1)} 点）`,
		};
	}

	return {
		requiredAtk: atkIncreaseNeeded,
		isPossible: true,
		reason: `玩家提升 ${format(atkIncreaseNeeded)} 点攻击力就可以获胜`,
	};
}
