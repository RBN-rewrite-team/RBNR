import ModalService from '@/utils/Modal';
import { player } from '../save';
import { Dilute } from '../hydra/dilute';
import Decimal from 'break_eternity.js';

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
		player.upgrades['61S'] = false;
		player.upgrades['62S'] = false;
		player.upgrades['63S'] = false;
		player.upgrades['64S'] = false;
		player.upgrades['65S'] = false;
		player.upgrades['66S'] = false;
		player.upgrades['67S'] = false;
		player.upgrades['68S'] = false;
		player.upgrades['69S'] = false;
		player.upgrades['610S'] = false;
		player.upgrades['611S'] = false;
		player.upgrades['612S'] = false;
		player.upgrades['613S'] = false;
		player.upgrades['614S'] = false;
		player.upgrades['615S'] = false;
		player.upgrades['616S'] = false;
		for (let i = 1; i <= 18; i++) {
			player.milestones[`dut${i}`] = false;
		}
		player.hydra.milestoneDut5Eff = new Decimal(1);
		player.hydra.pAuto = [!1, !1, !1, !1];
		player.hydra.dilute.solvent = [0, 0, 0, 0, 0, 0, !1, !1, !1];
		player.hydra.dilute.lastSolvent = [0, 0, 0, 0, 0, 0, !1, !1, !1];
		player.hydra.dilute.lastDeduce = new Decimal(0);
		player.hydra.dilute.prions = new Decimal(0);
		player.hydra.dilute.inDilute = false;
		player.hydra.dilute.spentTime = 0;
		player.hydra.dilute.solutionCost = 0;
		player.hydra.dilute.solution = 0;
		player.hydra.dilute.highestApocalypse = new Decimal(0);
	},
	resetable() {
		return (
			player.hydra.deduceOrdinal[0].gte('ee153.90699754796802') &&
			player.hydra.totalPower.gte('e326649') &&
			player.hydra.dilute.solution >= 2.5e8
		);
	},
};
