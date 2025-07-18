import Decimal from 'break_eternity.js';
import { BUYABLES, upgrades, UPGRADES, type singleReq } from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { formatWhole } from '@/utils/format';
import { Addition } from '../addition/addition.ts';

export const Multiplication = {
	initMechanics() {
		UPGRADES.create('31', {
			description: '所有后继升级保持为可购买状态',
			cost: new Decimal(1),
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
			description: 'U2系列升级购买数量的平方同样作用于U0-2的效果',
			displayName: 'U2-2',
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
		UPGRADES.create('33', {
			description: '在每次乘法重置后保留B1-1',
			displayName: 'U2-3',
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
		UPGRADES.create('34', {
			description: '解锁数论研究',
			displayName: 'U2-4',
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
		UPGRADES.create('35', {
			description: '解锁数论研究',
			currency: '乘法能量',
			cost: new Decimal(1e6),
			canAfford() {
				return player.multiplication.mulpower.gte(this.cost);
			},
			buy() {
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得1,000,000乘法能量',
						() => player.multiplication.totalMulpower.gte(1000000),
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
	},
	powerEff() {
		let base = player.multiplication.totalMulpower.add(1);
		return base;
	},
	reset() {
		if (this.gain().gt(0)) {
			player.multiplication.mulpower = player.multiplication.mulpower.add(this.gain());
			player.multiplication.totalMulpower = player.multiplication.totalMulpower.add(
				this.gain(),
			);
			let reset_upgrades: Array<keyof typeof player.upgrades> = [21, 22, 23, 24, 25].map(
				(x) => x.toString() as keyof typeof player.upgrades,
			);
			for (let i in reset_upgrades) player.upgrades[reset_upgrades[i]] = false;
			if (!player.upgrades[33]) player.buyables[21] = new Decimal(0);
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
		let base = player.totalAddpower.sub(3125).pow(0.1).floor();
		return base;
	},
};
