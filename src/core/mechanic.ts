import Decimal from 'break_eternity.js';
import type { DecimalSource } from 'break_eternity.js';
import { player } from './save';
import { format, formatWhole } from '@/utils/format';
import { Logarithm } from './exponention/logarithm.ts';
import { Successor } from './successor/successor.ts';
import { currencyName, decreaseCurrency, getCurrency } from './currencies.ts';
import { Addition } from './addition/addition.ts';
import { Multiplication } from './multiplication/multiplication.ts';
import { NUMTHEORY } from './multiplication/numbertheory.ts';
import { PrimeFactor } from './multiplication/pf.ts';
import { Exponention } from './exponention/exponention.ts';
import { QolUpgrades } from './exponention/qolupg.ts';
import { ORDINAL } from './ordinal/ordinal.ts';
import { OrdinalNT } from './ordinal/ordinalNT.ts';
import { OrdinalUtils } from '@/utils/ordinal';
import { cb1 } from './exponention/chessboard.ts';
import { Buyable } from './buyable.ts';
import { countdown } from './countdown-display.ts';
import { ORDINAL_BOOSTER } from './ordinal/ordinal-booster.ts';
import { Hydra } from './hydra/hydra.ts';
import { DiluteUpgrades } from './hydra/dilute.ts';
import { DC } from '@/core/constants';
import { wgEffect } from './exponention/chessboard.ts';
import { NON_RECURSIVE } from './nonrecu/index.ts';
import { WellOrderingBuyables, WellOrderingUpgrades } from './ordinal/well_ordering.ts';
import { TimeShard } from './timeshard/timeshard.ts';
import { Qol7Upgrades } from './pt/qolcryupgs.ts';
import type { $t } from '@/utils/types.ts';
import { Requirement } from './requirements.ts';
import { NRBUpgrades } from './nonrecu/nonrec-bms/upgrades.ts';

const upgrades = {
	...Successor.upgrades,
	...Addition.upgrades,
	...Multiplication.upgrades,
	...NUMTHEORY.upgrades,
	...Exponention.upgrades,
	...QolUpgrades.upgrades,
	...ORDINAL.upgrades,
	...OrdinalNT.upgrades,
	...ORDINAL_BOOSTER.upgrades,
	...Hydra.upgrades,
	...DiluteUpgrades,
	...NON_RECURSIVE.upgrades,
	...WellOrderingUpgrades,
	...TimeShard.upgrades,
	...Qol7Upgrades.upgrades,
	...NRBUpgrades,
} as const;
const buyables = {
	...Successor.buyables,
	...Addition.buyables,
	...Multiplication.buyables,
	...NUMTHEORY.buyables,
	...PrimeFactor.upgrades, // this code write 'upgrades', but it is actually 'buyables'.
	...Exponention.buyables,
	cb1,
	...Logarithm.buyables,
	...OrdinalNT.buyables,
	...ORDINAL_BOOSTER.buyables,
	...Hydra.buyables,
	...WellOrderingBuyables,
} as const;
const preExponent = Object.keys(Addition.buyables)
	.concat(Object.keys(Successor.buyables))
	.concat(Object.keys(Multiplication.buyables))
	.concat(Object.keys(NUMTHEORY.buyables));
const softcaps: {
	[key: string]: ISoftcap;
} = {};
export type singleReq = [string, () => boolean, [string, string]?];

