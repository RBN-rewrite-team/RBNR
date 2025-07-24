import Decimal from 'break_eternity.js';
import { BUYABLES, upgrades, UPGRADES, buyables, type singleReq } from '../mechanic';
import { player, type PrimeFactorTypes } from '../save';
import ModalService from '@/utils/Modal';
import { formatWhole } from '@/utils/format';
import { Addition } from '../addition/addition.ts';
import { CHALLENGE } from '../challenge.ts';

export const PrimeFactor = {
	initMechanics() {
		let pflist = ['2', '3', '5', '7', '11', '13', '17', '19'];
		for (let i in pflist) {
			let pf = pflist[i];
			BUYABLES.create(('pf' + pf) as keyof typeof player.buyables, {
				pfid: Number(pf),
				prev: Number(pf) == 2 ? 0 : Number(pflist[Number(i) - 1]),
				pprev: Number(pf) <= 3 ? 0 : Number(pflist[Number(i) - 2]),
				n: Number(i),
				currency: '乘法能量',

				description: '因数能量×' + pf,
				more() {
					if (player.upgrades[36] && Number(i) !== pflist.length - 1) {
						return player.buyables['pf' + pflist[Number(i) + 1] as PrimeFactorTypes].div(2).floor();
					}
					return new Decimal(0);
				},
				effect(x) {
					return new Decimal(this.pfid).pow(x.add(this.more?.() ?? 0));
				},
				effD(x) {
					return 'x' + formatWhole(this.effect(x));
				},
				cost(x) {
					return new Decimal(this.pfid).pow(x.mul(2).add(this.n ?? 0));
				},
				canAfford(x) {
					return player.multiplication.mulpower.gte(this.cost(x));
				},
				buy(x) {
					player.multiplication.mulpower = player.multiplication.mulpower.sub(
						this.cost(x),
					);
				},
				capped() {
					return false;
				},
				get requirement() {
					if (this.pfid == 2) return [];
					return [
						[
							'购买质因数' + this.prev,
							() => {
								return player.buyables[
									('pf' + this.prev) as keyof typeof player.buyables
								].gte(1);
							},
						] as singleReq,
					];
				},
				show() {
					return (
						(this.pfid ?? 1) <= 3 ||
						player.buyables[('pf' + this.pprev) as keyof typeof player.buyables].gte(1)
					);
				},
				canBuyMax() {
					return player.upgrades[39] || player.upgrades['415q'];
				},
				autoBuyMax() {
					return player.upgrades['415q'];
				},
				canBuy() {
					return player.multiplication.mulpower
						.max(1)
						.log(this.pfid ?? 0)
						.sub(this.n ?? 0)
						.div(2)
						.add(1)
						.floor()
						.sub(player.buyables[('pf' + this.pfid) as keyof typeof player.buyables]);
				},
				buyMax() {
					player.buyables[('pf' + this.pfid) as keyof typeof player.buyables] =
						player.buyables[('pf' + this.pfid) as keyof typeof player.buyables].add(
							this?.canBuy?.() ?? 0,
						);
				},
			});
		}
	},
	power() {
		let pflist = ['2', '3', '5', '7', '11', '13', '17', '19'];
		let base = new Decimal(1);
		for (let i in pflist)
			base = base.mul(
				buyables['pf' + pflist[i]].effect(
					player.buyables[('pf' + pflist[i]) as keyof typeof player.buyables],
				),
			);
		return base;
	},
	powerEff() {
		let sec = player.multiplication.pfTime.div(1000);
		let exp = new Decimal(0.99);
		if (!player.buyables['33'].eq(0))
			exp = exp.sub(buyables['33'].effect(player.buyables['33']));
		let base = this.power()
			.root(2)
			.pow(new Decimal(1).sub(exp.pow(sec)));
		if (CHALLENGE.inChallenge(0, 1)) {
			base = this.power().root(2).pow(sec.pow_base(0.99999).neg().add(1));
		}
		return base;
	},
};
