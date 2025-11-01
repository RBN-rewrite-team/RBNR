import Decimal from 'break_eternity.js';
import { Upgrade } from '../upgrade';
import { Currencies } from '../currencies';
import { UpgradeRequirement, type Requirement } from '../requirements';

class Qol7Upg extends Upgrade {
	name = '7-xxx';
	description: string = '';
	cost = new Decimal(1);
	currency: Currencies = Currencies.QOL_CRYSTAL_POINTS;

	constructor(
		description: string,
		id: string,
		requirement?: () => Requirement[],
		show?: () => boolean,
		cost?: Decimal,
	) {
		super();
		this.description = description;
		this.name = '7-' + id;
		if (requirement) this.requirements = requirement;
		if (show) this.show = show;
		if (cost) this.cost = cost;
	}
}

export const Qol7Upgrades = {
	upgrades: {
		// C系列升级 - NRC保留
		'7c1q': new Qol7Upg('保留NRC1x5', 'C1', undefined, undefined, new Decimal(1)),
		'7c2q': new Qol7Upg(
			'保留NRC2x5',
			'C2',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7c1q')],
			undefined,
			new Decimal(1),
		),
		'7c3q': new Qol7Upg(
			'保留NRC3x5',
			'C3',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7c2q')],
			undefined,
			new Decimal(1),
		),
		'7c4q': new Qol7Upg(
			'保留NRC4x2',
			'C4',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7c3q')],
			undefined,
			new Decimal(2),
		),
		'7c5q': new Qol7Upg(
			'保留NRC5进展',
			'C5',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7c4q')],
			undefined,
			new Decimal(2),
		),
		'7c6q': new Qol7Upg(
			'保留NRC6进展',
			'C6',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7c5q')],
			undefined,
			new Decimal(3),
		),
		'7c7q': new Qol7Upg(
			'在达到eee9推演次数时自动完成NRC7',
			'C7',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7c6q')],
			undefined,
			new Decimal(7),
		),

		// T系列升级 - 免费NCT
		'7t1q': new Qol7Upg(
			'+2免费NCT（非递归理论）',
			'T1',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7c1q')],
			undefined,
			new Decimal(1),
		),
		'7t2q': new Qol7Upg(
			'+2免费NCT',
			'T2',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7t1q')],
			undefined,
			new Decimal(1),
		),
		'7t3q': new Qol7Upg(
			'+4免费NCT',
			'T3',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7t2q')],
			undefined,
			new Decimal(1),
		),
		'7t4q': new Qol7Upg(
			'+10免费NCT',
			'T4',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7t3q')],
			undefined,
			new Decimal(1),
		),
		'7t5q': new Qol7Upg(
			'+100免费NCT',
			'T5',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7t4q')],
			undefined,
			new Decimal(2),
		),
		'7t6q': new Qol7Upg(
			'+10000免费NCT',
			'T6',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7t5q')],
			undefined,
			new Decimal(4),
		),
		'7t7q': new Qol7Upg(
			'证明论重置保留NCT',
			'T7',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7t6q')],
			undefined,
			new Decimal(5),
		),

		// TA系列升级 - NCT自动化
		'7ta1q': new Qol7Upg(
			'自动化第一个NCT购买项',
			'TA1',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7t2q')],
			undefined,
			new Decimal(1),
		),
		'7ta2q': new Qol7Upg(
			'自动化第二个NCT购买项',
			'TA2',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7t2q')],
			undefined,
			new Decimal(1),
		),
		'7ta3q': new Qol7Upg(
			'自动化第三个NCT购买项',
			'TA3',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7t2q')],
			undefined,
			new Decimal(1),
		),
		'7tamq': new Qol7Upg(
			'最大化自动化前三个NCT购买项',
			'TAM',
			(): [UpgradeRequirement, UpgradeRequirement, UpgradeRequirement] => [
				new UpgradeRequirement('7ta1q'),
				new UpgradeRequirement('7ta2q'),
				new UpgradeRequirement('7ta3q'),
			],
			undefined,
			new Decimal(2),
		),

		// HPA系列升级 - 转生自动化
		'7hpa1q': new Qol7Upg(
			'自动化转生',
			'HPA1',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7c1q')],
			undefined,
			new Decimal(1),
		),
		'7hpm1q': new Qol7Upg(
			'最小化自动转生阈值',
			'HPM1',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7hpa1q')],
			undefined,
			new Decimal(1),
		),
		'7hpa2q': new Qol7Upg(
			'自动化飞升',
			'HPA2',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7hpa1q')],
			undefined,
			new Decimal(1),
		),
		'7hpm2q': new Qol7Upg(
			'最小化自动飞升阈值',
			'HPM2',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7hpa2q')],
			undefined,
			new Decimal(1),
		),
		'7hpa3q': new Qol7Upg(
			'自动化超越',
			'HPA3',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7hpa2q')],
			undefined,
			new Decimal(1),
		),
		'7hpm3q': new Qol7Upg(
			'最小化自动超越阈值',
			'HPM3',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7hpa3q')],
			undefined,
			new Decimal(1),
		),
		'7hpa4q': new Qol7Upg(
			'自动化轮回',
			'HPA4',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7hpa3q')],
			undefined,
			new Decimal(1),
		),
		'7hpm4q': new Qol7Upg(
			'最小化自动轮回阈值',
			'HPM4',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7hpa4q')],
			undefined,
			new Decimal(1),
		),

		// NT系列升级 - 数论研究
		'7nt4q': new Qol7Upg(
			'一直解锁数论研究4',
			'NT4',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7hpa4q')],
			undefined,
			new Decimal(5),
		),
		'7nt4uq': new Qol7Upg(
			'保持数论研究4的升级',
			'NT4U',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7nt4q')],
			undefined,
			new Decimal(4),
		),
		'7nt4bq': new Qol7Upg(
			'自动化数论研究4的购买项',
			'NT4B',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7nt4q')],
			undefined,
			new Decimal(4),
		),
		'7nt4bmq': new Qol7Upg(
			'最大化数论研究4的购买项',
			'NT4BM',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7nt4bq')],
			undefined,
			new Decimal(6),
		),
		'7nt5ubq': new Qol7Upg(
			'自动化数论研究5的升级和购买项',
			'NT5UB',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7nt4q')],
			undefined,
			new Decimal(10),
		),
		'7nt5bmq': new Qol7Upg(
			'最大化数论研究5的购买项',
			'NT5BM',
			(): [UpgradeRequirement] => [new UpgradeRequirement('7nt5ubq')],
			undefined,
			new Decimal(10),
		),
	} as const,

	initMechanics() {
		// 初始化机制
	},
} as const;
