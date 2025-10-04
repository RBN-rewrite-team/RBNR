<script setup lang="ts">
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
import { player } from '@/core/save';
import { format, formatLaTeX, formatLaTeXWhole } from '@/utils/format';
import { UNOCF, UNOCF_milestone } from '@/utils/unocf-mil';
import { computed } from 'vue';
import Baixie from '@/components/group-2/Baixie.vue';
import { NON_RECURSIVE } from '@/core/nonrecu';
let cur = computed(() =>
	UNOCF.getUNOCFMilestone(UNOCF.getCurMilestoneIndex(player.nonrecu.unocf_j)),
);
</script>

<template>
	<div class="main">
		<p style="color: grey; table-align: center">
			<vue-latex
				expression="\Pi_2 \operatorname{onto}\mathrm{Ord}\subset \{a|\operatorname{cf}(a)=a\}"
			/>。
		</p>

		<p>
			你的UNOCF序数为<vue-latex
				:expression="
					cur[1] +
					'=\\operatorname{deduce}(\\operatorname{floor}(' +
					formatLaTeX(player.nonrecu.unocf_j) +
					'))'
				"
			/>(+{{ format(NON_RECURSIVE.UNOCFdeduceSpeed()) }}/s)
		</p>
		<p>由于UNOCF机制太复杂，并不是每一次推演都会得到对应的序数</p>
		<p v-if="cur[2]"><vue-latex :expression="'\\psi(' + cur[1] + ')=' + cur[2]" /></p>
		<p>UNOCF推演使得BMS推演速度^{{ format(NON_RECURSIVE.UNOCFeff()[0]) }}(BMS推演速度>1时生效)</p>
		<p v-if="player.nonrecu.unocf_j.lt(512)">超过512推演次数解锁UNOCF推演第二效果</p>
		<p v-else-if="player.nonrecu.unocf_j.gte(512)">
			UNOCF推演使得UNOCF推演速度*{{ format(NON_RECURSIVE.UNOCFeff()[1]) }}
		</p>
		<p v-if="player.nonrecu.unocf_j.gte(512) && player.nonrecu.unocf_j.lt(4096)">
			超过4096推演次数解锁UNOCF推演第三效果
		</p>
		<p v-else-if="player.nonrecu.unocf_j.gte(4096)">
			UNOCF推演使得九头蛇溶液获取*{{ format(NON_RECURSIVE.UNOCFeff()[2]) }}
		</p>
		<p v-if="player.nonrecu.unocf_j.gte(4096) && player.nonrecu.unocf_j.lt(16384)">
			超过16384推演次数解锁UNOCF推演第四效果
		</p>
		<p v-else-if="player.nonrecu.unocf_j.gte(16384)">
			UNOCF推演使得非递归能量获取^{{ format(NON_RECURSIVE.UNOCFeff()[3]) }}
		</p>
		<p v-if="player.nonrecu.unocf_j.gte(16384) && player.nonrecu.unocf_j.lt('1e1900')">
			超过1.000e1900推演次数解锁UNOCF推演第五效果
		</p>
		<p v-else-if="player.nonrecu.unocf_j.gte(16384)">
			UNOCF推演使得朊病毒增长速度双指数×{{ format(NON_RECURSIVE.UNOCFeff()[4]) }}
		</p>
		<p>
			下一个序数为<vue-latex
				:expression="
					UNOCF.getUNOCFMilestone(UNOCF.getCurMilestoneIndex(player.nonrecu.unocf_j) + 1)[1] +
					'=\\operatorname{deduce}(' +
					formatLaTeXWhole(
						UNOCF.getUNOCFMilestone(UNOCF.getCurMilestoneIndex(player.nonrecu.unocf_j) + 1)[0],
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
