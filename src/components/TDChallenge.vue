<script setup lang="ts">
import { CHALLENGE } from '@/core/challenge';
import { BUYABLES } from '@/core/mechanic';
import { player } from '@/core/save';
const props = defineProps<{
	layer: number;
	chid: number;
}>();

const chal = CHALLENGE.challenges[props.layer][props.chid];

function challengeButton() {
	if (!CHALLENGE.inChallenge(props.layer, props.chid))
		CHALLENGE.enterChallenge(props.layer, props.chid);
	else CHALLENGE.exitChallenge();
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
			<p><b v-html="chal.name"></b></p>
			<p v-html="chal.descEasy"></p>
			<div v-if="chal.effect && chal.effD">
				<p
					style="color: #009900"
					v-html="'效果: ' + chal.effD(chal.effect(player.challenges[layer][chid]))"
				></p>
			</div>
			<p><b>点击以开始挑战|退出挑战</b></p>
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
