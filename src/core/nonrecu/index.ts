import ModalService from '@/utils/Modal';
import { player } from '../save';
import { Dilute } from '../hydra/dilute';

export const NON_RECURSIVE = {
	reset() {
		if (!import.meta.env.DEV) {
			ModalService.show({
				title: 'WIP!',
				content: 'Work in progress!',
			});
			return;
		}
		Dilute.diluteReset();
		player.hydra.dilute.highestApocalypse;
	},
	resetable() {
		return (
			player.hydra.deduceOrdinal[0].gte('ee153.90699754796802') &&
			player.hydra.dilute.solution >= 1e7
		);
	},
};
