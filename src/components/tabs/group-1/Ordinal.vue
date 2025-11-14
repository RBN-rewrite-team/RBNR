<script setup lang="ts">
import { feature, player } from '@/core/global';
import { formatWhole } from '@/utils/format';
import TDUpgrade from '../../group-2/TDUpgrade.vue';
import { useI18n } from 'vue-i18n';
const $t = useI18n().t;
function t() {
	return $t('ord.1', {
		amount: `<span
					style="color: rgb(255, 63, 63)"
					
	>${formatWhole(feature.Ordinal.base())}</span>`,
	});
}
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			<div align="center">
				<span v-html="t()"></span><br />
				<table>
					<tbody>
						<tr>
							<TDUpgrade upgid="51" />
							<TDUpgrade upgid="52" />
							<TDUpgrade upgid="53" />
							<TDUpgrade upgid="54" />
						</tr>
						<tr v-if="!player.upgrades[61]">
							<TDUpgrade upgid="55" />
							<TDUpgrade upgid="56" />
							<TDUpgrade upgid="57" />
							<TDUpgrade upgid="58" />
						</tr>
						<tr v-if="!player.upgrades[61]">
							<TDUpgrade upgid="59" />
							<TDUpgrade upgid="510" />
							<TDUpgrade upgid="511" />
							<TDUpgrade upgid="512" />
						</tr>
						<tr v-if="player.upgrades[61]">
							<TDUpgrade upgid="58" />
							<TDUpgrade upgid="59" />
							<TDUpgrade upgid="511" />
							<TDUpgrade upgid="512" />
						</tr>
						<tr>
							<TDUpgrade upgid="513" />
							<TDUpgrade upgid="514" />
							<TDUpgrade upgid="515" />
							<TDUpgrade upgid="516" />
						</tr>
						<tr>
							<TDUpgrade upgid="517" />
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
