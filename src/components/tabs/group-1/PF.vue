<script setup lang="ts">
import { format, formatMult, formatWhole } from '@/utils/format';
import { feature, player } from '@/core/global';
import { buyables } from '@/core/mechanic';
const pflist = ['2', '3', '5', '7', '11', '13', '17', '19'] as const;
import TDBuyable from '../../group-2/TDBuyable.vue';
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
			<table align="center">
				<tbody>
					<tr>
						<TDBuyable bylid="pf2" />
						<TDBuyable bylid="pf3" />
						<TDBuyable bylid="pf5" />
						<TDBuyable bylid="pf7" />
					</tr>
					<tr>
						<TDBuyable bylid="pf11" />
						<TDBuyable bylid="pf13" />
						<TDBuyable bylid="pf17" />
						<TDBuyable bylid="pf19" />
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
