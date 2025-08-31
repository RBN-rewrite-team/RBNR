<script setup lang="ts">
import { CHALLENGE } from '@/core/challenge';
import { buyStudies, canBuyStudies, studies } from '@/core/minigame/skilltree';
import { player } from '@/core/save';
import { formatWhole } from '@/utils/format';

const props = defineProps<{
	study_id: number; // keyof typeof studies
}>();

const study = studies[props.study_id];

const useClass = () => {
	if (!study.isChallenge && player.minigame.skilltree_bought.includes(props.study_id)) {
		return 'study-actived';
	}
	if (canBuyStudies(props.study_id)) {
		return 'study-buyable';
	}
};
function challengeButton(chid: number) {
	if (!CHALLENGE.inChallenge(1, chid)) CHALLENGE.enterChallenge(1, chid);
	else CHALLENGE.exitChallenge();
}
const clickStudy = (studyid: number) => {
	if (player.minigame.skilltree_bought.includes(studyid) && study.isChallenge) {
		challengeButton(study.chalID);
	} else {
		buyStudies(studyid);
	}
};
</script>

<template>
	<div class="study" v-if="study.show()">
		<div class="study-name">{{ study.id }}</div>
		<div class="study-desc" @click="clickStudy(props.study_id)" :class="useClass()">
			<div v-html="study.description"></div>
			<div>花费: {{ formatWhole(study.cost) }} 技能点</div>
		</div>
	</div>
</template>
