import Decimal from 'break_eternity.js';
import { BUYABLES, upgrades, UPGRADES, buyables, type singleReq } from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { formatWhole } from '@/utils/format';
import { Addition } from '../addition/addition.ts';

export const PrimeFactor = {
	initMechanics() {
		let pflist = ['2', '3', '5', '7', '11', '13', '17', '19'];
		for(let i in pflist)
		{
			let pf = pflist[i];
			BUYABLES.create('pf' + pf, {
				pfid: pf,
				prev: this.pfid == 2 ? 0 : pflist[i - 1],
				pprev: this.pfid <= 3 ? 0 : pflist[i - 2],
				n: i,
				
				description: '质因数' + pf + ',倍增因数能量',
				effect(x) {
					return new Decimal(this.pfid).pow(x);
				},
				effD(x) {
					return 'x' + formatWhole(this.effect(x));
				},
				cost(x) {
					return new Decimal(this.pfid).pow(x.mul(2).add(this.n));
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
					if(this.pfid == 2) return [];
					return [
						[
							'购买质因数' + this.prev,
							() => {
								return player.buyables['pf' + this.prev].gte(1);
							},
						] as singleReq,
					];
				},
				show() {
					return this.pfid <= 3 || player.buyables['pf' + this.pprev].gte(1);
				},
			});
		}
	},
	power(){
		let pflist = ['2', '3', '5', '7', '11', '13', '17', '19'];
		let base = new Decimal(1);
		for(let i in pflist) base = base.mul(buyables['pf' + pflist[i]].effect(player.buyables['pf' + pflist[i]]));
		return base;
	},
	powerEff(){
		let sec = player.multiplication.pftime.div(1000);
		let base = this.power().root(2).pow(new Decimal(1).sub(new Decimal(0.99).pow(sec)));
		return base;
	},
};