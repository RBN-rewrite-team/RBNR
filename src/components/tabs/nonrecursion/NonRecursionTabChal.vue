<script setup lang="ts">
import TDChallenge from '@/components/TDChallenge.vue';
import { player } from '@/core/save';


</script>

<template>
	<div class="main nonrec-chals" align="center">
	  在非递归挑战中，溶剂II将增加U5-S系列的价格<br>
		<table>
			<tr>
				<TDChallenge v-if="player.challenges[1][0].gte(1) || player.nonrecu.studies_bought.includes(5)" :layer="1" :chid="0" ></TDChallenge>
			</tr>
		</table>

	</div>
</template>

<style lang="scss" scoped>
.main {
	margin-top: 10px;
}
</style>
