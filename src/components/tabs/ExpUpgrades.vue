<script setup lang="ts">
import { player } from '@/core/save';
import { feature } from '@/core/global.ts';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
import { format, formatWhole } from '@/utils/format.ts';
import Decimal from 'break_eternity.js';
</script>

<template>
	<div class="main">
		<span v-if="player.firstResetBit & 0b100">
			累计指数能量提供了<span style="color: rgb(127, 127, 255)"
				>^{{ format(feature.EXPONENTION.powerEff()) }}</span
			>
			数值增益<br />
			战利品提供了<span style="color: rgb(127, 127, 255)"
				>^{{ format(new Decimal(1.03)) }}</span
			>
			数值增益
		</span>
		<br />
		<br />
		<h2 style="color: rgb(127, 127, 255)">普通升级</h2>
		<table align="center">
			<tbody>
				<tr>
					<TDUpgrade upgid="41" />
					<TDUpgrade upgid="42" />
					<TDUpgrade upgid="43" />
					<TDUpgrade upgid="44" />
				</tr>
				<tr>
					<TDUpgrade upgid="45" />
				</tr>
				<tr>
					<TDBuyable bylid="41" />
					<TDBuyable bylid="42" />
					<TDBuyable bylid="43" />
					<TDBuyable bylid="44" />
				</tr>
			</tbody>
		</table>
		<h2 style="color: rgb(255, 127, 255)">QoL点数升级</h2>
		<span
			>你有
			<span style="color: rgb(255, 127, 255)">{{
				formatWhole(player.exponention.qolpoints)
			}}</span>
			Qol点数</span
		>
		<table align="center">
			<tbody class="smaller">
				<tr>
					<TDUpgrade upgid="400q" />
				</tr>
				<tr>
					<TDUpgrade upgid="411q" />
					<TDUpgrade upgid="412q" />
					<TDUpgrade upgid="413q" />
					<TDUpgrade upgid="414q" />
					<TDUpgrade upgid="415q" />
				</tr>
				<tr>
					<TDUpgrade upgid="421q" />
					<TDUpgrade upgid="422q" />
					<TDUpgrade upgid="423q" />
					<TDUpgrade upgid="424q" />
					<TDUpgrade upgid="425q" />
				</tr>
				<tr>
					<TDUpgrade upgid="431q" />
					<TDUpgrade upgid="432q" />
					<TDUpgrade upgid="433q" />
					<TDUpgrade upgid="434q" />
					<TDUpgrade upgid="435q" />
				</tr>
				<tr>
					<TDUpgrade upgid="441q" />
					<TDUpgrade upgid="442q" />
					<TDUpgrade upgid="443q" />
					<TDUpgrade upgid="444q" />
					<TDUpgrade upgid="445q" />
				</tr>
				<tr>
					<TDUpgrade upgid="451q" />
					<TDUpgrade upgid="452q" />
					<TDUpgrade upgid="453q" />
					<TDUpgrade upgid="454q" />
					<TDUpgrade upgid="455q" />
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
tbody.smaller > tr {
	height: 135px;
}
</style>
