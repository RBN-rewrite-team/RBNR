import { Currencies } from '@/core/currencies';
import { player } from '@/core/global';
import { Upgrade, UpgradeWithEffect } from '@/core/upgrade';
import Decimal from 'break_eternity.js';
import { format } from '@/utils/format';

export const NRBUpgrades = {
	'81': new (class extends Upgrade {
		name = 'U7-1';
		cost = new Decimal(100);
		currency: Currencies = Currencies.NRB_DEDUCTION;
	})(),
	'82': new (class extends UpgradeWithEffect<Decimal> {
		name = 'U7-2';
		cost = new Decimal(200);
		currency: Currencies = Currencies.NRB_DEDUCTION;
		effect(): Decimal {
			return player.pt.nonrecBMS.deduce.clampMin(10).log10();
		}
		effectDescription(values: Decimal): string {
			return '×' + format(values);
		}
	})(),
	'83': new (class extends UpgradeWithEffect<number> {
		name = 'U7-3';
		cost = new Decimal(400);
		currency: Currencies = Currencies.NRB_DEDUCTION;
		effect(): number {
			let a = player.pt.nonrecBMS.deduce.clampMin(10).log10().mul(5);

			if (a.gte(20)) {
				a = a.div(20).pow(3).mul(20);
			}
			return a.clampMax('1e100').toNumber();
		}
		effectDescription(values: number): string {
			return '+' + format(values) + '%';
		}
	})(),
	'84': new (class extends UpgradeWithEffect<Decimal> {
		name = 'U7-4';
		cost = new Decimal(1145.14);
		currency: Currencies = Currencies.NRB_DEDUCTION;
		effect(): Decimal {
			return player.pt.totalPower.log10().mul(0.4);
		}
		effectDescription(values: Decimal): string {
			return '×' + format(values) + '';
		}
	})(),
} as const satisfies {
	[key: string]: Upgrade;
};
