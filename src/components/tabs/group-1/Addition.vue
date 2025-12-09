<script setup lang="ts">
import { feature } from '@/core/global';
import { player } from '@/core/save';
import Upgrades from '@/components/upg/Upgrades';
import PrimaryButton from '@/components/ui/PrimaryButton';

// code...
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			<Upgrades
				:upgids="[
					['u21', 'u22', 'u23', 'u24'],
					['b21', 'u25', 'u26'],
				]"
			/>
			<br />
			<div align="center" v-if="player.upgrades[31]" style="transform: translateY(65px)">
				{{ $t('mul.keep') }}<br />
				<template v-for="c in [2, 3, 4, 5]">
					<PrimaryButton
						@click="feature.ADDITION.setUPGc1(c as 2 | 3 | 4 | 5)"
						:style="{
							display: 'inline-block',
						}"
					>
						{{ c }}
					</PrimaryButton> </template
				><br />
				<template v-if="player.upgrades['400q']">
					<template v-for="c in [2, 3, 4, 5]">
						<PrimaryButton
							@click="feature.ADDITION.setUPGc2(c as 2 | 3 | 4 | 5)"
							:style="{
								display: 'inline-block',
							}"
						>
							{{ c }}
						</PrimaryButton>
					</template>
				</template>
			</div>
		</div>
	</div>
</template>
