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

const props = defineProps<{
	upgid: keyof typeof upgrades;
}>();
const id = props.upgid as keyof typeof upgrades;
// code...
function useClass() {
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
}
const curupg = upgrades[id];
const permanent = curupg.keep != null && curupg.keep();
const req = curupg.requirements();

function actualCost(curupg: Upgrade) {
	let cost = typeof curupg.cost === 'function' ? curupg.cost() : curupg.cost;
	if (
		player.hydra.dilute.inDilute &&
		id.startsWith('6') &&
		(!id.endsWith('S') || player.challengein[0] == 1)
	) {
		cost = cost.pow(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
	}
	return cost;
}
</script>

<template>
	<td v-if="UPGRADES.lock(upgid).show">
		<div class="upgrade tooltipBox" @mousedown="UPGRADES.buy(upgid)">
			<div :class="useClass()">
				<span style="font-weight: bold"> {{ curupg.name ?? 'U' + id }} </span><br />
				<template v-if="!UPGRADES.lock(id).unlocked && !permanent && !player.upgrades[id]">
					暂未解锁<br />
					<template v-for="sreq in Object.entries(req)">
						<template v-if="sreq[0] != '0'"> ,<br /> </template>
						<span
							style="font-weight: bold"
							:style="{ color: sreq[1].reachedReq() ? 'green' : 'red' }"
						>
							{{ sreq[1].reqDescription() }}
							<span v-if="!sreq[1].reachedReq() && sreq[1].progress">
								({{ sreq[1].progress().join('/') }})
							</span>
						</span>
					</template>
					<br />
				</template>
				<template v-else>
					<!-- (Logarithm.logarithm.upgrades_in_dilated.includes(id)&&curupg.dilated) ? curupg.dilated :  -->
					<span
						v-html="
							typeof curupg.description === 'function'
								? curupg.description()
								: curupg.description
						"
					></span
					><br />
					<template v-if="UpgradeWithEffect.isWithEffect<any>(curupg)">
						效果：<span v-html="curupg.effectDescription(curupg.effect())"></span><br />
					</template>
				</template>
				<template v-if="!permanent">
					价格：<span
						v-if="curupg.ordinal"
						v-html="
							OrdinalUtils.numberToOrdinal(
								actualCost(curupg),
								feature.Ordinal.base(),
							) + currencyName(curupg.currency)
						"
					/><span
						v-else
						v-html="format(actualCost(curupg)) + currencyName(curupg.currency)"
					/>
					<br />
				</template>
				<span v-else style="color: green; font-weight: bold"> 保持持有<br /> </span>
				<span> </span>
			</div>
			<span class="tooltip">
				自动机使用ID: {{ props.upgid }}
				<template v-if="curupg.ordinal && useClass() == 'upgrade_buttonbig_unable'"
					><br />购买升级需要{{
						countdown(
							typeof curupg.cost === 'function' ? curupg.cost() : curupg.cost,
							player.ordinal.number,
							ORDINAL.ordinalPerSecond(),
							ORDINAL.isConstantSpeed(),
							ORDINAL.speedDeri(),
						)
					}}</template
				>
			</span>
		</div>
	</td>
</template>

<style scoped>
/* code... */
</style>
