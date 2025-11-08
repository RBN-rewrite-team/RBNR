<script setup lang="ts">
import { CHALLENGE } from '@/core/challenge';
import { player } from '@/core/save';
import { format, formatWhole } from '@/utils/format';
const props = defineProps<{
	layer: number;
	chid: number;
}>();

const chal = CHALLENGE.challenges[props.layer][props.chid];

function challengeButton() {
	if (!CHALLENGE.inChallenge(props.layer, props.chid))
		CHALLENGE.enterChallenge(props.layer, props.chid);
	else CHALLENGE.exitChallenge(props.layer, props.chid);
}

function chalClass() {
	return {
		in: CHALLENGE.inChallenge(props.layer, props.chid),
	};
}
</script>

<template>
	<td>
		<div class="challenge" :class="chalClass()" @click="challengeButton">
			<p>
				<b v-html="$t(`chal.${props.layer}.${props.chid}`)"></b>({{
					format(CHALLENGE.amountChallenge(layer, chid))
				}})
			</p>
			<p v-html="$t(`chal.${props.layer}.${props.chid}.description`)"></p>
			<div v-if="chal.effect && chal.effD">
				<p
					style="color: #009900"
					v-html="
						$t('upg.effect', {
							effect: $t(`chal.${props.layer}.${props.chid}.effect`, {
								effect: format(chal.effect(player.challenges[layer][chid])),
							}),
						})
					"
				></p>
			</div>
			<p>
				<b>{{ $t(`chal.tip`) }}</b>
			</p>
		</div>
	</td>
</template>

<style scoped>
p {
	margin: 0;
}

.in {
	border: 2px solid #808000;
	box-shadow: #ee0 1px 1px 2px 1px;
}
</style>
