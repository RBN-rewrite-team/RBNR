import type Decimal from 'break_eternity.js';
import { currencyName, getCurrency, type Currencies } from './currencies';
import { format } from '@/utils/format';
import { upgrades } from './mechanic';
import { player } from './save';
import type { $t } from '@/utils/types';

export enum RequirementTypes {
	REQUIRE_CURRENCY,
	REQUIRE_UPGRADES,
	FUNCTION,
}

export abstract class Requirement {
	reachedReq(): boolean {
		return false;
	}
	reqDescription($t: $t): string {
		return '获得一个拜谢';
	}
	progress?(): [string, string] {
		return ['114514', '1919810'];
	}
}

export class CurrencyRequirement extends Requirement {
	currency: Currencies;
	cost: Decimal;
	reachedReq() {
		return getCurrency(this.currency).gte(this.cost);
	}
	reqDescription($t: $t): string {
		return $t('req.res', {
			cost: format(this.cost),
			currency: currencyName(this.currency),
		});
	}
	progress(): [string, string] {
		return [`${format(getCurrency(this.currency))}`, `${format(this.cost)}`];
	}
	constructor(currency: Currencies, cost: Decimal) {
		super();
		this.currency = currency;
		this.cost = cost;
	}
}

export class UpgradeRequirement extends Requirement {
	upgid: keyof typeof upgrades;
	reachedReq(): boolean {
		return player.upgrades[this.upgid];
	}
	reqDescription($t: $t): string {
		return $t('req.upg', {
			upg: upgrades[this.upgid].name,
		});
	}
	progress = undefined;
	constructor(upgid: keyof typeof upgrades) {
		super();
		this.upgid = upgid;
	}
}
