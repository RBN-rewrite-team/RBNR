import Decimal from 'break_eternity.js';
import { BUYABLES, upgrades, UPGRADES, buyables, type singleReq } from '../mechanic';
import { player, type PrimeFactorTypes } from '../save';
import ModalService from '@/utils/Modal';
import { format, formatWhole } from '@/utils/format';
import { Addition } from '../addition/addition.ts';
import { CHALLENGE } from '../challenge.ts';
import { NUMTHEORY } from '@/core/multiplication/numbertheory';
import { Upgrade, UpgradeWithEffect } from '../upgrade.ts';
import { Currencies } from '../currencies.ts';
import { Buyable } from '../buyable.ts';
import { Requirement } from '../requirements.ts';

type PrimeList = '2' | '3' | '5' | '7' | '11' | '13' | '17' | '19';

export const PrimeFactor = {
	upgrades: (function () {
		const PFList: Partial<Record<`pf${PrimeList}`, Buyable<Decimal>>> = {};
		let pflist = ['2', '3', '5', '7', '11', '13', '17', '19'] as const;
		for (let i in pflist) {
			i = i;
			let pf = pflist[i];
			PFList[('pf' + pflist[i]) as `pf${PrimeList}`] = new (class extends Buyable<Decimal> {
				pfid = Number(pf);
				prev = Number(pf) == 2 ? 0 : Number(pflist[Number(i) - 1]);
				pprev = Number(pf) <= 3 ? 0 : Number(pflist[Number(i) - 2]);
				n = Number(i);
				currency: Currencies = Currencies.MULTIPLICATION_POWER;
				description = '因数能量×' + pf;
				name = '质因数' + pf;
				more() {
					if (player.upgrades[36] && Number(i) !== pflist.length - 1) {
						return player.buyables[('pf' + pflist[Number(i) + 1]) as PrimeFactorTypes]
							.div(2)
							.floor();
					}
					if (
						player.exponention.logarithm.upgrades_in_dilated.includes('36') &&
						Number(i) !== 0
					) {
						return player.buyables[('pf' + pflist[Number(i) - 1]) as PrimeFactorTypes]
							.div(4)
							.floor();
					}
					return new Decimal(0);
				}
				effect(x: Decimal) {
					return new Decimal(this.pfid).pow(x.add(this.more()));
				}
				effectDescription(x: Decimal) {
					return '*' + formatWhole(this.effect(x));
				}
				cost(x: Decimal) {
					return new Decimal(this.pfid).pow(x.mul(2).add(this.n));
				}
				capped() {
					return false;
				}
				requirements() {
					if (this.pfid == 2) return [];
					return [
						new (class extends Requirement {
							reachedReq(): boolean {
								return player.buyables[
									('pf' +
										(Number(pf) == 2
											? 0
											: Number(
													pflist[Number(i) - 1],
												))) as keyof typeof player.buyables
								].gte(1);
							}
							reqDescription(): string {
								return (
									'购买质因数' +
									(Number(pf) == 2 ? 0 : Number(pflist[Number(i) - 1]))
								);
							}
							progress = undefined;
						})(),
					];
				}
				show() {
					return (
						player.singularity.stage < 7 &&
						((this.pfid ?? 1) <= 3 ||
							player.buyables[
								('pf' + this.pprev) as keyof typeof player.buyables
							].gte(1))
					);
				}
				canBuyMax() {
					return (
						(player.upgrades[39] ||
							(player.upgrades['415q'] && Number(i) <= 3) ||
							(player.upgrades['425q'] && Number(i) <= 7)) &&
						player.singularity.stage < 7
					);
				}
				autoBuyMax() {
					return (
						((player.upgrades['415q'] && Number(i) <= 3) ||
							(player.upgrades['425q'] && Number(i) <= 7)) &&
						player.singularity.stage < 7
					);
				}
				costInverse(x: Decimal) {
					return x
						.max(0.99)
						.log(this.pfid ?? 0)
						.sub(this.n ?? 0)
						.div(2)
						.add(1)
						.floor();
				}
			})();
		}
		return PFList;
	})() as Record<`pf${PrimeList}`, Buyable<Decimal>>,
	initMechanics() {},
	power() {
		if (player.singularity.stage >= 7) return new Decimal(1);
		let pflist = ['2', '3', '5', '7', '11', '13', '17', '19'] as const;
		let base = new Decimal(1);
		for (let i in pflist)
			base = base.mul(
				buyables[('pf' + pflist[i]) as `pf${PrimeList}`].effect(
					player.buyables[('pf' + pflist[i]) as keyof typeof player.buyables].max(0),
				),
			);
		base = base.pow(this.powerpow());
		return base;
	},
	powerpow() {
		let base = new Decimal(1);
		if (player.firstResetBit & 0b100) base = base.mul(buyables[41].effect(player.buyables[41]));
		if (player.upgrades[45]) base = base.mul(NUMTHEORY.tau2());
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
