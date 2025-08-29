import { currentPlayerLV } from '.';
import { deepCopy, player } from '../save';

interface BattleInfo {
	hp: number;
	atk: number;
	def: number;
	xp?: number;
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
	let m_atkt = Math.ceil(m.hp / e_atk);
	let e_atkt = Math.ceil(e.hp / m_atk);
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

export function guardBattleInfo(tier: number, type = 1): Required<BattleInfo> {
	if (type == 1) {
		return {
			hp: 5 * tier,
			atk: 3 * tier,
			def: 1,
			xp: 1,
		};
	} else {
		return {
			hp: 1,
			atk: 0,
			def: -99999,
			xp: 0,
		};
	}
}

export function meBattleInfo(): BattleInfo {
	return {
		hp: player.minigame.hp,
		atk: 5 * currentPlayerLV(),
		def: 0,
	};
}
