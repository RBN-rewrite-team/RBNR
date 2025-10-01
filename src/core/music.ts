import ModalService from '@/utils/Modal';
import { player } from './save';

let audioelement = document.getElementById('audio');

export const MUSICS = [
	'https://cdn.glitch.com/03a4b67b-6f18-4f6d-8d37-50a18fb615c8%2FGoing%20Down%20by%20Jake%20Chudnow%20%5BHD%5D.mp3?v=1581538237884',
] as const;
export const MUSIC_TEXT = ['None', 'Going Down by Jake Chudnow', '自定义'];
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
export function setMusicUrlAndPlay() {
	ModalService.show({
		title: '输入URL地址',
		content: '请输入音乐的URL地址',
		fields: [
			{
				type: 'input',
				placeholder: 'URL地址',
			},
		],
		onConfirm(values: string[]) {
			player.options.music = MUSICS.length + 1;

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
