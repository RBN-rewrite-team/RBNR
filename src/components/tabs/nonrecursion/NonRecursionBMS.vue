<script setup lang="ts">
import { player } from '@/core/global';
import { NON_REC_BMS } from '@/core/nonrecu/nonrec-bms';
import { getCurrentNRBMSOrdinal } from '@/core/nonrecu/nonrec-bms/milestones';
import { format, formatGain } from '@/utils/format';
import Upgrades from '@/components/upg/Upgrades';
const macros = {
	'\\psd': '\\text{psd}',
	'\\aft': '\\text{ aft }',
	'\\nd': '\\text{nd }',
} as const;
</script>

<template>
	<div class="main">
		<p>
			{{
				$t('nonrecbms.value', {
					a: format(player.pt.nonrecBMS.deduce),
				})
			}}<vue-latex
				:expression="getCurrentNRBMSOrdinal(player.pt.nonrecBMS.deduce)"
				:macros
			/>{{ formatGain(player.pt.nonrecBMS.deduce, NON_REC_BMS.deduceSpeed(), '') }}
		</p>
		<p>
			{{
				$t('nonrecbms.effect.0', {
					effect: format(NON_REC_BMS.effects()[0]),
				})
			}}
		</p>
		<p v-if="player.milestones.sin_10">
			{{
				$t('nonrecbms.effect.1', {
					effect: format(NON_REC_BMS.effects()[1]),
				})
			}}
		</p>
		<Upgrades
			:upgids="[
				['u81', 'u82', 'u83', 'u84'],
				['u85', 'u86', 'u87', 'u88'],
				['u89', 'u810', 'u811', 'u812'],
				['u813', 'u814', 'u815', 'u816'],
			]"
		/>
	</div>
</template>
