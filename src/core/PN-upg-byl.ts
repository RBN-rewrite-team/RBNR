import PowiainaNum from 'powiaina_num.js';
import { player } from './save';
import { decreaseCurrency, getCurrency, PNCurrencies } from './pn-currencies';
export class PNUpgrade {
	name: string = 'U3-114514';
	show() {
		return true;
	}
	capped(x: PowiainaNum) {
		return false;
	}
	cost: PowiainaNum | (() => PowiainaNum) = new PowiainaNum(1 / 0);
	canAfford() {
		return true;
	}
	postBuy() {}
	currency: PNCurrencies = PNCurrencies.CHARGED_HYDRA_ENERGY;
}
export class PNBuyable {
	name: string = 'U3-114514';
	show() {
		return true;
	}
	capped(x: PowiainaNum) {
		return false;
	}
	cost(x: PowiainaNum) {
		return new PowiainaNum(Infinity);
	}
	canAfford() {
		return true;
	}
	canBuyMax() {
		return false;
	}
	postBuyMax() {}
	postBuy() {}
	costInverse(res: PowiainaNum) {
		return new PowiainaNum(0);
	}
	currency: PNCurrencies = PNCurrencies.CHARGED_HYDRA_ENERGY;
}
export const pnupgrades = {
	'631': new (class extends PNUpgrade {
		name = 'test';
	})(),
} as const;
export const pnbuyables = {
	'631': new PNBuyable(),
} as const;
export const PN_UPGRADES = {
	/**
	 * 判断页面显示逻辑用的函数
	 * @param id 升级的id
	 * @returns 一个对象，字段show是这个函数是否显示，unlocked是是否解锁，字段reach是是否达到解锁要求
	 */
	lock(id: keyof typeof pnupgrades) {
		let reach: { [key: string]: boolean } = {},
			flag = true;
		let a = pnupgrades[id].show();
		if (pnupgrades[id].name.startsWith('U5-3-') && player.retribution >= 3) {
			a = false;
		}
		return { show: a, unlocked: flag, reach: reach };
	},
	/**
	 * 购买一个函数
	 * @param id 升级的id
	 */
	buy(id: keyof typeof pnupgrades) {
		if (!player.pnupgrades[id] && this.lock(id).unlocked && pnupgrades[id].canAfford()) {
			const cost =
				typeof pnupgrades[id].cost === 'function'
					? pnupgrades[id].cost()
					: pnupgrades[id].cost;
			if (cost.lte(getCurrency(pnupgrades[id].currency))) return;
			decreaseCurrency(pnupgrades[id].currency, cost);
			player.pnupgrades[id] = true;
		}
	},
};
export const BUYABLES = {
	lock(id: keyof typeof pnbuyables) {
		let reach: { [key: string]: boolean } = {},
			flag = true;
		const a = pnbuyables[id].show();
		return { show: a, unlocked: flag, reach: reach };
	},
	buy(id: keyof typeof pnbuyables) {
		if (
			!pnbuyables[id].capped(player.pnbuyables[id]) &&
			this.lock(id).unlocked &&
			pnbuyables[id].cost(player.pnbuyables[id]).lte(getCurrency(pnbuyables[id].currency)) &&
			pnbuyables[id].canAfford()
		) {
			if (pnbuyables[id].canBuyMax != null && pnbuyables[id].canBuyMax()) {
				pnbuyables[id].postBuyMax();
				player.pnbuyables[id] = PowiainaNum.max(
					player.pnbuyables[id],
					pnbuyables[id].costInverse(getCurrency(pnbuyables[id].currency)),
				);
			} else {
				pnbuyables[id].postBuy();
				decreaseCurrency(
					pnbuyables[id].currency,
					pnbuyables[id].cost(player.pnbuyables[id]),
				);
				player.pnbuyables[id] = player.pnbuyables[id].add(1);
			}
		}
	},
};
