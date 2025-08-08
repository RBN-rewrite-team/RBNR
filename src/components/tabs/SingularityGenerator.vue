<script lang="ts" setup>
import { feature, player } from '@/core/global';
import { format, notations } from '@/utils/format';
import Decimal from 'break_eternity.js';
import { ref } from 'vue';
import { CHALLENGE, type SingleChallenge } from '../../core/challenge.ts';
function destroy(a: number) {
	switch (a) {
		case 1:
			player.exponention.logarithm.upgrades_in_dilated = [];
			player.exponention.logarithm.buyables_in_dilated = [];
			player.exponention.logarithm.highest_dilate = new Decimal(1);
			player.upgrades['44R'] = false;
			player.exponention.logarithm.in_dilate = false;
			player.milestones['log_G'] = false;
			player.milestones.cb20 = false;
			player.options.notation = notations.SCIENTIFIC;
			feature.EXPONENTION.reset(true, true);
			break;
		case 2:
			player.exponention.logarithm = {
				observe_datas: new Decimal(0),
				calculate_datas: new Decimal(0),
				astronomers: [],
				in_dilate: false,
				upgrades_in_dilated: [],
				buyables_in_dilated: [],
				highest_dilate: new Decimal(1),
			};
			player.milestones['log_law1'] = false;
			player.milestones['log_law2'] = false;
			player.milestones['log_law3'] = false;
			player.milestones.cb5 = false;
			player.milestones.cb9 = false;
			player.milestones.cb10 = false;
			player.milestones.cb12 = false;
			player.milestones.cb13 = false;
			player.milestones.cb15 = false;
			player.milestones.cb17 = false;
			player.milestones.cb18 = false;
			feature.EXPONENTION.reset(true, true);
			break;
		case 3:
			player.buyables.cb1 = new Decimal(0);
			player.milestones.cb1 = false;
			player.milestones.cb2 = false;
			player.milestones.cb3 = false;
			player.milestones.cb4 = false;
			player.milestones.cb6 = false;
			player.milestones.cb7 = false;
			player.milestones.cb8 = false;
			player.milestones.cb11 = false;
			player.milestones.cb14 = false;
			player.milestones.cb16 = false;
			player.milestones.cb19 = false;
			player.upgrades[47] = false;
			player.upgrades['43R'] = false;
			feature.EXPONENTION.reset(true, true);
			break;
		case 4:
			player.upgrades['41R'] = false;
			player.upgrades['42R'] = false;
			player.upgrades['41'] = false;
			player.upgrades['42'] = false;
			player.upgrades['43'] = false;
			player.upgrades['44'] = false;
			player.upgrades['45'] = false;
			player.upgrades['46'] = false;
			player.upgrades['48'] = false;
			player.upgrades['400q'] = false;
			for (let i = 1; i <= 5; i++) {
				for (let j = 1; j <= 5; j++)
					player.upgrades[`4${i}${j}q` as keyof typeof player.upgrades] = false;
			}
			player.buyables['41'] = new Decimal(0);
			player.buyables['42'] = new Decimal(0);
			player.buyables['43'] = new Decimal(0);
			player.buyables['44'] = new Decimal(0);
			player.exponention.exppower = new Decimal(0);
			player.exponention.totalExppower = new Decimal(0);
			player.exponention.qolpoints = new Decimal(0);
			player.firstResetBit &= ~(1 << 2);
			if (CHALLENGE.inChallenge(0, 3)) player.challengein = [-1, -1];
			player.challenges[0][3] = new Decimal(0);
			break;
		case 5:
			player.challenges[0] = [
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
			];
			player.upgrades[39] = false;
			break;
		case 6:
			let pf = [2, 3, 5, 7, 11, 13, 17, 19];
			for (let i in pf)
				player.buyables[('pf' + pf[i]) as keyof typeof player.buyables] = new Decimal(0);
			player.upgrades[36] = false;
			player.buyables[33] = new Decimal(0);
			break;
		case 7:
			player.upgrades['31R'] = false;
			player.upgrades['32R'] = false;
			player.upgrades['33R'] = false;
			player.upgrades['34R'] = false;
			player.buyables['31R'] = new Decimal(0);
			player.buyables['32R'] = new Decimal(0);
			player.buyables['33R'] = new Decimal(0);
			player.buyables['34R'] = new Decimal(0);
			player.buyables['35R'] = new Decimal(0);
			player.buyables['36R'] = new Decimal(0);
			player.buyables['37R'] = new Decimal(0);
			player.buyables['38R'] = new Decimal(0);
			player.numbertheory.euler.x = new Decimal(0);
			player.numbertheory.euler.y = new Decimal(0);
			player.numbertheory.euler.z = new Decimal(0);
			player.numbertheory.euler.s = new Decimal(0);
			player.upgrades[35] = false;
			break;
		case 8:
			player.upgrades[26] = false;
			player.upgrades[31] = false;
			player.upgrades[32] = false;
			player.upgrades[33] = false;
			player.upgrades[34] = false;
			player.upgrades[37] = false;
			player.upgrades[38] = false;
			player.buyables[31] = new Decimal(0);
			player.buyables[32] = new Decimal(0);
			player.multiplication.mulpower = new Decimal(0);
			player.multiplication.totalMulpower = new Decimal(0);
			player.firstResetBit &= ~(1 << 1);
			break;
		case 9:
			player.upgrades[13] = false;
			player.upgrades[21] = false;
			player.upgrades[22] = false;
			player.upgrades[23] = false;
			player.upgrades[24] = false;
			player.upgrades[25] = false;
			player.buyables[21] = new Decimal(0);
			player.firstResetBit &= ~1;
			player.addpower = new Decimal(0);
			player.totalAddpower = new Decimal(0);
			player.buyable11More = new Decimal(0);
			break;
		case 10:
			player.upgrades[11] = false;
			player.upgrades[12] = false;
			player.buyables[11] = new Decimal(0);
			player.buyable11More = new Decimal(0);
			break;
	}
}

