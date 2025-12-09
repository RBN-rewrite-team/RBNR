<script setup lang="ts">
import { format, formatMult, formatWhole } from '@/utils/format';
import { feature, player } from '@/core/global';
import { buyables } from '@/core/mechanic';
const pflist = ['2', '3', '5', '7', '11', '13', '17', '19'] as const;
import type { PrimeFactorTypes } from '@/core/save';
import { useI18n } from 'vue-i18n';
const $t = useI18n().t;
function factorpower() {
	return $t('mul.youhavefp', {
		fp: `<span style="color: #cc33ff; font-weight: bold"
					>${formatMult(feature.PrimeFactor.power())}</span
				>`,
	});
}
function fpeffect() {
	return $t('mul.fpeffect', {
		effect: `<span style="color: #cc33ff; font-weight: bold"
					>${formatMult(feature.PrimeFactor.powerEff())}</span
				>`,
	});
}
import Upgrades from '@/components/upg/Upgrades';
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			<div align="center">
				<span v-html="factorpower()"></span><br />
				(<span v-for="pf in pflist">
					<span style="color: #cc33ff; font-weight: bold"
						>{{ pf
						}}<sup>{{
							formatWhole(
								player.buyables[('pf' + pf) as PrimeFactorTypes].add(
									buyables[('pf' + pf) as PrimeFactorTypes].more(),
								),
							)
						}}</sup></span
					><span v-if="pf != '19'"> × </span> </span
				>)<span
					style="color: rgb(127, 127, 255)"
					v-if="feature.PrimeFactor.powerpow().gt(1)"
					><sup>{{ format(feature.PrimeFactor.powerpow()) }}</sup></span
				><br />
				<span v-html="fpeffect()"></span>
			</div>
			<Upgrades
				:upgids="[
					['bpf2', 'bpf3', 'bpf5', 'bpf7'],
					['bpf11', 'bpf13', 'bpf17', 'bpf19'],
				]"
			/>
		</div>
	</div>
</template>
