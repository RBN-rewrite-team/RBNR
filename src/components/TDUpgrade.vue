<script setup lang="ts">
import { buyables, upgrades, UPGRADES } from '@/core/mechanic';
import { player } from '@/core/save';
import { format } from '@/utils/format';
const props = defineProps<{
	upgid: keyof typeof player.upgrades;
}>();
const id = props.upgid as keyof typeof player.upgrades;
// code...
function useClass() {
	let useclass = 'upgrade_buttonbig';
	if (id.startsWith('4') && id.endsWith('q')) useclass = 'upgrade_buttonsmall';
	if (player.upgrades[id]) useclass += '_complete';
	else if (!UPGRADES.lock(id).unlocked || !upgrades[id].canAfford()) useclass += '_unable';
	return useclass;
}
const permanent = upgrades[id].keep != null && upgrades[id].keep();
const req = upgrades[id].requirement;
</script>

<template>
	<td v-if="UPGRADES.lock(upgid).show">
		<div class="upgrade" @mousedown="UPGRADES.buy(upgid)">
			<div :class="useClass()">
				<span style="font-weight: bold">
					{{ upgrades[id].displayName ?? 'U' + id }} </span
				><br />
				<template v-if="!UPGRADES.lock(id).unlocked && !permanent && !player.upgrades[id]">
					暂未解锁<br />
					<template v-for="sreq in Object.entries(req)">
						<template v-if="sreq[0] != '0'"> ,<br /> </template>
						<span
							style="font-weight: bold"
							:style="{ color: sreq[1][1]() ? 'green' : 'red' }"
						>
							{{ sreq[1][0] }}
							<span v-if="!sreq[1][1]() && sreq[1][2]">
								({{ sreq[1][2][0] }}/{{ sreq[1][2][1] }})
							</span>
						</span>
					</template>
					<br />
				</template>
				<template v-else>
					<span v-html="upgrades[id].description"></span><br />
					<template v-if="upgrades[id].effect">
						效果：<span v-html="upgrades[id].effD?.()"></span><br />
					</template>
				</template>
				<template v-if="!permanent">
					价格：{{ format(upgrades[id].cost) + upgrades[id].currency }} <br />
				</template>
				<span v-else style="color: green; font-weight: bold"> 保持持有<br /> </span>
			</div>
		</div>
	</td>
</template>

<style scoped>
/* code... */
</style>
