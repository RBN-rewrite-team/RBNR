import Decimal from 'break_eternity.js';
import { feature, player } from '@/core/global';
import { buyables, BUYABLES, upgrades, UPGRADES, MILESTONES, type singleReq } from '../mechanic';
import { format, formatWhole } from '@/utils/format';
import { UpgradeWithEffect } from '../upgrade';
import { Currencies } from '../currencies';
import { Buyable } from '../buyable';

export function base() {
  let base = new Decimal(2)
  if (player.milestones.cb1) base = new Decimal(3)
  if (player.milestones.cb3) base = base.add(buyables.cb1.effect(player.buyables.cb1).pow(0.15).sub(1).max(0))
  if (player.milestones.cb6) base = base.mul(getMCB6Effect())
  if (player.upgrades['43R']) base = base.mul(upgrades['43R'].effect())
  return base
}
  
export function maxBlocks() {
  let mb = player.buyables.cb1.add(1)
  return mb;
}
export const cb1 = new class extends Buyable<Decimal> {
	name = "B-CB-1";
	description: string = '增加一个棋盘格';
	currency: Currencies = Currencies.EXPONENTION_POWER;
	effect(x: Decimal) {
		return x.add(1);
	}
	effectDescription(x: Decimal) {
		return formatWhole(x);
	}
	cost(x:Decimal) {
		let c = x.pow_base(2).mul(100);
		if (player.milestones.cb2) {
			c = x.pow(0.99).pow_base(1.85).mul(100);
		}
		if (player.milestones.cb12) {
			c = c.div(player.exponention.logarithm.calculate_datas.pow(2))
		}
		return c;
	}
	canBuyMax(): boolean {
	    return player.milestones.dil_2;
	}
	autoBuyMax(): boolean {
	    return player.milestones.dil_2;
	}
	costInverse(x: Decimal): Decimal {
	    let cb12eff = player.milestones.cb12 ? player.exponention.logarithm.calculate_datas.pow(2) : new Decimal(1);
	    return x.mul(cb12eff).div(100).max(1).log(player.milestones.cb2 ? 1.85 : 2).root(player.milestones.cb2 ? 0.99 : 1).add(1).floor();
	}
}

function getMCB6Effect() {
  return player.exponention.exppower.pow(0.666).add(1e10).log10().log10().add(1).floor()
    .mul(player.milestones.cb7?2:1)
}

export function initMechanics() {
	MILESTONES.create("cb1", {
	  displayName: "M-CB-1",
	  description: "麦粒底数 2 → 3",
	  requirement: new Decimal(125),
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
	  requirement: new Decimal(3000),
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
	  requirement: new Decimal(4e5),
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
	  requirement: new Decimal(8e8),
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
	  requirement: new Decimal(1e10),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb6", {
	  displayName: "M-CB-6",
	  get description(){
		  return "基于指数能量，棋盘底数×"+format(getMCB6Effect()) + "，并使数值和加法能量溢出效果减半";
	  } ,
	  requirement: new Decimal(1e18),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb7", {
	  displayName: "M-CB-7",
	  get description(){
		return "里程碑6的效果加倍(×2)"
	  } ,
	  requirement: new Decimal(1e25),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb8", {
	  displayName: "M-CB-8",
	  get description(){
		return "解锁τ<sub>2B</sub>"
	  } ,
	  requirement: new Decimal(1e35),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb9", {
	  displayName: "M-CB-9",
	  get description(){
		return "棋盘每个格子提升观测数据基础获取量×+0.01，同时削弱麦粒三个指数效果的软上限"
	  } ,
	  requirement: new Decimal(1e50),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb10", {
	  displayName: "M-CB-10",
	  get description(){
		return "每个行星运动定律使麦粒^1.05"
	  } ,
	  requirement: new Decimal(1e115),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb11", {
	  displayName: "M-CB-11",
	  get description(){
		return "基础麦粒公式中的3改为4"
	  } ,
	  requirement: new Decimal(1e135),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb12", {
	  displayName: "M-CB-12",
	  get description(){
		return "计算数据以÷x^2降低棋盘格子购买项的价格"
	  } ,
	  requirement: new Decimal(1e150),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb13", {
	  displayName: "M-CB-13",
	  get description(){
		return "计算速度翻倍，天文学家的效果底数从1.5提升到2"
	  } ,
	  requirement: new Decimal(1e245),
	  get canDone() {
	    return wheatGrain().gte(this.requirement)
	  },
	  show: true,
	  currency: "麦粒"
	})
	MILESTONES.create("cb14", {
	  displayName: "M-CB-14",
	  get description(){
		return "数值指数^1.125，削弱数值第五个软上限"
	  } ,
	  requirement: new Decimal(1e256),
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
  let eff5 = new Decimal(1).div(wg.add(1).ln().add(1).ln().root(2).div(1.5).add(1))
  let scp = [0.5, 0.4, 0.3];
  if(player.milestones.cb9) scp = [0.75, 0.65, 0.55];
  if (eff1.gte(4)) eff1 = eff1.div(4).pow(scp[0]).mul(4)
  if (eff2.gte(50)) eff2 = eff2.div(50).pow(scp[1]).mul(50)
  if (eff3.gte(3)) eff3 = eff3.div(3).pow(scp[2]).mul(3)
  if (eff4.gte('ee100')) eff4 = eff4.log10().div(1e100).pow(0.01).mul(1e100).pow_base(10)
  if (player.exponention.logarithm.in_dilate) {
      eff4 = eff4.max(1e10).log10().log10();
  }
  if (eff5.lt(1 / 3)) eff5 = new Decimal(1).div(new Decimal(1).div(eff5).sub(2).pow(0.5).add(2)).max(0.25)
  return [eff1, eff2, eff3, eff4, eff5]
}