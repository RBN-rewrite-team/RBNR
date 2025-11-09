<script lang="ts" setup>
import { ORDINAL_BOOSTER } from '@/core/ordinal/ordinal-booster';
import TDBuyable from '../../group-2/TDBuyable.vue';
import TDUpgrade from '../../group-2/TDUpgrade.vue';
import { format, formatGain } from '@/utils/format';
import { useI18n } from 'vue-i18n';

const $t = useI18n().t;
function q() {
	return $t('ord.acc', {
		eff: format(ORDINAL_BOOSTER.boosterEffect()),
		q: formatGain(ORDINAL_BOOSTER.boosterEffect(), ORDINAL_BOOSTER.boosterGrow()),
		c: format(ORDINAL_BOOSTER.boosterCap()),
	});
}
</script>

<template>
	<div class="main">
		<p v-html="q()"></p>
		<table align="center">
			<tbody>
				<tr>
					<TDBuyable bylid="51A" />
					<TDBuyable bylid="52A" />
					<TDBuyable bylid="53A" />
					<TDUpgrade upgid="51A" />
				</tr>
			</tbody>
		</table>
	</div>
</template>
