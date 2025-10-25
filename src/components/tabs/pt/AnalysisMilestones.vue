<script lang="ts" setup>
import TRMilestone from '@/components/group-2/TRMilestone.vue';
import { totalAnalysisTimes } from '@/core/pt/milestones';
import { player } from '@/core/save';
import { formatWhole } from '@/utils/format';
</script>

<template>
	<div class="main">
		<p>
			你有
			<b style="color: cyan; font-size: 30px">{{ formatWhole(totalAnalysisTimes()) }}</b>
			证明论解析次数
		</p>
		<p>
			你有
			<b style="color: cyan; font-size: 20px">{{ formatWhole(player.pt.resetTimes) }}</b>
			证明论重置次数
		</p>
		<p>
			你有
			<b style="color: cyan; font-size: 20px">{{
				formatWhole(player.pt.qolPointsCrystal)
			}}</b>
			生活质量水晶
		</p>
		<table align="center">
			<tbody>
				<TRMilestone v-for="count in 3" :id="'pt_' + count" />
			</tbody>
		</table>
	</div>
</template>
