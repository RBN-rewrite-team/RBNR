<script lang="ts" setup>
import TDBuyable from '@/components/group-2/TDBuyable.vue';
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
import { upgrades, buyables } from '@/core/mechanic';
import { isDeveloper } from '@/core/save/testing';
import { ref } from 'vue';
const testtiers = ref([0, 0, 0]);
const input1 = ref('11');
const input2 = ref('11');
</script>

<template>
	<div class="main" v-if="isDeveloper()">
		<h2>这才是真正的开发者模式</h2>
		<div>
			<p>测试: 升级</p>
			<input v-model="input1" />
			<input v-model="input2" />
			<table align="center">
				<tbody>
					<tr>
						<template v-if="input1 in upgrades">
							<TDUpgrade :upgid="input1 as keyof typeof upgrades" />
						</template>
						<template v-if="input2 in buyables">
							<TDBuyable :bylid="input2 as keyof typeof buyables" />
						</template>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
