import Decimal from 'break_eternity.js';
import type { DecimalSource } from 'break_eternity.js';
import { player } from './save';
import { feature } from './global.ts';
import { format, formatWhole } from '@/utils/format';
import { reactive } from "vue"
import { Logarithm } from './exponention/logarithm.ts';

var upgrades: {
		[key: string]: IUpgrade;
	} = {},
	buyables: {
		[key: string]: IBuyable;
	} = {},
	softcaps: {
		[key: string]: ISoftcap;
	} = {};
export type singleReq = [string, () => boolean, [string, string]?];
type IUpgrade = {
	description: string;
	displayName?: string;
	currency: string;
	cost: Decimal;
	canAfford(): boolean;
	buy(): void;
	//requirement: [string, ()=>boolean, [string, Decimal/*jindutiao*/]?][]
	requirement: singleReq[];
	show: () => boolean;
	keep?(): boolean;
} & (
	| {
			effect(): any;
			effD(): string;
	  }
	| {
			effect?: never;
			effD?: never;
	  }
) & {
	dilated?: string;
};
export const UPGRADES = {
	/**
	 * 创建一个升级
	 * @param id 升级的id
	 * @param info 升级的信息，传入IUpgrade
	 */
	create(id: keyof typeof player.upgrades, info: IUpgrade) {
		upgrades[id] = info;
	},
	/**
	 * 判断页面显示逻辑用的函数
	 * @param id 升级的id
	 * @returns 一个对象，字段show是这个函数是否显示，unlocked是是否解锁，字段reach是是否达到解锁要求
	 */
	lock(id: keyof typeof player.upgrades) {
		let req = upgrades[id].requirement;
		let reach: { [key: string]: boolean } = {},
			flag = true;
		for (let i in req) {
			reach[i] = req[i][1]();
			if (!reach[i]) flag = false;
		}
		return { show: upgrades[id].show(), unlocked: flag, reach: reach };
	},
	/**
	 * @param id 升级的id
	 * @returns 返回升级对应的html
	 * @deprecated 此函数已被分裂至src/components/TDUpgrade.vue
	 */
	singleHTML(id: keyof typeof player.upgrades) {
		let useclass = 'upgrade_buttonbig';
		if (id.toString().startsWith('4') && id.toString().endsWith('q')) useclass = 'upgrade_buttonsmall';
		if (player.upgrades[id]) useclass += '_complete';
		else if (!this.lock(id).unlocked || !upgrades[id].canAfford()) useclass += '_unable';
		let permanent = upgrades[id].keep != null && upgrades[id].keep();
		let str = '<div class="' + useclass + '">';
		str +=
			'<span sytle="font-weight: bold">' +
			(upgrades[id].displayName ?? 'U' + id) +
			'</span><br>';
		if (!this.lock(id).unlocked && !permanent && !player.upgrades[id]) {
			str += '暂未解锁<br>';
			let req = upgrades[id].requirement;
			for (let j in req) {
				if (j != '0') str += ',<br>';
				if (req[j][1]()) str += '<span style="color: green; font-weight: bold">';
				else str += '<span style="color: red; font-weight: bold">';
				str += req[j][0];
				if (!req[j][1]() && req[j][2]) str += '(' + req[j][2][0] + '/' + req[j][2][1] + ')';
				str += '</span>';
			}
		} else {
			str += upgrades[id].description + '<br>';
			if (upgrades[id].effect) str += '效果：' + upgrades[id].effD() + '<br>';
			if (!permanent)
				str += '价格：' + format(upgrades[id].cost) + upgrades[id].currency + '<br>';
			else str += '<span style="color: green; font-weight: bold">保持持有<br>';
		}
		str += '</div>';
		return str;
	},
	/**
	 * 购买一个函数
	 * @param id 升级的id
	 */
	buy(id: keyof typeof player.upgrades) {
		if (!player.upgrades[id] && this.lock(id).unlocked && upgrades[id].canAfford()) {
			upgrades[id].buy();
			player.upgrades[id] = true;
			
			if (Logarithm.logarithm.in_dilate) {
				Logarithm.logarithm.upgrades_in_dilated.push(id)
				Logarithm.logarithm.upgrades_in_dilated = [...new Set(Logarithm.logarithm.upgrades_in_dilated)]
			}
		}
	},
};
type IBuyable = {
	description: string;
	currency: string;
	effect(x: Decimal): Decimal;
	effD(x: Decimal): string;
	cost(x: Decimal): Decimal;
	canAfford(x: Decimal): boolean;
	buy(x: Decimal): void;
	capped(): boolean;
	requirement: singleReq[];
	show(): boolean;
	more?(): Decimal;
	displayName?: string;
} & {
	pfid?: number;
	prev?: number;
	pprev?: number;
	n?: number;
} & {
	canBuyMax?(): boolean;
	autoBuyMax?(): boolean;
	canBuy?(): Decimal;
	buyMax?(): void;
};
export const BUYABLES = {
	create(id: keyof typeof player.buyables, info: IBuyable) {
		buyables[id] = info;
	},
	lock(id: keyof typeof player.buyables) {
		let req = buyables[id].requirement;
		let reach: { [key: string]: boolean } = {},
			flag = true;
		for (let i in req) {
			reach[i] = req[i][1]();
			if (!reach[i]) flag = false;
		}
		return { show: buyables[id].show(), unlocked: flag, reach: reach };
	},
	singleHTML(id: keyof typeof player.buyables) {
		let useclass = 'upgrade_buttonbig';
		if (buyables[id].capped()) useclass = 'upgrade_buttonbig_complete';
		else if (!this.lock(id).unlocked || !buyables[id].canAfford(player.buyables[id]))
			useclass = 'upgrade_buttonbig_unable';
		let str = '<div class="' + useclass + '">';
		str +=
			'<span sytle="font-weight: bold">' +
			(buyables[id].displayName ?? 'B' + id) +
			'(' +
			formatWhole(player.buyables[id]) +
			(buyables[id].more
				? (function () {
						let a = buyables[id].more();
						if (a.gte(1)) return '+' + formatWhole(a);
						return '';
					})()
				: '') +
			')</span><br>';
		if (!this.lock(id).unlocked && player.buyables[id].eq(0)) {
			str += '暂未解锁<br>';
			let req = buyables[id].requirement;
			let first = true;
			for (let j in req) {
				if (j != '0') str += ',<br>';
				if (req[j][1]()) str += '<span style="color: green; font-weight: bold">';
				else str += '<span style="color: red; font-weight: bold">';
				str += req[j][0];
				if (!req[j][1]() && req[j][2]) str += '(' + req[j][2][0] + '/' + req[j][2][1] + ')';
				str += '</span>';
			}
		} else {
			let canBuy = new Decimal(0);
			if (buyables[id].canBuyMax != null && buyables[id].canBuyMax()) {
				if (buyables[id].canBuy != null) canBuy = buyables[id].canBuy();
			}
			str += buyables[id].description + '<br>';
			if (buyables[id].effect != null)
				str +=
					'效果：' +
					buyables[id].effD(player.buyables[id]) +
					'→<br>' +
					buyables[id].effD(player.buyables[id].add(canBuy.max(1))) +
					'<br>';
			str +=
				'价格：' +
				format(buyables[id].cost(player.buyables[id].add(canBuy.sub(1).max(0)))) +
				buyables[id].currency +
				(canBuy.gte(1) ? '(买' + formatWhole(canBuy) + '个)' : '') +
				'<br>';
		}
		str += '</div>';
		return str;
	},
	buy(id: keyof typeof player.buyables) {
		if (
			!buyables[id].capped() &&
			this.lock(id).unlocked &&
			buyables[id].canAfford(player.buyables[id])
		) {
			if (
				buyables[id].buyMax != null &&
				buyables[id].canBuyMax != null &&
				buyables[id].canBuyMax()
			) {
				buyables[id].buyMax();
			} else {
				buyables[id].buy(player.buyables[id]);
				player.buyables[id] = player.buyables[id].add(1);
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
};

/**
 * 计算数值溢出
 * @param number 被溢出的数
 * @param start 从哪里开始溢出
 * @param power 溢出的效果
 * @param meta 不知道
 * @returns 溢出后的数
 */
function overflow(number: Decimal, start: DecimalSource, power: DecimalSource, meta=1) {
	if (isNaN(number.mag)) return new Decimal(0)
	start = new Decimal(start)

	if (number.gt(start)) {
	  if (meta == 0) {
	    number = number.div(start).pow(power).mul(start)
	  } else if (meta == 1) {
			let s = start.log10()
			number = number.log10().div(s).pow(power).mul(s).pow10()
		} else {
			let s = start.iteratedlog(10,meta)
			number = Decimal.iteratedexp(10,meta,number.iteratedlog(10,meta).div(s).pow(power).mul(s));
		}
	}
	return number;
}

function overflowInversed(number: Decimal, start: DecimalSource, power: DecimalSource, meta=1) {
	if (isNaN(number.mag)) return new Decimal(0)
	start = new Decimal(start)

	if (number.gt(start)) {
		if (meta == 0) {
	    number = number.div(start).root(power).mul(start)
	  } else if (meta == 1) {
			let s = start.log10()
			number = number.log10().div(s).root(power).mul(s).pow10()
		} else {
			let s = start.iteratedlog(10,meta)
			number = Decimal.iteratedexp(10,meta,number.iteratedlog(10,meta).div(s).root(power).mul(s));
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
		let base = overflowInversed(existing, s.start, s.exponent, s.meta ?? 0)
		return overflow(base.add(getting), s.start, s.exponent, s.meta ?? 0).sub(existing);
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
		return overflow(getting, s.start, s.exponent, s.meta ?? 0);;
	},
};

type IMilestone = {
  requirement: Decimal,
  currency: string,
  displayName: string,
  show: boolean;
  description: string;
  canDone: boolean;
}

export const milestones: {
  [key: string]: IMilestone;
} = {}

export const MILESTONES = {
  create(id: keyof typeof player.milestones, info: IMilestone) {
		milestones[id] = info;
	},
}

export { upgrades, buyables, softcaps };
