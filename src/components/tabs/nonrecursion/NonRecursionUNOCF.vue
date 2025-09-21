<script setup lang="ts">
import { player } from '@/core/save';
import { format, formatLaTeXWhole } from '@/utils/format';
import { UNOCF, UNOCF_milestone } from '@/utils/unocf-mil';
</script>

<template>
	<div class="main">
		<p>
			你的UNOCF序数为<vue-latex
				:expression="
					UNOCF.getUNOCFMilestone(UNOCF.getCurMilestoneIndex(player.nonrecu.unocf_j))[1] +
					'=\\operatorname{deduce}(' +
					formatLaTeXWhole(player.nonrecu.unocf_j) +
					')'
				"
			/>
		</p>
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
