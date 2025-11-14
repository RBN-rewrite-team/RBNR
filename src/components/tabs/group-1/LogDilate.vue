<script lang="ts" setup>
import { player } from '@/core/save';
import DilateButton from '../../group-2/DilateButton.vue';
import { Logarithm } from '@/core/exponention/logarithm';
import { feature } from '@/core/global';
import { format } from '@/utils/format';
import TRMilestone from '../../group-2/TRMilestone.vue';
import { useI18n } from 'vue-i18n';
const $t = useI18n().t;
function dilateDebuff() {
	return $t('exp.log.law.dil.xx', {
		a: format(Logarithm.dilateNerf()),
		b: format(Logarithm.dilateNerf().div(2)),
	});
	// {{ $t('exp.log.law.dil.1') }}
	// 			<br />
	// 			{{ $t('exp.log.law.dil.2') }}{{ format(Logarithm.dilateNerf())
	// 			}}{{ $t('exp.log.law.dil.3') }}{{ format(Logarithm.dilateNerf().div(2))
	// 			}}{{ $t('exp.log.law.dil.4') }}<br />{{ $t('exp.log.law.dil.5') }}
}
function dilateBuff2() {
	return $t('exp.log.law.dil.xx2', {
		a: format(Logarithm.logarithm.highest_dilate),
		b: format(Logarithm.dilateEffect()[0]),
		c: format(Logarithm.dilateEffect()[1]),
	});
}
</script>

<template>
	<div class="main">
		<div align="center" style="margin-top: 5px">
			<DilateButton
				@click="feature.EXPONENTION.toggleDilate()"
				style="font-size: 18px"
				:class="{
					dilate_activate: player.exponention.logarithm.in_dilate,
				}"
				>{{
					$t(
						player.exponention.logarithm.in_dilate
							? 'set.status.exit'
							: 'set.status.enter',
					)
				}}{{ $t('exp.log.law.dil') }}</DilateButton
			>
			<p v-html="dilateDebuff()"></p>
			<p>{{ $t('exp.log.law.dil.6') }}</p>
			<p v-html="dilateBuff2()"></p>
			<table>
				<tbody class="milestones">
					<TRMilestone id="dil_1" />
					<TRMilestone id="dil_2" />
					<TRMilestone id="dil_3" />
					<TRMilestone id="dil_4" />
					<TRMilestone id="dil_5" />
					<TRMilestone id="dil_6" />
					<TRMilestone id="dil_7" />
				</tbody>
			</table>
		</div>
	</div>
</template>
