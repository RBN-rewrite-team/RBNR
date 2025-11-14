<script setup lang="ts">
import { feature } from '@/core/global';
import { BUYABLES } from '@/core/mechanic';
import { player } from '@/core/save';
import { format, formatWhole } from '@/utils/format';
import TDUpgrade from '../../group-2/TDUpgrade.vue';
import TDBuyable from '../../group-2/TDBuyable.vue';
import PrimaryButton from '@/components/ui/PrimaryButton';
</script>

<template>
	<div class="main">
		<div class="clickable">
			<PrimaryButton
				@click="feature.SUCCESSOR.success()"
				v-if="!player.upgrades['25']"
				style="width: 240px"
				>后继x{{ format(feature.SUCCESSOR.successorBulk())
				}}<sup v-if="feature.SUCCESSOR.successorPow().gt(1)">{{
					format(feature.SUCCESSOR.successorPow())
				}}</sup
				><span v-if="BUYABLES.lock('11').unlocked"
					>(自动{{ formatWhole(feature.SUCCESSOR.autoSuccessPerSecond()) }}/s)</span
				>
			</PrimaryButton>
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
