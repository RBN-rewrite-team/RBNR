import { eulerFunction } from '@/utils/algorithm';
import { BUYABLES, buyables, upgrades, UPGRADES } from '../mechanic';
import { player } from '../save';
import { format, formatWhole } from '@/utils/format';
import Decimal from 'break_eternity.js';
import { Buyable } from '../buyable';
import { Currencies } from '../currencies';
import { Upgrade, UpgradeWithEffect } from '../upgrade';

export const NUMTHEORY = {
	buyables: {
		'35R': new (class B35R extends Buyable<Decimal> {
			description = 's<sub>1</sub>→s<sub>1</sub>+1';
			cost(x: Decimal) {
				return x.pow_base(1e8).mul(1e32);
			}
			name = 'B2-R1-5';
			effect(x: Decimal): Decimal {
				return x.add(1);
			}
			effectDescription(x: Decimal) {
				return `s<sub>1</sub> = ${formatWhole(x)}`;
			}
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['444q'];
			}
			costInverse(x: Decimal) {
				return x.div(1e32).max(1).log(1e8).add(1).floor();
			}
		})(),
		'36R': new (class B36R extends Buyable<Decimal> {
			description = 'x<sub>1</sub>指数+0.085';
			cost(x: Decimal) {
				return x.pow_base(1e16).mul(1e32);
			}
			name = 'B2-R1-6';
			effect(x: Decimal): Decimal {
				return x.mul(0.085);
			}
			effectDescription(x: Decimal) {
				return `+${format(x)}`;
			}
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['444q'];
			}
			costInverse(x: Decimal) {
				return x.div(1e32).max(1).log(1e16).add(1).floor().min(20);
			}
			capped(): boolean {
				let capc = 20;
				return player.buyables['36R'].gte(capc);
			}
		})(),
		'37R': new (class B37R extends Buyable<Decimal> {
			description = 'y<sub>1</sub>指数+0.085';
			cost(x: Decimal) {
				return x.pow_base(1e20).mul(1e40);
			}
			name = 'B2-R1-7';
			effect(x: Decimal): Decimal {
				return x.mul(0.085);
			}
			effectDescription(x: Decimal) {
				return `+${format(x)}`;
			}
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['444q'];
			}
			costInverse(x: Decimal) {
				return x.div(1e32).max(1).log(1e16).add(1).floor().min(20);
			}
			capped(): boolean {
				let capc = 20;
				return player.buyables['37R'].gte(capc);
			}
		})(),
		'38R': new (class B38R extends Buyable<Decimal> {
			description = 'B2-R1-1~4的效果+2.5%(叠乘)';
			cost(x: Decimal) {
				return x.pow_base(1e25).mul(1e50);
			}
			name = 'B2-R1-8';
			effect(x: Decimal): Decimal {
				return new Decimal(1.025).pow(x);
			}
			effectDescription(x: Decimal) {
				return '×' + format(this.effect(x));
			}
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			canBuyMax(): boolean {
				return player.upgrades[39] && player.upgrades['400q'];
			}
			autoBuyMax(): boolean {
				return player.upgrades['444q'] && player.upgrades['400q'];
			}
			costInverse(x: Decimal) {
				return x.div(1e50).max(1).log(1e25).add(1).floor();
			}
			capped(): boolean {
				return false;
			}
			show() {
				return player.upgrades['400q'];
			}
		})(),
		'31R': new (class B31R extends Buyable<Decimal> {
			description = 'x<sub>1</sub>→x<sub>1</sub>+1';
			cost(x: Decimal) {
				return x.pow_base(2).mul(10);
			}
			name = 'B2-R1-1';
			effect(x: Decimal): Decimal {
				return x.mul(buyables['38R'].effect(player.buyables['38R']));
			}
			effectDescription(x: Decimal) {
				return `x<sub>1</sub> = ${format(x)}`;
			}
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['444q'];
			}
			costInverse(x: Decimal) {
				return x.div(10).max(1).log(2).add(1).floor();
			}
		})(),
		'32R': new (class B32R extends Buyable<Decimal> {
			description = 'x<sub>2</sub>→x<sub>2</sub>+1';
			cost(x: Decimal) {
				return x.pow_base(10).mul(100);
			}
			name = 'B2-R1-2';
			effect(x: Decimal): Decimal {
				return x.mul(buyables['38R'].effect(player.buyables['38R']));
			}
			effectDescription(x: Decimal) {
				return `x<sub>2</sub> = ${format(x)}`;
			}
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['444q'];
			}
			costInverse(x: Decimal) {
				return x.div(100).max(1).log(10).add(1).floor();
			}
		})(),
		'33R': new (class B33R extends Buyable<Decimal> {
			description = 'y<sub>1</sub>→y<sub>1</sub>+1';
			cost(x: Decimal) {
				return x.pow_base(100).mul(1e28);
			}
			name = 'B2-R1-3';
			effect(x: Decimal): Decimal {
				return x.mul(buyables['38R'].effect(player.buyables['38R']));
			}
			effectDescription(x: Decimal) {
				return `y<sub>1</sub> = ${format(x)}`;
			}
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['444q'];
			}
			costInverse(x: Decimal) {
				return x.div(1e28).max(1).log(100).floor().add(1);
			}
		})(),
		'34R': new (class B34R extends Buyable<Decimal> {
			description = 'z<sub>1</sub>→z<sub>1</sub>+1';
			cost(x: Decimal) {
				return x.pow_base(1000).mul(1e30);
			}
			name = 'B2-R1-3';
			effect(x: Decimal): Decimal {
				return x.mul(buyables['38R'].effect(player.buyables['38R']));
			}
			effectDescription(x: Decimal) {
				return `z<sub>1</sub> = ${format(x)}`;
			}
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			canBuyMax(): boolean {
				return player.upgrades[39];
			}
			autoBuyMax(): boolean {
				return player.upgrades['444q'];
			}
			costInverse(x: Decimal) {
				return x.div(1e30).max(1).log(1000).add(1).floor();
			}
		})(),
		'41R': new (class B41R extends Buyable<Decimal> {
			description = 'x<sub>2,1</sub> += 等级';
			cost(x: Decimal) {
				return x.pow_base(1.5).mul(10);
			}
			name = 'B3-R1-1';
			effect(x: Decimal): Decimal {
				return x.mul(x.add(1)).div(2);
			}
			effectDescription(x: Decimal) {
				return `x<sub>2,1</sub> = ` + formatWhole(this.effect(x));
			}
			currency: Currencies = Currencies.EXPONENTION_POWER;
			costInverse(x: Decimal) {
				return x.div(10).max(1).log(1.5).add(1).floor();
			}
			canBuyMax(): boolean {
				return player.milestones.dil_3;
			}
			autoBuyMax(): boolean {
				return player.milestones.dil_3;
			}
		})(),
		'42R': new (class B42R extends Buyable<Decimal> {
			description = 'x<sub>2,2</sub>→x<sub>2,2</sub>+0.2';
			cost(x: Decimal) {
				return x.pow(2).pow_base(3).mul(4000);
			}
			name = 'B3-R1-2';
			effect(x: Decimal): Decimal {
				return x.mul(0.2).add(1);
			}
			effectDescription(x: Decimal) {
				return `x<sub>2,2</sub> = ` + format(this.effect(x));
			}
			currency: Currencies = Currencies.EXPONENTION_POWER;
			costInverse(x: Decimal) {
				return x.div(4000).max(1).log(3).root(2).add(1).floor();
			}
			canBuyMax(): boolean {
				return player.milestones.dil_3;
			}
			autoBuyMax(): boolean {
				return player.milestones.dil_3;
			}
		})(),
		'43R': new (class B43R extends Buyable<Decimal> {
			description = 'y<sub>2,1</sub> += 等级';
			cost(x: Decimal) {
				return x.pow_base(2.5).mul(100000);
			}
			name = 'B3-R1-3';
			effect(x: Decimal): Decimal {
				return x.mul(x.add(1)).div(2);
			}
			effectDescription(x: Decimal) {
				return `y<sub>2,1</sub> = ` + formatWhole(this.effect(x));
			}
			currency: Currencies = Currencies.EXPONENTION_POWER;
			costInverse(x: Decimal) {
				return x.div(100000).max(1).log(2.5).add(1).floor();
			}
			canBuyMax(): boolean {
				return player.milestones.dil_3;
			}
			autoBuyMax(): boolean {
				return player.milestones.dil_3;
			}
		})(),
		'44R': new (class B44R extends Buyable<Decimal> {
			description = 'y<sub>2,2</sub>→y<sub>2,2</sub>+0.2';
			cost(x: Decimal) {
				return x.pow(2).pow_base(10).mul(1e9);
			}
			name = 'B3-R1-4';
			effect(x: Decimal): Decimal {
				return x.mul(0.16).add(0.8);
			}
			effectDescription(x: Decimal) {
				return `y<sub>2,2</sub> = ` + format(this.effect(x));
			}
			currency: Currencies = Currencies.EXPONENTION_POWER;
			costInverse(x: Decimal) {
				return x.div(1e9).max(1).log(10).root(2).add(1).floor();
			}
			canBuyMax(): boolean {
				return player.milestones.dil_3;
			}
			autoBuyMax(): boolean {
				return player.milestones.dil_3;
			}
		})(),
	} as const,
	upgrades: {
		'31R': new (class U31R extends UpgradeWithEffect<Decimal> {
			description: string = '将u<sub>1</sub>加入x获取速度公式';
			cost = new Decimal(1e4);
			name = 'U2-R1-1';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			keep() {
				return player.upgrades['454q'];
			}
			effect() {
				return player.multiplication.mulpower.add(Math.E).ln().floor().max(1);
			}
			effectDescription(x: Decimal) {
				return `u<sub>1</sub> = ${formatWhole(x)}`;
			}
		})(),
		'32R': new (class U32R extends Upgrade {
			description: string = 'x<sub>1</sub>的指数+0.3';
			cost = new Decimal(1e30);
			name = 'U2-R1-2';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			keep() {
				return player.upgrades['454q'];
			}
		})(),
		'33R': new (class U33R extends Upgrade {
			description: string = 'y<sub>1</sub>的指数+0.3';
			cost = new Decimal(1e35);
			name = 'U2-R1-3';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			keep() {
				return player.upgrades['454q'];
			}
		})(),
		'34R': new (class U34R extends Upgrade {
			description: string = 'z<sub>1</sub>的指数+0.3';
			cost = new Decimal(1e40);
			name = 'U2-R1-4';
			currency: Currencies = Currencies.MULTIPLICATION_POWER;
			keep() {
				return player.upgrades['454q'];
			}
		})(),
		'41R': new (class U41R extends Upgrade {
			description: string = '将y加入m的增长率公式中，但指数降低到1/2';
			cost = new Decimal(3e10);
			name = 'U3-R1-1';
			currency: Currencies = Currencies.EXPONENTION_POWER;
			keep() {
				return false;
			}
		})(),
		'42R': new (class U42R extends Upgrade {
			description: string = '将y在m增长率公式中的指数增加到3/4';
			cost = new Decimal(6e10);
			name = 'U3-R1-2';
			currency: Currencies = Currencies.EXPONENTION_POWER;
			keep() {
				return false;
			}
		})(),
		'43R': new (class U43R extends UpgradeWithEffect<Decimal> {
			description: string = 'm增加麦粒底数';
			cost = new Decimal(6e10);
			name = 'U3-R1-3';
			currency: Currencies = Currencies.EXPONENTION_POWER;
			keep() {
				return false;
			}
			effect() {
				return player.numbertheory.rational_approx.m
					.sub(5000000)
					.max(1)
					.root(20)
					.ln()
					.add(1);
			}
			effectDescription(x: Decimal) {
				return '×' + format(x);
			}
			show() {
				return player.singularity.stage < 3;
			}
		})(),
		'44R': new (class U44R extends UpgradeWithEffect<Decimal> {
			description: string = 'm降低膨胀层数';
			cost = new Decimal(2e17);
			name = 'U3-R1-4';
			currency: Currencies = Currencies.EXPONENTION_POWER;
			keep() {
				return false;
			}
			effect() {
				return player.numbertheory.rational_approx.m
					.sub(5000000)
					.max(1)
					.root(20)
					.ln()
					.add(1)
					.root(5)
					.sub(1)
					.mul(2)
					.min(0.5);
			}
			effectDescription(x: Decimal) {
				return '-' + format(x);
			}
			show() {
				return player.singularity.stage < 1;
			}
		})(),
	} as const,
	initMechanics() {},
	funcS(x = player.numbertheory.euler.x.floor()) {
		if (x.gte(1000)) {
			return x.pow(2).mul(3 / Math.PI ** 2);
		}
		return Decimal.fromNumber(sumEulers[x.toNumber()]);
	},
	tau1DilateEff() {
	  if (player.milestones.cb20) return NUMTHEORY.funcS().max(10).slog().pow(0.75).div(5).min(1e9)
		return NUMTHEORY.funcS().max(10).slog().pow(0.6).div(5).min(0.3125);
	},
	varXgain() {
		let x = new Decimal(0);
		let exp = new Decimal(1);
		if (player.upgrades['32R']) exp = exp.add(0.3);
		if (player.buyables['36R'].gte(1)) exp = exp.add(player.buyables['36R'].mul(0.085));
		if (player.buyables['31R'].gte(1))
			x = x.add(buyables['31R'].effect(player.buyables['31R']).pow(exp));
		if (player.buyables['32R'].gte(1))
			x = x.mul(buyables['32R'].effect(player.buyables['32R']));
		if (player.upgrades['31R']) x = x.mul(upgrades['31R'].effect?.() ?? 1);
		return x.mul(player.numbertheory.euler.y.floor()).mul(player.numbertheory.euler.s);
	},
	varYgain() {
		let y = new Decimal(0);
		let exp = new Decimal(1);
		if (player.upgrades['33R']) exp = exp.add(0.3);
		if (player.buyables['37R'].gte(1)) exp = exp.add(player.buyables['36R'].mul(0.085));
		if (player.buyables['33R'].gte(1))
			y = y.add(buyables['33R'].effect(player.buyables['33R']).pow(exp));
		return y.mul(player.numbertheory.euler.z.floor()).mul(player.numbertheory.euler.s);
	},
	varZgain() {
		let z = new Decimal(0);
		let exp = new Decimal(1);
		if (player.upgrades['34R']) exp = exp.add(0.3);
		if (player.buyables['34R'].gte(1))
			z = z.add(buyables['34R'].effect(player.buyables['34R']).pow(exp));
		return z.mul(player.numbertheory.euler.s);
	},
	tickspeedGain() {
		let base = new Decimal(0);
		if (player.buyables['35R'].gte(1)) base = base.add(player.buyables['35R']);
		return base;
	},
	tau2A() {
		let n = player.numbertheory.rational_approx.n.floor().max(1);
		let error: Decimal;
		if (n.eq(0)) return new Decimal(1);
		if (n.gt(50)) {
			error = Decimal.pow(0.171572875253809902, n).mul(2.828427124746190097);
		} else {
			error = Decimal.fromNumber(rational_approx_sqrt2_errors[n.toNumber() - 1]!);
		}
		return new Decimal(1).sub(error.log(10).div(100));
	},
	tau2B() {
		let m = player.numbertheory.rational_approx.m.floor().max(1);
		let error = new Decimal(2.236067977499789696).div(
			Decimal.pow(1.618033988749894848, m.mul(2)).sub(m.mod(2).eq(1) ? -1 : 1),
		);
		return new Decimal(1).sub(error.log(10).div(100));
	},
	tau2() {
		return this.tau2A().mul(player.milestones.cb8 ? this.tau2B() : 1);
	},
	varX2gain() {
		let base = new Decimal(0);
		if (player.buyables['41R'].gte(1))
			base = base
				.add(buyables['41R'].effect(player.buyables['41R']))
				.pow(buyables['42R'].effect(player.buyables['42R']));
		base = base.mul(player.numbertheory.rational_approx.y);
		return base;
	},
	varY2gain() {
		let base = new Decimal(0);
		if (player.buyables['43R'].gte(1))
			base = base
				.add(buyables['43R'].effect(player.buyables['43R']))
				.pow(buyables['44R'].effect(player.buyables['44R']));
		return base;
	},
	Y2toM2Exp() {
		let base = new Decimal(0.5);
		if (player.upgrades['42R']) base = new Decimal(0.75);
		return base;
	},
	varM2gain() {
		let base = new Decimal(0);
		if (player.upgrades['41R'])
			base = base.add(player.numbertheory.rational_approx.y.pow(this.Y2toM2Exp()));
		return base;
	},
};

