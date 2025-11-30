<script setup lang="ts">
import Baixie from '@/components/group-2/Baixie.vue';
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
import { player } from '@/core/global';
import { NON_REC_BMS } from '@/core/nonrecu/nonrec-bms';
import {
	getCurrentNRBMSMilestone,
	getCurrentNRBMSOrdinal,
} from '@/core/nonrecu/nonrec-bms/milestones';
import { format, formatGain } from '@/utils/format';
</script>

<template>
	<div class="main">
		<p>
			你的非递归BMS推演次数为{{ format(player.pt.nonrecBMS.deduce) }},序数为<vue-latex
				:expression="getCurrentNRBMSOrdinal(player.pt.nonrecBMS.deduce)"
			/>{{ formatGain(player.pt.nonrecBMS.deduce, NON_REC_BMS.deduceSpeed(), '') }}
		</p>
		<p>非递归BMS使CHE slog +{{ format(NON_REC_BMS.effects()[0]) }}</p>
		<table align="center">
			<tbody>
				<tr>
					<TDUpgrade upgid="81" />
					<TDUpgrade upgid="82" />
					<TDUpgrade upgid="83" />
					<TDUpgrade upgid="84" />
				</tr>
			</tbody>
		</table>
	</div>
</template>
