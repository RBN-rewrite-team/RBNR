import Decimal from 'break_eternity.js';
import { buyables, BUYABLES, upgrades, UPGRADES, type singleReq, SOFTCAPS } from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { format, formatWhole } from '@/utils/format';
import { Addition } from '../addition/addition.ts';
import { PrimeFactor } from './pf.ts';
import { wgEffect } from '../exponention/chessboard.ts';
import { CHALLENGE } from '../challenge.ts';
import { MULTI_CHALS } from './challenges.ts';
import { feature } from '../global.ts';
import { Upgrade } from '../upgrade.ts';
import { Currencies } from '../currencies.ts';
import { CurrencyRequirement, Requirement } from '../requirements.ts';
import { Buyable } from '../buyable.ts';
const D179E308 = Decimal.pow(2, 1024);
export const Multiplication = {
	upgrades: {
		'31': new class U21 extends Upgrade{
			// @ts-ignore
			get description() {
				let counts = '1';
				if (player.upgrades['400q'])
					counts = "<span style='font-size: 19px;'><b>2</b></span>";
				return (
					'你可以选择' +
					counts +
					'个U1系列升级将其价格降低到1加法能量，改变选择将进行乘法重置'
				);
			}
			cost= new Decimal(0)
			name= 'U2-1'
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(1))
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		},
		'32': new class U22 extends Upgrade{
			// @ts-ignore
			description: string = "所有后继升级保持为可购买状态";
			cost= new Decimal(1)
			name= 'U2-2'
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(1))
				];
			}
			keep() {
				return player.upgrades['411q'] && !player.exponention.logarithm.in_dilate;
			}
		},
		'33': new class U23 extends Upgrade{
			// @ts-ignore
			description: string = "U2系列升级购买数量的平方同样作用于U0-2的效果";
			cost= new Decimal(2)
			name= 'U2-3'
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(2))
				];
			}
		},
		'34': new class U24 extends Upgrade{
			// @ts-ignore
			description: string = "在每次乘法重置后保留B1-1";
			cost= new Decimal(3)
			name= 'U2-4'
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(3))
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		},
		'35': new class U25 extends Upgrade{
			// @ts-ignore
			description: string = "解锁数论研究";
			cost= new Decimal(47)
			name= 'U2-5'
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(47))
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		},
		'36': new class U26 extends Upgrade{
			// @ts-ignore
			description: string = "每2个质因数p<sub>n</sub>免费赠送一个p<sub>n-1</sub>";
			cost= new Decimal(101)
			name= 'U2-6'
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(101))
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		},
		'37': new class U27 extends Upgrade{
			// @ts-ignore
			description: string = "乘法重置保留加法升级";
			cost= new Decimal(1000)
			name= 'U2-7'
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(1000))
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		},
		'38': new class U28 extends Upgrade{
			// @ts-ignore
			description: string = "每秒自动获取重置获取加法能量的1%";
			cost= new Decimal(10000)
			name= 'U2-8'
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(10000))
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		},
		'39': new class U28 extends Upgrade{
			// @ts-ignore
			description: string = "解锁乘法挑战，自动最大购买后继、加法购买项，最大购买乘法购买项";
			cost= new Decimal(1e21)
			name= 'U2-9'
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			requirements() {
				return [
					new CurrencyRequirement(Currencies.MULTIPLICATION_POWER, new Decimal(1e21))
				];
			}
			keep() {
				return player.upgrades['451q'] && !player.exponention.logarithm.in_dilate;
			}
		},
	} as const,
	buyables: {
		'31': new class B21 extends Buyable<Decimal> {
			description: string = '增加加法能量获取';
			name= 'B2-1';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			effect(x : Decimal) {
				return x.mul(0.5).add(1);
			}
			effectDescription(x: Decimal) {
				return '*' + format(this.effect(x));
			}
			cost(x:Decimal) {
				let a = x.mul(1000).add(10);
				return a;
			}
			capped(x: Decimal) {
				let capc = 500;
				return x.gte(capc);
			}
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['452q'];
			}
			costInverse(x: Decimal): Decimal {
				return x.max(1)
					.div(1000)
					.floor()
					.min(500)
			}
		},
		'32': new class B22 extends Buyable<Decimal> {
			description: string = '每级将乘法能量获取*2';
			name= 'B2-2';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			effect(x : Decimal) {
				return x.pow_base(CHALLENGE.inChallenge(0, 3) ? 1 : 2);
			}
			effectDescription(x: Decimal) {
				return '*' + formatWhole(x);
			}
			cost(x:Decimal) {
				let a = x.add(1).pow10();
				return a;
			}
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['452q'];
			}
			costInverse(x: Decimal): Decimal {
				return x.log10().sub(1);
			}
		},
		'33': new class B23 extends Buyable<Decimal> {
			description: string = '质因数公式变得更好';
			name= 'B2-3';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			effect(x : Decimal) {
				return new Decimal(0.01).mul(x);
			}
			effectDescription(x: Decimal) {
				return '*' + formatWhole(x);
			}
			cost(x:Decimal) {
				let a = new Decimal(5).pow(x.add(1));
				return a;
			}
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['452q'];
			}
			costInverse(x: Decimal): Decimal {
				return x.max(1)
					.log(5)
					.floor()
					.min(99);
			}
			capped(x: Decimal) {
				let capc = 99;
				return x.gte(capc);
			}
			requirements(): Requirement[] {
				return [
					new class extends Requirement {
						
						reachedReq(): boolean {
							return PrimeFactor.power().gte(10000);
						}
						reqDescription(): string {
							return '获得10000因数能量'
						}
						progress(): [string, string] {
							return [format(PrimeFactor.power()),format(10000)]
						}
					}
				]
			}
		},
	} as const,
	initMechanics() {
		
		SOFTCAPS.create('mulpower^1', {
			name: 'mulpower^1',
			fluid: true,
			start: new Decimal("e5e6"),
			get exponent(){
			    let base = new Decimal(2.5);
			    if(player.upgrades[47]) base = base.pow(wgEffect()[4]);
			    return new Decimal(1).div(base);
			},
			meta: 1
		});
	},
	mulpower_gain(bulk = new Decimal(1)) {
	  let adding = this.gain().mul(bulk);
	  adding = SOFTCAPS.fluidComputed('mulpower^1', adding, player.multiplication.mulpower);
	  player.multiplication.mulpower = player.multiplication.mulpower.add(adding);
		player.multiplication.totalMulpower = player.multiplication.totalMulpower.add(
			adding
		);
	},
	powerEff() {
		let base = player.multiplication.totalMulpower.add(1);
		return base;
	},
	reset(force = false) {
		if (this.gain().gt(0) || force) {
			this.mulpower_gain()
			if (CHALLENGE.inChallenge(0, 3)) {
				player.challenges[0][3] = player.challenges[0][3].add(this.gain());
			}
			let reset_upgrades: Array<keyof typeof player.upgrades> = [21, 22, 23, 24, 25].map(
				(x) => x.toString() as keyof typeof player.upgrades,
			);
			if (!player.upgrades[37] || force)
				for (let i in reset_upgrades) player.upgrades[reset_upgrades[i]] = false;
			if (!player.upgrades[33] || force) player.buyables[21] = new Decimal(0);
			if (!player.upgrades['435q']) player.multiplication.pfTime = new Decimal(0);
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
		let base = player.totalAddpower.sub(3124).pow(0.1);
		if (CHALLENGE.inChallenge(0, 3)) base = player.totalAddpower.div(D179E308).pow(1 / 1024);
		if (player.buyables[32].gt(0)) base = base.mul(buyables[32].effect(player.buyables[32]));
		if (CHALLENGE.amountChallenge(0, 3).gt(0) && !CHALLENGE.inChallenge(0, 3)) {
			base = base.mul(MULTI_CHALS[3].effect?.(player.challenges[0][3]) ?? 1);
		}
		if (player.upgrades[41]) base = base.mul(10);

		if (player.firstResetBit & 0b100) base = base.pow(buyables[44].effect(player.buyables[44]));
		if (player.upgrades[47]) base = base.pow(feature.ChessBoard.wgEffect()[0]);

		if (player.exponention.logarithm.in_dilate) {
			base = base.add(10).ln()
		}

		return base.floor();
	},
};
