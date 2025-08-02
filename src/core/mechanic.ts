import Decimal from 'break_eternity.js';
import type { DecimalSource } from 'break_eternity.js';
import { player } from './save';
import { format, formatWhole } from '@/utils/format';
import { Logarithm } from './exponention/logarithm.ts';
import { Successor } from './successor/successor.ts';
import { currencyName, decreaseCurrency, getCurrency, setCurrency } from './currencies.ts';
import { Addition } from './addition/addition.ts';
import { Multiplication } from './multiplication/multiplication.ts';
import { NUMTHEORY } from './multiplication/numbertheory.ts';
import { PrimeFactor } from './multiplication/pf.ts';
import { Exponention } from './exponention/exponention.ts';
import { QolUpgrades } from './exponention/qolupg.ts';
import { cb1 } from './exponention/chessboard.ts';
import { Buyable } from './buyable.ts';

const upgrades = {
	...Successor.upgrades,
	...Addition.upgrades,
	...Multiplication.upgrades,
	...NUMTHEORY.upgrades,
	...Exponention.upgrades,
	...QolUpgrades.upgrades,
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
} as const;
const preExponent = Object.keys(Addition.buyables)
	.concat(Object.keys(Successor.buyables))
	.concat(Object.keys(Multiplication.buyables))
	.concat(Object.keys(NUMTHEORY.buyables));
var softcaps: {
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
		let req = upgrades[id].requirements();
		let reach: { [key: string]: boolean } = {},
			flag = true;
		for (let i in req) {
			reach[i] = req[i].reachedReq();
			if (!reach[i]) flag = false;
		}
		return { show: upgrades[id].show(), unlocked: flag, reach: reach };
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
		let req = buyables[id].requirements();
		let reach: { [key: string]: boolean } = {},
			flag = true;
		for (let i in req) {
			reach[i] = req[i].reachedReq();
			if (!reach[i]) flag = false;
		}
		return { show: buyables[id].show(), unlocked: flag, reach: reach };
	},
	singleHTML(id: keyof typeof buyables) {
		let useclass = 'upgrade_buttonbig';
		if (buyables[id].capped(player.buyables[id])) useclass = 'upgrade_buttonbig_complete';
		else if (
			!this.lock(id).unlocked ||
			!buyables[id].canAfford() ||
			!buyables[id].cost(player.buyables[id]).lte(getCurrency(buyables[id].currency))
		)
			useclass = 'upgrade_buttonbig_unable';
		let str = '<div class="' + useclass + '">';
		str +=
			'<span sytle="font-weight: bold">' +
			buyables[id].name +
			'(' +
			formatWhole(player.buyables[id]) +
			(function () {
				let a = buyables[id].more();
				if (a.gte(1)) return '+' + formatWhole(a);
				return '';
			})() +
			')</span><br>';
		if (!this.lock(id).unlocked && player.buyables[id].eq(0)) {
			str += '暂未解锁<br>';
			let req = buyables[id].requirements();
			let first = true;
			for (let j in req) {
				if (j != '0') str += ',<br>';
				if (req[j].reachedReq()) str += '<span style="color: green; font-weight: bold">';
				else str += '<span style="color: red; font-weight: bold">';
				str += req[j].reqDescription();
				if (!req[j].reachedReq() && req[j].progress)
					str += '(' + req[j].progress().join('/') + ')';
				str += '</span>';
			}
		} else {
			let canBuy = new Decimal(0);
			if (buyables[id].canBuyMax != null && buyables[id].canBuyMax()) {
				if (buyables[id].canBuy != null) canBuy = buyables[id].canBuy(player.buyables[id]);
			}
			str += buyables[id].description + '<br>';
			if (
				buyables[id].descriptionDilated &&
				Logarithm.logarithm.buyables_in_dilated.includes(id)
			)
				str += buyables[id].descriptionDilated + '<br>';
			if (buyables[id].effect != null)
				str +=
					'效果：' +
					buyables[id].effectDescription(player.buyables[id]) +
					'&nbsp;→' +
					buyables[id].effectDescription(player.buyables[id].add(canBuy.max(1))) +
					'<br>';
			if (
				player.exponention.logarithm.buyables_in_dilated.includes(id) &&
				buyables[id].effectDilated !== Buyable.prototype.effectDilated
			)
				str +=
					'膨胀效果：' +
					buyables[id].effectDilated(player.buyables[id])[1] +
					'&nbsp;→' +
					buyables[id].effectDilated(player.buyables[id].add(canBuy.max(1)))[1] +
					'<br>';
			str +=
				'价格：' +
				format(buyables[id].cost(player.buyables[id].add(canBuy.sub(1).max(0)))) +
				currencyName(buyables[id].currency) +
				(canBuy.gte(1) ? '(买' + formatWhole(canBuy) + '个)' : '') +
				'<br>';
		}
		str += '</div>';
		return str;
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
function overflow() {
	/* 废弃 */
}

function overflow_v2(getting: Decimal, existing: Decimal, s: any) {
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
		let start = s.start,
			power = s.exponent,
			meta = s.meta ?? 0;
		let safe = Decimal.iteratedexp(10, meta, new Decimal(1));
		let stm = start.iteratedlog(10, meta),
			gem = getting.max(safe).iteratedlog(10, meta),
			exm = existing.iteratedlog(10, meta);
		let logged = stm.mul(exm.div(stm).root(power).add(gem.div(stm)).pow(power));
		ans = Decimal.iteratedexp(10, meta, logged);
	}
	return ans;
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
		let s = softcaps[id];
		return overflow_v2(getting, existing, s);
	},
	/**
	 * 基于获取的软上限
	 * @param id 软上限id
	 * @param getting 获取数值
	 * @returns 被软上线获取数值
	 */
	staticComputed(id: string, getting: Decimal) {
		if (!this.reach(id, getting)) return getting;
		if (softcaps[id].fluid) throw new Error('type error');
		let s = softcaps[id];
		return overflow_v2(new Decimal(0), getting, s);
	},
};

type IMilestone = {
	requirement: Decimal;
	currency: string;
	displayName: string;
	show: boolean;
	description: string;
	canDone: boolean;
};

export const milestones: {
	[key: string]: IMilestone;
} = {};

export const MILESTONES = {
	create(id: keyof typeof player.milestones, info: IMilestone) {
		milestones[id] = info;
	},
};

export { upgrades, buyables, softcaps };
