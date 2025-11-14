<script setup lang="ts">
import TRMilestone from '@/components/group-2/TRMilestone.vue';
import { formatWhole } from '@/utils/format';
import { player } from '@/core/global';
import { useI18n } from 'vue-i18n';

const $t = useI18n().t;
function resetTimes() {
	return $t('nonrec.youhavereset', {
		times: `<b style="color: #c98300; font-size: 30px">${formatWhole(
			player.nonrecu.resetTimes,
		)}</b>`,
	});
}
</script>

<template>
	<div style="position: sticky; top: 0; background-color: var(--background-color)">
		<p v-html="resetTimes()"></p>
	</div>
	<table align="center">
		<TRMilestone :id="'nonrec_' + i" v-for="i in 26" :key="i"></TRMilestone>
	</table>
</template>
