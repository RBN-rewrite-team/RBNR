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
] as const;

export function C11cap() {
	return Math.max(100000 - player.multiplication.pfTime.toNumber(), 0);
}
