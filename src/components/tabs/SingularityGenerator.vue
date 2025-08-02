<script lang="ts" setup>
import { feature, player } from '@/core/global';
import { format } from '@/utils/format';
import Decimal from 'break_eternity.js';
import { ref } from "vue"

function destroy(a: number) {
  switch(a) {
    case 1:
      player.exponention.logarithm.upgrades_in_dilated = [];
      player.exponention.logarithm.buyables_in_dilated = [];
      player.exponention.logarithm.highest_dilate = new Decimal(1);
      player.upgrades["44R"] = false;
      player.exponention.logarithm.in_dilate = false
      feature.EXPONENTION.reset(true, true);
      player.milestones['log_law1'] = false
      player.milestones['log_law2'] = false
      player.milestones['log_law3'] = false
      player.milestones['log_G'] = false
      break
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
			player.milestones.cb5 = false
			player.milestones.cb9 = false
			player.milestones.cb10 = false
			player.milestones.cb12 = false
			player.milestones.cb13 = false
			player.milestones.cb15 = false
			player.milestones.cb17 = false
			player.milestones.cb18 = false
			feature.EXPONENTION.reset(true, true);
      break
  }
}

function predictableRandom(x: number): number {
  let start = Math.pow(x % 97, 4.3) * 232344573;
  const a = 15485863;
  const b = 521791;
  start = (start * a) % b;
  for (let i = 0; i < (x * x) % 90 + 90; i++) {
    start = (start * a) % b;
  }
  return start / b;
}

function randomSymbol(): string {
  const lowerBoundBasic = 0x4E00;  // 基本区起始
  const upperBoundBasic = 0x9FA5;  // 基本区结束
  const lowerBoundExtendedA = 0x3400;  // 扩展A区起始
  const upperBoundExtendedA = 0x4DBF;  // 扩展A区结束

  if (Math.random() < 0.5) {
    return String.fromCodePoint(
      Math.floor(Math.random() * (upperBoundBasic - lowerBoundBasic + 1)) + lowerBoundBasic
    );
  } else {
    return String.fromCodePoint(
      Math.floor(Math.random() * (upperBoundExtendedA - lowerBoundExtendedA + 1)) + lowerBoundExtendedA
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
        (mod5 + 0.6) / 1.2
      );
    } else if (mod5 > 4.4) {
      v = this.blendWords(
        list[largeTick],
        list[(largeTick + 1) % list.length],
        (mod5 - 4.4) / 1.2
      );
    }

    v = this.randomCrossWords(v, 0.1 * Math.pow(mod5 - 2.5, 4) - 0.6);
    return v;
  },

  randomCrossWords(str: string, frac: number = 0.7): string {
    if (frac <= 0) return str;
    const x = str.split("");
    for (let i = 0; i < x.length * frac; i++) {
      const randomIndex = Math.floor(
        predictableRandom(Math.floor(Date.now() / 500) % 964372 + 1.618 * i) * x.length
      );
      x[randomIndex] = randomSymbol();
    }
    return x.join("");
  },

  blendWords(first: string, second: string, param: number): string {
    if (param <= 0) return first;
    if (param >= 1) return second;
    return (
      first.substring(0, Math.floor(first.length * (1 - param))) +
      second.substring(Math.floor(second.length * (1 - param)))
    );
  }
};

let t = ref(Date.now())
setInterval(function () {
  t.value = Date.now()
}, 40)
</script>

<template>
  <div class="main" align="center">
    <div v-if="player.singularity.enabled" style="transform: translateY(60px)">
    你有
		<b style="color: rgb(127, 127, 255); font-size: 25px">{{
			format(feature.SingularityGenerator.getSingularityEnergy())
		}}</b>
		奇点能量，
		这使数值，加法能量，乘法能量获取
		<b style="color: rgb(127, 127, 255);">^{{
			format(feature.SingularityGenerator.getSingularityEffect())
		}}</b><br>
		你每秒获取 (奇点能量+1)<sup style="color: rgb(127, 127, 255);">{{ format(feature.SingularityGenerator.singularityExponent()) }}</sup>/{{ format(feature.SingularityGenerator.singularityDivision()) }}
		奇点能量<br>
		<button class="sacrifice" v-if="player.singularity.stage < 1 && player.singularity.t >= 205" @click="player.singularity.stage = 1; destroy(1)">
		  现在的{{ wordShift.wordCycle(["数值", "加法能量", "乘法能量", "指数能量", "奇点能量"], false, t) }}太多了......我需要献祭我的对数膨胀才能走得更远......
		</button>
		<button class="sacrifice" v-if="player.singularity.stage < 3 && player.singularity.t >= 250" @click="player.singularity.stage = 2; destroy(2)">
		  现在的{{ wordShift.wordCycle(["数值", "加法能量", "乘法能量", "指数能量", "奇点能量"], false, t) }}太多了......我需要献祭我的对数运算和软上限才能走得更远......
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
	border: 3px solid rgb(244,25,35); /* 蓝色边框，3像素宽 */
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
	border: 3px solid rgb(244,25,35); /* 蓝色边框，3像素宽 */
	background-color: black; /* 白色背景 */
	cursor: pointer; /* 鼠标悬停时显示手型指针 */
	display: flex; /* 使用flex布局便于内容居中 */
	justify-content: center; /* 水平居中 */
	align-items: center; /* 垂直居中 */
	color: white; /* 文字颜色 */
	text-decoration: none; /* 去除链接下划线（如果是a标签） */
	outline: none; /* 去除点击时的轮廓线 */
	border-radius: 99%
}

</style>