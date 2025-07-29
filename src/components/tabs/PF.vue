<script setup lang="ts">
import { format, formatWhole } from '@/utils/format';
import MultipResetButton from '../MultipResetButton.vue';
import { feature, player } from '@/core/global';
import { buyables } from '@/core/mechanic';
const pflist = ['2', '3', '5', '7', '11', '13', '17', '19'] as const;
import TDBuyable from '../TDBuyable.vue';
import type { PrimeFactorTypes } from '@/core/save';
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			<div align="center">
				你有<span style="color: #cc33ff; font-weight: bold"
					>x{{ formatWhole(feature.PrimeFactor.power()) }}</span
				>因数能量<br />
				(<span v-for="pf in pflist">
					<span style="color: #cc33ff; font-weight: bold"
						>{{ pf
						}}<sup>{{
							formatWhole(player.buyables[('pf' + pf) as PrimeFactorTypes].add(
								buyables?.['pf' + pf]?.more?.() ?? 0,
							))
						}}</sup></span
					><span v-if="pf != '19'"> × </span> </span
				>)<span
					style="color: rgb(127, 127, 255)"
					v-if="feature.PrimeFactor.powerpow().gt(1)"
					><sup>{{ format(feature.PrimeFactor.powerpow()) }}</sup></span
				><br />
				基于本次乘法重置耗时提供<span style="color: #cc33ff; font-weight: bold"
					>x{{ format(feature.PrimeFactor.powerEff()) }}</span
				>数值和加法能量增益
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
