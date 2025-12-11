<script setup lang="ts">
import { feature, player } from '@/core/global';
import { formatWhole } from '@/utils/format';
import { useI18n } from 'vue-i18n';
const $t = useI18n().t;
function t() {
	return $t('ord.1', {
		amount: `<span
					style="color: rgb(255, 63, 63)"
					
	>${formatWhole(feature.Ordinal.base())}</span>`,
	});
}
import Upgrades from '@/components/upg/Upgrades';
import { useUpdate } from '@/lib/useUpdate';
const ordupgs = useUpdate(function () {
	if (player.upgrades[61]) {
		return [
			['u51', 'u52', 'u53', 'u54'],
			['u58', 'u59', 'u511', 'u512'],
			['u513', 'u514', 'u515', 'u516'],
			['u517'],
		] as const;
	}
	return [
		['u51', 'u52', 'u53', 'u54'],
		['u55', 'u56', 'u57', 'u58'],
		['u59', 'u510', 'u511', 'u512'],
		['u513', 'u514', 'u515', 'u516'],
		['u517'],
	] as const;
});
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			<div align="center">
				<span v-html="t()"></span><br />
				<Upgrades :upgids="ordupgs" />
			</div>
		</div>
	</div>
</template>
