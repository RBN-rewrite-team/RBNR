<script setup lang="ts">
import { feature, player } from '@/core/global';
import { OrdinalUtils } from '@/utils/ordinal';
import { formatWhole } from '@/utils/format';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
</script>

<template>
    <div class="main">
	    <div style="transform: translateY(60px)">
			<div align="center">
			    当前你的序数底数为<span style="color: rgb(255, 63, 63)" v-html="formatWhole(feature.Ordinal.base())" />，它决定了达到基本列第几项时进位。<br>
				<table>
					<tr>
						<TDUpgrade upgid="51" />
						<TDUpgrade upgid="52" />
						<TDUpgrade upgid="53" />
						<TDUpgrade upgid="54" />
					</tr>
					<tr>
						<TDUpgrade upgid="55" />
						<TDUpgrade upgid="56" />
						<TDUpgrade upgid="57" />
						<TDUpgrade upgid="58" />
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>