function predictableRandom(x: number): number {
	let start = Math.pow(x % 97, 4.3) * 232344573;
	const a = 15485863;
	const b = 521791;
	start = (start * a) % b;
	for (let i = 0; i < ((x * x) % 90) + 90; i++) {
		start = (start * a) % b;
	}
	return start / b;
}

function randomSymbol(): string {
	const lowerBoundBasic = 0x4e00; // 基本区起始
	const upperBoundBasic = 0x9fa5; // 基本区结束
	const lowerBoundExtendedA = 0x3400; // 扩展A区起始
	const upperBoundExtendedA = 0x4dbf; // 扩展A区结束

	if (Math.random() < 0.5) {
		return String.fromCodePoint(
			Math.floor(Math.random() * (upperBoundBasic - lowerBoundBasic + 1)) + lowerBoundBasic,
		);
	} else {
		return String.fromCodePoint(
			Math.floor(Math.random() * (upperBoundExtendedA - lowerBoundExtendedA + 1)) +
				lowerBoundExtendedA,
		);
	}
}

const wordShift = {
	wordCycle(list: string[], noBuffer: boolean = false, nothing?: number): string {
		const len = list.length;
		const tick = Math.floor(Date.now() / 250) % (len * 5);
		const mod5 = ((Date.now() / 250) % (len * 5)) % 5;
		const largeTick = Math.floor(tick / 5);
		let v = list[largeTick];

		if (mod5 < 0.6) {
			v = this.blendWords(
				list[(largeTick + list.length - 1) % list.length],
				list[largeTick],
				(mod5 + 0.6) / 1.2,
			);
		} else if (mod5 > 4.4) {
			v = this.blendWords(
				list[largeTick],
				list[(largeTick + 1) % list.length],
				(mod5 - 4.4) / 1.2,
			);
		}

		v = this.randomCrossWords(v, 0.1 * Math.pow(mod5 - 2.5, 4) - 0.6);
		return v;
	},

	randomCrossWords(str: string, frac: number = 0.7): string {
		if (frac <= 0) return str;
		const x = str.split('');
		for (let i = 0; i < x.length * frac; i++) {
			const randomIndex = Math.floor(
				predictableRandom((Math.floor(Date.now() / 500) % 964372) + 1.618 * i) * x.length,
			);
			x[randomIndex] = randomSymbol();
		}
		return x.join('');
	},

	blendWords(first: string, second: string, param: number): string {
		if (param <= 0) return first;
		if (param >= 1) return second;
		return (
			first.substring(0, Math.floor(first.length * (1 - param))) +
			second.substring(Math.floor(second.length * (1 - param)))
		);
	},
};

