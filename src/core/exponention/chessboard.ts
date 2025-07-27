import Decimal from 'break_eternity.js';
import { feature, player } from '@/core/global';
import { buyables, BUYABLES, upgrades, UPGRADES, type singleReq } from '../mechanic';
import { format, formatWhole } from '@/utils/format';

export function base() {
  let base = new Decimal(2)
  return base
}
  
export function maxBlocks() {
  return player.buyables.cb1.add(1)
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
				return x.pow_base(2).mul(100);
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