export const UPGRADES = {
	/**
	 * 判断页面显示逻辑用的函数
	 * @param id 升级的id
	 * @returns 一个对象，字段show是这个函数是否显示，unlocked是是否解锁，字段reach是是否达到解锁要求
	 */
	lock(id: keyof typeof upgrades) {
		const req = upgrades[id].requirements();
		let reach: { [key: string]: boolean } = {},
			flag = true;
		for (const i in req) {
			reach[i] = req[i].reachedReq();
			if (!reach[i]) flag = false;
		}
		let a = upgrades[id].show();
		if (upgrades[id].name.startsWith('U5-1-') && player.retribution != 0) {
			a = false;
		}
		return { show: a, unlocked: flag, reach: reach };
	},
	/**
	 * 购买一个函数
	 * @param id 升级的id
	 */
	buy(id: keyof typeof upgrades) {
		if (!player.upgrades[id] && this.lock(id).unlocked && upgrades[id].canAfford()) {
			decreaseCurrency(
				upgrades[id].currency,
				typeof upgrades[id].cost === 'function' ? upgrades[id].cost() : upgrades[id].cost,
			);
			player.upgrades[id] = true;

			if (Logarithm.logarithm.in_dilate) {
				Logarithm.logarithm.upgrades_in_dilated.push(id);
				Logarithm.logarithm.upgrades_in_dilated = [
					...new Set(Logarithm.logarithm.upgrades_in_dilated),
				];
			}
		}
	},
};
export const BUYABLES = {
	lock(id: keyof typeof buyables) {
		const req = buyables[id].requirements();
		let reach: { [key: string]: boolean } = {},
			flag = true;
		for (const i in req) {
			reach[i] = req[i].reachedReq();
			if (!reach[i]) flag = false;
		}
		const a = buyables[id].show();
		return { show: a, unlocked: flag, reach: reach };
	},
	buy(id: keyof typeof buyables) {
		if (
			!buyables[id].capped(player.buyables[id]) &&
			this.lock(id).unlocked &&
			buyables[id].cost(player.buyables[id]).lte(getCurrency(buyables[id].currency)) &&
			buyables[id].canAfford()
		) {
			if (buyables[id].canBuyMax != null && buyables[id].canBuyMax()) {
				buyables[id].postBuyMax();
				player.buyables[id] = Decimal.max(
					player.buyables[id],
					buyables[id].costInverse(getCurrency(buyables[id].currency)),
				);
			} else {
				buyables[id].postBuy();
				decreaseCurrency(buyables[id].currency, buyables[id].cost(player.buyables[id]));
				player.buyables[id] = player.buyables[id].add(1);
			}
			if (Logarithm.logarithm.in_dilate) {
				if (preExponent.includes(id)) {
					Logarithm.logarithm.buyables_in_dilated.push(id);
					Logarithm.logarithm.buyables_in_dilated = [
						...new Set(Logarithm.logarithm.buyables_in_dilated),
					];
				}
			}
		}
	},
};

type ISoftcap = {
	name: string;
	fluid: boolean;
	start: Decimal;
	exponent: Decimal;
	meta?: number;
	slog?: boolean;
};

/**
 * 计算数值溢出
 * @param number 被溢出的数
 * @param start 从哪里开始溢出
 * @param power 溢出的效果
 * @param meta 不知道
 * @returns 溢出后的数
 */
/*
  function overflow() {
	废弃
}
*/

/*function overflow_v2(getting: Decimal, existing: Decimal, s: any) {
	let ans = new Decimal(0);
	if (s.slog) {
		ans = Decimal.iteratedexp(
			10,
			Number(
				getting
					.slog()
					.sub(s.start.slog())
					.mul(s.slog ?? 1)
					.add(s.start.slog()),
			),
			new Decimal(1),
		);
	} else {
		const start = s.start,
			power = s.exponent,
			meta = s.meta ?? 0;
		const safe = Decimal.iteratedexp(10, meta, new Decimal(1));
		const stm = start.iteratedlog(10, meta),
			gem = getting.max(safe).iteratedlog(10, meta),
			exm = existing.iteratedlog(10, meta);
		const logged = stm.mul(exm.div(stm).root(power).add(gem.div(stm)).pow(power));
		ans = Decimal.iteratedexp(10, meta, logged);
	}
	return ans;
}*/
function overflow(number: Decimal, start: DecimalSource, power: DecimalSource, meta = 0) {
	if (isNaN(number.mag)) return new Decimal(0);
	start = new Decimal(start);

	if (number.gt(start)) {
		if (meta == 0) {
			number = number.div(start).pow(power).mul(start);
		} else if (meta == 1) {
			const s = start.log10();
			number = number.log10().div(s).pow(power).mul(s).pow10();
		} else {
			const s = start.iteratedlog(10, meta);
			number = Decimal.iteratedexp(
				10,
				meta,
				number.iteratedlog(10, meta).div(s).pow(power).mul(s),
			);
		}
	}
	return number;
}

function overflowInversed(number: Decimal, start: DecimalSource, power: DecimalSource, meta = 1) {
	if (isNaN(number.mag)) return new Decimal(0);
	start = new Decimal(start);

	if (number.gt(start)) {
		if (meta == 0) {
			number = number.div(start).root(power).mul(start);
		} else if (meta == 1) {
			const s = start.log10();
			number = number.log10().div(s).root(power).mul(s).pow10();
		} else {
			const s = start.iteratedlog(10, meta);
			number = Decimal.iteratedexp(
				10,
				meta,
				number.iteratedlog(10, meta).div(s).root(power).mul(s),
			);
		}
	}
	return number;
}
export const SOFTCAPS = {
	create(id: string, info: ISoftcap) {
		softcaps[id] = info;
	},
	/**
	 * 是否达到软上限
	 * @param id 软上限对应的id
	 * @param existing 被软上限的数值
	 * @returns 是否达到软上限
	 */
	reach(id: string, existing: Decimal) {
		if (softcaps[id].slog) return existing.slog().gte(softcaps[id].start);
		return existing.gte(softcaps[id].start);
	},
	/**
	 * 基于获取和当前数值的软上限
	 * @param id 软上限id
	 * @param getting 获取数值
	 * @param existing 当前数值
	 * @returns 被软上线获取数值
	 */
	fluidComputed(id: string, getting: Decimal, existing: Decimal) {
		if (!this.reach(id, existing)) {
			if (this.reach(id, existing.add(getting))) {
				getting = getting.sub(softcaps[id].start.sub(existing));
				existing = softcaps[id].start;
			} else return getting;
		}
		if (!softcaps[id].fluid) throw new Error('type error');
		const s = softcaps[id];
		let base = this.reach(id, existing)
			? s.start.mul(existing.div(s.start).root(s.exponent))
			: existing;
		base = base.add(getting).pow(s.exponent).mul(s.start);
		if (base.lt('ee10')) base = base.sub(existing);
		return base;
	},
	/**
	 * 基于获取的软上限
	 * @param id 软上限id
	 * @param getting 获取数值
	 * @returns 被软上线获取数值
	 */
	staticComputed(id: string, getting: Decimal) {
		if (!this.reach(id, getting)) return getting;
		const s = softcaps[id];
		return overflow(getting, s.start, s.exponent, s.meta ?? 0);
	},
};

