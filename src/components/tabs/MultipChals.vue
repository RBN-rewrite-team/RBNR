<script lang="ts" setup>
import { player } from '@/core/save';
import TDChallenge from '../TDChallenge.vue';
</script>

<template>
	<div class="main" v-if="player.currentTab == 8">
		<table>
			<tbody>
				<tr>
					<TDChallenge :layer="0" :chid="0" />
				</tr>
			</tbody>
		</table>
	</div>
</template>
