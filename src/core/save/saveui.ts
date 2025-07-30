import ModalService from '@/utils/Modal';
import { hardReset, loadFromString } from '.';
import { saveInterval } from '@/core/game-loop';

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
		content: '!?!?!?',
		onConfirm() {
			hardReset();
			clearInterval(saveInterval);
		},
	});
}
