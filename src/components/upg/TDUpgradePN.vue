<script setup lang="ts">
import { pnupgrades, PN_UPGRADES } from '@/core/PN-upg-byl';
import { player } from '@/core/save';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { currencyName, getCurrency } from '@/core/pn-currencies';
const $t = useI18n().t;

const props = defineProps<{
	upgid: keyof typeof pnupgrades;
	test?: string;
}>();
const description = computed(() => {
	// console.log(props.upgid, p);
	return $t(`upgs.${props.upgid}`);
});
const useClass = computed(function () {
	let useclass = 'upgrade_buttonbig';
	if (props.upgid.toString().startsWith('4') && props.upgid.toString().endsWith('q'))
		useclass = 'upgrade_buttonsmall';
	const a = pnupgrades[props.upgid];
	const cost = typeof a.cost === 'function' ? a.cost() : a.cost;
	if (player.pnupgrades[props.upgid]) useclass += '_complete';
	else if (
		!PN_UPGRADES.lock(props.upgid).unlocked ||
		!pnupgrades[props.upgid].canAfford() ||
		cost.gt(getCurrency(a.currency))
	)
		useclass += '_unable';
	return useclass;
});
const curupg = computed(() => pnupgrades[props.upgid]);
// const permanent = computed(() => curupg.value.keep != null && curupg.value.keep());
// const req = computed(() => curupg.value.requirements());
const name = computed(() =>
	curupg.value.name == 'U3-114514' ? $t('upgs.' + props.upgid + '.name') : curupg.value.name,
);
</script>

<template>
	<td v-if="PN_UPGRADES.lock(upgid).show">
		<div class="upgrade tooltipBox" @mousedown="PN_UPGRADES.buy(upgid)">
			<div :class="useClass">
				<span style="font-weight: bold"> {{ name }} </span><br />
				<template v-if="!PN_UPGRADES.lock(upgid).unlocked && !player.pnupgrades[upgid]">
					{{ $t('upg.locked') }}<br />
					<!-- <template v-for="sreq in Object.entries(req)">
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
					</template> -->
					<br />
				</template>
				<template v-else>
					<!-- (Logarithm.logarithm.pnupgrades_in_dilated.includes(id)&&curupg.dilated) ? curupg.dilated :  -->
					<span v-html="description"></span><br />
					<!-- <template v-if="UpgradeWithEffect.isWithEffect<any>(curupg)">
						<div
							v-html="
								$t('upg.effect', {
									effect: curupg.effectDescription(curupg.effect()),
								})
							"
						></div>
					</template> -->
				</template>
				<div class="cost-bottom-1">
					<div class="cost-bottom">
						{{
							$t('upg.cost', {
								cost:
									typeof curupg.cost == 'function' ? curupg.cost() : curupg.cost,
								currency: currencyName(curupg.currency, $t),
							})
						}}
						<!-- <div v-if="!permanent" v-html="costHTML(props.upgid, $t)"></div>
						<span v-else style="color: green; font-weight: bold">
							{{ $t('upg.keep') }}<br />
						</span> -->
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
