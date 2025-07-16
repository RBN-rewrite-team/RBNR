import { player } from '../save';
import { UPGRADES, BUYABLES, upgrades, buyables, type singleReq } from '../mechanic.ts';
import Decimal from 'break_eternity.js';
import { format, formatWhole } from '@/utils/format';

export const successor = {
  initMechanics() {
    UPGRADES.create('11', {
      description: '解锁B0-1',
      cost: new Decimal(10),
      canAfford() {
        return player.number.gte(this.cost);
      },
      buy() {
        player.number = player.number.sub(this.cost);
      },
      get requirement() {
        return [
          [
            '达到10累计数值',
            function () {
              return player.totalNumber.gte(upgrades['11'].cost);
            },
            [formatWhole(player.totalNumber), upgrades['11'].cost],
          ] as singleReq,
        ];
      },
      show: function () {
        return true;
      },
    });
    UPGRADES.create('12', {
      description: '每次购买U0系列升级都使后继按钮批量+1',
      effect() {
        let base = new Decimal(0);
        if (player.upgrades['11']) base = base.add(1);
        if (player.upgrades['12']) base = base.add(1);
        if (player.upgrades['13']) base = base.add(1);
        return base;
      },
      effD() {
        return '+' + formatWhole(this.effect?.());
      },
      cost: new Decimal(100),
      canAfford() {
        return player.number.gte(this.cost);
      },
      buy() {
        player.number = player.number.sub(this.cost);
      },
      get requirement() {
        return [
          [
            '达到100累计数值',
            function () {
              return player.totalNumber.gte(upgrades['12'].cost);
            },
            [formatWhole(player.totalNumber), upgrades['12'].cost],
          ] as singleReq,
        ];
      },
      show: function () {
        return true;
      },
    });
    UPGRADES.create('13', {
      description: '解锁加法层',
      cost: new Decimal(1000),
      canAfford() {
        return player.number.gte(this.cost);
      },
      buy() {
        player.number = player.number.sub(this.cost);
      },
      get requirement() {
        return [
          [
            '达到1000累计数值',
            function () {
              return player.totalNumber.gte(upgrades['13'].cost);
            },
            [formatWhole(player.totalNumber), upgrades['13'].cost],
          ] as singleReq,
        ];
      },
      show: function () {
        return true;
      },
    });
    BUYABLES.create('11', {
      description: '每秒进行一次后继运算',
      effect(x) {
        return x;
      },
      effD(x) {
        return formatWhole(this.effect(x)) + '/s';
      },
      cost(x) {
        let a = x.mul(10).add(10);
        if (player.upgrades[23]) a = a.sub(10)
        return a
      },
      canAfford(x) {
        return player.number.gte(this.cost(x));
      },
      buy(x) {
        player.number = player.number.sub(this.cost(x));
      },
      capped() {
        let capc = 50;
        if (player.upgrades[23]) capc+=50
        return player.buyables['11'].gte(capc);
      },
      get requirement() {
        return [
          [
            '购买U11',
            function () {
              return player.upgrades['11'];
            },
          ] as singleReq,
        ];
      },
      show: function () {
        return true;
      },
    });
  },

  dosuccessor(bulk = 1) {
    let adding = this.successorBulk().mul(bulk);
    player.number = player.number.add(adding);
    player.totalNumber = player.totalNumber.add(adding);
  },
  autosuccessorPerSecond() {
    let base = new Decimal(0);
    if (player.buyables['11'].gte(1)) base = base.add(buyables['11'].effect(player.buyables['11']));
    return base;
  },
  successorBulk() {
    let base = new Decimal(1);
    if (player.upgrades['12']) base = base.add(upgrades['12'].effect?.() ?? 0);
    if (player.upgrades[21]) {
      let count = 0
      for (const i of [21,22,23,24,25,26])  {
        if(player.upgrades[i.toString() as '21'|'22'|'23'|'24'|'25'|'26']) count++
      }
      base = base.add(count)
    }
    if (player.upgrades[21]) base = base.mul(4)
    return base;
  },
};
