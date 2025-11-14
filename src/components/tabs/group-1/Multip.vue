<script setup lang="ts">
import { feature } from '@/core/global';
import { formatMult } from '@/utils/format';
import { player } from '@/core/global';
import TDUpgrade from '../../group-2/TDUpgrade.vue';
import TDBuyable from '../../group-2/TDBuyable.vue';
import { useI18n } from 'vue-i18n';

const $t = useI18n().t;

function effect() {
	return $t('mul.effect', {
		effect: `<span style="color: #cc33ff; font-weight: bold"
					>${formatMult(feature.MULTIPLICATION.powerEff())}</span
				>`,
	});
}
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			<div align="center" v-if="player.firstResetBit & 0b10" v-html="effect()"></div>
			<table align="center">
				<tbody>
					<tr>
						<TDUpgrade upgid="31" />
						<TDUpgrade upgid="32" />
						<TDUpgrade upgid="33" />
						<TDUpgrade upgid="34" />
					</tr>
					<tr>
						<TDUpgrade upgid="35" />
						<TDUpgrade upgid="36" />
						<TDUpgrade upgid="37" />
						<TDUpgrade upgid="38" />
					</tr>
					<tr>
						<TDUpgrade upgid="39" />
						<TDBuyable bylid="31" />
						<TDBuyable bylid="32" />
						<TDBuyable bylid="33" />
					</tr>
					<tr>
						<TDUpgrade upgid="310" />
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
