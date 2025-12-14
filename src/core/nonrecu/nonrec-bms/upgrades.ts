import { Currencies } from '@/core/currencies';
import { player } from '@/core/global';
import { Upgrade, UpgradeWithEffect } from '@/core/upgrade';
import Decimal from 'break_eternity.js';
import { format } from '@/utils/format';

export const NRBUpgrades = {
	'81': new (class extends Upgrade {
		name = 'U7-1';
		cost = new Decimal(10);
		currency: Currencies = Currencies.NRB_DEDUCTION;
	})(),
	'82': new (class extends UpgradeWithEffect<Decimal> {
		name = 'U7-2';
		cost = new Decimal(20);
		currency: Currencies = Currencies.NRB_DEDUCTION;
		effect(): Decimal {
			if (player.pt.nonrecBMS.deduce.lt(3000000))
				return player.pt.nonrecBMS.deduce.clampMin(10).log10();
			return player.pt.nonrecBMS.deduce.clampMin(1).pow(0.5);
		}
		effectDescription(values: Decimal): string {
			return '×' + format(values);
		}
	})(),
	'83': new (class extends UpgradeWithEffect<number> {
		name = 'U7-3';
		cost = new Decimal(50);
		currency: Currencies = Currencies.NRB_DEDUCTION;
		effect(): number {
			let a = player.pt.nonrecBMS.deduce.clampMin(10).log10().mul(5);

			if (a.gte(20)) {
				a = a.div(20).pow(3).mul(20);
			}

			a = a.clampMax(
				500 + player.pt.nonrecBMS.deduce.div(1e11).log10().pow(2).mul(5).toNumber(),
			);
			return a.clampMax(2000).toNumber();
		}
		effectDescription(values: number): string {
			return '+' + format(values) + '%';
		}
	})(),
	'84': new (class extends UpgradeWithEffect<Decimal> {
		name = 'U7-4';
		cost = new Decimal(92.0);
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
		cost = new Decimal(5000);
		currency: Currencies = Currencies.NRB_DEDUCTION;
		effect(): Decimal {
			return player.pt.nonrecBMS.deduce.pow(0.5).clampMin(1);
		}
		effectDescription(values: Decimal): string {
			return '×' + format(values) + '';
		}
	})(),
	'86': new (class extends Upgrade {
		name = 'U7-6';
		cost = new Decimal(12000);
		currency: Currencies = Currencies.NRB_DEDUCTION;
	})(),
	'87': new (class extends UpgradeWithEffect<Decimal> {
		name = 'U7-7';
		cost = new Decimal(19501.0);
		currency: Currencies = Currencies.NRB_DEDUCTION;
		effect(): Decimal {
			return player.hydra.compressedPower.clampMin(10).slog();
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
	'89': new (class extends Upgrade {
		name = 'U7-9';
		cost = new Decimal(275000);
		currency: Currencies = Currencies.NRB_DEDUCTION;
	})(),
	'810': new (class extends Upgrade {
		name = 'U7-10';
		cost = new Decimal('1e256000');
		currency: Currencies = Currencies.PT_POWER;
	})(),
	'811': new (class extends UpgradeWithEffect<Decimal> {
		name = 'U7-11';
		cost = new Decimal('ee6');
		currency: Currencies = Currencies.PT_POWER;
		effect(): Decimal {
			return player.pt.power.add(10).log10().add(10).log10().root(2).mul(2);
		}
		effectDescription(values: Decimal): string {
			return '+' + format(values);
		}
	})(),
	'812': new (class extends Upgrade {
		name = 'U7-12';
		cost = new Decimal('e1.8e6');
		currency: Currencies = Currencies.PT_POWER;
	})(),
	'813': new (class extends Upgrade {
		name = 'U7-13';
		cost = new Decimal('e1.5e8');
		currency: Currencies = Currencies.PT_POWER;
	})(),
	'814': new (class extends Upgrade {
		name = 'U7-14';
		cost = new Decimal('e1.8e8');
		currency: Currencies = Currencies.PT_POWER;
	})(),
	'815': new (class extends Upgrade {
		name = 'U7-15';
		cost = new Decimal('e2.5e8');
		currency: Currencies = Currencies.PT_POWER;
	})(),
	'816': new (class extends Upgrade {
		name = 'U7-16';
		cost = new Decimal('e5e8');
		currency: Currencies = Currencies.PT_POWER;
	})(),
} as const satisfies {
	[key: string]: Upgrade;
};
