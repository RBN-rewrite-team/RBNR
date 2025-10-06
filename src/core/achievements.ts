import { buyables } from './mechanic';
import { player } from './save';
import { Successor } from './successor/successor';

interface IAchievement {
	title: string;
	desc: string;
	satisfied?(): boolean;
}

export function achLoop() {
	for (const row of achievements) {
		for (const ach of row) {
			if (ach.satisfied?.() ?? false) {
				player.achievements.push(ach.id);
				player.achievements = [...new Set(player.achievements)];
			}
		}
	}
}
export const achievements = [
	[
		{
			title: '道↓理↑生一',
			desc: '数值到达1',
			satisfied() {
				return player.number.gte(1) || player.stat.chapter >= 0;
			},
			id: 0,
		},
		{
			title: '现在挂机NaN秒就可以通关',
			desc: '开始自动获得数值',
			satisfied() {
				return Successor.autoSuccessPerSecond().gt(0) || player.stat.chapter >= 1;
			},
			id: 1,
		},
		{
			title: '后继的重复是加法',
			desc: '进行一次加法重置',
			satisfied() {
				return player.stat.chapter >= 1;
			},
			id: 2,
		},
		{
			title: '只有重置才有用的购买项算啥好购买项',
			desc: '购买B1-1',
			satisfied() {
				return player.stat.chapter >= 2 || player.buyables[21].gte(1);
			},
			id: 3,
		},
		{
			title: '是的，后继运算的重复是加法运算',
			desc: '购买B1-1',
			satisfied() {
				return player.stat.chapter >= 2 || player.upgrades[25];
			},
			id: 4,
		},
		{
			title: '加法的重复是乘法',
			desc: '进行一次乘法重置',
			satisfied() {
				return player.stat.chapter >= 2;
			},
			id: 5,
		},
		{
			title: '免费但不完全免费',
			desc: '购买U2-1',
			satisfied() {
				return player.stat.chapter >= 3 || player.upgrades[31];
			},
			id: 6,
		},
		{
			title: '1/2全力出击',
			desc: '购买50次U1-1',
			satisfied() {
				return (
					player.stat.chapter >= 4 || player.buyables[11].add(buyables[11].more()).gte(50)
				);
			},
			id: 7,
		},
	],
	[
		{
			title: '全力出只因',
			desc: '购买100次U1-1',
			satisfied() {
				return (
					player.stat.chapter >= 4 ||
					player.buyables[11].add(buyables[11].more()).gte(100)
				);
			},
			id: 8,
		},
		{
			title: '质因数分解',
			desc: '购买至少一次质因数',
			satisfied() {
				return (
					player.stat.chapter >= 4 ||
					player.buyables['pf2']
						.add(player.buyables['pf3'])
						.add(player.buyables['pf5'])
						.add(player.buyables['pf7'])
						.add(player.buyables['pf11'])
						.add(player.buyables['pf13'])
						.add(player.buyables['pf17'])
						.add(player.buyables['pf19'])
						.gte(1)
				);
			},
			id: 8,
		},
		{
			title: '获得一亿资源可以得到什么？微不足道罢了。',
			desc: '获得100,000,000数字',
			satisfied() {
				return player.stat.chapter >= 4 || player.number.gte(1e8);
			},
			id: 9,
		},
		{
			title: '欧拉，但不是你想的那个欧拉',
			desc: '解锁数论研究',
			satisfied() {
				return player.stat.chapter >= 4 || player.upgrades[35];
			},
			id: 10,
		},
	],
] as const;
