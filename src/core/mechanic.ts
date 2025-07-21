import Decimal from 'break_eternity.js';
import { player } from './save';
import { feature } from './global.ts';
import { format, formatWhole } from '@/utils/format';

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
);
export const UPGRADES = {
	create(id: keyof typeof player.upgrades, info: IUpgrade) {
		upgrades[id] = info;
	},
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
	singleHTML(id: keyof typeof player.upgrades) {
		let useclass = 'upgrade_buttonbig';
		if (player.upgrades[id]) useclass = 'upgrade_buttonbig_complete';
		else if (!this.lock(id).unlocked || !upgrades[id].canAfford())
			useclass = 'upgrade_buttonbig_unable';
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
	buy(id: keyof typeof player.upgrades) {
		if (!player.upgrades[id] && this.lock(id).unlocked && upgrades[id].canAfford()) {
			upgrades[id].buy();
			player.upgrades[id] = true;
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
} & (
	| {
			canBuyMax(): boolean;
			buyMax(): any;
	  }
	| {
			canBuyMax?: never;
			buyMax?: never;
	  }
);
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
			str += buyables[id].description + '<br>';
			if (buyables[id].effect != null)
				str +=
					'效果：' +
					buyables[id].effD(player.buyables[id]) +
					'→' +
					buyables[id].effD(player.buyables[id].add(1)) +
					'<br>';
			str +=
				'价格：' +
				format(buyables[id].cost(player.buyables[id])) +
				buyables[id].currency +
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
			buyables[id].buy(player.buyables[id]);
			player.buyables[id] = player.buyables[id].add(1);
		}
	},
};

type ISoftcap = {
	name: string;
	fluid: boolean;
	start: Decimal;
	exponent: Decimal;
};

export const SOFTCAPS = {
	create(id: string, info: ISoftcap) {
		softcaps[id] = info;
	},
	reach(id: string, existing: Decimal) {
		return existing.gte(softcaps[id].start);
	},
	fluidComputed(id: string, getting: Decimal, existing: Decimal) {
		if (!this.reach(id, existing)) {
			if (this.reach(id, existing.add(getting))) {
				getting = getting.sub(softcaps[id].start.sub(existing));
				existing = softcaps[id].start;
			} else return getting;
		}
		if (!softcaps[id].fluid) throw new Error('type error');
		let s = softcaps[id];
		let base = s.start
			.mul(existing.div(s.start).root(s.exponent).add(getting.div(s.start)).pow(s.exponent))
			.sub(existing);
		return base;
	},
	staticComputed(id: string, getting: Decimal) {
		if (!this.reach(id, getting)) return getting;
		if (softcaps[id].fluid) throw new Error('type error');
		let s = softcaps[id];
		let base = s.start.mul(getting.div(s.start).pow(s.exponent));
		return base;
	},
};

export { upgrades, buyables, softcaps };
