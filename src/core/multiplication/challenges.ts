import { format } from '@/utils/format';
import { CHALLENGE, type SingleChallenge } from '../challenge';
import { player } from '../save';
import Decimal from 'break_eternity.js';

export const MULTI_CHALS: SingleChallenge[] = [
	{
		name: '退化',
		descEasy: '你不能进行加法运算。',
		descHard: '你永远无法升级成加法运算。',
		effect(x) {
			let base = x.sub(1000).max(0).add(1).log10().mul(0.0001);
			let cap = 0.25;
			if (player.exponention.logarithm.upgrades_in_dilated.includes('25')) {
				if (base.gte(1)) base = base.root(2);
				return base;
			}
			if (base.gte(cap)) base = new Decimal(cap);
			return base;
		},
		effD(x) {
			return `加法运算指数+${format(x)}`;
		},
		loop() {
			player.challenges[0][0] = player.challenges[0][0].max(player.number);
		},
	},
	{
		name: '除法',
		descEasy: '数值、加法能量获取被做除法，因数能量效果随时间而降低',
		get descHard() {
			return (
				'数值和加法能量产量除以' +
				`${format(2 ** 128)},因数能量效果公式变为*cap^(1-0.99999^sec)`
			);
		},
		effect(x) {
			return player.addpower.max(10).log10().pow(x.add(1).log10().pow(0.5));
		},
		effD(x) {
			return `基于加法能量和挑战中最高数值增幅数值获取： *${format(x)}`;
		},
		loop() {
			player.challenges[0][1] = player.challenges[0][1].max(player.number);
		},
	},
	{
		name: '燃烧',
		descEasy: '数值增长速度除以已有数值',
		get descHard() {
			return '数值增长速度除以当前已经拥有的数值数量';
		},
		effect(x) {
			return x.pow(0.1).max(1);
		},
		effD(x) {
			return `数值获取速度*${format(x)}`;
		},
		loop() {
			player.challenges[0][2] = player.challenges[0][2].max(player.number);
		},
	},
	{
		name: '逆转',
		descEasy:
			'每次生产前乘法层资源时有一半的概率被反转(下限为0)，提升乘法重置难度，禁用B2-2、挑战3',
		get descHard() {
			return this.descEasy;
		},
		effect(x) {
			if (CHALLENGE.inChallenge(0, 3)) return new Decimal(1);
			return x.add(1).pow(64).max(1).min(new Decimal('e1000'));
		},
		effD(x) {
			return `首次乘法重置解锁指数层<br>乘法能量获取速度*${format(x)}`;
		},
		loop() {},
	},
] as const;

export function C11cap() {
	return Math.max(100000 - player.multiplication.pfTime.toNumber(), 0);
}
