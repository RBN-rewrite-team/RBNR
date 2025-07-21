<script setup lang="ts">
import { feature } from '@/core/global';
import { format } from '@/utils/format';
import { player } from '@/core/global';
import MultipResetButton from '../MultipResetButton.vue';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			<div align="center" v-if="player.firstResetBit & 0b10">
				累计乘法能量提供了<span style="color: #cc33ff; font-weight: bold"
					>x{{ format(feature.MULTIPLICATION.powerEff()) }}</span
				>数值增益
			</div>
			<table align="center">
				<tbody>
					<tr>
						<TDUpgrade upgid="31" />
						<TDUpgrade upgid="32" />
						<TDUpgrade upgid="33" />
						<TDUpgrade upgid="34" />
					</tr>
					<tr>
						<TDUpgrade upgid="35" />
						<TDUpgrade upgid="36" />
						<TDUpgrade upgid="37" />
						<TDUpgrade upgid="38" />
					</tr>
					<tr>
						<TDUpgrade upgid="39" />
						<TDBuyable bylid="31" />
						<TDBuyable bylid="32" />
						<TDBuyable bylid="33" />
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
