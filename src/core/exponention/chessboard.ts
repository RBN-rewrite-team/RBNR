import Decimal from 'break_eternity.js';
import { feature, player } from '@/core/global';
import { buyables, BUYABLES, upgrades, UPGRADES, MILESTONES, type singleReq } from '../mechanic';
import { format, formatWhole } from '@/utils/format';
import { UpgradeWithEffect } from '../upgrade';
import { Currencies } from '../currencies';
import { Buyable } from '../buyable';

export function base() {
	let base = new Decimal(2);
	if (player.milestones.cb1) base = new Decimal(3);
	if (player.milestones.cb11) base = new Decimal(4);
	if (player.milestones.cb3)
		base = base.add(buyables.cb1.effect(player.buyables.cb1).pow(0.15).sub(1).max(0));
	if (player.milestones.cb6) base = base.mul(getMCB6Effect());
	if (player.upgrades['43R']) base = base.mul(upgrades['43R'].effect());
	if (player.milestones.cb18) base = base.mul(getMCB18Effect());
	return base;
}

export function maxBlocks() {
	const mb = player.buyables.cb1.add(1);
	return mb;
}

function mcb20eff() {
	let base = player.exponention.exppower.add(10).log10().pow(0.1);
	if (player.milestones.cb21) base = base.pow(2);
	if (player.milestones.cb22) base = base.pow(2);
	if (player.milestones.cb23) base = base.pow(1.1);
	if (player.milestones.cb24) base = base.pow(3.141592653589793238);
	return base;
}

export const cb1 = new (class extends Buyable<Decimal> {
	name = 'B-CB-1';
	description: string = '增加一个棋盘格';
	currency: Currencies = Currencies.EXPONENTION_POWER;
	effect(x: Decimal) {
		return x.add(1);
	}
	effectDescription(x: Decimal) {
		return formatWhole(x);
	}
	cost(x: Decimal) {
		if (player.milestones.cb20) x = x.div(mcb20eff());
		let c = x.pow_base(2).mul(100);
		if (player.milestones.cb2) {
			c = x.pow(0.99).pow_base(1.85).mul(100);
		}
		if (player.milestones.cb12) {
			c = c.div(player.exponention.logarithm.calculate_datas.add(1).pow(2));
		}
		return c;
	}
	canBuyMax(): boolean {
		return player.singularity.stage < 3 && player.milestones.dil_2;
	}
	autoBuyMax(): boolean {
		return player.singularity.stage < 3 && player.milestones.dil_2;
	}
	costInverse(x: Decimal): Decimal {
		const cb12eff = player.milestones.cb12
			? player.exponention.logarithm.calculate_datas.pow(2)
			: new Decimal(1);
		let base = x
			.mul(cb12eff)
			.div(100)
			.max(1)
			.log(player.milestones.cb2 ? 1.85 : 2)
			.root(player.milestones.cb2 ? 0.99 : 1)
			.add(1);
		if (!player.milestones.cb20) base = base.floor();
		else base = base.mul(mcb20eff());
		return base;
	}
	canAfford() {
		return player.singularity.stage < 3;
	}
})();

function getMCB6Effect() {
	return player.exponention.exppower
		.div(1e40)
		.max(1)
		.root(4)
		.mul(4)
		.sub(3)
		.add(1)
		.mul(player.milestones.cb7 ? 2 : 1);
}

function getMCB18Effect() {
	return player.exponention.logarithm.calculate_datas.div(1e10).max(1).root(2.5);
}

export function getMCB19Effect() {
	return wheatGrain().add(1).ln().add(1).ln().add(1).ln().root(1.5).div(5).add(1);
}

