<script setup lang="ts">
import { currencyName, getCurrency } from '@/core/currencies';
import { feature } from '@/core/global';
import { buyables, BUYABLES } from '@/core/mechanic';
import { player } from '@/core/save';
import { format, formatWhole } from '@/utils/format';
import { OrdinalUtils } from '@/utils/ordinal';
import Decimal from 'break_eternity.js';
import { useI18n } from 'vue-i18n';
const $t = useI18n().t;
const props = defineProps<{
	bylid: keyof typeof player.buyables;
}>();
// code...
const id = props.bylid;
function useClass() {
	let useclass = 'upgrade_buttonbig';
	if (buyables[id].capped(player.buyables[id])) useclass = 'upgrade_buttonbig_complete';
	else if (
		!BUYABLES.lock(id).unlocked ||
		!buyables[id].canAfford() ||
		!buyables[id].cost(player.buyables[id]).lte(getCurrency(buyables[id].currency))
	)
		useclass = 'upgrade_buttonbig_unable';
	return useclass;
}
const curbyl = buyables[props.bylid];
function moreAmountString() {
	const a = buyables[id].more();
	if (a.gte(1)) return '+' + formatWhole(a);
	return '';
}
const req = curbyl.requirements();

let canBuy = new Decimal(0);
if (buyables[id].canBuyMax != null && buyables[id].canBuyMax()) {
	if (buyables[id].canBuy != null) canBuy = buyables[id].canBuy(player.buyables[id]);
}
</script>

<template>
	<td v-if="BUYABLES.lock(bylid).show">
		<div class="upgrade tooltipBox" @mousedown="BUYABLES.buy(bylid)">
			<div :class="useClass()">
				<span style="font-weight: bold">
					{{ curbyl.name }}({{ formatWhole(player.buyables[id])
					}}{{ moreAmountString() }})<br
				/></span>
				<template v-if="!BUYABLES.lock(id).unlocked && player.buyables[id].eq(0)">
					{{ $t('upg.locked') }}<br />
					<template v-for="sreq in Object.entries(req)">
						<template v-if="sreq[0] != '0'"> ,<br /> </template>
						<span
							style="font-weight: bold"
							:style="{ color: sreq[1].reachedReq() ? 'green' : 'red' }"
						>
							{{ sreq[1].reqDescription($t) }}
							<span v-if="!sreq[1].reachedReq() && sreq[1].progress">
								({{ sreq[1].progress().join('/') }}) </span
							><br />
						</span>
					</template>
				</template>
				<template v-else>
					<!-- (Logarithm.logarithm.upgrades_in_dilated.includes(id)&&curupg.dilated) ? curupg.dilated :  -->
					<span v-html="curbyl.description"></span><br />
					效果：<span
						v-html="curbyl.effectDescription(curbyl.effect(player.buyables[id]))"
					></span
					><br />
				</template>
				价格：<span
					v-if="curbyl.ordinal"
					v-html="
						OrdinalUtils.numberToOrdinal(
							buyables[id].cost(player.buyables[id].add(canBuy.sub(1).max(0))),
							feature.Ordinal.base(),
						) + currencyName(curbyl.currency)
					"
				/><span
					v-else
					v-html="
						format(buyables[id].cost(player.buyables[id].add(canBuy.sub(1).max(0)))) +
						currencyName(curbyl.currency)
					"
				/>
				<br />
			</div>
		</div>
	</td>
</template>

<style scoped>
/* code... */
</style>
