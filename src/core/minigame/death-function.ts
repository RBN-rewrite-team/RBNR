import ModalService from '@/utils/Modal';
import { currentPlayerLV } from '.';
import { getPlayerCurrentMap } from './room';
import { meBattleInfo } from './battle';
import { player } from '../save';

export function runDeath(innerText: string) {
	let skillgain = currentPlayerLV() ** 0.5 + 1;
	ModalService.show({
		title: '死亡',
		content:
			'你被' +
			innerText +
			'击杀，返回出生点并清空等级。获得了 ' +
			skillgain.toFixed(3) +
			' 技能点。',
	});
	player.minigame.current_x = BigInt(getPlayerCurrentMap().spawnpoint[0]);
	player.minigame.current_y = BigInt(getPlayerCurrentMap().spawnpoint[1]);
	player.minigame.hp = meBattleInfo().hpMax;
	player.minigame.xp = 0;
	player.minigame.skillpoint += skillgain;
}
