import { currentPlayerLV, getWorldLevel } from '.';
import { deepCopy, player } from '../save';

interface BattleInfo {
	hp: number;
	atk: number;
	def: number;
	xp?: number;
	hpMax?: number;
	m_hp_debuff?: number;
	m_atk_debuff?: number;
}
interface BattleStatus {
	hp_after_battle: number;
	status: 'fail' | 'win';
}
export function runBattleFast(me: BattleInfo, enemy: BattleInfo): BattleStatus {
	let m = deepCopy(me);
	let e = deepCopy(enemy);
	let m_atk = m.atk - e.def;
	let e_atk = e.atk - m.def;
	let m_atkt = Math.ceil((m.hp * (e.m_hp_debuff ?? 1)) / e_atk);
	let e_atkt = Math.ceil(e.hp / (m_atk * (e.m_atk_debuff ?? 1)));
	// me first.
	// m_atkt > e_atkt =
	// 0 0
	// 0 1
	// 1 1
	if (m_atkt < e_atkt) {
		return {
			hp_after_battle: 0,
			status: 'fail',
		};
	} else {
		return {
			hp_after_battle: m.hp - e_atk * (e_atkt - 1),
			status: 'win',
		};
	}
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
	} else if(type == 3) {
		return {
			hp: 7.5 * tier,
			atk: 5 * tier,
			def: 2 * tier,
			xp: 2 * tier,
			m_hp_debuff: 0.98,
			m_atk_debuff: 0.98,
		};
	} else if(type == 4) {
		return {
			hp: 15 * tier,
			atk: 4.5 * tier,
			def: 4 * tier,
			xp: 3 * tier,
			m_hp_debuff: 0.99,
			m_atk_debuff: 0.95,
		};
	} else if(type == 5) {
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
	return {
		hp: player.minigame.hp,
		hpMax: 10 * currentPlayerLV(),
		atk: 5 * currentPlayerLV(),
		def: 0,
	};
}
