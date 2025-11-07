import Decimal from 'break_eternity.js';
import { buyables, upgrades, SOFTCAPS } from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { format, formatWhole } from '@/utils/format';
import { Addition } from '../addition/addition.ts';
import { PrimeFactor } from './pf.ts';
import { getMCB19Effect } from '../exponention/chessboard.ts';
import { CHALLENGE } from '../challenge.ts';
import { MULTI_CHALS } from './challenges.ts';
import { feature } from '../global.ts';
import { Upgrade } from '../upgrade.ts';
import { Currencies } from '../currencies.ts';
import { CurrencyRequirement, Requirement } from '../requirements.ts';
import { Buyable } from '../buyable.ts';
import { Logarithm } from '../exponention/logarithm.ts';
import { DC } from '@/core/constants';
import { updateResetStatData } from '../stats.ts';
import type { $t } from '@/utils/types.ts';
const D179E308 = Decimal.pow(2, 1024);
export const Multiplication = {
	upgrades: {
		'31': new (class U21 extends Upgrade {
			cost = DC.D_0;
			name = 'U2-1';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, DC.D_1)];
			}
			keep(): boolean {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		})(),
		'32': new (class U22 extends Upgrade {
			cost = DC.D_1;
			name = 'U2-2';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, DC.D_1)];
			}
			keep() {
				return player.upgrades['411q'] && !player.exponention.logarithm.in_dilate;
			}
		})(),
		'33': new (class U23 extends Upgrade {
			cost = new Decimal(2);
			name = 'U2-3';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(2))];
			}
			keep() {
				return player.upgrades['411q'] && !player.exponention.logarithm.in_dilate;
			}
		})(),
		'34': new (class U24 extends Upgrade {
			cost = new Decimal(3);
			name = 'U2-4';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(3))];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		})(),
		'35': new (class U25 extends Upgrade {
			cost = new Decimal(47);
			name = 'U2-5';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(47))];
			}
			keep() {
				return (
					player.upgrades['451q'] &&
					!player.exponention.logarithm.in_dilate &&
					player.singularity.stage < 8
				);
			}
			show() {
				return player.singularity.stage < 8;
			}
		})(),
		'36': new (class U26 extends Upgrade {
			cost = new Decimal(101);
			name = 'U2-6';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(101))];
			}
			show() {
				return player.singularity.stage < 7;
			}
			keep() {
				return (
					player.upgrades['451q'] &&
					!player.exponention.logarithm.in_dilate &&
					player.singularity.stage < 7
				);
			}
		})(),
		'37': new (class U27 extends Upgrade {
			cost = new Decimal(1000);
			name = 'U2-7';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(1000)),
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		})(),
		'38': new (class U28 extends Upgrade {
			cost = new Decimal(10000);
			name = 'U2-8';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(10000)),
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		})(),
		'39': new (class U28 extends Upgrade {
			cost = new Decimal(1e21);
			name = 'U2-9';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(1e21)),
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
			show() {
				return player.singularity.stage < 6;
			}
		})(),
		'310': new (class U210 extends Upgrade {
			cost = new Decimal(1e50);
			name = 'U2-10';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(1e50)),
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
			show() {
				return player.singularity.stage < 6;
			}
		})(),
	} as const,
	buyables: {
		'31': new (class B21 extends Buyable<Decimal> {
			name = 'B2-1';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			effect(x: Decimal) {
				return x.mul(0.5).add(1);
			}
			effectDescription(x: Decimal) {
				return '*' + format(this.effect(x));
			}
			effectDilated(value: Decimal): [Decimal, string] {
				return [this.effect(value), '在对数膨胀后增加加法能量获取'];
			}
			cost(x: Decimal) {
				const a = x.mul(1000).add(10);
				return a;
			}
			capped(x: Decimal) {
				const capc = 500;
				return x.gte(capc);
			}
			canBuyMax(): boolean {
				return player.upgrades[39] && player.singularity.stage < 7;
			}
			autoBuyMax(): boolean {
				return player.upgrades['452q'] && player.singularity.stage < 7;
			}
			costInverse(x: Decimal): Decimal {
				return x.sub(10).max(0).div(1000).add(1).floor().min(500);
			}
		})(),
		'32': new (class B22 extends Buyable<Decimal> {
			name = 'B2-2';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			effect(x: Decimal) {
				return x.pow_base(CHALLENGE.inChallenge(0, 3) ? 1 : 2);
			}
			effectDescription(x: Decimal) {
				return '*' + formatWhole(this.effect(x).round());
			}
			cost(x: Decimal) {
				const a = x.add(1).pow10();
				return a;
			}
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['452q'];
			}
			costInverse(x: Decimal): Decimal {
				return x.max(10).log10().floor();
			}
		})(),
		'33': new (class B23 extends Buyable<Decimal> {
			name = 'B2-3';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			effect(x: Decimal) {
				return new Decimal(0.01).mul(x);
			}
			effectDescription(x: Decimal) {
				if (this.effect(x).gte(0.99)) return '瞬间达到上限';
				return 'x' + format(Decimal.sub(0.99, this.effect(x)).log(0.99));
			}
			cost(x: Decimal) {
				const a = new Decimal(5).pow(x.add(1));
				return a;
			}
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['452q'];
			}
			costInverse(x: Decimal): Decimal {
				return x.max(1).log(5).floor().min(99);
			}
			capped(x: Decimal) {
				const capc = 99;
				return x.gte(capc);
			}
			requirements(): Requirement[] {
				return [
					new (class extends Requirement {
						reachedReq(): boolean {
							return PrimeFactor.power().gte(10000);
						}
						reqDescription($t: $t): string {
							return $t('mul.byl33req');
						}
						progress(): [string, string] {
							return [format(PrimeFactor.power()), format(10000)];
						}
					})(),
				];
			}
			show() {
				return player.singularity.stage < 7;
			}
		})(),
	} as const,
	initMechanics() {},
	mulpower_gain(bulk = DC.D_1, recordtoreset = false) {
		let adding = this.gain().mul(bulk);
		let softcaps = 0,
			scList = ['mulpower^1', 'mulpower^2'];
		if (player.singularity.stage < 2)
			for (let i = 0; i < scList.length; i++) {
				if (SOFTCAPS.reach(scList[i], adding)) {
					softcaps++;
					adding = SOFTCAPS.staticComputed(scList[i], adding);
				}
			}
		if (recordtoreset) {
			updateResetStatData('recent10MulReset', adding);
		}
		player.multiplication.mulpower = player.multiplication.mulpower.add(adding);
		player.multiplication.totalMulpower = player.multiplication.totalMulpower.add(adding);
		player.stat.totalMulpower = player.stat.totalMulpower.add(adding);
	},
	powerEff() {
		const base = player.multiplication.totalMulpower.add(1);
		return base;
	},
	reset(force = false) {
		if (this.gain().gt(0) || force) {
			this.mulpower_gain(DC.D_1, true);
			if (CHALLENGE.inChallenge(0, 3)) {
				player.challenges[0][3] = player.challenges[0][3].add(this.gain());
			}
			const reset_upgrades: Array<keyof typeof player.upgrades> = [21, 22, 23, 24, 25].map(
				(x) => x.toString() as keyof typeof player.upgrades,
			);
			if (!player.upgrades[37] || force)
				for (const i in reset_upgrades) player.upgrades[reset_upgrades[i]] = false;
			if (!player.upgrades[34] || force) player.buyables[21] = DC.D_0;
			if (!player.upgrades['435q']) player.multiplication.pfTime = DC.D_0;
			Addition.reset();
			player.totalAddpower = DC.D_0;
			player.addpower = DC.D_0;
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
		if (player.totalAddpower.lt(3125)) return DC.D_0;
		if (CHALLENGE.inChallenge(0, 3) && player.totalAddpower.lt(D179E308)) return DC.D_0;
		let base = player.totalAddpower.sub(3124).pow(0.1);
		if (CHALLENGE.inChallenge(0, 3)) base = player.totalAddpower.div(D179E308).pow(1 / 1024);
		if (player.buyables[32].gt(0)) base = base.mul(buyables[32].effect(player.buyables[32]));
		if (CHALLENGE.amountChallenge(0, 3).gt(0) && !CHALLENGE.inChallenge(0, 3)) {
			base = base.mul(MULTI_CHALS[3].effect?.(player.challenges[0][3]) ?? 1);
		}
		if (player.upgrades[41]) base = base.mul(10);

		if (player.upgrades.ts21 && player.stat.chapter == 2) base = base.mul(2);
		if (player.upgrades.ts22) base = base.mul(2);
		if (player.upgrades.ts23 && player.stat.chapter == 2) base = base.mul(3);

		if (player.firstResetBit & 0b100) base = base.pow(buyables[44].effect(player.buyables[44]));
		if (player.upgrades[47]) base = base.pow(feature.ChessBoard.wgEffect()[0]);

		if (player.milestones.cb19) base = base.log10().pow(getMCB19Effect()).pow_base(10);
		if (player.upgrades[410]) base = base.pow(upgrades[410].effect());

		if (player.exponention.logarithm.in_dilate) {
			base = base.add(10).iteratedlog(Math.E, Logarithm.dilateNerf().div(2).toNumber());
		}
		if (player.upgrades[310]) base = base.pow(1.1);

		if (
			player.singularity.enabled ||
			player.exponention.logarithm.upgrades_in_dilated.includes('39')
		)
			base = base.pow(feature.SingularityGenerator.getSingularityEffect());

		return base.floor();
	},
};
