import Decimal from 'break_eternity.js';
import { feature, player } from '@/core/global';
import { buyables, BUYABLES, upgrades, UPGRADES, MILESTONES, type singleReq } from '../mechanic';
import { format, formatWhole } from '@/utils/format';

export function base() {
  let base = new Decimal(2)
  if (player.milestones.cb1) base = new Decimal(3)
	if (player.milestones.cb3) base = base.add(buyables.cb1.effect(player.buyables.cb1).pow(0.15).sub(1).max(0))
  return base
}
  
export function maxBlocks() {
  let mb = player.buyables.cb1.add(1)
	if (player.milestones.cb6) mb = mb.mul(player.exponention.exppower.pow(0.666).add(10).log10().log10().add(1).floor())
  return mb;
}

export function initMechanics() {
  BUYABLES.create('cb1', {
			displayName: 'B-CB-1',
			description: '增加一个棋盘格',
			effect(x) {
				return x.add(1);
			},
			effD(x) {
				return formatWhole(this.effect(x));
			},
			cost(x) {
				let c = x.pow_base(2).mul(100);
				if (player.milestones.cb2) {
					c = x.pow(0.99).pow_base(1.85).mul(100);
				}
				return c;
			},
			currency: '指数能量',
			canAfford(x) {
				return player.exponention.exppower.gte(this.cost(x));
			},
			requirement: [],
			show() {
				return true;
			},
			buy(x) {
				player.exponention.exppower = player.exponention.exppower.sub(this.cost(x));
			},
			capped() {
				return false;
			},
		});
	MILESTONES.create("cb1", {
	  displayName: "M-CB-1",
	  description: "麦粒底数 2 → 3",
	  requirement: new Decimal(250),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb2", {
	  displayName: "M-CB-2",
	  get description(){
		return "更好的棋盘格价格公式"
	  } ,
	  requirement: new Decimal(8000),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb3", {
	  displayName: "M-CB-3",
	  get description(){
		return "基于格子数加成麦粒数量底数"
	  } ,
	  requirement: new Decimal(8e5),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb4", {
	  displayName: "M-CB-4",
	  get description(){
		return "倍增指数能量x10"
	  } ,
	  requirement: new Decimal(1e10),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb5", {
	  displayName: "M-CB-5",
	  get description(){
		return "解锁对数运算"
	  } ,
	  requirement: new Decimal(1e11),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb6", {
	  displayName: "M-CB-6",
	  get description(){
		return "棋盘格数×floor(log^2_10(指数能量^0.5＋10))"
	  } ,
	  requirement: new Decimal(1e18),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
}

export function wheatGrain() {
  let baseVal = base()
  if (baseVal.eq(1)) return baseVal.mul(maxBlocks())
  let maxBlocksVal = maxBlocks()
  return baseVal.pow(maxBlocksVal).sub(1)
    .div(baseVal.sub(1))
}

export function wgEffect() {
  let wg = wheatGrain().max(1)
  let eff1 = wg.log10().div(2).add(1)
  let eff2 = wg.log10().div(5).add(1)
  let eff3 = wg.log10().div(10).add(1).pow(5)
  let eff4 = wg.pow(2).pow_base(4)
  if (eff1.gte(4)) eff1 = eff1.div(4).pow(0.5).mul(4)
  if (eff3.gte(3)) eff1 = eff1.div(3).pow(0.3).mul(3)
  return [eff1, eff2, eff3, eff4]
}