<script setup lang="ts">
import { feature } from '@/core/global';
import { BUYABLES } from '@/core/mechanic';
import { player } from '@/core/save';
import { format, formatWhole } from '@/utils/format';
import Upgrades from '@/components/upg/Upgrades';
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
			<div
				@click="feature.SUCCESSOR.success()"
				v-hold="{
					handler: {
						onProgress: () => feature.SUCCESSOR.success(),
					},
				}"
			>
				<PrimaryButton
					:style="{
						width: 'fit-content',
					}"
					:inner-h-t-m-l="successorButton()"
				>
				</PrimaryButton>
			</div>
		</div>
		<Upgrades :upgids="[['u11', 'u12', 'u13', 'b11']]" />
	</div>
</template>
