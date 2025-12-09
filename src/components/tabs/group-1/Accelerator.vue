<script lang="ts" setup>
import { ORDINAL_BOOSTER } from '@/core/ordinal/ordinal-booster';
import { format, formatGain } from '@/utils/format';
import { useI18n } from 'vue-i18n';
import Upgrades from '@/components/upg/Upgrades';

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
		<Upgrades :upgids="[['b51A', 'b52A', 'b53A', 'u51A']]" />
	</div>
</template>
