<script setup lang="ts">
import { player, feature } from '@/core/global.ts';
import { Analysis, dayOfWeek, PTEffects, realPTreset } from '@/core/pt/index.ts';
import { format } from '@/utils/format';
import type { IntClosedRange } from 'type-fest';

function unlockedList(): string {
	let s = '';
	for (let i = 0; i < 7; i++) if (Analysis.analysisUnlocked(i)) s += Analysis.systems[i] + ' ';
	return s;
}
</script>

<template>
	<br />
	<h3 class="pt_base" style="color: cyan; width: 50%; margin: auto">
		解析系统中，每周的不同时段会解锁不同系统。<br />
		当前是 {{ dayOfWeek()[1] }} ，解锁 <span v-html="unlockedList()" />系统。<br />
		进行证明论重置以随机解析，成功率为 {{Analysis.analysisRate() * 100}}% ，解析同一系统{{Analysis.analysisCycle()}}次必定成功。<br />
		单一系统首次解析必定成功。<br />
	</h3>
	<div class="pt_base" style="width: 50%; margin: auto">
		<p>证明论重置次数带来以下奖励:</p>
		<p>基数以前全局速度*{{ format(PTEffects.effectToPreCardinal()) }}，上限*5</p>
		<p>
			九头蛇对数软上限减弱{{ format(PTEffects.effectToHydraEnergyLogSoftCap()) }}%，上限-50%
		</p>
		<p>溶液获取速度*{{ format(PTEffects.effectToSolutions()) }}，上限*4</p>
		<p>
			每次非递归重置，非递归获取次数*{{
				format(PTEffects.effectToNonrecResetTimes())
			}}，上限*25
		</p>
		<p>NRC目标等级减小{{ format(PTEffects.effectToNonrecChallengeGoalLevel()) }}%，上限-50%</p>
	</div>
	<!--重置先放这里，反正也不常重置-->
	<div class="pt_base pt_reset" @click="realPTreset" style="width: 50%; margin: auto"><span class="pt_font">证明论重置</span></div>
	<div
		v-for="count in 7"
		align="center"
		:style="{ opacity: Analysis.analysisUnlocked(count - 1) ? 1 : 0.5 }"
	>
		<br />
		<div class="pt_base system">
			<h3 v-html="count + ': ' + Analysis.systems[count - 1]" />
			<br />
			解析进度：{{ player.pt.analysis[count - 1] }}/11(本次解析已尝试{{
				player.pt.analysisFailed[count - 1]
			}}次)<br />
			解析效果：{{
				Analysis.systemEffect[(count - 1) as IntClosedRange<0, 6>].desc(
					player.pt.analysis[count - 1],
				)
			}}<br />
		</div>
	</div>
</template>

<style scoped>
.pt_base {
	background-color: rgba(0, 255, 255, 0.5);
	border: 2px solid rgba(0, 255, 255, 0.75);
}
.system {
	height: 200px;
	width: calc(100% - 20px);
	border: 2px solid cyan;
	color: cyan;
}
.pt_reset {
	height: 100px;
	color: cyan;
	font-weight: bold;
	font-size: 16px;
	position: relative;
}
.pt_font {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
