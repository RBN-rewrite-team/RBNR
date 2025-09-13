<script setup lang="ts">
import { feature } from '@/core/global';
import { BUYABLES } from '@/core/mechanic';
import { player } from '@/core/save';
import { format, formatWhole } from '@/utils/format';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
import { getI18NData } from '@/core/i18n-data';
</script>

<template>
	<div class="main">
		<div class="clickable">
			<div
				class="clickable_button"
				style="width: 240px"
				@mousedown="feature.SUCCESSOR.success()"
				v-if="!player.upgrades['25']"
				v-html="
					getI18NData('successor_button')(
						format(feature.SUCCESSOR.successorBulk()) +
							(feature.SUCCESSOR.successorPow().gt(1)
								? `<sup>${format(feature.SUCCESSOR.successorPow())}</sup>`
								: ''),
						feature.SUCCESSOR.autoSuccessPerSecond(),
					)
				"
			></div>
			<div class="clickable_button" @mousedown="feature.SUCCESSOR.success()" v-else>
				加法+{{ formatWhole(feature.SUCCESSOR.successorBulk())
				}}<sup v-if="feature.SUCCESSOR.successorPow().gt(1)">{{
					format(feature.SUCCESSOR.successorPow())
				}}</sup
				><span v-if="BUYABLES.lock('11').unlocked"
					>(自动{{ formatWhole(feature.SUCCESSOR.autoSuccessPerSecond()) }}/s)</span
				>
			</div>
		</div>
		<table align="center">
			<TDUpgrade upgid="11" />
			<TDUpgrade upgid="12" />
			<TDUpgrade upgid="13" />
			<TDBuyable bylid="11" />
		</table>
	</div>
</template>

<style scoped>
/* code... */
</style>
