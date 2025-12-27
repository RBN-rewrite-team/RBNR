import { currencyName } from '@/core/currencies';
import { feature } from '@/core/global';
import { Dilute } from '@/core/hydra/dilute';
import { buyables, upgrades } from '@/core/mechanic';
import { player } from '@/core/save';
import type { Upgrade } from '@/core/upgrade';
import { wordShift } from '@/core/word-shift';
import { format } from '@/utils/format';
import { i18n } from '@/utils/i18n';
import { OrdinalUtils } from '@/utils/ordinal';
import type { $t } from '@/utils/types';

export function getUpgradeDescription(upgid: keyof typeof upgrades, $t: $t) {
	if (upgid == '517') {
		if (i18n.global.locale.value == 'zh-CN') {
			return player.upgrades['516']
				? '访问九头蛇Hydra'
				: //                            Access 9 head snake Hydra
					wordShift.randomCrossWords('A   s  9 h  d s   e H   a', 0.9, false) +
						player.lastUpdated.toString().repeat(0);
		}
		return player.upgrades['516']
			? 'Access Hydra'
			: wordShift.randomCrossWords('访问九头蛇', 0.9, true) +
					player.lastUpdated.toString().repeat(0);
	}
	return $t(`upgs.${upgid}`);
}
export function actualCost(id: keyof typeof upgrades) {
	const curupg = upgrades[id];
	let cost = typeof curupg.cost === 'function' ? curupg.cost() : curupg.cost;
	if (
		player.hydra.dilute.inDilute &&
		id.startsWith('6') &&
		(!id.endsWith('S') || player.challengein[0] == 1)
	) {
		cost = cost.pow(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
	}
	return cost;
}
export function costHTML(id: keyof typeof upgrades, $t: $t) {
	const curupg = upgrades[id];
	return $t('upg.cost', {
		cost:
			id == 'sing1'
				? 'ω+4'
				: curupg.ordinal
					? OrdinalUtils.numberToOrdinal(actualCost(id), feature.Ordinal.base())
					: format(actualCost(id)),
		currency: currencyName(curupg.currency, $t),
	});
}
export function costHTMLBYL(id: keyof typeof buyables, $t: $t) {
	const curupg = buyables[id];
	return $t('upg.cost', {
		cost: curupg.ordinal
			? OrdinalUtils.numberToOrdinal(curupg.cost(player.buyables[id]), feature.Ordinal.base())
			: format(curupg.cost(player.buyables[id])),
		currency: currencyName(curupg.currency, $t),
	});
}
