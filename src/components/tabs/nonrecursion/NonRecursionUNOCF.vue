<script setup lang="ts">
import { player } from '@/core/save';
import { format, formatLaTeXWhole } from '@/utils/format';
import { UNOCF, UNOCF_milestone } from '@/utils/unocf-mil';
import { computed } from 'vue';
let cur = computed(() =>
	UNOCF.getUNOCFMilestone(UNOCF.getCurMilestoneIndex(player.nonrecu.unocf_j)),
);
</script>

<template>
	<div class="main">
		<p>
			你的UNOCF序数为<vue-latex
				:expression="
					cur[1] +
					'=\\operatorname{deduce}(' +
					formatLaTeXWhole(player.nonrecu.unocf_j) +
					')'
				"
			/>
		</p>
		<p v-if="cur[2]"><vue-latex :expression="'\\psi(' + cur[1] + ')=' + cur[2]" /></p>
		<p>
			下一个序数为<vue-latex
				:expression="
					UNOCF.getUNOCFMilestone(
						UNOCF.getCurMilestoneIndex(player.nonrecu.unocf_j) + 1,
					)[1] +
					'=\\operatorname{deduce}(' +
					formatLaTeXWhole(
						UNOCF.getUNOCFMilestone(
							UNOCF.getCurMilestoneIndex(player.nonrecu.unocf_j) + 1,
						)[0],
					) +
					')'
				"
			/>
		</p>
	</div>
</template>
