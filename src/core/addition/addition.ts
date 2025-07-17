import Decimal from 'break_eternity.js';
import { BUYABLES, upgrades, UPGRADES, type singleReq } from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { formatWhole } from '@/utils/format';
import { feature } from '../global.ts';

export const Addition = {
	initMechanics() {
		UPGRADES.create('21', {
			description: 'U1系列升级购买数量同样作用于U12的效果',
			currency: '加法能量',
			cost: new Decimal(1),
			displayName: "U1-1",
			canAfford() {
				return player.addpower.gte(this.cost);
			},
			buy() {
				player.addpower = player.addpower.sub(this.cost);
			},
			get requirement() {
				return [['获得1加法能量', () => player.totalAddpower.gte(1)] as singleReq];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('22', {
			description: '后继批量提高到4倍',
			currency: '加法能量',
			cost: new Decimal(5),
			displayName: "U1-2",
			canAfford() {
				return player.addpower.gte(this.cost);
			},
			buy() {
				player.addpower = player.addpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得5加法能量',
						() => player.totalAddpower.gte(5),
						[formatWhole(player.totalAddpower), formatWhole(upgrades[22].cost)],
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('23', {
			description: '移除B0-1价格的常数项，B0-1最多购买次数+50',
			cost: new Decimal(25),
			displayName: "U1-3",
			currency: '加法能量',
			canAfford() {
				return player.addpower.gte(this.cost);
			},
			buy() {
				player.addpower = player.addpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得25加法能量',
						() => player.totalAddpower.gte(25),
						[formatWhole(player.totalAddpower), formatWhole(upgrades[23].cost)],
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('24', {
			description: '解锁B1-1',
			cost: new Decimal(125),
			displayName: "U1-4",
			currency: '加法能量',
			canAfford() {
				return player.addpower.gte(this.cost);
			},
			buy() {
				player.addpower = player.addpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得125加法能量',
						() => player.totalAddpower.gte(125),
						[formatWhole(player.totalAddpower), formatWhole(upgrades[24].cost)],
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('25', {
			description: '后继运算升级为加法运算， 在每次加法重置后保留U0系列升级',
			displayName: "U1-5",
			effect() {
				return player.totalAddpower.root(4).add(1).floor();
			},
			effD() {
				return '+' + formatWhole(this?.effect?.() ?? 0) + '/c';
			},
			cost: new Decimal(625),
			currency: '加法能量',
			canAfford() {
				return player.addpower.gte(this.cost);
			},
			buy() {
				player.addpower = player.addpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得625加法能量',
						() => player.totalAddpower.gte(625),
						[formatWhole(player.totalAddpower), formatWhole(upgrades[25].cost)],
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		UPGRADES.create('26', {
			description: '解锁乘法层',
			cost: new Decimal(3125),
			displayName: "U1-6",
			currency: '加法能量',
			canAfford() {
				return player.addpower.gte(this.cost);
			},
			buy() {
				player.addpower = player.addpower.sub(this.cost);
			},
			get requirement() {
				return [
					[
						'获得3125加法能量',
						() => player.totalAddpower.gte(3125),
						[formatWhole(player.totalAddpower), formatWhole(upgrades[26].cost)],
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
		BUYABLES.create('21', {
			description: '每次加法重置后获得免费的购买项11（算在上限之内）',
			displayName: "B1-1",
			currency: '数值',
			effect(x) {
				return x;
			},
			effD(x) {
				return '+' + formatWhole(this.effect(x));
			},
			cost(x) {
				let a = x.mul(1000);
				return a;
			},
			canAfford(x) {
				return player.number.gte(this.cost(x));
			},
			buy(x) {
				player.number = player.number.sub(this.cost(x));
			},
			capped() {
				let capc = 100;
				return player.buyables['21'].gte(capc);
			},
			get requirement() {
				return [
					[
						'购买U1-4',
						function () {
							return player.upgrades['24'];
						},
					] as singleReq,
				];
			},
			show: function () {
				return true;
			},
		});
	},
	reset() {
		if (this.gain().gt(0)) {
			player.addpower = player.addpower.add(this.gain());
			player.totalAddpower = player.totalAddpower.add(this.gain());
			if (!player.upgrades[25]) {
				player.upgrades[11] = false;
				player.upgrades[12] = false;
			}
			player.buyables[11] = new Decimal(0);
			player.totalNumber = new Decimal(0);
			player.number = new Decimal(0);

			player.buyable11More = player.buyables[21];
		}
	},
	UIreset() {
		const gain = this.gain;
		if (player.firstResetBit & 0b1) return void Addition.reset();
		ModalService.show({
			title: '加法重置',
			content:
				'你真的要重置吗？这将重置你之前的数字、大部分升级和购买项。<br>你将获得 ' +
				formatWhole(gain()) +
				' 加法能量。',
			onConfirm() {
				Addition.reset();
				player.firstResetBit |= 0b1;
			},
		});
	},
	gain() {
		let base = player.totalNumber.div(1000).floor().max(0);
		if (player.firstResetBit & 0b10) base = base.mul(feature.PrimeFactor.powerEff());
		return base;
	},
	U25effect() {
		if (!player.upgrades[25]) return new Decimal(0);
		return upgrades[25]?.effect?.() ?? new Decimal(0);
	},
};