function color() {
	let r = Math.min(255, 127 + player.singularity.t / 5);
	let g = Math.max(0, 127 - player.singularity.t / 5);
	let b = Math.max(0, 255 - player.singularity.t / 4);
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}

let t = ref(Date.now());
setInterval(function () {
	t.value = Date.now();
	document.documentElement.style.setProperty('--sing-color', color());
}, 40);
</script>

<template>
	<div class="main" align="center">
		<div v-if="player.singularity.enabled" style="transform: translateY(60px)">
			你有
			<b style="color: var(--sing-color); font-size: 25px">{{
				format(feature.SingularityGenerator.getSingularityEnergy())
			}}</b>
			奇点能量<span v-if="player.singularity.stage < 11"
				>， 这使数值<span v-if="player.singularity.stage < 10">，加法能量</span
				><span v-if="player.singularity.stage < 9">，乘法能量</span>获取
				<b style="color: var(--sing-color)"
					>^{{ format(feature.SingularityGenerator.getSingularityEffect()) }}</b
				></span
			>
			<span v-else-if="player.singularity.t < 667"
				>，每秒生产<b style="color: var(--sing-color)">{{
					format(feature.SingularityGenerator.getSingularityEffect())
				}}</b
				>数值
			</span>
			<br />
			<span v-if="player.singularity.t < 667"
				>你每秒获取 (奇点能量+1)<sup style="color: var(--sing-color)">{{
					format(feature.SingularityGenerator.singularityExponent())
				}}</sup
				>/{{ format(feature.SingularityGenerator.singularityDivision()) }} 奇点能量<br
			/></span>
			<span v-if="player.singularity.t >= 667">
				在跨越有限与无限的界限之后，奇点生成器停止了。下一次启动会是什么时候？<br />
				在一切的毁灭尽头，将迎来更灿烂的新生。<br />
				序数的世界欢迎你的到来。<br />
			</span>
			<button
				class="sacrifice"
				v-if="player.singularity.stage < 1 && player.singularity.t >= 205"
				@click="
					player.singularity.stage = 1;
					destroy(1);
				"
			>
				现在的{{
					wordShift.wordCycle(
						['数值', '加法能量', '乘法能量', '指数能量', '奇点能量'],
						false,
						t,
					)
				}}太多了......我需要献祭我的对数膨胀和记数法才能走得更远......
			</button>
			<button
				class="sacrifice"
				v-else-if="player.singularity.stage < 2 && player.singularity.t >= 250"
				@click="
					player.singularity.stage = 2;
					destroy(2);
				"
			>
				现在的{{
					wordShift.wordCycle(
						['数值', '加法能量', '乘法能量', '指数能量', '奇点能量'],
						false,
						t,
					)
				}}太多了......我需要献祭我的对数运算和软上限才能走得更远......
			</button>
			<button
				class="sacrifice"
				v-else-if="player.singularity.stage < 3 && player.singularity.t >= 300"
				@click="
					player.singularity.stage = 3;
					destroy(3);
				"
			>
				现在的{{
					wordShift.wordCycle(
						['数值', '加法能量', '乘法能量', '指数能量', '奇点能量'],
						false,
						t,
					)
				}}太多了......我需要献祭我的棋盘才能走得更远......
			</button>
			<button
				class="sacrifice"
				v-else-if="player.singularity.stage < 4 && player.singularity.t >= 350"
				@click="
					player.singularity.stage = 4;
					destroy(4);
				"
			>
				现在的{{
					wordShift.wordCycle(
						['数值', '加法能量', '乘法能量', '指数能量', '奇点能量'],
						false,
						t,
					)
				}}太多了......我需要献祭我的指数层级才能走得更远......
			</button>
			<button
				class="sacrifice"
				v-else-if="player.singularity.stage < 6 && player.singularity.t >= 400"
				@click="
					player.singularity.stage = 6;
					destroy(5);
				"
			>
				现在的{{
					wordShift.wordCycle(['数值', '加法能量', '乘法能量', '奇点能量'], false, t)
				}}太多了......我需要献祭我的乘法挑战才能走得更远......
			</button>
			<button
				class="sacrifice"
				v-else-if="player.singularity.stage < 7 && player.singularity.t >= 430"
				@click="
					player.singularity.stage = 7;
					destroy(6);
				"
			>
				现在的{{
					wordShift.wordCycle(['数[]', '[]法能量', '乘[]能量', '奇点能[]'], false, t)
				}}太[]了...我需[]献祭我的[]因数才能[]得更远...
			</button>
			<button
				class="sacrifice"
				v-else-if="player.singularity.stage < 8 && player.singularity.t >= 450"
				@click="
					player.singularity.stage = 8;
					destroy(7);
				"
			>
				现在的{{
					wordShift.wordCycle(['数[]', '[]法能量', '乘[]能量', '奇点能[]'], false, t)
				}}太[]了...我需[]献祭我的数论[][]才能{{
					wordShift.wordCycle(['走得更远', '飞得更高', '[]得更[]'], false, t)
				}}...
			</button>
			<button
				class="sacrifice"
				v-else-if="player.singularity.stage < 9 && player.singularity.t >= 470"
				@click="
					player.singularity.stage = 9;
					destroy(8);
				"
			>
				在{{
					wordShift.wordCycle(['一切皆毁', '万物消亡', '终焉寂灭'], false, t)
				}}之前，还要献祭乘法层级......
			</button>
			<button
				class="sacrifice"
				v-else-if="player.singularity.stage < 10 && player.singularity.t >= 490"
				@click="
					player.singularity.stage = 10;
					destroy(9);
				"
			>
				在{{
					wordShift.wordCycle(['一切皆毁', '万物消亡', '终焉寂灭'], false, t)
				}}之前，还要献祭加法层级......<br />
			</button>
			<button
				class="sacrifice"
				v-else-if="player.singularity.stage < 11 && player.singularity.t >= 500"
				@click="
					player.singularity.stage = 11;
					destroy(10);
				"
			>
				在{{
					wordShift.wordCycle(['一切皆毁', '万物消亡', '终焉寂灭'], false, t)
				}}之前，还要献祭后继层级......<br />
				这是最后的警告......
			</button>
		</div>
		<button v-else class="circle-button" @click="player.singularity.enabled = true">
			解锁奇点生成器
		</button>
	</div>
