<script setup lang="ts">
import { player } from '@/core/save';

defineProps<{
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
			{{ text }}
		</div>
	</div>
</template>
