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
	'85': new (class extends UpgradeWithEffect<Decimal> {
		name = 'U7-5';
		cost = new Decimal(8500);
		currency: Currencies = Currencies.NRB_DEDUCTION;
		effect(): Decimal {
			return player.pt.nonrecBMS.deduce.pow(0.8).clampMin(1);
		}
		effectDescription(values: Decimal): string {
			return '×' + format(values) + '';
		}
	})(),
	'86': new (class extends Upgrade {
		name = 'U7-6';
		cost = new Decimal(114514);
		currency: Currencies = Currencies.NRB_DEDUCTION;
	})(),
	'87': new (class extends UpgradeWithEffect<Decimal> {
		name = 'U7-7';
		cost = new Decimal(250000);
		currency: Currencies = Currencies.NRB_DEDUCTION;
		effect(): Decimal {
			return player.hydra.compressedPower.clampMin(10).slog().pow(0.5);
		}
		effectDescription(values: Decimal): string {
			return '×' + format(values) + '';
		}
	})(),
	'88': new (class extends Upgrade {
		name = 'U7-8';
		cost = new Decimal('1f15');
		currency: Currencies = Currencies.COMP_HYDRA;
	})(),
} as const satisfies {
	[key: string]: Upgrade;
};
