import ModalService from '@/utils/Modal';
import {
	changeSave,
	current_save,
	hardReset,
	loadFromString,
	player,
	readSaveDetail,
	save as s,
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
					loadFromString(save, true);
					s();
					location.reload();
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
			'这将完全重置你的存档，其他槽位存档不会被重置。<br>下面的输入框可以选择保持哪些游戏数据<br>1:保留地下城,2:保留设置,4:保留时间碎片,8:保留剧情观看记录；请将您需要的保留项对应值全部相加后输入框内。留空或输入值为非正数时结果无效',
		fields: [
			{
				type: 'input',
				placeholder: '',
			},
		],
		onConfirm(values) {
			const v = Number(values[0]);
			let keylistKeeped: Array<keyof Player> = [];
			let isValid = true;
			if (v <= 0 || isNaN(v)) isValid = false;
			if (isValid) {
				if ((v & 0b1) === 0b1) keylistKeeped.push('minigame');
				if ((v & 0b10) === 0b10) keylistKeeped.push('options');
				if ((v & 0b100) === 0b100) keylistKeeped.push('timeshard');
				if ((v & 0b1000) === 0b1000) keylistKeeped.push('checkedPlots');
			}
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
					return 0 <= Number(val) && Number(val) <= 20;
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
			if (values[0] == '测试码') {
				player.achievements.push(-2);
				return;
			}
			localStorage.testcode = values[0].slice(0, 25);
		},
	});
}