// prettier-ignore
const sumEulers = [
  0,1,2,4,6,10,12,18,22,28,32,42,46,58,64,72,80,96,102,120,128,140,150,172,180,200,212,230,242,270,278,308,324,344,360,384,396,432,450,474,490,530,542,584,604,628,650,696,712,754,774,806,830,882,900,940,964,1000,1028,1086,1102,1162,1192,1228,1260,1308,1328,1394,1426,1470,1494,1564,1588,1660,1696,1736,1772,1832,1856,1934,1966,2020,2060,2142,2166,2230,2272,2328,2368,2456,2480,2552,2596,2656,2702,2774,2806,2902,2944,3004,3044,
  3144,3176,3278,3326,3374,3426,3532,3568,3676,3716,3788,3836,3948,3984,4072,4128,4200,4258,4354,4386,4496,4556,4636,4696,4796,4832,4958,5022,5106,5154,5284,5324,5432,5498,5570,5634,5770,5814,5952,6000,6092,6162,6282,6330,6442,6514,6598,6670,6818,6858,7008,7080,7176,7236,7356,7404,7560,7638,7742,7806,7938,7992,8154,8234,8314,8396,8562,8610,8766,8830,8938,9022,9194,9250,9370,9450,9566,9654,9832,9880,10060,10132,10252,10340,10484,10544,10704,10796,10904,10976,11166,11230,11422,11518,11614,11698,11894,11954,12152,12232,
  12364,12464,12632,12696,12856,12958,13090,13186,13366,13414,13624,13728,13868,13974,14142,14214,14394,14502,14646,14726,14918,14990,15212,15308,15428,15540,15766,15838,16066,16154,16274,16386,16618,16690,16874,16990,17146,17242,17480,17544,17784,17894,18056,18176,18344,18424,18640,18760,18924,19024,19274,19346,19566,19692,19820,19948,20204,20288,20504,20600,20768,20898,21160,21240,21448,21556,21732,21864,22132,22204,22474,22602,22746,22882,23082,23170,23446,23584,23764,23860,24140,24232,24514,24654,24798,24918,25158,25254,25526,25638,25830,25974,26266,26350,26582,26726,26906,27054,27318,27398,
  27650,27800,28000,28144,28384,28480,28786,28906,29110,29230,29540,29636,29948,30104,30248,30404,30720,30824,31104,31232,31444,31576,31864,31972,32212,32374,32590,32750,33026,33106,33436,33600,33816,33982,34246,34342,34678,34834,35058,35186,35486,35594,35888,36056,36232,36404,36750,36862,37210,37330,37546,37706,38058,38174,38454,38630,38822,39000,39358,39454,39796,39976,40196,40340,40628,40748,41114,41290,41530,41674,41986,42106,42478,42638,42838,43022,43358,43466,43844,43988,44240,44430,44812,44940,45180,45372,45624,45816,46204,46300,46652,46820,47080,47276,47588,47708,48104,48302,48518,48678,
  49078,49210,49570,49770,49986,50154,50514,50642,51050,51210,51482,51686,52034,52166,52494,52686,52962,53142,53560,53656,54076,54286,54562,54770,55090,55230,55590,55802,56042,56210,56640,56784,57216,57396,57620,57836,58232,58376,58814,58974,59226,59418,59860,60004,60356,60578,60874,61066,61514,61634,62034,62258,62558,62784,63072,63216,63672,63900,64188,64364,64824,64944,65406,65630,65870,66102,66568,66712,67108,67292,67604,67836,68256,68412,68772,68964,69276,69514,69992,70120,70552,70792,71056,71276,71660,71822,72308,72548,72872,73040,73530,73690,74138,74354,74594,74834,75254,75418,75916,76116,
  76448,76698,77200,77344,77744,77964,78276,78528,79036,79164,79596,79852,80176,80432,80840,81008,81468,81684,82028,82220,82740,82908,83430,83690,83930,84192,84672,84832,85338,85546,85894,86110,86590,86766,87190,87454,87810,88078,88498,88642,89182,89452,89812,90068,90500,90644,91190,91462,91822,92022,92526,92702,93170,93446,93734,94010,94566,94746,95250,95442,95762,96042,96604,96788,97236,97518,97842,98122,98690,98834,99404,99644,100024,100264,100704,100896,101472,101744,102128,102352,102844,103036,103556,103844,104132,104424,105010,105178,105718,105950,106342,106630,107222,107402,107786,108082,108478,108742,109340,109500,
  110100,110352,110748,111048,111488,111688,112294,112582,112918,113158,113710,113902,114514,114820,115140,115380,115996,116200,116818,117058,117454,117764,118292,118484,118984,119296,119656,119968,120544,120688,121318,121630,122050,122366,122870,123078,123582,123862,124282,124538,125178,125390,126032,126296,126632,126920,127566,127782,128362,128602,128962,129286,129938,130154,130674,130994,131426,131702,132360,132520,133180,133510,133894,134222,134654,134870,135486,135818,136262,136526,137126,137318,137990,138326,138686,138998,139674,139898,140474,140730,141182,141482,142164,142380,142924,143218,143674,144010,144634,144810,145500,145844,146204,146550,147102,147326,147966,148314,148778,149018,
  149718,149934,150582,150902,151270,151622,152222,152454,153162,153442,153910,154262,154922,155114,155594,155950,156426,156784,157502,157694,158306,158648,159128,159488,160048,160268,160994,161282,161768,162056,162728,162968,163700,164066,164402,164754,165414,165654,166392,166680,167112,167424,168166,168406,168998,169370,169862,170182,170818,171018,171768,172136,172636,172972,173572,173788,174544,174922,175362,175650,176410,176662,177310,177690,178074,178456,179152,179408,180176,180416,180928,181312,182084,182336,182936,183320,183752,184140,184860,185052,185752,186104,186608,186944,187568,187828,188614,189006,189530,189842,190514,190754,191474,191870,192286,192682,193478,193694,194430,194750,
  195278,195678,196398,196662,197190,197550,198086,198486,199294,199510,200320,200656,201196,201556,202204,202460,203216,203624,204056,204376,205196,205468,206290,206698,207098,207446,208272,208536,209364,209692,210244,210628,211300,211576,212240,212600,213140,213558,214396,214588,215400,215820,216380,216800,217424,217700,218360,218776,219340,219660,220452,220732,221584,221944,222376,222800,223656,223896,224754,225090,225570,226000,226862,227150,227838,228270,228814,229174,229954,230178,230970,231402,231978,232374,232974,233262,234138,234576,235160,235480,236360,236612,237494,237878,238342,238784,239670,239958,240714,241066,241606,242050,242878,243174,243886,244270,244798,245246,246086,246326,
  247158,247558,248062,248510,249230,249530,250436,250888,251488,251776,252686,252974,253794,254250,254730,255186,255966,256254,257172,257524,258136,258596,259436,259676,260396,260858,261470,261918,262846,263086,263842,264306,264926,265392,266032,266320,267256,267652,268276,268644,269584,269896,270776,271240,271672,272092,273038,273350,274214,274574,275206,275590,276542,276854,277614,278090,278650,279128,279944,280200,281130,281562,282198,282678,283446,283710,284676,285116,285692,286076,287046,287370,288198,288684,289164,289644,290620,290944,291824,292160,292808,293298,294280,294600,295384,295832,296384,296816,297740,297980,298970,299450,300110,300530,301322,301650,302646,303144,303792,304192
]

