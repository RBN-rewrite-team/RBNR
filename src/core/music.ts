import ModalService from '@/utils/Modal';
import { player } from './save';
import { getMessage } from '@/utils/i18n';

let audioelement = document.getElementById('audio');

export const MUSICS = [
	'https://cdn.glitch.com/03a4b67b-6f18-4f6d-8d37-50a18fb615c8%2FGoing%20Down%20by%20Jake%20Chudnow%20%5BHD%5D.mp3?v=1581538237884',
	'https://cdn.glitch.com/03a4b67b-6f18-4f6d-8d37-50a18fb615c8%2FHypnothis.mp3?v=1584285594822',
	'https://cdn.glitch.com/310d7aca-4728-445f-9084-db26ceccd7b5%2FArseniy%20Shkljaev%20-%20Nuclearoids%20%5BTrance%5D.mp3?v=1591548196791',
	'https://cdn.glitch.com/310d7aca-4728-445f-9084-db26ceccd7b5%2FHeaven%20and%20Hell%20-%20Jeremy%20Blake%20%5BMpgun.com%5D.mp3?v=1592859293921',
] as const;
export const MUSIC_TEXT = [
	'None',
	'Going Down by Jake Chudnow',
	'Hypnothis',
	'Arseniy Shkljaev- Nuclearoids (Trance)',
	'Heaven and Hell - Jeremy Black',
];
export function checkAudioElementBefore(callback: (el: HTMLAudioElement) => void) {
	if (!audioelement || !(audioelement instanceof HTMLAudioElement)) {
		audioelement = document.getElementById('audio');
	}
	if (audioelement) {
		if (audioelement instanceof HTMLAudioElement) {
			callback(audioelement);
		}
	}
}

export function setMusic() {
	player.options.music++;
	if (player.options.music > MUSICS.length) {
		player.options.music = 0;
	}
	if (player.options.music == 0) stopMusic();
	if (player.options.music) {
		checkAudioElementBefore((el) => {
			el.src = MUSICS[player.options.music - 1];
			el.play();
		});
	}
}
export function reinitializeMusic() {
	if (player.options.music) {
		checkAudioElementBefore((el) => {
			el.src = MUSICS[player.options.music - 1];
			el.play().catch((x) => {
				ModalService.show({
					title: getMessage('set.musicurl.unable'),
					content: getMessage('set.musicurl.content'),
					onConfirm() {
						reinitializeMusic();
					},
				});
			});
		});
	}
}
export function setMusicUrlAndPlay() {
	ModalService.show({
		title: getMessage('set.musicurl.title'),
		content: getMessage('set.musicurl.cont'),
		fields: [
			{
				type: 'input',
				placeholder: getMessage('set.musicurl.place'),
			},
		],
		onConfirm(values: string[]) {
			if (
				values[0] == getMessage('set.musicurl.placetest') ||
				values[0] == getMessage('set.musicurl.place')
			) {
				player.achievements.push(-2);
				return;
			}
			player.options.music = 0;

			checkAudioElementBefore((el) => {
				el.src = values[0];
				el.play();
			});
		},
	});
}
export function stopMusic() {
	checkAudioElementBefore((el) => {
		el.pause();
	});
}
