<script setup lang="ts">
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
import { player } from '@/core/save';
import { format, formatLaTeX, formatLaTeXWhole } from '@/utils/format';
import { UNOCF } from '@/utils/unocf-mil';
import { computed } from 'vue';
import { NON_RECURSIVE } from '@/core/nonrecu';
const cur = computed(() =>
	UNOCF.getUNOCFMilestone(UNOCF.getCurMilestoneIndex(player.nonrecu.unocf_j)),
);
</script>

<template>
	<div class="main">
		<p>
			{{ $t('nonrec.unocf.is')
			}}<vue-latex
				:expression="
					cur[1] +
					`=\\operatorname{deduce}(${
						player.nonrecu.unocf_j.gte(4503599627370496)
							? formatLaTeX(player.nonrecu.unocf_j)
							: `\\operatorname{floor}(${formatLaTeX(player.nonrecu.unocf_j)})`
					})`
				"
			/>(+{{ format(NON_RECURSIVE.UNOCFdeduceSpeed()) }}/s)
		</p>
		<p>{{ $t('nonrec.unocf.tip') }}</p>
		<p v-if="cur[2]"><vue-latex :expression="'\\psi(' + cur[1] + ')=' + cur[2]" /></p>
		<div style="border: 1px solid #c98300; margin: auto; width: 50%">
			<p>
				{{
					$t('nonrec.unocf.eff.1', {
						effect: format(NON_RECURSIVE.UNOCFeff()[0]),
					})
				}}
			</p>
			<p v-if="player.nonrecu.unocf_j.lt(512)">{{ $t('nonrec.unocf.eff.2.unl') }}</p>
			<p v-else-if="player.nonrecu.unocf_j.gte(512)">
				{{
					$t('nonrec.unocf.eff.2', {
						effect: format(NON_RECURSIVE.UNOCFeff()[1]),
					})
				}}
			</p>
			<p v-if="player.nonrecu.unocf_j.gte(512) && player.nonrecu.unocf_j.lt(4096)">
				{{ $t('nonrec.unocf.eff.3.unl') }}
			</p>
			<p v-else-if="player.nonrecu.unocf_j.gte(4096)">
				{{ $t('nonrec.unocf.eff.3', { effect: format(NON_RECURSIVE.UNOCFeff()[2]) }) }}
			</p>
			<p v-if="player.nonrecu.unocf_j.gte(4096) && player.nonrecu.unocf_j.lt(16384)">
				{{ $t('nonrec.unocf.eff.4.unl') }}
			</p>
			<p v-else-if="player.nonrecu.unocf_j.gte(16384)">
				{{ $t('nonrec.unocf.eff.4', { effect: format(NON_RECURSIVE.UNOCFeff()[3]) }) }}
			</p>
			<p v-if="player.nonrecu.unocf_j.gte(16384) && player.nonrecu.unocf_j.lt('1e1900')">
				{{ $t('nonrec.unocf.eff.5.unl') }}
			</p>
			<p v-else-if="player.nonrecu.unocf_j.gte(16384)">
				{{ $t('nonrec.unocf.eff.5', { effect: format(NON_RECURSIVE.UNOCFeff()[4]) }) }}
			</p>
		</div>
		<p>
			{{ $t('nonrec.unocf.nextord')
			}}<vue-latex
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
