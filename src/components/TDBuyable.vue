<script setup lang="ts">
import { BUYABLES } from '@/core/mechanic';
import { player } from '@/core/save';
const props = defineProps<{
	bylid: keyof typeof player.buyables;
}>();
// code...
</script>

<template>
	<td v-if="BUYABLES.lock(bylid).show">
		<div
			class="upgrade"
			@mousedown="BUYABLES.buy(bylid)"
			v-html="BUYABLES.singleHTML(bylid)"
		></div>
	</td>
</template>

<style scoped>
/* code... */
</style>
