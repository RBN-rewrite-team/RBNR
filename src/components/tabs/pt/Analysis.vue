<script setup lang="ts">
import {player, feature} from '@/core/global.ts';
import {Analysis, dayOfWeek} from '@/core/pt/index.ts';

function unlockedList(): string {
	let s = '';
	for(let i = 0;i < 7;i++) if(Analysis.analysisUnlocked(i)) s += Analysis.systems[i] + ' ';
	return s;
}
</script>

<template>
	<br>
	<h3 style="color: cyan">
		解析系统中，每周的不同时段会解锁不同系统。<br>
		当前是 {{dayOfWeek()[1]}} ，解锁 <span v-html="unlockedList()" />系统。<br>
		进行证明论重置以随机解析，成功率为 5% ，解析同一系统20次必定成功。<br>
	</h3>
	<div v-for="count in 7" align="center"
	:style="{opacity: Analysis.analysisUnlocked(count - 1) ? 1 : 0.5}">
		<br>
		<div class="system">
			<h3 v-html="count + ': ' + Analysis.systems[count - 1]" /><br>
			解析进度：{{player.pt.analysis[count - 1]}}/11(本次解析已尝试{{player.pt.analysisFailed[count - 1]}}次)<br>
		</div>
	</div>
</template>

<style scoped>
.system {
	height: 200px;
	width: calc(100% - 20px);
	border: 2px solid cyan;
	color: cyan;
}
</style>