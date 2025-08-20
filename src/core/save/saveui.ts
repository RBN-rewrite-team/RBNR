import ModalService from '@/utils/Modal';
import { changeSave, current_save, hardReset, loadFromString, readSaveDetail } from '.';
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
		content: '这将完全重置你的存档，其他槽位存档不会被重置。',
		onConfirm() {
			hardReset();
			clearInterval(saveInterval);
		},
	});
}

export function UIChangeSave() {
	ModalService.show({
		title: '切换存档',
		component: saveslot_display,
	});
}
