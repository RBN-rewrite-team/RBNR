<script lang="ts" setup>
import { player } from '@/core/save';
import TDChallenge from '../TDChallenge.vue';
import MultipResetButton from '../MultipResetButton.vue';
</script>

<template>
	<div class="main" v-if="player.currentTab == 8">
		<table style="transform: translateY(60px)">
			<tbody>
				<tr>
					<TDChallenge :layer="0" :chid="0" />
					<TDChallenge :layer="0" :chid="1" />
					<TDChallenge :layer="0" :chid="2" />
				</tr>
				<tr>
					<TDChallenge :layer="0" :chid="3" v-if="player.singularity.stage < 4" />
				</tr>
			</tbody>
		</table>
	</div>
</template>
