<script setup lang="ts">
import { feature } from '@/core/global';
import { BUYABLES } from '@/core/mechanic';
import { player } from '@/core/save';
import { format, formatWhole } from '@/utils/format';
import TDUpgrade from '../../group-2/TDUpgrade.vue';
import TDBuyable from '../../group-2/TDBuyable.vue';
import PrimaryButton from '@/components/ui/PrimaryButton';
import type { $t } from '@/utils/types';
import { useI18n } from 'vue-i18n';
const $t = useI18n().t;
function successorButton() {
	let base = `${$t('succ.successor')}x`;
	if (player.upgrades['25']) base = `${$t('succ.addition')}+`;
	base += format(feature.SUCCESSOR.successorBulk());
	if (feature.SUCCESSOR.successorPow().gt(1)) {
		base += `<sup>${format(feature.SUCCESSOR.successorPow())}</sup>`;
	}
	if (BUYABLES.lock('11').unlocked) {
		base += $t('succ.automation', {
			speed: formatWhole(feature.SUCCESSOR.autoSuccessPerSecond()),
		});
	}

	return base;
}
</script>

<template>
	<div class="main">
		<div class="clickable">
			<PrimaryButton
				@click="feature.SUCCESSOR.success()"
				:style="{
					width: 'fit-content',
				}"
				:inner-h-t-m-l="successorButton()"
			>
			</PrimaryButton>
		</div>
		<table align="center">
			<TDUpgrade upgid="11" />
			<TDUpgrade upgid="12" />
			<TDUpgrade upgid="13" />
			<TDBuyable bylid="11" />
		</table>
	</div>
</template>

<style scoped>
/* code... */
</style>
