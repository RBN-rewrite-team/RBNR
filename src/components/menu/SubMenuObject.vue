<script setup lang="ts">
import { player } from '@/core/save';
import Baixie from '../group-2/Baixie.vue';

const props = defineProps<{
	tab: number;
	text: string;
}>();
</script>

<template>
	<div>
		<div
			class="menu2"
			:class="{ focus: player.currentTab == tab }"
			@click="player.currentTab = tab"
		>
			{{ text }}<Baixie />
		</div>
	</div>
</template>
