import ModalService from '@/utils/Modal';
import { currentPlayerLV } from '.';
import { meBattleInfo } from './battle';
import { player } from '../save';
import { roomSpawnPoint } from './spawnpoint';
import { getMessage } from '@/utils/i18n';

export function runDeath(innerText: string) {
	const skillgain = currentPlayerLV() ** 0.5 + 1;
	ModalService.show({
		title: getMessage('dung.death'),
		content: getMessage('dung.death.det', {
			a: innerText,
			b: skillgain.toFixed(3),
		}),
		// '你被' +
		// innerText +
		// '击杀，返回出生点并清空等级。获得了 ' +
		// skillgain.toFixed(3) +
		// ' 技能点。',
	});
	player.minigame.current_x = BigInt(roomSpawnPoint()[0]);
	player.minigame.current_y = BigInt(roomSpawnPoint()[1]);
	player.minigame.xp = 0;
	player.minigame.skillpoint += skillgain;
	player.minigame.hp = meBattleInfo().hpMax;
}
