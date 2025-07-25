import Decimal from 'break_eternity.js';
import { buyables, BUYABLES, upgrades, UPGRADES, type singleReq } from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { format, formatWhole } from '@/utils/format';
import { Multiplication } from '../multiplication/multiplication.ts';
import { CHALLENGE } from '../challenge.ts';
const D179E308 = Decimal.pow(2, 1024);

export const Exponention = {
  initMechanics() {
    UPGRADES.create('41', {
      displayName: "U3-11",
      description: "加法能量乘法能量获取速度*10",
      cost: new Decimal(1),
      currency: "指数能量",
      canAfford() {
        return player.exponention.exppower.gte(this.cost);
      },
      requirement: [],
      show() { return true; },
      buy (){
        player.exponention.exppower = player.exponention.exppower.sub(this.cost);
      }
    });
    UPGRADES.create('42', {
      displayName: "U3-12",
      description: "后继运算指数+0.1",
      cost: new Decimal(1),
      currency: "指数能量",
      canAfford() {
        return player.exponention.exppower.gte(this.cost);
      },
      requirement: [],
      show() { return true; },
      buy (){
        player.exponention.exppower = player.exponention.exppower.sub(this.cost);
      }
    });
    UPGRADES.create('43', {
      displayName: "U3-13",
      description: "数值二重软上限开始处^2",
      cost: new Decimal(1),
      currency: "指数能量",
      canAfford() {
        return player.exponention.exppower.gte(this.cost);
      },
      requirement: [],
      show() { return true; },
      buy (){
        player.exponention.exppower = player.exponention.exppower.sub(this.cost);
      }
    });
    UPGRADES.create('44', {
      displayName: "U3-14",
      description: "加法能量二重软上限开始处^2",
      cost: new Decimal(1),
      currency: "指数能量",
      canAfford() {
        return player.exponention.exppower.gte(this.cost);
      },
      requirement: [],
      show() { return true; },
      buy (){
        player.exponention.exppower = player.exponention.exppower.sub(this.cost);
      }
    });
  },
	reset(force = false) {
		if(this.gain().gt(0) || force) {
			player.exponention.exppower = player.exponention.exppower.add(this.gain());
			player.exponention.totalExppower = player.exponention.totalExppower.add(this.gain());
			player.stat.totalExppower = player.stat.totalExppower.add(this.gain());
      Multiplication.reset(true);
      player.upgrades[31] = false;
      player.upgrades[32] = false;
      if (!player.upgrades['431q']){
        player.upgrades[33] = false;
        player.upgrades[34] = false;
      }
      player.upgrades[35] = false;
      player.upgrades[36] = false;
      player.upgrades[37] = false;
      player.upgrades[38] = false;
      player.upgrades[39] = false;
      if (!player.upgrades['424q'])
        player.upgrades['31R'] = false;
      player.upgrades['32R'] = false;
      player.upgrades['33R'] = false;
      player.upgrades['34R'] = false;
      player.buyables[31] = new Decimal(0);
      player.buyables[32] = new Decimal(0);
      player.buyables[33] = new Decimal(0);
      if (!player.upgrades['414q'])
        player.buyables['31R'] = new Decimal(0);
      if (!player.upgrades['434q'])
        player.buyables['32R'] = new Decimal(0);
      player.buyables['33R'] = new Decimal(0);
      player.buyables['34R'] = new Decimal(0);
      player.buyables['35R'] = new Decimal(0);
      player.buyables['36R'] = new Decimal(0);
      player.buyables['37R'] = new Decimal(0);
      player.buyables['38R'] = new Decimal(0);
      player.buyables.pf2 = new Decimal(0);
      player.buyables.pf3 = new Decimal(0);
      player.buyables.pf5 = new Decimal(0);
      player.buyables.pf7 = new Decimal(0);
      player.buyables.pf11 = new Decimal(0);
      player.buyables.pf13 = new Decimal(0);
      player.buyables.pf17 = new Decimal(0);
      player.buyables.pf19 = new Decimal(0);

      player.multiplication.mulpower = new Decimal(0);
      player.multiplication.B1seriesC1 = 0;
      player.multiplication.totalMulpower = new Decimal(0);
	  if(!player.upgrades['445q'])
		player.multiplication.pfTime = new Decimal(0);
      player.numbertheory.euler.x = new Decimal(1);
      player.numbertheory.euler.y = new Decimal(1);
      player.numbertheory.euler.z = new Decimal(1);
      player.numbertheory.euler.s = new Decimal(1);

      if (!player.upgrades['413q'])
        player.challenges[0][0] = new Decimal(0);
      if (!player.upgrades['423q'])
        player.challenges[0][1] = new Decimal(0);
      if (!player.upgrades['433q'])
        player.challenges[0][2] = new Decimal(0);
      player.challenges[0][3] = new Decimal(0);

      player.exponention.qolpoints = player.exponention.qolpoints.add(3);
		}
	},
	UIreset() {
		const gain = this.gain;
		if (player.firstResetBit & 0b100) return void Exponention.reset();
		ModalService.show({
			title: '指数重置',
			content:
				'你真的要重置吗？这将重置你之前大部分内容。<br>你将获得 ' +
				formatWhole(gain()) +
				' 指数能量和 ' +
				formatWhole(new Decimal(3)) +
				' 生活质量点。',
			onConfirm() {
				Exponention.reset();
				player.firstResetBit |= 0b100;
			},
		});
	},
	gain() {
		if (player.multiplication.totalMulpower.lt(D179E308)) return new Decimal(0);
		let base = player.multiplication.totalMulpower.log(2).root(2).div(32);
		return base.floor();
	},
	powerEff() {
		return player.exponention.totalExppower.div(1000).add(1);
	},
};