const rational_approx_sqrt2_errors = [
	0.41421356237309503, 0.08578643762690495, 0.014213562373095049, 0.0024531042935716178,
	0.00042045892481918675, 0.00007215191261923692, 0.000012378941142386079, 0.00000212390141475512,
	3.644035519015936e-7, 6.252177458954987e-8, 1.072704035449756e-8, 1.8404691647625248e-9,
	3.1577458617355447e-10, 5.4178353688965136e-11, 9.295535918725002e-12, 1.5948618246068547e-12,
	2.7363502888015475e-13, 4.6948348675132784e-14, 8.055063170610772e-15, 1.382030348532765e-15,
	2.371189205857914e-16, 4.068317498198405e-17, 6.980129306112869e-18, 1.197600854693166e-18,
	2.0547582204612666e-19, 3.5254077583594133e-20, 6.0486434554381325e-21, 1.0377831490346604e-21,
	1.780554387698298e-22, 3.0549483584318394e-23, 5.2414627360805735e-24, 8.992928321650453e-25,
	1.5429425690969873e-25, 2.647270929314704e-26, 4.54199884918349e-27, 7.7928380195390715e-28,
	1.337039625399524e-28, 2.2939973285807327e-29, 3.9358771748915525e-30, 6.75289763541986e-31,
	1.1586140636036396e-31, 1.9878674620197703e-32, 3.4106413608222574e-33, 5.851735447358416e-34,
	1.003999075927923e-34, 1.7225900820912195e-35, 2.9554973326808695e-36, 5.0708317517302275e-37,
	8.700171835726687e-38, 1.4927134970578451e-38,
];
