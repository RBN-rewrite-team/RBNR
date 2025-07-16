import Decimal from 'break_eternity.js';
import { player } from './save';
import { feature } from './global.ts';
import { format, formatWhole } from '@/utils/format';

var upgrades: {
    [key: string]: IUpgrade;
  } = {},
  buyables: {
    [key: string]: IBuyable;
  } = {};
export type singleReq = [string, () => boolean, [string, Decimal]?];
type IUpgrade = {
  description: string;
  cost: Decimal;
  canAfford(): boolean;
  buy(): void;
  //requirement: [string, ()=>boolean, [string, Decimal/*jindutiao*/]?][]
  requirement: singleReq[];
  show: () => boolean;
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
    let str = '<div class="' + useclass + '">';
    str += '<span sytle="font-weight: bold">U' + id + '</span><br>';
    if (!this.lock(id).unlocked) {
      str += '暂未解锁<br>';
      let req = upgrades[id].requirement;
      for (let j in req) {
        if (j) str += ',<br>';
        if (req[j][1]()) str += '<span style="color: green; font-weight: bold">';
        else str += '<span style="color: red; font-weight: bold">';
        str += req[j][0];
        if (!req[j][1]() && req[j][2]) str += '(' + req[j][2][0] + '/' + req[j][2][1] + ')';
        str += '</span>';
      }
    } else {
      str += upgrades[id].description + '<br>';
      if (upgrades[id].effect) str += '效果：' + upgrades[id].effD() + '<br>';
      str += '价格：' + format(upgrades[id].cost) + '<br>';
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
  effect(x: any): any;
  effD(x: any): string;
  cost(x: Decimal): Decimal;
  canAfford(x: Decimal): boolean;
  buy(x: Decimal): void;
  capped(): boolean;
  requirement: singleReq[];
  show(): boolean;
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
      '<span sytle="font-weight: bold">B' +
      id +
      '(' +
      formatWhole(player.buyables[id]) +
      ')</span><br>';
    if (!this.lock(id).unlocked) {
      str += '暂未解锁<br>';
      let req = buyables[id].requirement;
      for (let j in req) {
        if (j) str += ',<br>';
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
      str += '价格：' + format(buyables[id].cost(player.buyables[id])) + '<br>';
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

export { upgrades, buyables };
