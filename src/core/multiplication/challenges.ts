import { format } from '@/utils/format';
import type { SingleChallenge } from '../challenge';
import { player } from '../save';

export const MULTI_CHALS: SingleChallenge[] = [
	{
		name: '退化',
		descEasy: '加法运算似了，挂机越久加法能量上限越低',
		descHard: '你永远无法升级成加法运算。 加法能量上限从100000开始，每秒减少1000',
		effect(x) {
			return x.sub(1000).max(0).add(1).log10().mul(0);
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
    descEasy: '数值，加法能量和因数效果被做除法运算',
    get descHard(){
      return '数值和加法能量产量除以'+`${format(2**128)},因数能量效果公式变为*cap^(1-0.99999^sec)`
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
    get descHard(){
      return '数值增长速度除以当前已经拥有的数值数量'
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
] as const;

export function C11cap() {
	return Math.max(100000 - player.multiplication.pfTime.toNumber(), 0);
}
