import ModalService from '@/utils/Modal';
import {
	changeSave,
	current_save,
	hardReset,
	loadFromString,
	readSaveDetail,
	type Player,
} from '.';
import { saveInterval } from '@/core/game-loop';
import saveslot_display from './saveslot_display';

export function UILoadSaveFromFile() {
	const a = document.createElement('input');
	a.setAttribute('type', 'file');
	a.setAttribute('accepted', '.txt');
	a.click();
	a.onchange = () => {
		const fr = new FileReader();
		if (a.files == null) return void alert('未选择文件');
		fr.onload = () => {
			const save = fr.result;
			if (typeof save == 'string') {
				try {
					loadFromString(save);
				} catch {
					console.error('Cannot load saves from string');
				}
			} else {
				console.error("The file doesn't loaded");
			}
		};
		fr.readAsText(a.files[0]);
	};
}

export function UIHardReset() {
	ModalService.show({
		title: '硬重置?',
		content:
			'这将完全重置你的存档，其他槽位存档不会被重置。<br>下面的输入框可以选择保持哪些游戏数据<br>1,3,5,7:保留地下城;2,3,6,7:保留设置;4,5,6,7:保留时间碎片',
		fields: [
			{
				type: 'input',
				placeholder: '',
			},
		],
		onConfirm(values) {
			const v = Number(values[0]);
			let keylistKeeped: Array<keyof Player> = [];
			if ([1, 3, 5, 7].includes(v)) keylistKeeped.push('minigame');
			if ([2, 3, 6, 7].includes(v)) keylistKeeped.push('options');
			if ([4, 5, 6, 7].includes(v)) keylistKeeped.push('timeshard');
			hardReset(keylistKeeped);
			clearInterval(saveInterval);
		},
	});
}

export function UIChangeSave() {
	ModalService.show({
		title: '切换存档',
		component: saveslot_display,
		fields: [
			{
				type: 'input',
				placeholder: '槽位',
				validation(val) {
					return 0 <= Number(val) && Number(val) <= 10;
				},
			},
		],
		onConfirm(values) {
			if (!isNaN(Number(values[0]))) {
				console.log(values[0]);
				changeSave(Number(values[0]));
			}
		},
	});
}

export function UIEnterTesting() {
	ModalService.show({
		title: '输入测试码',
		fields: [
			{
				type: 'input',
				placeholder: '输入测试码',
				validation(val) {
					return true;
				},
			},
		],
		onConfirm(values) {
			localStorage.testcode = values[0].slice(0, 25);
		},
	});
}
