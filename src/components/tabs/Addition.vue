<script setup lang="ts">
import { feature } from '@/core/global';
import { player } from '@/core/save';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
import AdditionResetButton from '../AdditionResetButton.vue';

// code...
</script>

<template>
	<div class="main">
		<AdditionResetButton />
		<div style="transform: translateY(60px)">
			<table align="center">
				<tbody>
					<tr>
						<TDUpgrade upgid="21" />
						<TDUpgrade upgid="22" />
						<TDUpgrade upgid="23" />
						<TDUpgrade upgid="24" />
					</tr>
					<tr>
						<TDBuyable bylid="21" />
						<TDUpgrade upgid="25" />
						<TDUpgrade upgid="26" />
					</tr>
				</tbody>
			</table>
			<br />
			<div align="center" v-if="player.upgrades[31]" style="transform: translateY(65px)">
				你可以选择将U1-2, U1-3, U1-4,
				U1-5中的一个升级，将其的价格降为1，但会进行一次乘法重置。<br />
				<button
					@click="feature.ADDITION.setUPGc1(2)"
					class="clickable_button"
					style="display: inline-block"
				>
					2
				</button>
				<button
					@click="feature.ADDITION.setUPGc1(3)"
					class="clickable_button"
					style="display: inline-block"
				>
					3
				</button>
				<button
					@click="feature.ADDITION.setUPGc1(4)"
					class="clickable_button"
					style="display: inline-block"
				>
					4
				</button>
				<button
					@click="feature.ADDITION.setUPGc1(5)"
					class="clickable_button"
					style="display: inline-block"
				>
					5
				</button>
			</div>
		</div>
	</div>
	<!-- code... -->
</template>

<style scoped>
/* code... */
</style>
