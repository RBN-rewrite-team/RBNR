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
      },
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
      },
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
      },
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
      },
    });
	UPGRADES.create('45', {
		displayName: 'U3-21',
		description: '解锁数论研究2',
		cost: new Decimal(10),
		currency: '指数能量',
		canAfford() {
			return player.exponention.exppower.gte(this.cost);
		},
		get requirement() {
			return [
					[
						'获得100指数能量',
						() =>
							player.exponention.totalExppower.gte(100),
						[formatWhole(player.exponention.totalExppower), formatWhole(new Decimal(100))],
					] as singleReq,
				];
		},
		show() {return true;},
		buy() {
			player.exponention.exppower = player.exponention.exppower.sub(this.cost);
		},
	});
	BUYABLES.create('41', {
		displayName: 'B3-1',
		description: '因数能量^1.05',
		cost(x) {
			return x.pow_base(10).mul(2);
		},
		currency: '指数能量',
		canAfford(x) {
			return player.exponention.exppower.gte(this.cost(x));
		},
		requirement: [],
		show() {return true;},
		buy(x) {
			player.exponention.exppower = player.exponention.exppower.sub(this.cost(x));
		},
		capped() {
			return false;
		},
	});
	BUYABLES.create('41', {
		displayName: 'B3-1',
		description: '因数能量^1.05',
		effect(x) {
			return x.pow_base(1.05);
		},
		effD(x) {
			return '^' + format(this.effect(x));
		},
		cost(x) {
			return x.pow_base(10).mul(2);
		},
		currency: '指数能量',
		canAfford(x) {
			return player.exponention.exppower.gte(this.cost(x));
		},
		requirement: [],
		show() {return true;},
		buy(x) {
			player.exponention.exppower = player.exponention.exppower.sub(this.cost(x));
		},
		capped() {
			return false;
		},
	});
	BUYABLES.create('42', {
		displayName: 'B3-2',
		description: '数值获取^1.05',
		effect(x) {
			return x.pow_base(1.05);
		},
		effD(x) {
			return '^' + format(this.effect(x));
		},
		cost(x) {
			return x.pow_base(10).mul(3);
		},
		currency: '指数能量',
		canAfford(x) {
			return player.exponention.exppower.gte(this.cost(x));
		},
		requirement: [],
		show() {return true;},
		buy(x) {
			player.exponention.exppower = player.exponention.exppower.sub(this.cost(x));
		},
		capped() {
			return false;
		},
	});
	BUYABLES.create('43', {
		displayName: 'B3-3',
		description: '加法能量获取^1.03',
		effect(x) {
			return x.pow_base(1.03);
		},
		effD(x) {
			return '^' + format(this.effect(x));
		},
		cost(x) {
			return x.pow_base(10).mul(5);
		},
		currency: '指数能量',
		canAfford(x) {
			return player.exponention.exppower.gte(this.cost(x));
		},
		requirement: [],
		show() {return true;},
		buy(x) {
			player.exponention.exppower = player.exponention.exppower.sub(this.cost(x));
		},
		capped() {
			return false;
		},
	});
	BUYABLES.create('44', {
		displayName: 'B3-4',
		description: '乘法能量获取^1.01',
		effect(x) {
			return x.pow_base(1.01);
		},
		effD(x) {
			return '^' + format(this.effect(x));
		},
		cost(x) {
			return x.pow_base(10).mul(7);
		},
		currency: '指数能量',
		canAfford(x) {
			return player.exponention.exppower.gte(this.cost(x));
		},
		requirement: [],
		show() {return true;},
		buy(x) {
			player.exponention.exppower = player.exponention.exppower.sub(this.cost(x));
		},
		capped() {
			return false;
		},
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
