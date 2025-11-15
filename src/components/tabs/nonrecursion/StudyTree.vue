<script setup lang="ts">
import { formatWhole } from '@/utils/format';
import {
	initConnectors,
	studyRefs,
	updateAllConnectors,
	registerStudyRef,
	addTheories,
	canBuyTheories,
	resetTheories,
	theoriesCost,
} from '@/core/nonrecu/studies';
import SingleStudy from './SingleStudy.vue';
import { onMounted, watch, ref } from 'vue';
import { getTotalTheories } from '@/core/nonrecu/total-theories';
import { Currencies, currencyName, getCurrency } from '@/core/currencies';
import { player } from '@/core/global';
import BlankStudy from './BlankStudy.vue';
import { useI18n } from 'vue-i18n';
onMounted(() => {
	updateAllConnectors();
	window.addEventListener('resize', updateAllConnectors);
});

watch(
	studyRefs,
	() => {
		updateAllConnectors();
	},
	{ deep: true },
);

const connectorsRef = ref<HTMLElement | null>(null);

onMounted(() => initConnectors(connectorsRef));

const $t = useI18n().t;
function nrtamount() {
	return $t('nonrec.youhavenrt', {
		t: `<b style="color: #c98300; font-size: 30px">${formatWhole(getTotalTheories())}</b>`,
		b: formatWhole(getCurrency(Currencies.NRT)),
	});
}
</script>

<template>
	<div style="position: sticky; top: 0; background-color: var(--background-color); z-index: 3">
		<p v-html="nrtamount()"></p>
		<div class="studies_row">
			<div class="study">
				<div class="study-name">NRT1</div>
				<div
					class="study-desc"
					:class="canBuyTheories(0) ? 'study-buyable' : ''"
					@click="addTheories(0)"
				>
					<div>{{ $t('nonrec.nrtbuy') }}</div>
					<div>
						{{
							$t('upg.cost', {
								cost: formatWhole(theoriesCost(0)),
								currency: $t('currency.hydra'),
							})
						}}
					</div>
				</div>
			</div>
			<div class="study">
				<div class="study-name">NRT2</div>
				<div
					class="study-desc"
					:class="canBuyTheories(1) ? 'study-buyable' : ''"
					@click="addTheories(1)"
				>
					<div>{{ $t('nonrec.nrtbuy') }}</div>
					<div>
						{{
							$t('upg.cost', {
								cost: formatWhole(theoriesCost(1)),
								currency: $t('currency.solution'),
							})
						}}
					</div>
				</div>
			</div>
			<div class="study">
				<div class="study-name">NRT3</div>
				<div
					class="study-desc"
					:class="canBuyTheories(2) ? 'study-buyable' : ''"
					@click="addTheories(2)"
				>
					<div>{{ $t('nonrec.nrtbuy') }}</div>
					<div>
						{{
							$t('upg.cost', {
								cost: formatWhole(theoriesCost(2)),
								currency: $t('currency.nonrec'),
							})
						}}
					</div>
				</div>
			</div>
		</div>
		<div align="center">
			<button class="clickable_button" @click="resetTheories">
				{{ $t('nonrec.respec') }}
			</button>
		</div>
	</div>
	<div style="overflow-x: auto">
		<div class="studies-container">
			<div class="studies-tree">
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(0, el)"
						:study_id="0"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(1, el)"
						:study_id="1"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(2, el)"
						:study_id="2"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(3, el)"
						:study_id="3"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div class="studies_row">
					<BlankStudy />
					<SingleStudy
						:ref="(el) => registerStudyRef(4, el)"
						:study_id="4"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(5, el)"
						:study_id="5"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div class="studies_row">
					<BlankStudy />
					<SingleStudy
						:ref="(el) => registerStudyRef(6, el)"
						:study_id="6"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(7, el)"
						:study_id="7"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(11, el)"
						:study_id="11"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(8, el)"
						:study_id="8"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(9, el)"
						:study_id="9"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(10, el)"
						:study_id="10"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(12, el)"
						:study_id="12"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div class="studies_row">
					<BlankStudy />
					<SingleStudy
						:ref="(el) => registerStudyRef(13, el)"
						:study_id="13"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(14, el)"
						:study_id="14"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(15, el)"
						:study_id="15"
						@update:study="updateAllConnectors"
					/>
					<BlankStudy />
				</div>
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(29, el)"
						:study_id="29"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(16, el)"
						:study_id="16"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(17, el)"
						:study_id="17"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(18, el)"
						:study_id="18"
						@update:study="updateAllConnectors"
					/>
					<BlankStudy />
				</div>
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(19, el)"
						:study_id="19"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(20, el)"
						:study_id="20"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(21, el)"
						:study_id="21"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(22, el)"
						:study_id="22"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(23, el)"
						:study_id="23"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(24, el)"
						:study_id="24"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(25, el)"
						:study_id="25"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(27, el)"
						:study_id="27"
						@update:study="updateAllConnectors"
					/>
					<SingleStudy
						:ref="(el) => registerStudyRef(26, el)"
						:study_id="26"
						@update:study="updateAllConnectors"
					/>
					<BlankStudy
						v-if="player.retribution == 0 || player.options.ui.otherwise.blur == false"
					/>
					<div class="study" v-else @click="player.achievements.push(-7)">
						<div class="study-name">113</div>
						<div class="study-desc">
							<div>获得Never gonna give you up</div>
							<div>花费: Never gonna</div>
						</div>
					</div>
				</div>
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(28, el)"
						:study_id="28"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div class="studies_row">
					<SingleStudy
						:ref="(el) => registerStudyRef(30, el)"
						:study_id="30"
						@update:study="updateAllConnectors"
					/>
				</div>
				<div ref="connectorsRef" class="connectors-container"></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
