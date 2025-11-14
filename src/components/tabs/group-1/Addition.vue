<script setup lang="ts">
import { feature } from '@/core/global';
import { player } from '@/core/save';
import TDUpgrade from '../../group-2/TDUpgrade.vue';
import TDBuyable from '../../group-2/TDBuyable.vue';
import PrimaryButton from '@/components/ui/PrimaryButton';

// code...
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			<table align="center">
				<tbody>
					<tr>
						<TDUpgrade upgid="21" />
						<TDUpgrade upgid="22" />
						<TDUpgrade upgid="23" />
						<TDUpgrade upgid="24" />
					</tr>
					<tr>
						<TDBuyable bylid="21" />
						<TDUpgrade upgid="25" />
						<TDUpgrade upgid="26" />
					</tr>
				</tbody>
			</table>
			<br />
			<div align="center" v-if="player.upgrades[31]" style="transform: translateY(65px)">
				{{ $t('mul.keep') }}<br />
				<template v-for="c in [2, 3, 4, 5]">
					<PrimaryButton
						@click="feature.ADDITION.setUPGc1(c as 2 | 3 | 4 | 5)"
						style="display: inline-block"
					>
						{{ c }}
					</PrimaryButton> </template
				><br />
				<template v-if="player.upgrades['400q']">
					<template v-for="c in [2, 3, 4, 5]">
						<PrimaryButton
							@click="feature.ADDITION.setUPGc2(c as 2 | 3 | 4 | 5)"
							style="display: inline-block"
						>
							{{ c }}
						</PrimaryButton>
					</template>
				</template>
			</div>
		</div>
	</div>
	<!-- code... -->
</template>

<style scoped>
/* code... */
</style>