</template>

<style scoped>
.circle-button {
	width: 300px; /* 按钮宽度 */
	height: 300px; /* 按钮高度，与宽度相同形成圆形 */
	border-radius: 50%; /* 设置为50%创建圆形 */
	border: 3px solid rgb(244, 25, 35); /* 蓝色边框，3像素宽 */
	background-color: black; /* 白色背景 */
	cursor: pointer; /* 鼠标悬停时显示手型指针 */
	display: flex; /* 使用flex布局便于内容居中 */
	justify-content: center; /* 水平居中 */
	align-items: center; /* 垂直居中 */
	font-size: 28px; /* 文字大小 */
	color: white; /* 文字颜色 */
	text-decoration: none; /* 去除链接下划线（如果是a标签） */
	outline: none; /* 去除点击时的轮廓线 */
}
.sacrifice {
	width: 300px; /* 按钮宽度 */
	height: 100px; /* 按钮高度，与宽度相同形成圆形 */
	border: 3px solid rgb(244, 25, 35); /* 蓝色边框，3像素宽 */
	background-color: black; /* 白色背景 */
	cursor: pointer; /* 鼠标悬停时显示手型指针 */
	display: flex; /* 使用flex布局便于内容居中 */
	justify-content: center; /* 水平居中 */
	align-items: center; /* 垂直居中 */
	color: white; /* 文字颜色 */
	text-decoration: none; /* 去除链接下划线（如果是a标签） */
	outline: none; /* 去除点击时的轮廓线 */
	border-radius: 99%;
}
</style>
