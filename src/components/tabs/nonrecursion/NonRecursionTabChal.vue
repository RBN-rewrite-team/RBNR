<script setup lang="ts">
import TDChallenge from '@/components/TDChallenge.vue';
import { player } from '@/core/save';


</script>

<template>
	<div class="main nonrec-chals" align="center">
		<table>
			<tr>
				<TDChallenge v-if="player.nonrecu.studies_bought.includes(5)" :layer="1" :chid="0" ></TDChallenge>
			</tr>
		</table>

	</div>
</template>

<style lang="scss" scoped>
.main {
	margin-top: 10px;
}
</style>
