<script lang="ts" setup>
import TRMilestone from '@/components/group-2/TRMilestone.vue';
import { totalAnalysisTimes } from '@/core/pt/milestones';
import { player } from '@/core/save';
import { formatWhole } from '@/utils/format';
import QolCrystalUpgrade from './QolCrystalUpgrade';
</script>

<template>
	<div class="main">
		<p
			v-html="
				$t('pt.youhave1', {
					a: `<b style='color: cyan; font-size: 30px'>${formatWhole(
						totalAnalysisTimes(),
					)}</b>`,
				})
			"
		></p>
		<p
			v-html="
				$t('pt.youhave2', {
					a: `<b style='color: cyan; font-size: 30px'>${formatWhole(
						player.pt.resetTimes,
					)}</b>`,
				})
			"
		></p>
		<p
			v-html="
				$t('pt.youhave3', {
					a: `<b style='color: cyan; font-size: 30px'>${formatWhole(
						player.pt.qolPointsCrystal,
					)}</b>`,
				})
			"
		></p>
		<table align="center">
			<tbody>
				<TRMilestone v-for="count in 7" :id="'pt_' + count" />
			</tbody>
		</table>
		<QolCrystalUpgrade />
	</div>
</template>
