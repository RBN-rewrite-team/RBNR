import Decimal from 'break_eternity.js';
import { UPGRADES, type singleReq } from '../mechanic';
import { player } from '../save';
import { format, formatWhole } from '@/utils/format';
import { Upgrade } from '../upgrade';
import { Currencies } from '../currencies';
import { UpgradeRequirement, type Requirement } from '../requirements';
type onetwofive = 1 | 2 | 3 | 4 | 5;
export type qolUpgs = `${4}${onetwofive}${onetwofive}q` | '400q';
class QolUpg extends Upgrade {
	name="4-QOL-xx"
	description: string = '';
	cost= new Decimal(1);
	currency: Currencies = Currencies.QOL_POINTS;
	constructor(description: string, id:`${onetwofive}${onetwofive}`|'00', r?:()=>Requirement[], s?:()=>boolean, c?:Decimal){
		super();
		this.description = description;
		this.name = "4-QOL-"+id;
		if (r)this.requirements = r;
		if (s)this.show = s;
		if (c)this.cost = c;
	}
}
export const QolUpgrades = {
	upgrades: {
		'400q': new class extends QolUpg {
			cost = new Decimal(0);
			constructor() {
				super('U2-1的效果*2，解锁一个新的数论研究1升级','00');
			}
		},
		'411q': new QolUpg('保持后继升级和U2-2。', '11'),
		'412q': new QolUpg('B0-1的数量不会少于1个。', '12'),
		'413q': new QolUpg('指数不重置挑战1的奖励。', '13'),
		'414q': new QolUpg('指数不重置U2-R1-1。', '14'),
		'415q': new QolUpg('自动购买质因数2、3、5、7。', '15'),
		'421q': new QolUpg('保持加法升级。', '21', ():[UpgradeRequirement]=>[new UpgradeRequirement('411q')]),
		'422q': new QolUpg('B0-1的数量不会少于10个。', '22', ():[UpgradeRequirement]=>[new UpgradeRequirement('412q')]),
		'423q': new QolUpg('指数不重置挑战2的奖励。', '23', ():[UpgradeRequirement]=>[new UpgradeRequirement('413q')]),
		'424q': new QolUpg('指数不重置B2-R1-1。', '24', ():[UpgradeRequirement]=>[new UpgradeRequirement('414q')]),
		'425q': new QolUpg('自动购买质因数11、13、17、19', '25', ():[UpgradeRequirement]=>[new UpgradeRequirement('415q')]),
		'431q': new QolUpg('指数不重置U2-3和U2-4。', '31', ():[UpgradeRequirement]=>[new UpgradeRequirement('421q')], (): boolean=>QolUpgrades.row1AllUnlocked() ),
		'432q': new QolUpg('B1-1的增幅立即生效，无需加法重置。', '32', ():[UpgradeRequirement]=>[new UpgradeRequirement('422q')], (): boolean=>QolUpgrades.row1AllUnlocked() ),
		'433q': new QolUpg('指数不重置挑战3的奖励。', '33', ():[UpgradeRequirement]=>[new UpgradeRequirement('423q')], (): boolean=>QolUpgrades.row1AllUnlocked() ),
		'434q': new QolUpg('指数不重置B2-R1-2。', '34', ():[UpgradeRequirement]=>[new UpgradeRequirement('424q')], (): boolean=>QolUpgrades.row1AllUnlocked() ),
		'435q': new QolUpg('乘法不重置质因数时间。', '35', ():[UpgradeRequirement]=>[new UpgradeRequirement('425q')], (): boolean=>QolUpgrades.row1AllUnlocked() ),
		'441q': new QolUpg('每秒自动获得100%重置时可获得的加法能量。', '41', ():[UpgradeRequirement]=>[new UpgradeRequirement('431q')], (): boolean=>QolUpgrades.row2AllUnlocked() ),
		'442q': new QolUpg('B0-1的数量保持在100个。', '42', ():[UpgradeRequirement]=>[new UpgradeRequirement('432q')], (): boolean=>QolUpgrades.row2AllUnlocked() ),
		'443q': new QolUpg('挑战4纪录不低于本指数内累计乘法能量^' + format(new Decimal(0.001)) + '。', '43', ():[UpgradeRequirement]=>[new UpgradeRequirement('433q')], (): boolean=>QolUpgrades.row2AllUnlocked() ),
		'444q': new QolUpg('自动化数论研究1的购买项。', '44', ():[UpgradeRequirement]=>[new UpgradeRequirement('434q')], (): boolean=>QolUpgrades.row2AllUnlocked() ),
		'445q': new QolUpg('指数不重置质因数时间。', '45', ():[UpgradeRequirement]=>[new UpgradeRequirement('435q')], (): boolean=>QolUpgrades.row2AllUnlocked() ),
		'451q': new QolUpg('保持乘法升级。', '51', ():[UpgradeRequirement]=>[new UpgradeRequirement('441q')], (): boolean=>QolUpgrades.row3AllUnlocked(), new Decimal(5)),
		'452q': new QolUpg('自动化B2-1和B2-2。', '52', ():[UpgradeRequirement]=>[new UpgradeRequirement('442q')], (): boolean=>QolUpgrades.row3AllUnlocked(), new Decimal(5)),
		'453q': new QolUpg('前3个挑战的纪录保持为本次指数的最高数值。', '53', ():[UpgradeRequirement]=>[new UpgradeRequirement('443q')], (): boolean=>QolUpgrades.row3AllUnlocked(), new Decimal(5)),
		'454q': new QolUpg('保持数论研究1的升级。', '54', ():[UpgradeRequirement]=>[new UpgradeRequirement('444q')], (): boolean=>QolUpgrades.row3AllUnlocked(), new Decimal(5)),
		'455q': new QolUpg('B2-3的数量保持在99个。', '55', ():[UpgradeRequirement]=>[new UpgradeRequirement('445q')], (): boolean=>QolUpgrades.row3AllUnlocked(), new Decimal(5)),
	} as const,
	initMechanics() {
	},
	row1AllUnlocked() {
		return (
			player.upgrades['411q'] &&
			player.upgrades['412q'] &&
			player.upgrades['413q'] &&
			player.upgrades['414q'] &&
			player.upgrades['415q']
		);
	},
	row2AllUnlocked() {
		return (
			player.upgrades['421q'] &&
			player.upgrades['422q'] &&
			player.upgrades['423q'] &&
			player.upgrades['424q'] &&
			player.upgrades['425q']
		);
	},
	row3AllUnlocked() {
		return (
			player.upgrades['431q'] &&
			player.upgrades['432q'] &&
			player.upgrades['433q'] &&
			player.upgrades['434q'] &&
			player.upgrades['435q']
		);
	},
};
