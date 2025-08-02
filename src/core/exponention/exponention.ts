import Decimal from 'break_eternity.js';
import { buyables, BUYABLES, upgrades, UPGRADES, type singleReq } from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { format, formatWhole } from '@/utils/format';
import { Multiplication } from '../multiplication/multiplication';
import { CHALLENGE } from '../challenge';
import { Logarithm } from './logarithm';
import { feature } from '../global';
import { Currencies } from '../currencies';
import { Upgrade } from '../upgrade';
import { CurrencyRequirement, type Requirement } from '../requirements';
import { Buyable } from '../buyable';
const D179E308 = Decimal.pow(2, 1024);

export const Exponention = {
	upgrades: {
		'41': new (class U31 extends Upgrade {
			description = '加法能量乘法能量获取速度*10';
			cost = new Decimal(1);
			name = 'U3-11';
			currency: Currencies = Currencies.EXPONENTION_POWER;
		})(),
		'42': new (class U32 extends Upgrade {
			description = '后继/加法运算指数+0.1';
			cost = new Decimal(1);
			name = 'U3-12';
			currency: Currencies = Currencies.EXPONENTION_POWER;
		})(),
		'43': new (class U33 extends Upgrade {
			description = '数值二重软上限开始处^2';
			cost = new Decimal(1);
			name = 'U3-13';
			currency: Currencies = Currencies.EXPONENTION_POWER;
		})(),
		'44': new (class U34 extends Upgrade {
			description = '加法能量二重软上限开始处^2';
			cost = new Decimal(1);
			name = 'U3-14';
			currency: Currencies = Currencies.EXPONENTION_POWER;
		})(),
		'45': new (class U35 extends Upgrade {
			description = '解锁数论研究2';
			cost = new Decimal(10);
			name = 'U3-21';
			currency: Currencies = Currencies.EXPONENTION_POWER;
			requirements(): Requirement[] {
				return [new CurrencyRequirement(Currencies.EXPONENTION_POWER, new Decimal(100))];
			}
		})(),
		'46': new (class U36 extends Upgrade {
			description = '每秒获得1%重置时的乘法能量';
			cost = new Decimal(10);
			name = 'U3-22';
			currency: Currencies = Currencies.EXPONENTION_POWER;
			requirements(): Requirement[] {
				return [new CurrencyRequirement(Currencies.EXPONENTION_POWER, new Decimal(100))];
			}
		})(),
		'47': new (class U37 extends Upgrade {
			description = '解锁棋盘';
			cost = new Decimal(150);
			name = 'U3-23';
			currency: Currencies = Currencies.EXPONENTION_POWER;
			requirements(): Requirement[] {
				return [new CurrencyRequirement(Currencies.EXPONENTION_POWER, new Decimal(300))];
			}
			show() {
			  return player.singularity.stage < 3
			}
		})(),
		'48': new (class U38 extends Upgrade {
			description = '改进指数能量获取公式';
			cost = new Decimal(1e4);
			name = 'U3-24';
			currency: Currencies = Currencies.EXPONENTION_POWER;
			requirements(): Requirement[] {
				return [new CurrencyRequirement(Currencies.EXPONENTION_POWER, new Decimal(1e4))];
			}
		})(),
	} as const,
	buyables: {
		'41': new (class B31 extends Buyable<Decimal> {
			name = 'B3-1';
			description: string = '因数能量^1.05';
			effect(x: Decimal) {
				return new Decimal(1.05).pow(x);
			}
			effectDescription(x: Decimal) {
				return '^' + format(this.effect(x));
			}
			cost(x: Decimal) {
				return x.pow_base(10).mul(2);
			}
			currency: Currencies = Currencies.EXPONENTION_POWER;
			canBuyMax(): boolean {
				return player.milestones['dil_1'];
			}
			autoBuyMax(): boolean {
				return player.milestones['dil_1'];
			}
			costInverse(x: Decimal): Decimal {
				return x.div(2).max(1).log(10).add(1).floor();
			}
		})(),
		'42': new (class B32 extends Buyable<Decimal> {
			name = 'B3-2';
			description: string = '数值能量^1.05';
			effect(x: Decimal) {
				return new Decimal(1.05).pow(x);
			}
			effectDescription(x: Decimal) {
				return '^' + format(this.effect(x));
			}
			cost(x: Decimal) {
				return x.pow_base(10).mul(3);
			}
			currency: Currencies = Currencies.EXPONENTION_POWER;
			canBuyMax(): boolean {
				return player.milestones['dil_1'];
			}
			autoBuyMax(): boolean {
				return player.milestones['dil_1'];
			}
			costInverse(x: Decimal): Decimal {
				return x.div(3).max(1).log(10).add(1).floor();
			}
		})(),
		'43': new (class B33 extends Buyable<Decimal> {
			name = 'B3-3';
			description: string = '加法能量获取^1.03';
			effect(x: Decimal) {
				return new Decimal(1.03).pow(x);
			}
			effectDescription(x: Decimal) {
				return '^' + format(this.effect(x));
			}
			cost(x: Decimal) {
				return x.pow_base(10).mul(5);
			}
			currency: Currencies = Currencies.EXPONENTION_POWER;
			canBuyMax(): boolean {
				return player.milestones['dil_1'];
			}
			autoBuyMax(): boolean {
				return player.milestones['dil_1'];
			}
			costInverse(x: Decimal): Decimal {
				return x.div(5).max(1).log(10).add(1).floor();
			}
		})(),
		'44': new (class B34 extends Buyable<Decimal> {
			name = 'B3-4';
			description: string = '乘法能量获取^1.01';
			effect(x: Decimal) {
				return new Decimal(1.01).pow(x);
			}
			effectDescription(x: Decimal) {
				return '^' + format(this.effect(x));
			}
			cost(x: Decimal) {
				return x.pow_base(10).mul(7);
			}
			currency: Currencies = Currencies.EXPONENTION_POWER;
			canBuyMax(): boolean {
				return player.milestones['dil_1'];
			}
			autoBuyMax(): boolean {
				return player.milestones['dil_1'];
			}
			costInverse(x: Decimal): Decimal {
				return x.div(7).max(1).log(10).add(1).floor();
			}
		})(),
	} as const,
	initMechanics() {},
	reset(force = false, dilate = false) {
		if (this.gain().gt(0) || force) {
			this.exppower_gain();
			Multiplication.reset(true);
			player.upgrades[31] = false;
			player.upgrades[32] = false;
			if (!player.upgrades['431q'] || dilate) {
				player.upgrades[33] = false;
				player.upgrades[34] = false;
			}
			player.upgrades[36] = false;
			player.upgrades[37] = false;
			if (!player.upgrades['424q'] || dilate) player.upgrades['31R'] = false;
			player.upgrades['32R'] = false;
			player.upgrades['33R'] = false;
			player.upgrades['34R'] = false;
			player.buyables[31] = new Decimal(0);
			player.buyables[32] = new Decimal(0);
			player.buyables[33] = new Decimal(0);
			if (!player.upgrades['414q'] || dilate) player.buyables['31R'] = new Decimal(0);
			if (!player.upgrades['434q'] || dilate) player.buyables['32R'] = new Decimal(0);
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
			if (!player.upgrades['445q'] || dilate) player.multiplication.pfTime = new Decimal(0);
			player.numbertheory.euler.x = new Decimal(1);
			player.numbertheory.euler.y = new Decimal(1);
			player.numbertheory.euler.z = new Decimal(1);
			player.numbertheory.euler.s = new Decimal(1);

			if (!player.upgrades['413q'] || dilate) player.challenges[0][0] = new Decimal(0);
			if (!player.upgrades['423q'] || dilate) player.challenges[0][1] = new Decimal(0);
			if (!player.upgrades['433q'] || dilate) player.challenges[0][2] = new Decimal(0);
			player.challenges[0][3] = new Decimal(0);

			player.challengein = [-1, -1];

			player.exponention.qolpoints = player.exponention.qolpoints.add(3);

			if (dilate) {
				player.upgrades['13'] = false;
				player.upgrades['26'] = false;
				player.upgrades['35'] = false;
				player.upgrades['38'] = false;
				player.upgrades['39'] = false;

				for (const upg_i of player.exponention.logarithm.upgrades_in_dilated) {
					player.upgrades[upg_i] = true;
				}
			}
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
	exppower_gain(bulk = new Decimal(1)) {
		let adding = this.gain().mul(bulk);
		player.exponention.exppower = player.exponention.exppower.add(adding);
		player.exponention.totalExppower = player.exponention.totalExppower.add(adding);
		player.stat.totalExppower = player.stat.totalExppower.add(adding);
	},
	gain() {
		if (player.singularity.stage >= 4) return new Decimal(0);
		if (player.multiplication.totalMulpower.lt(D179E308)) return new Decimal(0);
		let exp = new Decimal(0.5);
		if (player.upgrades[48]) exp = new Decimal(0.6);
		let base = player.multiplication.totalMulpower.log(2).pow(exp).div(32);
		if (player.milestones.cb4) base = base.mul(10);
		if (player.milestones.log_law2)
			base = base.mul(Logarithm.logarithm.calculate_datas.root(3).max(1));

		if (player.singularity.stage < 1) base = base.mul(Logarithm.dilateEffect()[1]);
		return base.floor();
	},
	powerEff() {
		return player.exponention.totalExppower.div(1000).add(1);
	},
	toggleDilate() {
		feature.EXPONENTION.reset(true, true);
		player.exponention.logarithm.in_dilate = !player.exponention.logarithm.in_dilate;
	},
};