SOFTCAPS.create('number^1', {
	name: 'number^1',
	fluid: true,
	start: new Decimal(2).pow(256),
	exponent: new Decimal(0.75),
});
SOFTCAPS.create('number^2', {
	name: 'number^2',
	fluid: true,
	get start() {
		let base = new Decimal(2).pow(1024);

		if (player.upgrades[43]) base = base.pow(2);
		return base;
	},
	exponent: new Decimal(0.75),
});
SOFTCAPS.create('number_C1', {
	name: 'number_C1',
	fluid: true,
	start: DC.D_1,
	exponent: new Decimal(0.5),
});
SOFTCAPS.create('number^3', {
	name: 'number^3',
	fluid: true,
	start: new Decimal('e20000'),
	exponent: new Decimal(0.5),
});
SOFTCAPS.create('number^4', {
	name: 'number^4',
	fluid: true,
	start: new Decimal('ee5'),
	get exponent() {
		let base = new Decimal(4);
		if (player.milestones.cb6) base = base.pow(0.5);
		return base.pow(-1);
	},
	meta: 1,
});
SOFTCAPS.create('number^5', {
	name: 'number^5',
	fluid: true,
	start: new Decimal('ee20'),
	get exponent() {
		return player.milestones.cb14 ? new Decimal(0.2) : new Decimal(0.1);
	},
	meta: 1,
});
SOFTCAPS.create('addpower^1', {
	name: 'addpower^1',
	fluid: true,
	start: new Decimal(2).pow(384),
	exponent: new Decimal(0.75),
});
SOFTCAPS.create('addpower^2', {
	name: 'addpower^2',
	fluid: true,
	get start() {
		let base = new Decimal(2).pow(4096);

		if (player.upgrades[43]) base = base.pow(2);
		return base;
	},
	exponent: new Decimal(0.75),
});
SOFTCAPS.create('addpower^3', {
	name: 'addpower^3',
	fluid: true,
	start: new Decimal('e40000'),
	exponent: new Decimal(0.5),
});
SOFTCAPS.create('addpower^4', {
	name: 'addpower^4',
	fluid: true,
	start: new Decimal('ee5'),
	get exponent() {
		let base = new Decimal(4);
		if (player.milestones.cb6) base = base.pow(0.5);
		return base.pow(-1);
	},
	meta: 1,
});
SOFTCAPS.create('addpower^5', {
	name: 'addpower^5',
	fluid: true,
	start: new Decimal('ee14'),
	exponent: new Decimal(0.25),
	meta: 1,
});
SOFTCAPS.create('mulpower^1', {
	name: 'mulpower^1',
	fluid: true,
	start: new Decimal('e5e6'),
	get exponent() {
		let base = new Decimal(2.5);
		if (player.upgrades[47]) base = base.pow(wgEffect()[4]);
		return DC.D_1.div(base);
	},
	meta: 1,
});
SOFTCAPS.create('mulpower^2', {
	name: 'mulpower^2',
	fluid: true,
	start: new Decimal('ee9'),
	exponent: new Decimal(0.25),
	meta: 1,
});
type IMilestone = {
	requirement: Decimal;
	currency: string;
	displayName: string;
	show: boolean;
	// description?: string | ((x: T) => string);
	canDone: boolean;
	req?: boolean;
	reqDescription?: string;
	onDone?: () => void;

	effect?(): any;
};

export const milestones: {
	[key: string]: IMilestone;
} = {};

export const MILESTONES = {
	create(id: keyof typeof player.milestones, info: IMilestone) {
		milestones[id] = info;
	},
};
// MILESTONES.create('bx', {
// 	requirement: new Decimal(0),
// 	currency: '拜谢',
// 	displayName: '何意味',
// 	show: true,

// 	canDone: false,
// });
export { upgrades, buyables, softcaps };
