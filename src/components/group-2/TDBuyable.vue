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
function costHTML() {
	/**
	 * <span
					v-if="curbyl.ordinal"
					v-html="
						OrdinalUtils.numberToOrdinal(
							buyables[id].cost(player.buyables[id].add(canBuy.sub(1).max(0))),
							feature.Ordinal.base(),
						) + currencyName(curbyl.currency, $t)
					"
				/><span
					v-else
					v-html="
						format(buyables[id].cost(player.buyables[id].add(canBuy.sub(1).max(0)))) +
						currencyName(curbyl.currency, $t)
					"
				/>
	 */

	return $t('upg.cost', {
		cost: curbyl.ordinal
			? OrdinalUtils.numberToOrdinal(
					curbyl.cost(player.buyables[id].add(canBuy.sub(1).max(0))),
					feature.Ordinal.base(),
				)
			: format(curbyl.cost(player.buyables[id].add(canBuy.sub(1).max(0)))),
		currency: currencyName(curbyl.currency, $t),
	});
}
</script>

<template>
	<td v-if="BUYABLES.lock(bylid).show">
		<div class="upgrade tooltipBox" @mousedown="BUYABLES.buy(bylid)">
			<div :class="useClass()">
				<span style="font-weight: bold">
					{{
						curbyl.name == 'B0-114514'
							? $t('upgs.byl.' + bylid + '.name')
							: curbyl.name
					}}({{ formatWhole(player.buyables[id]) }}{{ moreAmountString() }})<br
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
					<span v-html="$t('upgs.byl.' + id)"></span><br />
					<span
						v-html="
							$t('upg.effect.byl', {
								effect: curbyl.effectDescription(
									curbyl.effect(player.buyables[id]),
									$t,
								),
								next: curbyl.effectDescription(
									curbyl.effect(player.buyables[id]).add(1),
									$t,
								),
							})
						"
					></span>
					<!--
					if (
				player.singularity.stage < 1 &&
				player.exponention.logarithm.buyables_in_dilated.includes(id) &&
				buyables[id].effectDilated !== Buyable.prototype.effectDilated
			)
				str +=
					'膨胀效果：' +
					buyables[id].effectDilated(player.buyables[id])[1] +
					'&nbsp;→' +
					buyables[id].effectDilated(player.buyables[id].add(canBuy.max(1)))[1] +
					'<br>';
					-->
					<br />
				</template>
				<span v-html="costHTML()"></span>
				<br />
			</div>
		</div>
	</td>
</template>

<style scoped>
/* code... */
</style>
