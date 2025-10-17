import Decimal from 'break_eternity.js';
import { buyables } from './mechanic';
import { player } from './save';
import { Successor } from './successor/successor';
import { temp } from './temp-data';
import { DC } from './constants';
import { getInterval } from './stats';
import { QolUpgrades } from './exponention/qolupg';

// interface IAchievement {
// 	title: string;
// 	desc: string;
// 	satisfied?(): boolean;
// }

export function achLoop() {
	for (const row of achievements) {
		for (const ach of row) {
			if (ach.satisfied?.() ?? false) {
				player.achievements.push(ach.id);
				player.achievements = [...new Set(player.achievements)];
			}
		}
	}
	player.achievements = [...new Set(player.achievements)];
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

			id: 9,
		},
		{
			title: '获得一亿资源可以得到什么？微不足道罢了。',
			desc: '获得100,000,000数字',
			satisfied() {
				return player.stat.chapter >= 4 || player.number.gte(1e8);
			},

			id: 10,
		},
		{
			title: '欧拉函数',
			desc: '解锁数论研究',
			satisfied() {
				return player.stat.chapter >= 4 || player.upgrades[35];
			},

			id: 11,
		},
		{
			title: '免费',
			desc: '解锁U2-6',
			satisfied() {
				return player.stat.chapter >= 4 || player.upgrades[36];
			},

			id: 12,
		},
		{
			title: '终于不用点加法升级了',
			desc: '解锁U2-7',
			satisfied() {
				return player.stat.chapter >= 4 || player.upgrades[37];
			},

			id: 13,
		},
		{
			title: 'TS181，和AD一样在第二层重置',
			desc: '解锁U2-8',
			satisfied() {
				return player.stat.chapter >= 4 || player.upgrades[38];
			},

			id: 14,
		},
		{
			title: '这里有质因数23吗',
			desc: '购买一次质因数19',
			satisfied() {
				return player.stat.chapter >= 4 || player.buyables['pf19'].gte(1);
			},

			id: 15,
		},
	],
	[
		{
			title: '软上限纪元',
			desc: '触发软上限',
			satisfied() {
				return player.stat.chapter >= 4 || player.number.gte(DC.D_2P256);
			},

			id: 16,
		},
		{
			title: '挑战纪元',
			desc: '购买U2-9',
			satisfied() {
				return player.stat.chapter >= 4 || player.upgrades[39];
			},

			id: 17,
		},
		{
			title: '(d^2/dx^2) x',
			desc: '购买B2-R1-3',
			satisfied() {
				return player.stat.chapter >= 4 || player.buyables['33R'].gte(1);
			},

			id: 18,
		},
		{
			title: '乘法的重复是指数',
			desc: '进行一次指数重置',
			satisfied() {
				return player.stat.chapter >= 3;
			},

			id: 19,
		},
		{
			title: '2指数能量',
			desc: '获得1e1233乘法能量',
			satisfied() {
				return player.stat.chapter >= 4 || player.multiplication.mulpower.gte('1e1233');
			},

			id: 20,
		},
		{
			title: '那很快了',
			desc: '在1分钟内进行指数重置',
			satisfied() {
				return player.stat.chapter >= 4 || getInterval('recent10ExpReset') <= 60000;
			},

			id: 21,
		},
		{
			title: '前四行集齐了/打call',
			desc: '购买前四行QOL升级（4-QOL-00不算一行)',
			satisfied() {
				return (
					player.stat.chapter >= 4 ||
					(QolUpgrades.row3AllUnlocked() &&
						QolUpgrades.row1AllUnlocked() &&
						QolUpgrades.row2AllUnlocked() &&
						player.upgrades['400q'] &&
						player.upgrades['441q'] &&
						player.upgrades['442q'] &&
						player.upgrades['443q'] &&
						player.upgrades['444q'] &&
						player.upgrades['445q'])
				);
			},

			id: 22,
		},
		{
			title: '那很很很快了',
			desc: '在1秒内进行指数重置',
			satisfied() {
				return player.stat.chapter >= 4 || getInterval('recent10ExpReset') <= 1000;
			},

			id: 23,
		},
	],
	[
		{
			title: '终于不用点乘法重置了',
			desc: '购买U3-22',
			satisfied() {
				return player.stat.chapter >= 4 || player.upgrades['46'];
			},

			id: 24,
		},
		{
			title: '√2 not in Q',
			desc: '解锁数论研究2',
			satisfied() {
				return player.stat.chapter >= 4 || player.upgrades['45'];
			},

			id: 25,
		},
		{
			title: '棋盘学大变（×）',
			desc: '解锁棋盘',
			satisfied() {
				return player.stat.chapter >= 4 || player.upgrades['47'];
			},

			id: 26,
		},
		{
			title: '需要用1MiB才能存下这个数字，但是我们用的是10^x',
			desc: '获得e1,048,575数值',
			satisfied() {
				return player.stat.chapter >= 4 || player.number.gte('e1048575');
			},

			id: 27,
		},
		{
			title: '你不是说好了每格两倍吗，怎么变成三倍了/发怒/发怒',
			desc: '获得M-CB-1里程碑',
			satisfied() {
				return player.stat.chapter >= 4 || player.milestones['cb1'];
			},

			id: 28,
		},
		{
			title: '急急急',
			desc: '获得U3-24',
			satisfied() {
				return player.stat.chapter >= 4 || player.upgrades['48'];
			},

			id: 29,
		},
		{
			title: '天文学大变',
			desc: '雇佣一名天文学家',
			satisfied() {
				return player.stat.chapter >= 3.1;
			},

			id: 30,
		},
		{
			title: '指数指数时代',
			desc: '获得超过e6.871e10数字',
			satisfied() {
				return player.stat.chapter >= 4 || player.number.gte('e68719476736');
			},

			id: 31,
		},
	],
	[],
	[
		{
			title: '大数理论',
			desc: '在解锁之前，翻到数论研究9',
			satisfied() {
				return player.numbertheory.visiting == 9;
			},
			id: -1,

			hidden: true,
		},
		{
			title: 'Literal',
			desc: '按字面意思操作',
			satisfied() {
				return false;
			},
			id: -2,

			hidden: true,
		},
		{
			title: "I'll happily smith some temporary runes for you.",
			desc: '获得2天的加速时间',
			satisfied() {
				return player.timeshard.tf.gte(172800000);
			},
			id: -3,

			hidden: true,
		},
		{
			title: 'ψ(Ω<sup>ψ(Ω<sup>7</sup>)</sup>)',
			desc: '获得10天的加速时间',
			satisfied() {
				return player.timeshard.tf.gte(864000000);
			},
			id: -4,

			hidden: true,
		},
		{
			title: 'Stack overflow',
			desc: '在自动机里产生任何形式的Range error maxinum call stack exceeded',
			satisfied() {
				return false;
			},
			id: -5,

			hidden: true,
		},
		{
			title: '666拜谢被反转了',
			desc: '在启用颜色反转时点击拜谢',
			satisfied() {
				return false;
			},
			id: -6,

			hidden: true,
		},
		{
			title: '我刚才是不是看错了',
			desc: '在模糊下购买研究树112右边的研究',
			satisfied() {
				return false;
			},
			id: -7,
			hidden: true,
		},
	],
	[
		{
			title: '限定成就1',
			desc: '在首次加法重置前拥有1e6点数',
			satisfied() {
				return player.stat.chapter < 1 && player.number.gte(1e6);
			},
			hidden: true,
			id: 1001,
		},
		{
			title: '限定成就2',
			desc: '在首次乘法重置前拥有1e6加法能量',
			satisfied() {
				return player.stat.chapter < 2 && player.addpower.gte(1e6);
			},
			hidden: true,
			id: 1002,
		},
		{
			title: '限定成就3',
			desc: '进入困难模式',
			satisfied() {
				return player.options.hardMode;
			},
			hidden: true,
			id: 1003,
		},
	],
] as const;

export function isHiddenAchievement<T extends {}>(a: T): a is T & { hidden: boolean } {
	if ('hidden' in a) {
		if (typeof a.hidden == 'boolean') {
			return true;
		}
	}
	return false;
}
export function getTempSelectedAch() {
	return achievements[temp.select_ach[0]][temp.select_ach[1]];
}
export function showSelectedAchievementsDesc() {
	const ach = achievements[temp.select_ach[0]][temp.select_ach[1]];
	if (isHiddenAchievement(ach)) {
		return !ach.hidden || player.achievements.includes(ach.id);
	}
	return true;
}
export function getAchTag(ach: [string, any], row: any[]) {
	return 'hidden' in ach[1] && ach[1].hidden
		? '?-?'
		: `${parseInt(row[0]) + 1}-${parseInt(ach[0]) + 1}`;
}
