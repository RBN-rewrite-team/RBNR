<script setup lang="ts">
import TDUpgrade from '@/components/TDUpgrade.vue';
import { player } from '@/core/save';
import { format, formatLaTeX, formatLaTeXWhole } from '@/utils/format';
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
					'=\\operatorname{deduce}(\\operatorname{floor}(' +
					formatLaTeX(player.nonrecu.unocf_j) +
					'))'
				"
			/>
		</p>
		<p>由于UNOCF机制太复杂，并不是每一次推演都会得到对应的序数</p>
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
		<table style="margin: auto" align="cewter">
			<tbody>
				<tr>
					<TDUpgrade upgid="71UN"></TDUpgrade>
				</tr>
			</tbody>
		</table>
	</div>
</template>
