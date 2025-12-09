<script setup lang="ts">
import { feature } from '@/core/global';
import { formatMult } from '@/utils/format';
import { player } from '@/core/global';
import { useI18n } from 'vue-i18n';
import Upgrades from '@/components/upg/Upgrades';

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
			<Upgrades
				:upgids="[
					['u31', 'u32', 'u33', 'u34'],
					['u35', 'u36', 'u37', 'u38'],
					['u39', 'b31', 'b32', 'b33'],
					['u310'],
				]"
			/>
		</div>
	</div>
</template>