export function initMechanics() {
	MILESTONES.create('cb1', {
		displayName: 'M-CB-1',
		requirement: new Decimal(125),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb2', {
		displayName: 'M-CB-2',
		requirement: new Decimal(3000),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb3', {
		displayName: 'M-CB-3',
		requirement: new Decimal(4e5),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb4', {
		displayName: 'M-CB-4',
		requirement: new Decimal(8e8),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb5', {
		displayName: 'M-CB-5',
		requirement: new Decimal(1e10),
		get canDone() {
			if (player.singularity.stage >= 2) return false;
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb6', {
		displayName: 'M-CB-6',
		effect() {
			return {
				effect: format(getMCB6Effect()),
			};
		},
		requirement: new Decimal(1e18),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb7', {
		displayName: 'M-CB-7',
		requirement: new Decimal(1e25),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb8', {
		displayName: 'M-CB-8',
		requirement: new Decimal(1e40),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb9', {
		displayName: 'M-CB-9',
		requirement: new Decimal(1e50),
		get canDone() {
			if (player.singularity.stage >= 2) return false;
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb10', {
		displayName: 'M-CB-10',
		requirement: new Decimal(1e155),
		get canDone() {
			if (player.singularity.stage >= 2) return false;
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb11', {
		displayName: 'M-CB-11',
		requirement: new Decimal(1e192),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb12', {
		displayName: 'M-CB-12',
		requirement: new Decimal(1.5e224),
		get canDone() {
			if (player.singularity.stage >= 2) return false;
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb13', {
		displayName: 'M-CB-13',
		requirement: new Decimal('1e353'),
		get canDone() {
			if (player.singularity.stage >= 2) return false;
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb14', {
		displayName: 'M-CB-14',
		requirement: new Decimal('5e361'),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb15', {
		displayName: 'M-CB-15',
		requirement: new Decimal('1e366'),
		get canDone() {
			if (player.singularity.stage >= 2) return false;
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb16', {
		displayName: 'M-CB-16',
		requirement: new Decimal('3e374'),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb17', {
		displayName: 'M-CB-17',
		requirement: new Decimal('1e387'),
		get canDone() {
			if (player.singularity.stage >= 2) return false;
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb18', {
		displayName: 'M-CB-18',
		effect() {
			return {
				effect: format(getMCB18Effect()),
			};
		},
		requirement: new Decimal('5e428'),
		get canDone() {
			if (player.singularity.stage >= 2) return false;
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb19', {
		displayName: 'M-CB-19',
		effect() {
			return { effect: format(getMCB19Effect()) };
		},
		requirement: new Decimal('5.5555e555'),
		get canDone() {
			return wheatGrain().gte(this.requirement);
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb20', {
		displayName: 'M-CB-20',
		effect() {
			return {
				effect: format(mcb20eff()),
			};
		},
		requirement: new Decimal(2).pow(9 * 1024),
		get canDone() {
			return wheatGrain().gte(this.requirement) && !player.singularity.enabled;
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb21', {
		displayName: 'M-CB-21',
		requirement: new Decimal('e7500'),
		get canDone() {
			return wheatGrain().gte(this.requirement) && !player.singularity.enabled;
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb22', {
		displayName: 'M-CB-22',
		requirement: new Decimal('e21000'),
		get canDone() {
			return wheatGrain().gte(this.requirement) && !player.singularity.enabled;
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb23', {
		displayName: 'M-CB-23',
		requirement: new Decimal('e6.5e5'),
		get canDone() {
			return wheatGrain().gte(this.requirement) && !player.singularity.enabled;
		},
		show: true,
		currency: 'wheatgrain',
	});
	MILESTONES.create('cb24', {
		displayName: 'M-CB-24',
		requirement: new Decimal('7.7e7777777'),
		get canDone() {
			return wheatGrain().gte(this.requirement) && !player.singularity.enabled;
		},
		show: true,
		currency: 'wheatgrain',
	});
}

export function wheatGrain() {
	const baseVal = base();
	if (baseVal.eq(1)) return baseVal.mul(maxBlocks());
	const maxBlocksVal = maxBlocks();
	let r = 0;
	if (player.milestones.log_law1) r++;
	if (player.milestones.log_law2) r++;
	if (player.milestones.log_law3) r++;
	if (player.milestones.log_G) r++;
	let eff = baseVal.pow(maxBlocksVal).sub(1).div(baseVal.sub(1));
	if (player.milestones.cb10) eff = eff.pow(1.05 ** r);
	return eff;
}

export function wgEffect() {
	const wg = wheatGrain().max(1);
	let eff1 = wg.log10().div(2).add(1);
	let eff2 = wg.log10().div(5).add(1);
	let eff3 = wg.log10().div(10).add(1).pow(5);
	let eff4 = wg.pow(2).pow_base(4);
	let eff5 = new Decimal(1).div(wg.add(1).ln().add(1).ln().root(2).div(1.5).add(1));
	if (player.milestones.cb19)
		eff5 = new Decimal(1).div(wg.add(1).ln().mul(1.5).add(1).iteratedlog(10, 0.5).add(1));
	let scp = [0.5, 0.4, 0.3];
	if (player.milestones.cb9) scp = [0.75, 0.65, 0.55];
	if (player.milestones.cb16) scp = [1, 1, 1];
	if (eff1.gte(4)) eff1 = eff1.div(4).pow(scp[0]).mul(4);
	if (eff2.gte(50)) eff2 = eff2.div(50).pow(scp[1]).mul(50);
	if (eff3.gte(3)) eff3 = eff3.div(3).pow(scp[2]).mul(3);
	if (eff4.gte('ee100')) eff4 = eff4.log10().div(1e100).pow(0.01).mul(1e100).pow_base(10);
	if (player.exponention.logarithm.in_dilate) {
		eff4 = eff4.max(1e10).log10().log10();
	}
	if (eff5.lt(1 / 3) && !player.milestones.cb19)
		eff5 = new Decimal(1).div(new Decimal(1).div(eff5).sub(2).pow(0.5).add(2)).max(0.25);
	return [eff1, eff2, eff3, eff4, eff5];
}
