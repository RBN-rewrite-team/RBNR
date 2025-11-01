<script setup lang="ts">
import TRMilestone from '@/components/group-2/TRMilestone.vue';
import { formatWhole } from '@/utils/format';
import { player } from '@/core/global';
</script>

<template>
	<div style="position: sticky; top: 0; background-color: var(--background-color)">
		<p>
			你非递归重置了<b style="color: #c98300; font-size: 30px">{{
				formatWhole(player.nonrecu.resetTimes)
			}}</b
			>次。
		</p>
	</div>
	<table align="center">
		<TRMilestone :id="'nonrec_' + i" v-for="i in 26" :key="i"></TRMilestone>
	</table>
</template>
