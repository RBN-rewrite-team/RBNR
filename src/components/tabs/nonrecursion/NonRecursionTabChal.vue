<script setup lang="ts">
import TDChallenge from '@/components/TDChallenge.vue';
import { player } from '@/core/save';
</script>

<template>
	<div class="main nonrec-chals" align="center">
		在非递归挑战中，溶剂II将增加U5-S系列的价格<br />
		注意：所有非递归挑战至多完成5次。
		<table>
			<tbody>
				<tr>
					<TDChallenge
						v-if="
							player.challenges[1][0].gte(1) ||
							player.nonrecu.studies_bought.includes(5)
						"
						:layer="1"
						:chid="0"
					></TDChallenge>
					<TDChallenge
						v-if="
							player.challenges[1][1].gte(1) ||
							player.nonrecu.studies_bought.includes(11)
						"
						:layer="1"
						:chid="1"
					></TDChallenge>
					<TDChallenge
						v-if="
							player.challenges[1][2].gte(1) ||
							player.nonrecu.studies_bought.includes(12)
						"
						:layer="1"
						:chid="2"
					></TDChallenge>
					<TDChallenge
						v-if="
							player.challenges[1][3].gte(1) ||
							player.nonrecu.studies_bought.includes(23)
						"
						:layer="1"
						:chid="3"
					></TDChallenge>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style lang="scss" scoped>
.main {
	margin-top: 10px;
}
</style>
