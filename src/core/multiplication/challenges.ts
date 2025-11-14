import { format } from '@/utils/format';
import { CHALLENGE, type SingleChallenge } from '../challenge';
import { player } from '../save';
import Decimal from 'break_eternity.js';
import { DC } from '@/core/constants';

export const MULTI_CHALS: SingleChallenge[] = [
	{
		effect(x) {
			let base = x.sub(1000).max(0).add(1).log10().mul(0.0001);
			const cap = 0.25;
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
		effect(x) {
			if (CHALLENGE.inChallenge(0, 3)) return DC.D_1;
			let base = x.add(1).pow(64).max(1);
			if (!player.upgrades[49]) base = base.min(new Decimal('e1000'));
			return base;
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
