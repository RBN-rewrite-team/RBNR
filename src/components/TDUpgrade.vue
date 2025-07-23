<script setup lang="ts">
import { UPGRADES } from '@/core/mechanic';
import { player } from '@/core/save';
const props = defineProps<{
	upgid: keyof typeof player.upgrades;
}>();
function curupg(){
  return 'upgrade'; 
}
</script>

<template>
	<td v-if="UPGRADES.lock(upgid).show">
		<div
			class="upgrade"
			@mousedown="UPGRADES.buy(upgid)"
			v-html="UPGRADES.singleHTML(upgid)"
		></div>
	</td>
</template>

<style scoped>
</style>
