import ModalService from '@/utils/Modal';
import { player } from '../save';

export const NON_RECURSIVE = {
	reset() {
		ModalService.show({
			title: 'WIP!',
			content: 'Work in progress!',
		});
	},
	resetable() {
		return player.hydra.deduceOrdinal[0].gte('ee153.90699754796802');
	},
};
