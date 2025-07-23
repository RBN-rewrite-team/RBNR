import Decimal from 'break_eternity.js';
import { buyables, BUYABLES, upgrades, UPGRADES, type singleReq } from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { format, formatWhole } from '@/utils/format';
import { Addition } from '../addition/addition.ts';
import { PrimeFactor } from './pf.ts';
import { CHALLENGE } from '../challenge.ts';
import { MULTI_CHALS } from './challenges.ts';
const D179E308 = Decimal.pow(2, 1024);
export const Multiplication = {
	initMechanics() {
		UPGRADES.create('31', {
			description: '你可以选择一个U1系列升级将其价格降低到1加法能量，改变选择将进行乘法重置',
			cost: new Decimal(0),
			displayName: 'U2-1',
			currency: '乘法能量',
			canAfford() {
				return player.multiplication.mulpower.gte(this.cost);
			},
			buy() {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得1乘法能量',
						() => player.multiplication.totalMulpower.gte(1),
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('32', {
			description: '所有后继升级保持为可购买状态',
			cost: new Decimal(1),
			displayName: 'U2-2',
			currency: '乘法能量',
			canAfford() {
				return player.multiplication.mulpower.gte(this.cost);
			},
			buy() {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得1乘法能量',
						() => player.multiplication.totalMulpower.gte(1),
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('33', {
			description: 'U2系列升级购买数量的平方同样作用于U0-2的效果',
			displayName: 'U2-3',
			currency: '乘法能量',
			cost: new Decimal(2),
			canAfford() {
				return player.multiplication.mulpower.gte(this.cost);
			},
			buy() {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得2乘法能量',
						() => player.multiplication.totalMulpower.gte(2),
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('34', {
			description: '在每次乘法重置后保留B1-1',
			displayName: 'U2-4',
			currency: '乘法能量',
			cost: new Decimal(3),
			canAfford() {
				return player.multiplication.mulpower.gte(this.cost);
			},
			buy() {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得3乘法能量',
						() => player.multiplication.totalMulpower.gte(3),
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('35', {
			description: '解锁数论研究',
			displayName: 'U2-5',
			currency: '乘法能量',
			cost: new Decimal(47),
			canAfford() {
				return player.multiplication.mulpower.gte(this.cost);
			},
			buy() {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得47乘法能量',
						() => player.multiplication.totalMulpower.gte(47),
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('36', {
			description: '每2个质因数p<sub>n</sub>免费赠送一个p<sub>n-1</sub>',
			displayName: 'U2-6',
			currency: '乘法能量',
			cost: new Decimal(101),
			canAfford() {
				return player.multiplication.mulpower.gte(this.cost);
			},
			buy() {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得101乘法能量',
						() => player.multiplication.totalMulpower.gte(101),
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('37', {
			description: '乘法重置保留加法升级',
			displayName: 'U2-7',
			currency: '乘法能量',
			cost: new Decimal(1000),
			canAfford() {
				return player.multiplication.mulpower.gte(this.cost);
			},
			buy() {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得1,000乘法能量',
						() => player.multiplication.totalMulpower.gte(1000),
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('38', {
			description: '每秒自动获取重置获取加法能量的1%',
			displayName: 'U2-8',
			currency: '乘法能量',
			cost: new Decimal(10000),
			canAfford() {
				return player.multiplication.mulpower.gte(this.cost);
			},
			buy() {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得10,000乘法能量',
						() => player.multiplication.totalMulpower.gte(10000),
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('39', {
			description: '解锁乘法挑战，自动最大购买后继、加法购买项，最大购买乘法购买项',
			displayName: 'U2-9',
			currency: '乘法能量',
			cost: new Decimal(1e21),
			canAfford() {
				return player.multiplication.mulpower.gte(this.cost);
			},
			buy() {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得1.00e21乘法能量',
						() => player.multiplication.totalMulpower.gte(1e21),
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		BUYABLES.create('31', {
			description: '增加加法能量获取',
			displayName: 'B2-1',
			currency: '乘法能量',
			effect(x) {
				return x.mul(0.5).add(1);
			},
			effD(x) {
				return '*' + format(this.effect(x));
			},
			cost(x) {
				let a = x.mul(1000).add(10);
				return a;
			},
			canAfford(x) {
				return player.multiplication.mulpower.gte(this.cost(x));
			},
			buy(x) {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost(x));
			},
			capped() {
				let capc = 500;
				return player.buyables['31'].gte(capc);
			},
			get requirement() {
				return [];
			},
			show: function () {
				return true;
			},
			canBuyMax() {
				return player.upgrades[39];
			},
			autoBuyMax() {
				return false;
			},
			canBuy() {
				return player.multiplication.mulpower
					.max(1)
					.div(1000)
					.floor()
					.min(500)
					.sub(player.buyables[31]);
			},
			buyMax() {
				player.buyables[31] = player.buyables[31].add(this?.canBuy?.() ?? 0);
			},
		});
		BUYABLES.create('32', {
			description: '每级将乘法能量获取*2',
			displayName: 'B2-2',
			currency: '乘法能量',
			effect(x) {
				return x.pow_base(CHALLENGE.inChallenge(0, 3) ? 1 : 2);
			},
			effD(x) {
				return '*' + formatWhole(this.effect(x));
			},
			cost(x) {
				let a = x.add(1).pow10();
				return a;
			},
			canAfford(x) {
				return player.multiplication.mulpower.gte(this.cost(x));
			},
			buy(x) {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost(x));
			},
			capped() {
				return false;
			},
			get requirement() {
				return [];
			},
			show: function () {
				return true;
			},
			canBuyMax() {
				return player.upgrades[39];
			},
			autoBuyMax() {
				return false;
			},
			canBuy() {
				return player.multiplication.mulpower
					.max(1)
					.log10()
					.floor()
					.sub(player.buyables[32]);
			},
			buyMax() {
				player.buyables[32] = player.buyables[32].add(this?.canBuy?.() ?? 0);
			},
		});
		BUYABLES.create('33', {
			description: '质因数公式变得更好',
			displayName: 'B2-3',
			currency: '乘法能量',
			effect(x) {
				return new Decimal(0.01).mul(x);
			},
			effD(x) {
				return format(this.effect(x));
			},
			cost(x) {
				let a = new Decimal(15).pow(x.add(1));
				return a;
			},
			canAfford(x) {
				return player.multiplication.mulpower.gte(this.cost(x));
			},
			buy(x) {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost(x));
			},
			capped() {
				let capc = 99;
				return player.buyables['33'].gte(capc);
			},
			get requirement() {
				return [
					[
						'获得10000因数能量',
						() => PrimeFactor.power().gte(10000),
						[formatWhole(PrimeFactor.power()), formatWhole(10000)],
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
			canBuyMax() {
				return player.upgrades[39];
			},
			autoBuyMax() {
				return false;
			},
			canBuy() {
				return player.multiplication.mulpower
					.max(1)
					.log(15)
					.floor()
					.min(99)
					.sub(player.buyables[33]);
			},
			buyMax() {
				player.buyables[33] = player.buyables[33].add(this?.canBuy?.() ?? 0);
			},
		});
	},
	powerEff() {
		let base = player.multiplication.totalMulpower.add(1);
		return base;
	},
	reset(force = false) {
		if (this.gain().gt(0) || force) {
			player.multiplication.mulpower = player.multiplication.mulpower.add(this.gain());
			player.multiplication.totalMulpower = player.multiplication.totalMulpower.add(
				this.gain(),
			);
			player.stat.totalMulpower = player.stat.totalMulpower.add(this.gain());
			if (CHALLENGE.inChallenge(0, 3)) {
				player.challenges[0][3] = player.challenges[0][3].add(this.gain());
			}
			let reset_upgrades: Array<keyof typeof player.upgrades> = [21, 22, 23, 24, 25].map(
				(x) => x.toString() as keyof typeof player.upgrades,
			);
			if (!player.upgrades[37] || force)
				for (let i in reset_upgrades) player.upgrades[reset_upgrades[i]] = false;
			if (!player.upgrades[33] || force) player.buyables[21] = new Decimal(0);
			player.multiplication.pfTime = new Decimal(0);
			Addition.reset();
			player.totalAddpower = new Decimal(0);
			player.addpower = new Decimal(0);
		}
	},
	UIreset() {
		const gain = this.gain;
		if (player.firstResetBit & 0b10) return void Multiplication.reset();
		ModalService.show({
			title: '乘法重置',
			content:
				'你真的要重置吗？这将重置你之前的数字、加法能量、大部分升级和购买项。<br>你将获得 ' +
				formatWhole(gain()) +
				' 乘法能量。',
			onConfirm() {
				Multiplication.reset();
				player.firstResetBit |= 0b10;
			},
		});
	},
	gain() {
		if (player.totalAddpower.lt(3125)) return new Decimal(0);
		if (CHALLENGE.inChallenge(0, 3) && player.totalAddpower.lt(D179E308)) return new Decimal(0);
		let base = player.totalAddpower.sub(3125).pow(0.1);
		if (CHALLENGE.inChallenge(0, 3)) base = player.totalAddpower.div(D179E308).pow(1 / 1024);
		if (player.buyables[32].gt(0)) base = base.mul(buyables[32].effect(player.buyables[32]));
		if (CHALLENGE.amountChallenge(0, 3).gt(0) && !CHALLENGE.inChallenge(0, 3)) {
			base = base.mul(MULTI_CHALS[3].effect?.(player.challenges[0][3]) ?? 1);
		}
    if (player.upgrades[41]) base = base.mul(10);
		return base.floor();
	},
};
