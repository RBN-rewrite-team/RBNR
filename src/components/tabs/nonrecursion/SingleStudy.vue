<script setup lang="ts">
import { CHALLENGE } from '@/core/challenge';
import { Currencies, currencyName, getCurrency } from '@/core/currencies';
import { buyStudies, canBuyStudies, studies } from '@/core/nonrecu/studies';
import { player } from '@/core/save';
import { formatWhole } from '@/utils/format';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	study_id: number; // keyof typeof studies
}>();

const study = studies[props.study_id];

const useClass = () => {
	if (study.isChallenge && player.nonrecu.studies_bought.includes(props.study_id)) {
		let a = 'study-nrc';
		if (CHALLENGE.inChallenge(1, study.chalID)) {
			a += ' study-nrc-in';
		}
		return a;
	}
	if (!study.isChallenge && player.nonrecu.studies_bought.includes(props.study_id)) {
		return 'study-actived';
	}
	if (canBuyStudies(props.study_id)) {
		return 'study-buyable';
	}
};
function challengeButton(chid: number) {
	if (!CHALLENGE.inChallenge(1, chid)) CHALLENGE.enterChallenge(1, chid);
	else CHALLENGE.exitChallenge(1, chid);
}
const clickStudy = (studyid: number) => {
	if (player.nonrecu.studies_bought.includes(studyid) && study.isChallenge) {
		challengeButton(study.chalID);
	} else {
		buyStudies(studyid);
	}
};

const $t = useI18n().t;
function description() {
	let a = $t(`studies.nonrec.${props.study_id}`);
	if (study.isChallenge) {
		const b = a.split('\t');
		return b[0] + '<br />' + $t('chal.goal', { goal: b[1] });
	}
	return a;
}
</script>

<template>
	<div class="study tooltipBox" v-if="study.show()">
		<div class="study-name">{{ study.id }}</div>
		<div class="study-desc" @click="clickStudy(props.study_id)" :class="useClass()">
			<div v-html="description()"></div>
			<div style="display: none">{{ player.lastUpdated }}</div>
			<div>
				{{
					$t('upg.cost', {
						cost: formatWhole(study.cost),
						currency: currencyName(Currencies.NRT, $t),
					})
				}}
			</div>
		</div>
		<span class="tooltip">
			{{
				$t('upg.automatoruseid', {
					id: props.study_id,
				})
			}}</span
		>
	</div>
</template>
