<script setup lang="ts">
import { currencyName } from '@/core/currencies';
import { Logarithm } from '@/core/exponention/logarithm';
import { upgrades, UPGRADES } from '@/core/mechanic';
import { player } from '@/core/save';
import { feature } from '@/core/global';
import { Upgrade } from '@/core/upgrade';
import { OrdinalUtils } from '@/utils/ordinal';
import { UpgradeWithEffect } from '@/core/upgrade';
import { format } from '@/utils/format';
import { countdown } from '@/core/countdown-display';
import { ORDINAL } from '@/core/ordinal/ordinal';
import { Dilute } from '@/core/hydra/dilute';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { wordShift } from '@/core/word-shift';
import { i18n } from '@/utils/i18n';
import { useUpdate } from '@/lib/useUpdate';
import { costHTML, getUpgradeDescription } from './displays';
const $t = useI18n().t;

const props = defineProps<{
	upgid: keyof typeof upgrades;
}>();
const id = props.upgid as keyof typeof upgrades;
// code...
const useClass = useUpdate(function () {
	let useclass = 'upgrade_buttonbig';
	if (id.toString().startsWith('4') && id.toString().endsWith('q'))
		useclass = 'upgrade_buttonsmall';
	if (player.upgrades[id]) useclass += '_complete';
	else if (!UPGRADES.lock(id).unlocked || !upgrades[id].canAfford()) useclass += '_unable';

	if (
		player.singularity.stage < 1 &&
		player.upgrades[id] &&
		Logarithm.logarithm.upgrades_in_dilated.includes(id)
	) {
		useclass += ' upgrade_dilated';
	}
	return useclass;
});
const curupg = upgrades[id];
const permanent = curupg.keep != null && curupg.keep();
const req = curupg.requirements();

const description = computed(() => getUpgradeDescription(props.upgid, $t));
</script>

<template>
	<td v-if="UPGRADES.lock(upgid).show">
		<div class="upgrade tooltipBox" @mousedown="UPGRADES.buy(upgid)">
			<div :class="useClass">
				<span style="font-weight: bold">
					{{
						curupg.name == 'U0-114514' ? $t('upgs.' + id + '.name') : curupg.name
					}} </span
				><br />
				<template v-if="!UPGRADES.lock(id).unlocked && !permanent && !player.upgrades[id]">
					{{ $t('upg.locked') }}<br />
					<template v-for="sreq in Object.entries(req)">
						<template v-if="sreq[0] != '0'"> ,<br /> </template>
						<span
							style="font-weight: bold"
							:style="{ color: sreq[1].reachedReq() ? 'green' : 'red' }"
						>
							{{ sreq[1].reqDescription($t) }}
							<span v-if="!sreq[1].reachedReq() && sreq[1].progress">
								({{ sreq[1].progress().join('/') }})
							</span>
						</span>
					</template>
					<br />
				</template>
				<template v-else>
					<!-- (Logarithm.logarithm.upgrades_in_dilated.includes(id)&&curupg.dilated) ? curupg.dilated :  -->
					<span v-html="description"></span><br />
					<template v-if="UpgradeWithEffect.isWithEffect<any>(curupg)">
						<div
							v-html="
								$t('upg.effect', {
									effect: curupg.effectDescription(curupg.effect()),
								})
							"
						></div>
					</template>
				</template>
				<div class="cost-bottom-1">
					<div class="cost-bottom">
						<div v-if="!permanent" v-html="costHTML(props.upgid, $t)"></div>
						<span v-else style="color: green; font-weight: bold">
							{{ $t('upg.keep') }}<br />
						</span>
					</div>
				</div>
			</div>
			<span class="tooltip" v-if="player.timeshard.unlAuto">
				{{
					$t('upg.automatoruseid', {
						id: props.upgid,
					})
				}}
			</span>
		</div>
	</td>
</template>

<style scoped>
/* code... */
</style>
