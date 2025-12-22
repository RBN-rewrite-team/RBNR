<template>
	<img
		src="/baixie.png"
		style="aspect-ratio: 1/1; height: 1em; position: relative; top: 3px"
		@click="clickBaixie()"
	/>
</template>
<script setup lang="ts">
import { player } from '@/core/save';
import { addNotify } from '../notify';

function clickBaixie() {
	if (player.options.ui.otherwise['color_inversion']) {
		player.achievements.push(-6);
	}
	addNotify('Baixie!!!');
}
</script>
