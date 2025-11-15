<script setup lang="ts">
import TDChallenge from '@/components/group-2/TDChallenge.vue';
import { player } from '@/core/save';
</script>

<template>
	<div class="main nonrec-chals" align="center">
		<span v-html="$t('nonrec.chaltip')"></span>
		<table>
			<tbody>
				<tr style="height: 600px">
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
				<tr>
					<TDChallenge
						v-if="
							player.challenges[1][4].gte(1) ||
							player.nonrecu.studies_bought.includes(24)
						"
						:layer="1"
						:chid="4"
					></TDChallenge>
					<TDChallenge
						v-if="
							player.challenges[1][5].gte(1) ||
							player.nonrecu.studies_bought.includes(25)
						"
						:layer="1"
						:chid="5"
					></TDChallenge>
					<TDChallenge
						v-if="
							player.challenges[1][6].gte(1) ||
							player.nonrecu.studies_bought.includes(28)
						"
						:layer="1"
						:chid="6"
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

tr {
	height: 400px;
}
</style>
