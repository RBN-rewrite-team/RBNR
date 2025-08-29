import { deepCopy, player } from '../save';

interface BattleInfo {
	hp: number;
	atk: number;
	def: number;
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
			hp_after_battle: m.hp - e_atk * (m_atkt - 1),
			status: 'win',
		};
	}
}

export function guardBattleInfo(tier: number): BattleInfo {
	return {
		hp: 5 * tier,
		atk: 3 * tier,
		def: 1,
	};
}

export function meBattleInfo(): BattleInfo {
	return {
		hp: player.minigame.hp,
		atk: 5,
		def: 0,
	};
}
