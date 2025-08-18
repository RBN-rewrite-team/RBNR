<script lang="ts" setup>
import { ORDINAL_BOOSTER } from '@/core/ordinal/ordinal-booster';
import TDBuyable from '../TDBuyable.vue';
import TDUpgrade from '../TDUpgrade.vue';
import { format, formatGain } from '@/utils/format';
</script>

<template>
	<div class="main">
		<p>
			加速器倍率为×{{ format(ORDINAL_BOOSTER.boosterEffect()) }}(<span
				v-html="formatGain(ORDINAL_BOOSTER.boosterEffect(), ORDINAL_BOOSTER.boosterGrow())"
			/>,上限{{ format(ORDINAL_BOOSTER.boosterCap()) }})
		</p>
		<table align="center">
			<tbody>
				<tr>
					<TDBuyable bylid="51A" />
					<TDBuyable bylid="52A" />
					<TDBuyable bylid="53A" />
					<TDUpgrade upgid="51A" />
				</tr>
			</tbody>
		</table>
	</div>
</template>
